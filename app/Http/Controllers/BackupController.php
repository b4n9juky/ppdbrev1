<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class BackupController extends Controller
{
    /**
     * Display backup management page with list of existing backups.
     */
    public function index(): Response
    {
        $backups = $this->getBackupList();

        return Inertia::render('Admin/Backup/Index', [
            'backups' => $backups,
        ]);
    }

    /**
     * Create a new database backup using mysqldump.
     */
    public function store(): RedirectResponse
    {
        $dbHost = config('database.connections.mysql.host');
        $dbPort = config('database.connections.mysql.port');
        $dbName = config('database.connections.mysql.database');
        $dbUser = config('database.connections.mysql.username');
        $dbPass = config('database.connections.mysql.password');

        $backupDir = storage_path('app/backups');
        if (! is_dir($backupDir)) {
            mkdir($backupDir, 0755, true);
        }

        $filename = 'backup_'.date('Y-m-d_His').'.sql';
        $filepath = $backupDir.DIRECTORY_SEPARATOR.$filename;

        // Find mysqldump binary
        $mysqldump = $this->findBinary('mysqldump');

        if (! $mysqldump) {
            return Redirect::route('admin.backups.index')
                ->with('error', 'mysqldump tidak ditemukan di server. Pastikan MySQL/MariaDB sudah terinstall.');
        }

        // Build the mysqldump command
        $command = sprintf(
            '"%s" --host=%s --port=%s --user=%s %s --single-transaction --routines --triggers --add-drop-table "%s" > "%s" 2>&1',
            $mysqldump,
            escapeshellarg($dbHost),
            escapeshellarg($dbPort),
            escapeshellarg($dbUser),
            $dbPass ? '--password='.escapeshellarg($dbPass) : '',
            $dbName,
            $filepath
        );

        $result = $this->runShellCommand($command);

        if ($result['return_code'] !== 0 || ! file_exists($filepath) || filesize($filepath) === 0) {
            // Cleanup empty file if created
            if (file_exists($filepath)) {
                unlink($filepath);
            }

            return Redirect::route('admin.backups.index')
                ->with('error', 'Gagal membuat backup database. Error: '.implode("\n", $result['output']));
        }

        return Redirect::route('admin.backups.index')
            ->with('success', 'Backup database berhasil dibuat: '.$filename);
    }

    /**
     * Download a backup file.
     */
    public function download(string $filename): BinaryFileResponse|RedirectResponse
    {
        $filepath = storage_path('app/backups/'.basename($filename));

        if (! file_exists($filepath)) {
            return Redirect::route('admin.backups.index')
                ->with('error', 'File backup tidak ditemukan.');
        }

        return response()->download($filepath, $filename, [
            'Content-Type' => 'application/sql',
        ]);
    }

    /**
     * Restore the database from an uploaded SQL file.
     */
    public function restore(Request $request): RedirectResponse
    {
        $request->validate([
            'backup_file' => ['required', 'file', 'max:102400'], // max 100MB
        ], [
            'backup_file.required' => 'File backup wajib dipilih.',
            'backup_file.file' => 'File tidak valid.',
            'backup_file.max' => 'Ukuran file backup maksimal 100MB.',
        ]);

        $file = $request->file('backup_file');
        $extension = strtolower($file->getClientOriginalExtension());

        if (! in_array($extension, ['sql'])) {
            return Redirect::route('admin.backups.index')
                ->with('error', 'Format file harus .sql');
        }

        $dbHost = config('database.connections.mysql.host');
        $dbPort = config('database.connections.mysql.port');
        $dbName = config('database.connections.mysql.database');
        $dbUser = config('database.connections.mysql.username');
        $dbPass = config('database.connections.mysql.password');

        // Find mysql binary
        $mysql = $this->findBinary('mysql');

        if (! $mysql) {
            return Redirect::route('admin.backups.index')
                ->with('error', 'mysql client tidak ditemukan di server. Pastikan MySQL/MariaDB sudah terinstall.');
        }

        // Store the uploaded file temporarily
        $tempPath = $file->storeAs('backups/temp', 'restore_'.time().'.sql');
        $fullTempPath = storage_path('app/'.$tempPath);

        // Build the mysql import command
        $command = sprintf(
            '"%s" --host=%s --port=%s --user=%s %s "%s" < "%s" 2>&1',
            $mysql,
            escapeshellarg($dbHost),
            escapeshellarg($dbPort),
            escapeshellarg($dbUser),
            $dbPass ? '--password='.escapeshellarg($dbPass) : '',
            $dbName,
            $fullTempPath
        );

        $result = $this->runShellCommand($command);

        // Cleanup temp file
        if (file_exists($fullTempPath)) {
            unlink($fullTempPath);
        }

        // Cleanup temp directory
        $tempDir = storage_path('app/backups/temp');
        if (is_dir($tempDir) && count(scandir($tempDir)) <= 2) {
            rmdir($tempDir);
        }

        if ($result['return_code'] !== 0) {
            return Redirect::route('admin.backups.index')
                ->with('error', 'Gagal restore database. Error: '.implode("\n", $result['output']));
        }

        return Redirect::route('admin.backups.index')
            ->with('success', 'Database berhasil di-restore dari file yang diupload.');
    }

    /**
     * Delete a backup file.
     */
    public function destroy(string $filename): RedirectResponse
    {
        $filepath = storage_path('app/backups/'.basename($filename));

        if (! file_exists($filepath)) {
            return Redirect::route('admin.backups.index')
                ->with('error', 'File backup tidak ditemukan.');
        }

        unlink($filepath);

        return Redirect::route('admin.backups.index')
            ->with('success', 'File backup berhasil dihapus.');
    }

    /**
     * Get list of existing backup files with metadata.
     */
    protected function getBackupList(): array
    {
        $backupDir = storage_path('app/backups');

        if (! is_dir($backupDir)) {
            return [];
        }

        $files = glob($backupDir.DIRECTORY_SEPARATOR.'*.sql');
        $backups = [];

        foreach ($files as $file) {
            $backups[] = [
                'filename' => basename($file),
                'size' => filesize($file),
                'size_formatted' => $this->formatFileSize(filesize($file)),
                'created_at' => date('Y-m-d H:i:s', filemtime($file)),
            ];
        }

        // Sort by creation date descending (newest first)
        usort($backups, fn ($a, $b) => strcmp($b['created_at'], $a['created_at']));

        return $backups;
    }

    /**
     * Format file size to human readable format.
     */
    protected function formatFileSize(int $bytes): string
    {
        $units = ['B', 'KB', 'MB', 'GB'];
        $i = 0;
        $size = $bytes;

        while ($size >= 1024 && $i < count($units) - 1) {
            $size /= 1024;
            $i++;
        }

        return round($size, 2).' '.$units[$i];
    }

    protected function findBinary(string $name): ?string
    {
        // 1. Check custom path in .env/config first (e.g., MYSQLDUMP_PATH or MYSQL_PATH)
        $envKey = strtoupper($name).'_PATH';
        $customPath = env($envKey);
        if ($customPath) {
            if (file_exists($customPath)) {
                return $customPath;
            }

            return $customPath;
        }

        $isWindows = strtoupper(substr(PHP_OS, 0, 3)) === 'WIN';

        if ($isWindows) {
            // Common paths on Windows (Herd, XAMPP, MariaDB, MySQL)
            $commonPaths = [
                "C:\\Program Files\\MariaDB 12.2\\bin\\{$name}.exe",
                "C:\\Program Files\\MariaDB 11.4\\bin\\{$name}.exe",
                "C:\\Program Files\\MariaDB 10.11\\bin\\{$name}.exe",
                "C:\\Program Files\\MySQL\\MySQL Server 8.0\\bin\\{$name}.exe",
                "C:\\xampp\\mysql\\bin\\{$name}.exe",
                "C:\\laragon\\bin\\mysql\\mysql-8.0.30-winx64\\bin\\{$name}.exe",
            ];

            foreach ($commonPaths as $path) {
                if (file_exists($path)) {
                    return $path;
                }
            }

            // Try finding via `where` command on Windows
            $output = [];
            $returnCode = 0;
            exec("where {$name} 2>NUL", $output, $returnCode);

            if ($returnCode === 0 && ! empty($output[0])) {
                return trim($output[0]);
            }
        } else {
            // Common paths on Linux / macOS
            $commonPaths = [
                "/usr/bin/{$name}",
                "/usr/local/bin/{$name}",
                "/bin/{$name}",
                "/usr/sbin/{$name}",
                "/sbin/{$name}",
            ];

            foreach ($commonPaths as $path) {
                if (file_exists($path) && is_executable($path)) {
                    return $path;
                }
            }

            // Try finding via `which` command on Linux/macOS
            $output = [];
            $returnCode = 0;
            exec("which {$name} 2>/dev/null", $output, $returnCode);

            if ($returnCode === 0 && ! empty($output[0])) {
                return trim($output[0]);
            }
        }

        // Final fallback: check if we can run it globally
        $output = [];
        $returnCode = 0;
        $checkCmd = $isWindows ? "where {$name} 2>NUL" : "which {$name} 2>/dev/null";
        exec($checkCmd, $output, $returnCode);
        if ($returnCode === 0) {
            return $name;
        }

        return null;
    }

    /**
     * Run a shell command and return its output and return code.
     */
    protected function runShellCommand(string $command): array
    {
        $output = [];
        $returnCode = 0;
        exec($command, $output, $returnCode);

        return [
            'output' => $output,
            'return_code' => $returnCode,
        ];
    }
}
