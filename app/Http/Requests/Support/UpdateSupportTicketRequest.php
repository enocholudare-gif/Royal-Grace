<?php

namespace App\Http\Requests\Support;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateSupportTicketRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('update', $this->route('supportTicket')) ?? false;
    }

    public function rules(): array
    {
        return [
            'status' => ['sometimes', 'required', Rule::in(['open', 'in_progress', 'resolved', 'closed'])],
            'priority' => ['sometimes', 'required', Rule::in(['low', 'medium', 'high', 'emergency'])],
            'assigned_to' => ['nullable', 'integer', 'exists:users,id'],
        ];
    }
}
