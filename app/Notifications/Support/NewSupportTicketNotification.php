<?php

namespace App\Notifications\Support;

use App\Models\SupportTicket;
use App\Notifications\System\BaseQueuedNotification;
use Illuminate\Notifications\Messages\MailMessage;

class NewSupportTicketNotification extends BaseQueuedNotification
{
    public function __construct(public SupportTicket $ticket)
    {
    }

    public function notificationType(): string
    {
        return 'new_support_ticket';
    }

    public function toMail(object $notifiable): MailMessage
    {
        $creatorName = $this->ticket->user ? "{$this->ticket->user->first_name} {$this->ticket->user->last_name}" : 'A user';
        return (new MailMessage())
            ->subject('New Support Ticket Created')
            ->line("A new support ticket {$this->ticket->ticket_number} has been created by {$creatorName}.")
            ->line("Subject: {$this->ticket->subject}")
            ->action('View Ticket', url("/admin/support/{$this->ticket->id}"));
    }

    public function toArray(object $notifiable): array
    {
        return $this->payload();
    }

    public function toFcm(object $notifiable): array
    {
        return [
            'title' => 'New Support Ticket',
            'body' => "Ticket {$this->ticket->ticket_number}: {$this->ticket->subject}",
            'data' => $this->payload(),
        ];
    }

    protected function payload(): array
    {
        return [
            'type' => $this->notificationType(),
            'title' => 'New Support Ticket',
            'description' => "Ticket {$this->ticket->ticket_number} has been created: {$this->ticket->subject}",
            'url' => "/admin/support/{$this->ticket->id}",
            'ticket_id' => $this->ticket->id,
            'ticket_number' => $this->ticket->ticket_number,
            'priority' => $this->ticket->priority,
            'subject' => $this->ticket->subject,
        ];
    }
}
