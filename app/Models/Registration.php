<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

#[Fillable(['user_id', 'academic_year_id', 'admission_path_id', 'status', 'total_score'])]
class Registration extends Model
{
    protected function casts(): array
    {
        return [
            'total_score' => 'decimal:2',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function academicYear(): BelongsTo
    {
        return $this->belongsTo(AcademicYear::class);
    }

    public function admissionPath(): BelongsTo
    {
        return $this->belongsTo(AdmissionPath::class);
    }

    public function studentBiodata(): HasOne
    {
        return $this->hasOne(StudentBiodata::class);
    }

    public function studentDocuments(): HasMany
    {
        return $this->hasMany(StudentDocument::class);
    }

    public function subjectScores(): HasMany
    {
        return $this->hasMany(SubjectScore::class);
    }
}
