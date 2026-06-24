<?php

namespace App\Http\Requests\CaregiverManagement;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreCaregiverRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->hasPermission('caregivers.manage') ?? false;
    }

    public function rules(): array
    {
        return [
            'first_name' => ['required', 'string', 'max:100'],
            'last_name' => ['required', 'string', 'max:100'],
            'email' => ['required', 'email', 'max:150', 'unique:users,email'],
            'phone' => ['nullable', 'string', 'max:30', 'unique:users,phone'],
            'password' => ['required', 'string', 'min:8'],
            'user_status' => ['nullable', Rule::in(['active', 'inactive', 'suspended', 'pending_verification'])],
            'address_line_1' => ['required', 'string', 'max:150'],
            'address_line_2' => ['nullable', 'string', 'max:150'],
            'city' => ['required', 'string', 'max:100'],
            'state' => ['required', 'string', 'max:100'],
            'postal_code' => ['required', 'string', 'max:20'],
            'country' => ['required', 'string', 'max:100'],
            'certifications' => ['nullable', 'array'],
            'certifications.*' => ['string', 'max:150'],
            'emergency_contact_name' => ['required', 'string', 'max:150'],
            'emergency_contact_phone' => ['required', 'string', 'max:30'],
            'bio' => ['nullable', 'string'],
            'is_available' => ['nullable', 'boolean'],
            'status' => ['nullable', Rule::in(['active', 'inactive', 'suspended'])],
        ];
    }
}
