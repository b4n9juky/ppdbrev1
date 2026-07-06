<?php

use App\Http\Controllers\AcademicYearController;
use App\Http\Controllers\ActivityRequirementController;
use App\Http\Controllers\ActivityScheduleController;
use App\Http\Controllers\AdmissionPathController;
use App\Http\Controllers\BackupController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DocumentController;
use App\Http\Controllers\DocumentTypeController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\MadrasahSettingController;
use App\Http\Controllers\PopUpBannerController;
use App\Http\Controllers\PrintController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RegistrationController;
use App\Http\Controllers\ScoreController;
use App\Http\Controllers\StudentDashboardController;
use App\Http\Controllers\StudentRegistrationController;
use App\Http\Controllers\StudentScoreController;
use App\Http\Controllers\SubjectController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::get('storage/documents/{registration}/{filename}', [DocumentController::class, 'show'])
    ->middleware(['auth'])
    ->where('filename', '.*')
    ->name('documents.secure-show');

Route::get('/', [HomeController::class, 'index'])->name('welcome');

Route::get('/pengumuman', [App\Http\Controllers\AnnouncementController::class, 'index'])->name('announcement');

Route::get('/dashboard', [DashboardController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

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
    Route::post('/madrasah-settings', [MadrasahSettingController::class, 'update'])
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

    Route::get('/workspace', [App\Http\Controllers\AdminWorkspaceController::class, 'index'])
        ->name('workspace');

    Route::post('/selection/generate', [App\Http\Controllers\AdminWorkspaceController::class, 'generateRanking'])
        ->name('selection.generate');

});

Route::middleware(['auth', 'verified', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/registrations/report/pdf', [RegistrationController::class, 'downloadReport'])
        ->name('registrations.report.pdf');
    Route::get('/registrations/export-accepted', [RegistrationController::class, 'exportAcceptedExcel'])
        ->name('registrations.export-accepted');
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
    Route::patch('/registrations/{registration}/cancel-selection', [RegistrationController::class, 'cancelSelection'])
        ->name('registrations.cancel-selection');
    Route::patch('/registrations/{registration}/admission-path', [RegistrationController::class, 'updateAdmissionPath'])
        ->name('registrations.admission-path.update');
    Route::get('/registrations/documents/download-all', [RegistrationController::class, 'downloadAllDocuments'])
        ->name('registrations.download-all-documents');
    Route::get('/print/registration-proof/{registration}', [PrintController::class, 'registrationProof'])
        ->name('print.registration-proof');
    Route::get('/print/decision-letter/{registration}', [PrintController::class, 'decisionLetter'])
        ->name('print.decision-letter');
    Route::get('/print/student-statement/{registration}', [PrintController::class, 'studentStatement'])
        ->name('print.student-statement');
    Route::get('/print/parent-statement/{registration}', [PrintController::class, 'parentStatement'])
        ->name('print.parent-statement');
    Route::get('/print/participation-statement/{registration}', [PrintController::class, 'participationStatement'])
        ->name('print.participation-statement');
    Route::get('/print/biodata/{registration}', [PrintController::class, 'biodata'])
        ->name('print.biodata');
    Route::get('/registrations/{registration}/scores', [ScoreController::class, 'edit'])
        ->name('registrations.scores.edit');
    Route::patch('/registrations/{registration}/scores', [ScoreController::class, 'update'])
        ->name('registrations.scores.update');
    Route::post('/registrations/{registration}/note', [RegistrationController::class, 'saveNote'])
        ->name('registrations.note');
    Route::post('/registrations/{registration}/verify', [RegistrationController::class, 'verify'])
        ->name('registrations.verify');
    Route::post('/registrations/{registration}/reject-file', [RegistrationController::class, 'reject-file'])
        ->name('registrations.reject-file');
    Route::post('/registrations/{registration}/verify-re-registration', [RegistrationController::class, 'verifyReRegistration'])
        ->name('registrations.verify-re-registration');
    Route::post('/registrations/{registration}/reject-re-registration', [RegistrationController::class, 'rejectReRegistration'])
        ->name('registrations.reject-re-registration');
});

Route::middleware(['auth', 'verified', 'role:operator'])->prefix('operator')->name('operator.')->group(function () {
    Route::get('/dashboard', [App\Http\Controllers\Operator\DashboardController::class, 'index'])->name('dashboard');
    Route::get('/registrations', [App\Http\Controllers\Operator\RegistrationController::class, 'index'])->name('registrations.index');
    Route::post('/registrations/{registration}/claim', [App\Http\Controllers\Operator\RegistrationController::class, 'claim'])->name('registrations.claim');
    Route::post('/registrations/{registration}/complete', [App\Http\Controllers\Operator\RegistrationController::class, 'complete'])->name('registrations.complete');
    Route::post('/registrations/{registration}/release', [App\Http\Controllers\Operator\RegistrationController::class, 'release'])->name('registrations.release');
    Route::patch('/registrations/{registration}/biodata', [App\Http\Controllers\Operator\RegistrationController::class, 'updateBiodata'])->name('registrations.biodata.update');
    Route::patch('/registrations/{registration}/reset', [App\Http\Controllers\Operator\RegistrationController::class, 'reset'])->name('registrations.reset');
    Route::get('/registrations/{registration}/scores', [App\Http\Controllers\Operator\ScoreController::class, 'edit'])->name('registrations.scores.edit');
    Route::patch('/registrations/{registration}/scores', [App\Http\Controllers\Operator\ScoreController::class, 'update'])->name('registrations.scores.update');
    Route::post('/registrations/{registration}/note', [App\Http\Controllers\Operator\RegistrationController::class, 'saveNote'])->name('registrations.note');
    Route::post('/registrations/{registration}/verify', [App\Http\Controllers\Operator\RegistrationController::class, 'verify'])->name('registrations.verify');
    Route::post('/registrations/{registration}/reject-file', [App\Http\Controllers\Operator\RegistrationController::class, 'rejectFile'])->name('registrations.reject-file');
    Route::post('/registrations/{registration}/verify-re-registration', [App\Http\Controllers\Operator\RegistrationController::class, 'verifyReRegistration'])->name('registrations.verify-re-registration');
    Route::post('/registrations/{registration}/reject-re-registration', [App\Http\Controllers\Operator\RegistrationController::class, 'rejectReRegistration'])->name('registrations.reject-re-registration');
    Route::get('/print/registration-proof/{registration}', [PrintController::class, 'registrationProof'])->name('print.registration-proof');
    Route::get('/print/decision-letter/{registration}', [PrintController::class, 'decisionLetter'])->name('print.decision-letter');
    Route::get('/print/student-statement/{registration}', [PrintController::class, 'studentStatement'])->name('print.student-statement');
    Route::get('/print/parent-statement/{registration}', [PrintController::class, 'parentStatement'])->name('print.parent-statement');
    Route::get('/print/participation-statement/{registration}', [PrintController::class, 'participationStatement'])->name('print.participation-statement');
    Route::get('/print/biodata/{registration}', [PrintController::class, 'biodata'])->name('print.biodata');
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
    Route::get('/re-registration', [StudentDashboardController::class, 'reRegistration'])
        ->name('re-registration');
    Route::post('/re-registration', [StudentDashboardController::class, 'submitReRegistration'])
        ->name('re-registration.submit');
    Route::get('/print/decision-letter', [PrintController::class, 'studentDecisionLetter'])
        ->name('print.decision-letter');
    Route::get('/print/student-statement', [PrintController::class, 'studentPrintStudentStatement'])
        ->name('print.student-statement');
    Route::get('/print/parent-statement', [PrintController::class, 'studentPrintParentStatement'])
        ->name('print.parent-statement');
    Route::get('/print/participation-statement', [PrintController::class, 'studentPrintParticipationStatement'])
        ->name('print.participation-statement');
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

