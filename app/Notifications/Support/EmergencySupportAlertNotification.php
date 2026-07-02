<?php

namespace App\Notifications\Support;

use App\Models\SupportTicket;
use App\Notifications\System\BaseQueuedNotification;
use Illuminate\Notifications\Messages\MailMessage;

class EmergencySupportAlertNotification extends BaseQueuedNotification
{
    public function __construct(public SupportTicket $ticket)
    {
    }

    public function notificationType(): string
    {
        return 'emergency_support_alert';
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage())
            ->subject('Emergency Support Alert')
            ->line("Emergency support ticket {$this->ticket->ticket_number} requires immediate attention.")
            ->line($this->ticket->subject);
    }

    public function toArray(object $notifiable): array
    {
        return $this->payload();
    }

    public function toFcm(object $notifiable): array
    {
        return [
            'title' => 'Emergency Support Alert',
            'body' => "Ticket {$this->ticket->ticket_number} requires immediate attention.",
            'data' => $this->payload(),
        ];
    }

    protected function payload(): array
    {
        return [
            'type' => $this->notificationType(),
            'title' => 'Emergency Support Alert',
            'description' => "Ticket {$this->ticket->ticket_number} requires immediate attention.",
            'url' => "/admin/support",
            'ticket_id' => $this->ticket->id,
            'ticket_number' => $this->ticket->ticket_number,
            'priority' => $this->ticket->priority,
            'subject' => $this->ticket->subject,
        ];
    }
}
