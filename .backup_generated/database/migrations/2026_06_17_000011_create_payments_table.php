<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('booking_id')->nullable()->constrained('bookings')->nullOnDelete()->cascadeOnUpdate();
            $table->foreignId('invoice_id')->nullable()->constrained('invoices')->nullOnDelete()->cascadeOnUpdate();
            $table->foreignId('user_id')->constrained('users')->restrictOnDelete()->cascadeOnUpdate();
            $table->enum('provider', ['stripe', 'interac'])->default('stripe');
            $table->string('provider_payment_intent_id', 100)->nullable()->unique();
            $table->string('provider_charge_id', 100)->nullable()->unique();
            $table->decimal('amount', 12, 2);
            $table->char('currency', 3)->default('CAD');
            $table->enum('status', ['pending', 'processing', 'succeeded', 'failed', 'cancelled', 'refunded'])->default('pending');
            $table->enum('payment_type', ['one_time', 'invoice']);
            $table->text('failure_reason')->nullable();
            $table->timestamp('paid_at')->nullable()->index();
            $table->json('metadata')->nullable();
            $table->timestamps();
            $table->index('booking_id');
            $table->index('invoice_id');
            $table->index(['user_id', 'status']);
            $table->index(['provider', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
