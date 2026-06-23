<?php

namespace App\Http\Controllers\Operator;

use App\Http\Controllers\Controller;
use App\Models\AcademicYear;
use App\Models\Registration;
use App\Models\RegistrationAuditLog;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $user = auth()->user();
        $activeYear = AcademicYear::where('is_active', true)->first();

        $activePathFilter = fn ($q) => $q->whereHas('admissionPath', fn ($ap) => $ap->where('is_active', true));

        // 1. Antrean Pendaftar (baru & not draft)
        $totalQueue = Registration::when($activeYear, fn ($q) => $q->where('academic_year_id', $activeYear->id))
            ->where('processing_status', 'baru')
            ->where('status', '!=', 'draft')
            ->where($activePathFilter)
            ->count();

        // 2. Sedang diproses oleh Operator bersangkutan
        $myProcessingCount = Registration::when($activeYear, fn ($q) => $q->where('academic_year_id', $activeYear->id))
            ->where('processing_status', 'diproses')
            ->where('assigned_operator_id', $user->id)
            ->where($activePathFilter)
            ->count();

        // 3. Selesai diverifikasi oleh Operator bersangkutan (unik pendaftar)
        $myCompletedCount = RegistrationAuditLog::where('user_id', $user->id)
            ->whereIn('action', ['verify', 'reject-file'])
            ->distinct('registration_id')
            ->count();

        // 4. Aktivitas Terbaru Operator bersangkutan
        $recentActivities = RegistrationAuditLog::with(['registration.studentBiodata', 'registration.user'])
            ->where('user_id', $user->id)
            ->latest()
            ->take(5)
            ->get();

        return Inertia::render('Operator/Dashboard', [
            'totalQueue' => $totalQueue,
            'myProcessingCount' => $myProcessingCount,
            'myCompletedCount' => $myCompletedCount,
            'recentActivities' => $recentActivities,
            'activeYear' => $activeYear,
        ]);
    }
}
