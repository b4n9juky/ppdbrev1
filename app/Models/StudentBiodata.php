<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'registration_id',
    'nisn',
    'full_name',
    'gender',
    'birth_place',
    'birth_date',
    'address',
    'phone_number',
    'previous_school',
    'nik',
    'child_order',
    'siblings_count',
    'student_status',
    'district',
    'subdistrict',
    'living_status',
    'distance_to_school',
    'blood_type',
    'disability',
    'previous_school_status',
    'previous_school_npsn',
    'previous_school_address',
    'previous_school_city',
    'previous_school_district',
    'previous_school_subdistrict',
    'accepted_class',
    'accepted_program',
    'accepted_date',
])]
class StudentBiodata extends Model
{
    protected function casts(): array
    {
        return [
            'birth_date' => 'date',
        ];
    }

    public function registration(): BelongsTo
    {
        return $this->belongsTo(Registration::class);
    }
}
