<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CaregiverAvailabilityResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'caregiver_id' => $this->caregiver_id,
            'availability_type' => $this->availability_type,
            'start_datetime' => $this->start_datetime,
            'end_datetime' => $this->end_datetime,
            'is_recurring' => $this->is_recurring,
            'recurrence_rule' => $this->recurrence_rule,
            'notes' => $this->notes,
            'created_at' => $this->created_at,
        ];
    }
}
