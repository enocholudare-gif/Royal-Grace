<?php

namespace App\Http\Requests\PaymentManagement;

use Illuminate\Foundation\Http\FormRequest;

class InitializeBookingPaymentRequest extends FormRequest
{
    public function authorize(): bool
    {
        $booking = $this->route('booking');

        return $this->user()?->hasPermission('payments.create')
            && $booking
            && $this->user()?->can('view', $booking);
    }

    public function rules(): array
    {
        return [];
    }
}
