<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StudentParent extends Model
{
    protected $fillable = [
        'registration_id',
        // Father
        'father_name',
        'father_birth_place',
        'father_birth_date',
        'father_nik',
        'father_education',
        'father_occupation',
        'father_income',
        'father_address',
        'father_phone',
        'father_status',
        // Mother
        'mother_name',
        'mother_birth_place',
        'mother_birth_date',
        'mother_nik',
        'mother_education',
        'mother_occupation',
        'mother_income',
        'mother_address',
        'mother_phone',
        'mother_status',
        // Guardian
        'guardian_name',
        'guardian_birth_place',
        'guardian_birth_date',
        'guardian_nik',
        'guardian_education',
        'guardian_occupation',
        'guardian_income',
        'guardian_address',
        'guardian_phone',
        'guardian_status',
    ];

    protected function casts(): array
    {
        return [
            'father_birth_date' => 'date',
            'mother_birth_date' => 'date',
            'guardian_birth_date' => 'date',
        ];
    }

    public function registration(): BelongsTo
    {
        return $this->belongsTo(Registration::class);
    }
}
