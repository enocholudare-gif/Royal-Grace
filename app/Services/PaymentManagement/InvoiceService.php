<?php

namespace App\Services\PaymentManagement;

use App\Models\Booking;
use App\Models\Invoice;
use App\Repositories\Contracts\PaymentRepositoryInterface;
use Illuminate\Support\Str;

class InvoiceService
{
    public function __construct(
        protected PaymentRepositoryInterface $payments
    ) {
    }

    public function generateForBooking(Booking $booking): Invoice
    {
        if ($booking->invoice) {
            return $booking->invoice;
        }

        return $this->payments->createInvoice([
            'booking_id' => $booking->id,
            'invoice_number' => $this->generateInvoiceNumber(),
            'issue_date' => now()->toDateString(),
            'due_date' => now()->addDays(7)->toDateString(),
            'subtotal_amount' => $booking->subtotal_amount,
            'tax_amount' => $booking->tax_amount,
            'total_amount' => $booking->total_amount,
            'status' => 'issued',
        ]);
    }

    public function markPaid(Invoice $invoice): Invoice
    {
        return $this->payments->updateInvoice($invoice, [
            'status' => 'paid',
            'paid_at' => now(),
        ]);
    }

    public function markRefunded(Invoice $invoice): Invoice
    {
        return $this->payments->updateInvoice($invoice, [
            'status' => 'refunded',
        ]);
    }

    protected function generateInvoiceNumber(): string
    {
        do {
            $invoiceNumber = 'INV-' . now()->format('ymd') . '-' . Str::upper(Str::random(6));
        } while (Invoice::query()->where('invoice_number', $invoiceNumber)->exists());

        return $invoiceNumber;
    }
}
