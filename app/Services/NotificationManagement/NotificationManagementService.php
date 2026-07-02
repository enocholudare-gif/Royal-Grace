<?php

namespace App\Services\NotificationManagement;

use App\Models\NotificationPreference;
use App\Models\User;
use App\Models\UserFcmToken;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Notifications\DatabaseNotification;

class NotificationManagementService
{
    public function list(User $user, array $filters = [], int $perPage = 20): LengthAwarePaginator
    {
        return $user->notifications()
            ->when(($filters['unread'] ?? false), fn ($query) => $query->whereNull('read_at'))
            ->latest()
            ->paginate($perPage);
    }

    public function unreadCount(User $user): int
    {
        return $user->unreadNotifications()->count();
    }

    public function markAsRead(User $user, ?string $notificationId = null): void
    {
        $query = $user->unreadNotifications();

        if ($notificationId) {
            $query->where('id', $notificationId);
        }

        $query->get()->each(fn (DatabaseNotification $notification) => $notification->markAsRead());
    }

    public function savePreference(User $user, array $data): NotificationPreference
    {
        return NotificationPreference::query()->updateOrCreate(
            [
                'user_id' => $user->id,
                'notification_type' => $data['notification_type'],
            ],
            [
                'email_enabled' => $data['email_enabled'],
                'fcm_enabled' => $data['fcm_enabled'],
            ]
        );
    }

    public function registerFcmToken(User $user, array $data): UserFcmToken
    {
        return UserFcmToken::query()->updateOrCreate(
            ['token' => $data['token']],
            [
                'user_id' => $user->id,
                'device_type' => $data['device_type'] ?? null,
                'device_name' => $data['device_name'] ?? null,
                'last_used_at' => now(),
            ]
        );
    }

    public function delete(User $user, string $notificationId): void
    {
        $user->notifications()->where('id', $notificationId)->delete();
    }

    public function bulkDelete(User $user, array $notificationIds): void
    {
        if (empty($notificationIds)) {
            return;
        }
        
        $user->notifications()->whereIn('id', $notificationIds)->delete();
    }
}
