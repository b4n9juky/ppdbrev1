<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['name', 'description', 'quota', 'is_active', 'is_show'])]
class AdmissionPath extends Model
{
    protected function casts(): array
    {
        return [
            'quota' => 'integer',
            'is_active' => 'boolean',
            'is_show' => 'boolean',
        ];
    }

    public function registrations(): HasMany
    {
        return $this->hasMany(Registration::class);
    }

    public function getAvailableQuotaAttribute(): int
    {
        return $this->quota - $this->registrations()->whereIn('status', ['accepted', 'reserve'])->count();
    }
}
