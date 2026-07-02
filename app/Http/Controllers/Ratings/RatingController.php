<?php

namespace App\Http\Controllers\Ratings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Ratings\ListRatingsRequest;
use App\Http\Requests\Ratings\StoreRatingRequest;
use App\Http\Resources\RatingResource;
use App\Models\Booking;
use App\Models\Rating;
use App\Services\Ratings\RatingService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Gate;

class RatingController extends Controller
{
    public function index(ListRatingsRequest $request, RatingService $ratings): AnonymousResourceCollection
    {
        $validated = $request->validated();

        return RatingResource::collection(
            $ratings->history($request->user(), $validated, (int) ($validated['per_page'] ?? 15))
        );
    }

    public function show(Rating $rating): RatingResource
    {
        Gate::authorize('view', $rating);

        return new RatingResource($rating->load(['booking', 'client.user', 'caregiver.user']));
    }

    public function statistics(RatingService $ratings): JsonResponse
    {
        return response()->json($ratings->statistics(request()->user()));
    }

    public function store(StoreRatingRequest $request, RatingService $ratings): JsonResponse
    {
        $validated = $request->validated();
        $booking = Booking::findOrFail($validated['booking_id']);

        return (new RatingResource(
            $ratings->submit($request->user(), $booking, $validated)
        ))->response()->setStatusCode(201);
    }
}
