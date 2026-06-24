<?php

namespace App\Http\Requests\CaregiverManagement;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreCaregiverAttendanceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('recordAttendance', $this->route('caregiver')) ?? false;
    }

    public function rules(): array
    {
        return [
            'booking_id' => ['nullable', 'integer', 'exists:bookings,id'],
            'attendance_date' => ['required', 'date'],
            'clock_in_at' => ['nullable', 'date'],
            'clock_out_at' => ['nullable', 'date', 'after:clock_in_at'],
            'status' => ['required', Rule::in(['scheduled', 'present', 'late', 'absent', 'excused'])],
            'hours_worked' => ['nullable', 'numeric', 'min:0', 'max:24'],
            'notes' => ['nullable', 'string', 'max:2000'],
        ];
    }
}
