<?php

namespace App\Http\Controllers\Calendar;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\CaregiverAvailability;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CalendarController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $start = $request->input('start');
        $end = $request->input('end');

        $events = [];

        // 1. Fetch Bookings
        $bookingsQuery = Booking::with(['client.user', 'service', 'assignedCaregiver.user']);
        
        if ($start) {
            $bookingsQuery->where('scheduled_end_at', '>=', $start);
        }
        if ($end) {
            $bookingsQuery->where('scheduled_start_at', '<=', $end);
        }

        $bookings = $bookingsQuery->get();

        foreach ($bookings as $booking) {
            $title = $booking->service ? $booking->service->name : 'Booking';
            if ($booking->client && $booking->client->user) {
                $title .= ' - ' . $booking->client->user->name;
            }

            $events[] = [
                'id' => 'booking_' . $booking->id,
                'title' => $title,
                'start' => $booking->scheduled_start_at->toIso8601String(),
                'end' => $booking->scheduled_end_at ? $booking->scheduled_end_at->toIso8601String() : null,
                'backgroundColor' => $this->getBookingColor($booking->status),
                'borderColor' => 'transparent',
                'extendedProps' => [
                    'type' => 'booking',
                    'booking_id' => $booking->id,
                    'status' => $booking->status,
                    'client_name' => $booking->client?->user?->name,
                    'caregiver_name' => $booking->assignedCaregiver?->user?->name ?? 'Unassigned',
                ],
            ];
        }

        // 2. Fetch Availabilities
        $availabilitiesQuery = CaregiverAvailability::with(['caregiver.user']);

        if ($start) {
            $availabilitiesQuery->where('end_datetime', '>=', $start);
        }
        if ($end) {
            $availabilitiesQuery->where('start_datetime', '<=', $end);
        }

        $availabilities = $availabilitiesQuery->get();

        foreach ($availabilities as $availability) {
            $caregiverName = $availability->caregiver?->user?->name ?? 'Caregiver';
            
            // Map the availability_type to a display text if needed
            $typeLabel = ucfirst($availability->availability_type ?? 'available');

            $events[] = [
                'id' => 'avail_' . $availability->id,
                'title' => $caregiverName . ' (' . $typeLabel . ')',
                'start' => $availability->start_datetime->toIso8601String(),
                'end' => $availability->end_datetime->toIso8601String(),
                'backgroundColor' => $availability->availability_type === 'unavailable' ? '#dc2626' : '#94a3b8',
                'borderColor' => 'transparent',
                'extendedProps' => [
                    'type' => 'availability',
                    'availability_id' => $availability->id,
                    'caregiver_name' => $caregiverName,
                    'availability_type' => $availability->availability_type,
                ],
            ];
        }

        return response()->json($events);
    }

    private function getBookingColor(?string $status): string
    {
        return match (strtolower($status ?? '')) {
            'pending', 'awaiting_payment' => '#f59e0b', // warning-500
            'confirmed', 'assigned' => '#0ea5e9', // info-500
            'in_progress' => '#8b5cf6', // purple-500
            'completed' => '#22c55e', // success-500
            'cancelled', 'refunded' => '#ef4444', // danger-500
            default => '#14b8a6', // brand-500
        };
    }
}
