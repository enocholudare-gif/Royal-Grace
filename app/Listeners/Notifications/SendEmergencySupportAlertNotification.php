<?php

namespace App\Listeners\Notifications;

use App\Events\Support\EmergencySupportRequested;
use App\Models\User;
use App\Notifications\Support\EmergencySupportAlertNotification;
use Illuminate\Contracts\Queue\ShouldQueue;

class SendEmergencySupportAlertNotification implements ShouldQueue
{
    public function handle(EmergencySupportRequested $event): void
    {
        $ticket = $event->ticket->fresh(['user', 'booking']);

        User::query()
            ->whereHas('role', fn ($query) => $query->whereIn('slug', ['super-admin', 'admin']))
            ->get()
            ->each(fn (User $admin) => $admin->notify(new EmergencySupportAlertNotification($ticket)));
    }
}
