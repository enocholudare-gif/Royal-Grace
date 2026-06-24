<?php

namespace App\Http\Requests\PaymentManagement;

use Illuminate\Foundation\Http\FormRequest;

class InitializeInvoicePaymentRequest extends FormRequest
{
    public function authorize(): bool
    {
        $invoice = $this->route('invoice');

        return $this->user()?->hasPermission('payments.create')
            && $invoice
            && $this->user()?->can('view', $invoice);
    }

    public function rules(): array
    {
        return [];
    }
}
