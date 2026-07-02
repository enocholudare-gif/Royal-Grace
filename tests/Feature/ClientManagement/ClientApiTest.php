<?php

namespace Tests\Feature\ClientManagement;

use App\Models\Client;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class ClientApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        // Create an admin role to bypass authorization
        $adminRole = Role::create(['name' => 'Admin', 'slug' => 'admin']);
        $this->admin = User::factory()->create();
        $this->admin->roles()->attach($adminRole);
    }

    public function test_can_list_clients()
    {
        $user = User::factory()->create();
        Client::create([
            'user_id' => $user->id,
            'address_line_1' => '123 Main St',
            'city' => 'Metropolis',
            'state' => 'NY',
            'postal_code' => '10001',
            'country' => 'USA',
        ]);

        $response = $this->actingAs($this->admin)->getJson('/api/clients');

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'data' => [
                '*' => ['id', 'user', 'city', 'status']
            ]
        ]);
    }

    public function test_can_create_client()
    {
        $payload = [
            'first_name' => 'John',
            'last_name' => 'Doe',
            'email' => 'john.client@example.com',
            'phone' => '1234567890',
            'address_line_1' => '456 Oak St',
            'city' => 'Gotham',
            'state' => 'NJ',
            'postal_code' => '07001',
            'country' => 'USA',
        ];

        $response = $this->actingAs($this->admin)->postJson('/api/clients', $payload);

        $response->assertStatus(201);
        $this->assertDatabaseHas('users', ['email' => 'john.client@example.com']);
        $this->assertDatabaseHas('clients', ['city' => 'Gotham']);
    }

    public function test_can_update_client()
    {
        $user = User::factory()->create();
        $client = Client::create([
            'user_id' => $user->id,
            'address_line_1' => '123 Main St',
            'city' => 'Metropolis',
            'state' => 'NY',
            'postal_code' => '10001',
            'country' => 'USA',
        ]);

        $payload = [
            'first_name' => 'Updated',
            'last_name' => 'Name',
            'email' => 'updated@example.com',
            'address_line_1' => '123 Main St',
            'city' => 'New City',
            'state' => 'NY',
            'postal_code' => '10001',
            'country' => 'USA',
        ];

        $response = $this->actingAs($this->admin)->putJson("/api/clients/{$client->id}", $payload);

        $response->assertStatus(200);
        $this->assertDatabaseHas('users', ['email' => 'updated@example.com']);
        $this->assertDatabaseHas('clients', ['city' => 'New City']);
    }

    public function test_can_delete_client()
    {
        $user = User::factory()->create();
        $client = Client::create([
            'user_id' => $user->id,
            'address_line_1' => '123 Main St',
            'city' => 'Metropolis',
            'state' => 'NY',
            'postal_code' => '10001',
            'country' => 'USA',
        ]);

        $response = $this->actingAs($this->admin)->deleteJson("/api/clients/{$client->id}");

        $response->assertStatus(200);
        $this->assertSoftDeleted($client);
    }

    public function test_can_restore_client()
    {
        $user = User::factory()->create();
        $client = Client::create([
            'user_id' => $user->id,
            'address_line_1' => '123 Main St',
            'city' => 'Metropolis',
            'state' => 'NY',
            'postal_code' => '10001',
            'country' => 'USA',
        ]);

        $client->delete();

        $response = $this->actingAs($this->admin)->patchJson("/api/clients/{$client->id}/restore");

        $response->assertStatus(200);
        $this->assertNotSoftDeleted($client);
    }

    public function test_can_upload_attachment()
    {
        Storage::fake('public');

        $user = User::factory()->create();
        $client = Client::create([
            'user_id' => $user->id,
            'address_line_1' => '123 Main St',
            'city' => 'Metropolis',
            'state' => 'NY',
            'postal_code' => '10001',
            'country' => 'USA',
        ]);

        $file = UploadedFile::fake()->create('document.pdf', 1000, 'application/pdf');

        $response = $this->actingAs($this->admin)->postJson("/api/clients/{$client->id}/attachments", [
            'attachment' => $file,
        ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('client_attachments', ['file_name' => 'document.pdf']);
    }
}
