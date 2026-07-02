<?php

namespace Tests\Feature\ReportManagement;

use App\Models\User;
use App\Models\Role;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ReportApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->adminRole = Role::firstOrCreate(['slug' => 'admin'], ['name' => 'Admin']);
        $this->caregiverRole = Role::firstOrCreate(['slug' => 'caregiver'], ['name' => 'Caregiver']);
        
        $this->admin = User::factory()->create();
        $this->admin->roles()->attach($this->adminRole);
        
        $this->caregiver = User::factory()->create();
        $this->caregiver->roles()->attach($this->caregiverRole);
    }

    public function test_admin_can_access_dashboard()
    {
        $response = $this->actingAs($this->admin)->getJson('/api/reports/dashboard');
        
        $response->assertStatus(200);
        $response->assertJsonStructure([
            'data' => [
                'total_clients',
                'active_caregivers',
                'revenue',
                'active_bookings',
                'upcoming_visits',
                'cancellation_rate'
            ]
        ]);
    }

    public function test_caregiver_cannot_access_reports()
    {
        $response = $this->actingAs($this->caregiver)->getJson('/api/reports/dashboard');
        
        $response->assertStatus(403);
    }

    public function test_admin_can_access_revenue_report()
    {
        $response = $this->actingAs($this->admin)->getJson('/api/reports/revenue?timeframe=monthly');
        
        $response->assertStatus(200);
    }

    public function test_admin_can_access_bookings_report()
    {
        $response = $this->actingAs($this->admin)->getJson('/api/reports/bookings');
        
        $response->assertStatus(200);
    }

    public function test_admin_can_access_caregivers_report()
    {
        $response = $this->actingAs($this->admin)->getJson('/api/reports/caregivers');
        
        $response->assertStatus(200);
    }

    public function test_admin_can_access_clients_report()
    {
        $response = $this->actingAs($this->admin)->getJson('/api/reports/clients');
        
        $response->assertStatus(200);
    }

    public function test_export_pdf()
    {
        $response = $this->actingAs($this->admin)->postJson('/api/reports/export/pdf', [
            'type' => 'dashboard'
        ]);
        
        $response->assertStatus(200);
        $response->assertHeader('content-type', 'application/pdf');
    }

    public function test_export_excel()
    {
        $response = $this->actingAs($this->admin)->postJson('/api/reports/export/excel', [
            'type' => 'dashboard'
        ]);
        
        $response->assertStatus(200);
        // Excel headers vary depending on formatting, just assert 200 is sufficient for sync generation
    }
}
