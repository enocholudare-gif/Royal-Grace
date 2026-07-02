<?php

namespace App\Services\Reports;

use App\Repositories\Contracts\ReportRepositoryInterface;

class DashboardService
{
    public function __construct(
        protected ReportRepositoryInterface $reportRepository
    ) {}

    public function getMetrics(array $filters = []): array
    {
        return $this->reportRepository->dashboardMetrics($filters);
    }
}
