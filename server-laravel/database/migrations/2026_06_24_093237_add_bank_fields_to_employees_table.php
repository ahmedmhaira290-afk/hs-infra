<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('employees', function (Blueprint $table) {
            $table->string('bank_type')->nullable()->after('birth_place');
            $table->string('rib')->nullable()->after('bank_type');
            $table->string('bank_type_pro')->nullable()->after('rib');
            $table->string('rib_pro')->nullable()->after('bank_type_pro');
        });
    }

    public function down(): void
    {
        Schema::table('employees', function (Blueprint $table) {
            $table->dropColumn(['bank_type', 'rib', 'bank_type_pro', 'rib_pro']);
        });
    }
};
