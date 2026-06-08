<?php

use App\Models\AcademicYear;
use App\Models\AdmissionPath;
use App\Models\Registration;
use App\Models\User;

test('student is redirected to dashboard if there is no active academic year', function () {
    $student = User::create([
        'name' => 'Student Test',
        'email' => 'student_score_1@ppdb.ma',
        'password' => bcrypt('password'),
        'role' => 'student',
    ]);
    $student->email_verified_at = now();
    $student->save();

    // No active academic year exists
    $response = $this->actingAs($student)->get(route('student.scores.edit'));
    $response->assertRedirect(route('student.dashboard'));
    $response->assertSessionHas('error', 'Pendaftaran belum dibuka atau tidak ada tahun ajaran aktif.');
});

test('student is redirected to dashboard if they are not registered', function () {
    $student = User::create([
        'name' => 'Student Test',
        'email' => 'student_score_2@ppdb.ma',
        'password' => bcrypt('password'),
        'role' => 'student',
    ]);
    $student->email_verified_at = now();
    $student->save();

    // Active academic year exists, but no registration
    AcademicYear::create(['name' => '2026/2027', 'is_active' => true]);

    $response = $this->actingAs($student)->get(route('student.scores.edit'));
    $response->assertRedirect(route('student.dashboard'));
    $response->assertSessionHas('error', 'Silakan lakukan pendaftaran terlebih dahulu.');
});

test('student can access scores page if registered in active academic year', function () {
    $student = User::create([
        'name' => 'Student Test',
        'email' => 'student_score_3@ppdb.ma',
        'password' => bcrypt('password'),
        'role' => 'student',
    ]);
    $student->email_verified_at = now();
    $student->save();

    $activeYear = AcademicYear::create(['name' => '2026/2027', 'is_active' => true]);
    $admissionPath = AdmissionPath::create(['name' => 'Zonasi', 'quota' => 100, 'is_active' => true]);

    Registration::create([
        'user_id' => $student->id,
        'academic_year_id' => $activeYear->id,
        'admission_path_id' => $admissionPath->id,
        'status' => 'draft',
    ]);

    $response = $this->actingAs($student)->get(route('student.scores.edit'));
    $response->assertStatus(200);
});
