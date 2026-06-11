<?php

namespace Tests\Feature;

use App\Models\AcademicYear;
use App\Models\AdmissionPath;
use App\Models\Registration;
use App\Models\StudentBiodata;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('guest can access public announcement page', function () {
    $activeYear = AcademicYear::create([
        'name' => '2026/2027',
        'is_active' => true,
    ]);

    $response = $this->get(route('announcement'));
    $response->assertStatus(200);
});

test('public announcement page only displays accepted students sorted by score descending', function () {
    $activeYear = AcademicYear::create([
        'name' => '2026/2027',
        'is_active' => true,
    ]);

    $path = AdmissionPath::create([
        'name' => 'Zonasi',
        'quota' => 100,
        'is_active' => true,
    ]);

    $student1 = User::create([
        'name' => 'Alice Student',
        'email' => 'alice@ppdb.ma',
        'password' => bcrypt('password'),
        'role' => 'student',
    ]);
    $student1->email_verified_at = now();
    $student1->save();

    $student2 = User::create([
        'name' => 'Bob Student',
        'email' => 'bob@ppdb.ma',
        'password' => bcrypt('password'),
        'role' => 'student',
    ]);
    $student2->email_verified_at = now();
    $student2->save();

    $student3 = User::create([
        'name' => 'Charlie Student',
        'email' => 'charlie@ppdb.ma',
        'password' => bcrypt('password'),
        'role' => 'student',
    ]);
    $student3->email_verified_at = now();
    $student3->save();

    // Student 1: Accepted, Score 80
    $reg1 = Registration::create([
        'user_id' => $student1->id,
        'academic_year_id' => $activeYear->id,
        'admission_path_id' => $path->id,
        'status' => 'accepted',
        'processing_status' => 'selesai',
        'total_score' => 80.00,
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
        'previous_school' => 'SMP 1',
    ]);

    // Student 2: Accepted, Score 95 (Highest)
    $reg2 = Registration::create([
        'user_id' => $student2->id,
        'academic_year_id' => $activeYear->id,
        'admission_path_id' => $path->id,
        'status' => 'accepted',
        'processing_status' => 'selesai',
        'total_score' => 95.00,
    ]);
    StudentBiodata::create([
        'registration_id' => $reg2->id,
        'nisn' => '1234567892',
        'full_name' => 'Bob Student',
        'gender' => 'male',
        'birth_place' => 'Jakarta',
        'birth_date' => '2010-01-01',
        'address' => 'Jl. Merdeka',
        'phone_number' => '081234567890',
        'previous_school' => 'SMP 2',
    ]);

    // Student 3: Pending, Score 99 (Not accepted)
    $reg3 = Registration::create([
        'user_id' => $student3->id,
        'academic_year_id' => $activeYear->id,
        'admission_path_id' => $path->id,
        'status' => 'pending',
        'processing_status' => 'selesai',
        'total_score' => 99.00,
    ]);
    StudentBiodata::create([
        'registration_id' => $reg3->id,
        'nisn' => '1234567893',
        'full_name' => 'Charlie Student',
        'gender' => 'male',
        'birth_place' => 'Jakarta',
        'birth_date' => '2010-01-01',
        'address' => 'Jl. Merdeka',
        'phone_number' => '081234567890',
        'previous_school' => 'SMP 3',
    ]);

    $response = $this->get(route('announcement'));
    $response->assertStatus(200);

    $page = $response->original->getData()['page'];
    $props = $page['props'];
    $responseRegistrations = collect($props['registrations']);

    // Should only contain Alice and Bob, not Charlie (pending)
    expect($responseRegistrations)->toHaveCount(2);
    expect($responseRegistrations->pluck('name'))->toContain('Alice Student');
    expect($responseRegistrations->pluck('name'))->toContain('Bob Student');
    expect($responseRegistrations->pluck('name'))->not->toContain('Charlie Student');

    // Should be sorted by score descending (Bob then Alice)
    expect($responseRegistrations->first()['name'])->toBe('Bob Student');
    expect($responseRegistrations->last()['name'])->toBe('Alice Student');
});
