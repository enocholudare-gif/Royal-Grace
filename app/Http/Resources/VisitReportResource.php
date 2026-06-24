<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class VisitReportResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'booking_id' => $this->booking_id,
            'caregiver_id' => $this->caregiver_id,
            'arrival_time' => $this->arrival_time,
            'departure_time' => $this->departure_time,
            'check_in_latitude' => $this->check_in_latitude,
            'check_in_longitude' => $this->check_in_longitude,
            'check_out_latitude' => $this->check_out_latitude,
            'check_out_longitude' => $this->check_out_longitude,
            'check_in_device_info' => $this->check_in_device_info,
            'check_out_device_info' => $this->check_out_device_info,
            'services_performed' => $this->services_performed,
            'observations' => $this->observations,
            'client_condition' => $this->client_condition,
            'notes' => $this->notes,
            'status' => $this->status,
            'submitted_at' => $this->submitted_at,
            'reviewed_at' => $this->reviewed_at,
            'reviewed_by' => $this->reviewed_by,
            'booking' => new BookingResource($this->whenLoaded('booking')),
            'caregiver' => new CaregiverResource($this->whenLoaded('caregiver')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
