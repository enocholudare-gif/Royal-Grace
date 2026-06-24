<?php

namespace Tests\Feature;

use App\Models\Client;
use App\Models\Role;
use App\Models\User;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\URL;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AuthModuleTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        Role::query()->insert([
            ['name' => 'Client', 'slug' => 'client', 'description' => 'Client access', 'is_system' => true],
            ['name' => 'Caregiver', 'slug' => 'caregiver', 'description' => 'Caregiver access', 'is_system' => true],
            ['name' => 'Family Member', 'slug' => 'family-member', 'description' => 'Family access', 'is_system' => true],
        ]);
    }

    public function test_client_can_register_and_get_sanctum_token(): void
    {
        Notification::fake();

        $response = $this->postJson('/api/register', [
            'first_name' => 'Grace',
            'last_name' => 'Client',
            'email' => 'grace.client@example.com',
            'password' => 'Password123!',
            'password_confirmation' => 'Password123!',
            'role' => 'client',
            'client' => [
                'address_line_1' => '1 Care Street',
                'city' => 'Lagos',
                'state' => 'Lagos',
                'postal_code' => '100001',
                'country' => 'Nigeria',
            ],
        ]);

        $response->assertCreated()
            ->assertJsonStructure(['message', 'user', 'token']);

        $this->assertDatabaseHas('users', ['email' => 'grace.client@example.com']);
        $this->assertDatabaseHas('clients', ['address_line_1' => '1 Care Street']);

        Notification::assertSentTo(User::query()->where('email', 'grace.client@example.com')->first(), VerifyEmail::class);
    }

    public function test_user_can_login_and_logout(): void
    {
        $role = Role::query()->where('slug', 'client')->firstOrFail();
        $user = User::factory()->create([
            'role_id' => $role->id,
            'first_name' => 'Login',
            'last_name' => 'Client',
            'password' => bcrypt('Password123!'),
            'status' => 'active',
        ]);

        $login = $this->postJson('/api/login', [
            'email' => $user->email,
            'password' => 'Password123!',
        ]);

        $login->assertOk()->assertJsonStructure(['message', 'user', 'token']);

        Sanctum::actingAs($user);

        $this->postJson('/api/logout')->assertOk();
    }

    public function test_password_reset_link_can_be_requested(): void
    {
        Notification::fake();

        $role = Role::query()->where('slug', 'client')->firstOrFail();
        $user = User::factory()->create([
            'role_id' => $role->id,
            'first_name' => 'Reset',
            'last_name' => 'Client',
            'status' => 'active',
        ]);

        $this->postJson('/api/forgot-password', [
            'email' => $user->email,
        ])->assertOk();

        Notification::assertSentTo($user, ResetPassword::class);
    }

    public function test_password_can_be_reset(): void
    {
        $role = Role::query()->where('slug', 'client')->firstOrFail();
        $user = User::factory()->create([
            'role_id' => $role->id,
            'first_name' => 'Reset',
            'last_name' => 'Client',
            'status' => 'active',
        ]);

        $token = Password::createToken($user);

        $this->postJson('/api/reset-password', [
            'email' => $user->email,
            'token' => $token,
            'password' => 'NewPassword123!',
            'password_confirmation' => 'NewPassword123!',
        ])->assertOk();
    }

    public function test_email_can_be_verified_from_signed_link(): void
    {
        $role = Role::query()->where('slug', 'client')->firstOrFail();
        $user = User::factory()->create([
            'role_id' => $role->id,
            'first_name' => 'Verify',
            'last_name' => 'Client',
            'email_verified_at' => null,
            'status' => 'pending_verification',
        ]);

        Client::query()->create([
            'user_id' => $user->id,
            'address_line_1' => '1 Care Street',
            'city' => 'Lagos',
            'state' => 'Lagos',
            'postal_code' => '100001',
            'country' => 'Nigeria',
            'status' => 'active',
        ]);

        $url = URL::temporarySignedRoute(
            'verification.verify',
            now()->addMinutes(30),
            ['id' => $user->id, 'hash' => sha1($user->getEmailForVerification())]
        );

        $this->getJson($url)->assertOk()
            ->assertJson(['verified' => true]);

        $this->assertTrue($user->fresh()->hasVerifiedEmail());
    }
}
