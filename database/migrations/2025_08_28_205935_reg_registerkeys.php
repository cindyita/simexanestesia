<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
     public function up(): void
    {
        Schema::create('reg_registerkeys', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->text('note')->nullable();
            $table->string('email')->nullable();
            $table->unsignedBigInteger('id_company');
            $table->unsignedBigInteger('id_rol');
            $table->unsignedBigInteger('created_by')->nullable();
            $table->timestamp('created_at')->nullable();
            $table->timestamp('updated_at')->nullable();
            $table->unsignedBigInteger('used_by')->nullable();
            $table->timestamp('used_at')->nullable();

            // relaciones
            $table->foreign('id_company')->references('id')->on('sys_company')->onDelete('cascade');
            $table->foreign('id_rol')->references('id')->on('sys_roles')->onDelete('cascade');
            $table->foreign('created_by')->references('id')->on('sys_users')->onDelete('set null');
            $table->foreign('used_by')->references('id')->on('sys_users')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reg_registerkeys');
    }
};
