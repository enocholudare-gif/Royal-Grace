<?php

namespace App\Http\Requests\Pwa;

use Illuminate\Foundation\Http\FormRequest;

class RegisterDeviceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'token' => ['required', 'string', 'max:500'],
            'device_type' => ['required', 'string', 'max:50'],
            'device_name' => ['nullable', 'string', 'max:150'],
            'device_uuid' => ['required', 'string', 'max:120'],
            'platform' => ['nullable', 'string', 'max:50'],
        ];
    }
}
