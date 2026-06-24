<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CaregiverDocumentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'caregiver_id' => $this->caregiver_id,
            'document_type' => $this->document_type,
            'original_name' => $this->original_name,
            'disk' => $this->disk,
            'path' => $this->path,
            'mime_type' => $this->mime_type,
            'size_bytes' => $this->size_bytes,
            'status' => $this->status,
            'expires_at' => $this->expires_at,
            'reviewed_at' => $this->reviewed_at,
            'review_notes' => $this->review_notes,
            'created_at' => $this->created_at,
        ];
    }
}
