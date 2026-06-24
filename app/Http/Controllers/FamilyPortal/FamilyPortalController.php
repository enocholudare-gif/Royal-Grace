<?php

namespace App\Http\Controllers\FamilyPortal;

use App\Http\Controllers\Controller;
use App\Http\Requests\NotificationManagement\ListNotificationsRequest;
use App\Http\Requests\VisitManagement\ListVisitsRequest;
use App\Http\Requests\PaymentManagement\ListPaymentsRequest;
use App\Http\Requests\BookingManagement\ListBookingsRequest;
use App\Http\Resources\BookingResource;
use App\Http\Resources\InvoiceResource;
use App\Http\Resources\NotificationManagement\DatabaseNotificationResource;
use App\Http\Resources\VisitReportResource;
use App\Services\FamilyPortal\FamilyPortalService;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Gate;

class FamilyPortalController extends Controller
{
    public function upcomingBookings(ListBookingsRequest $request, FamilyPortalService $portal): AnonymousResourceCollection
    {
        Gate::authorize('view', $request->user()->familyMember);

        return BookingResource::collection(
            $portal->upcomingBookings($request->user()->familyMember, (int) ($request->validated('per_page') ?? 15))
        );
    }

    public function completedVisits(ListVisitsRequest $request, FamilyPortalService $portal): AnonymousResourceCollection
    {
        Gate::authorize('view', $request->user()->familyMember);

        return VisitReportResource::collection(
            $portal->completedVisits($request->user()->familyMember, (int) ($request->validated('per_page') ?? 15))
        );
    }

    public function invoices(ListPaymentsRequest $request, FamilyPortalService $portal): AnonymousResourceCollection
    {
        Gate::authorize('view', $request->user()->familyMember);

        return InvoiceResource::collection(
            $portal->invoices($request->user()->familyMember, (int) ($request->validated('per_page') ?? 15))
        );
    }

    public function notifications(ListNotificationsRequest $request, FamilyPortalService $portal): AnonymousResourceCollection
    {
        Gate::authorize('view', $request->user()->familyMember);

        return DatabaseNotificationResource::collection(
            $portal->notifications($request->user()->familyMember, (int) ($request->validated('per_page') ?? 15))
        );
    }
}
