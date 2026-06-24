<?php

namespace App\Http\Requests\CaregiverManagement;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ListCaregiversRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->hasPermission('caregivers.view') ?? false;
    }

    public function rules(): array
    {
        return [
            'status' => ['nullable', Rule::in(['active', 'inactive', 'suspended'])],
            'is_available' => ['nullable', 'boolean'],
            'city' => ['nullable', 'string', 'max:100'],
            'state' => ['nullable', 'string', 'max:100'],
            'service_id' => ['nullable', 'integer', 'exists:services,id'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:100'],
        ];
    }
}
