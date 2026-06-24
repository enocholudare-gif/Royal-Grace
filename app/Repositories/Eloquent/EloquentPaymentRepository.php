<?php

namespace App\Repositories\Eloquent;

use App\Models\Invoice;
use App\Models\Payment;
use App\Models\Refund;
use App\Models\User;
use App\Repositories\Contracts\PaymentRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class EloquentPaymentRepository implements PaymentRepositoryInterface
{
    public function paginate(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        return Payment::query()
            ->with(['booking.service', 'invoice', 'user', 'refunds'])
            ->when($filters['status'] ?? null, fn ($query, string $status) => $query->where('status', $status))
            ->when($filters['payment_type'] ?? null, fn ($query, string $type) => $query->where('payment_type', $type))
            ->when($filters['booking_id'] ?? null, fn ($query, int $bookingId) => $query->where('booking_id', $bookingId))
            ->when($filters['invoice_id'] ?? null, fn ($query, int $invoiceId) => $query->where('invoice_id', $invoiceId))
            ->when($filters['viewer'] ?? null, function ($query, User $viewer): void {
                if ($viewer->hasPermission('payments.view')) {
                    return;
                }

                if ($viewer->hasPermission('payments.view.own')) {
                    $query->where('user_id', $viewer->id);
                }
            })
            ->latest()
            ->paginate($perPage);
    }

    public function findByReference(string $reference): ?Payment
    {
        return Payment::query()->where('provider_payment_intent_id', $reference)->first();
    }

    public function createPayment(array $data): Payment
    {
        return Payment::query()->create($data)->fresh(['booking', 'invoice', 'user']);
    }

    public function updatePayment(Payment $payment, array $data): Payment
    {
        $payment->update($data);

        return $payment->fresh(['booking', 'invoice', 'user']);
    }

    public function createInvoice(array $data): Invoice
    {
        return Invoice::query()->create($data)->fresh('booking');
    }

    public function updateInvoice(Invoice $invoice, array $data): Invoice
    {
        $invoice->update($data);

        return $invoice->fresh('booking');
    }

    public function createRefund(array $data): Refund
    {
        return Refund::query()->create($data)->fresh(['payment', 'booking', 'processedBy']);
    }

    public function updateRefund(Refund $refund, array $data): Refund
    {
        $refund->update($data);

        return $refund->fresh(['payment', 'booking', 'processedBy']);
    }
}
