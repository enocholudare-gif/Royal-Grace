<?php

namespace Tests\Feature;

use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class RbacTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed();
    }

    public function test_admin_can_assign_role_to_user(): void
    {
        $admin = User::factory()->create([
            'role_id' => Role::query()->where('slug', 'admin')->firstOrFail()->id,
        ]);

        $user = User::factory()->create([
            'role_id' => Role::query()->where('slug', 'client')->firstOrFail()->id,
        ]);

        Sanctum::actingAs($admin);

        $this->putJson("/api/admin/users/{$user->id}/role", [
            'role' => 'caregiver',
        ])->assertOk()
            ->assertJsonPath('user.role.slug', 'caregiver');

        $this->assertSame('caregiver', $user->fresh('role')->role->slug);
    }

    public function test_client_cannot_assign_roles(): void
    {
        $client = User::factory()->create([
            'role_id' => Role::query()->where('slug', 'client')->firstOrFail()->id,
        ]);

        $user = User::factory()->create([
            'role_id' => Role::query()->where('slug', 'family-member')->firstOrFail()->id,
        ]);

        Sanctum::actingAs($client);

        $this->putJson("/api/admin/users/{$user->id}/role", [
            'role' => 'caregiver',
        ])->assertForbidden();
    }

    public function test_user_permission_helper_uses_role_matrix(): void
    {
        $superAdmin = User::factory()->create([
            'role_id' => Role::query()->where('slug', 'super-admin')->firstOrFail()->id,
        ]);

        $caregiver = User::factory()->create([
            'role_id' => Role::query()->where('slug', 'caregiver')->firstOrFail()->id,
        ]);

        $this->assertTrue($superAdmin->hasPermission('anything.at.all'));
        $this->assertTrue($caregiver->hasPermission('visits.manage.assigned'));
        $this->assertFalse($caregiver->hasPermission('roles.assign'));
    }
}
