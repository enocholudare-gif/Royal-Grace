<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('messages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('conversation_id')->constrained('conversations')->cascadeOnDelete()->cascadeOnUpdate();
            $table->foreignId('sender_user_id')->constrained('users')->cascadeOnDelete()->cascadeOnUpdate();
            $table->text('body')->nullable();
            $table->enum('message_type', ['text', 'attachment', 'system'])->default('text')->index();
            $table->timestamp('sent_at')->useCurrent();
            $table->timestamps();
            $table->index(['conversation_id', 'sent_at']);
            $table->index('sender_user_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('messages');
    }
};
