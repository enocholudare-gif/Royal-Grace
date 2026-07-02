<?php

namespace App\Repositories\Eloquent;

use App\Models\Booking;
use App\Models\Caregiver;
use App\Models\Client;
use App\Models\Payment;
use App\Models\VisitReport;
use App\Repositories\Contracts\ReportRepositoryInterface;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;

class EloquentReportRepository implements ReportRepositoryInterface
{
    /**
     * Apply date range filters to a query
     */
    protected function applyDateFilters(Builder $query, array $filters, string $dateColumn = 'created_at'): Builder
    {
        if (!empty($filters['from'])) {
            $query->whereDate($dateColumn, '>=', $filters['from']);
        }

        if (!empty($filters['to'])) {
            $query->whereDate($dateColumn, '<=', $filters['to']);
        }

        // Quick timeframe preset
        if (!empty($filters['timeframe'])) {
            $now = Carbon::now();
            switch ($filters['timeframe']) {
                case 'daily':
                    $query->whereDate($dateColumn, $now->toDateString());
                    break;
                case 'weekly':
                    $query->whereBetween($dateColumn, [$now->startOfWeek()->toDateString(), $now->endOfWeek()->toDateString()]);
                    break;
                case 'monthly':
                    $query->whereMonth($dateColumn, $now->month)
                          ->whereYear($dateColumn, $now->year);
                    break;
                case 'yearly':
                    $query->whereYear($dateColumn, $now->year);
                    break;
            }
        }

        return $query;
    }

    /**
     * Get grouping format based on timeframe filter
     */
    protected function getGroupingFormat(array $filters): string
    {
        $timeframe = $filters['timeframe'] ?? 'monthly';
        return match ($timeframe) {
            'daily' => '%Y-%m-%d',
            'weekly' => '%Y-%u',
            'yearly' => '%Y',
            default => '%Y-%m',
        };
    }

    public function dashboardMetrics(array $filters = []): array
    {
        $now = Carbon::now();

        $bookingQuery = Booking::query();
        $bookingQuery = $this->applyDateFilters($bookingQuery, $filters, 'scheduled_start_at');
        
        $paymentQuery = Payment::query()->where('status', 'succeeded');
        $paymentQuery = $this->applyDateFilters($paymentQuery, $filters, 'paid_at');

        $totalBookings = (clone $bookingQuery)->count();
        $cancelledBookings = (clone $bookingQuery)->where('status', 'cancelled')->count();

        return [
            'total_clients' => Client::query()->count(),
            'active_caregivers' => Caregiver::query()->where('status', 'active')->where('is_available', true)->count(),
            'revenue' => (float) $paymentQuery->sum('amount'),
            'active_bookings' => (clone $bookingQuery)
                ->whereIn('status', ['pending', 'awaiting_payment', 'confirmed', 'assigned', 'in_progress'])
                ->count(),
            'upcoming_visits' => VisitReport::query()
                ->whereNull('arrival_time')
                ->whereHas('booking', fn ($query) => clone $bookingQuery)
                ->count(),
            'cancellation_rate' => $totalBookings > 0
                ? round(($cancelledBookings / $totalBookings) * 100, 2)
                : 0,
        ];
    }

    public function revenueReport(array $filters = []): array
    {
        $query = Payment::query()
            ->where('status', 'succeeded')
            ->with(['booking.service']);

        $query = $this->applyDateFilters($query, $filters, 'paid_at');

        if (!empty($filters['client_id'])) {
            $query->whereHas('booking', fn($q) => $q->where('client_id', $filters['client_id']));
        }

        if (!empty($filters['service_id'])) {
            $query->whereHas('booking', fn($q) => $q->where('service_id', $filters['service_id']));
        }

        $format = $this->getGroupingFormat($filters);

        return $query
            ->selectRaw("DATE_FORMAT(paid_at, '{$format}') as period, COUNT(*) as payments_count, SUM(amount) as total_revenue")
            ->groupBy(DB::raw("DATE_FORMAT(paid_at, '{$format}')"))
            ->orderBy('period')
            ->get()
            ->map(fn ($row) => [
                'period' => $row->period,
                'payments_count' => (int) $row->payments_count,
                'total_revenue' => (float) $row->total_revenue,
            ])
            ->all();
    }

    public function caregiverReport(array $filters = []): array
    {
        $query = Caregiver::query()
            ->select([
                'caregivers.id',
                'caregivers.status',
                'caregivers.average_rating',
                'caregivers.attendance_score',
                DB::raw("CONCAT(users.first_name, ' ', users.last_name) as caregiver_name"),
                DB::raw('COUNT(bookings.id) as total_assigned_bookings'),
            ])
            ->join('users', 'users.id', '=', 'caregivers.user_id')
            ->leftJoin('bookings', function($join) use ($filters) {
                $join->on('bookings.assigned_caregiver_id', '=', 'caregivers.id');
                if (!empty($filters['from'])) {
                    $join->whereDate('bookings.scheduled_start_at', '>=', $filters['from']);
                }
                if (!empty($filters['to'])) {
                    $join->whereDate('bookings.scheduled_start_at', '<=', $filters['to']);
                }
                if (!empty($filters['booking_status'])) {
                    $join->where('bookings.status', $filters['booking_status']);
                }
            })
            ->groupBy('caregivers.id', 'caregivers.status', 'caregivers.average_rating', 'caregivers.attendance_score', 'users.first_name', 'users.last_name');

        if (!empty($filters['caregiver_id'])) {
            $query->where('caregivers.id', $filters['caregiver_id']);
        }

        return $query
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
        $query = Booking::query()->selectRaw('status, COUNT(*) as total');
        
        $query = $this->applyDateFilters($query, $filters, 'scheduled_start_at');

        if (!empty($filters['service_id'])) {
            $query->where('service_id', $filters['service_id']);
        }
        if (!empty($filters['caregiver_id'])) {
            $query->where('assigned_caregiver_id', $filters['caregiver_id']);
        }
        if (!empty($filters['client_id'])) {
            $query->where('client_id', $filters['client_id']);
        }

        return $query
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
        $query = Client::query()
            ->select([
                'clients.id',
                'clients.status',
                DB::raw("CONCAT(users.first_name, ' ', users.last_name) as client_name"),
                DB::raw('COUNT(bookings.id) as total_bookings'),
                DB::raw('SUM(payments.amount) as total_spent'),
            ])
            ->join('users', 'users.id', '=', 'clients.user_id')
            ->leftJoin('bookings', function($join) use ($filters) {
                $join->on('bookings.client_id', '=', 'clients.id');
                if (!empty($filters['from'])) {
                    $join->whereDate('bookings.scheduled_start_at', '>=', $filters['from']);
                }
                if (!empty($filters['to'])) {
                    $join->whereDate('bookings.scheduled_start_at', '<=', $filters['to']);
                }
            })
            ->leftJoin('payments', function($join) {
                $join->on('payments.booking_id', '=', 'bookings.id')
                     ->where('payments.status', 'succeeded');
            })
            ->groupBy('clients.id', 'clients.status', 'users.first_name', 'users.last_name');

        if (!empty($filters['client_id'])) {
            $query->where('clients.id', $filters['client_id']);
        }

        return $query
            ->orderByDesc('total_bookings')
            ->get()
            ->map(fn ($row) => [
                'client_id' => $row->id,
                'client_name' => $row->client_name,
                'status' => $row->status,
                'total_bookings' => (int) $row->total_bookings,
                'total_spent' => (float) $row->total_spent,
            ])
            ->all();
    }
}
