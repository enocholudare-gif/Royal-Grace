<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('caregivers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained('users')->cascadeOnDelete()->cascadeOnUpdate();
            $table->string('address_line_1', 150);
            $table->string('address_line_2', 150)->nullable();
            $table->string('city', 100);
            $table->string('state', 100);
            $table->string('postal_code', 20);
            $table->string('country', 100);
            $table->json('certifications')->nullable();
            $table->string('emergency_contact_name', 150);
            $table->string('emergency_contact_phone', 30);
            $table->text('bio')->nullable();
            $table->decimal('average_rating', 3, 2)->default(0);
            $table->decimal('attendance_score', 5, 2)->default(100);
            $table->boolean('is_available')->default(true);
            $table->enum('status', ['active', 'inactive', 'suspended'])->default('active');
            $table->timestamps();
            $table->index(['status', 'is_available']);
            $table->index('average_rating');
            $table->index(['city', 'state']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('caregivers');
    }
};
