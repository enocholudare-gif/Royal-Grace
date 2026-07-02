<?php

namespace App\Notifications\System;

use App\Models\Booking;
use Illuminate\Notifications\Messages\MailMessage;

class BookingCancelledNotification extends BaseQueuedNotification
{
    public function __construct(public Booking $booking)
    {
    }

    public function notificationType(): string
    {
        return 'booking_cancelled';
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage())
            ->subject('Booking Cancelled')
            ->line("Booking {$this->booking->booking_number} has been cancelled.")
            ->line($this->booking->cancellation_reason ?: 'No cancellation reason provided.');
    }

    public function toArray(object $notifiable): array
    {
        return $this->payload();
    }

    public function toFcm(object $notifiable): array
    {
        return [
            'title' => 'Booking Cancelled',
            'body' => "Booking {$this->booking->booking_number} was cancelled.",
            'data' => $this->payload(),
        ];
    }

    protected function payload(): array
    {
        return [
            'type' => $this->notificationType(),
            'title' => 'Booking Cancelled',
            'description' => "Booking {$this->booking->booking_number} has been cancelled.",
            'url' => "/family/bookings",
            'booking_id' => $this->booking->id,
            'booking_number' => $this->booking->booking_number,
            'reason' => $this->booking->cancellation_reason,
        ];
    }
}
