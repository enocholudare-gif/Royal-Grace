<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('visit_reports', function (Blueprint $table) {
            $table->id();
            $table->foreignId('booking_id')->unique()->constrained('bookings')->cascadeOnDelete()->cascadeOnUpdate();
            $table->foreignId('caregiver_id')->constrained('caregivers')->restrictOnDelete()->cascadeOnUpdate();
            $table->dateTime('arrival_time')->nullable();
            $table->dateTime('departure_time')->nullable();
            $table->decimal('check_in_latitude', 10, 7)->nullable();
            $table->decimal('check_in_longitude', 10, 7)->nullable();
            $table->decimal('check_out_latitude', 10, 7)->nullable();
            $table->decimal('check_out_longitude', 10, 7)->nullable();
            $table->text('check_in_device_info')->nullable();
            $table->text('check_out_device_info')->nullable();
            $table->text('services_performed')->nullable();
            $table->text('observations')->nullable();
            $table->text('client_condition')->nullable();
            $table->text('notes')->nullable();
            $table->enum('status', ['draft', 'submitted', 'reviewed'])->default('draft')->index();
            $table->timestamp('submitted_at')->nullable();
            $table->timestamp('reviewed_at')->nullable();
            $table->foreignId('reviewed_by')->nullable()->constrained('users')->nullOnDelete()->cascadeOnUpdate();
            $table->timestamps();
            $table->index(['caregiver_id', 'submitted_at']);
            $table->index('reviewed_by');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('visit_reports');
    }
};
