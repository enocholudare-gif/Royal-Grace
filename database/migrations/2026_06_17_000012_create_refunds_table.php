<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('refunds', function (Blueprint $table) {
            $table->id();
            $table->foreignId('payment_id')->constrained('payments')->cascadeOnDelete()->cascadeOnUpdate();
            $table->foreignId('booking_id')->nullable()->constrained('bookings')->nullOnDelete()->cascadeOnUpdate();
            $table->foreignId('processed_by')->constrained('users')->restrictOnDelete()->cascadeOnUpdate();
            $table->decimal('amount', 12, 2);
            $table->text('reason')->nullable();
            $table->string('provider_refund_id', 100)->nullable()->unique();
            $table->enum('status', ['pending', 'processing', 'succeeded', 'failed'])->default('pending');
            $table->timestamp('processed_at')->nullable();
            $table->timestamps();
            $table->index('payment_id');
            $table->index('booking_id');
            $table->index('processed_by');
            $table->index(['status', 'processed_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('refunds');
    }
};
