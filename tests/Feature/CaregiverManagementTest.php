<?php

namespace Tests\Feature;

use App\Models\Caregiver;
use App\Models\Role;
use App\Models\Service;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class CaregiverManagementTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed();
    }

    public function test_admin_can_add_caregiver(): void
    {
        Sanctum::actingAs($this->userWithRole('admin'));

        $this->postJson('/api/caregivers', [
            'first_name' => 'Grace',
            'last_name' => 'Worker',
            'email' => 'grace.worker@example.com',
            'password' => 'password123',
            'address_line_1' => '10 Care Street',
            'city' => 'Lagos',
            'state' => 'Lagos',
            'postal_code' => '100001',
            'country' => 'Nigeria',
            'emergency_contact_name' => 'Emergency Person',
            'emergency_contact_phone' => '08000000000',
            'certifications' => ['CPR', 'First Aid'],
        ])->assertCreated()
            ->assertJsonPath('data.name', 'Grace Worker')
            ->assertJsonPath('data.status', 'active');

        $this->assertDatabaseHas('users', ['email' => 'grace.worker@example.com']);
        $this->assertDatabaseHas('caregivers', ['city' => 'Lagos', 'status' => 'active']);
    }

    public function test_admin_can_upload_caregiver_document(): void
    {
        Storage::fake('local');

        $admin = $this->userWithRole('admin');
        $caregiver = $this->createCaregiver($this->userWithRole('caregiver'));

        Sanctum::actingAs($admin);

        $this->postJson("/api/caregivers/{$caregiver->id}/documents", [
            'document_type' => 'license',
            'document' => UploadedFile::fake()->create('license.pdf', 120, 'application/pdf'),
            'expires_at' => now()->addYear()->toDateString(),
        ])->assertCreated()
            ->assertJsonPath('data.document_type', 'license')
            ->assertJsonPath('data.status', 'pending_review');

        $this->assertDatabaseHas('caregiver_documents', [
            'caregiver_id' => $caregiver->id,
            'document_type' => 'license',
            'uploaded_by' => $admin->id,
        ]);
    }

    public function test_admin_can_assign_services_to_caregiver(): void
    {
        $caregiver = $this->createCaregiver($this->userWithRole('caregiver'));
        $firstService = $this->createService('Personal Care');
        $secondService = $this->createService('Companion Care');

        Sanctum::actingAs($this->userWithRole('admin'));

        $this->putJson("/api/caregivers/{$caregiver->id}/services", [
            'service_ids' => [$firstService->id, $secondService->id],
            'primary_service_id' => $firstService->id,
        ])->assertOk()
            ->assertJsonCount(2, 'data.services');

        $this->assertDatabaseHas('caregiver_service', [
            'caregiver_id' => $caregiver->id,
            'service_id' => $firstService->id,
            'is_primary' => true,
        ]);
    }

    public function test_caregiver_can_manage_own_availability(): void
    {
        $caregiverUser = $this->userWithRole('caregiver');
        $caregiver = $this->createCaregiver($caregiverUser);

        Sanctum::actingAs($caregiverUser);

        $this->postJson("/api/caregivers/{$caregiver->id}/availability", [
            'availability_type' => 'available',
            'start_datetime' => now()->addDay()->setTime(8, 0)->toDateTimeString(),
            'end_datetime' => now()->addDay()->setTime(16, 0)->toDateTimeString(),
            'is_recurring' => true,
            'recurrence_rule' => 'FREQ=WEEKLY;COUNT=8',
        ])->assertCreated()
            ->assertJsonPath('data.availability_type', 'available')
            ->assertJsonPath('data.is_recurring', true);

        $this->assertDatabaseHas('caregiver_availability', [
            'caregiver_id' => $caregiver->id,
            'availability_type' => 'available',
        ]);
    }

    public function test_admin_can_record_attendance(): void
    {
        $caregiver = $this->createCaregiver($this->userWithRole('caregiver'));

        Sanctum::actingAs($this->userWithRole('admin'));

        $this->postJson("/api/caregivers/{$caregiver->id}/attendance", [
            'attendance_date' => now()->toDateString(),
            'clock_in_at' => now()->setTime(8, 0)->toDateTimeString(),
            'clock_out_at' => now()->setTime(16, 30)->toDateTimeString(),
            'status' => 'present',
            'notes' => 'Completed scheduled shift.',
        ])->assertCreated()
            ->assertJsonPath('data.status', 'present')
            ->assertJsonPath('data.hours_worked', '8.50');

        $this->assertDatabaseHas('caregiver_attendance', [
            'caregiver_id' => $caregiver->id,
            'status' => 'present',
        ]);
    }

    protected function userWithRole(string $roleSlug): User
    {
        return User::factory()->create([
            'role_id' => Role::query()->where('slug', $roleSlug)->firstOrFail()->id,
        ]);
    }

    protected function createCaregiver(User $user): Caregiver
    {
        return Caregiver::query()->create([
            'user_id' => $user->id,
            'address_line_1' => '20 Grace Avenue',
            'city' => 'Lagos',
            'state' => 'Lagos',
            'postal_code' => '100001',
            'country' => 'Nigeria',
            'emergency_contact_name' => 'Emergency Contact',
            'emergency_contact_phone' => '08000000000',
            'is_available' => true,
            'status' => 'active',
        ]);
    }

    protected function createService(string $name): Service
    {
        return Service::query()->create([
            'name' => $name . ' ' . uniqid(),
            'slug' => str($name)->slug() . '-' . uniqid(),
            'description' => 'Care service.',
            'price' => 100,
            'duration_minutes' => 60,
            'status' => 'active',
        ]);
    }
}
