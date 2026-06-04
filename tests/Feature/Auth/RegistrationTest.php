<?php

use App\Models\AcademicYear;

test('registration screen can be rendered', function () {
    AcademicYear::create(['name' => '2026/2027', 'is_active' => true]);

    $response = $this->get('/register');

    $response->assertStatus(200);
});

test('new users can register', function () {
    AcademicYear::create(['name' => '2026/2027', 'is_active' => true]);

    $response = $this->post('/register', [
        'name' => 'Test User',
        'email' => 'test@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $this->assertAuthenticated();
    $response->assertRedirect(route('student.dashboard', absolute: false));
});
