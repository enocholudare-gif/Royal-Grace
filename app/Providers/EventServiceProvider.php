<?php

namespace App\Providers;

use App\Events\BookingManagement\BookingAssigned;
use App\Events\BookingManagement\BookingCancelled;
use App\Events\BookingManagement\BookingCreated;
use App\Events\PaymentManagement\PaymentSucceeded;
use App\Events\Ratings\LowRatingSubmitted;
use App\Events\Support\EmergencySupportRequested;
use App\Events\VisitManagement\CaregiverCheckedIn;
use App\Events\VisitManagement\CaregiverCheckedOut;
use App\Listeners\Notifications\SendBookingAssignedNotification;
use App\Listeners\Notifications\SendBookingCancelledNotification;
use App\Listeners\Notifications\SendBookingCreatedNotification;
use App\Listeners\Notifications\SendPaymentSuccessfulNotification;
use App\Listeners\Notifications\SendLowRatingAlertNotification;
use App\Listeners\Notifications\SendEmergencySupportAlertNotification;
use App\Listeners\Notifications\SendVisitCompletedNotification;
use App\Listeners\Notifications\SendVisitStartedNotification;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;

class EventServiceProvider extends ServiceProvider
{
    protected $listen = [
        BookingCreated::class => [
            SendBookingCreatedNotification::class,
        ],
        BookingAssigned::class => [
            SendBookingAssignedNotification::class,
        ],
        BookingCancelled::class => [
            SendBookingCancelledNotification::class,
        ],
        PaymentSucceeded::class => [
            SendPaymentSuccessfulNotification::class,
        ],
        LowRatingSubmitted::class => [
            SendLowRatingAlertNotification::class,
        ],
        EmergencySupportRequested::class => [
            SendEmergencySupportAlertNotification::class,
        ],
        CaregiverCheckedIn::class => [
            SendVisitStartedNotification::class,
        ],
        CaregiverCheckedOut::class => [
            SendVisitCompletedNotification::class,
        ],
    ];
}
