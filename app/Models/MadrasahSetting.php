<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable([
    'madrasah_name',
    'address',
    'contact',
    'headmaster_name',
    'headmaster_nip',
    'kop_surat_path',
    'signature_path',
    'stamp_path',
    'logo_path',
])]
class MadrasahSetting extends Model
{
    //
}
