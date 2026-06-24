<?php

namespace App\Services\Pwa;

use App\Models\PwaSyncOperation;
use App\Models\User;
use App\Models\UserFcmToken;
use App\Repositories\Contracts\PwaRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class PwaService
{
    public function __construct(
        protected PwaRepositoryInterface $pwa
    ) {
    }

    public function registerDevice(User $user, array $data): UserFcmToken
    {
        return $this->pwa->registerDevice($user, $data);
    }

    public function updateDeviceToken(User $user, array $data): UserFcmToken
    {
        return $this->pwa->updateDeviceToken($user, $data);
    }

    public function queueBackgroundSync(User $user, array $data): PwaSyncOperation
    {
        return $this->pwa->queueSyncOperation($user, $data);
    }

    public function pendingSync(User $user, string $deviceUuid, int $perPage = 50): LengthAwarePaginator
    {
        return $this->pwa->pendingSyncOperations($user, $deviceUuid, $perPage);
    }

    public function markCompleted(PwaSyncOperation $operation): PwaSyncOperation
    {
        return $this->pwa->markSyncCompleted($operation);
    }
}
