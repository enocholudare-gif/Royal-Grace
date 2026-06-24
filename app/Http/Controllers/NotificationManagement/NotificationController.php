<?php

namespace App\Http\Controllers\NotificationManagement;

use App\Http\Controllers\Controller;
use App\Http\Requests\NotificationManagement\ListNotificationsRequest;
use App\Http\Requests\NotificationManagement\MarkNotificationReadRequest;
use App\Http\Requests\NotificationManagement\RegisterFcmTokenRequest;
use App\Http\Requests\NotificationManagement\SaveNotificationPreferenceRequest;
use App\Http\Resources\NotificationManagement\DatabaseNotificationResource;
use App\Http\Resources\NotificationManagement\NotificationPreferenceResource;
use App\Http\Resources\NotificationManagement\UserFcmTokenResource;
use App\Services\NotificationManagement\NotificationManagementService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class NotificationController extends Controller
{
    public function index(ListNotificationsRequest $request, NotificationManagementService $notifications): AnonymousResourceCollection
    {
        $validated = $request->validated();

        return DatabaseNotificationResource::collection(
            $notifications->list($request->user(), $validated, (int) ($validated['per_page'] ?? 20))
        );
    }

    public function unreadCount(ListNotificationsRequest $request, NotificationManagementService $notifications): JsonResponse
    {
        return response()->json([
            'unread_count' => $notifications->unreadCount($request->user()),
        ]);
    }

    public function markRead(MarkNotificationReadRequest $request, NotificationManagementService $notifications): JsonResponse
    {
        $notifications->markAsRead($request->user(), $request->validated('notification_id'));

        return response()->json(['message' => 'Notifications marked as read.']);
    }

    public function savePreference(SaveNotificationPreferenceRequest $request, NotificationManagementService $notifications): NotificationPreferenceResource
    {
        return (new NotificationPreferenceResource(
            $notifications->savePreference($request->user(), $request->validated())
        ))->additional([
            'message' => 'Notification preference saved.',
        ]);
    }

    public function registerFcmToken(RegisterFcmTokenRequest $request, NotificationManagementService $notifications): UserFcmTokenResource
    {
        return new UserFcmTokenResource(
            $notifications->registerFcmToken($request->user(), $request->validated())
        );
    }
}
