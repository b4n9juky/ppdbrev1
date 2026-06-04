<?php

namespace App\Http\Controllers;

use App\Models\AcademicYear;
use App\Models\AdmissionPath;
use App\Models\Registration;
use App\Models\SubjectScore;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

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

        $registrations = Registration::with([
            'studentBiodata',
            'admissionPath',
            'user',
        ])
            ->when($activeYear, fn ($q) => $q->where('academic_year_id', $activeYear->id))
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

        return Inertia::render('Admin/Registration/Index', [
            'registrations' => $registrations,
            'paths' => $paths,
            'filters' => [
                'sort' => $sortField,
                'direction' => $sortDirection,
                'search' => $search,
                'per_page' => $perPage,
            ],
        ]);
    }

    public function updateStatus(Request $request, Registration $registration): RedirectResponse
    {
        $validStatuses = ['accepted', 'reserve', 'rejected'];

        $request->validate([
            'status' => ['required', 'string', 'in:' . implode(',', $validStatuses)],
        ]);

        $registration->update(['status' => $request->status]);

        $statusLabels = [
            'accepted' => 'diterima',
            'reserve' => 'dijadikan cadangan',
            'rejected' => 'ditolak',
        ];

        return Redirect::route('admin.registrations.index')
            ->with('success', 'Status pendaftar berhasil ' . ($statusLabels[$request->status] ?? 'diubah') . '.');
    }

    public function reset(Registration $registration): RedirectResponse
    {
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
}
