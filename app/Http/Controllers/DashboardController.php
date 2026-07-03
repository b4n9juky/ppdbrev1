<?php

namespace App\Http\Controllers;

use App\Models\AcademicYear;
use App\Models\AdmissionPath;
use App\Models\Registration;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response|RedirectResponse
    {
        $user = auth()->user();

        if ($user->role === 'kepala_madrasah') {
            $activeYear = AcademicYear::where('is_active', true)->first();

            $totalRegistrations = Registration::when($activeYear, fn ($q) => $q->where('academic_year_id', $activeYear->id))->count();
            $statusCounts = Registration::when($activeYear, fn ($q) => $q->where('academic_year_id', $activeYear->id))
                ->selectRaw('status, count(*) as count')
                ->groupBy('status')
                ->pluck('count', 'status');

            $perPath = AdmissionPath::all()->map(function ($path) use ($activeYear) {
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
                ->where($activePathFilter)
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
            return redirect()->route('operator.dashboard');
        }

        if ($user->role !== 'admin') {
            return redirect()->route('student.dashboard');
        }

        $activeYear = AcademicYear::where('is_active', true)->first();

        $paths = AdmissionPath::all()->map(function ($path) {
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
    }
}
