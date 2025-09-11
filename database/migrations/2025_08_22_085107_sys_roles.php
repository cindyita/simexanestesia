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
        Schema::create('sys_roles', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->unsignedTinyInteger('mode_admin')->default(0);
            $table->unsignedBigInteger('id_company')->index();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sys_roles');
    }
};
