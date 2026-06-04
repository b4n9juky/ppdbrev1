<?php

namespace App\Http\Controllers;

use App\Models\AcademicYear;
use App\Models\Registration;
use App\Models\Subject;
use App\Services\ScoringService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class StudentScoreController extends Controller
{
    public function edit(): Response
    {
        $activeYear = AcademicYear::where('is_active', true)->first();

        $registration = Registration::with('subjectScores.subject')
            ->where('user_id', auth()->id())
            ->where('academic_year_id', $activeYear->id)
            ->firstOrFail();

        $subjects = Subject::where('academic_year_id', $activeYear->id)
            ->where('is_active', true)
            ->get();

        return Inertia::render('Student/Scores', [
            'registration' => $registration,
            'subjects' => $subjects,
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $activeYear = AcademicYear::where('is_active', true)->first();

        $registration = Registration::where('user_id', auth()->id())
            ->where('academic_year_id', $activeYear->id)
            ->firstOrFail();

        if ($registration->status !== 'draft') {
            return Redirect::back()->with('error', 'Tidak dapat mengubah nilai setelah pendaftaran dikirim.');
        }

        $validated = $request->validate([
            'scores' => ['required', 'array'],
            'scores.*.subject_id' => ['required', 'exists:subjects,id'],
            'scores.*.ijazah_score' => ['nullable', 'numeric', 'min:0', 'max:100'],
        ]);

        app(ScoringService::class)->saveScores($registration, $validated['scores']);

        return Redirect::route('student.dashboard')
            ->with('success', 'Nilai ijazah berhasil disimpan.');
    }
}
