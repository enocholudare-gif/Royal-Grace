<?php

namespace App\Http\Controllers\Pwa;

use App\Http\Controllers\Controller;
use App\Http\Requests\Pwa\ListSyncOperationsRequest;
use App\Http\Requests\Pwa\MarkSyncCompletedRequest;
use App\Http\Requests\Pwa\QueueSyncRequest;
use App\Http\Requests\Pwa\RegisterDeviceRequest;
use App\Http\Resources\PwaSyncOperationResource;
use App\Http\Resources\UserFcmTokenResource;
use App\Models\PwaSyncOperation;
use App\Services\Pwa\PwaService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class PwaController extends Controller
{
    public function registerDevice(RegisterDeviceRequest $request, PwaService $pwa): JsonResponse
    {
        return (new UserFcmTokenResource(
            $pwa->registerDevice($request->user(), $request->validated())
        ))->response()->setStatusCode(201);
    }

    public function updatePushToken(RegisterDeviceRequest $request, PwaService $pwa): UserFcmTokenResource
    {
        return new UserFcmTokenResource(
            $pwa->updateDeviceToken($request->user(), $request->validated())
        );
    }

    public function queueSync(QueueSyncRequest $request, PwaService $pwa): JsonResponse
    {
        return (new PwaSyncOperationResource(
            $pwa->queueBackgroundSync($request->user(), $request->validated())
        ))->response()->setStatusCode(202);
    }

    public function pendingSync(ListSyncOperationsRequest $request, PwaService $pwa): AnonymousResourceCollection
    {
        $validated = $request->validated();

        return PwaSyncOperationResource::collection(
            $pwa->pendingSync($request->user(), $validated['device_uuid'], (int) ($validated['per_page'] ?? 50))
        );
    }

    public function markSyncCompleted(MarkSyncCompletedRequest $request, PwaSyncOperation $operation, PwaService $pwa): PwaSyncOperationResource
    {
        abort_unless($operation->user_id === $request->user()->id, 403);

        return new PwaSyncOperationResource($pwa->markCompleted($operation));
    }
}
