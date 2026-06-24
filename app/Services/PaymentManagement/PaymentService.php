<?php

namespace App\Services\PaymentManagement;

use App\Events\PaymentManagement\PaymentSucceeded;
use App\Models\Booking;
use App\Models\Invoice;
use App\Models\Payment;
use App\Models\User;
use App\Notifications\PaymentManagement\PaymentReceiptNotification;
use App\Repositories\Contracts\PaymentRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use RuntimeException;

class PaymentService
{
    public function __construct(
        protected PaymentRepositoryInterface $payments,
        protected PaystackService $paystack,
        protected InvoiceService $invoices
    ) {
    }

    public function history(User $viewer, array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $filters['viewer'] = $viewer;

        return $this->payments->paginate($filters, $perPage);
    }

    public function initializeOneTimePayment(User $payer, Booking $booking): Payment
    {
        return $this->initialize($payer, $booking, null, 'one_time');
    }

    public function initializeInvoicePayment(User $payer, Invoice $invoice): Payment
    {
        return $this->initialize($payer, $invoice->booking, $invoice, 'invoice');
    }

    public function verifyAndConfirm(string $reference): Payment
    {
        $payment = $this->payments->findByReference($reference);

        if (! $payment) {
            throw new RuntimeException('Payment reference not found.');
        }

        if ($payment->status === 'succeeded') {
            return $payment;
        }

        $response = $this->paystack->verifyTransaction($reference);

        return $this->applyPaystackTransaction($payment, $response['data'] ?? []);
    }

    public function handleWebhook(array $payload): ?Payment
    {
        $event = $payload['event'] ?? null;
        $data = $payload['data'] ?? [];
        $reference = $data['reference'] ?? null;

        if (! $reference) {
            return null;
        }

        $payment = $this->payments->findByReference($reference);

        if (! $payment) {
            return null;
        }

        if ($event === 'charge.success') {
            return $this->applyPaystackTransaction($payment, $data);
        }

        if (in_array($event, ['charge.failed', 'transaction.failed'], true)) {
            return $this->markFailed($payment, $data['gateway_response'] ?? 'Payment failed.');
        }

        return $payment;
    }

    protected function initialize(User $payer, Booking $booking, ?Invoice $invoice, string $paymentType): Payment
    {
        $amount = $invoice?->total_amount ?? $booking->total_amount;
        $reference = $this->generateReference();

        $payment = DB::transaction(fn () => $this->payments->createPayment([
            'booking_id' => $booking->id,
            'invoice_id' => $invoice?->id,
            'user_id' => $payer->id,
            'provider' => 'paystack',
            'provider_payment_intent_id' => $reference,
            'amount' => $amount,
            'currency' => 'NGN',
            'status' => 'pending',
            'payment_type' => $paymentType,
            'metadata' => [
                'booking_number' => $booking->booking_number,
                'invoice_number' => $invoice?->invoice_number,
            ],
        ]));

        try {
            $response = $this->paystack->initializeTransaction([
                'email' => $payer->email,
                'amount' => $this->toKobo($amount),
                'currency' => 'NGN',
                'reference' => $reference,
                'callback_url' => config('services.paystack.callback_url'),
                'metadata' => [
                    'payment_id' => $payment->id,
                    'booking_id' => $booking->id,
                    'invoice_id' => $invoice?->id,
                    'payment_type' => $paymentType,
                ],
            ]);
        } catch (RuntimeException $exception) {
            $this->payments->updatePayment($payment, [
                'status' => 'failed',
                'failure_reason' => $exception->getMessage(),
            ]);

            throw $exception;
        }

        return DB::transaction(fn () => $this->payments->updatePayment($payment, [
            'status' => 'processing',
            'metadata' => array_merge($payment->metadata ?? [], [
                'authorization_url' => $response['data']['authorization_url'] ?? null,
                'access_code' => $response['data']['access_code'] ?? null,
            ]),
        ]));
    }

    protected function applyPaystackTransaction(Payment $payment, array $transaction): Payment
    {
        if ($payment->status === 'succeeded') {
            return $payment;
        }

        if (($transaction['status'] ?? null) !== 'success') {
            return $this->markFailed($payment, $transaction['gateway_response'] ?? 'Payment was not successful.');
        }

        return DB::transaction(function () use ($payment, $transaction): Payment {
            $payment = $this->payments->updatePayment($payment, [
                'status' => 'succeeded',
                'provider_charge_id' => isset($transaction['id']) ? (string) $transaction['id'] : $payment->provider_charge_id,
                'failure_reason' => null,
                'paid_at' => now(),
                'metadata' => array_merge($payment->metadata ?? [], [
                    'paystack_status' => $transaction['status'] ?? null,
                    'gateway_response' => $transaction['gateway_response'] ?? null,
                    'channel' => $transaction['channel'] ?? null,
                ]),
            ]);

            if ($payment->invoice) {
                $this->invoices->markPaid($payment->invoice);
            }

            if ($payment->booking) {
                $payment->booking->update([
                    'status' => 'confirmed',
                    'confirmed_at' => now(),
                ]);
            }

            $payment->user->notify(new PaymentReceiptNotification($payment));
            PaymentSucceeded::dispatch($payment);

            return $payment->fresh(['booking', 'invoice', 'user']);
        });
    }

    protected function markFailed(Payment $payment, string $reason): Payment
    {
        return DB::transaction(fn () => $this->payments->updatePayment($payment, [
            'status' => 'failed',
            'failure_reason' => $reason,
        ]));
    }

    protected function generateReference(): string
    {
        do {
            $reference = 'RG-PAY-' . now()->format('ymd') . '-' . Str::upper(Str::random(8));
        } while (Payment::query()->where('provider_payment_intent_id', $reference)->exists());

        return $reference;
    }

    protected function toKobo(float|string $amount): int
    {
        return (int) round(((float) $amount) * 100);
    }
}
