<?php

namespace Tests\Feature;

use App\Models\AcademicYear;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('admin can create academic year with registration dates', function () {
    $admin = User::create([
        'name' => 'Admin User',
        'email' => 'admin@ppdb.ma',
        'password' => bcrypt('password'),
        'role' => 'admin',
    ]);

    $response = $this->actingAs($admin)->post(route('admin.academic-years.store'), [
        'name' => '2026/2027',
        'passing_score' => 75.00,
        'registration_start' => '2026-06-11 08:00:00',
        'registration_end' => '2026-06-18 23:59:00',
    ]);

    $response->assertRedirect(route('admin.academic-years.index'));
    $this->assertDatabaseHas('academic_years', [
        'name' => '2026/2027',
        'passing_score' => 75.00,
        'registration_start' => '2026-06-11 08:00:00',
        'registration_end' => '2026-06-18 23:59:00',
    ]);
});

test('admin cannot create academic year if end date is before start date', function () {
    $admin = User::create([
        'name' => 'Admin User',
        'email' => 'admin@ppdb.ma',
        'password' => bcrypt('password'),
        'role' => 'admin',
    ]);

    $response = $this->actingAs($admin)->post(route('admin.academic-years.store'), [
        'name' => '2026/2027',
        'passing_score' => 75.00,
        'registration_start' => '2026-06-18 08:00:00',
        'registration_end' => '2026-06-11 23:59:00',
    ]);

    $response->assertSessionHasErrors(['registration_end']);
});

test('guest is redirected if registration is not open yet', function () {
    AcademicYear::create([
        'name' => '2026/2027',
        'is_active' => true,
        'passing_score' => 75.00,
        'registration_start' => now()->addDays(2),
        'registration_end' => now()->addDays(9),
    ]);

    $response = $this->get('/register');

    $response->assertRedirect(route('welcome'));
    $response->assertSessionHas('error');
});

test('guest is redirected if registration is already closed', function () {
    AcademicYear::create([
        'name' => '2026/2027',
        'is_active' => true,
        'passing_score' => 75.00,
        'registration_start' => now()->subDays(9),
        'registration_end' => now()->subDays(2),
    ]);

    $response = $this->get('/register');

    $response->assertRedirect(route('welcome'));
    $response->assertSessionHas('error');
});

test('guest can access registration screen when registration is open', function () {
    AcademicYear::create([
        'name' => '2026/2027',
        'is_active' => true,
        'passing_score' => 75.00,
        'registration_start' => now()->subDays(2),
        'registration_end' => now()->addDays(5),
    ]);

    $response = $this->get('/register');

    $response->assertStatus(200);
});
