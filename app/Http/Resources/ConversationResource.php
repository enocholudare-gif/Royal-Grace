<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ConversationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'booking_id' => $this->booking_id,
            'created_by' => $this->created_by,
            'subject' => $this->subject,
            'type' => $this->type,
            'last_message_at' => $this->last_message_at,
            'participants' => $this->whenLoaded('participants', fn () => $this->participants->map(fn ($user) => [
                'id' => $user->id,
                'name' => trim($user->first_name . ' ' . $user->last_name),
                'role' => $user->role?->slug,
                'last_read_at' => $user->pivot?->last_read_at,
            ])->values()),
            'latest_messages' => MessageResource::collection($this->whenLoaded('messages')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
