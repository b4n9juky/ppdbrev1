<?php

namespace App\Http\Controllers;

use App\Models\AcademicYear;
use App\Models\DocumentType;
use App\Models\MadrasahSetting;
use App\Models\Registration;
use Inertia\Inertia;
use Inertia\Response;

use App\Models\StudentBiodata;
use App\Models\StudentParent;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;

class StudentDashboardController extends Controller
{
    public function index(): Response
    {
        $activeYear = AcademicYear::where('is_active', true)->first();
        $registration = $this->getRegistration($activeYear);

        $settings = MadrasahSetting::first();

        return Inertia::render('Student/Dashboard', [
            'activeYear' => $activeYear,
            'registration' => $registration ? $registration->load([
                'studentBiodata', 'studentDocuments', 'admissionPath', 'subjectScores.subject', 'studentParent'
            ]) : null,
            'madrasah' => $settings,
            'documentTypes' => DocumentType::all(),
        ]);
    }

    public function biodata(): Response
    {
        $activeYear = AcademicYear::where('is_active', true)->first();
        $registration = $this->getRegistration($activeYear);

        return Inertia::render('Student/Biodata', [
            'registration' => $registration ? $registration->load('studentBiodata', 'admissionPath') : null,
            'activeYear' => $activeYear,
        ]);
    }

    public function documents(): Response
    {
        $activeYear = AcademicYear::where('is_active', true)->first();
        $registration = $this->getRegistration($activeYear);

        return Inertia::render('Student/Documents', [
            'registration' => $registration ? $registration->load('studentDocuments', 'admissionPath') : null,
            'activeYear' => $activeYear,
            'documentTypes' => DocumentType::all(),
        ]);
    }

    public function reRegistration(): Response|RedirectResponse
    {
        $activeYear = AcademicYear::where('is_active', true)->first();
        $registration = $this->getRegistration($activeYear);

        if (! $registration || $registration->status !== 'accepted') {
            return Redirect::route('student.dashboard')->with('error', 'Anda belum dinyatakan diterima / lulus.');
        }

        return Inertia::render('Student/ReRegistration', [
            'registration' => $registration ? $registration->load('studentBiodata', 'studentParent', 'admissionPath') : null,
            'activeYear' => $activeYear,
        ]);
    }

    public function submitReRegistration(Request $request): RedirectResponse
    {
        $activeYear = AcademicYear::where('is_active', true)->first();
        $registration = $this->getRegistration($activeYear);

        if (! $registration || $registration->status !== 'accepted') {
            return Redirect::route('student.dashboard')->with('error', 'Aksi tidak diizinkan.');
        }

        // Validate re-registration status (if already verified, don't allow changes)
        if ($registration->re_registration_status === 'verified') {
            return Redirect::back()->with('error', 'Pendaftaran ulang Anda sudah diverifikasi dan tidak dapat diubah.');
        }

        $validated = $request->validate([
            // Student Biodata - Existing fields
            'nisn' => ['required', 'numeric', 'digits:10'],
            'full_name' => ['required', 'string', 'max:255'],
            'gender' => ['required', 'in:male,female'],
            'birth_place' => ['required', 'string', 'max:255'],
            'birth_date' => ['required', 'date'],
            'address' => ['required', 'string', 'max:1000'],
            'phone_number' => ['required', 'regex:/^[0-9]{11,13}$/'],
            'previous_school' => ['required', 'string', 'max:255'],

            // Statement Agreements
            'student_statement_agree' => ['required', 'accepted'],
            'parent_statement_agree' => ['required', 'accepted'],
            'participation_statement_agree' => ['required', 'accepted'],

            // Student Biodata - New fields
            'nik' => ['required', 'numeric', 'digits:16'],
            'child_order' => ['required', 'integer', 'min:1'],
            'siblings_count' => ['required', 'integer', 'min:0'],
            'student_status' => ['required', 'string', 'max:255'],
            'district' => ['required', 'string', 'max:255'],
            'subdistrict' => ['required', 'string', 'max:255'],
            'living_status' => ['required', 'string', 'max:255'],
            'distance_to_school' => ['required', 'string', 'max:255'],
            'blood_type' => ['nullable', 'string', 'max:5'],
            'disability' => ['nullable', 'string', 'max:255'],

            // Asal Sekolah Details
            'previous_school_status' => ['required', 'string', 'max:255'],
            'previous_school_npsn' => ['required', 'numeric'],
            'previous_school_address' => ['required', 'string', 'max:1000'],
            'previous_school_city' => ['required', 'string', 'max:255'],
            'previous_school_district' => ['required', 'string', 'max:255'],
            'previous_school_subdistrict' => ['required', 'string', 'max:255'],

            // Father
            'father_name' => ['required', 'string', 'max:255'],
            'father_birth_place' => ['required', 'string', 'max:255'],
            'father_birth_date' => ['required', 'date'],
            'father_nik' => ['required', 'numeric', 'digits:16'],
            'father_education' => ['required', 'string', 'max:255'],
            'father_status' => ['required', 'string', 'max:255'],
            'father_occupation' => ['required_if:father_status,Masih Hidup', 'nullable', 'string', 'max:255'],
            'father_income' => ['required_if:father_status,Masih Hidup', 'nullable', 'string', 'max:255'],
            'father_phone' => ['required_if:father_status,Masih Hidup', 'nullable', 'regex:/^[0-9]{10,13}$/'],
            'father_address' => ['required_if:father_status,Masih Hidup', 'nullable', 'string', 'max:1000'],

            // Mother
            'mother_name' => ['required', 'string', 'max:255'],
            'mother_birth_place' => ['required', 'string', 'max:255'],
            'mother_birth_date' => ['required', 'date'],
            'mother_nik' => ['required', 'numeric', 'digits:16'],
            'mother_education' => ['required', 'string', 'max:255'],
            'mother_status' => ['required', 'string', 'max:255'],
            'mother_occupation' => ['required_if:mother_status,Masih Hidup', 'nullable', 'string', 'max:255'],
            'mother_income' => ['required_if:mother_status,Masih Hidup', 'nullable', 'string', 'max:255'],
            'mother_phone' => ['required_if:mother_status,Masih Hidup', 'nullable', 'regex:/^[0-9]{10,13}$/'],
            'mother_address' => ['required_if:mother_status,Masih Hidup', 'nullable', 'string', 'max:1000'],

            // Guardian
            'guardian_name' => ['required_if:living_status,Wali', 'nullable', 'string', 'max:255'],
            'guardian_birth_place' => ['required_if:living_status,Wali', 'nullable', 'string', 'max:255'],
            'guardian_birth_date' => ['required_if:living_status,Wali', 'nullable', 'date'],
            'guardian_nik' => ['required_if:living_status,Wali', 'nullable', 'numeric', 'digits:16'],
            'guardian_education' => ['required_if:living_status,Wali', 'nullable', 'string', 'max:255'],
            'guardian_occupation' => ['required_if:living_status,Wali', 'nullable', 'string', 'max:255'],
            'guardian_income' => ['required_if:living_status,Wali', 'nullable', 'string', 'max:255'],
            'guardian_phone' => ['required_if:living_status,Wali', 'nullable', 'regex:/^[0-9]{10,13}$/'],
            'guardian_address' => ['required_if:living_status,Wali', 'nullable', 'string', 'max:1000'],
            'guardian_status' => ['required_if:living_status,Wali', 'nullable', 'string', 'max:255'],
        ], [
            'nik.digits' => 'NIK Siswa harus terdiri dari 16 digit.',
            'father_nik.digits' => 'NIK Ayah harus terdiri dari 16 digit.',
            'mother_nik.digits' => 'NIK Ibu harus terdiri dari 16 digit.',
            'guardian_nik.digits' => 'NIK Wali harus terdiri dari 16 digit.',
            'phone_number.regex' => 'Nomor HP Siswa harus berupa angka dengan panjang 11-13 digit.',
            'father_phone.regex' => 'Nomor HP Ayah harus berupa angka dengan panjang 10-13 digit.',
            'mother_phone.regex' => 'Nomor HP Ibu harus berupa angka dengan panjang 10-13 digit.',
            'guardian_phone.regex' => 'Nomor HP Wali harus berupa angka dengan panjang 10-13 digit.',
            'student_statement_agree.accepted' => 'Anda harus menyetujui Surat Pernyataan Siswa.',
            'parent_statement_agree.accepted' => 'Anda harus menyetujui Surat Pernyataan Orang Tua.',
            'participation_statement_agree.accepted' => 'Anda harus menyetujui Surat Pernyataan Partisipasi Orang Tua.',
        ]);

        // Separate student biodata from parent data
        $biodataFields = [
            'nisn', 'full_name', 'gender', 'birth_place', 'birth_date', 'address', 'phone_number', 'previous_school',
            'nik', 'child_order', 'siblings_count', 'student_status', 'district', 'subdistrict', 'living_status',
            'distance_to_school', 'blood_type', 'disability', 'previous_school_status', 'previous_school_npsn',
            'previous_school_address', 'previous_school_city', 'previous_school_district', 'previous_school_subdistrict'
        ];

        $biodataData = collect($validated)->only($biodataFields)->toArray();

        // Update or create student biodata
        StudentBiodata::updateOrCreate(
            ['registration_id' => $registration->id],
            $biodataData
        );

        // Parent data fields
        $parentFields = [
            'father_name', 'father_birth_place', 'father_birth_date', 'father_nik', 'father_education',
            'father_occupation', 'father_income', 'father_address', 'father_phone', 'father_status',
            'mother_name', 'mother_birth_place', 'mother_birth_date', 'mother_nik', 'mother_education',
            'mother_occupation', 'mother_income', 'mother_address', 'mother_phone', 'mother_status',
            'guardian_name', 'guardian_birth_place', 'guardian_birth_date', 'guardian_nik', 'guardian_education',
            'guardian_occupation', 'guardian_income', 'guardian_address', 'guardian_phone', 'guardian_status'
        ];

        $parentData = collect($validated)->only($parentFields)->toArray();

        // Update or create student parent record
        StudentParent::updateOrCreate(
            ['registration_id' => $registration->id],
            $parentData
        );

        // Update registration re-registration status
        $registration->update([
            're_registration_status' => 'submitted',
            're_registered_at' => now(),
        ]);

        return Redirect::route('student.dashboard')->with('success', 'Pendaftaran ulang berhasil dikirim. Menunggu verifikasi operator.');
    }

    private function getRegistration(?AcademicYear $activeYear): ?Registration
    {
        if (! $activeYear) {
            return null;
        }

        return Registration::where('user_id', auth()->id())
            ->where('academic_year_id', $activeYear->id)
            ->first();
    }
}
