<?php

namespace App\Notifications\System;

use App\Models\NotificationPreference;
use App\Notifications\Channels\FcmChannel;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Notifications\Notification;

abstract class BaseQueuedNotification extends Notification implements ShouldQueue, ShouldBroadcast
{
    use Queueable;

    abstract public function notificationType(): string;

    public function via(object $notifiable): array
    {
        $preference = NotificationPreference::query()
            ->where('user_id', $notifiable->id)
            ->where('notification_type', $this->notificationType())
            ->first();

        $channels = ['database', 'broadcast'];

        if ($preference?->email_enabled ?? true) {
            $channels[] = 'mail';
        }

        if ($preference?->fcm_enabled ?? true) {
            $channels[] = FcmChannel::class;
        }

        return $channels;
    }
}
