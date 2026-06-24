<?php

namespace App\Events\VisitManagement;

use App\Models\VisitReport;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class CaregiverCheckedIn
{
    use Dispatchable;
    use SerializesModels;

    public function __construct(public VisitReport $visitReport)
    {
    }
}
