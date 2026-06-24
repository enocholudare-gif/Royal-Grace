<?php

namespace App\Repositories\Contracts;

use App\Models\Invoice;
use App\Models\Payment;
use App\Models\Refund;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface PaymentRepositoryInterface
{
    public function paginate(array $filters = [], int $perPage = 15): LengthAwarePaginator;

    public function findByReference(string $reference): ?Payment;

    public function createPayment(array $data): Payment;

    public function updatePayment(Payment $payment, array $data): Payment;

    public function createInvoice(array $data): Invoice;

    public function updateInvoice(Invoice $invoice, array $data): Invoice;

    public function createRefund(array $data): Refund;

    public function updateRefund(Refund $refund, array $data): Refund;
}
