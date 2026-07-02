<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement("ALTER TABLE payments MODIFY provider ENUM('stripe', 'interac', 'paystack') NOT NULL DEFAULT 'paystack'");
        DB::statement("ALTER TABLE payments MODIFY currency CHAR(3) NOT NULL DEFAULT 'CAD'");
    }

    public function down(): void
    {
        DB::statement("ALTER TABLE payments MODIFY provider ENUM('stripe', 'interac') NOT NULL DEFAULT 'stripe'");
        DB::statement("ALTER TABLE payments MODIFY currency CHAR(3) NOT NULL DEFAULT 'CAD'");
    }
};
