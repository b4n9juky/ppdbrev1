<?php

namespace Tests\Feature;

use App\Models\AcademicYear;
use App\Models\AdmissionPath;
use App\Models\Registration;
use App\Models\StudentBiodata;
use App\Models\StudentParent;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('non-accepted student cannot access re-registration page', function () {
    $student = User::create([
        'name' => 'Student Test',
        'email' => 'student_rereg1@ppdb.ma',
        'password' => bcrypt('password'),
        'role' => 'student',
    ]);
    $student->email_verified_at = now();
    $student->save();

    $activeYear = AcademicYear::create(['name' => '2026/2027', 'is_active' => true]);
    $admissionPath = AdmissionPath::create(['name' => 'Zonasi', 'quota' => 100, 'is_active' => true]);

    $registration = Registration::create([
        'user_id' => $student->id,
        'academic_year_id' => $activeYear->id,
        'admission_path_id' => $admissionPath->id,
        'status' => 'pending', // Status is pending, NOT accepted
    ]);

    $response = $this->actingAs($student)->get(route('student.re-registration'));
    $response->assertRedirect(route('student.dashboard'));
    $response->assertSessionHas('error', 'Anda belum dinyatakan diterima / lulus.');
});

test('accepted student can access re-registration page', function () {
    $student = User::create([
        'name' => 'Student Test',
        'email' => 'student_rereg2@ppdb.ma',
        'password' => bcrypt('password'),
        'role' => 'student',
    ]);
    $student->email_verified_at = now();
    $student->save();

    $activeYear = AcademicYear::create(['name' => '2026/2027', 'is_active' => true]);
    $admissionPath = AdmissionPath::create(['name' => 'Zonasi', 'quota' => 100, 'is_active' => true]);

    $registration = Registration::create([
        'user_id' => $student->id,
        'academic_year_id' => $activeYear->id,
        'admission_path_id' => $admissionPath->id,
        'status' => 'accepted', // Status is accepted
    ]);

    $response = $this->actingAs($student)->get(route('student.re-registration'));
    $response->assertStatus(200);
});

test('submitting re-registration requires NIK and KK digits', function () {
    $student = User::create([
        'name' => 'Student Test',
        'email' => 'student_rereg3@ppdb.ma',
        'password' => bcrypt('password'),
        'role' => 'student',
    ]);
    $student->email_verified_at = now();
    $student->save();

    $activeYear = AcademicYear::create(['name' => '2026/2027', 'is_active' => true]);
    $admissionPath = AdmissionPath::create(['name' => 'Zonasi', 'quota' => 100, 'is_active' => true]);

    $registration = Registration::create([
        'user_id' => $student->id,
        'academic_year_id' => $activeYear->id,
        'admission_path_id' => $admissionPath->id,
        'status' => 'accepted',
    ]);

    // Submit incomplete data (e.g. missing NIKs, wrong formats)
    $response = $this->actingAs($student)->post(route('student.re-registration.submit'), [
        'nisn' => '1234567890',
        'full_name' => 'Azzam Mudzaffar',
        'gender' => 'male',
        'birth_place' => 'Bontang',
        'birth_date' => '2009-06-24',
        'address' => 'Jln Arif Rahman Hakim',
        'phone_number' => '082324083813',
        'previous_school' => 'MTs Nurul Ummah',
        // missing/invalid NIKs
        'nik' => '12345', 
    ]);

    $response->assertSessionHasErrors(['nik', 'child_order', 'siblings_count', 'father_nik', 'mother_nik']);
});

test('student can successfully submit re-registration and save to student_parents', function () {
    $student = User::create([
        'name' => 'Student Test',
        'email' => 'student_rereg4@ppdb.ma',
        'password' => bcrypt('password'),
        'role' => 'student',
    ]);
    $student->email_verified_at = now();
    $student->save();

    $activeYear = AcademicYear::create(['name' => '2026/2027', 'is_active' => true]);
    $admissionPath = AdmissionPath::create(['name' => 'Zonasi', 'quota' => 100, 'is_active' => true]);

    $registration = Registration::create([
        'user_id' => $student->id,
        'academic_year_id' => $activeYear->id,
        'admission_path_id' => $admissionPath->id,
        'status' => 'accepted',
    ]);

    $payload = [
        // Biodata Siswa - Existing
        'nisn' => '0094593793',
        'full_name' => 'Muhammad Azzam Mudzaffar',
        'gender' => 'male',
        'birth_place' => 'Bontang',
        'birth_date' => '2009-06-24',
        'address' => 'Jln Arif Rahman Hakim km 3',
        'phone_number' => '082324083813',
        'previous_school' => 'MTs Nurul Ummah',

        // Biodata Siswa - New
        'nik' => '6474012406090002',
        'child_order' => 1,
        'siblings_count' => 1,
        'student_status' => 'Anak Kandung',
        'district' => 'Bontang Barat',
        'subdistrict' => 'Belimbing',
        'living_status' => 'Orang Tua',
        'distance_to_school' => '11 - 20 KM',
        'blood_type' => 'O',
        'disability' => '',

        // Previous school details
        'previous_school_status' => 'Swasta',
        'previous_school_npsn' => '20363281',
        'previous_school_address' => 'Jln Raden Ronggo KG.II no 982 Yogyakarta',
        'previous_school_city' => 'Yogyakarta',
        'previous_school_district' => 'Kotagede',
        'previous_school_subdistrict' => 'Kotagede',

        // Father
        'father_name' => 'Father Name',
        'father_birth_place' => 'Yogyakarta',
        'father_birth_date' => '1975-01-01',
        'father_nik' => '3404123456789012',
        'father_education' => 'S1',
        'father_occupation' => 'Wiraswasta',
        'father_income' => '3 - 5 Juta',
        'father_phone' => '081234567890',
        'father_address' => 'Jln Arif Rahman Hakim km 3',
        'father_status' => 'Masih Hidup',

        // Mother
        'mother_name' => 'Mother Name',
        'mother_birth_place' => 'Bontang',
        'mother_birth_date' => '1980-05-12',
        'mother_nik' => '6474012345678901',
        'mother_education' => 'SMA',
        'mother_occupation' => 'Ibu Rumah Tangga',
        'mother_income' => 'Tidak Berpenghasilan',
        'mother_phone' => '082324083813',
        'mother_address' => 'Jln Arif Rahman Hakim km 3',
        'mother_status' => 'Masih Hidup',

        // Guardian
        'guardian_name' => '',
        'guardian_birth_place' => '',
        'guardian_birth_date' => null,
        'guardian_nik' => '',
        'guardian_education' => '',
        'guardian_occupation' => '',
        'guardian_income' => '',
        'guardian_address' => '',
        'guardian_phone' => '',
        'guardian_status' => '',
        'student_statement_agree' => true,
        'parent_statement_agree' => true,
        'participation_statement_agree' => true,
    ];

    $response = $this->actingAs($student)->post(route('student.re-registration.submit'), $payload);
    
    $response->assertRedirect(route('student.dashboard'));
    $response->assertSessionHas('success', 'Pendaftaran ulang berhasil dikirim. Menunggu verifikasi operator.');

    $registration->refresh();
    expect($registration->re_registration_status)->toBe('submitted');
    expect($registration->re_registered_at)->not->toBeNull();

    // Verify student parent table insertion
    $studentParent = StudentParent::where('registration_id', $registration->id)->first();
    expect($studentParent)->not->toBeNull();
    expect($studentParent->father_name)->toBe('Father Name');
    expect($studentParent->mother_name)->toBe('Mother Name');
    expect($studentParent->father_nik)->toBe('3404123456789012');

    // Verify student biodata update
    $studentBio = StudentBiodata::where('registration_id', $registration->id)->first();
    expect($studentBio->nik)->toBe('6474012406090002');
    expect($studentBio->previous_school_npsn)->toBe('20363281');
});

test('operator can approve or reject a student re-registration', function () {
    $activeYear = AcademicYear::create(['name' => '2026/2027', 'is_active' => true]);
    $admissionPath = AdmissionPath::create(['name' => 'Zonasi', 'quota' => 100, 'is_active' => true]);

    $student = User::create([
        'name' => 'Student Test',
        'email' => 'student_rereg5@ppdb.ma',
        'password' => bcrypt('password'),
        'role' => 'student',
    ]);
    $student->email_verified_at = now();
    $student->save();

    $operator = User::create([
        'name' => 'Operator User',
        'email' => 'operator_rereg@ppdb.ma',
        'password' => bcrypt('password'),
        'role' => 'operator',
    ]);
    $operator->email_verified_at = now();
    $operator->save();

    $registration = Registration::create([
        'user_id' => $student->id,
        'academic_year_id' => $activeYear->id,
        'admission_path_id' => $admissionPath->id,
        'status' => 'accepted',
        're_registration_status' => 'submitted',
        'assigned_operator_id' => $operator->id,
        'processing_status' => 'diproses',
    ]);

    // 1. Operator rejects re-registration with revision notes
    $response = $this->actingAs($operator)->post(route('operator.registrations.reject-re-registration', $registration->id), [
        'notes' => 'Harap perbaiki NIK Ibu, tidak boleh sama dengan NIK Ayah.',
    ]);
    $response->assertSessionHas('success');

    $registration->refresh();
    expect($registration->re_registration_status)->toBe('pending');
    expect($registration->re_registration_notes)->toBe('Harap perbaiki NIK Ibu, tidak boleh sama dengan NIK Ayah.');

    // 2. Student resubmits after correction
    $registration->update(['re_registration_status' => 'submitted']);

    // 3. Operator approves re-registration
    $response = $this->actingAs($operator)->post(route('operator.registrations.verify-re-registration', $registration->id));
    $response->assertSessionHas('success');

    $registration->refresh();
    expect($registration->re_registration_status)->toBe('verified');
    expect($registration->re_registration_notes)->toBe('Pendaftaran ulang Anda telah diverifikasi oleh operator.');
});

test('submitting re-registration requires statement agreements', function () {
    $student = User::create([
        'name' => 'Student Test',
        'email' => 'student_rereg_agree@ppdb.ma',
        'password' => bcrypt('password'),
        'role' => 'student',
    ]);
    $student->email_verified_at = now();
    $student->save();

    $activeYear = AcademicYear::create(['name' => '2026/2027', 'is_active' => true]);
    $admissionPath = AdmissionPath::create(['name' => 'Zonasi', 'quota' => 100, 'is_active' => true]);

    $registration = Registration::create([
        'user_id' => $student->id,
        'academic_year_id' => $activeYear->id,
        'admission_path_id' => $admissionPath->id,
        'status' => 'accepted',
    ]);

    // Omit agreements
    $payload = [
        'nisn' => '0094593793',
        'full_name' => 'Muhammad Azzam Mudzaffar',
        'gender' => 'male',
        'birth_place' => 'Bontang',
        'birth_date' => '2009-06-24',
        'address' => 'Jln Arif Rahman Hakim km 3',
        'phone_number' => '082324083813',
        'previous_school' => 'MTs Nurul Ummah',
        'nik' => '6474012406090002',
        'child_order' => 1,
        'siblings_count' => 1,
        'student_status' => 'Anak Kandung',
        'district' => 'Bontang Barat',
        'subdistrict' => 'Belimbing',
        'living_status' => 'Orang Tua',
        'distance_to_school' => '11 - 20 KM',
        
        'previous_school_status' => 'Swasta',
        'previous_school_npsn' => '20363281',
        'previous_school_address' => 'Jln Raden Ronggo KG.II no 982 Yogyakarta',
        'previous_school_city' => 'Yogyakarta',
        'previous_school_district' => 'Kotagede',
        'previous_school_subdistrict' => 'Kotagede',

        'father_name' => 'Father Name',
        'father_birth_place' => 'Yogyakarta',
        'father_birth_date' => '1975-01-01',
        'father_nik' => '3404123456789012',
        'father_education' => 'S1',
        'father_occupation' => 'Wiraswasta',
        'father_income' => '3 - 5 Juta',
        'father_phone' => '081234567890',
        'father_address' => 'Jln Arif Rahman Hakim km 3',
        'father_status' => 'Masih Hidup',

        'mother_name' => 'Mother Name',
        'mother_birth_place' => 'Bontang',
        'mother_birth_date' => '1980-05-12',
        'mother_nik' => '6474012345678901',
        'mother_education' => 'SMA',
        'mother_occupation' => 'Ibu Rumah Tangga',
        'mother_income' => 'Tidak Berpenghasilan',
        'mother_phone' => '082324083813',
        'mother_address' => 'Jln Arif Rahman Hakim km 3',
        'mother_status' => 'Masih Hidup',
    ];

    $response = $this->actingAs($student)->post(route('student.re-registration.submit'), $payload);
    $response->assertSessionHasErrors([
        'student_statement_agree',
        'parent_statement_agree',
        'participation_statement_agree',
    ]);
});

test('student and operator can print statement letters', function () {
    $student = User::create([
        'name' => 'Student Test',
        'email' => 'student_rereg_print@ppdb.ma',
        'password' => bcrypt('password'),
        'role' => 'student',
    ]);
    $student->email_verified_at = now();
    $student->save();

    $operator = User::create([
        'name' => 'Operator User',
        'email' => 'operator_print@ppdb.ma',
        'password' => bcrypt('password'),
        'role' => 'operator',
    ]);
    $operator->email_verified_at = now();
    $operator->save();

    $activeYear = AcademicYear::create(['name' => '2026/2027', 'is_active' => true]);
    $admissionPath = AdmissionPath::create(['name' => 'Zonasi', 'quota' => 100, 'is_active' => true]);

    $registration = Registration::create([
        'user_id' => $student->id,
        'academic_year_id' => $activeYear->id,
        'admission_path_id' => $admissionPath->id,
        'status' => 'accepted',
        're_registration_status' => 'submitted',
    ]);

    StudentBiodata::create([
        'registration_id' => $registration->id,
        'nisn' => '0094593793',
        'full_name' => 'Muhammad Azzam Mudzaffar',
        'gender' => 'male',
        'birth_place' => 'Bontang',
        'birth_date' => '2009-06-24',
        'address' => 'Jln Arif Rahman Hakim km 3',
        'phone_number' => '082324083813',
        'previous_school' => 'MTs Nurul Ummah',
        'nik' => '6474012406090002',
    ]);

    StudentParent::create([
        'registration_id' => $registration->id,
        'father_name' => 'Father Name',
        'father_nik' => '3404123456789012',
        'mother_name' => 'Mother Name',
        'mother_nik' => '6474012345678901',
    ]);

    // Clear settings to avoid multiple rows constraints if any
    \App\Models\MadrasahSetting::query()->delete();
    \App\Models\MadrasahSetting::create([
        'madrasah_name' => 'Madrasah Test',
        'student_statement_points' => "Poin 1\nPoin 2",
        'parent_statement_points' => "Poin Ortu 1\nPoin Ortu 2",
        'participation_statement_points' => "Poin Part 1\nPoin Part 2",
    ]);

    // Student prints
    $response = $this->actingAs($student)->get(route('student.print.student-statement'));
    $response->assertStatus(200);

    $response = $this->actingAs($student)->get(route('student.print.parent-statement'));
    $response->assertStatus(200);

    $response = $this->actingAs($student)->get(route('student.print.participation-statement'));
    $response->assertStatus(200);

    // Operator prints
    $response = $this->actingAs($operator)->get(route('operator.print.student-statement', $registration->id));
    $response->assertStatus(200);

    $response = $this->actingAs($operator)->get(route('operator.print.parent-statement', $registration->id));
    $response->assertStatus(200);

    $response = $this->actingAs($operator)->get(route('operator.print.participation-statement', $registration->id));
    $response->assertStatus(200);
});

test('operator/admin can reset accepted student re-registration instead of resetting to draft', function () {
    $activeYear = AcademicYear::create(['name' => '2026/2027', 'is_active' => true]);
    $admissionPath = AdmissionPath::create(['name' => 'Zonasi', 'quota' => 100, 'is_active' => true]);

    $student = User::create([
        'name' => 'Student Test',
        'email' => 'student_rereg_reset@ppdb.ma',
        'password' => bcrypt('password'),
        'role' => 'student',
    ]);
    $student->email_verified_at = now();
    $student->save();

    $operator = User::create([
        'name' => 'Operator User',
        'email' => 'operator_reset@ppdb.ma',
        'password' => bcrypt('password'),
        'role' => 'operator',
    ]);
    $operator->email_verified_at = now();
    $operator->save();

    $registration = Registration::create([
        'user_id' => $student->id,
        'academic_year_id' => $activeYear->id,
        'admission_path_id' => $admissionPath->id,
        'status' => 'accepted',
        're_registration_status' => 'submitted',
        'assigned_operator_id' => $operator->id,
        'processing_status' => 'diproses',
    ]);

    // Reset action
    $response = $this->actingAs($operator)->patch(route('operator.registrations.reset', $registration->id), [
        'notes' => 'Tolong lengkapi surat pernyataan orang tua.',
    ]);
    $response->assertSessionHas('success');

    $registration->refresh();
    // Verify status is STILL accepted, and re_registration_status is pending
    expect($registration->status)->toBe('accepted');
    expect($registration->re_registration_status)->toBe('pending');
    expect($registration->re_registration_notes)->toBe('Tolong lengkapi surat pernyataan orang tua.');
});

test('admin can export accepted registrations as CSV with filters', function () {
    $activeYear = AcademicYear::create(['name' => '2026/2027', 'is_active' => true]);
    $path1 = AdmissionPath::create(['name' => 'Zonasi', 'quota' => 100, 'is_active' => true]);
    $path2 = AdmissionPath::create(['name' => 'Prestasi', 'quota' => 50, 'is_active' => true]);

    $admin = User::create([
        'name' => 'Admin User',
        'email' => 'admin_export@ppdb.ma',
        'password' => bcrypt('password'),
        'role' => 'admin',
    ]);

    $student1 = User::create([
        'name' => 'Alice Student',
        'email' => 'student_export1@ppdb.ma',
        'password' => bcrypt('password'),
        'role' => 'student',
    ]);

    $student2 = User::create([
        'name' => 'Bob Student',
        'email' => 'student_export2@ppdb.ma',
        'password' => bcrypt('password'),
        'role' => 'student',
    ]);

    // Registration 1: Accepted, Zonasi
    $reg1 = Registration::create([
        'user_id' => $student1->id,
        'academic_year_id' => $activeYear->id,
        'admission_path_id' => $path1->id,
        'status' => 'accepted',
        'processing_status' => 'selesai',
        'total_score' => 85.50,
    ]);
    StudentBiodata::create([
        'registration_id' => $reg1->id,
        'nisn' => '1234567891',
        'full_name' => 'Alice Student',
        'gender' => 'female',
        'birth_place' => 'Jakarta',
        'birth_date' => '2010-01-01',
        'address' => 'Jl. Merdeka',
        'phone_number' => '081234567890',
        'previous_school' => 'SMP 1 Jakarta',
    ]);

    // Registration 2: Cadangan, Prestasi
    $reg2 = Registration::create([
        'user_id' => $student2->id,
        'academic_year_id' => $activeYear->id,
        'admission_path_id' => $path2->id,
        'status' => 'reserve',
        'processing_status' => 'selesai',
        'total_score' => 90.00,
    ]);
    StudentBiodata::create([
        'registration_id' => $reg2->id,
        'nisn' => '1234567892',
        'full_name' => 'Bob Student',
        'gender' => 'male',
        'birth_place' => 'Bandung',
        'birth_date' => '2010-02-02',
        'address' => 'Jl. Diponegoro',
        'phone_number' => '081234567891',
        'previous_school' => 'SMP 2 Bandung',
    ]);

    // Test unauthorized access
    $studentUser = User::where('role', 'student')->first();
    $response = $this->actingAs($studentUser)->get(route('admin.registrations.export-accepted'));
    $response->assertStatus(403);

    // Test authorized access without filters (gets both since both are 'selesai' and status !== 'draft')
    $response = $this->actingAs($admin)->get(route('admin.registrations.export-accepted'));
    $response->assertStatus(200);
    $response->assertHeader('Content-Type', 'text/csv; charset=UTF-8');
    
    $content = $response->streamedContent();
    expect($content)->toContain('Alice Student');
    expect($content)->toContain('Bob Student');
    expect($content)->toContain('Diterima');
    expect($content)->toContain('Cadangan');

    // Test filtering by path (Prestasi only gets Bob)
    $responsePath = $this->actingAs($admin)->get(route('admin.registrations.export-accepted', [
        'path' => $path2->id
    ]));
    $contentPath = $responsePath->streamedContent();
    expect($contentPath)->not->toContain('Alice Student');
    expect($contentPath)->toContain('Bob Student');

    // Test filtering by status (Diterima only gets Alice)
    $responseStatus = $this->actingAs($admin)->get(route('admin.registrations.export-accepted', [
        'status' => 'accepted'
    ]));
    $contentStatus = $responseStatus->streamedContent();
    expect($contentStatus)->toContain('Alice Student');
    expect($contentStatus)->not->toContain('Bob Student');
});
