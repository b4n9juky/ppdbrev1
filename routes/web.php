<?php

use App\Http\Controllers\AcademicYearController;
use App\Http\Controllers\ActivityRequirementController;
use App\Http\Controllers\ActivityScheduleController;
use App\Http\Controllers\AdmissionPathController;
use App\Http\Controllers\BackupController;
use App\Http\Controllers\DocumentTypeController;
use App\Http\Controllers\MadrasahSettingController;
use App\Http\Controllers\PopUpBannerController;
use App\Http\Controllers\PrintController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RegistrationController;
use App\Http\Controllers\ScoreController;
use App\Http\Controllers\VerificationController;
use App\Http\Controllers\AnnouncementController;
use App\Http\Controllers\StudentDashboardController;
use App\Http\Controllers\StudentRegistrationController;
use App\Http\Controllers\StudentScoreController;
use App\Http\Controllers\SubjectController;
use App\Http\Controllers\UserController;
use App\Models\AcademicYear;
use App\Models\ActivityRequirement;
use App\Models\ActivitySchedule;
use App\Models\AdmissionPath;
use App\Models\MadrasahSetting;
use App\Models\PopUpBanner;
use App\Models\Registration;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    $madrasah = MadrasahSetting::first();
    $activeYear = AcademicYear::where('is_active', true)->first();

    $schedules = $activeYear
        ? ActivitySchedule::where('academic_year_id', $activeYear->id)
            ->where('is_active', true)
            ->orderBy('order')
            ->orderBy('start_date')
            ->get()
        : collect();

    $activityRequirements = $activeYear
        ? ActivityRequirement::where('academic_year_id', $activeYear->id)
            ->orderBy('order')
            ->get()
        : collect();

    $popUpBanners = PopUpBanner::where('is_active', true)
        ->orderBy('created_at', 'desc')
        ->get();

    $paths = AdmissionPath::where('is_active', true)->get();

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
        'paths' => $paths,
    ]);
})->name('welcome');

Route::get('/dashboard', function () {
    $user = auth()->user();

    if ($user->role === 'kepala_madrasah') {
        $activeYear = AcademicYear::where('is_active', true)->first();

        $totalRegistrations = Registration::when($activeYear, fn ($q) => $q->where('academic_year_id', $activeYear->id))->count();
        $statusCounts = Registration::when($activeYear, fn ($q) => $q->where('academic_year_id', $activeYear->id))
            ->selectRaw('status, count(*) as count')
            ->groupBy('status')
            ->pluck('count', 'status');

        $perPath = AdmissionPath::where('is_active', true)->get()->map(function ($path) use ($activeYear) {
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

        $recentRegistrations = Registration::when($activeYear, fn ($q) => $q->where('academic_year_id', $activeYear->id))
            ->with(['user', 'studentBiodata', 'admissionPath'])
            ->latest()
            ->take(5)
            ->get();

        return Inertia::render('KepalaMadrasah/Dashboard', [
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

    $activeYear = AcademicYear::where('is_active', true)->first();

    $paths = AdmissionPath::where('is_active', true)->get()->map(function ($path) {
        return [
            'id' => $path->id,
            'name' => $path->name,
            'quota' => $path->quota,
            'available_quota' => $path->available_quota,
            'total_registered' => $path->registrations()->whereIn('status', ['pending', 'accepted', 'reserve'])->count(),
        ];
    });

    $totalRegistrations = Registration::when($activeYear, fn ($q) => $q->where('academic_year_id', $activeYear->id))->count();
    $statusCounts = Registration::when($activeYear, fn ($q) => $q->where('academic_year_id', $activeYear->id))
        ->selectRaw('status, count(*) as count')
        ->groupBy('status')
        ->pluck('count', 'status');

    $recentRegistrations = Registration::when($activeYear, fn ($q) => $q->where('academic_year_id', $activeYear->id))
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
    Route::resource('users', UserController::class)
        ->except(['show']);
    Route::post('/users/{user}/reset-password', [UserController::class, 'resetPassword'])
        ->name('users.reset-password');

    Route::resource('academic-years', AcademicYearController::class)
        ->except(['show', 'create', 'edit']);
    Route::patch('/academic-years/{academicYear}/toggle-active', [AcademicYearController::class, 'toggleActive'])
        ->name('academic-years.toggle-active');

    Route::resource('document-types', DocumentTypeController::class)
        ->except(['show', 'create', 'edit']);

    Route::get('/madrasah-settings', [MadrasahSettingController::class, 'edit'])
        ->name('madrasah-settings.edit');
    Route::patch('/madrasah-settings', [MadrasahSettingController::class, 'update'])
        ->name('madrasah-settings.update');

    Route::resource('admission-paths', AdmissionPathController::class)
        ->except(['show', 'create']);

    Route::resource('subjects', SubjectController::class)
        ->except(['show', 'create']);

    Route::resource('activity-schedules', ActivityScheduleController::class)
        ->except(['show', 'create', 'edit']);

    Route::resource('activity-requirements', ActivityRequirementController::class)
        ->except(['show', 'create', 'edit']);

    Route::resource('pop-up-banners', PopUpBannerController::class)
        ->except(['show', 'create', 'edit']);
    Route::patch('/pop-up-banners/{popUpBanner}/toggle-active', [PopUpBannerController::class, 'toggleActive'])
        ->name('pop-up-banners.toggle-active');

    // Backup & Restore
    Route::get('/backups', [BackupController::class, 'index'])->name('backups.index');
    Route::post('/backups', [BackupController::class, 'store'])->name('backups.store');
    Route::get('/backups/download/{filename}', [BackupController::class, 'download'])->name('backups.download');
    Route::post('/backups/restore', [BackupController::class, 'restore'])->name('backups.restore');
    Route::delete('/backups/{filename}', [BackupController::class, 'destroy'])->name('backups.destroy');

    Route::get('/announcement', [AnnouncementController::class, 'index'])
        ->name('announcement.index');

    // Registration routes moved below to allow operator role as well
});

Route::middleware(['auth', 'verified', 'role:admin,operator'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/verification', [VerificationController::class, 'index'])
        ->name('verification.index');
    Route::get('/registrations/by-path', [RegistrationController::class, 'byPath'])
        ->name('registrations.by-path');
    Route::get('/registrations/report/pdf', [RegistrationController::class, 'downloadReport'])
        ->name('registrations.report.pdf');
    Route::get('/registrations', [RegistrationController::class, 'index'])
        ->name('registrations.index');
    Route::post('/registrations/{registration}/claim', [RegistrationController::class, 'claim'])
        ->name('registrations.claim');
    Route::post('/registrations/{registration}/complete', [RegistrationController::class, 'complete'])
        ->name('registrations.complete');
    Route::post('/registrations/{registration}/release', [RegistrationController::class, 'release'])
        ->name('registrations.release');
    Route::patch('/registrations/{registration}/status', [RegistrationController::class, 'updateStatus'])
        ->name('registrations.status.update');
    Route::patch('/registrations/{registration}/biodata', [RegistrationController::class, 'updateBiodata'])
        ->name('registrations.biodata.update');
    Route::patch('/registrations/{registration}/reset', [RegistrationController::class, 'reset'])
        ->name('registrations.reset');
    Route::get('/print/registration-proof/{registration}', [PrintController::class, 'registrationProof'])
        ->name('print.registration-proof');
    Route::get('/print/decision-letter/{registration}', [PrintController::class, 'decisionLetter'])
        ->name('print.decision-letter');
    Route::get('/registrations/{registration}/scores', [ScoreController::class, 'edit'])
        ->name('registrations.scores.edit');
    Route::patch('/registrations/{registration}/scores', [ScoreController::class, 'update'])
        ->name('registrations.scores.update');
});

Route::middleware(['auth', 'verified'])->prefix('student')->name('student.')->group(function () {
    Route::get('/dashboard', [StudentDashboardController::class, 'index'])
        ->name('dashboard');
    Route::get('/biodata', [StudentDashboardController::class, 'biodata'])
        ->name('biodata');
    Route::get('/dokumen', [StudentDashboardController::class, 'documents'])
        ->name('documents');
    Route::get('/scores', [StudentScoreController::class, 'edit'])
        ->name('scores.edit');
    Route::patch('/scores', [StudentScoreController::class, 'update'])
        ->name('scores.update');
    Route::get('/print', [PrintController::class, 'studentRegistrationProof'])
        ->name('print.proof');
});

Route::middleware(['auth', 'registration.open'])->prefix('daftar')->name('student.registration.')->group(function () {
    Route::get('/', [StudentRegistrationController::class, 'show'])
        ->name('show');
    Route::post('/', [StudentRegistrationController::class, 'store'])
        ->name('store');
    Route::post('/biodata', [StudentRegistrationController::class, 'updateBiodata'])
        ->name('biodata');
    Route::post('/dokumen', [StudentRegistrationController::class, 'uploadDocument'])
        ->name('document');
    Route::delete('/dokumen/{document}', [StudentRegistrationController::class, 'deleteDocument'])
        ->name('document.delete');
    Route::post('/finalize', [StudentRegistrationController::class, 'finalize'])
        ->name('finalize');
});

require __DIR__.'/auth.php';

