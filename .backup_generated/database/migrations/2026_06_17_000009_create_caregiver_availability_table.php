<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('caregiver_availability', function (Blueprint $table) {
            $table->id();
            $table->foreignId('caregiver_id')->constrained('caregivers')->cascadeOnDelete()->cascadeOnUpdate();
            $table->enum('availability_type', ['available', 'unavailable', 'leave'])->index();
            $table->dateTime('start_datetime');
            $table->dateTime('end_datetime');
            $table->boolean('is_recurring')->default(false);
            $table->string('recurrence_rule')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
            $table->index(['caregiver_id', 'start_datetime', 'end_datetime']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('caregiver_availability');
    }
};
