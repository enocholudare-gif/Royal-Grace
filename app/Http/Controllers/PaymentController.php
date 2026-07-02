<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class PaymentController extends Controller
{
    public function pricing(Request $request)
    {
        return Inertia::render('Pricing', [
            'stripeKey' => env('VITE_STRIPE_KEY'),
        ]);
    }

    public function checkout(Request $request)
    {
        $request->validate([
            'plan' => 'required|string',
        ]);

        $user = $request->user();

        // Ensure user is billable, create customer if not exists
        if (!$user->hasStripeId()) {
            $user->createAsStripeCustomer();
        }

        // Define a simple pricing structure
        $prices = [
            'basic' => 1000,   // $10.00
            'pro'   => 5000,   // $50.00
        ];

        $amount = $prices[$request->plan] ?? 1000;

        // Using Cashier's simple checkout for a one-off charge.
        // For subscriptions, you'd use $user->newSubscription('default', 'price_id')->checkout(...)
        return $user->checkoutCharge($amount, 'Payment for ' . ucfirst($request->plan) . ' Plan', 1, [
            'success_url' => route('payment.success'),
            'cancel_url' => route('payment.cancel'),
        ]);
    }

    public function success(Request $request)
    {
        return Inertia::render('CheckoutSuccess');
    }

    public function cancel(Request $request)
    {
        return Inertia::render('CheckoutCancel');
    }
}
