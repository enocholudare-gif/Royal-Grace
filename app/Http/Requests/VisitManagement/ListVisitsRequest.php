<?php

namespace App\Http\Requests\VisitManagement;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ListVisitsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('viewAny', \App\Models\VisitReport::class) ?? false;
    }

    public function rules(): array
    {
        return [
            'status' => ['nullable', Rule::in(['draft', 'submitted', 'reviewed'])],
            'booking_id' => ['nullable', 'integer', 'exists:bookings,id'],
            'caregiver_id' => ['nullable', 'integer', 'exists:caregivers,id'],
            'from' => ['nullable', 'date'],
            'to' => ['nullable', 'date', 'after_or_equal:from'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:100'],
        ];
    }
}
