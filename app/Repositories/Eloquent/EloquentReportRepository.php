<?php

namespace App\Repositories\Eloquent;

use App\Models\Booking;
use App\Models\Caregiver;
use App\Models\Client;
use App\Models\Payment;
use App\Models\VisitReport;
use App\Repositories\Contracts\ReportRepositoryInterface;
use Illuminate\Support\Facades\DB;

class EloquentReportRepository implements ReportRepositoryInterface
{
    public function dashboardMetrics(): array
    {
        $now = now();
        $monthStart = $now->copy()->startOfMonth();
        $monthEnd = $now->copy()->endOfMonth();

        $totalBookings = Booking::query()->count();
        $cancelledBookings = Booking::query()
            ->where('status', 'cancelled')
            ->count();

        return [
            'total_clients' => Client::query()->count(),
            'active_caregivers' => Caregiver::query()->where('status', 'active')->where('is_available', true)->count(),
            'monthly_revenue' => (float) Payment::query()
                ->where('status', 'succeeded')
                ->whereBetween('paid_at', [$monthStart, $monthEnd])
                ->sum('amount'),
            'active_bookings' => Booking::query()
                ->whereIn('status', ['pending', 'awaiting_payment', 'confirmed', 'assigned', 'in_progress'])
                ->count(),
            'upcoming_visits' => VisitReport::query()
                ->whereNull('arrival_time')
                ->whereHas('booking', fn ($query) => $query->where('scheduled_start_at', '>=', $now))
                ->count(),
            'cancellation_rate' => $totalBookings > 0
                ? round(($cancelledBookings / $totalBookings) * 100, 2)
                : 0,
        ];
    }

    public function revenueReport(array $filters = []): array
    {
        return Payment::query()
            ->selectRaw('DATE(paid_at) as report_date, COUNT(*) as payments_count, SUM(amount) as total_revenue')
            ->where('status', 'succeeded')
            ->when($filters['from'] ?? null, fn ($query, string $from) => $query->whereDate('paid_at', '>=', $from))
            ->when($filters['to'] ?? null, fn ($query, string $to) => $query->whereDate('paid_at', '<=', $to))
            ->groupBy(DB::raw('DATE(paid_at)'))
            ->orderBy('report_date')
            ->get()
            ->map(fn ($row) => [
                'report_date' => $row->report_date,
                'payments_count' => (int) $row->payments_count,
                'total_revenue' => (float) $row->total_revenue,
            ])
            ->all();
    }

    public function caregiverReport(array $filters = []): array
    {
        return Caregiver::query()
            ->select([
                'caregivers.id',
                'caregivers.status',
                'caregivers.average_rating',
                'caregivers.attendance_score',
                DB::raw("CONCAT(users.first_name, ' ', users.last_name) as caregiver_name"),
                DB::raw('COUNT(bookings.id) as total_assigned_bookings'),
            ])
            ->join('users', 'users.id', '=', 'caregivers.user_id')
            ->leftJoin('bookings', 'bookings.assigned_caregiver_id', '=', 'caregivers.id')
            ->groupBy('caregivers.id', 'caregivers.status', 'caregivers.average_rating', 'caregivers.attendance_score', 'users.first_name', 'users.last_name')
            ->orderByDesc('total_assigned_bookings')
            ->get()
            ->map(fn ($row) => [
                'caregiver_id' => $row->id,
                'caregiver_name' => $row->caregiver_name,
                'status' => $row->status,
                'average_rating' => (float) $row->average_rating,
                'attendance_score' => (float) $row->attendance_score,
                'total_assigned_bookings' => (int) $row->total_assigned_bookings,
            ])
            ->all();
    }

    public function bookingReport(array $filters = []): array
    {
        return Booking::query()
            ->selectRaw('status, COUNT(*) as total')
            ->when($filters['from'] ?? null, fn ($query, string $from) => $query->whereDate('scheduled_start_at', '>=', $from))
            ->when($filters['to'] ?? null, fn ($query, string $to) => $query->whereDate('scheduled_start_at', '<=', $to))
            ->groupBy('status')
            ->orderBy('status')
            ->get()
            ->map(fn ($row) => [
                'status' => $row->status,
                'total' => (int) $row->total,
            ])
            ->all();
    }

    public function clientReport(array $filters = []): array
    {
        return Client::query()
            ->select([
                'clients.id',
                'clients.status',
                DB::raw("CONCAT(users.first_name, ' ', users.last_name) as client_name"),
                DB::raw('COUNT(bookings.id) as total_bookings'),
            ])
            ->join('users', 'users.id', '=', 'clients.user_id')
            ->leftJoin('bookings', 'bookings.client_id', '=', 'clients.id')
            ->groupBy('clients.id', 'clients.status', 'users.first_name', 'users.last_name')
            ->orderByDesc('total_bookings')
            ->get()
            ->map(fn ($row) => [
                'client_id' => $row->id,
                'client_name' => $row->client_name,
                'status' => $row->status,
                'total_bookings' => (int) $row->total_bookings,
            ])
            ->all();
    }
}
