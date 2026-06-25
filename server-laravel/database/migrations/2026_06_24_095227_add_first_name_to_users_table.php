<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('first_name')->nullable()->after('name');
        });

        DB::table('users')->where('email', 'Qettaribadr@gmail.com')->update(['first_name' => 'BADR']);
        DB::table('users')->where('email', 'ahmed.mhaira@uit.ac.ma')->update(['first_name' => 'AHMED']);
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('first_name');
        });
    }
};
