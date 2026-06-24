<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RefundResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'payment_id' => $this->payment_id,
            'booking_id' => $this->booking_id,
            'processed_by' => $this->processed_by,
            'amount' => $this->amount,
            'reason' => $this->reason,
            'provider_refund_id' => $this->provider_refund_id,
            'status' => $this->status,
            'processed_at' => $this->processed_at,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
