<?php

namespace App\Http\Requests\NotificationManagement;

use Illuminate\Foundation\Http\FormRequest;

class RegisterFcmTokenRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->hasPermission('notifications.view') ?? false;
    }

    public function rules(): array
    {
        return [
            'token' => ['required', 'string', 'max:500'],
            'device_type' => ['nullable', 'string', 'max:50'],
            'device_name' => ['nullable', 'string', 'max:150'],
        ];
    }
}
