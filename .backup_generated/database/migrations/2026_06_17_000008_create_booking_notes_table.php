<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('booking_notes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('booking_id')->constrained('bookings')->cascadeOnDelete()->cascadeOnUpdate();
            $table->foreignId('author_user_id')->constrained('users')->cascadeOnDelete()->cascadeOnUpdate();
            $table->enum('note_type', ['care_instruction', 'internal', 'family', 'system'])->index();
            $table->text('content');
            $table->boolean('is_visible_to_family')->default(false);
            $table->timestamps();
            $table->index('booking_id');
            $table->index('author_user_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('booking_notes');
    }
};
