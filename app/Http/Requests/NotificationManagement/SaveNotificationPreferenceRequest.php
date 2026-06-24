<?php

namespace App\Http\Requests\NotificationManagement;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class SaveNotificationPreferenceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->hasPermission('notifications.view') ?? false;
    }

    public function rules(): array
    {
        return [
            'notification_type' => ['required', Rule::in([
                'booking_created',
                'booking_assigned',
                'booking_cancelled',
                'payment_successful',
                'visit_started',
                'visit_completed',
                'new_message',
            ])],
            'email_enabled' => ['required', 'boolean'],
            'fcm_enabled' => ['required', 'boolean'],
        ];
    }
}
