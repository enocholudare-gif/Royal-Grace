<?php

namespace App\Notifications\System;

use App\Models\VisitReport;
use Illuminate\Notifications\Messages\MailMessage;

class VisitStartedNotification extends BaseQueuedNotification
{
    public function __construct(public VisitReport $visitReport)
    {
    }

    public function notificationType(): string
    {
        return 'visit_started';
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage())
            ->subject('Visit Started')
            ->line("Visit for booking {$this->visitReport->booking?->booking_number} has started.");
    }

    public function toArray(object $notifiable): array
    {
        return $this->payload();
    }

    public function toFcm(object $notifiable): array
    {
        return [
            'title' => 'Visit Started',
            'body' => "Caregiver checked in for booking {$this->visitReport->booking?->booking_number}.",
            'data' => $this->payload(),
        ];
    }

    protected function payload(): array
    {
        return [
            'type' => $this->notificationType(),
            'title' => 'Visit Started',
            'description' => "Caregiver checked in for booking {$this->visitReport->booking?->booking_number}.",
            'url' => "/family/visits",
            'visit_report_id' => $this->visitReport->id,
            'booking_id' => $this->visitReport->booking_id,
        ];
    }
}
