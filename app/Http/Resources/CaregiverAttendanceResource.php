<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CaregiverAttendanceResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'caregiver_id' => $this->caregiver_id,
            'booking_id' => $this->booking_id,
            'attendance_date' => $this->attendance_date,
            'clock_in_at' => $this->clock_in_at,
            'clock_out_at' => $this->clock_out_at,
            'status' => $this->status,
            'hours_worked' => $this->hours_worked,
            'notes' => $this->notes,
            'recorded_by' => $this->recorded_by,
            'created_at' => $this->created_at,
        ];
    }
}
