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
        Schema::create('sys_permissions', function (Blueprint $table) {
            $table->unsignedInteger('id_rol')->index();
            $table->unsignedInteger('id_menu');
            $table->unsignedInteger('level')->default(3);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sys_permissions');
    }
};
