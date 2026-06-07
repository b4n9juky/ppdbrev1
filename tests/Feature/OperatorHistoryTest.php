<?php

use App\Models\AcademicYear;
use App\Models\AdmissionPath;
use App\Models\Registration;
use App\Models\RegistrationAuditLog;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

test('operator index returns correct myActivities paginated logs', function () {
    $activeYear = AcademicYear::create([
        'name' => '2026/2027',
        'is_active' => true,
    ]);

    $operator1 = User::create([
        'name' => 'Operator Satu',
        'email' => 'op1@ppdb.ma',
        'password' => bcrypt('password'),
        'role' => 'operator',
    ]);
    $operator1->email_verified_at = now();
    $operator1->save();

    $operator2 = User::create([
        'name' => 'Operator Dua',
        'email' => 'op2@ppdb.ma',
        'password' => bcrypt('password'),
        'role' => 'operator',
    ]);
    $operator2->email_verified_at = now();
    $operator2->save();

    $student = User::create([
        'name' => 'Student',
        'email' => 'student@ppdb.ma',
        'password' => bcrypt('password'),
        'role' => 'student',
    ]);
    $student->email_verified_at = now();
    $student->save();

    $admissionPath = AdmissionPath::create([
        'name' => 'Zonasi',
        'quota' => 100,
        'is_active' => true,
    ]);

    $registration = Registration::create([
        'user_id' => $student->id,
        'academic_year_id' => $activeYear->id,
        'admission_path_id' => $admissionPath->id,
        'status' => 'pending',
    ]);

    // Create logs for operator 1
    RegistrationAuditLog::create([
        'user_id' => $operator1->id,
        'registration_id' => $registration->id,
        'action' => 'claim',
        'description' => 'Mengambil pendaftaran siswa.',
    ]);

    // Create logs for operator 2
    RegistrationAuditLog::create([
        'user_id' => $operator2->id,
        'registration_id' => $registration->id,
        'action' => 'claim',
        'description' => 'Mengambil pendaftaran siswa operator dua.',
    ]);

    // Request operator 1 dashboard
    $response = $this->actingAs($operator1)->get(route('operator.registrations.index'));
    $response->assertOk();

    $response->assertInertia(fn (Assert $page) => $page
        ->component('Operator/Registration/Index')
        ->has('myActivities.data', 1)
        ->where('myActivities.data.0.description', 'Mengambil pendaftaran siswa.')
    );
});
