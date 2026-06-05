<?php

namespace Tests\Feature;

use App\Models\AcademicYear;
use App\Models\AdmissionPath;
use App\Models\Registration;
use App\Models\StudentDocument;
use App\Models\Subject;
use App\Models\SubjectScore;
use App\Models\User;
use App\Services\ScoringService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

uses(RefreshDatabase::class);

test('operator can view registration list and claim/complete/release registrations', function () {
    $activeYear = AcademicYear::create([
        'name' => '2026/2027',
        'is_active' => true,
    ]);

    $operator = User::create([
        'name' => 'Operator PPDB',
        'email' => 'operator@ppdb.ma',
        'password' => bcrypt('password'),
        'role' => 'operator',
    ]);
    $operator->email_verified_at = now();
    $operator->save();

    $student = User::create([
        'name' => 'Student User',
        'email' => 'student_claim@ppdb.ma',
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

    StudentDocument::create([
        'registration_id' => $registration->id,
        'document_type' => 'ijazah',
        'file_path' => 'documents/test.pdf',
    ]);

    $response = $this->actingAs($operator)->get(route('admin.registrations.index'));
    $response->assertOk();
    $response->assertSee('Student User');

    $response = $this->actingAs($operator)->post(route('admin.registrations.claim', $registration->id));
    $response->assertSessionHas('success');
    expect($registration->fresh()->processing_status)->toBe('diproses');
    expect($registration->fresh()->assigned_operator_id)->toBe($operator->id);

    $response = $this->actingAs($operator)->patch(route('admin.registrations.status.update', $registration->id), [
        'status' => 'accepted',
    ]);
    $response->assertForbidden();

    $secondOperator = User::create([
        'name' => 'Second Operator',
        'email' => 'operator2@ppdb.ma',
        'password' => bcrypt('password'),
        'role' => 'operator',
    ]);
    $secondOperator->email_verified_at = now();
    $secondOperator->save();

    $response = $this->actingAs($secondOperator)->post(route('admin.registrations.claim', $registration->id));
    $response->assertSessionHas('error');

    $response = $this->actingAs($operator)->post(route('admin.registrations.complete', $registration->id));
    $response->assertRedirect(route('admin.registrations.index'));
    expect($registration->fresh()->processing_status)->toBe('selesai');

    $response = $this->actingAs($operator)->patch(route('admin.registrations.status.update', $registration->id), [
        'status' => 'accepted',
    ], ['HTTP_REFERER' => route('admin.announcement.index')]);
    $response->assertSessionHas('success');
    expect($registration->fresh()->status)->toBe('accepted');

    $admin = User::create([
        'name' => 'Admin PPDB',
        'email' => 'admin_test@ppdb.ma',
        'password' => bcrypt('password'),
        'role' => 'admin',
    ]);
    $admin->email_verified_at = now();
    $admin->save();

    $response = $this->actingAs($admin)->post(route('admin.registrations.release', $registration->id));
    $response->assertRedirect(route('admin.registrations.index'));
    $registration = $registration->fresh();
    expect($registration->processing_status)->toBe('baru');
    expect($registration->assigned_operator_id)->toBeNull();
});

test('registrations passing score and document requirements are enforced', function () {
    $activeYear = AcademicYear::create([
        'name' => '2027/2028',
        'is_active' => true,
        'passing_score' => 75.00,
    ]);

    $admin = User::create([
        'name' => 'Admin User',
        'email' => 'admin_passing@ppdb.ma',
        'password' => bcrypt('password'),
        'role' => 'admin',
    ]);
    $admin->email_verified_at = now();
    $admin->save();

    $student = User::create([
        'name' => 'Student User',
        'email' => 'student_passing@ppdb.ma',
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

    $subject = Subject::create([
        'academic_year_id' => $activeYear->id,
        'name' => 'Matematika',
        'is_active' => true,
    ]);

    // 1. Save scores below passing score (e.g. 70.00)
    // Should NOT auto-reject ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â just save scores without touching status
    app(ScoringService::class)->saveScores($registration, [
        [
            'subject_id' => $subject->id,
            'scores' => 70.00,
        ],
    ]);

    expect($registration->fresh()->total_score)->toEqual(70.00);
    expect(Registration::find($registration->id)->status)->toBe('pending');

    // 2. Admin tries to set status to accepted for student below passing score
    // Should auto-reject to rejected status
    $response = $this->actingAs($admin)->patch(route('admin.registrations.status.update', $registration->id), [
        'status' => 'accepted',
    ], ['HTTP_REFERER' => route('admin.announcement.index')]);
    $response->assertSessionHas('success');
    expect(Registration::find($registration->id)->status)->toBe('rejected');

    // 3. Update score to pass (e.g. 80.00)
    app(ScoringService::class)->saveScores($registration, [
        [
            'subject_id' => $subject->id,
            'scores' => 80.00,
        ],
    ]);
    // Status remains rejected (scoring doesn't change status)
    expect(Registration::find($registration->id)->status)->toBe('rejected');
    // Reset to pending manually for next assertions
    $registration->refresh();
    $registration->update(['status' => 'pending']);

    // 4. Try to change status to accepted without any documents - should fail
    $response = $this->actingAs($admin)->patch(route('admin.registrations.status.update', $registration->id), [
        'status' => 'accepted',
    ]);
    $response->assertSessionHas('error');
    expect(Registration::find($registration->id)->status)->toBe('pending');

    // 5. Add a document
    StudentDocument::create([
        'registration_id' => $registration->id,
        'document_type' => 'ijazah',
        'file_path' => 'documents/test.pdf',
    ]);

    // 6. Change status to accepted with document and passing score - should succeed
    $response = $this->actingAs($admin)->patch(route('admin.registrations.status.update', $registration->id), [
        'status' => 'accepted',
    ], ['HTTP_REFERER' => route('admin.announcement.index')]);
    $response->assertSessionHas('success');
    expect($registration->fresh()->status)->toBe('accepted');
});

test('auto-reserve when quota is full', function () {
    $activeYear = AcademicYear::create([
        'name' => '2028/2029',
        'is_active' => true,
        'passing_score' => 70.00,
    ]);

    $admin = User::create([
        'name' => 'Admin Quota',
        'email' => 'admin_quota@ppdb.ma',
        'password' => bcrypt('password'),
        'role' => 'admin',
    ]);
    $admin->email_verified_at = now();
    $admin->save();

    // Path with quota of 1
    $admissionPath = AdmissionPath::create([
        'name' => 'Prestasi',
        'quota' => 1,
        'is_active' => true,
    ]);

    $subject = Subject::create([
        'academic_year_id' => $activeYear->id,
        'name' => 'Matematika',
        'is_active' => true,
    ]);

    // Student 1 ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â already accepted (fills the quota)
    $student1 = User::create([
        'name' => 'Student One',
        'email' => 'student1@ppdb.ma',
        'password' => bcrypt('password'),
        'role' => 'student',
    ]);
    $student1->email_verified_at = now();
    $student1->save();

    $reg1 = Registration::create([
        'user_id' => $student1->id,
        'academic_year_id' => $activeYear->id,
        'admission_path_id' => $admissionPath->id,
        'status' => 'pending',
    ]);
    StudentDocument::create([
        'registration_id' => $reg1->id,
        'document_type' => 'ijazah',
        'file_path' => 'documents/test.pdf',
    ]);
    app(ScoringService::class)->saveScores($reg1, [
        ['subject_id' => $subject->id, 'scores' => 90.00],
    ]);
    $reg1->update(['status' => 'accepted']);

    // Student 2 ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â meets passing score but quota is full ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¾ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ should become reserve
    $student2 = User::create([
        'name' => 'Student Two',
        'email' => 'student2@ppdb.ma',
        'password' => bcrypt('password'),
        'role' => 'student',
    ]);
    $student2->email_verified_at = now();
    $student2->save();

    $reg2 = Registration::create([
        'user_id' => $student2->id,
        'academic_year_id' => $activeYear->id,
        'admission_path_id' => $admissionPath->id,
        'status' => 'pending',
    ]);
    StudentDocument::create([
        'registration_id' => $reg2->id,
        'document_type' => 'ijazah',
        'file_path' => 'documents/test.pdf',
    ]);
    app(ScoringService::class)->saveScores($reg2, [
        ['subject_id' => $subject->id, 'scores' => 85.00],
    ]);

    // Try to accept ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â should auto-reserve because quota is full
    $response = $this->actingAs($admin)->patch(route('admin.registrations.status.update', $reg2->id), [
        'status' => 'accepted',
    ], ['HTTP_REFERER' => route('admin.announcement.index')]);
    $response->assertSessionHas('success');
    expect($reg2->fresh()->status)->toBe('reserve');
});