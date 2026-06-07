<?php

namespace App\Http\Controllers;

use App\Models\AcademicYear;
use App\Models\AdmissionPath;
use App\Models\Registration;
use App\Models\RegistrationAuditLog;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminWorkspaceController extends Controller
{
    public function index(Request $request): Response
    {
        $activeYear = AcademicYear::where('is_active', true)->first();
        $activeYearId = $activeYear?->id;

        // === Shared: Path quota data ===
        $paths = AdmissionPath::where('is_active', true)->get()->map(fn ($path) => [
            'id' => $path->id,
            'name' => $path->name,
            'quota' => $path->quota,
            'total_registered' => $path->registrations()
                ->where('academic_year_id', $activeYearId)
                ->where('status', '!=', 'draft')
                ->count(),
            'available_quota' => max(0, $path->quota - $path->registrations()
                ->where('academic_year_id', $activeYearId)
                ->where('status', '!=', 'draft')
                ->count()),
        ]);

        // === Dashboard Tab ===
        $dashboardStats = [
            'total' => Registration::where('academic_year_id', $activeYearId)->where('status', '!=', 'draft')->count(),
            'baru' => Registration::where('academic_year_id', $activeYearId)->where('processing_status', 'baru')->count(),
            'diproses' => Registration::where('academic_year_id', $activeYearId)->where('processing_status', 'diproses')->count(),
            'selesai' => Registration::where('academic_year_id', $activeYearId)->where('processing_status', 'selesai')->count(),
            'accepted' => Registration::where('academic_year_id', $activeYearId)->where('status', 'accepted')->count(),
            'rejected' => Registration::where('academic_year_id', $activeYearId)->where('status', 'rejected')->count(),
            'reserve' => Registration::where('academic_year_id', $activeYearId)->where('status', 'reserve')->count(),
        ];

        $operatorActivity = User::where('role', 'operator')->get()->map(function ($operator) {
            $lastLog = RegistrationAuditLog::where('user_id', $operator->id)->latest()->first();
            return [
                'id' => $operator->id,
                'name' => $operator->name,
                'processed' => Registration::where('assigned_operator_id', $operator->id)->count(),
                'verified' => Registration::where('assigned_operator_id', $operator->id)->where('processing_status', 'selesai')->count(),
                'last_activity' => $lastLog?->created_at,
            ];
        });

        $recentActivities = RegistrationAuditLog::with('user')
            ->latest()
            ->take(10)
            ->get()
            ->map(fn ($log) => [
                'id' => $log->id,
                'user_name' => $log->user?->name,
                'action' => $log->action,
                'description' => $log->description,
                'created_at' => $log->created_at,
            ]);

        // === Monitoring Tab ===
        $search = $request->query('search', '');
        $pathFilter = $request->query('path', '');
        $statusFilter = $request->query('status', '');
        $processingFilter = $request->query('processing', '');
        $operatorFilter = $request->query('operator', '');
        $perPage = (int) $request->query('per_page', 15);

        $registrations = Registration::with([
            'studentBiodata', 'admissionPath', 'user', 'assignedOperator',
            'studentDocuments', 'subjectScores.subject',
        ])
            ->where('academic_year_id', $activeYearId)
            ->where('status', '!=', 'draft')
            ->when($pathFilter, fn ($q) => $q->where('admission_path_id', $pathFilter))
            ->when($statusFilter, fn ($q) => $q->where('status', $statusFilter))
            ->when($processingFilter, fn ($q) => $q->where('processing_status', $processingFilter))
            ->when($operatorFilter, fn ($q) => $q->where('assigned_operator_id', $operatorFilter))
            ->when($search, function ($q) use ($search) {
                $q->where(function ($sub) use ($search) {
                    $sub->whereHas('studentBiodata', fn ($sb) => $sb->where('full_name', 'like', "%{$search}%")->orWhere('nisn', 'like', "%{$search}%"))
                        ->orWhereHas('user', fn ($u) => $u->where('name', 'like', "%{$search}%"))
                        ->orWhere('id', is_numeric($search) ? $search : null);
                });
            })
            ->orderBy('created_at', 'desc')
            ->paginate($perPage)
            ->withQueryString();

        $operators = User::where('role', 'operator')->get(['id', 'name']);

        // === Selection Tab ===
        $selectionPathFilter = $request->query('selection_path', '');
        $selectionStatusFilter = $request->query('selection_status', '');

        $selectionPaths = AdmissionPath::where('is_active', true)->get()->map(function ($path) use ($activeYearId) {
            $verifiedQuery = $path->registrations()
                ->where('academic_year_id', $activeYearId)
                ->where('processing_status', 'selesai');
            return [
                'id' => $path->id,
                'name' => $path->name,
                'quota' => $path->quota,
                'verified' => (clone $verifiedQuery)->count(),
                'accepted' => (clone $verifiedQuery)->where('status', 'accepted')->count(),
                'pending' => (clone $verifiedQuery)->where('status', 'pending')->count(),
                'remaining' => max(0, $path->quota - (clone $verifiedQuery)->where('status', 'accepted')->count()),
            ];
        });

        $rankings = Registration::with(['studentBiodata', 'admissionPath', 'user'])
            ->where('academic_year_id', $activeYearId)
            ->where('processing_status', 'selesai')
            ->where('status', '!=', 'draft')
            ->when($selectionPathFilter, fn ($q) => $q->where('admission_path_id', $selectionPathFilter))
            ->when($selectionStatusFilter, fn ($q) => $q->where('status', $selectionStatusFilter))
            ->orderBy('total_score', 'desc')
            ->orderBy('created_at', 'asc')
            ->paginate($perPage)
            ->withQueryString();

        // === Announcement Tab ===
        $announcementSearch = $request->query('announcement_search', '');
        $announcementPathFilter = $request->query('announcement_path', '');
        $announcementStatusFilter = $request->query('announcement_status', '');
        $announcementPerPage = (int) $request->query('announcement_per_page', 15);

        $announcementRegistrations = Registration::with(['studentBiodata', 'admissionPath', 'user'])
            ->where('academic_year_id', $activeYearId)
            ->where('status', '!=', 'draft')
            ->where('processing_status', 'selesai')
            ->when($announcementPathFilter, fn ($q) => $q->where('admission_path_id', $announcementPathFilter))
            ->when($announcementStatusFilter, fn ($q) => $q->where('status', $announcementStatusFilter))
            ->when($announcementSearch, function ($q) use ($announcementSearch) {
                $q->where(function ($sub) use ($announcementSearch) {
                    $sub->whereHas('studentBiodata', fn ($sb) => $sb->where('full_name', 'like', "%{$announcementSearch}%")->orWhere('nisn', 'like', "%{$announcementSearch}%"))
                        ->orWhereHas('user', fn ($u) => $u->where('name', 'like', "%{$announcementSearch}%"));
                });
            })
            ->orderBy('total_score', 'desc')
            ->orderBy('created_at', 'asc')
            ->paginate($announcementPerPage)
            ->withQueryString();

        $announcementPaths = AdmissionPath::where('is_active', true)->get()->map(function ($path) use ($activeYearId) {
            $registeredCount = $path->registrations()
                ->where('academic_year_id', $activeYearId)
                ->where('processing_status', 'selesai')
                ->whereIn('status', ['pending', 'accepted', 'reserve'])
                ->count();
            return [
                'id' => $path->id,
                'name' => $path->name,
                'quota' => $path->quota,
                'available_quota' => $path->quota - $registeredCount,
                'total_registered' => $registeredCount,
            ];
        });

        $announcementStats = [
            'total' => Registration::where('academic_year_id', $activeYearId)->where('status', '!=', 'draft')->where('processing_status', 'selesai')->count(),
            'accepted' => Registration::where('academic_year_id', $activeYearId)->where('status', 'accepted')->where('processing_status', 'selesai')->count(),
            'reserve' => Registration::where('academic_year_id', $activeYearId)->where('status', 'reserve')->where('processing_status', 'selesai')->count(),
            'rejected' => Registration::where('academic_year_id', $activeYearId)->where('status', 'rejected')->where('processing_status', 'selesai')->count(),
            'pending' => Registration::where('academic_year_id', $activeYearId)->where('status', 'pending')->where('processing_status', 'selesai')->count(),
        ];

        return Inertia::render('Admin/Workspace', [
            'activeYear' => $activeYear,
            'dashboardStats' => $dashboardStats,
            'paths' => $paths,
            'operatorActivity' => $operatorActivity,
            'recentActivities' => $recentActivities,
            'monitoring' => [
                'registrations' => $registrations,
                'operators' => $operators,
                'filters' => [
                    'search' => $search,
                    'path' => $pathFilter,
                    'status' => $statusFilter,
                    'processing' => $processingFilter,
                    'operator' => $operatorFilter,
                    'per_page' => $perPage,
                ],
            ],
            'selectionData' => [
                'paths' => $selectionPaths,
                'rankings' => $rankings,
                'filters' => [
                    'path' => $selectionPathFilter,
                    'status' => $selectionStatusFilter,
                ],
            ],
            'announcement' => [
                'registrations' => $announcementRegistrations,
                'paths' => $announcementPaths,
                'stats' => $announcementStats,
                'filters' => [
                    'search' => $announcementSearch,
                    'path' => $announcementPathFilter,
                    'status' => $announcementStatusFilter,
                    'per_page' => $announcementPerPage,
                ],
            ],
        ]);
    }

    public function generateRanking(Request $request)
    {
        $activeYear = AcademicYear::where('is_active', true)->first();
        if (!$activeYear) {
            return back()->with('error', 'Tidak ada tahun ajaran aktif');
        }

        $paths = AdmissionPath::where('is_active', true)->get();
        $changed = 0;

        foreach ($paths as $path) {
            $acceptedCount = Registration::where('academic_year_id', $activeYear->id)
                ->where('admission_path_id', $path->id)
                ->where('status', 'accepted')
                ->count();

            $remainingQuota = max(0, $path->quota - $acceptedCount);

            if ($remainingQuota <= 0) {
                continue;
            }

            $pendingRegs = Registration::where('academic_year_id', $activeYear->id)
                ->where('admission_path_id', $path->id)
                ->where('processing_status', 'selesai')
                ->where('status', 'pending')
                ->orderBy('total_score', 'desc')
                ->orderBy('created_at', 'asc')
                ->get();

            foreach ($pendingRegs as $i => $reg) {
                $newStatus = $i < $remainingQuota ? 'accepted' : 'rejected';
                $reg->update(['status' => $newStatus]);
                RegistrationAuditLog::create([
                    'user_id' => $request->user()->id,
                    'registration_id' => $reg->id,
                    'action' => 'ranking_generate',
                    'description' => "Status diubah menjadi {$newStatus} oleh sistem ranking untuk jalur {$path->name}",
                ]);
                $changed++;
            }
        }

        $message = $changed > 0
            ? "Ranking berhasil digenerate untuk {$changed} pendaftar"
            : 'Tidak ada pendaftar yang perlu di-ranking';

        return back()->with('success', $message);
    }
}
