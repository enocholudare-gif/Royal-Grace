<?php

namespace App\Http\Requests\BookingManagement;

use App\Models\Service;
use App\Rules\Scheduling\NoClientBookingOverlap;
use Illuminate\Foundation\Http\FormRequest;

class UpdateBookingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('update', $this->route('booking')) ?? false;
    }

    public function rules(): array
    {
        $booking = $this->route('booking');
        $service = $this->input('service_id')
            ? Service::query()->find($this->input('service_id'))
            : $booking?->service;

        return [
            'service_id' => ['sometimes', 'required', 'integer', 'exists:services,id'],
            'preferred_caregiver_id' => ['nullable', 'integer', 'exists:caregivers,id'],
            'scheduled_start_at' => ['sometimes', 'required', 'date', 'after:now', new NoClientBookingOverlap($booking?->client, $service, $booking?->id)],
            'care_instructions' => ['nullable', 'string', 'max:5000'],
            'discount_amount' => ['nullable', 'numeric', 'min:0', 'max:9999999999.99'],
            'tax_amount' => ['nullable', 'numeric', 'min:0', 'max:9999999999.99'],
        ];
    }
}
