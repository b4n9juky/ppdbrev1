<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ScoreStoreRequest extends FormRequest
{
    public function rules(): array
    {
        $registration = $this->route('registration');
        $academicYearId = $registration?->academic_year_id;

        return [
            'scores' => ['required', 'array', 'min:1'],
            'scores.*.subject_id' => [
                'required',
                \Illuminate\Validation\Rule::exists('subjects', 'id')->where(function ($query) use ($academicYearId) {
                    if ($academicYearId) {
                        $query->where('academic_year_id', $academicYearId);
                    }
                    $query->where('is_active', true);
                }),
            ],
            'scores.*.scores' => ['nullable', 'numeric', 'min:0', 'max:100'],
        ];
    }
}
