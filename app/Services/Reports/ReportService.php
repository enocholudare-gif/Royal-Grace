<?php

namespace App\Services\Reports;

use App\Jobs\Reports\ExportReportJob;
use App\Repositories\Contracts\ReportRepositoryInterface;
use Illuminate\Support\Str;

class ReportService
{
    public function __construct(
        protected ReportRepositoryInterface $reports
    ) {
    }

    public function dashboard(): array
    {
        return $this->reports->dashboardMetrics();
    }

    public function revenueReport(array $filters = []): array
    {
        return $this->reports->revenueReport($filters);
    }

    public function caregiverReport(array $filters = []): array
    {
        return $this->reports->caregiverReport($filters);
    }

    public function bookingReport(array $filters = []): array
    {
        return $this->reports->bookingReport($filters);
    }

    public function clientReport(array $filters = []): array
    {
        return $this->reports->clientReport($filters);
    }

    public function queueExport(string $reportType, string $format, array $filters = []): string
    {
        $exportId = (string) Str::uuid();

        ExportReportJob::dispatch($reportType, $format, $filters, $exportId);

        return $exportId;
    }
}
