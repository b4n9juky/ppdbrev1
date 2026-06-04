<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PopUpBannerRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'image' => ['nullable', 'image', 'mimes:png,jpg,jpeg', 'max:2048'],
            'is_active' => ['boolean'],
        ];
    }
}
