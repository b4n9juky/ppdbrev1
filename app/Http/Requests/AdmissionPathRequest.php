<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AdmissionPathRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:1000'],
            'quota' => ['required', 'integer', 'min:0'],
            'is_active' => ['boolean'],
            'is_show' => ['boolean'],
        ];
    }
}
