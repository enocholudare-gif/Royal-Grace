<?php

namespace App\Http\Requests\Pwa;

use Illuminate\Foundation\Http\FormRequest;

class QueueSyncRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'device_uuid' => ['required', 'string', 'max:120'],
            'operation_type' => ['required', 'string', 'max:100'],
            'payload' => ['nullable', 'array'],
        ];
    }
}
