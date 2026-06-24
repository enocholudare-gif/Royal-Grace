<?php

namespace App\Http\Controllers\PaymentManagement;

use App\Http\Controllers\Controller;
use App\Services\PaymentManagement\PaymentService;
use App\Services\PaymentManagement\PaystackService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PaystackWebhookController extends Controller
{
    public function __invoke(Request $request, PaystackService $paystack, PaymentService $payments): JsonResponse
    {
        $payload = $request->getContent();
        $signature = $request->header('x-paystack-signature');

        if (! $paystack->isValidWebhookSignature($payload, $signature)) {
            return response()->json(['message' => 'Invalid webhook signature.'], 401);
        }

        $payments->handleWebhook($request->all());

        return response()->json(['message' => 'Webhook accepted.']);
    }
}
