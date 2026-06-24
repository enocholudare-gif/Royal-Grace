<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MessageResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'conversation_id' => $this->conversation_id,
            'sender_user_id' => $this->sender_user_id,
            'body' => $this->body,
            'message_type' => $this->message_type,
            'sent_at' => $this->sent_at,
            'sender' => $this->whenLoaded('sender', fn () => [
                'id' => $this->sender->id,
                'name' => trim($this->sender->first_name . ' ' . $this->sender->last_name),
                'role' => $this->sender->role?->slug,
            ]),
            'attachments' => MessageAttachmentResource::collection($this->whenLoaded('attachments')),
            'read_receipts' => MessageReadReceiptResource::collection($this->whenLoaded('readReceipts')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
