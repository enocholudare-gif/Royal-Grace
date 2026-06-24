<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RatingResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'booking_id' => $this->booking_id,
            'client_id' => $this->client_id,
            'caregiver_id' => $this->caregiver_id,
            'rating' => $this->rating,
            'comment' => $this->comment,
            'submitted_at' => $this->submitted_at,
            'booking' => new BookingResource($this->whenLoaded('booking')),
            'client' => new ClientResource($this->whenLoaded('client')),
            'caregiver' => new CaregiverResource($this->whenLoaded('caregiver')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
