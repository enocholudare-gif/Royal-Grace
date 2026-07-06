<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('invoices', function (Blueprint $table) {
            if (!Schema::hasColumn('invoices', 'payment_method')) {
                $table->string('payment_method')->nullable()->after('status');
            }
            if (!Schema::hasColumn('invoices', 'bank_transfer_note')) {
                $table->text('bank_transfer_note')->nullable()->after('payment_method');
            }
            if (!Schema::hasColumn('invoices', 'payment_submitted_at')) {
                $table->timestamp('payment_submitted_at')->nullable()->after('bank_transfer_note');
            }
        });
    }

    public function down(): void
    {
        Schema::table('invoices', function (Blueprint $table) {
            $table->dropColumn(['payment_method', 'bank_transfer_note', 'payment_submitted_at']);
        });
    }
};
