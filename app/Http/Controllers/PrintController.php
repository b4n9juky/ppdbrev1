<?php

namespace App\Http\Controllers;

use App\Models\MadrasahSetting;
use App\Models\Registration;
use Inertia\Inertia;
use Inertia\Response;

class PrintController extends Controller
{
    public function registrationProof(Registration $registration): Response
    {
        $registration->load([
            'studentBiodata',
            'admissionPath',
            'studentDocuments',
            'academicYear',
            'user',
        ]);

        $madrasah = MadrasahSetting::first();

        return Inertia::render('Print/RegistrationProof', [
            'registration' => $registration,
            'madrasah' => $madrasah,
        ]);
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

        return Inertia::render('Print/DecisionLetter', [
            'registration' => $registration,
            'madrasah' => $madrasah,
        ]);
    }
}
