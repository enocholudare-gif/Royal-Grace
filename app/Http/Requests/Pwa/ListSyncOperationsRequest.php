<?php

namespace App\Http\Requests\Pwa;

use Illuminate\Foundation\Http\FormRequest;

class ListSyncOperationsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'device_uuid' => ['required', 'string', 'max:120'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:100'],
        ];
    }
}
