<?php

namespace App\Notifications\System;

use App\Models\VisitReport;
use Illuminate\Notifications\Messages\MailMessage;

class VisitCompletedNotification extends BaseQueuedNotification
{
    public function __construct(public VisitReport $visitReport)
    {
    }

    public function notificationType(): string
    {
        return 'visit_completed';
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage())
            ->subject('Visit Completed')
            ->line("Visit for booking {$this->visitReport->booking?->booking_number} has been completed.");
    }

    public function toArray(object $notifiable): array
    {
        return $this->payload();
    }

    public function toFcm(object $notifiable): array
    {
        return [
            'title' => 'Visit Completed',
            'body' => "Visit for booking {$this->visitReport->booking?->booking_number} is complete.",
            'data' => $this->payload(),
        ];
    }

    protected function payload(): array
    {
        return [
            'type' => $this->notificationType(),
            'visit_report_id' => $this->visitReport->id,
            'booking_id' => $this->visitReport->booking_id,
        ];
    }
}
