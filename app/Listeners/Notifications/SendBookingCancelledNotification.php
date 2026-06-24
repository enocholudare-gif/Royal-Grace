<?php

namespace App\Listeners\Notifications;

use App\Events\BookingManagement\BookingCancelled;
use App\Models\User;
use App\Notifications\System\BookingCancelledNotification;
use Illuminate\Contracts\Queue\ShouldQueue;

class SendBookingCancelledNotification implements ShouldQueue
{
    public function handle(BookingCancelled $event): void
    {
        $booking = $event->booking->fresh(['client.user', 'assignedCaregiver.user']);

        collect([$booking?->client?->user, $booking?->assignedCaregiver?->user])
            ->filter()
            ->unique('id')
            ->each(fn ($user) => $user->notify(new BookingCancelledNotification($booking)));

        User::query()
            ->whereHas('role', fn ($query) => $query->whereIn('slug', ['super-admin', 'admin']))
            ->get()
            ->each(fn (User $admin) => $admin->notify(new BookingCancelledNotification($booking)));
    }
}
