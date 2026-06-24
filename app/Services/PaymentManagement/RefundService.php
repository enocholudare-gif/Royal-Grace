<?php

namespace App\Services\PaymentManagement;

use App\Models\Payment;
use App\Models\Refund;
use App\Models\User;
use App\Repositories\Contracts\PaymentRepositoryInterface;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class RefundService
{
    public function __construct(
        protected PaymentRepositoryInterface $payments,
        protected PaystackService $paystack,
        protected InvoiceService $invoices
    ) {
    }

    public function process(User $processor, Payment $payment, array $data): Refund
    {
        if ($payment->status !== 'succeeded') {
            throw new RuntimeException('Only successful payments can be refunded.');
        }

        $amount = (float) ($data['amount'] ?? $payment->amount);

        if ($amount <= 0 || $amount > (float) $payment->amount) {
            throw new RuntimeException('Refund amount is invalid.');
        }

        $refund = DB::transaction(fn () => $this->payments->createRefund([
            'payment_id' => $payment->id,
            'booking_id' => $payment->booking_id,
            'processed_by' => $processor->id,
            'amount' => $amount,
            'reason' => $data['reason'] ?? null,
            'status' => 'processing',
        ]));

        try {
            $response = $this->paystack->createRefund([
                'transaction' => $payment->provider_charge_id ?: $payment->provider_payment_intent_id,
                'amount' => (int) round($amount * 100),
                'customer_note' => $data['reason'] ?? null,
                'merchant_note' => "Royal Grace refund for payment {$payment->id}",
            ]);
        } catch (RuntimeException $exception) {
            return $this->payments->updateRefund($refund, [
                'status' => 'failed',
            ]);
        }

        return DB::transaction(function () use ($refund, $payment, $response): Refund {
            $refund = $this->payments->updateRefund($refund, [
                'provider_refund_id' => isset($response['data']['id']) ? (string) $response['data']['id'] : null,
                'status' => 'succeeded',
                'processed_at' => now(),
            ]);

            $this->payments->updatePayment($payment, ['status' => 'refunded']);

            if ($payment->booking) {
                $payment->booking->update(['status' => 'refunded']);
            }

            if ($payment->invoice) {
                $this->invoices->markRefunded($payment->invoice);
            }

            return $refund;
        });
    }
}
