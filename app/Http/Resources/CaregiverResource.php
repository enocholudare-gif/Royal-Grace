<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CaregiverResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'name' => $this->whenLoaded('user', fn () => trim($this->user->first_name . ' ' . $this->user->last_name)),
            'email' => $this->whenLoaded('user', fn () => $this->user->email),
            'average_rating' => $this->average_rating,
            'attendance_score' => $this->attendance_score,
            'is_available' => $this->is_available,
            'status' => $this->status,
            'services' => ServiceResource::collection($this->whenLoaded('services')),
            'documents' => CaregiverDocumentResource::collection($this->whenLoaded('documents')),
            'availabilities' => CaregiverAvailabilityResource::collection($this->whenLoaded('availabilities')),
            'attendance_records' => CaregiverAttendanceResource::collection($this->whenLoaded('attendanceRecords')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
