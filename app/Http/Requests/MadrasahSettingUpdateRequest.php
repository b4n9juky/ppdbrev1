<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class MadrasahSettingUpdateRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'madrasah_name' => ['required', 'string', 'max:255'],
            'address' => ['nullable', 'string', 'max:1000'],
            'kota' => ['nullable', 'string', 'max:100'],
            'propinsi' => ['nullable', 'string', 'max:100'],
            'contact' => ['nullable', 'string', 'max:255'],
            'headmaster_name' => ['nullable', 'string', 'max:255'],
            'headmaster_nip' => ['nullable', 'string', 'max:255'],
            'kop_surat' => ['nullable', 'image', 'mimes:png,jpg,jpeg', 'max:2048'],
            'signature' => ['nullable', 'image', 'mimes:png,jpg,jpeg', 'max:2048'],
            'stamp' => ['nullable', 'image', 'mimes:png,jpg,jpeg', 'max:2048'],
            'logo' => ['nullable', 'image', 'mimes:png,jpg,jpeg', 'max:2048'],
            'student_statement_points' => ['nullable', 'string'],
            'parent_statement_points' => ['nullable', 'string'],
            'participation_statement_points' => ['nullable', 'string'],
            'show_announcement' => ['boolean'],
        ];
    }
}
