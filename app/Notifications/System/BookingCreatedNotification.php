<?php

namespace App\Notifications\System;

use App\Models\Booking;
use Illuminate\Notifications\Messages\MailMessage;

class BookingCreatedNotification extends BaseQueuedNotification
{
    public function __construct(public Booking $booking)
    {
    }

    public function notificationType(): string
    {
        return 'booking_created';
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage())
            ->subject('Booking Created')
            ->line("Booking {$this->booking->booking_number} has been created.")
            ->line("Service: {$this->booking->service_name_snapshot}");
    }

    public function toArray(object $notifiable): array
    {
        return $this->payload('Booking Created');
    }

    public function toFcm(object $notifiable): array
    {
        return [
            'title' => 'Booking Created',
            'body' => "Booking {$this->booking->booking_number} is awaiting payment.",
            'data' => $this->payload('Booking Created'),
        ];
    }

    protected function payload(string $title): array
    {
        return [
            'type' => $this->notificationType(),
            'title' => $title,
            'booking_id' => $this->booking->id,
            'booking_number' => $this->booking->booking_number,
        ];
    }
}
