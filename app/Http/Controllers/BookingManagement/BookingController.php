<?php

namespace App\Http\Controllers\BookingManagement;

use App\Http\Controllers\Controller;
use App\Http\Requests\BookingManagement\AssignBookingRequest;
use App\Http\Requests\BookingManagement\CancelBookingRequest;
use App\Http\Requests\BookingManagement\ListBookingsRequest;
use App\Http\Requests\BookingManagement\StoreBookingRequest;
use App\Http\Requests\BookingManagement\UpdateBookingRequest;
use App\Http\Requests\BookingManagement\UpdateBookingStatusRequest;
use App\Http\Resources\BookingResource;
use App\Models\Booking;
use App\Models\Caregiver;
use App\Services\BookingManagement\BookingManagementService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Gate;

class BookingController extends Controller
{
    public function index(ListBookingsRequest $request, BookingManagementService $bookings): AnonymousResourceCollection
    {
        $validated = $request->validated();

        return BookingResource::collection(
            $bookings->list($request->user(), $validated, (int) ($validated['per_page'] ?? 15))
        );
    }

    public function store(StoreBookingRequest $request, BookingManagementService $bookings): JsonResponse
    {
        $createdBookings = $bookings->create($request->user(), $request->validated());

        return BookingResource::collection($createdBookings->load(['client.user', 'service']))
            ->response()
            ->setStatusCode(201);
    }

    public function show(Booking $booking): BookingResource
    {
        Gate::authorize('view', $booking);

        return new BookingResource(
            $booking->load(['client.user', 'service', 'assignedCaregiver.user', 'preferredCaregiver.user'])
        );
    }

    public function update(UpdateBookingRequest $request, Booking $booking, BookingManagementService $bookings): BookingResource
    {
        return new BookingResource(
            $bookings->update($booking, $request->validated())
        );
    }

    public function assign(AssignBookingRequest $request, Booking $booking, BookingManagementService $bookings): BookingResource
    {
        return new BookingResource(
            $bookings->assign($booking, Caregiver::query()->findOrFail($request->integer('caregiver_id')))
        );
    }

    public function confirm(Booking $booking, BookingManagementService $bookings): BookingResource
    {
        Gate::authorize('confirm', $booking);

        return new BookingResource($bookings->confirm($booking));
    }

    public function status(UpdateBookingStatusRequest $request, Booking $booking, BookingManagementService $bookings): BookingResource
    {
        return new BookingResource(
            $bookings->updateStatus($booking, $request->validated('status'))
        );
    }

    public function cancel(CancelBookingRequest $request, Booking $booking, BookingManagementService $bookings): BookingResource
    {
        return new BookingResource(
            $bookings->cancel($booking, $request->user(), $request->validated('reason'))
        );
    }
}
