<?php

namespace App\Http\Requests\NotificationManagement;

use Illuminate\Foundation\Http\FormRequest;

class ListNotificationsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return ($this->user()?->hasPermission('notifications.view')
            || $this->user()?->hasPermission('support.view.own')) ?? false;
    }

    public function rules(): array
    {
        return [
            'unread' => ['nullable', 'boolean'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:100'],
        ];
    }
}
