<?php

namespace App\Http\Requests\NotificationManagement;

use Illuminate\Foundation\Http\FormRequest;

class MarkNotificationReadRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->hasPermission('notifications.view') ?? false;
    }

    public function rules(): array
    {
        return [
            'notification_id' => ['nullable', 'uuid', 'exists:notifications,id'],
        ];
    }
}
