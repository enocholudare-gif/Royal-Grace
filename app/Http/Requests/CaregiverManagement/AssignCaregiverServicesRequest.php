<?php

namespace App\Http\Requests\CaregiverManagement;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class AssignCaregiverServicesRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->hasPermission('caregivers.manage') ?? false;
    }

    public function rules(): array
    {
        return [
            'service_ids' => ['required', 'array', 'min:1'],
            'service_ids.*' => ['integer', 'distinct', 'exists:services,id'],
            'primary_service_id' => ['nullable', 'integer', Rule::in($this->input('service_ids', []))],
        ];
    }
}
