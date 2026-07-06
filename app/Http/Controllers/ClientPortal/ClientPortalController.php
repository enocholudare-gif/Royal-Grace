<?php

namespace App\Http\Controllers\ClientPortal;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Client;
use App\Models\Invoice;
use App\Models\Service;
use App\Models\SupportTicket;
use App\Models\VisitReport;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class ClientPortalController extends Controller
{
    private function getClient()
    {
        return Client::where('user_id', Auth::id())->firstOrFail();
    }

    public function dashboard()
    {
        $client = $this->getClient();

        $upcomingBooking = Booking::with('service', 'assignedCaregiver.user')
            ->where('client_id', $client->id)
            ->where('scheduled_start_at', '>', now())
            ->whereIn('status', ['confirmed', 'assigned'])
            ->orderBy('scheduled_start_at', 'asc')
            ->first();

        $unpaidInvoicesSum = Invoice::whereHas('booking', function ($query) use ($client) {
            $query->where('client_id', $client->id);
        })
            ->whereIn('status', ['issued', 'overdue'])
            ->sum('total_amount');

        $activeBookingsCount = Booking::where('client_id', $client->id)
            ->whereIn('status', ['confirmed', 'assigned', 'in_progress'])
            ->count();

        $recentInvoices = Invoice::whereHas('booking', function ($query) use ($client) {
            $query->where('client_id', $client->id);
        })
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        return Inertia::render('Dashboard/ClientDashboard', [
            'metrics' => [
                'upcomingBooking' => $upcomingBooking,
                'unpaidInvoicesSum' => $unpaidInvoicesSum,
                'activeBookingsCount' => $activeBookingsCount,
                'recentInvoices' => $recentInvoices,
            ]
        ]);
    }

    public function bookings()
    {
        $client = $this->getClient();
        $bookings = Booking::with('service', 'assignedCaregiver.user')
            ->where('client_id', $client->id)
            ->orderBy('scheduled_start_at', 'desc')
            ->get();

        return Inertia::render('Client/Bookings/Index', [
            'bookings' => $bookings
        ]);
    }

    public function services()
    {
        $services = Service::where('status', 'active')->get();
        return Inertia::render('Client/Services/Index', [
            'services' => $services
        ]);
    }

    public function storeServiceRequest(Request $request)
    {
        $request->validate([
            'service_id' => 'required|exists:services,id',
            'notes' => 'nullable|string',
        ]);

        $service = Service::findOrFail($request->service_id);
        
        SupportTicket::create([
            'ticket_number' => 'REQ-' . strtoupper(uniqid()),
            'user_id' => Auth::id(),
            'subject' => 'Service Request: ' . $service->name,
            'description' => $request->notes ?? 'I am interested in adding this service to my care plan.',
            'priority' => 'medium',
            'status' => 'open'
        ]);

        return back()->with('success', 'Your service request has been submitted successfully. A member of our team will contact you shortly.');
    }

    public function invoices()
    {
        $client = $this->getClient();
        $invoices = Invoice::with('booking.service')
            ->whereHas('booking', function ($query) use ($client) {
                $query->where('client_id', $client->id);
            })
            ->orderBy('due_date', 'desc')
            ->get();

        return Inertia::render('Client/Invoices/Index', [
            'invoices' => $invoices
        ]);
    }

    public function reports()
    {
        $client = $this->getClient();
        
        $bookings = Booking::where('client_id', $client->id)->pluck('id');
        
        $reports = VisitReport::with('booking.service', 'caregiver.user')
            ->whereIn('booking_id', $bookings)
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Client/Reports/Index', [
            'reports' => $reports
        ]);
    }

    public function submitBankTransfer(Request $request, Invoice $invoice)
    {
        $client = $this->getClient();

        abort_unless(
            $invoice->booking && $invoice->booking->client_id === $client->id,
            403
        );

        abort_unless(
            in_array($invoice->status, ['pending', 'issued', 'overdue']),
            422,
            'This invoice cannot be marked as transferred.'
        );

        $invoice->update([
            'status' => 'pending_verification',
            'payment_method' => 'bank_transfer',
            'bank_transfer_note' => $request->input('note'),
            'payment_submitted_at' => now(),
        ]);

        return back()->with('success', 'Transfer submitted! Your payment is pending verification by the admin.');
    }
}

