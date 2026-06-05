<?php

namespace App\Http\Controllers;

use App\Models\AcademicYear;
use App\Models\AdmissionPath;
use App\Models\Registration;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class VerificationController extends Controller
{
    public function index(Request $request): Response
    {
        $activeYear = AcademicYear::where('is_active', true)->first();

        $search = $request->query('search', '');
        $perPage = (int) $request->query('per_page', 15);
        $pathFilter = $request->query('path', '');

        $registrations = Registration::withSum('subjectScores as total_score', 'scores')
            ->with([
                'studentBiodata',
                'admissionPath',
                'user',
                'studentDocuments',
                'assignedOperator',
            ])
            ->where('academic_year_id', $activeYear?->id)
            ->where('processing_status', 'selesai')
            ->when($pathFilter, fn ($q) => $q->where('admission_path_id', $pathFilter))
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

        $paths = AdmissionPath::where('is_active', true)->get(['id', 'name']);

        return Inertia::render('Admin/Verification/Index', [
            'registrations' => $registrations,
            'paths' => $paths,
            'filters' => [
                'search' => $search,
                'per_page' => $perPage,
                'path' => $pathFilter,
            ],
        ]);
    }
}
