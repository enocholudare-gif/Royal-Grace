<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bookings', function (Blueprint $table) {
            $table->id();
            $table->string('booking_number', 30)->unique();
            $table->foreignId('client_id')->constrained('clients')->cascadeOnDelete()->cascadeOnUpdate();
            $table->foreignId('service_id')->constrained('services')->restrictOnDelete()->cascadeOnUpdate();
            $table->foreignId('assigned_caregiver_id')->nullable()->constrained('caregivers')->nullOnDelete()->cascadeOnUpdate();
            $table->foreignId('preferred_caregiver_id')->nullable()->constrained('caregivers')->nullOnDelete()->cascadeOnUpdate();
            $table->dateTime('scheduled_start_at');
            $table->dateTime('scheduled_end_at');
            $table->text('care_instructions')->nullable();
            $table->string('service_name_snapshot', 150);
            $table->decimal('service_price_snapshot', 12, 2);
            $table->unsignedInteger('service_duration_snapshot');
            $table->enum('status', ['pending', 'awaiting_payment', 'confirmed', 'assigned', 'in_progress', 'completed', 'cancelled', 'refunded'])->default('pending');
            $table->enum('booking_source', ['web', 'admin', 'family'])->default('web');
            $table->boolean('is_recurring')->default(false);
            $table->uuid('recurrence_group_uuid')->nullable();
            $table->decimal('subtotal_amount', 12, 2);
            $table->decimal('discount_amount', 12, 2)->default(0);
            $table->decimal('tax_amount', 12, 2)->default(0);
            $table->decimal('total_amount', 12, 2);
            $table->timestamp('confirmed_at')->nullable();
            $table->timestamp('cancelled_at')->nullable();
            $table->text('cancellation_reason')->nullable();
            $table->foreignId('cancelled_by')->nullable()->constrained('users')->nullOnDelete()->cascadeOnUpdate();
            $table->timestamps();

            $table->index(['client_id', 'scheduled_start_at']);
            $table->index('service_id');
            $table->index(['assigned_caregiver_id', 'scheduled_start_at']);
            $table->index('preferred_caregiver_id');
            $table->index(['status', 'scheduled_start_at']);
            $table->index('recurrence_group_uuid');
            $table->index('cancelled_by');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};
