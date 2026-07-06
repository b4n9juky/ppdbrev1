<?php

namespace App\Http\Controllers\Operator;

use App\Http\Controllers\Controller;
use App\Http\Requests\ClaimRegistrationRequest;
use App\Http\Requests\CompleteRegistrationRequest;
use App\Http\Requests\ReleaseRegistrationRequest;
use App\Models\AcademicYear;
use App\Models\AdmissionPath;
use App\Models\DocumentType;
use App\Models\Registration;
use App\Models\StudentBiodata;
use App\Models\Subject;
use App\Services\RegistrationAssignmentService;
use Exception;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;
use SimpleSoftwareIO\QrCode\Facades\QrCode;

class RegistrationController extends Controller
{
    public function index(Request $request): Response
    {
        $activeYear = AcademicYear::where('is_active', true)->first();

        $sortField = $request->query('sort', 'created_at');
        $sortDirection = $request->query('direction', 'desc');
        $search = $request->query('search', '');
        $perPage = (int)$request->query('per_page', 15);
        $processingStatus = $request->query('processing_status', 'all');
        $selectedId = $request->query('selected_id');

        $tab = $request->query('tab', 'workspace');

        $registrations = Registration::withSum('subjectScores as total_score', 'scores')
            ->with([
                'studentBiodata',
                'studentParent',
                'admissionPath',
                'user',
                'studentDocuments',
                'assignedOperator',
                'subjectScores.subject',
            ])
            ->when($activeYear, fn($q) => $q->where('academic_year_id', $activeYear->id))
            ->when($tab === 're_registration', function ($q) use ($processingStatus) {
                $q->where('status', 'accepted')
                    ->when($processingStatus === 'submitted', fn($q) => $q->where('re_registration_status', 'submitted'))
                    ->when($processingStatus === 'verified', fn($q) => $q->where('re_registration_status', 'verified'))
                    ->when($processingStatus === 'pending', fn($q) => $q->where('re_registration_status', 'pending'));
            }, function ($q) use ($processingStatus) {
                $q->where('status', '!=', 'accepted')
                    ->where('processing_status', '!=', 'selesai')
                    ->when($processingStatus === 'baru', fn($q) => $q->where('processing_status', 'baru'))
                    ->when($processingStatus === 'my_processing', fn($q) => $q->where('processing_status', 'diproses')->where('assigned_operator_id', auth()->id()));
            })
            ->when($search, function ($q) use ($search) {
                $q->where(function ($sub) use ($search) {
                    $sub->whereHas('studentBiodata', function ($sb) use ($search) {
                        $sb->where('full_name', 'like', "%{$search}%")
                            ->orWhere('nisn', 'like', "%{$search}%");
                    })->orWhereHas('user', function ($u) use ($search) {
                        $u->where('name', 'like', "%{$search}%");
                    })->orWhereHas('admissionPath', function ($ap) use ($search) {
                        $ap->where('name', 'like', "%{$search}%");
                    });
                });
            })
            ->orderBy($sortField, $sortDirection)
            ->paginate($perPage)
            ->withQueryString();

        $selectedRegistration = null;
        if ($selectedId) {
            $selectedRegistration = Registration::withSum('subjectScores as total_score', 'scores')
                ->with([
                    'studentBiodata',
                    'studentParent',
                    'admissionPath',
                    'user',
                    'studentDocuments',
                    'assignedOperator',
                    'subjectScores.subject',
                ])
                ->find($selectedId);
        }

        // Generate QR code for selected registration
        if ($selectedRegistration && $selectedRegistration->studentBiodata?->nisn) {
            $qrcodeSvg = base64_encode(
                QrCode::format('svg')
                    ->size(120)
                    ->margin(1)
                    ->generate($selectedRegistration->studentBiodata->nisn)
            );
            $selectedRegistration->qrcode = 'data:image/svg+xml;base64,' . $qrcodeSvg;
        }

        $user = auth()->user();
        $paths = AdmissionPath::all(['id', 'name']);
        $subjects = collect();
        if ($selectedRegistration) {
            $subjects = Subject::where('academic_year_id', $selectedRegistration->academic_year_id)
                ->where('is_active', true)
                ->orderBy('urut')
                ->orderBy('name')
                ->get(['id', 'name', 'urut']);
        } elseif ($activeYear) {
            $subjects = Subject::where('academic_year_id', $activeYear->id)
                ->where('is_active', true)
                ->orderBy('urut')
                ->orderBy('name')
                ->get(['id', 'name', 'urut']);
        }

        $myActivities = \App\Models\RegistrationAuditLog::where('user_id', $user->id)
            ->latest()
            ->paginate(10, ['*'], 'history_page')
            ->withQueryString();

        return Inertia::render('Operator/Registration/Index', [
            'registrations' => $registrations,
            'selectedRegistration' => $selectedRegistration,
            'paths' => $paths,
            'subjects' => $subjects,
            'documentTypes' => DocumentType::all(),
            'myActivities' => $myActivities,
            'filters' => [
                'tab' => $tab,
                'sort' => $sortField,
                'direction' => $sortDirection,
                'search' => $search,
                'per_page' => $perPage,
                'processing_status' => $processingStatus,
                'selected_id' => $selectedId,
            ],
        ]);
    }

    public function claim(ClaimRegistrationRequest $request, Registration $registration, RegistrationAssignmentService $service): RedirectResponse
    {
        try {
            $service->claim($registration, $request->user());

            return Redirect::route('operator.registrations.index', [
                'selected_id' => $registration->id,
                'processing_status' => 'my_processing',
            ])->with('success', 'Pendaftar berhasil Anda ambil untuk diproses.');
        } catch (Exception $e) {
            return Redirect::back()->with('error', $e->getMessage());
        }
    }

    public function complete(CompleteRegistrationRequest $request, Registration $registration, RegistrationAssignmentService $service): RedirectResponse
    {
        try {
            $service->complete($registration, $request->user());

            $activeYear = AcademicYear::where('is_active', true)->first();
            $nextRegistration = Registration::where('processing_status', 'baru')
                ->where('academic_year_id', $activeYear?->id)
                ->where('status', '!=', 'draft')
                ->whereHas('admissionPath', fn ($q) => $q->where('is_active', true))
                ->orderBy('created_at', 'asc')
                ->first();

            if ($nextRegistration) {
                return Redirect::route('operator.registrations.index', [
                    'selected_id' => $nextRegistration->id,
                    'processing_status' => 'baru',
                ])->with('success', 'Proses pendaftar berhasil diselesaikan. Membuka pendaftar berikutnya...');
            }

            return Redirect::route('operator.registrations.index', [
                'processing_status' => 'baru',
            ])->with('success', 'Proses pendaftar berhasil diselesaikan. Semua pendaftar telah diproses.');
        } catch (Exception $e) {
            return Redirect::back()->with('error', $e->getMessage());
        }
    }

    public function verify(Request $request, Registration $registration, RegistrationAssignmentService $service): RedirectResponse
    {
        Gate::authorize('update', $registration);

        $requiredSubjects = Subject::where('academic_year_id', $registration->academic_year_id)->where('is_active', true)->count();
        if ($registration->subjectScores->count() < $requiredSubjects || $registration->subjectScores->contains(fn($s) => is_null($s->scores))) {
            return Redirect::back()->with('error', 'Tidak dapat melakukan verifikasi, terdapat nilai mata pelajaran yang kosong atau belum diisi.');
        }

        try {
            $service->complete($registration, $request->user());

            $registration->update([
                'verification_notes' => 'verifikasi telah dilakukan data anda lolos verifikasi.',
            ]);

            $activeYear = AcademicYear::where('is_active', true)->first();
            $nextRegistration = Registration::where('processing_status', 'baru')
                ->where('academic_year_id', $activeYear?->id)
                ->where('status', '!=', 'draft')
                ->whereHas('admissionPath', fn ($q) => $q->where('is_active', true))
                ->orderBy('created_at', 'asc')
                ->first();

            if ($nextRegistration) {
                return Redirect::route('operator.registrations.index', [
                    'selected_id' => $nextRegistration->id,
                    'processing_status' => 'baru',
                ])->with('success', 'Pendaftar berhasil diverifikasi. Membuka pendaftar berikutnya...');
            }

            return Redirect::route('operator.registrations.index', [
                'processing_status' => 'baru',
            ])->with('success', 'Pendaftar berhasil diverifikasi. Semua pendaftar telah diproses.');
        } catch (Exception $e) {
            return Redirect::back()->with('error', $e->getMessage());
        }
    }

    public function rejectFile(Request $request, Registration $registration, RegistrationAssignmentService $service): RedirectResponse
    {
        Gate::authorize('update', $registration);

        try {
            $service->complete($registration, $request->user());

            $notes = $request->input('notes') ?: 'berkas anda tidak memenuhi syarat, silahkan perbaiki';

            $registration->update([
                'status' => 'rejected',
                'verification_notes' => $notes,
            ]);

            $activeYear = AcademicYear::where('is_active', true)->first();
            $nextRegistration = Registration::where('processing_status', 'baru')
                ->where('academic_year_id', $activeYear?->id)
                ->where('status', '!=', 'draft')
                ->whereHas('admissionPath', fn ($q) => $q->where('is_active', true))
                ->orderBy('created_at', 'asc')
                ->first();

            if ($nextRegistration) {
                return Redirect::route('operator.registrations.index', [
                    'selected_id' => $nextRegistration->id,
                    'processing_status' => 'baru',
                ])->with('success', 'Berkas ditolak. Membuka pendaftar berikutnya...');
            }

            return Redirect::route('operator.registrations.index', [
                'processing_status' => 'baru',
            ])->with('success', 'Berkas ditolak. Semua pendaftar telah diproses.');
        } catch (Exception $e) {
            return Redirect::back()->with('error', $e->getMessage());
        }
    }

    public function release(ReleaseRegistrationRequest $request, Registration $registration, RegistrationAssignmentService $service): RedirectResponse
    {
        try {
            $service->release($registration, $request->user());

            return Redirect::back()->with('success', 'Penugasan pendaftar berhasil dilepaskan.');
        } catch (Exception $e) {
            return Redirect::back()->with('error', $e->getMessage());
        }
    }

    public function reset(Request $request, Registration $registration): RedirectResponse
    {
        Gate::authorize('update', $registration);

        if ($registration->status === 'draft') {
            return Redirect::back()->with('error', 'Pendaftar sudah dalam status draft.');
        }

        $notes = $request->input('notes') ?: 'berkas anda tidak memenuhi syarat, silahkan perbaiki';

        $registration->update([
            'status' => 'pending',
            'processing_status' => 'baru',
            'assigned_operator_id' => null,
            'assigned_at' => null,
            're_registration_status' => null,
            're_registration_notes' => null,
            'verification_notes' => $notes,
        ]);

        return Redirect::back()->with('success', 'Pendaftar berhasil direset ke status Pending.');
    }

    public function updateBiodata(Request $request, Registration $registration): RedirectResponse
    {
        Gate::authorize('update', $registration);

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

        return Redirect::back()->with('success', 'Biodata pendaftar berhasil diperbarui.');
    }

    public function saveNote(Request $request, Registration $registration): RedirectResponse
    {
        Gate::authorize('update', $registration);

        $validated = $request->validate([
            'notes' => ['nullable', 'string', 'max:5000'],
        ]);

        $registration->update([
            'verification_notes' => $validated['notes'] ?? null,
        ]);

        return Redirect::back()->with('success', 'Catatan verifikasi berhasil disimpan.');
    }

    public function verifyReRegistration(Request $request, Registration $registration): RedirectResponse
    {
        Gate::authorize('update', $registration);

        $registration->update([
            're_registration_status' => 'verified',
            're_registration_notes' => 'Pendaftaran ulang Anda telah diverifikasi oleh operator.',
        ]);

        return Redirect::back()->with('success', 'Pendaftaran ulang siswa berhasil diverifikasi.');
    }

    public function rejectReRegistration(Request $request, Registration $registration): RedirectResponse
    {
        Gate::authorize('update', $registration);

        $request->validate([
            'notes' => ['required', 'string', 'max:5000'],
        ]);

        $registration->update([
            're_registration_status' => 'pending', // send back to pending for editing
            're_registration_notes' => $request->input('notes'),
        ]);

        return Redirect::back()->with('success', 'Pendaftaran ulang siswa ditolak untuk perbaikan.');
    }
}
