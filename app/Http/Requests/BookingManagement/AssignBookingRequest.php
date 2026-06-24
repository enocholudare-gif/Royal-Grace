<?php

namespace App\Http\Requests\BookingManagement;

use App\Models\Caregiver;
use App\Services\Scheduling\AvailabilityEngine;
use Illuminate\Foundation\Http\FormRequest;

class AssignBookingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('assign', $this->route('booking')) ?? false;
    }

    public function rules(): array
    {
        return [
            'caregiver_id' => [
                'required',
                'integer',
                'exists:caregivers,id',
                function (string $attribute, mixed $value, \Closure $fail): void {
                    $caregiver = Caregiver::query()->find($value);
                    $booking = $this->route('booking');

                    if (! $caregiver || ! $booking) {
                        return;
                    }

                    if (! app(AvailabilityEngine::class)->caregiverCanAcceptBooking($caregiver, $booking->scheduled_start_at, $booking->scheduled_end_at, $booking->id)) {
                        $fail('Caregiver is unavailable or already assigned during this time.');
                    }
                },
            ],
        ];
    }
}
