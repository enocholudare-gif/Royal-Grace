<?php

namespace App\Events\BookingManagement;

use App\Models\Booking;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class BookingCancelled
{
    use Dispatchable;
    use SerializesModels;

    public function __construct(public Booking $booking)
    {
    }
}
