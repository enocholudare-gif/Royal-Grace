<?php

namespace App\Listeners\Notifications;

use App\Events\PaymentManagement\PaymentSucceeded;
use App\Notifications\System\PaymentSuccessfulNotification;
use Illuminate\Contracts\Queue\ShouldQueue;

class SendPaymentSuccessfulNotification implements ShouldQueue
{
    public function handle(PaymentSucceeded $event): void
    {
        $payment = $event->payment->fresh(['user', 'booking.client.user']);

        collect([$payment?->user, $payment?->booking?->client?->user])
            ->filter()
            ->unique('id')
            ->each(fn ($user) => $user->notify(new PaymentSuccessfulNotification($payment)));
    }
}
