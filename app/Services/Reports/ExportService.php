<?php

namespace App\Services\Reports;

use Maatwebsite\Excel\Facades\Excel;
use App\Exports\ReportsExport;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Str;

class ExportService
{
    public function __construct(
        protected DashboardService $dashboardService,
        protected RevenueReportService $revenueService,
        protected BookingReportService $bookingService,
        protected CaregiverReportService $caregiverService,
        protected ClientReportService $clientService
    ) {}

    public function export(string $type, string $format, array $filters = [])
    {
        $data = $this->getReportData($type, $filters);
        
        $filename = "{$type}_report_" . now()->format('Ymd_His');

        if ($format === 'excel') {
            return Excel::download(new ReportsExport($data), "{$filename}.xlsx");
        }

        if ($format === 'pdf') {
            $pdf = Pdf::loadView('reports.pdf', ['data' => $data, 'type' => $type, 'filters' => $filters]);
            return $pdf->download("{$filename}.pdf");
        }

        abort(400, 'Unsupported export format.');
    }

    protected function getReportData(string $type, array $filters): array
    {
        return match ($type) {
            'dashboard' => $this->dashboardService->getMetrics($filters),
            'revenue' => $this->revenueService->getReport($filters),
            'bookings' => $this->bookingService->getReport($filters),
            'caregivers' => $this->caregiverService->getReport($filters),
            'clients' => $this->clientService->getReport($filters),
            default => [],
        };
    }
}
