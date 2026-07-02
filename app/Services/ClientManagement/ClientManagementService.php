<?php

namespace App\Services\ClientManagement;

use App\Models\Client;
use App\Models\Role;
use App\Models\User;
use App\Models\ClientAttachment;
use App\Repositories\Contracts\ClientRepositoryInterface;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Http\UploadedFile;

class ClientManagementService
{
    public function __construct(
        protected ClientRepositoryInterface $clientRepository
    ) {}

    public function createClient(array $data): Client
    {
        return DB::transaction(function () use ($data) {
            $clientRole = Role::where('slug', 'client')->first();
            
            // Create user first if client doesn't exist
            $user = User::create([
                'role_id' => $clientRole?->id,
                'first_name' => $data['first_name'],
                'last_name' => $data['last_name'],
                'email' => $data['email'],
                'phone' => $data['phone'] ?? null,
                'password' => Hash::make($data['password'] ?? Str::random(12)),
            ]);

            // Create client profile
            return $this->clientRepository->create([
                'user_id' => $user->id,
                'date_of_birth' => $data['date_of_birth'] ?? null,
                'address_line_1' => $data['address_line_1'],
                'address_line_2' => $data['address_line_2'] ?? null,
                'city' => $data['city'],
                'state' => $data['state'],
                'postal_code' => $data['postal_code'],
                'country' => $data['country'],
                'emergency_contact_name' => $data['emergency_contact_name'] ?? null,
                'emergency_contact_phone' => $data['emergency_contact_phone'] ?? null,
                'care_notes' => $data['care_notes'] ?? null,
                'mobility_notes' => $data['mobility_notes'] ?? null,
                'medical_notes' => $data['medical_notes'] ?? null,
                'status' => $data['status'] ?? 'active',
            ]);
        });
    }

    public function updateClient(Client $client, array $data): Client
    {
        return DB::transaction(function () use ($client, $data) {
            $client->user->update([
                'first_name' => $data['first_name'],
                'last_name' => $data['last_name'],
                'email' => $data['email'],
                'phone' => $data['phone'] ?? null,
            ]);

            return $this->clientRepository->update($client, [
                'date_of_birth' => $data['date_of_birth'] ?? $client->date_of_birth,
                'address_line_1' => $data['address_line_1'] ?? $client->address_line_1,
                'address_line_2' => $data['address_line_2'] ?? $client->address_line_2,
                'city' => $data['city'] ?? $client->city,
                'state' => $data['state'] ?? $client->state,
                'postal_code' => $data['postal_code'] ?? $client->postal_code,
                'country' => $data['country'] ?? $client->country,
                'emergency_contact_name' => $data['emergency_contact_name'] ?? $client->emergency_contact_name,
                'emergency_contact_phone' => $data['emergency_contact_phone'] ?? $client->emergency_contact_phone,
                'care_notes' => $data['care_notes'] ?? $client->care_notes,
                'mobility_notes' => $data['mobility_notes'] ?? $client->mobility_notes,
                'medical_notes' => $data['medical_notes'] ?? $client->medical_notes,
                'status' => $data['status'] ?? $client->status,
            ]);
        });
    }

    public function deleteClient(Client $client): bool
    {
        return $this->clientRepository->delete($client);
    }

    public function restoreClient(int $id): bool
    {
        return $this->clientRepository->restore($id);
    }

    public function uploadAttachment(Client $client, UploadedFile $file): ClientAttachment
    {
        $path = $file->store('client-attachments', 'public');
        
        return $client->attachments()->create([
            'file_name' => $file->getClientOriginalName(),
            'file_path' => $path,
            'file_type' => $file->getClientMimeType(),
            'file_size' => $file->getSize(),
        ]);
    }
}
