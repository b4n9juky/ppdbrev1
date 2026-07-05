<?php

namespace App\Http\Controllers;

use App\Models\AcademicYear;
use App\Models\AdmissionPath;
use App\Models\DocumentType;
use App\Models\MadrasahSetting;
use App\Models\Registration;
use App\Models\StudentBiodata;
use App\Models\StudentDocument;
use App\Models\Subject;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class StudentRegistrationController extends Controller
{
    public function show(): Response|RedirectResponse
    {
        $activeYear = AcademicYear::where('is_active', true)->first();

        $registration = null;
        if ($activeYear && auth()->user()) {
            $registration = Registration::with([
                'studentBiodata',
                'studentDocuments',
                'admissionPath',
                'subjectScores.subject',
            ])
                ->where('user_id', auth()->id())
                ->where('academic_year_id', $activeYear->id)
                ->first();
        }

        if ($registration && $registration->status !== 'draft') {
            return Redirect::route('student.dashboard');
        }

        $paths = AdmissionPath::where('is_active', true)->where('is_show', true)->get();
        $settings = MadrasahSetting::first();

        $subjects = $activeYear
            ? Subject::where('academic_year_id', $activeYear->id)->where('is_active', true)->orderBy('urut')->orderBy('name')->get()
            : collect();

        return Inertia::render('Student/Registration', [
            'activeYear' => $activeYear,
            'registration' => $registration,
            'paths' => $paths,
            'madrasah' => $settings,
            'documentTypes' => DocumentType::all(),
            'subjects' => $subjects,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $activeYear = AcademicYear::where('is_active', true)->first();

        if (! $activeYear) {
            return Redirect::back()->with('error', 'Pendaftaran belum dibuka.');
        }

        $registration = Registration::firstOrCreate(
            [
                'user_id' => auth()->id(),
                'academic_year_id' => $activeYear->id,
            ],
            [
                'admission_path_id' => $request->admission_path_id,
                'status' => 'draft',
            ]
        );

        if ($registration->status !== 'draft') {
            return Redirect::back()->with('error', 'Pendaftaran sudah difinalisasi.');
        }

        if ($request->has('admission_path_id')) {
            $registration->update(['admission_path_id' => $request->admission_path_id]);
        }

        return Redirect::route('student.registration.show')
            ->with('success', 'Jalur pendaftaran berhasil dipilih.');
    }

    public function updateBiodata(Request $request): RedirectResponse
    {
        $activeYear = AcademicYear::where('is_active', true)->first();
        $registration = $this->getActiveRegistration($activeYear);

        if (! $registration || $registration->status !== 'draft') {
            return Redirect::back()->with('error', 'Tidak dapat mengubah biodata.');
        }

        $validated = $request->validate([
            'nisn' => [
                'required', 
                'numeric', 
                'digits:10', 
                \Illuminate\Validation\Rule::unique('student_biodatas', 'nisn')->ignore($registration->id, 'registration_id')
            ],
            'full_name' => ['required', 'string', 'max:255'],
            'gender' => ['required', 'in:male,female'],
            'birth_place' => ['required', 'string', 'max:255'],
            'birth_date' => ['required', 'date'],
            'address' => ['required', 'string', 'max:1000'],
            'phone_number' => ['required', 'regex:/^[0-9]{11,13}$/'],
            'previous_school' => ['required', 'string', 'max:255'],
        ], [
            'nisn.numeric' => 'NISN harus berupa angka.',
            'nisn.digits' => 'NISN harus terdiri dari 10 digit.',
            'nisn.unique' => 'NISN ini sudah terdaftar. Silakan gunakan NISN yang lain.',
            'phone_number.required' => 'Nomor kontak / WhatsApp wajib diisi.',
            'phone_number.regex' => 'Nomor kontak / WhatsApp harus berupa angka dengan panjang antara 11 sampai 13 digit.',
        ]);

        StudentBiodata::updateOrCreate(
            ['registration_id' => $registration->id],
            $validated
        );

        return Redirect::route('student.registration.show')
            ->with('success', 'Biodata berhasil disimpan.');
    }

    public function uploadDocument(Request $request): RedirectResponse
    {
        $activeYear = AcademicYear::where('is_active', true)->first();
        $registration = $this->getActiveRegistration($activeYear);

        if (! $registration || $registration->status !== 'draft') {
            return Redirect::back()->with('error', 'Tidak dapat mengunggah dokumen.');
        }

        $validated = $request->validate([
            'document_type' => ['required', 'string', 'exists:document_types,code'],
            'file' => ['required', 'file', 'mimes:pdf,jpg,jpeg,png', 'max:2048'],
        ]);

        try {
            DB::transaction(function () use ($registration, $validated, $request) {
                $locked = Registration::where('id', $registration->id)->lockForUpdate()->firstOrFail();

                $exists = StudentDocument::where('registration_id', $locked->id)
                    ->where('document_type', $validated['document_type'])
                    ->exists();

                if ($exists) {
                    throw new \Exception('Dokumen '.str_replace('_', ' ', $validated['document_type']).' sudah diupload.');
                }

                $path = $request->file('file')->store('documents/'.$locked->id, 'local');

                StudentDocument::create([
                    'registration_id' => $locked->id,
                    'document_type' => $validated['document_type'],
                    'file_path' => $path,
                ]);
            });
        } catch (\Exception $e) {
            return Redirect::back()->with('error', $e->getMessage());
        }

        return Redirect::route('student.registration.show')
            ->with('success', 'Dokumen berhasil diunggah.');
    }

    public function deleteDocument(StudentDocument $document): RedirectResponse
    {
        $registration = $document->registration;

        if ($registration->user_id !== auth()->id() || $registration->status !== 'draft') {
            return Redirect::back()->with('error', 'Tidak dapat menghapus dokumen.');
        }

        Storage::disk('local')->delete($document->file_path);
        $document->delete();

        return Redirect::route('student.registration.show')
            ->with('success', 'Dokumen berhasil dihapus.');
    }

    public function finalize(): RedirectResponse
    {
        $activeYear = AcademicYear::where('is_active', true)->first();
        $registration = $this->getActiveRegistration($activeYear);

        if (! $registration) {
            return Redirect::back()->with('error', 'Tidak ada pendaftaran aktif.');
        }

        if ($registration->status !== 'draft') {
            return Redirect::back()->with('error', 'Pendaftaran sudah difinalisasi.');
        }

        if (! $registration->studentBiodata) {
            return Redirect::back()->with('error', 'Lengkapi biodata terlebih dahulu.');
        }

        if (! $registration->subjectScores || $registration->subjectScores->count() === 0) {
            return Redirect::back()->with('error', 'Lengkapi nilai ijazah terlebih dahulu.');
        }

        $registration->update(['status' => 'pending']);

        return Redirect::route('student.dashboard')
            ->with('success', 'Pendaftaran berhasil dikirim.');
    }

    private function getActiveRegistration(?AcademicYear $activeYear): ?Registration
    {
        if (! $activeYear) {
            return null;
        }

        return Registration::where('user_id', auth()->id())
            ->where('academic_year_id', $activeYear->id)
            ->first();
    }
}
