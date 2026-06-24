<?php

namespace App\Repositories\Contracts;

interface ReportRepositoryInterface
{
    public function dashboardMetrics(): array;

    public function revenueReport(array $filters = []): array;

    public function caregiverReport(array $filters = []): array;

    public function bookingReport(array $filters = []): array;

    public function clientReport(array $filters = []): array;
}
