<?php

namespace App\Http\Controllers\Operator;

use App\Http\Controllers\Controller;
use App\Http\Requests\ScoreStoreRequest;
use App\Models\AcademicYear;
use App\Models\Registration;
use App\Models\Subject;
use App\Services\ScoringService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;
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
        Gate::authorize('view', $registration);

        $registration->loadSum('subjectScores as total_score', 'scores');
        $registration->load(['subjectScores.subject', 'studentBiodata', 'admissionPath']);

        $subjects = Subject::where('academic_year_id', $registration->academic_year_id)
            ->where('is_active', true)
            ->orderBy('urut')
            ->orderBy('name')
            ->get();

        return Inertia::render('Operator/Score/Edit', [
            'registration' => $registration,
            'subjects' => $subjects,
        ]);
    }

    public function update(ScoreStoreRequest $request, Registration $registration): RedirectResponse
    {
        Gate::authorize('update', $registration);

        $this->scoringService->saveScores($registration, $request->validated()['scores']);

        return Redirect::route('operator.registrations.index', [
            'selected_id' => $registration->id,
        ])->with('success', 'Nilai seleksi berhasil disimpan.');
    }
}
