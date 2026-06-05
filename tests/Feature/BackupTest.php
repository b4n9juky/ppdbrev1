<?php

use App\Http\Controllers\BackupController;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

test('admin can view backups page', function () {
    $admin = User::create([
        'name' => 'Admin User',
        'email' => 'admin_backup@ppdb.ma',
        'password' => bcrypt('password'),
        'role' => 'admin',
    ]);
    $admin->email_verified_at = now();
    $admin->save();

    // Create a dummy backup file to verify it displays
    Storage::fake('local');
    $backupDir = storage_path('app/backups');
    if (! is_dir($backupDir)) {
        mkdir($backupDir, 0755, true);
    }
    $dummyFile = $backupDir.'/backup_2026-06-05_120000.sql';
    file_put_contents($dummyFile, 'SELECT 1;');

    $response = $this->actingAs($admin)->get(route('admin.backups.index'));
    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => $page
        ->component('Admin/Backup/Index')
        ->has('backups')
    );

    // Clean up
    if (file_exists($dummyFile)) {
        unlink($dummyFile);
    }
});

test('student cannot view backups page', function () {
    $student = User::create([
        'name' => 'Student User',
        'email' => 'student_backup@ppdb.ma',
        'password' => bcrypt('password'),
        'role' => 'student',
    ]);
    $student->email_verified_at = now();
    $student->save();

    $response = $this->actingAs($student)->get(route('admin.backups.index'));
    $response->assertStatus(403);
});

test('admin can create backup successfully', function () {
    $admin = User::create([
        'name' => 'Admin User',
        'email' => 'admin_backup2@ppdb.ma',
        'password' => bcrypt('password'),
        'role' => 'admin',
    ]);
    $admin->email_verified_at = now();
    $admin->save();

    // Set up a fake backup directory
    $backupDir = storage_path('app/backups');
    if (! is_dir($backupDir)) {
        mkdir($backupDir, 0755, true);
    }

    // Mock the BackupController
    $mock = Mockery::mock(BackupController::class)->makePartial();
    $mock->shouldAllowMockingProtectedMethods();
    $mock->shouldReceive('findBinary')
        ->with('mysqldump')
        ->andReturn('/usr/bin/mysqldump');

    $mock->shouldReceive('runShellCommand')
        ->once()
        ->andReturnUsing(function ($command) {
            // Find the output file path from command using regex and create a dummy file
            preg_match('/"([^"]+\.sql)"/', $command, $matches);
            if (! empty($matches[1])) {
                file_put_contents($matches[1], 'DUMMY SQL DATA');
            }

            return [
                'output' => ['Backup successful mocked'],
                'return_code' => 0,
            ];
        });

    $this->app->instance(BackupController::class, $mock);

    $response = $this->actingAs($admin)->post(route('admin.backups.store'));
    $response->assertRedirect(route('admin.backups.index'));
    $response->assertSessionHas('success');

    // Clean up created backups
    $files = glob($backupDir.'/*.sql');
    foreach ($files as $file) {
        if (file_exists($file)) {
            unlink($file);
        }
    }
});

test('admin can restore backup successfully', function () {
    $admin = User::create([
        'name' => 'Admin User',
        'email' => 'admin_backup3@ppdb.ma',
        'password' => bcrypt('password'),
        'role' => 'admin',
    ]);
    $admin->email_verified_at = now();
    $admin->save();

    // Mock the BackupController
    $mock = Mockery::mock(BackupController::class)->makePartial();
    $mock->shouldAllowMockingProtectedMethods();
    $mock->shouldReceive('findBinary')
        ->with('mysql')
        ->andReturn('/usr/bin/mysql');

    $mock->shouldReceive('runShellCommand')
        ->once()
        ->andReturn([
            'output' => ['Restore successful'],
            'return_code' => 0,
        ]);

    $this->app->instance(BackupController::class, $mock);

    Storage::fake('local');
    $file = UploadedFile::fake()->create('backup.sql', 100, 'text/plain');

    $response = $this->actingAs($admin)->post(route('admin.backups.restore'), [
        'backup_file' => $file,
    ]);

    $response->assertRedirect(route('admin.backups.index'));
    $response->assertSessionHas('success');
});

test('admin can download backup', function () {
    $admin = User::create([
        'name' => 'Admin User',
        'email' => 'admin_backup4@ppdb.ma',
        'password' => bcrypt('password'),
        'role' => 'admin',
    ]);
    $admin->email_verified_at = now();
    $admin->save();

    $backupDir = storage_path('app/backups');
    if (! is_dir($backupDir)) {
        mkdir($backupDir, 0755, true);
    }
    $dummyFile = $backupDir.'/backup_download.sql';
    file_put_contents($dummyFile, 'SELECT 1;');

    $response = $this->actingAs($admin)->get(route('admin.backups.download', 'backup_download.sql'));
    $response->assertStatus(200);
    $this->assertEquals('application/sql', $response->headers->get('Content-Type'));

    if (file_exists($dummyFile)) {
        unlink($dummyFile);
    }
});

test('admin can delete backup', function () {
    $admin = User::create([
        'name' => 'Admin User',
        'email' => 'admin_backup5@ppdb.ma',
        'password' => bcrypt('password'),
        'role' => 'admin',
    ]);
    $admin->email_verified_at = now();
    $admin->save();

    $backupDir = storage_path('app/backups');
    if (! is_dir($backupDir)) {
        mkdir($backupDir, 0755, true);
    }
    $dummyFile = $backupDir.'/backup_delete.sql';
    file_put_contents($dummyFile, 'SELECT 1;');

    $response = $this->actingAs($admin)->delete(route('admin.backups.destroy', 'backup_delete.sql'));
    $response->assertRedirect(route('admin.backups.index'));
    $response->assertSessionHas('success');
    $this->assertFileDoesNotExist($dummyFile);
});
