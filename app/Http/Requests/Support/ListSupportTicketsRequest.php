<?php

namespace App\Http\Requests\Support;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ListSupportTicketsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return ($this->user()?->hasPermission('support.manage') || $this->user()?->hasPermission('support.view.own')) ?? false;
    }

    public function rules(): array
    {
        return [
            'status' => ['nullable', Rule::in(['open', 'in_progress', 'resolved', 'closed'])],
            'priority' => ['nullable', Rule::in(['low', 'medium', 'high', 'emergency'])],
            'booking_id' => ['nullable', 'integer', 'exists:bookings,id'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:100'],
        ];
    }
}
