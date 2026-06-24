<?php

namespace App\Notifications\Channels;

use App\Jobs\Notifications\SendFcmNotificationJob;
use Illuminate\Notifications\Notification;

class FcmChannel
{
    public function send(object $notifiable, Notification $notification): void
    {
        if (! method_exists($notification, 'toFcm')) {
            return;
        }

        $payload = $notification->toFcm($notifiable);

        SendFcmNotificationJob::dispatch(
            $notifiable,
            $payload['title'],
            $payload['body'],
            $payload['data'] ?? []
        );
    }
}
