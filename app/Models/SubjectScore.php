<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['registration_id', 'subject_id', 'ijazah_score', 'test_score'])]
class SubjectScore extends Model
{
    protected function casts(): array
    {
        return [
            'ijazah_score' => 'decimal:2',
            'test_score' => 'decimal:2',
        ];
    }

    public function registration(): BelongsTo
    {
        return $this->belongsTo(Registration::class);
    }

    public function subject(): BelongsTo
    {
        return $this->belongsTo(Subject::class);
    }
}
