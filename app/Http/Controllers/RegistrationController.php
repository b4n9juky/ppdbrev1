<?php

namespace App\Http\Controllers;

use App\Models\AcademicYear;
use App\Models\AdmissionPath;
use App\Models\Registration;
use App\Models\SubjectScore;
use App\Models\Subject;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;
use App\Http\Requests\ClaimRegistrationRequest;
use App\Http\Requests\CompleteRegistrationRequest;
use App\Http\Requests\ReleaseRegistrationRequest;
use App\Http\Requests\UpdateRegistrationStatusRequest;
use App\Services\RegistrationAssignmentService;
use Exception;

class RegistrationController extends Controller
{
    public function byPath(): Response
    {
        $activeYear = AcademicYear::where('is_active', true)->first();

        $paths = AdmissionPath::where('is_active', true)
            ->with(['registrations' => function ($q) use ($activeYear) {
                $q->where('academic_year_id', $activeYear?->id)
                  ->with(['studentBiodata', 'user']);
            }])
            ->get()
            ->map(function ($path) {
                $regs = $path->registrations->map(function ($reg) {
                    return [
                        'id' => $reg->id,
                        'status' => $reg->status,
                        'total_score' => $reg->total_score,
                        'student_biodata' => $reg->studentBiodata,
                        'user' => $reg->user,
                        'assigned_operator_id' => $reg->assigned_operator_id,
                        'processing_status' => $reg->processing_status,
                    ];
                });

                $registeredCount = $path->registrations()
                    ->whereIn('status', ['pending', 'accepted', 'reserve'])
                    ->count();

                return [
                    'id' => $path->id,
                    'name' => $path->name,
                    'description' => $path->description,
                    'quota' => $path->quota,
                    'available_quota' => $path->quota - $registeredCount,
                    'registrations' => $regs,
                ];
            });

        return Inertia::render('Admin/Registration/ByPath', [
            'paths' => $paths,
        ]);
    }
    public function index(Request $request): Response
    {
        $activeYear = AcademicYear::where('is_active', true)->first();

        $sortField = $request->query('sort', 'created_at');
        $sortDirection = $request->query('direction', 'desc');
        $search = $request->query('search', '');
        $perPage = (int) $request->query('per_page', 15);
        $processingStatus = $request->query('processing_status', 'all');

        $registrations = Registration::with([
            'studentBiodata',
            'admissionPath',
            'user',
            'studentDocuments',
            'assignedOperator',
            'subjectScores.subject',
        ])
            ->when($activeYear, fn ($q) => $q->where('academic_year_id', $activeYear->id))
            ->when($processingStatus === 'baru', fn ($q) => $q->where('processing_status', 'baru'))
            ->when($processingStatus === 'my_processing', fn ($q) => $q->where('processing_status', 'diproses')->where('assigned_operator_id', auth()->id()))
            ->when($processingStatus === 'selesai', fn ($q) => $q->where('processing_status', 'selesai'))
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
            ->orderBy($sortField, $sortDirection)
            ->paginate($perPage)
            ->withQueryString();

        $paths = AdmissionPath::where('is_active', true)->get()->map(function ($path) {
            return [
                'id' => $path->id,
                'name' => $path->name,
                'quota' => $path->quota,
                'available_quota' => $path->available_quota,
                'total_registered' => $path->registrations()->whereIn('status', ['pending', 'accepted', 'reserve'])->count(),
            ];
        });

        $subjects = $activeYear
            ? Subject::where('academic_year_id', $activeYear->id)
                ->orderBy('name')
                ->get()
            : collect();

        return Inertia::render('Admin/Registration/Index', [
            'registrations' => $registrations,
            'paths' => $paths,
            'subjects' => $subjects,
            'filters' => [
                'sort' => $sortField,
                'direction' => $sortDirection,
                'search' => $search,
                'per_page' => $perPage,
                'processing_status' => $processingStatus,
            ],
        ]);
    }

    public function updateStatus(UpdateRegistrationStatusRequest $request, Registration $registration): RedirectResponse
    {
        \Illuminate\Support\Facades\Gate::authorize('update', $registration);

        if (in_array($request->status, ['accepted', 'reserve'])) {
            $passingScore = $registration->academicYear?->passing_score ?? 0.00;
            $totalScore = $registration->total_score ?? 0.00;

            if ($totalScore < $passingScore) {
                return Redirect::back()->with('error', 'Pendaftar tidak dapat diberikan status lulus/cadangan karena total nilai (' . number_format($totalScore, 2) . ') kurang dari nilai minimal kelulusan (' . number_format($passingScore, 2) . ').');
            }

            if ($registration->studentDocuments()->count() < 1) {
                return Redirect::back()->with('error', 'Pendaftar tidak dapat diberikan status lulus/cadangan karena belum mengunggah minimal 1 file dokumen.');
            }
        }

        $registration->update(['status' => $request->status]);

        $statusLabels = [
            'accepted' => 'diterima',
            'reserve' => 'dijadikan cadangan',
            'rejected' => 'ditolak',
        ];

        return Redirect::route('admin.registrations.index')
            ->with('success', 'Status pendaftar berhasil ' . ($statusLabels[$request->status] ?? 'diubah') . '.');
    }

    public function reset(Request $request, Registration $registration): RedirectResponse
    {
        \Illuminate\Support\Facades\Gate::authorize('update', $registration);

        if ($registration->status === 'draft') {
            return Redirect::back()->with('error', 'Pendaftar sudah dalam status draft.');
        }

        SubjectScore::where('registration_id', $registration->id)->delete();

        $registration->update([
            'status' => 'draft',
            'total_score' => null,
        ]);

        return Redirect::route('admin.registrations.index')
            ->with('success', 'Pendaftar berhasil direset. Siswa dapat memperbarui data kembali.');
    }

    public function claim(ClaimRegistrationRequest $request, Registration $registration, RegistrationAssignmentService $service): RedirectResponse
    {
        try {
            $service->claim($registration, $request->user());
            return Redirect::route('admin.registrations.index')
                ->with('success', 'Pendaftar berhasil Anda ambil untuk diproses.');
        } catch (Exception $e) {
            return Redirect::back()->with('error', $e->getMessage());
        }
    }

    public function complete(CompleteRegistrationRequest $request, Registration $registration, RegistrationAssignmentService $service): RedirectResponse
    {
        try {
            $service->complete($registration, $request->user());
            return Redirect::route('admin.registrations.index')
                ->with('success', 'Proses pendaftar berhasil diselesaikan.');
        } catch (Exception $e) {
            return Redirect::back()->with('error', $e->getMessage());
        }
    }

    public function release(ReleaseRegistrationRequest $request, Registration $registration, RegistrationAssignmentService $service): RedirectResponse
    {
        try {
            $service->release($registration, $request->user());
            return Redirect::route('admin.registrations.index')
                ->with('success', 'Penugasan pendaftar berhasil dilepaskan.');
        } catch (Exception $e) {
            return Redirect::back()->with('error', $e->getMessage());
        }
    }

    public function downloadReport(): \Illuminate\Http\Response
    {
        $activeYear = AcademicYear::where('is_active', true)->first();
        if (!$activeYear) {
            abort(404, 'Tidak ada tahun ajaran aktif.');
        }

        $registrations = Registration::with(['studentBiodata', 'admissionPath', 'user'])
            ->where('academic_year_id', $activeYear->id)
            ->where('status', '!=', 'draft')
            ->orderBy('id', 'asc')
            ->get();

        $madrasah = \App\Models\MadrasahSetting::first();

        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('pdf.registrations-report', [
            'registrations' => $registrations,
            'activeYear' => $activeYear,
            'madrasah' => $madrasah,
        ]);

        return $pdf->download('laporan-pendaftaran-' . str_replace('/', '-', $activeYear->name) . '.pdf');
    }
}
