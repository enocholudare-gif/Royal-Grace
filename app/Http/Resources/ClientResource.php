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
            'user_id' => $this->user_id,
            'name' => $this->whenLoaded('user', fn () => trim($this->user->first_name . ' ' . $this->user->last_name)),
            'email' => $this->whenLoaded('user', fn () => $this->user->email),
            'status' => $this->status,
        ];
    }
}
