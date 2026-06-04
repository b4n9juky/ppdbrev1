<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateRegistrationStatusRequest extends FormRequest
{
    public function authorize(): bool
    {
        $registration = $this->route('registration');
        if (!$registration) {
            return false;
        }

        $user = $this->user();
        if ($user->role === 'admin') {
            return true;
        }

        if ($user->role === 'operator') {
            return $registration->assigned_operator_id === $user->id 
                && $registration->processing_status === 'selesai';
        }

        return false;
    }

    public function rules(): array
    {
        return [
            'status' => ['required', 'string', 'in:accepted,reserve,rejected'],
        ];
    }
}
