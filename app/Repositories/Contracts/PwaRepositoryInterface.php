<?php

namespace App\Repositories\Contracts;

use App\Models\PwaSyncOperation;
use App\Models\User;
use App\Models\UserFcmToken;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface PwaRepositoryInterface
{
    public function registerDevice(User $user, array $data): UserFcmToken;

    public function updateDeviceToken(User $user, array $data): UserFcmToken;

    public function queueSyncOperation(User $user, array $data): PwaSyncOperation;

    public function pendingSyncOperations(User $user, string $deviceUuid, int $perPage = 50): LengthAwarePaginator;

    public function markSyncCompleted(PwaSyncOperation $operation): PwaSyncOperation;
}
