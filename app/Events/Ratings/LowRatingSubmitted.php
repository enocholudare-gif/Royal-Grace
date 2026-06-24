<?php

namespace App\Events\Ratings;

use App\Models\Rating;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class LowRatingSubmitted
{
    use Dispatchable;
    use SerializesModels;

    public function __construct(public Rating $rating)
    {
    }
}
