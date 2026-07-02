<?php

namespace App\Notifications\VisitManagement;

use App\Models\VisitReport;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Notifications\Notification;

class VisitReportSubmittedNotification extends Notification implements ShouldQueue, ShouldBroadcast
{
    use Queueable;

    public function __construct(public VisitReport $visitReport)
    {
    }

    public function via(object $notifiable): array
    {
        return ['mail', 'database', 'broadcast'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage())
            ->subject('Royal Grace Visit Report Submitted')
            ->line("A visit report has been submitted for booking {$this->visitReport->booking?->booking_number}.")
            ->line('Please log in to review the visit details.');
    }

    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'visit_report_submitted',
            'title' => 'Visit Report Submitted',
            'description' => "A visit report has been submitted for booking {$this->visitReport->booking?->booking_number}.",
            'url' => "/family/visits",
            'visit_report_id' => $this->visitReport->id,
            'booking_id' => $this->visitReport->booking_id,
            'caregiver_id' => $this->visitReport->caregiver_id,
            'status' => $this->visitReport->status,
        ];
    }
}
