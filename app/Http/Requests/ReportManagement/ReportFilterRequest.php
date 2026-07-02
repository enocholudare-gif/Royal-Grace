<?php

namespace App\Http\Requests\ReportManagement;

use Illuminate\Foundation\Http\FormRequest;

class ReportFilterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Handled by policy
    }

    public function rules(): array
    {
        return [
            'from' => ['nullable', 'date'],
            'to' => ['nullable', 'date', 'after_or_equal:from'],
            'timeframe' => ['nullable', 'in:daily,weekly,monthly,yearly'],
            'service_id' => ['nullable', 'integer', 'exists:services,id'],
            'caregiver_id' => ['nullable', 'integer', 'exists:caregivers,id'],
            'client_id' => ['nullable', 'integer', 'exists:clients,id'],
            'booking_status' => ['nullable', 'string'],
        ];
    }
}
