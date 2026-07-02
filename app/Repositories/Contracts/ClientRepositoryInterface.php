<?php

namespace App\Repositories\Contracts;

use App\Models\Client;
use Illuminate\Pagination\LengthAwarePaginator;

interface ClientRepositoryInterface
{
    public function all(array $filters = [], array $with = [], int $perPage = 15): LengthAwarePaginator;
    
    public function find(int $id, array $with = []): ?Client;
    
    public function create(array $data): Client;
    
    public function update(Client $client, array $data): Client;
    
    public function delete(Client $client): bool;
    
    public function restore(int $id): bool;

    public function search(string $query, array $with = [], int $perPage = 15): LengthAwarePaginator;
}
