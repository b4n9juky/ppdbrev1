<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ScoreStoreRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'scores' => ['required', 'array', 'min:1'],
            'scores.*.subject_id' => ['required', 'exists:subjects,id'],
            'scores.*.scores' => ['nullable', 'numeric', 'min:0', 'max:100'],
        ];
    }
}
