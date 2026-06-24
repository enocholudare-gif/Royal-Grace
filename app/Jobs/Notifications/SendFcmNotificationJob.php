<?php

namespace App\Jobs\Notifications;

use App\Models\User;
use App\Services\Notifications\FcmService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class SendFcmNotificationJob implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public User $user,
        public string $title,
        public string $body,
        public array $data = []
    ) {
    }

    public function handle(FcmService $fcm): void
    {
        $fcm->sendToUser($this->user, $this->title, $this->body, $this->data);
    }
}
