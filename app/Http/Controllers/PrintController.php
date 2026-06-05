<?php

namespace App\Http\Controllers;

use App\Models\AcademicYear;
use App\Models\MadrasahSetting;
use App\Models\Registration;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Storage;
use SimpleSoftwareIO\QrCode\Facades\QrCode;

class PrintController extends Controller
{
    public function registrationProof(Registration $registration): Response
    {
        return $this->generateRegistrationProofPdf($registration);
    }

    public function studentRegistrationProof(): Response
    {
        $activeYear = AcademicYear::where('is_active', true)->first();
        if (! $activeYear) {
            abort(404, 'Tidak ada tahun ajaran aktif.');
        }

        $registration = Registration::where('user_id', auth()->id())
            ->where('academic_year_id', $activeYear->id)
            ->firstOrFail();

        return $this->generateRegistrationProofPdf($registration);
    }

    public function decisionLetter(Registration $registration): Response
    {
        $registration->load([
            'studentBiodata',
            'admissionPath',
            'subjectScores.subject',
            'academicYear',
            'user',
        ]);

        $madrasah = MadrasahSetting::first();

        // Convert images to Base64
        $kopSuratBase64 = $madrasah ? $this->imageToBase64($madrasah->kop_surat_path) : null;
        $signatureBase64 = $madrasah ? $this->imageToBase64($madrasah->signature_path) : null;
        $stampBase64 = $madrasah ? $this->imageToBase64($madrasah->stamp_path) : null;

        $pdf = Pdf::loadView('pdf.decision-letter', [
            'registration' => $registration,
            'madrasah' => $madrasah,
            'kop_surat_base64' => $kopSuratBase64,
            'signature_base64' => $signatureBase64,
            'stamp_base64' => $stampBase64,
        ]);

        return $pdf->stream('sk-kelulusan-'.str_pad($registration->id, 5, '0', STR_PAD_LEFT).'.pdf');
    }

    private function generateRegistrationProofPdf(Registration $registration): Response
    {
        $registration->load([
            'studentBiodata',
            'admissionPath',
            'studentDocuments',
            'academicYear',
            'user',
        ]);

        $madrasah = MadrasahSetting::first();

        // Convert images to Base64
        $kopSuratBase64 = $madrasah ? $this->imageToBase64($madrasah->kop_surat_path) : null;
        $signatureBase64 = $madrasah ? $this->imageToBase64($madrasah->signature_path) : null;
        $stampBase64 = $madrasah ? $this->imageToBase64($madrasah->stamp_path) : null;

        // Generate QR Code using NISN, base64 encode it
        $qrcodeBase64 = null;
        if ($registration->studentBiodata && $registration->studentBiodata->nisn) {
            $qrcodeBase64 = base64_encode(
                QrCode::format('svg')
                    ->size(150)
                    ->margin(1)
                    ->generate($registration->studentBiodata->nisn)
            );
        }

        $pdf = Pdf::loadView('pdf.registration-proof', [
            'registration' => $registration,
            'madrasah' => $madrasah,
            'kop_surat_base64' => $kopSuratBase64,
            'signature_base64' => $signatureBase64,
            'stamp_base64' => $stampBase64,
            'qrcode' => $qrcodeBase64,
        ]);

        return $pdf->stream('bukti-pendaftaran-'.str_pad($registration->id, 5, '0', STR_PAD_LEFT).'.pdf');
    }

    private function imageToBase64($path)
    {
        if ($path && Storage::disk('public')->exists($path)) {
            $fullPath = Storage::disk('public')->path($path);

            return 'data:'.mime_content_type($fullPath).';base64,'.base64_encode(file_get_contents($fullPath));
        }

        return null;
    }
}
