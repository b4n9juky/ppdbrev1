<?php

namespace App\Http\Controllers;

use App\Models\AcademicYear;
use App\Models\AdmissionPath;
use App\Models\Registration;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AnnouncementController extends Controller
{
    public function index(Request $request): Response
    {
        $activeYear = AcademicYear::where('is_active', true)->first();

        $search = $request->query('search', '');
        $perPage = (int) $request->query('per_page', 15);
        $pathFilter = $request->query('path', '');
        $statusFilter = $request->query('status', '');

        $registrations = Registration::withSum('subjectScores as total_score', 'scores')
            ->with([
                'studentBiodata',
                'admissionPath',
                'user',
            ])
            ->where('academic_year_id', $activeYear?->id)
            ->where('status', '!=', 'draft')
            ->where('processing_status', 'selesai')
            ->when($pathFilter, fn ($q) => $q->where('admission_path_id', $pathFilter))
            ->when($statusFilter, fn ($q) => $q->where('status', $statusFilter))
            ->when($search, function ($q) use ($search) {
                $q->where(function ($sub) use ($search) {
                    $sub->whereHas('studentBiodata', function ($sb) use ($search) {
                        $sb->where('full_name', 'like', "%{$search}%")
                            ->orWhere('nisn', 'like', "%{$search}%");
                    })->orWhereHas('user', function ($u) use ($search) {
                        $u->where('name', 'like', "%{$search}%");
                    })->orWhereHas('admissionPath', function ($ap) use ($search) {
                        $ap->where('name', 'like', "%{$search}%");
                    });
                });
            })
            ->orderBy('total_score', 'desc')
            ->orderBy('created_at', 'asc')
            ->paginate($perPage)
            ->withQueryString();

        $paths = AdmissionPath::where('is_active', true)->get()->map(function ($path) {
            $totalQuota = $path->quota;
            $registeredCount = $path->registrations()
                ->where('processing_status', 'selesai')
                ->whereIn('status', ['pending', 'accepted', 'reserve'])
                ->count();

            return [
                'id' => $path->id,
                'name' => $path->name,
                'quota' => $totalQuota,
                'available_quota' => $totalQuota - $registeredCount,
                'total_registered' => $registeredCount,
            ];
        });

        $stats = [
            'total' => Registration::where('academic_year_id', $activeYear?->id)->where('status', '!=', 'draft')->where('processing_status', 'selesai')->count(),
            'accepted' => Registration::where('academic_year_id', $activeYear?->id)->where('status', 'accepted')->where('processing_status', 'selesai')->count(),
            'reserve' => Registration::where('academic_year_id', $activeYear?->id)->where('status', 'reserve')->where('processing_status', 'selesai')->count(),
            'rejected' => Registration::where('academic_year_id', $activeYear?->id)->where('status', 'rejected')->where('processing_status', 'selesai')->count(),
            'pending' => Registration::where('academic_year_id', $activeYear?->id)->where('status', 'pending')->where('processing_status', 'selesai')->count(),
        ];

        return Inertia::render('Admin/Announcement/Index', [
            'registrations' => $registrations,
            'paths' => $paths,
            'stats' => $stats,
            'filters' => [
                'search' => $search,
                'per_page' => $perPage,
                'path' => $pathFilter,
                'status' => $statusFilter,
            ],
        ]);
    }
}
