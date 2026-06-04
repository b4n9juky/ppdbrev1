<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ClaimRegistrationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->role === 'operator';
    }

    public function rules(): array
    {
        return [];
    }
}
