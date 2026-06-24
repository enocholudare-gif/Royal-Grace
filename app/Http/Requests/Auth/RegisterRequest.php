<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class RegisterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'first_name' => ['required', 'string', 'max:100'],
            'last_name' => ['required', 'string', 'max:100'],
            'email' => ['required', 'email', 'max:150', 'unique:users,email'],
            'phone' => ['nullable', 'string', 'max:30', 'unique:users,phone'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'role' => ['required', 'string', Rule::in(['client', 'family-member', 'caregiver'])],
            'device_name' => ['nullable', 'string', 'max:255'],

            'client.date_of_birth' => ['nullable', 'date'],
            'client.address_line_1' => ['required_if:role,client', 'string', 'max:150'],
            'client.address_line_2' => ['nullable', 'string', 'max:150'],
            'client.city' => ['required_if:role,client', 'string', 'max:100'],
            'client.state' => ['required_if:role,client', 'string', 'max:100'],
            'client.postal_code' => ['required_if:role,client', 'string', 'max:20'],
            'client.country' => ['required_if:role,client', 'string', 'max:100'],
            'client.emergency_contact_name' => ['nullable', 'string', 'max:150'],
            'client.emergency_contact_phone' => ['nullable', 'string', 'max:30'],
            'client.care_notes' => ['nullable', 'string'],
            'client.mobility_notes' => ['nullable', 'string'],
            'client.medical_notes' => ['nullable', 'string'],

            'family_member.client_id' => ['required_if:role,family-member', 'integer', 'exists:clients,id'],
            'family_member.relationship_type' => ['required_if:role,family-member', 'string', 'max:50'],
            'family_member.can_view_bookings' => ['nullable', 'boolean'],
            'family_member.can_view_reports' => ['nullable', 'boolean'],
            'family_member.can_view_invoices' => ['nullable', 'boolean'],
            'family_member.can_receive_notifications' => ['nullable', 'boolean'],

            'caregiver.address_line_1' => ['required_if:role,caregiver', 'string', 'max:150'],
            'caregiver.address_line_2' => ['nullable', 'string', 'max:150'],
            'caregiver.city' => ['required_if:role,caregiver', 'string', 'max:100'],
            'caregiver.state' => ['required_if:role,caregiver', 'string', 'max:100'],
            'caregiver.postal_code' => ['required_if:role,caregiver', 'string', 'max:20'],
            'caregiver.country' => ['required_if:role,caregiver', 'string', 'max:100'],
            'caregiver.certifications' => ['nullable', 'array'],
            'caregiver.emergency_contact_name' => ['required_if:role,caregiver', 'string', 'max:150'],
            'caregiver.emergency_contact_phone' => ['required_if:role,caregiver', 'string', 'max:30'],
            'caregiver.bio' => ['nullable', 'string'],
        ];
    }
}
