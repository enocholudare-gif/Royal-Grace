<?php

namespace App\Http\Requests\BookingManagement;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateBookingStatusRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('updateStatus', $this->route('booking')) ?? false;
    }

    public function rules(): array
    {
        return [
            'status' => ['required', Rule::in(['pending', 'awaiting_payment', 'confirmed', 'assigned', 'in_progress', 'completed', 'cancelled', 'refunded'])],
        ];
    }
}
