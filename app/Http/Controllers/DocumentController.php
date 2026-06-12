<?php

namespace App\Http\Controllers;

use App\Models\Registration;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class DocumentController extends Controller
{
    public function show(Registration $registration, string $filename): BinaryFileResponse
    {
        $user = auth()->user();

        // Otorisasi: Admin, Operator, Kepala Madrasah, atau Siswa pemilik pendaftaran tersebut
        if (
            in_array($user->role, ['admin', 'operator', 'kepala_madrasah']) ||
            $user->id === $registration->user_id
        ) {
            $localPath = 'documents/' . $registration->id . '/' . $filename;

            // 1. Coba cari di disk privat 'local'
            if (Storage::disk('local')->exists($localPath)) {
                $fullPath = Storage::disk('local')->path($localPath);
                return response()->file($fullPath);
            }

            // 2. Fallback untuk data lama yang masih ada di disk 'public'
            if (Storage::disk('public')->exists($localPath)) {
                $fullPath = Storage::disk('public')->path($localPath);
                return response()->file($fullPath);
            }

            abort(404, 'File tidak ditemukan.');
        }

        abort(403, 'Unauthorized.');
    }
}
