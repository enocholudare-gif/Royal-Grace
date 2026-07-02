<?php

namespace App\Notifications\Support;

use App\Models\SupportTicket;
use App\Models\SupportTicketMessage;
use App\Notifications\System\BaseQueuedNotification;
use Illuminate\Notifications\Messages\MailMessage;

class NewSupportReplyNotification extends BaseQueuedNotification
{
    public function __construct(public SupportTicket $ticket, public SupportTicketMessage $reply)
    {
    }

    public function notificationType(): string
    {
        return 'new_support_reply';
    }

    public function toMail(object $notifiable): MailMessage
    {
        $senderName = $this->reply->user ? "{$this->reply->user->first_name} {$this->reply->user->last_name}" : "Support Team";
        $url = $notifiable->hasRole(['admin', 'super-admin']) 
            ? url("/admin/support/{$this->ticket->id}") 
            : url("/support/{$this->ticket->id}");

        return (new MailMessage())
            ->subject("New Reply on Ticket {$this->ticket->ticket_number}")
            ->line("{$senderName} has replied to support ticket {$this->ticket->ticket_number}.")
            ->line("Message: {$this->reply->message}")
            ->action('View Ticket', $url);
    }

    public function toArray(object $notifiable): array
    {
        return $this->payload($notifiable);
    }

    public function toFcm(object $notifiable): array
    {
        $senderName = $this->reply->user ? "{$this->reply->user->first_name} {$this->reply->user->last_name}" : "Support Team";
        return [
            'title' => "New Reply on Ticket {$this->ticket->ticket_number}",
            'body' => "{$senderName}: {$this->reply->message}",
            'data' => $this->payload($notifiable),
        ];
    }

    protected function payload(object $notifiable): array
    {
        $url = $notifiable->hasRole(['admin', 'super-admin']) 
            ? "/admin/support/{$this->ticket->id}" 
            : "/support/{$this->ticket->id}";

        return [
            'type' => $this->notificationType(),
            'title' => "New Support Reply",
            'description' => "New reply on ticket {$this->ticket->ticket_number}",
            'url' => $url,
            'ticket_id' => $this->ticket->id,
            'ticket_number' => $this->ticket->ticket_number,
            'reply_id' => $this->reply->id,
            'message' => $this->reply->message,
        ];
    }
}
