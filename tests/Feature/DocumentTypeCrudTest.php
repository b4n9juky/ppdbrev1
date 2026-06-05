<?php

use App\Models\AcademicYear;
use App\Models\AdmissionPath;
use App\Models\DocumentType;
use App\Models\Registration;
use App\Models\StudentDocument;
use App\Models\User;

test('admin can view document types list', function () {
    $admin = User::create([
        'name' => 'Admin User',
        'email' => 'admin_doc@ppdb.ma',
        'password' => bcrypt('password'),
        'role' => 'admin',
    ]);
    $admin->email_verified_at = now();
    $admin->save();

    $response = $this->actingAs($admin)->get(route('admin.document-types.index'));
    $response->assertStatus(200);
});

test('admin can create a new document type', function () {
    $admin = User::create([
        'name' => 'Admin User',
        'email' => 'admin_doc2@ppdb.ma',
        'password' => bcrypt('password'),
        'role' => 'admin',
    ]);
    $admin->email_verified_at = now();
    $admin->save();

    $response = $this->actingAs($admin)->post(route('admin.document-types.store'), [
        'code' => 'kartu_kip',
        'name' => 'Kartu KIP',
        'is_required' => false,
    ]);

    $response->assertRedirect(route('admin.document-types.index'));
    $this->assertDatabaseHas('document_types', [
        'code' => 'kartu_kip',
        'name' => 'Kartu KIP',
        'is_required' => false,
    ]);
});

test('admin can update a document type', function () {
    $admin = User::create([
        'name' => 'Admin User',
        'email' => 'admin_doc3@ppdb.ma',
        'password' => bcrypt('password'),
        'role' => 'admin',
    ]);
    $admin->email_verified_at = now();
    $admin->save();

    $docType = DocumentType::create([
        'code' => 'sertifikat',
        'name' => 'Sertifikat',
        'is_required' => false,
    ]);

    $response = $this->actingAs($admin)->put(route('admin.document-types.update', $docType->id), [
        'code' => 'sertifikat_edited',
        'name' => 'Sertifikat Lomba',
        'is_required' => true,
    ]);

    $response->assertRedirect(route('admin.document-types.index'));
    $this->assertDatabaseHas('document_types', [
        'id' => $docType->id,
        'code' => 'sertifikat_edited',
        'name' => 'Sertifikat Lomba',
        'is_required' => true,
    ]);
});

test('admin can delete unused document type', function () {
    $admin = User::create([
        'name' => 'Admin User',
        'email' => 'admin_doc4@ppdb.ma',
        'password' => bcrypt('password'),
        'role' => 'admin',
    ]);
    $admin->email_verified_at = now();
    $admin->save();

    $docType = DocumentType::create([
        'code' => 'temp_doc',
        'name' => 'Temp Doc',
        'is_required' => false,
    ]);

    $response = $this->actingAs($admin)->delete(route('admin.document-types.destroy', $docType->id));
    $response->assertRedirect(route('admin.document-types.index'));
    $this->assertDatabaseMissing('document_types', [
        'id' => $docType->id,
    ]);
});

test('admin cannot delete document type in use by registrants', function () {
    $admin = User::create([
        'name' => 'Admin User',
        'email' => 'admin_doc5@ppdb.ma',
        'password' => bcrypt('password'),
        'role' => 'admin',
    ]);
    $admin->email_verified_at = now();
    $admin->save();

    $docType = DocumentType::create([
        'code' => 'in_use_doc',
        'name' => 'In Use Doc',
        'is_required' => false,
    ]);

    $student = User::create([
        'name' => 'Student User',
        'email' => 'student_doc@ppdb.ma',
        'password' => bcrypt('password'),
        'role' => 'student',
    ]);
    $student->email_verified_at = now();
    $student->save();

    $activeYear = AcademicYear::create(['name' => '2026/2027', 'is_active' => true]);
    $admissionPath = AdmissionPath::create(['name' => 'Zonasi', 'quota' => 100, 'is_active' => true]);

    $registration = Registration::create([
        'user_id' => $student->id,
        'academic_year_id' => $activeYear->id,
        'admission_path_id' => $admissionPath->id,
        'status' => 'draft',
    ]);

    StudentDocument::create([
        'registration_id' => $registration->id,
        'document_type' => 'in_use_doc',
        'file_path' => 'documents/test.pdf',
    ]);

    $response = $this->actingAs($admin)->delete(route('admin.document-types.destroy', $docType->id));
    $response->assertSessionHas('error');
    $this->assertDatabaseHas('document_types', [
        'id' => $docType->id,
    ]);
});

test('non-admin cannot access document types configuration', function () {
    $student = User::create([
        'name' => 'Student User',
        'email' => 'student_doc2@ppdb.ma',
        'password' => bcrypt('password'),
        'role' => 'student',
    ]);
    $student->email_verified_at = now();
    $student->save();

    $response = $this->actingAs($student)->get(route('admin.document-types.index'));
    $response->assertStatus(403);
});
