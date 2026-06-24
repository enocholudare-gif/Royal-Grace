<?php

namespace App\Http\Requests\CaregiverManagement;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateCaregiverRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('update', $this->route('caregiver')) ?? false;
    }

    public function rules(): array
    {
        return [
            'address_line_1' => ['sometimes', 'required', 'string', 'max:150'],
            'address_line_2' => ['nullable', 'string', 'max:150'],
            'city' => ['sometimes', 'required', 'string', 'max:100'],
            'state' => ['sometimes', 'required', 'string', 'max:100'],
            'postal_code' => ['sometimes', 'required', 'string', 'max:20'],
            'country' => ['sometimes', 'required', 'string', 'max:100'],
            'certifications' => ['nullable', 'array'],
            'certifications.*' => ['string', 'max:150'],
            'emergency_contact_name' => ['sometimes', 'required', 'string', 'max:150'],
            'emergency_contact_phone' => ['sometimes', 'required', 'string', 'max:30'],
            'bio' => ['nullable', 'string'],
            'is_available' => ['nullable', 'boolean'],
            'status' => ['nullable', Rule::in(['active', 'inactive', 'suspended'])],
        ];
    }
}
