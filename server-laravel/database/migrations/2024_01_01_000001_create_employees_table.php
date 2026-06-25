<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('employees', function (Blueprint $table) {
            $table->id();
            $table->string('first_name');
            $table->string('last_name');
            $table->string('civilite')->default('M.');
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->string('genre')->default('Masculin');
            $table->string('nationalite')->default('Marocaine');
            $table->string('ville')->default('Tanger');
            $table->string('position')->nullable();
            $table->string('department')->nullable();
            $table->string('agence')->nullable();
            $table->string('hire_date')->nullable();
            $table->string('salary')->nullable();
            $table->string('birth_date')->nullable();
            $table->string('birth_place')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('employees');
    }
};
