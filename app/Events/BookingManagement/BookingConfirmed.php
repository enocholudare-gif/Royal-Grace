<?php

namespace App\Events\BookingManagement;

use App\Models\Booking;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class BookingConfirmed
{
    use Dispatchable;
    use SerializesModels;

    public function __construct(public Booking $booking)
    {
    }
}
