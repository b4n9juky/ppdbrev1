<?php

namespace App\Services;

use App\Models\Registration;
use App\Models\RegistrationAuditLog;
use App\Models\User;
use Exception;
use Illuminate\Support\Facades\DB;

class RegistrationAssignmentService
{
    /**
     * Claim a registration.
     */
    public function claim(Registration $registration, User $operator): Registration
    {
        if ($operator->role !== 'operator') {
            throw new Exception('Hanya operator yang dapat mengambil pendaftar.');
        }

        return DB::transaction(function () use ($registration, $operator) {
            $lockedReg = Registration::where('id', $registration->id)->lockForUpdate()->firstOrFail();

            if ($lockedReg->processing_status !== 'baru') {
                throw new Exception('Pendaftar ini sudah diambil atau diproses oleh operator lain.');
            }

            if ($lockedReg->status === 'draft') {
                throw new Exception('Operator tidak dapat memproses pendaftaran dengan status draft.');
            }

            $lockedReg->update([
                'assigned_operator_id' => $operator->id,
                'assigned_at' => now(),
                'processing_status' => 'diproses',
                'verification_notes' => 'Berkas anda diproses operator.',
            ]);

            $studentName = $lockedReg->studentBiodata?->full_name ?? $lockedReg->user?->name ?? 'Siswa';

            RegistrationAuditLog::create([
                'user_id' => $operator->id,
                'registration_id' => $lockedReg->id,
                'action' => 'claim',
                'description' => "Mengambil pendaftaran siswa {$studentName}.",
            ]);

            return $lockedReg;
        });
    }

    /**
     * Complete a registration.
     */
    public function complete(Registration $registration, User $operator): Registration
    {
        return DB::transaction(function () use ($registration, $operator) {
            $lockedReg = Registration::where('id', $registration->id)->lockForUpdate()->firstOrFail();

            if ($lockedReg->assigned_operator_id !== $operator->id) {
                throw new Exception('Anda hanya dapat menyelesaikan pendaftar yang ditugaskan kepada Anda.');
            }

            $lockedReg->update([
                'processing_status' => 'selesai',
            ]);

            $studentName = $lockedReg->studentBiodata?->full_name ?? $lockedReg->user?->name ?? 'Siswa';

            RegistrationAuditLog::create([
                'user_id' => $operator->id,
                'registration_id' => $lockedReg->id,
                'action' => 'complete',
                'description' => "Menyelesaikan verifikasi pendaftaran siswa {$studentName}.",
            ]);

            return $lockedReg;
        });
    }

    /**
     * Release a registration.
     */
    public function release(Registration $registration, User $user): Registration
    {
        return DB::transaction(function () use ($registration, $user) {
            $lockedReg = Registration::where('id', $registration->id)->lockForUpdate()->firstOrFail();

            if ($user->role !== 'admin' && $lockedReg->assigned_operator_id !== $user->id) {
                throw new Exception('Anda tidak memiliki wewenang untuk melepaskan pendaftar ini.');
            }

            $lockedReg->update([
                'assigned_operator_id' => null,
                'assigned_at' => null,
                'processing_status' => 'baru',
                'verification_notes' => 'berkas anda dalam antrian operator.',
            ]);

            $studentName = $lockedReg->studentBiodata?->full_name ?? $lockedReg->user?->name ?? 'Siswa';

            RegistrationAuditLog::create([
                'user_id' => $user->id,
                'registration_id' => $lockedReg->id,
                'action' => 'release',
                'description' => "Melepaskan pendaftaran siswa {$studentName}.",
            ]);

            return $lockedReg;
        });
    }
}
