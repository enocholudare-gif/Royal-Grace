<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ratings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('booking_id')->constrained('bookings')->cascadeOnDelete()->cascadeOnUpdate();
            $table->foreignId('client_id')->constrained('clients')->cascadeOnDelete()->cascadeOnUpdate();
            $table->foreignId('caregiver_id')->constrained('caregivers')->cascadeOnDelete()->cascadeOnUpdate();
            $table->unsignedTinyInteger('rating');
            $table->text('comment')->nullable();
            $table->timestamp('submitted_at')->useCurrent();
            $table->timestamps();
            $table->unique(['booking_id', 'client_id']);
            $table->index(['caregiver_id', 'rating']);
            $table->index('client_id');
            $table->check('rating between 1 and 5');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ratings');
    }
};
