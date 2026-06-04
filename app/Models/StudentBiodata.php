<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['registration_id', 'nisn', 'full_name', 'gender', 'birth_place', 'birth_date', 'address', 'previous_school'])]
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
