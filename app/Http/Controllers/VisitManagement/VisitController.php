<?php

namespace App\Http\Controllers\VisitManagement;

use App\Http\Controllers\Controller;
use App\Http\Requests\VisitManagement\CheckInRequest;
use App\Http\Requests\VisitManagement\CheckOutRequest;
use App\Http\Requests\VisitManagement\ListVisitsRequest;
use App\Http\Requests\VisitManagement\SubmitVisitReportRequest;
use App\Http\Resources\VisitReportResource;
use App\Models\Booking;
use App\Models\VisitReport;
use App\Services\VisitManagement\VisitService;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Gate;

class VisitController extends Controller
{
    public function index(ListVisitsRequest $request, VisitService $visits): AnonymousResourceCollection
    {
        $validated = $request->validated();

        return VisitReportResource::collection(
            $visits->list($request->user(), $validated, (int) ($validated['per_page'] ?? 15))
        );
    }

    public function show(VisitReport $visitReport): VisitReportResource
    {
        Gate::authorize('view', $visitReport);

        return new VisitReportResource($visitReport->load(['booking', 'caregiver.user', 'reviewer']));
    }

    public function checkIn(CheckInRequest $request, Booking $booking, VisitService $visits): VisitReportResource
    {
        return new VisitReportResource(
            $visits->checkIn($request->user(), $booking, $request->validated(), $request)
        );
    }

    public function checkOut(CheckOutRequest $request, Booking $booking, VisitService $visits): VisitReportResource
    {
        return new VisitReportResource(
            $visits->checkOut($request->user(), $booking, $request->validated(), $request)
        );
    }

    public function submit(SubmitVisitReportRequest $request, VisitReport $visitReport, VisitService $visits): VisitReportResource
    {
        return new VisitReportResource(
            $visits->submitReport($request->user(), $visitReport, $request->validated(), $request)
        );
    }

    public function review(VisitReport $visitReport, VisitService $visits): VisitReportResource
    {
        Gate::authorize('review', $visitReport);

        return new VisitReportResource(
            $visits->review(request()->user(), $visitReport, request())
        );
    }
}
