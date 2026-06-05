<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    $madrasah = \App\Models\MadrasahSetting::first();
    $activeYear = \App\Models\AcademicYear::where('is_active', true)->first();

    $schedules = $activeYear
        ? \App\Models\ActivitySchedule::where('academic_year_id', $activeYear->id)
            ->where('is_active', true)
            ->orderBy('order')
            ->orderBy('start_date')
            ->get()
        : collect();

    $activityRequirements = $activeYear
        ? \App\Models\ActivityRequirement::where('academic_year_id', $activeYear->id)
            ->orderBy('order')
            ->get()
        : collect();

    $popUpBanners = \App\Models\PopUpBanner::where('is_active', true)
        ->orderBy('created_at', 'desc')
        ->get();

    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
        'madrasah' => $madrasah,
        'activeYear' => $activeYear,
        'schedules' => $schedules,
        'activityRequirements' => $activityRequirements,
        'popUpBanners' => $popUpBanners,
    ]);
})->name('welcome');

Route::get('/dashboard', function () {
    $user = auth()->user();

    if ($user->role === 'kepala_madrasah') {
        $activeYear = \App\Models\AcademicYear::where('is_active', true)->first();

        $totalRegistrations = \App\Models\Registration::when($activeYear, fn ($q) => $q->where('academic_year_id', $activeYear->id))->count();
        $statusCounts = \App\Models\Registration::when($activeYear, fn ($q) => $q->where('academic_year_id', $activeYear->id))
            ->selectRaw("status, count(*) as count")
            ->groupBy('status')
            ->pluck('count', 'status');

        $perPath = \App\Models\AdmissionPath::where('is_active', true)->get()->map(function ($path) use ($activeYear) {
            $regs = $path->registrations()->where('academic_year_id', $activeYear?->id);
            return [
                'name' => $path->name,
                'quota' => $path->quota,
                'available_quota' => $path->available_quota,
                'total' => (clone $regs)->count(),
                'accepted' => (clone $regs)->where('status', 'accepted')->count(),
                'rejected' => (clone $regs)->where('status', 'rejected')->count(),
                'reserve' => (clone $regs)->where('status', 'reserve')->count(),
                'pending' => (clone $regs)->where('status', 'pending')->count(),
            ];
        });

        $recentRegistrations = \App\Models\Registration::when($activeYear, fn ($q) => $q->where('academic_year_id', $activeYear->id))
            ->with(['user', 'studentBiodata', 'admissionPath'])
            ->latest()
            ->take(5)
            ->get();

        return \Inertia\Inertia::render('KepalaMadrasah/Dashboard', [
            'totalRegistrations' => $totalRegistrations,
            'statusCounts' => $statusCounts,
            'perPath' => $perPath,
            'recentRegistrations' => $recentRegistrations,
            'activeYear' => $activeYear,
        ]);
    }

    if ($user->role === 'operator') {
        return redirect()->route('admin.registrations.index');
    }

    if ($user->role !== 'admin') {
        return redirect()->route('student.dashboard');
    }

    $activeYear = \App\Models\AcademicYear::where('is_active', true)->first();

    $paths = \App\Models\AdmissionPath::where('is_active', true)->get()->map(function ($path) {
        return [
            'id' => $path->id,
            'name' => $path->name,
            'quota' => $path->quota,
            'available_quota' => $path->available_quota,
            'total_registered' => $path->registrations()->whereIn('status', ['pending', 'accepted', 'reserve'])->count(),
        ];
    });

    $totalRegistrations = \App\Models\Registration::when($activeYear, fn ($q) => $q->where('academic_year_id', $activeYear->id))->count();
    $statusCounts = \App\Models\Registration::when($activeYear, fn ($q) => $q->where('academic_year_id', $activeYear->id))
        ->selectRaw("status, count(*) as count")
        ->groupBy('status')
        ->pluck('count', 'status');

    $recentRegistrations = \App\Models\Registration::when($activeYear, fn ($q) => $q->where('academic_year_id', $activeYear->id))
        ->with(['user', 'studentBiodata', 'admissionPath'])
        ->latest()
        ->take(5)
        ->get();

    return Inertia::render('Dashboard', [
        'paths' => $paths,
        'totalRegistrations' => $totalRegistrations,
        'statusCounts' => $statusCounts,
        'recentRegistrations' => $recentRegistrations,
        'activeYear' => $activeYear,
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::middleware(['auth', 'verified', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::resource('users', App\Http\Controllers\UserController::class)
        ->except(['show']);
    Route::post('/users/{user}/reset-password', [App\Http\Controllers\UserController::class, 'resetPassword'])
        ->name('users.reset-password');

    Route::resource('academic-years', App\Http\Controllers\AcademicYearController::class)
        ->except(['show', 'create', 'edit']);
    Route::patch('/academic-years/{academicYear}/toggle-active', [App\Http\Controllers\AcademicYearController::class, 'toggleActive'])
        ->name('academic-years.toggle-active');

    Route::get('/madrasah-settings', [App\Http\Controllers\MadrasahSettingController::class, 'edit'])
        ->name('madrasah-settings.edit');
    Route::patch('/madrasah-settings', [App\Http\Controllers\MadrasahSettingController::class, 'update'])
        ->name('madrasah-settings.update');

    Route::resource('admission-paths', App\Http\Controllers\AdmissionPathController::class)
        ->except(['show', 'create']);

    Route::resource('subjects', App\Http\Controllers\SubjectController::class)
        ->except(['show', 'create']);

    Route::resource('activity-schedules', App\Http\Controllers\ActivityScheduleController::class)
        ->except(['show', 'create', 'edit']);

    Route::resource('activity-requirements', App\Http\Controllers\ActivityRequirementController::class)
        ->except(['show', 'create', 'edit']);

    Route::resource('pop-up-banners', App\Http\Controllers\PopUpBannerController::class)
        ->except(['show', 'create', 'edit']);
    Route::patch('/pop-up-banners/{popUpBanner}/toggle-active', [App\Http\Controllers\PopUpBannerController::class, 'toggleActive'])
        ->name('pop-up-banners.toggle-active');

    // Registration routes moved below to allow operator role as well
});

Route::middleware(['auth', 'verified', 'role:admin,operator'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/registrations/by-path', [App\Http\Controllers\RegistrationController::class, 'byPath'])
        ->name('registrations.by-path');
    Route::get('/registrations/report/pdf', [App\Http\Controllers\RegistrationController::class, 'downloadReport'])
        ->name('registrations.report.pdf');
    Route::get('/registrations', [App\Http\Controllers\RegistrationController::class, 'index'])
        ->name('registrations.index');
    Route::post('/registrations/{registration}/claim', [App\Http\Controllers\RegistrationController::class, 'claim'])
        ->name('registrations.claim');
    Route::post('/registrations/{registration}/complete', [App\Http\Controllers\RegistrationController::class, 'complete'])
        ->name('registrations.complete');
    Route::post('/registrations/{registration}/release', [App\Http\Controllers\RegistrationController::class, 'release'])
        ->name('registrations.release');
    Route::patch('/registrations/{registration}/status', [App\Http\Controllers\RegistrationController::class, 'updateStatus'])
        ->name('registrations.status.update');
    Route::patch('/registrations/{registration}/reset', [App\Http\Controllers\RegistrationController::class, 'reset'])
        ->name('registrations.reset');
    Route::get('/print/registration-proof/{registration}', [App\Http\Controllers\PrintController::class, 'registrationProof'])
        ->name('print.registration-proof');
    Route::get('/print/decision-letter/{registration}', [App\Http\Controllers\PrintController::class, 'decisionLetter'])
        ->name('print.decision-letter');
    Route::get('/registrations/{registration}/scores', [App\Http\Controllers\ScoreController::class, 'edit'])
        ->name('registrations.scores.edit');
    Route::patch('/registrations/{registration}/scores', [App\Http\Controllers\ScoreController::class, 'update'])
        ->name('registrations.scores.update');
});

Route::middleware(['auth', 'verified'])->prefix('student')->name('student.')->group(function () {
    Route::get('/dashboard', [App\Http\Controllers\StudentDashboardController::class, 'index'])
        ->name('dashboard');
    Route::get('/biodata', [App\Http\Controllers\StudentDashboardController::class, 'biodata'])
        ->name('biodata');
    Route::get('/dokumen', [App\Http\Controllers\StudentDashboardController::class, 'documents'])
        ->name('documents');
    Route::get('/scores', [App\Http\Controllers\StudentScoreController::class, 'edit'])
        ->name('scores.edit');
    Route::patch('/scores', [App\Http\Controllers\StudentScoreController::class, 'update'])
        ->name('scores.update');
    Route::get('/print', [App\Http\Controllers\PrintController::class, 'studentRegistrationProof'])
        ->name('print.proof');
});

Route::middleware(['auth', 'registration.open'])->prefix('daftar')->name('student.registration.')->group(function () {
    Route::get('/', [App\Http\Controllers\StudentRegistrationController::class, 'show'])
        ->name('show');
    Route::post('/', [App\Http\Controllers\StudentRegistrationController::class, 'store'])
        ->name('store');
    Route::post('/biodata', [App\Http\Controllers\StudentRegistrationController::class, 'updateBiodata'])
        ->name('biodata');
    Route::post('/dokumen', [App\Http\Controllers\StudentRegistrationController::class, 'uploadDocument'])
        ->name('document');
    Route::delete('/dokumen/{document}', [App\Http\Controllers\StudentRegistrationController::class, 'deleteDocument'])
        ->name('document.delete');
    Route::post('/finalize', [App\Http\Controllers\StudentRegistrationController::class, 'finalize'])
        ->name('finalize');
});

require __DIR__.'/auth.php';
