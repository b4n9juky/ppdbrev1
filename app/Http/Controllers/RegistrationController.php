<?php

namespace App\Http\Controllers;

use App\Http\Requests\ClaimRegistrationRequest;
use App\Http\Requests\CompleteRegistrationRequest;
use App\Http\Requests\ReleaseRegistrationRequest;
use App\Http\Requests\UpdateRegistrationStatusRequest;
use App\Models\AcademicYear;
use App\Models\AdmissionPath;
use App\Models\DocumentType;
use App\Models\MadrasahSetting;
use App\Models\Registration;
use App\Models\StudentBiodata;
use App\Models\Subject;
use App\Models\SubjectScore;
use App\Services\RegistrationAssignmentService;
use Barryvdh\DomPDF\Facade\Pdf;
use Exception;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
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
                    ->withSum('subjectScores as total_score', 'scores')
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
        $perPage = (int)$request->query('per_page', 15);
        $processingStatus = $request->query('processing_status', 'all');
        $selectedId = $request->query('selected_id');

        $registrations = Registration::withSum('subjectScores as total_score', 'scores')
            ->with([
                'studentBiodata',
                'admissionPath',
                'user',
                'studentDocuments',
                'assignedOperator',
                'subjectScores.subject',
            ])
            ->where('processing_status', '!=', 'selesai')
            ->when($activeYear, fn($q) => $q->where('academic_year_id', $activeYear->id))
            ->when($processingStatus === 'baru', fn($q) => $q->where('processing_status', 'baru'))
            ->when($processingStatus === 'my_processing', fn($q) => $q->where('processing_status', 'diproses')->where('assigned_operator_id', auth()->id()))
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

        $selectedRegistration = null;
        if ($selectedId) {
            $selectedRegistration = Registration::withSum('subjectScores as total_score', 'scores')
                ->with([
                    'studentBiodata',
                    'admissionPath',
                    'user',
                    'studentDocuments',
                    'assignedOperator',
                    'subjectScores.subject',
                ])
                ->find($selectedId);
        }

        $user = auth()->user();

        if ($user->role === 'operator') {
            $paths = AdmissionPath::where('is_active', true)->get(['id', 'name']);

            return Inertia::render('Admin/Registration/OperatorIndex', [
                'registrations' => $registrations,
                'selectedRegistration' => $selectedRegistration,
                'paths' => $paths,
                'documentTypes' => DocumentType::all(),
                'filters' => [
                    'sort' => $sortField,
                    'direction' => $sortDirection,
                    'search' => $search,
                    'per_page' => $perPage,
                    'processing_status' => $processingStatus,
                    'selected_id' => $selectedId,
                ],
            ]);
        }

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
            'documentTypes' => DocumentType::all(),
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
        Gate::authorize('update', $registration);

        $totalScore = $registration->loadSum('subjectScores as total_score', 'scores')->total_score ?? 0.00;
        $passingScore = $registration->academicYear?->passing_score ?? 0.00;
        $finalStatus = $request->status;

        if ($request->status === 'accepted' || $request->status === 'reserve') {
            if ($totalScore < $passingScore) {
                $finalStatus = 'rejected';
            } else {
                if ($registration->studentDocuments()->count() < 1) {
                    return Redirect::back()->with('error', 'Pendaftar tidak dapat diberikan status lulus/cadangan karena belum mengunggah minimal 1 file dokumen.');
                }

                if ($request->status === 'accepted') {
                    $acceptedCount = $registration->admissionPath->registrations()
                        ->where('status', 'accepted')
                        ->count();
                    if ($acceptedCount >= $registration->admissionPath->quota) {
                        $finalStatus = 'reserve';
                    }
                }
            }
        }

        $registration->update(['status' => $finalStatus]);

        $statusLabels = [
            'accepted' => 'diterima',
            'reserve' => 'dijadikan cadangan',
            'rejected' => 'ditolak',
        ];

        if ($finalStatus !== $request->status) {
            $autoLabels = [
                'rejected' => 'ditolak (nilai tidak memenuhi syarat minimal)',
                'reserve' => 'dicadangkan (kuota jalur telah terpenuhi)',
            ];
            return Redirect::back()
                ->with('success', 'Pendaftar otomatis ' . ($autoLabels[$finalStatus] ?? 'diubah') . '.');
        }

        return Redirect::back()
            ->with('success', 'Status pendaftar berhasil ' . ($statusLabels[$request->status] ?? 'diubah') . '.');
    }

    public function reset(Request $request, Registration $registration): RedirectResponse
    {
        Gate::authorize('update', $registration);

        if ($registration->status === 'draft') {
            return Redirect::back()->with('error', 'Pendaftar sudah dalam status draft.');
        }

        SubjectScore::where('registration_id', $registration->id)->delete();

        $registration->update([
            'status' => 'draft',
            'total_score' => null,
            'processing_status' => 'baru',
            'assigned_operator_id' => null,
            'assigned_at' => null,
        ]);

        return Redirect::back()
            ->with('success', 'Pendaftar berhasil direset dan kembali ke halaman pendaftar.');
    }

    public function updateBiodata(Request $request, Registration $registration): RedirectResponse
    {
        Gate::authorize('update', $registration);

        $validated = $request->validate([
            'nisn' => ['required', 'numeric', 'digits:10'],
            'full_name' => ['required', 'string', 'max:255'],
            'gender' => ['required', 'in:male,female'],
            'birth_place' => ['required', 'string', 'max:255'],
            'birth_date' => ['required', 'date'],
            'address' => ['required', 'string', 'max:1000'],
            'phone_number' => ['required', 'regex:/^[0-9]{11,13}$/'],
            'previous_school' => ['required', 'string', 'max:255'],
        ], [
            'nisn.numeric' => 'NISN harus berupa angka.',
            'nisn.digits' => 'NISN harus terdiri dari 10 digit.',
            'phone_number.required' => 'Nomor kontak / WhatsApp wajib diisi.',
            'phone_number.regex' => 'Nomor kontak / WhatsApp harus berupa angka dengan panjang antara 11 sampai 13 digit.',
        ]);

        StudentBiodata::updateOrCreate(
            ['registration_id' => $registration->id],
            $validated
        );

        return Redirect::back()
            ->with('success', 'Biodata pendaftar berhasil diperbarui.');
    }

    public function claim(ClaimRegistrationRequest $request, Registration $registration, RegistrationAssignmentService $service): RedirectResponse
    {
        try {
            $service->claim($registration, $request->user());

            return Redirect::route('admin.registrations.index', [
                'selected_id' => $registration->id,
                'processing_status' => 'my_processing',
            ])->with('success', 'Pendaftar berhasil Anda ambil untuk diproses.');
        } catch (Exception $e) {
            return Redirect::back()->with('error', $e->getMessage());
        }
    }

    public function complete(CompleteRegistrationRequest $request, Registration $registration, RegistrationAssignmentService $service): RedirectResponse
    {
        try {
            $service->complete($registration, $request->user());

            $user = $request->user();
            if ($user->role === 'operator') {
                $activeYear = AcademicYear::where('is_active', true)->first();
                $nextRegistration = Registration::where('processing_status', 'baru')
                    ->where('academic_year_id', $activeYear?->id)
                    ->where('status', '!=', 'draft')
                    ->orderBy('created_at', 'asc')
                    ->first();

                if ($nextRegistration) {
                    return Redirect::route('admin.registrations.index', [
                        'selected_id' => $nextRegistration->id,
                        'processing_status' => 'baru',
                    ])->with('success', 'Proses pendaftar berhasil diselesaikan. Membuka pendaftar berikutnya...');
                }

                return Redirect::route('admin.registrations.index', [
                    'processing_status' => 'baru',
                ])->with('success', 'Proses pendaftar berhasil diselesaikan. Semua pendaftar telah diproses.');
            }

            return Redirect::back()
                ->with('success', 'Proses pendaftar berhasil diselesaikan.');
        } catch (Exception $e) {
            return Redirect::back()->with('error', $e->getMessage());
        }
    }

    public function verify(Request $request, Registration $registration, RegistrationAssignmentService $service): RedirectResponse
    {
        Gate::authorize('update', $registration);

        try {
            $service->complete($registration, $request->user());

            $registration->update(['status' => 'accepted']);

            $user = $request->user();
            if ($user->role === 'operator') {
                $activeYear = AcademicYear::where('is_active', true)->first();
                $nextRegistration = Registration::where('processing_status', 'baru')
                    ->where('academic_year_id', $activeYear?->id)
                    ->where('status', '!=', 'draft')
                    ->orderBy('created_at', 'asc')
                    ->first();

                if ($nextRegistration) {
                    return Redirect::route('admin.registrations.index', [
                        'selected_id' => $nextRegistration->id,
                        'processing_status' => 'baru',
                    ])->with('success', 'Pendaftar berhasil diverifikasi. Membuka pendaftar berikutnya...');
                }

                return Redirect::route('admin.registrations.index', [
                    'processing_status' => 'baru',
                ])->with('success', 'Pendaftar berhasil diverifikasi. Semua pendaftar telah diproses.');
            }

            return Redirect::back()
                ->with('success', 'Pendaftar berhasil diverifikasi.');
        } catch (Exception $e) {
            return Redirect::back()->with('error', $e->getMessage());
        }
    }

    public function rejectFile(Request $request, Registration $registration, RegistrationAssignmentService $service): RedirectResponse
    {
        Gate::authorize('update', $registration);

        try {
            $service->complete($registration, $request->user());

            $registration->update(['status' => 'rejected']);

            $user = $request->user();
            if ($user->role === 'operator') {
                $activeYear = AcademicYear::where('is_active', true)->first();
                $nextRegistration = Registration::where('processing_status', 'baru')
                    ->where('academic_year_id', $activeYear?->id)
                    ->where('status', '!=', 'draft')
                    ->orderBy('created_at', 'asc')
                    ->first();

                if ($nextRegistration) {
                    return Redirect::route('admin.registrations.index', [
                        'selected_id' => $nextRegistration->id,
                        'processing_status' => 'baru',
                    ])->with('success', 'Berkas ditolak. Membuka pendaftar berikutnya...');
                }

                return Redirect::route('admin.registrations.index', [
                    'processing_status' => 'baru',
                ])->with('success', 'Berkas ditolak. Semua pendaftar telah diproses.');
            }

            return Redirect::back()
                ->with('success', 'Berkas pendaftar berhasil ditolak.');
        } catch (Exception $e) {
            return Redirect::back()->with('error', $e->getMessage());
        }
    }

    public function release(ReleaseRegistrationRequest $request, Registration $registration, RegistrationAssignmentService $service): RedirectResponse
    {
        try {
            $service->release($registration, $request->user());

            return Redirect::back()
                ->with('success', 'Penugasan pendaftar berhasil dilepaskan.');
        } catch (Exception $e) {
            return Redirect::back()->with('error', $e->getMessage());
        }
    }

    public function saveNote(Request $request, Registration $registration): RedirectResponse
    {
        Gate::authorize('update', $registration);

        $validated = $request->validate([
            'notes' => ['nullable', 'string', 'max:5000'],
        ]);

        $registration->update([
            'verification_notes' => $validated['notes'] ?? null,
        ]);

        return Redirect::back()
            ->with('success', 'Catatan verifikasi berhasil disimpan.');
    }

    public function downloadReport(): \Illuminate\Http\Response
    {
        $activeYear = AcademicYear::where('is_active', true)->first();
        if (!$activeYear) {
            abort(404, 'Tidak ada tahun ajaran aktif.');
        }

        $registrations = Registration::withSum('subjectScores as total_score', 'scores')
            ->with(['studentBiodata', 'admissionPath', 'user'])
            ->where('academic_year_id', $activeYear->id)
            ->where('status', '!=', 'draft')
            ->orderBy('id', 'asc')
            ->get();

        $madrasah = MadrasahSetting::first();

        $pdf = Pdf::loadView('pdf.registrations-report', [
            'registrations' => $registrations,
            'activeYear' => $activeYear,
            'madrasah' => $madrasah,
        ]);

        return $pdf->download('laporan-pendaftaran-' . str_replace('/', '-', $activeYear->name) . '.pdf');
    }
}
