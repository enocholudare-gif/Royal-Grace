<?php

namespace App\Http\Resources\NotificationManagement;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class NotificationPreferenceResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'notification_type' => $this->notification_type,
            'email_enabled' => $this->email_enabled,
            'fcm_enabled' => $this->fcm_enabled,
            'updated_at' => $this->updated_at,
        ];
    }
}
