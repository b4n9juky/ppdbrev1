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

    public function studentDecisionLetter(): Response
    {
        $activeYear = AcademicYear::where('is_active', true)->first();
        if (! $activeYear) {
            abort(404, 'Tidak ada tahun ajaran aktif.');
        }

        $registration = Registration::where('user_id', auth()->id())
            ->where('academic_year_id', $activeYear->id)
            ->where('status', 'accepted')
            ->firstOrFail();

        return $this->decisionLetter($registration);
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

        // Convert images to Base64 (resize to prevent memory exhaustion)
        $kopSuratBase64 = $madrasah ? $this->imageToBase64($madrasah->kop_surat_path, 800) : null;
        $signatureBase64 = $madrasah ? $this->imageToBase64($madrasah->signature_path, 300) : null;
        $stampBase64 = $madrasah ? $this->imageToBase64($madrasah->stamp_path, 300) : null;

        // Find student photo from documents
        $photoBase64 = null;
        if ($registration->studentDocuments) {
            $photo = $registration->studentDocuments->firstWhere('document_type', 'foto');
            if ($photo && $photo->file_path) {
                $photoBase64 = $this->imageToBase64($photo->file_path, 400);
            }
        }

        ini_set('memory_limit', '256M');

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

    public function studentPrintStudentStatement(): Response
    {
        $activeYear = AcademicYear::where('is_active', true)->first();
        if (! $activeYear) {
            abort(404, 'Tidak ada tahun ajaran aktif.');
        }

        $registration = Registration::where('user_id', auth()->id())
            ->where('academic_year_id', $activeYear->id)
            ->where('status', 'accepted')
            ->firstOrFail();

        return $this->studentStatement($registration);
    }

    public function studentPrintParentStatement(): Response
    {
        $activeYear = AcademicYear::where('is_active', true)->first();
        if (! $activeYear) {
            abort(404, 'Tidak ada tahun ajaran aktif.');
        }

        $registration = Registration::where('user_id', auth()->id())
            ->where('academic_year_id', $activeYear->id)
            ->where('status', 'accepted')
            ->firstOrFail();

        return $this->parentStatement($registration);
    }

    public function studentPrintParticipationStatement(): Response
    {
        $activeYear = AcademicYear::where('is_active', true)->first();
        if (! $activeYear) {
            abort(404, 'Tidak ada tahun ajaran aktif.');
        }

        $registration = Registration::where('user_id', auth()->id())
            ->where('academic_year_id', $activeYear->id)
            ->where('status', 'accepted')
            ->firstOrFail();

        return $this->participationStatement($registration);
    }

    public function studentStatement(Registration $registration): Response
    {
        $registration->load([
            'studentBiodata',
            'admissionPath',
            'academicYear',
            'user',
        ]);

        $madrasah = MadrasahSetting::first();

        // Convert images to Base64 (resize to prevent memory exhaustion)
        $kopSuratBase64 = $madrasah ? $this->imageToBase64($madrasah->kop_surat_path, 800) : null;
        $signatureBase64 = $madrasah ? $this->imageToBase64($madrasah->signature_path, 300) : null;
        $stampBase64 = $madrasah ? $this->imageToBase64($madrasah->stamp_path, 300) : null;

        // Explode statement points by newline
        $points = [];
        if ($madrasah && $madrasah->student_statement_points) {
            $points = array_filter(array_map('trim', explode("\n", $madrasah->student_statement_points)));
        }

        ini_set('memory_limit', '256M');

        $pdf = Pdf::loadView('pdf.student-statement', [
            'registration' => $registration,
            'madrasah' => $madrasah,
            'kop_surat_base64' => $kopSuratBase64,
            'signature_base64' => $signatureBase64,
            'stamp_base64' => $stampBase64,
            'points' => $points,
        ]);

        return $pdf->stream('surat-pernyataan-siswa-'.str_pad($registration->id, 5, '0', STR_PAD_LEFT).'.pdf');
    }

    public function parentStatement(Registration $registration): Response
    {
        $registration->load([
            'studentBiodata',
            'studentParent',
            'admissionPath',
            'academicYear',
            'user',
        ]);

        $madrasah = MadrasahSetting::first();

        // Convert images to Base64 (resize to prevent memory exhaustion)
        $kopSuratBase64 = $madrasah ? $this->imageToBase64($madrasah->kop_surat_path, 800) : null;
        $signatureBase64 = $madrasah ? $this->imageToBase64($madrasah->signature_path, 300) : null;
        $stampBase64 = $madrasah ? $this->imageToBase64($madrasah->stamp_path, 300) : null;

        // Explode statement points by newline
        $points = [];
        if ($madrasah && $madrasah->parent_statement_points) {
            $points = array_filter(array_map('trim', explode("\n", $madrasah->parent_statement_points)));
        }

        ini_set('memory_limit', '256M');

        $pdf = Pdf::loadView('pdf.parent-statement', [
            'registration' => $registration,
            'madrasah' => $madrasah,
            'kop_surat_base64' => $kopSuratBase64,
            'signature_base64' => $signatureBase64,
            'stamp_base64' => $stampBase64,
            'points' => $points,
        ]);

        return $pdf->stream('surat-pernyataan-orangtua-'.str_pad($registration->id, 5, '0', STR_PAD_LEFT).'.pdf');
    }

    public function participationStatement(Registration $registration): Response
    {
        $registration->load([
            'studentBiodata',
            'studentParent',
            'admissionPath',
            'academicYear',
            'user',
        ]);

        $madrasah = MadrasahSetting::first();

        // Convert images to Base64 (resize to prevent memory exhaustion)
        $kopSuratBase64 = $madrasah ? $this->imageToBase64($madrasah->kop_surat_path, 800) : null;
        $signatureBase64 = $madrasah ? $this->imageToBase64($madrasah->signature_path, 300) : null;
        $stampBase64 = $madrasah ? $this->imageToBase64($madrasah->stamp_path, 300) : null;

        // Explode statement points by newline
        $points = [];
        if ($madrasah && $madrasah->participation_statement_points) {
            $points = array_filter(array_map('trim', explode("\n", $madrasah->participation_statement_points)));
        }

        ini_set('memory_limit', '256M');

        $pdf = Pdf::loadView('pdf.participation-statement', [
            'registration' => $registration,
            'madrasah' => $madrasah,
            'kop_surat_base64' => $kopSuratBase64,
            'signature_base64' => $signatureBase64,
            'stamp_base64' => $stampBase64,
            'points' => $points,
        ]);

        return $pdf->stream('surat-pernyataan-partisipasi-'.str_pad($registration->id, 5, '0', STR_PAD_LEFT).'.pdf');
    }

    public function biodata(Registration $registration): Response
    {
        $registration->load([
            'studentBiodata',
            'studentParent',
            'admissionPath',
            'studentDocuments',
            'academicYear',
            'user',
        ]);

        if (! $registration->studentBiodata) {
            abort(422, 'Biodata siswa belum dilengkapi.');
        }

        $madrasah = MadrasahSetting::first();

        $kopSuratBase64 = $madrasah ? $this->imageToBase64($madrasah->kop_surat_path, 800) : null;
        $signatureBase64 = $madrasah ? $this->imageToBase64($madrasah->signature_path, 300) : null;
        $stampBase64 = $madrasah ? $this->imageToBase64($madrasah->stamp_path, 300) : null;

        $photoBase64 = null;
        if ($registration->studentDocuments) {
            $photo = $registration->studentDocuments->firstWhere('document_type', 'foto');
            if ($photo && $photo->file_path) {
                $photoBase64 = $this->imageToBase64($photo->file_path, 400);
            }
        }

        ini_set('memory_limit', '256M');

        $pdf = Pdf::loadView('pdf.biodata', [
            'registration' => $registration,
            'bio' => $registration->studentBiodata,
            'parent' => $registration->studentParent,
            'madrasah' => $madrasah,
            'kop_surat_base64' => $kopSuratBase64,
            'signature_base64' => $signatureBase64,
            'stamp_base64' => $stampBase64,
            'photo' => $photoBase64,
        ]);

        return $pdf->stream('biodata-siswa-'.str_pad($registration->id, 5, '0', STR_PAD_LEFT).'.pdf');
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

        if (! $registration->studentBiodata) {
            abort(422, 'Biodata siswa belum dilengkapi. Pendaftar harus mengisi biodata terlebih dahulu.');
        }

        if (! $registration->academicYear) {
            abort(422, 'Tahun ajaran terkait pendaftaran ini tidak ditemukan.');
        }

        if (! $registration->admissionPath) {
            abort(422, 'Jalur pendaftaran terkait pendaftaran ini tidak ditemukan.');
        }

        $madrasah = MadrasahSetting::first();

        // Convert images to Base64 (resize to prevent memory exhaustion)
        $kopSuratBase64 = $madrasah ? $this->imageToBase64($madrasah->kop_surat_path, 800) : null;
        $signatureBase64 = $madrasah ? $this->imageToBase64($madrasah->signature_path, 300) : null;
        $stampBase64 = $madrasah ? $this->imageToBase64($madrasah->stamp_path, 300) : null;

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
                $photoBase64 = $this->imageToBase64($photo->file_path, 400);
            }
        }

        ini_set('memory_limit', '256M');

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

    private function imageToBase64($path, ?int $maxWidth = null)
    {
        if ($path) {
            $fullPath = null;

            if (Storage::disk('local')->exists($path)) {
                $fullPath = Storage::disk('local')->path($path);
            } elseif (Storage::disk('public')->exists($path)) {
                $fullPath = Storage::disk('public')->path($path);
            }

            if ($fullPath && file_exists($fullPath)) {
                $mime = mime_content_type($fullPath);

                if ($maxWidth && $mime && str_starts_with($mime, 'image/')) {
                    return $this->resizeImageToBase64($fullPath, $mime, $maxWidth);
                }

                return 'data:'.$mime.';base64,'.base64_encode(file_get_contents($fullPath));
            }
        }

        return null;
    }

    private function resizeImageToBase64(string $path, string $mime, int $maxWidth): string
    {
        $image = match ($mime) {
            'image/jpeg' => imagecreatefromjpeg($path),
            'image/png'  => imagecreatefrompng($path),
            'image/gif'  => imagecreatefromgif($path),
            default      => null,
        };

        if (! $image) {
            return 'data:'.$mime.';base64,'.base64_encode(file_get_contents($path));
        }

        $origWidth = imagesx($image);
        $origHeight = imagesy($image);

        if ($origWidth <= $maxWidth) {
            ob_start();
            if ($mime === 'image/jpeg') {
                imagejpeg($image, null, 80);
            } elseif ($mime === 'image/png') {
                imagepng($image, null, 6);
            } else {
                imagegif($image);
            }
            $data = ob_get_clean();
            imagedestroy($image);

            return 'data:'.$mime.';base64,'.base64_encode($data);
        }

        $ratio = $maxWidth / $origWidth;
        $newHeight = (int) ($origHeight * $ratio);
        $resized = imagecreatetruecolor($maxWidth, $newHeight);

        imagecopyresampled($resized, $image, 0, 0, 0, 0, $maxWidth, $newHeight, $origWidth, $origHeight);
        imagedestroy($image);

        ob_start();
        if ($mime === 'image/jpeg') {
            imagejpeg($resized, null, 80);
        } elseif ($mime === 'image/png') {
            imagepng($resized, null, 6);
        } else {
            imagegif($resized);
        }
        $data = ob_get_clean();
        imagedestroy($resized);

        return 'data:'.$mime.';base64,'.base64_encode($data);
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
