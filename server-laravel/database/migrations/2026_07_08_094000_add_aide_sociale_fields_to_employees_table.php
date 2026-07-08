<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('employees', function (Blueprint $table) {
            $table->decimal('cnss_remb', 12, 2)->nullable()->after('cnss');
            $table->decimal('montant_accorde', 12, 2)->nullable()->after('cnss_remb');
        });
    }

    public function down(): void
    {
        Schema::table('employees', function (Blueprint $table) {
            $table->dropColumn(['cnss_remb', 'montant_accorde']);
        });
    }
};
