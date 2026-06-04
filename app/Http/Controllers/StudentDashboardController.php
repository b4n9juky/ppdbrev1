<?php

namespace App\Http\Controllers;

use App\Models\AcademicYear;
use App\Models\AdmissionPath;
use App\Models\MadrasahSetting;
use App\Models\Registration;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class StudentDashboardController extends Controller
{
    public function index(): Response
    {
        $activeYear = AcademicYear::where('is_active', true)->first();
        $registration = $this->getRegistration($activeYear);

        $settings = MadrasahSetting::first();

        return Inertia::render('Student/Dashboard', [
            'activeYear' => $activeYear,
            'registration' => $registration ? $registration->load([
                'studentBiodata', 'studentDocuments', 'admissionPath', 'subjectScores.subject',
            ]) : null,
            'madrasah' => $settings,
        ]);
    }

    public function biodata(): Response
    {
        $activeYear = AcademicYear::where('is_active', true)->first();
        $registration = $this->getRegistration($activeYear);

        return Inertia::render('Student/Biodata', [
            'registration' => $registration ? $registration->load('studentBiodata', 'admissionPath') : null,
            'activeYear' => $activeYear,
        ]);
    }

    public function documents(): Response
    {
        $activeYear = AcademicYear::where('is_active', true)->first();
        $registration = $this->getRegistration($activeYear);

        return Inertia::render('Student/Documents', [
            'registration' => $registration ? $registration->load('studentDocuments', 'admissionPath') : null,
            'activeYear' => $activeYear,
        ]);
    }

    private function getRegistration(?AcademicYear $activeYear): ?Registration
    {
        if (!$activeYear) {
            return null;
        }

        return Registration::where('user_id', auth()->id())
            ->where('academic_year_id', $activeYear->id)
            ->first();
    }
}
