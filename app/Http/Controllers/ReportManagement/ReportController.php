<?php

namespace App\Http\Controllers\ReportManagement;

use App\Http\Controllers\Controller;
use App\Http\Requests\ReportManagement\ReportFilterRequest;
use App\Http\Requests\ReportManagement\ExportReportRequest;
use App\Services\Reports\DashboardService;
use App\Services\Reports\RevenueReportService;
use App\Services\Reports\BookingReportService;
use App\Services\Reports\CaregiverReportService;
use App\Services\Reports\ClientReportService;
use App\Services\Reports\ExportService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Gate;

class ReportController extends Controller
{
    public function __construct(
        protected DashboardService $dashboardService,
        protected RevenueReportService $revenueService,
        protected BookingReportService $bookingService,
        protected CaregiverReportService $caregiverService,
        protected ClientReportService $clientService,
        protected ExportService $exportService
    ) {}

    public function dashboard(ReportFilterRequest $request): JsonResponse
    {
        Gate::authorize('viewReports', \App\Models\User::class);

        return response()->json([
            'data' => $this->dashboardService->getMetrics($request->validated()),
        ]);
    }

    public function revenue(ReportFilterRequest $request): JsonResponse
    {
        Gate::authorize('viewReports', \App\Models\User::class);

        return response()->json([
            'data' => $this->revenueService->getReport($request->validated()),
        ]);
    }

    public function bookings(ReportFilterRequest $request): JsonResponse
    {
        Gate::authorize('viewReports', \App\Models\User::class);

        return response()->json([
            'data' => $this->bookingService->getReport($request->validated()),
        ]);
    }

    public function caregivers(ReportFilterRequest $request): JsonResponse
    {
        Gate::authorize('viewReports', \App\Models\User::class);

        return response()->json([
            'data' => $this->caregiverService->getReport($request->validated()),
        ]);
    }

    public function clients(ReportFilterRequest $request): JsonResponse
    {
        Gate::authorize('viewReports', \App\Models\User::class);

        return response()->json([
            'data' => $this->clientService->getReport($request->validated()),
        ]);
    }

    public function exportPdf(ExportReportRequest $request)
    {
        Gate::authorize('viewReports', \App\Models\User::class);

        $filters = $request->except('type');
        return $this->exportService->export($request->input('type'), 'pdf', $filters);
    }

    public function exportExcel(ExportReportRequest $request)
    {
        Gate::authorize('viewReports', \App\Models\User::class);

        $filters = $request->except('type');
        return $this->exportService->export($request->input('type'), 'excel', $filters);
    }
}
