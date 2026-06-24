<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PaymentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'booking_id' => $this->booking_id,
            'invoice_id' => $this->invoice_id,
            'user_id' => $this->user_id,
            'provider' => $this->provider,
            'reference' => $this->provider_payment_intent_id,
            'provider_charge_id' => $this->provider_charge_id,
            'amount' => $this->amount,
            'currency' => $this->currency,
            'status' => $this->status,
            'payment_type' => $this->payment_type,
            'failure_reason' => $this->failure_reason,
            'paid_at' => $this->paid_at,
            'authorization_url' => $this->metadata['authorization_url'] ?? null,
            'access_code' => $this->metadata['access_code'] ?? null,
            'metadata' => $this->metadata,
            'booking' => new BookingResource($this->whenLoaded('booking')),
            'invoice' => new InvoiceResource($this->whenLoaded('invoice')),
            'refunds' => RefundResource::collection($this->whenLoaded('refunds')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
