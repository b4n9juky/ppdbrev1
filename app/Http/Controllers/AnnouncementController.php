<?php

namespace App\Http\Controllers;

use App\Models\AcademicYear;
use App\Models\AdmissionPath;
use App\Models\MadrasahSetting;
use App\Models\Registration;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AnnouncementController extends Controller
{
    public function index(Request $request): Response
    {
        $activeYear = AcademicYear::where('is_active', true)->first();
        $madrasah = MadrasahSetting::first();
        $paths = AdmissionPath::where('is_active', true)->get();

        $pathFilter = $request->query('path', $paths->first()?->id);
        $search = $request->query('search', '');
        $perPage = (int) $request->query('per_page', 25);

        $registrations = collect();
        if ($activeYear) {
            $registrations = Registration::with(['studentBiodata', 'admissionPath', 'user'])
                ->where('academic_year_id', $activeYear->id)
                ->where('status', 'accepted')
                ->where('processing_status', 'selesai')
                ->when($pathFilter, fn ($q) => $q->where('admission_path_id', $pathFilter))
                ->when($search, function ($q) use ($search) {
                    $q->where(function ($sub) use ($search) {
                        $sub->whereHas('studentBiodata', fn ($sb) => $sb->where('full_name', 'like', "%{$search}%")->orWhere('nisn', 'like', "%{$search}%"))
                            ->orWhereHas('user', fn ($u) => $u->where('name', 'like', "%{$search}%"))
                            ->when(is_numeric($search), fn ($q) => $q->orWhere('id', $search));
                    });
                })
                ->orderBy('total_score', 'desc')
                ->orderBy('created_at', 'asc')
                ->paginate($perPage)
                ->withQueryString()
                ->through(fn($reg) => [
                    'id' => $reg->id,
                    'nisn' => $reg->studentBiodata?->nisn ?? '-',
                    'name' => $reg->studentBiodata?->full_name ?? $reg->user?->name ?? '-',
                    'previous_school' => $reg->studentBiodata?->previous_school ?? '-',
                    'admission_path_id' => $reg->admission_path_id,
                    'total_score' => $reg->total_score,
                ]);
        }

        return Inertia::render('Announcement/Index', [
            'madrasah' => $madrasah,
            'activeYear' => $activeYear,
            'paths' => $paths,
            'registrations' => $registrations,
            'filters' => [
                'path' => $pathFilter,
                'search' => $search,
                'per_page' => $perPage,
            ],
        ]);
    }
}
