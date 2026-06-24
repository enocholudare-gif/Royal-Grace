<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('caregiver_attendance', function (Blueprint $table) {
            $table->id();
            $table->foreignId('caregiver_id')->constrained('caregivers')->cascadeOnDelete()->cascadeOnUpdate();
            $table->foreignId('booking_id')->nullable()->constrained('bookings')->nullOnDelete()->cascadeOnUpdate();
            $table->date('attendance_date');
            $table->timestamp('clock_in_at')->nullable();
            $table->timestamp('clock_out_at')->nullable();
            $table->enum('status', ['scheduled', 'present', 'late', 'absent', 'excused'])->default('scheduled');
            $table->decimal('hours_worked', 5, 2)->default(0);
            $table->text('notes')->nullable();
            $table->foreignId('recorded_by')->nullable()->constrained('users')->nullOnDelete()->cascadeOnUpdate();
            $table->timestamps();

            $table->unique(['caregiver_id', 'booking_id', 'attendance_date'], 'uniq_caregiver_booking_attendance');
            $table->index(['caregiver_id', 'attendance_date']);
            $table->index(['status', 'attendance_date']);
            $table->index('recorded_by');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('caregiver_attendance');
    }
};
