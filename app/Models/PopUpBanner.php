<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable([
    'title',
    'image',
    'is_active',
])]
class PopUpBanner extends Model
{
    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }
}
