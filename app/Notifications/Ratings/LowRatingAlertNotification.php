<?php

namespace App\Notifications\Ratings;

use App\Models\Rating;
use App\Notifications\System\BaseQueuedNotification;
use Illuminate\Notifications\Messages\MailMessage;

class LowRatingAlertNotification extends BaseQueuedNotification
{
    public function __construct(public Rating $rating)
    {
    }

    public function notificationType(): string
    {
        return 'low_rating_alert';
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage())
            ->subject('Low Rating Alert')
            ->line("A {$this->rating->rating}-star rating was submitted.")
            ->line("Booking: {$this->rating->booking?->booking_number}")
            ->line($this->rating->comment ?: 'No comment provided.');
    }

    public function toArray(object $notifiable): array
    {
        return $this->payload();
    }

    public function toFcm(object $notifiable): array
    {
        return [
            'title' => 'Low Rating Alert',
            'body' => "A {$this->rating->rating}-star review needs attention.",
            'data' => $this->payload(),
        ];
    }

    protected function payload(): array
    {
        return [
            'type' => $this->notificationType(),
            'rating_id' => $this->rating->id,
            'booking_id' => $this->rating->booking_id,
            'caregiver_id' => $this->rating->caregiver_id,
            'rating' => $this->rating->rating,
            'comment' => $this->rating->comment,
        ];
    }
}
