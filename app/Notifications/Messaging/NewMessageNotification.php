<?php

namespace App\Notifications\Messaging;

use App\Models\Message;
use App\Notifications\System\BaseQueuedNotification;
use Illuminate\Notifications\Messages\MailMessage;

class NewMessageNotification extends BaseQueuedNotification
{
    public function __construct(public Message $message)
    {
    }

    public function notificationType(): string
    {
        return 'new_message';
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage())
            ->subject('New Royal Grace Message')
            ->line('You have a new message in Royal Grace.')
            ->line($this->message->body ?: 'Attachment received.');
    }

    public function toArray(object $notifiable): array
    {
        return $this->payload();
    }

    public function toFcm(object $notifiable): array
    {
        return [
            'title' => 'New Message',
            'body' => $this->message->body ?: 'Attachment received.',
            'data' => $this->payload(),
        ];
    }

    protected function payload(): array
    {
        return [
            'type' => $this->notificationType(),
            'conversation_id' => $this->message->conversation_id,
            'message_id' => $this->message->id,
            'sender_user_id' => $this->message->sender_user_id,
            'body' => $this->message->body,
            'message_type' => $this->message->message_type,
        ];
    }
}
