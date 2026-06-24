<?php

namespace App\Http\Requests\PaymentManagement;

use Illuminate\Foundation\Http\FormRequest;

class VerifyPaymentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->hasPermission('payments.create') || $this->user()?->hasPermission('payments.manage');
    }

    public function rules(): array
    {
        return [
            'reference' => ['required', 'string', 'max:100', 'exists:payments,provider_payment_intent_id'],
        ];
    }
}
