<?php

namespace App\Http\Requests\PaymentManagement;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ListPaymentsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return ($this->user()?->hasPermission('payments.view')
            || $this->user()?->hasPermission('payments.view.own')
            || $this->user()?->hasPermission('invoices.view.family')) ?? false;
    }

    public function rules(): array
    {
        return [
            'status' => ['nullable', Rule::in(['pending', 'processing', 'succeeded', 'failed', 'cancelled', 'refunded'])],
            'payment_type' => ['nullable', Rule::in(['one_time', 'invoice'])],
            'booking_id' => ['nullable', 'integer', 'exists:bookings,id'],
            'invoice_id' => ['nullable', 'integer', 'exists:invoices,id'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:100'],
        ];
    }
}
