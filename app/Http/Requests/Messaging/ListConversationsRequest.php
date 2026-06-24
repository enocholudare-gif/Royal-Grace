<?php

namespace App\Http\Requests\Messaging;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ListConversationsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('viewAny', \App\Models\Conversation::class) ?? false;
    }

    public function rules(): array
    {
        return [
            'type' => ['nullable', Rule::in(['support', 'booking', 'general', 'family'])],
            'booking_id' => ['nullable', 'integer', 'exists:bookings,id'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:100'],
        ];
    }
}
