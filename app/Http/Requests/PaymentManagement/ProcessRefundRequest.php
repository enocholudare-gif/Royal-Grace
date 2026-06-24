<?php

namespace App\Http\Requests\PaymentManagement;

use Illuminate\Foundation\Http\FormRequest;

class ProcessRefundRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->hasPermission('refunds.manage') ?? false;
    }

    public function rules(): array
    {
        return [
            'amount' => ['nullable', 'numeric', 'min:1'],
            'reason' => ['nullable', 'string', 'max:2000'],
        ];
    }
}
