<?php

namespace App\Listeners\Notifications;

use App\Events\VisitManagement\CaregiverCheckedIn;
use App\Notifications\System\VisitStartedNotification;
use Illuminate\Contracts\Queue\ShouldQueue;

class SendVisitStartedNotification implements ShouldQueue
{
    public function handle(CaregiverCheckedIn $event): void
    {
        $visitReport = $event->visitReport->fresh(['booking.client.user']);

        $visitReport?->booking?->client?->user?->notify(new VisitStartedNotification($visitReport));
    }
}
