<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Payment;
use App\Services\BookingManagement\BookingManagementService;
use App\Services\Payment\StripePaymentService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class PaymentController extends Controller
{
    public function __construct(
        protected StripePaymentService $stripeService,
        protected BookingManagementService $bookingService
    ) {}

    public function intent(Request $request): JsonResponse
    {
        $request->validate([
            'booking_id' => 'required|exists:bookings,id',
        ]);

        $booking = Booking::findOrFail($request->booking_id);

        if ($booking->client->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        if ($booking->status !== 'awaiting_payment') {
            return response()->json(['message' => 'Booking does not require payment.'], 400);
        }

        $intent = $this->stripeService->createPaymentIntent(
            (float) $booking->total_amount,
            'usd',
            ['booking_id' => $booking->id]
        );

        return response()->json([
            'clientSecret' => $intent->client_secret,
        ]);
    }

    public function confirm(Request $request): JsonResponse
    {
        $request->validate([
            'payment_intent_id' => 'required|string',
            'booking_id' => 'required|exists:bookings,id',
        ]);

        $intent = $this->stripeService->retrievePaymentIntent($request->payment_intent_id);
        $booking = Booking::findOrFail($request->booking_id);

        if ($intent->status === 'succeeded') {
            // Update booking status
            $this->bookingService->updateStatus($booking, 'confirmed');

            // Create Payment record
            Payment::create([
                'booking_id' => $booking->id,
                'user_id' => $request->user()->id,
                'provider' => 'stripe',
                'provider_payment_intent_id' => $intent->id,
                'amount' => $booking->total_amount,
                'currency' => 'usd',
                'status' => 'succeeded',
                'payment_type' => 'card',
                'paid_at' => now(),
            ]);

            return response()->json(['success' => true]);
        }

        return response()->json(['success' => false, 'status' => $intent->status]);
    }
}
