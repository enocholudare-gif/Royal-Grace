<?php

namespace App\Listeners\Notifications;

use App\Events\VisitManagement\CaregiverCheckedOut;
use App\Notifications\System\VisitCompletedNotification;
use Illuminate\Contracts\Queue\ShouldQueue;

class SendVisitCompletedNotification implements ShouldQueue
{
    public function handle(CaregiverCheckedOut $event): void
    {
        $visitReport = $event->visitReport->fresh(['booking.client.user']);

        $visitReport?->booking?->client?->user?->notify(new VisitCompletedNotification($visitReport));
    }
}
