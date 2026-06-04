<?php

namespace App\Http\Controllers;

use App\Http\Requests\ScoreStoreRequest;
use App\Models\AcademicYear;
use App\Models\Registration;
use App\Models\Subject;
use App\Services\ScoringService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class ScoreController extends Controller
{
    public function __construct(
        private readonly ScoringService $scoringService
    ) {}

    public function edit(Registration $registration): Response
    {
        $registration->load(['subjectScores.subject', 'studentBiodata', 'admissionPath']);

        $activeYear = AcademicYear::where('is_active', true)->first();
        $subjects = Subject::where('academic_year_id', $activeYear?->id)
            ->where('is_active', true)
            ->get();

        return Inertia::render('Admin/Score/Edit', [
            'registration' => $registration,
            'subjects' => $subjects,
        ]);
    }

    public function update(ScoreStoreRequest $request, Registration $registration): RedirectResponse
    {
        $this->scoringService->saveScores($registration, $request->validated('scores'));

        return Redirect::route('admin.registrations.index')
            ->with('success', 'Nilai seleksi berhasil disimpan.');
    }
}
