<?php

namespace App\Listeners\Notifications;

use App\Events\BookingManagement\BookingCreated;
use App\Models\User;
use App\Notifications\System\BookingCreatedNotification;
use Illuminate\Contracts\Queue\ShouldQueue;

class SendBookingCreatedNotification implements ShouldQueue
{
    public function handle(BookingCreated $event): void
    {
        $booking = $event->booking->fresh(['client.user']);

        $booking?->client?->user?->notify(new BookingCreatedNotification($booking));

        User::query()
            ->whereHas('role', fn ($query) => $query->whereIn('slug', ['super-admin', 'admin']))
            ->get()
            ->each(fn (User $admin) => $admin->notify(new BookingCreatedNotification($booking)));
    }
}
