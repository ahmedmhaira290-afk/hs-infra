<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('users')->where('email', 'Qettaribadr@gmail.com')
            ->update(['password' => Hash::make('0000')]);
        DB::table('users')->where('email', 'ahmed.mhaira@uit.ac.ma')
            ->update(['password' => Hash::make('0000')]);
    }

    public function down(): void
    {
    }
};
