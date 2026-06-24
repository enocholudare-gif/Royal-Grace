<?php

namespace App\Listeners\Notifications;

use App\Events\BookingManagement\BookingAssigned;
use App\Notifications\System\BookingAssignedNotification;
use Illuminate\Contracts\Queue\ShouldQueue;

class SendBookingAssignedNotification implements ShouldQueue
{
    public function handle(BookingAssigned $event): void
    {
        $booking = $event->booking->fresh(['client.user', 'assignedCaregiver.user']);

        collect([$booking?->client?->user, $booking?->assignedCaregiver?->user])
            ->filter()
            ->unique('id')
            ->each(fn ($user) => $user->notify(new BookingAssignedNotification($booking)));
    }
}
