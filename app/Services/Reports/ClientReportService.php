<?php

namespace App\Services\Reports;

use App\Repositories\Contracts\ReportRepositoryInterface;

class ClientReportService
{
    public function __construct(
        protected ReportRepositoryInterface $reportRepository
    ) {}

    public function getReport(array $filters = []): array
    {
        return $this->reportRepository->clientReport($filters);
    }
}
