<?php

use App\Models\AcademicYear;
use App\Models\AdmissionPath;
use App\Models\Registration;
use App\Models\StudentDocument;
use App\Models\Subject;
use App\Models\User;
use App\Services\ScoringService;

test('operator can view registration list and claim/complete/release registrations', function () {
    $activeYear = AcademicYear::create(['name' => '2026/2027', 'is_active' => true]);

    $operator = User::create([
        'name' => 'Operator PPDB',
        'email' => 'operator@ppdb.ma',
        'password' => bcrypt('password'),
        'role' => 'operator',
    ]);
    $operator->email_verified_at = now();
    $operator->save();

    $student = User::create([
        'name' => 'Student PPDB',
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

    StudentDocument::create([
        'registration_id' => $registration->id,
        'document_type' => 'ijazah',
        'file_path' => 'documents/test.pdf',
    ]);

    // Operator can access the registrations index page
    $response = $this->actingAs($operator)->get(route('admin.registrations.index'));
    $response->assertStatus(200);

    // Operator cannot claim a draft registration
    $draftRegistration = Registration::create([
        'user_id' => $student->id,
        'academic_year_id' => $activeYear->id,
        'admission_path_id' => $admissionPath->id,
        'status' => 'draft',
    ]);
    $response = $this->actingAs($operator)->post(route('admin.registrations.claim', $draftRegistration->id));
    $response->assertSessionHas('error');
    expect($draftRegistration->fresh()->processing_status)->toBe('baru');

    // Operator can claim a new registration
    $response = $this->actingAs($operator)->post(route('admin.registrations.claim', $registration->id));
    $response->assertRedirect(route('admin.registrations.index'));

    $registration = $registration->fresh();
    expect($registration->processing_status)->toBe('diproses');
    expect($registration->assigned_operator_id)->toBe($operator->id);

    // Operator cannot update status when processing_status is 'diproses'
    $response = $this->actingAs($operator)->patch(route('admin.registrations.status.update', $registration->id), [
        'status' => 'accepted',
    ]);
    $response->assertStatus(403);

    // Another operator cannot edit it or claim it
    $otherOperator = User::create([
        'name' => 'Other Operator',
        'email' => 'other@ppdb.ma',
        'password' => bcrypt('password'),
        'role' => 'operator',
    ]);
    $otherOperator->email_verified_at = now();
    $otherOperator->save();

    $response = $this->actingAs($otherOperator)->post(route('admin.registrations.claim', $registration->id));
    $response->assertStatus(302); // Redirect back with error

    // Operator can complete the registration
    $response = $this->actingAs($operator)->post(route('admin.registrations.complete', $registration->id));
    $response->assertRedirect(route('admin.registrations.index'));
    expect($registration->fresh()->processing_status)->toBe('selesai');

    // Operator can update the status of the registration (diterima utama, cadangan, ditolak)
    $response = $this->actingAs($operator)->patch(route('admin.registrations.status.update', $registration->id), [
        'status' => 'accepted',
    ]);
    $response->assertRedirect(route('admin.registrations.index'));
    expect($registration->fresh()->status)->toBe('accepted');

    // Admin can delete/release the operator's process even if it is completed (selesai)
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
    // Check that it automatically updates status to 'rejected'
    app(ScoringService::class)->saveScores($registration, [
        [
            'subject_id' => $subject->id,
            'ijazah_score' => 70.00,
            'test_score' => 0.00,
        ],
    ]);

    expect($registration->fresh()->total_score)->toEqual(70.00);
    expect($registration->fresh()->status)->toBe('rejected');

    // 2. Try to change status to accepted for student below passing score - should fail
    $response = $this->actingAs($admin)->patch(route('admin.registrations.status.update', $registration->id), [
        'status' => 'accepted',
    ]);
    $response->assertSessionHas('error');
    expect($registration->fresh()->status)->toBe('rejected');

    // 3. Update score to pass (e.g. 80.00)
    app(ScoringService::class)->saveScores($registration, [
        [
            'subject_id' => $subject->id,
            'ijazah_score' => 80.00,
            'test_score' => 0.00,
        ],
    ]);
    // Status is updated to rejected if below, but since it is >= passing, status doesn't automatically change back to pending.
    // Let's reset the status manually to pending to test the next assertions.
    $registration->update(['status' => 'pending']);

    // 4. Try to change status to accepted without any documents - should fail
    $response = $this->actingAs($admin)->patch(route('admin.registrations.status.update', $registration->id), [
        'status' => 'accepted',
    ]);
    $response->assertSessionHas('error');
    expect($registration->fresh()->status)->toBe('pending');

    // 5. Add a document
    StudentDocument::create([
        'registration_id' => $registration->id,
        'document_type' => 'ijazah',
        'file_path' => 'documents/test.pdf',
    ]);

    // 6. Try to change status to accepted with document and passing score - should succeed
    $response = $this->actingAs($admin)->patch(route('admin.registrations.status.update', $registration->id), [
        'status' => 'accepted',
    ]);
    $response->assertRedirect(route('admin.registrations.index'));
    expect($registration->fresh()->status)->toBe('accepted');
});
