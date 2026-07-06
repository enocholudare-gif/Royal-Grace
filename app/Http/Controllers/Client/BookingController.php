<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Invoice;
use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class BookingController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'service_id'         => 'required|exists:services,id',
            'scheduled_start_at' => 'required|date|after:now',
            'care_instructions'  => 'nullable|string|max:1000',
        ]);

        $user    = auth()->user();
        $client  = $user->client;

        if (!$client) {
            return back()->withErrors(['error' => 'Client profile not found. Please contact support.']);
        }

        $service = Service::findOrFail($request->service_id);

        // Calculate duration and end time
        $start = \Carbon\Carbon::parse($request->scheduled_start_at);
        $end   = $start->copy()->addMinutes($service->duration_minutes ?? 60);

        // Create the booking
        $booking = Booking::create([
            'booking_number'           => 'BK-' . strtoupper(Str::random(8)),
            'client_id'                => $client->id,
            'service_id'               => $service->id,
            'scheduled_start_at'       => $start,
            'scheduled_end_at'         => $end,
            'care_instructions'        => $request->care_instructions,
            'service_name_snapshot'    => $service->name,
            'service_price_snapshot'   => $service->price,
            'service_duration_snapshot'=> $service->duration_minutes,
            'status'                   => 'pending',
            'booking_source'           => 'client_portal',
            'subtotal_amount'          => $service->price,
            'discount_amount'          => 0,
            'tax_amount'               => 0,
            'total_amount'             => $service->price,
        ]);

        // Auto-generate an invoice for this booking
        $invoice = Invoice::create([
            'booking_id'       => $booking->id,
            'invoice_number'   => 'INV-' . strtoupper(Str::random(10)),
            'issue_date'       => now(),
            'due_date'         => now()->addDays(7),
            'subtotal_amount'  => $service->price,
            'tax_amount'       => 0,
            'total_amount'     => $service->price,
            'status'           => 'draft',
        ]);

        // Redirect straight to the payment page
        return redirect("/client/invoices/{$invoice->id}/pay")
            ->with('success', 'Booking created! Please complete your payment below.');
    }
}
