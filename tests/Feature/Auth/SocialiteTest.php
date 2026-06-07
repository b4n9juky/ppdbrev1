<?php

use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Event;
use Laravel\Socialite\Facades\Socialite;

uses(RefreshDatabase::class);

test('google redirect works', function () {
    $response = $this->get(route('auth.google'));
    $response->assertRedirect();
    $this->assertStringContainsString('accounts.google.com', $response->getTargetUrl());
});

test('new user registration via google succeeds', function () {
    Event::fake();

    $googleUser = Mockery::mock('Laravel\Socialite\Two\User');
    $googleUser->shouldReceive('getId')->andReturn('google-id-123');
    $googleUser->shouldReceive('getName')->andReturn('Google User');
    $googleUser->shouldReceive('getEmail')->andReturn('googleuser@gmail.com');
    $googleUser->shouldReceive('getAvatar')->andReturn('https://avatar.url');

    $mockDriver = Mockery::mock('Laravel\Socialite\Two\GoogleProvider');
    $mockDriver->shouldReceive('user')->andReturn($googleUser);

    Socialite::shouldReceive('driver')->with('google')->andReturn($mockDriver);

    $response = $this->get(route('auth.google.callback'));

    $response->assertRedirect('/dashboard');
    $this->assertAuthenticated();

    $user = User::where('email', 'googleuser@gmail.com')->first();
    expect($user)->not->toBeNull();
    expect($user->google_id)->toBe('google-id-123');
    expect($user->avatar)->toBe('https://avatar.url');
    expect($user->role)->toBe('student');
    expect($user->email_verified_at)->not->toBeNull();

    Event::assertDispatched(Registered::class, function ($event) use ($user) {
        return $event->user->id === $user->id;
    });
});

test('existing user can link google and gets marked as verified', function () {
    $user = User::create([
        'name' => 'Existing User',
        'email' => 'existing@gmail.com',
        'password' => bcrypt('password'),
        'role' => 'student',
    ]);

    expect($user->email_verified_at)->toBeNull();

    $googleUser = Mockery::mock('Laravel\Socialite\Two\User');
    $googleUser->shouldReceive('getId')->andReturn('google-id-existing');
    $googleUser->shouldReceive('getName')->andReturn('Existing User');
    $googleUser->shouldReceive('getEmail')->andReturn('existing@gmail.com');
    $googleUser->shouldReceive('getAvatar')->andReturn('https://avatar.url');

    $mockDriver = Mockery::mock('Laravel\Socialite\Two\GoogleProvider');
    $mockDriver->shouldReceive('user')->andReturn($googleUser);

    Socialite::shouldReceive('driver')->with('google')->andReturn($mockDriver);

    $response = $this->get(route('auth.google.callback'));

    $response->assertRedirect('/dashboard');
    $this->assertAuthenticated();

    $user->refresh();
    expect($user->google_id)->toBe('google-id-existing');
    expect($user->avatar)->toBe('https://avatar.url');
    expect($user->email_verified_at)->not->toBeNull();
});
