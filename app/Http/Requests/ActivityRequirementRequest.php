<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ActivityRequirementRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'academic_year_id' => ['required', 'exists:academic_years,id'],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'order' => ['nullable', 'integer', 'min:0'],
        ];
    }
}
