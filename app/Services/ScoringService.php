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

            $totalIjazah = 0;
            $totalTest = 0;
            $count = 0;

            foreach ($scores as $score) {
                SubjectScore::create([
                    'registration_id' => $registration->id,
                    'subject_id' => $score['subject_id'],
                    'ijazah_score' => $score['ijazah_score'] ?? 0,
                    'test_score' => $score['test_score'] ?? 0,
                ]);

                $totalIjazah += floatval($score['ijazah_score'] ?? 0);
                $totalTest += floatval($score['test_score'] ?? 0);
                $count++;
            }

            $totalScore = $count > 0 ? ($totalIjazah + $totalTest) / $count : 0;

            $registration->update([
                'total_score' => round($totalScore, 2),
            ]);
        });
    }
}
