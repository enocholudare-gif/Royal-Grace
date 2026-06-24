<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BookingResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'booking_number' => $this->booking_number,
            'client_id' => $this->client_id,
            'service_id' => $this->service_id,
            'assigned_caregiver_id' => $this->assigned_caregiver_id,
            'preferred_caregiver_id' => $this->preferred_caregiver_id,
            'scheduled_start_at' => $this->scheduled_start_at,
            'scheduled_end_at' => $this->scheduled_end_at,
            'care_instructions' => $this->care_instructions,
            'service_name_snapshot' => $this->service_name_snapshot,
            'service_price_snapshot' => $this->service_price_snapshot,
            'service_duration_snapshot' => $this->service_duration_snapshot,
            'status' => $this->status,
            'booking_source' => $this->booking_source,
            'is_recurring' => $this->is_recurring,
            'recurrence_group_uuid' => $this->recurrence_group_uuid,
            'subtotal_amount' => $this->subtotal_amount,
            'discount_amount' => $this->discount_amount,
            'tax_amount' => $this->tax_amount,
            'total_amount' => $this->total_amount,
            'confirmed_at' => $this->confirmed_at,
            'cancelled_at' => $this->cancelled_at,
            'cancellation_reason' => $this->cancellation_reason,
            'client' => new ClientResource($this->whenLoaded('client')),
            'service' => new ServiceResource($this->whenLoaded('service')),
            'assigned_caregiver' => new CaregiverResource($this->whenLoaded('assignedCaregiver')),
            'preferred_caregiver' => new CaregiverResource($this->whenLoaded('preferredCaregiver')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
