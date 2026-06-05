<?php

namespace App\Services;

use App\Models\Registration;
use App\Models\SubjectScore;
use Illuminate\Support\Facades\DB;

class ScoringService
{
    public function saveScores(Registration $registration, array $scores): void
    {
        DB::transaction(function () use ($registration, $scores) {
            SubjectScore::where('registration_id', $registration->id)->delete();

            $totalScores = 0;

            foreach ($scores as $score) {
                $scoreValue = $score['scores'] ?? null;

                SubjectScore::create([
                    'registration_id' => $registration->id,
                    'subject_id' => $score['subject_id'],
                    'scores' => is_numeric($scoreValue) ? $scoreValue : null,
                ]);

                if (is_numeric($scoreValue)) {
                    $totalScores += floatval($scoreValue);
                }
            }

            $registration->update([
                'total_score' => round($totalScores, 2),
            ]);
        });
    }
}