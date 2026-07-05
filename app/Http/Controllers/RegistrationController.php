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
use SimpleSoftwareIO\QrCode\Facades\QrCode;
use Exception;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use ZipArchive;

class RegistrationController extends Controller
{
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

        $notesMap = [
            'accepted' => 'Selamat! Anda dinyatakan DITERIMA pada jalur pendaftaran ini.',
            'reserve' => 'Status Anda cadangan karena kuota telah penuh, pantau selanjutnya jika ada perubahan',
            'rejected' => 'Status Anda ditolak karena kuota penuh atau tidak memenuhi Syarat',
        ];

        $registration->update([
            'status' => $finalStatus,
            'verification_notes' => $notesMap[$finalStatus] ?? null,
        ]);

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

        $notes = $request->input('notes') ?: 'berkas anda tidak memenuhi syarat, silahkan perbaiki';

        $registration->update([
            'status' => 'pending',
            'processing_status' => 'baru',
            'assigned_operator_id' => null,
            'assigned_at' => null,
            're_registration_status' => null,
            're_registration_notes' => null,
            'verification_notes' => $notes,
        ]);

        return Redirect::back()
            ->with('success', 'Pendaftar berhasil direset ke status Pending.');
    }

    public function cancelSelection(Request $request, Registration $registration): RedirectResponse
    {
        Gate::authorize('update', $registration);

        if (in_array($registration->status, ['draft', 'pending'])) {
            return Redirect::back()->with('error', 'Pendaftar tidak dalam status seleksi.');
        }

        $registration->update([
            'status' => 'pending',
            'verification_notes' => 'Status seleksi dibatalkan oleh operator.',
        ]);

        return Redirect::back()
            ->with('success', 'Status seleksi berhasil dibatalkan, pendaftar kembali ke status menunggu.');
    }

    public function updateAdmissionPath(Request $request, Registration $registration): RedirectResponse
    {
        Gate::authorize('update', $registration);

        $validated = $request->validate([
            'admission_path_id' => ['required', 'exists:admission_paths,id'],
        ]);

        $registration->update([
            'admission_path_id' => $validated['admission_path_id'],
        ]);

        return Redirect::back()
            ->with('success', 'Jalur pendaftaran berhasil diperbarui.');
    }

    public function updateBiodata(Request $request, Registration $registration): RedirectResponse
    {
        Gate::authorize('update', $registration);

        $validated = $request->validate([
            'nisn' => [
                'required', 
                'numeric', 
                'digits:10', 
                \Illuminate\Validation\Rule::unique('student_biodatas', 'nisn')->ignore($registration->id, 'registration_id')
            ],
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
            'nisn.unique' => 'NISN ini sudah terdaftar. Silakan gunakan NISN yang lain.',
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

            return Redirect::route('admin.workspace', [
                'selected_id' => $registration->id,
                'processing_status' => 'my_processing',
                'tab' => 'monitoring',
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
                    return Redirect::route('operator.registrations.index', [
                        'selected_id' => $nextRegistration->id,
                        'processing_status' => 'baru',
                    ])->with('success', 'Proses pendaftar berhasil diselesaikan. Membuka pendaftar berikutnya...');
                }

                return Redirect::route('operator.registrations.index', [
                    'processing_status' => 'baru',
                ])->with('success', 'Proses pendaftar berhasil diselesaikan. Semua pendaftar telah diproses.');
            }

            $activeYear = AcademicYear::where('is_active', true)->first();
            $nextRegistration = Registration::where('processing_status', 'baru')
                ->where('academic_year_id', $activeYear?->id)
                ->where('status', '!=', 'draft')
                ->whereHas('admissionPath', fn ($q) => $q->where('is_active', true))
                ->orderBy('created_at', 'asc')
                ->first();

            if ($nextRegistration) {
                return Redirect::route('admin.workspace', [
                    'selected_id' => $nextRegistration->id,
                    'processing_status' => 'baru',
                    'tab' => 'monitoring',
                ])->with('success', 'Proses pendaftar berhasil diselesaikan. Membuka pendaftar berikutnya...');
            }

            return Redirect::route('admin.workspace', [
                'processing_status' => 'baru',
                'tab' => 'monitoring',
            ])->with('success', 'Proses pendaftar berhasil diselesaikan. Semua pendaftar telah diproses.');
        } catch (Exception $e) {
            return Redirect::back()->with('error', $e->getMessage());
        }
    }

    public function verify(Request $request, Registration $registration, RegistrationAssignmentService $service): RedirectResponse
    {
        Gate::authorize('update', $registration);

        $requiredSubjects = Subject::where('academic_year_id', $registration->academic_year_id)->where('is_active', true)->count();
        if ($registration->subjectScores->count() < $requiredSubjects || $registration->subjectScores->contains(fn($s) => is_null($s->scores))) {
            return Redirect::back()->with('error', 'Tidak dapat melakukan verifikasi, terdapat nilai mata pelajaran yang kosong atau belum diisi.');
        }

        try {
            $service->complete($registration, $request->user());

            $registration->update([
                'verification_notes' => 'verifikasi telah dilakukan data anda lolos verifikasi.',
            ]);

            $user = $request->user();
            if ($user->role === 'operator') {
                $activeYear = AcademicYear::where('is_active', true)->first();
                $nextRegistration = Registration::where('processing_status', 'baru')
                    ->where('academic_year_id', $activeYear?->id)
                    ->where('status', '!=', 'draft')

                    ->orderBy('created_at', 'asc')
                    ->first();

                if ($nextRegistration) {
                    return Redirect::route('operator.registrations.index', [
                        'selected_id' => $nextRegistration->id,
                        'processing_status' => 'baru',
                    ])->with('success', 'Pendaftar berhasil diverifikasi. Membuka pendaftar berikutnya...');
                }

                return Redirect::route('operator.registrations.index', [
                    'processing_status' => 'baru',
                ])->with('success', 'Pendaftar berhasil diverifikasi. Semua pendaftar telah diproses.');
            }

            $activeYear = AcademicYear::where('is_active', true)->first();
            $nextRegistration = Registration::where('processing_status', 'baru')
                ->where('academic_year_id', $activeYear?->id)
                ->where('status', '!=', 'draft')
                ->whereHas('admissionPath', fn ($q) => $q->where('is_active', true))
                ->orderBy('created_at', 'asc')
                ->first();

            if ($nextRegistration) {
                return Redirect::route('admin.workspace', [
                    'selected_id' => $nextRegistration->id,
                    'processing_status' => 'baru',
                    'tab' => 'monitoring',
                ])->with('success', 'Pendaftar berhasil diverifikasi. Membuka pendaftar berikutnya...');
            }

            return Redirect::route('admin.workspace', [
                'processing_status' => 'baru',
                'tab' => 'monitoring',
            ])->with('success', 'Pendaftar berhasil diverifikasi. Semua pendaftar telah diproses.');
        } catch (Exception $e) {
            return Redirect::back()->with('error', $e->getMessage());
        }
    }

    public function rejectFile(Request $request, Registration $registration, RegistrationAssignmentService $service): RedirectResponse
    {
        Gate::authorize('update', $registration);

        try {
            $service->complete($registration, $request->user());

            $notes = $request->input('notes') ?: 'berkas anda tidak memenuhi syarat, silahkan perbaiki';

            $registration->update([
                'status' => 'rejected',
                'verification_notes' => $notes,
            ]);

            $user = $request->user();
            if ($user->role === 'operator') {
                $activeYear = AcademicYear::where('is_active', true)->first();
                $nextRegistration = Registration::where('processing_status', 'baru')
                    ->where('academic_year_id', $activeYear?->id)
                    ->where('status', '!=', 'draft')

                    ->orderBy('created_at', 'asc')
                    ->first();

                if ($nextRegistration) {
                    return Redirect::route('operator.registrations.index', [
                        'selected_id' => $nextRegistration->id,
                        'processing_status' => 'baru',
                    ])->with('success', 'Berkas ditolak. Membuka pendaftar berikutnya...');
                }

                return Redirect::route('operator.registrations.index', [
                    'processing_status' => 'baru',
                ])->with('success', 'Berkas ditolak. Semua pendaftar telah diproses.');
            }

            $activeYear = AcademicYear::where('is_active', true)->first();
            $nextRegistration = Registration::where('processing_status', 'baru')
                ->where('academic_year_id', $activeYear?->id)
                ->where('status', '!=', 'draft')
                ->whereHas('admissionPath', fn ($q) => $q->where('is_active', true))
                ->orderBy('created_at', 'asc')
                ->first();

            if ($nextRegistration) {
                return Redirect::route('admin.workspace', [
                    'selected_id' => $nextRegistration->id,
                    'processing_status' => 'baru',
                    'tab' => 'monitoring',
                ])->with('success', 'Berkas ditolak. Membuka pendaftar berikutnya...');
            }

            return Redirect::route('admin.workspace', [
                'processing_status' => 'baru',
                'tab' => 'monitoring',
            ])->with('success', 'Berkas pendaftar berhasil ditolak.');
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

    public function verifyReRegistration(Request $request, Registration $registration): RedirectResponse
    {
        Gate::authorize('update', $registration);

        $registration->update([
            're_registration_status' => 'verified',
            're_registration_notes' => 'Pendaftaran ulang Anda telah diverifikasi oleh operator.',
        ]);

        return Redirect::back()->with('success', 'Pendaftaran ulang siswa berhasil diverifikasi.');
    }

    public function rejectReRegistration(Request $request, Registration $registration): RedirectResponse
    {
        Gate::authorize('update', $registration);

        $request->validate([
            'notes' => ['required', 'string', 'max:5000'],
        ]);

        $registration->update([
            're_registration_status' => 'pending', // send back to pending for editing
            're_registration_notes' => $request->input('notes'),
        ]);

        return Redirect::back()->with('success', 'Pendaftaran ulang siswa ditolak untuk perbaikan.');
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
            ->whereHas('admissionPath', fn ($q) => $q->where('is_active', true))
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

    public function exportAcceptedExcel(Request $request): \Symfony\Component\HttpFoundation\StreamedResponse
    {
        $activeYear = AcademicYear::where('is_active', true)->first();
        if (!$activeYear) {
            abort(404, 'Tidak ada tahun ajaran aktif.');
        }

        $search = $request->query('search') ?? $request->query('announcement_search', '');
        $pathFilter = $request->query('path') ?? $request->query('announcement_path', '');
        $statusFilter = $request->query('status') ?? $request->query('announcement_status', '');

        $query = Registration::with(['studentBiodata', 'admissionPath', 'user'])
            ->where('academic_year_id', $activeYear->id)
            ->where('status', '!=', 'draft')
            ->where('processing_status', 'selesai')
            ->whereHas('admissionPath', fn ($q) => $q->where('is_active', true));

        $query->when($pathFilter, fn ($q) => $q->where('admission_path_id', $pathFilter))
            ->when($statusFilter, fn ($q) => $q->where('status', $statusFilter))
            ->when($search, function ($q) use ($search) {
                $q->where(function ($sub) use ($search) {
                    $sub->whereHas('studentBiodata', fn ($sb) => $sb->where('full_name', 'like', "%{$search}%")->orWhere('nisn', 'like', "%{$search}%"))
                        ->orWhereHas('user', fn ($u) => $u->where('name', 'like', "%{$search}%"));
                });
            });

        $registrations = $query->orderBy('total_score', 'desc')
            ->orderBy('created_at', 'asc')
            ->get();

        $headers = [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => 'attachment; filename="data-pendaftar-' . str_replace('/', '-', $activeYear->name) . '.csv"',
            'Pragma' => 'no-cache',
            'Cache-Control' => 'must-revalidate, post-check=0, pre-check=0',
            'Expires' => '0'
        ];

        $callback = function () use ($registrations) {
            $file = fopen('php://output', 'w');
            
            // Prepend UTF-8 BOM for Excel
            fprintf($file, chr(0xEF) . chr(0xBB) . chr(0xBF));

            // Headers
            fputcsv($file, [
                'NISN',
                'Nama Siswa',
                'Asal Sekolah',
                'Jalur Pendaftaran',
                'Total Nilai',
                'Status'
            ]);

            $statusLabels = [
                'accepted' => 'Diterima',
                'reserve' => 'Cadangan',
                'rejected' => 'Ditolak',
                'pending' => 'Menunggu',
                'draft' => 'Draft',
            ];

            foreach ($registrations as $reg) {
                $statusText = $statusLabels[$reg->status] ?? $reg->status;

                fputcsv($file, [
                    $reg->studentBiodata?->nisn ?? '-',
                    $reg->studentBiodata?->full_name ?? $reg->user?->name ?? '-',
                    $reg->studentBiodata?->previous_school ?? '-',
                    $reg->admissionPath?->name ?? '-',
                    $reg->total_score ?? '0',
                    $statusText
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    public function downloadAllDocuments(): \Symfony\Component\HttpFoundation\BinaryFileResponse
    {
        $activeYear = AcademicYear::where('is_active', true)->first();
        if (!$activeYear) {
            abort(404, 'Tidak ada tahun ajaran aktif.');
        }

        $registrations = Registration::with(['studentBiodata', 'studentDocuments'])
            ->where('academic_year_id', $activeYear->id)
            ->where('status', 'accepted')
            ->get();

        $zipFileName = 'berkas-siswa-diterima-' . str_replace('/', '-', $activeYear->name) . '.zip';
        $zipPath = storage_path('app/private/temp/' . $zipFileName);

        if (!is_dir(storage_path('app/private/temp'))) {
            mkdir(storage_path('app/private/temp'), 0755, true);
        }

        $zip = new ZipArchive;
        if ($zip->open($zipPath, ZipArchive::CREATE | ZipArchive::OVERWRITE) !== true) {
            abort(500, 'Gagal membuat file zip.');
        }

        $added = 0;
        foreach ($registrations as $reg) {
            $nisn = $reg->studentBiodata?->nisn;
            if (!$nisn) {
                continue;
            }

            foreach ($reg->studentDocuments as $doc) {
                $filePath = Storage::disk('local')->path($doc->file_path);
                if (!file_exists($filePath)) {
                    continue;
                }

                $ext = pathinfo($filePath, PATHINFO_EXTENSION);
                $zipEntryName = $nisn . '/' . $doc->document_type . '.' . $ext;
                $zip->addFile($filePath, $zipEntryName);
                $added++;
            }
        }

        $zip->close();

        if ($added === 0) {
            unlink($zipPath);
            abort(404, 'Tidak ada berkas yang ditemukan untuk siswa diterima.');
        }

        return response()->download($zipPath, $zipFileName)->deleteFileAfterSend(true);
    }
}
