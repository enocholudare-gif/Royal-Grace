<?php

namespace App\Listeners\Notifications;

use App\Events\Ratings\LowRatingSubmitted;
use App\Models\User;
use App\Notifications\Ratings\LowRatingAlertNotification;
use Illuminate\Contracts\Queue\ShouldQueue;

class SendLowRatingAlertNotification implements ShouldQueue
{
    public function handle(LowRatingSubmitted $event): void
    {
        $rating = $event->rating->fresh(['booking', 'client.user', 'caregiver.user']);

        User::query()
            ->whereHas('role', fn ($query) => $query->whereIn('slug', ['super-admin', 'admin']))
            ->get()
            ->each(fn (User $admin) => $admin->notify(new LowRatingAlertNotification($rating)));
    }
}
