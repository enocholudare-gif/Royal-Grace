<?php

namespace App\Notifications\System;

use App\Models\Booking;
use Illuminate\Notifications\Messages\MailMessage;

class BookingAssignedNotification extends BaseQueuedNotification
{
    public function __construct(public Booking $booking)
    {
    }

    public function notificationType(): string
    {
        return 'booking_assigned';
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage())
            ->subject('Booking Assigned')
            ->line("Booking {$this->booking->booking_number} has been assigned.");
    }

    public function toArray(object $notifiable): array
    {
        return $this->payload();
    }

    public function toFcm(object $notifiable): array
    {
        return [
            'title' => 'Booking Assigned',
            'body' => "Booking {$this->booking->booking_number} has been assigned.",
            'data' => $this->payload(),
        ];
    }

    protected function payload(): array
    {
        return [
            'type' => $this->notificationType(),
            'booking_id' => $this->booking->id,
            'booking_number' => $this->booking->booking_number,
        ];
    }
}
