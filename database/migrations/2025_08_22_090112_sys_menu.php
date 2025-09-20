<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('sys_menu', function (Blueprint $table) {
            $table->id()->primary();
            $table->string('name');
            $table->string('icon');
            $table->string('url')->nullable();
            $table->integer('menu_level');
            $table->integer('id_parent');
            $table->integer('reg_order')->default(1);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sys_menu');
    }
};
