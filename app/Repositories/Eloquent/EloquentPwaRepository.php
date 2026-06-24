<?php

namespace App\Repositories\Eloquent;

use App\Models\PwaSyncOperation;
use App\Models\User;
use App\Models\UserFcmToken;
use App\Repositories\Contracts\PwaRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class EloquentPwaRepository implements PwaRepositoryInterface
{
    public function registerDevice(User $user, array $data): UserFcmToken
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

    public function updateDeviceToken(User $user, array $data): UserFcmToken
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

    public function queueSyncOperation(User $user, array $data): PwaSyncOperation
    {
        return PwaSyncOperation::query()->create([
            'user_id' => $user->id,
            'device_uuid' => $data['device_uuid'],
            'operation_type' => $data['operation_type'],
            'payload' => $data['payload'] ?? null,
            'status' => 'pending',
        ]);
    }

    public function pendingSyncOperations(User $user, string $deviceUuid, int $perPage = 50): LengthAwarePaginator
    {
        return PwaSyncOperation::query()
            ->where('user_id', $user->id)
            ->where('device_uuid', $deviceUuid)
            ->whereIn('status', ['pending', 'processing'])
            ->latest()
            ->paginate($perPage);
    }

    public function markSyncCompleted(PwaSyncOperation $operation): PwaSyncOperation
    {
        $operation->update([
            'status' => 'completed',
            'synced_at' => now(),
        ]);

        return $operation->fresh();
    }
}
