<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ReleaseRegistrationRequest extends FormRequest
{
    public function authorize(): bool
    {
        $registration = $this->route('registration');
        if (! $registration) {
            return false;
        }

        return $this->user()->role === 'admin' || $registration->assigned_operator_id === $this->user()->id;
    }

    public function rules(): array
    {
        return [];
    }
}
