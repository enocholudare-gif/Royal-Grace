<?php

namespace App\Http\Controllers\PaymentManagement;

use App\Http\Controllers\Controller;
use App\Http\Requests\PaymentManagement\GenerateInvoiceRequest;
use App\Http\Requests\PaymentManagement\InitializeBookingPaymentRequest;
use App\Http\Requests\PaymentManagement\InitializeInvoicePaymentRequest;
use App\Http\Requests\PaymentManagement\ListPaymentsRequest;
use App\Http\Requests\PaymentManagement\ProcessRefundRequest;
use App\Http\Requests\PaymentManagement\VerifyPaymentRequest;
use App\Http\Resources\InvoiceResource;
use App\Http\Resources\PaymentResource;
use App\Http\Resources\RefundResource;
use App\Models\Booking;
use App\Models\Invoice;
use App\Models\Payment;
use App\Services\PaymentManagement\InvoiceService;
use App\Services\PaymentManagement\PaymentService;
use App\Services\PaymentManagement\RefundService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Gate;

class PaymentController extends Controller
{
    public function index(ListPaymentsRequest $request, PaymentService $payments): AnonymousResourceCollection
    {
        $validated = $request->validated();

        return PaymentResource::collection(
            $payments->history($request->user(), $validated, (int) ($validated['per_page'] ?? 15))
        );
    }

    public function show(Payment $payment): PaymentResource
    {
        Gate::authorize('view', $payment);

        return new PaymentResource($payment->load(['booking', 'invoice', 'refunds']));
    }

    public function initializeBookingPayment(InitializeBookingPaymentRequest $request, Booking $booking, PaymentService $payments): JsonResponse
    {
        return (new PaymentResource(
            $payments->initializeOneTimePayment($request->user(), $booking)
        ))->response()->setStatusCode(201);
    }

    public function initializeInvoicePayment(InitializeInvoicePaymentRequest $request, Invoice $invoice, PaymentService $payments): JsonResponse
    {
        return (new PaymentResource(
            $payments->initializeInvoicePayment($request->user(), $invoice)
        ))->response()->setStatusCode(201);
    }

    public function verify(VerifyPaymentRequest $request, PaymentService $payments): PaymentResource
    {
        return new PaymentResource(
            $payments->verifyAndConfirm($request->validated('reference'))
        );
    }

    public function generateInvoice(GenerateInvoiceRequest $request, Booking $booking, InvoiceService $invoices): JsonResponse
    {
        return (new InvoiceResource($invoices->generateForBooking($booking)))
            ->response()
            ->setStatusCode(201);
    }

    public function refund(ProcessRefundRequest $request, Payment $payment, RefundService $refunds): JsonResponse
    {
        return (new RefundResource($refunds->process($request->user(), $payment, $request->validated())))
            ->response()
            ->setStatusCode(201);
    }
}
