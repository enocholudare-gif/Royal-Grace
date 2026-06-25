<?php

namespace App\Http\Controllers\Caregiver;

use App\Http\Controllers\Controller;
use App\Http\Requests\VisitManagement\CheckInRequest;
use App\Http\Requests\VisitManagement\CheckOutRequest;
use App\Models\Booking;
use App\Models\VisitReport;
use App\Services\VisitManagement\VisitService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CaregiverVisitController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        $caregiver = $user->caregiver;

        $tab = $request->get('tab', 'upcoming');
        $search = $request->get('search', '');
        $dateFilter = $request->get('date', '');
        $statusFilter = $request->get('status', '');
        $page = (int) $request->get('page', 1);

        $query = Booking::query()
            ->with(['client.user', 'service', 'assignedCaregiver.user', 'visitReport'])
            ->where('assigned_caregiver_id', $caregiver?->id);

        if ($search) {
            $query->whereHas('client.user', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%");
            })->orWhere('service_name_snapshot', 'like', "%{$search}%");
        }

        if ($dateFilter) {
            $query->whereDate('scheduled_start_at', $dateFilter);
        }

        if ($tab === 'upcoming') {
            $query->whereIn('status', ['confirmed', 'scheduled', 'in_progress']);
            if ($statusFilter) {
                $query->where('status', $statusFilter);
            }
        } elseif ($tab === 'completed') {
            $query->whereIn('status', ['completed'])
                ->orWhereHas('visitReport', function ($q) {
                    $q->whereIn('status', ['submitted', 'reviewed']);
                });
        }

        $bookings = $query->orderBy('scheduled_start_at')->paginate(10, ['*'], 'page', $page);

        return Inertia::render('Caregiver/Visits/Index', [
            'bookings' => $bookings,
            'filters' => compact('tab', 'search', 'dateFilter', 'statusFilter'),
        ]);
    }

    public function show(Booking $booking): Response
    {
        $booking->load(['client.user', 'service', 'assignedCaregiver.user', 'visitReport']);

        return Inertia::render('Caregiver/Visits/Show', [
            'booking' => $booking,
        ]);
    }

    public function checkInForm(Booking $booking): Response
    {
        $booking->load(['client.user', 'service']);

        return Inertia::render('Caregiver/Visits/CheckIn', [
            'booking' => $booking,
        ]);
    }

    public function storeCheckIn(CheckInRequest $request, Booking $booking, VisitService $visits)
    {
        $visitReport = $visits->checkIn($request->user(), $booking, $request->validated(), $request);

        return redirect()->route('caregiver.visits.active', $booking->id)
            ->with('success', 'Check-in successful! Your visit is now active.');
    }

    public function active(Booking $booking): Response
    {
        $booking->load(['client.user', 'service', 'visitReport']);

        if (!$booking->visitReport || !$booking->visitReport->arrival_time) {
            return redirect()->route('caregiver.visits.show', $booking->id);
        }

        return Inertia::render('Caregiver/Visits/Active', [
            'booking' => $booking,
            'visitReport' => $booking->visitReport,
        ]);
    }

    public function checkOutForm(Booking $booking): Response
    {
        $booking->load(['client.user', 'service', 'visitReport']);

        return Inertia::render('Caregiver/Visits/CheckOut', [
            'booking' => $booking,
            'visitReport' => $booking->visitReport,
        ]);
    }

    public function storeCheckOut(CheckOutRequest $request, Booking $booking, VisitService $visits)
    {
        $visitReport = $visits->checkOut($request->user(), $booking, $request->validated(), $request);

        return redirect()->route('caregiver.visits.report', $visitReport->id)
            ->with('success', 'Check-out successful! Please submit your visit report.');
    }

    public function reportForm(VisitReport $visitReport): Response
    {
        $visitReport->load(['booking.client.user', 'booking.service']);

        return Inertia::render('Caregiver/Visits/Report', [
            'visitReport' => $visitReport,
            'flash' => session('success'),
        ]);
    }

    public function storeReport(Request $request, VisitReport $visitReport, VisitService $visits)
    {
        $validated = $request->validate([
            'services_performed' => ['required', 'string', 'max:5000'],
            'observations' => ['nullable', 'string', 'max:5000'],
            'client_condition' => ['required', 'string', 'max:2000'],
            'notes' => ['nullable', 'string', 'max:5000'],
        ]);

        $visits->submitReport($request->user(), $visitReport, $validated, $request);

        return redirect()->route('caregiver.visits.index', ['tab' => 'completed'])
            ->with('success', 'Visit report submitted successfully!');
    }
}
