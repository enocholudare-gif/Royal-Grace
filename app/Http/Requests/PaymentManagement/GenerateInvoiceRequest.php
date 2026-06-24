<?php

namespace App\Http\Requests\PaymentManagement;

use Illuminate\Foundation\Http\FormRequest;

class GenerateInvoiceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->hasPermission('payments.manage') ?? false;
    }

    public function rules(): array
    {
        return [];
    }
}
