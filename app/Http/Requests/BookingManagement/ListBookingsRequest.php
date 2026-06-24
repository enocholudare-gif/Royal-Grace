<?php

namespace App\Http\Requests\BookingManagement;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ListBookingsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('viewAny', \App\Models\Booking::class) ?? false;
    }

    public function rules(): array
    {
        return [
            'status' => ['nullable', Rule::in(['pending', 'awaiting_payment', 'confirmed', 'assigned', 'in_progress', 'completed', 'cancelled', 'refunded'])],
            'client_id' => ['nullable', 'integer', 'exists:clients,id'],
            'service_id' => ['nullable', 'integer', 'exists:services,id'],
            'assigned_caregiver_id' => ['nullable', 'integer', 'exists:caregivers,id'],
            'from' => ['nullable', 'date'],
            'to' => ['nullable', 'date', 'after_or_equal:from'],
            'recurrence_group_uuid' => ['nullable', 'uuid'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:100'],
        ];
    }
}
