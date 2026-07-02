<?php

namespace App\Repositories\Eloquent;

use App\Models\Client;
use App\Repositories\Contracts\ClientRepositoryInterface;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;

class EloquentClientRepository implements ClientRepositoryInterface
{
    public function all(array $filters = [], array $with = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = Client::with($with);

        if (isset($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (isset($filters['city'])) {
            $query->where('city', $filters['city']);
        }

        return $query->latest()->paginate($perPage);
    }

    public function find(int $id, array $with = []): ?Client
    {
        // Use withTrashed to allow finding a deleted client to restore it if needed, or strict finding.
        // Usually, we only find active unless specified. For a simple PRD, we stick to findOrFail or find with Trashed based on needs.
        return Client::with($with)->withTrashed()->findOrFail($id);
    }

    public function create(array $data): Client
    {
        return Client::create($data);
    }

    public function update(Client $client, array $data): Client
    {
        $client->update($data);
        return $client;
    }

    public function delete(Client $client): bool
    {
        return $client->delete();
    }

    public function restore(int $id): bool
    {
        $client = Client::withTrashed()->findOrFail($id);
        return $client->restore();
    }

    public function search(string $searchTerm, array $with = [], int $perPage = 15): LengthAwarePaginator
    {
        return Client::with($with)
            ->whereHas('user', function (Builder $query) use ($searchTerm) {
                $query->where('first_name', 'like', "%{$searchTerm}%")
                      ->orWhere('last_name', 'like', "%{$searchTerm}%")
                      ->orWhere('email', 'like', "%{$searchTerm}%");
            })
            ->orWhere('city', 'like', "%{$searchTerm}%")
            ->orWhere('emergency_contact_name', 'like', "%{$searchTerm}%")
            ->latest()
            ->paginate($perPage);
    }
}
