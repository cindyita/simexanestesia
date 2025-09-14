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
        Schema::create('sys_company', function (Blueprint $table) {
            $table->id()->primary();
            $table->string('name');
            $table->longText('description');
            $table->string('title');
            $table->string('primary_color');
            $table->string('secondary_color');
            $table->string('tertiary_color');
            $table->string('font_color');
            $table->string('box_color');
            $table->string('text_color');
            $table->string('text_color_reverse');
            $table->string('style_type')->default(1);
            $table->string('logo');
            $table->string('url');
            $table->tinyInteger('use_uniquekeys')->default(0);
            $table->string('register_key');
            $table->unsignedBigInteger('id_rol_register')->index();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sys_company');
    }
};
