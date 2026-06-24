<?php

namespace App\Services\ServiceManagement;

use App\Models\Service;
use App\Repositories\Contracts\ServiceRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Str;

class ServiceManagementService
{
    public function __construct(
        protected ServiceRepositoryInterface $services
    ) {
    }

    public function list(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        return $this->services->paginate($filters, $perPage);
    }

    public function create(array $data): Service
    {
        $data['slug'] = $data['slug'] ?? Str::slug($data['name']);
        $data['status'] = $data['status'] ?? 'active';

        return $this->services->create($data);
    }

    public function update(Service $service, array $data): Service
    {
        if (isset($data['name']) && ! isset($data['slug'])) {
            $data['slug'] = Str::slug($data['name']);
        }

        return $this->services->update($service, $data);
    }

    public function delete(Service $service): bool
    {
        return $this->services->delete($service);
    }

    public function disable(Service $service): Service
    {
        return $this->services->disable($service);
    }
}
