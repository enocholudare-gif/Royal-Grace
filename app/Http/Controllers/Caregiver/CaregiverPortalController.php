<?php

namespace App\Http\Controllers\Caregiver;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class CaregiverPortalController extends Controller
{
    private function getCaregiver()
    {
        return Auth::user()->caregiver;
    }

    public function schedule(Request $request)
    {
        $caregiver = $this->getCaregiver();
        
        $bookings = Booking::with('client.user', 'service')
            ->where('assigned_caregiver_id', $caregiver->id)
            ->where('scheduled_start_at', '>=', now()->startOfDay())
            ->orderBy('scheduled_start_at', 'asc')
            ->get();

        return Inertia::render('Caregiver/Schedule/Index', [
            'bookings' => $bookings
        ]);
    }

    public function attendance(Request $request)
    {
        $caregiver = $this->getCaregiver();
        
        $completedBookings = Booking::with('client.user', 'service', 'visitReport')
            ->where('assigned_caregiver_id', $caregiver->id)
            ->where('status', 'completed')
            ->orderBy('scheduled_start_at', 'desc')
            ->get();

        return Inertia::render('Caregiver/Attendance/Index', [
            'bookings' => $completedBookings
        ]);
    }
}
