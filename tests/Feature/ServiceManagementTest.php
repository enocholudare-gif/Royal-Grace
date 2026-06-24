<?php

namespace Tests\Feature;

use App\Models\Role;
use App\Models\Service;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ServiceManagementTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed();
    }

    public function test_admin_can_create_service(): void
    {
        Sanctum::actingAs($this->userWithRole('admin'));

        $this->postJson('/api/services', [
            'name' => 'Companion Care',
            'description' => 'Companionship and support.',
            'price' => 120.50,
            'duration_minutes' => 120,
        ])->assertCreated()
            ->assertJsonPath('data.name', 'Companion Care')
            ->assertJsonPath('data.slug', 'companion-care');

        $this->assertDatabaseHas('services', [
            'name' => 'Companion Care',
            'slug' => 'companion-care',
            'status' => 'active',
        ]);
    }

    public function test_admin_can_update_disable_and_delete_service(): void
    {
        Sanctum::actingAs($this->userWithRole('admin'));

        $service = Service::query()->create([
            'name' => 'Wellness Support',
            'slug' => 'wellness-support',
            'description' => 'Wellness checks.',
            'price' => 90,
            'duration_minutes' => 60,
            'status' => 'active',
        ]);

        $this->putJson("/api/services/{$service->id}", [
            'name' => 'Wellness Care',
            'price' => 95,
            'duration_minutes' => 75,
        ])->assertOk()
            ->assertJsonPath('data.name', 'Wellness Care')
            ->assertJsonPath('data.slug', 'wellness-care');

        $this->patchJson("/api/services/{$service->id}/disable")
            ->assertOk()
            ->assertJsonPath('data.status', 'inactive');

        $this->deleteJson("/api/services/{$service->id}")
            ->assertOk();

        $this->assertDatabaseMissing('services', ['id' => $service->id]);
    }

    public function test_services_can_be_listed_publicly(): void
    {
        Service::query()->create([
            'name' => 'Transportation Assistance',
            'slug' => 'transportation-assistance',
            'description' => 'Transport support.',
            'price' => 80,
            'duration_minutes' => 60,
            'status' => 'active',
        ]);

        $this->getJson('/api/services')
            ->assertOk()
            ->assertJsonPath('data.0.name', 'Transportation Assistance');
    }

    public function test_client_cannot_manage_services(): void
    {
        Sanctum::actingAs($this->userWithRole('client'));

        $this->postJson('/api/services', [
            'name' => 'Daily Living Assistance',
            'price' => 100,
            'duration_minutes' => 60,
        ])->assertForbidden();
    }

    protected function userWithRole(string $roleSlug): User
    {
        return User::factory()->create([
            'role_id' => Role::query()->where('slug', $roleSlug)->firstOrFail()->id,
        ]);
    }
}
