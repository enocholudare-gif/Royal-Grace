<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DashboardMetricsResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'total_clients' => $this['total_clients'],
            'active_caregivers' => $this['active_caregivers'],
            'monthly_revenue' => $this['monthly_revenue'],
            'active_bookings' => $this['active_bookings'],
            'upcoming_visits' => $this['upcoming_visits'],
            'cancellation_rate' => $this['cancellation_rate'],
        ];
    }
}
