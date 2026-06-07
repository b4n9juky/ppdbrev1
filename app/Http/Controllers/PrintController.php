<?php

namespace App\Http\Controllers;

use App\Models\AcademicYear;
use App\Models\MadrasahSetting;
use App\Models\Registration;
use BaconQrCode\Common\ErrorCorrectionLevel;
use BaconQrCode\Encoder\Encoder;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Storage;

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
        $registration->loadSum('subjectScores as total_score', 'scores');
        $registration->load([
            'studentBiodata',
            'admissionPath',
            'subjectScores.subject',
            'academicYear',
            'studentDocuments',
            'user',
        ]);

        $madrasah = MadrasahSetting::first();

        // Convert images to Base64
        $kopSuratBase64 = $madrasah ? $this->imageToBase64($madrasah->kop_surat_path) : null;
        $signatureBase64 = $madrasah ? $this->imageToBase64($madrasah->signature_path) : null;
        $stampBase64 = $madrasah ? $this->imageToBase64($madrasah->stamp_path) : null;

        // Find student photo from documents
        $photoBase64 = null;
        if ($registration->studentDocuments) {
            $photo = $registration->studentDocuments->firstWhere('document_type', 'foto');
            if ($photo && $photo->file_path) {
                $photoBase64 = $this->imageToBase64($photo->file_path);
            }
        }

        $pdf = Pdf::loadView('pdf.decision-letter', [
            'registration' => $registration,
            'madrasah' => $madrasah,
            'kop_surat_base64' => $kopSuratBase64,
            'signature_base64' => $signatureBase64,
            'stamp_base64' => $stampBase64,
            'photo' => $photoBase64,
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
            $qrcodeBase64 = $this->generateQrCodePng($registration->studentBiodata->nisn, 150);
        }

        // Find student photo from documents
        $photoBase64 = null;
        if ($registration->studentDocuments) {
            $photo = $registration->studentDocuments->firstWhere('document_type', 'foto');
            if ($photo && $photo->file_path) {
                $photoBase64 = $this->imageToBase64($photo->file_path);
            }
        }

        $pdf = Pdf::loadView('pdf.registration-proof', [
            'registration' => $registration,
            'madrasah' => $madrasah,
            'kop_surat_base64' => $kopSuratBase64,
            'signature_base64' => $signatureBase64,
            'stamp_base64' => $stampBase64,
            'qrcode' => $qrcodeBase64,
            'photo' => $photoBase64,
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

    private function generateQrCodePng(string $data, int $size = 150): string
    {
        $qrCode = Encoder::encode($data, ErrorCorrectionLevel::M());
        $matrix = $qrCode->getMatrix();
        $matrixWidth = $matrix->getWidth();

        $marginPx = max(4, (int) round($size * 0.04));
        $moduleCount = $matrixWidth;
        $moduleSize = max(1, (int) floor(($size - 2 * $marginPx) / $moduleCount));
        $actualSize = $moduleSize * $moduleCount + 2 * $marginPx;

        $image = imagecreatetruecolor($actualSize, $actualSize);
        $white = imagecolorallocate($image, 255, 255, 255);
        $black = imagecolorallocate($image, 0, 0, 0);

        imagefill($image, 0, 0, $white);

        for ($y = 0; $y < $moduleCount; ++$y) {
            for ($x = 0; $x < $moduleCount; ++$x) {
                if ($matrix->get($x, $y) === 1) {
                    imagefilledrectangle(
                        $image,
                        $marginPx + $x * $moduleSize,
                        $marginPx + $y * $moduleSize,
                        $marginPx + ($x + 1) * $moduleSize - 1,
                        $marginPx + ($y + 1) * $moduleSize - 1,
                        $black
                    );
                }
            }
        }

        ob_start();
        imagepng($image);
        $pngData = ob_get_clean();
        imagedestroy($image);

        return base64_encode($pngData);
    }
}
