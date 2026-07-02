<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ClientResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user' => [
                'id' => $this->user?->id,
                'first_name' => $this->user?->first_name,
                'last_name' => $this->user?->last_name,
                'email' => $this->user?->email,
                'phone' => $this->user?->phone,
            ],
            'date_of_birth' => $this->date_of_birth,
            'address_line_1' => $this->address_line_1,
            'address_line_2' => $this->address_line_2,
            'city' => $this->city,
            'state' => $this->state,
            'postal_code' => $this->postal_code,
            'country' => $this->country,
            'emergency_contact_name' => $this->emergency_contact_name,
            'emergency_contact_phone' => $this->emergency_contact_phone,
            'care_notes' => $this->care_notes,
            'mobility_notes' => $this->mobility_notes,
            'medical_notes' => $this->medical_notes,
            'status' => $this->status,
            'deleted_at' => $this->deleted_at,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'attachments' => $this->whenLoaded('attachments', function() {
                return $this->attachments->map(function ($attachment) {
                    return [
                        'id' => $attachment->id,
                        'file_name' => $attachment->file_name,
                        'file_url' => asset('storage/' . $attachment->file_path),
                        'file_type' => $attachment->file_type,
                        'file_size' => $attachment->file_size,
                    ];
                });
            }),
            'family_members' => $this->whenLoaded('familyMembers'),
        ];
    }
}
