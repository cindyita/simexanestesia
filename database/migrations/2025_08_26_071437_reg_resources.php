<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('reg_resources', function (Blueprint $table) {
            $table->id()->primary();
            $table->string('name', 255);
            $table->text('description')->nullable();
            
            // Relaciones
            $table->foreignId('id_subject')->constrained('reg_subjects')->onDelete('cascade');
            $table->foreignId('uploaded_by')->constrained('sys_users')->onDelete('cascade');
            
            // ----------------------------------------------------------------
            $table->string('file_path');
            $table->string('file_type', 10);
            $table->string('mime_type', 100);
            $table->bigInteger('file_size')->unsigned();
            
            $table->enum('resource_type', [
                'document', 
                'image', 
                'audio', 
                'video', 
                'presentation', 
                'spreadsheet',
                'archive',
                'other'
            ])->default('document');
            
            // Metadata adicional
            $table->json('metadata')->nullable();
            $table->integer('download_count')->default(0);
            $table->integer('view_count')->default(0);
            
            // -----------------------------------------------
            $table->string('visibility')->default('public');
            $table->boolean('is_active')->default(true);
    
            $table->json('tags')->nullable();

            $table->unsignedBigInteger('id_company');
            
            $table->timestamps();
            
            // Índices
            $table->index(['id_company']);
            $table->index(['id_subject', 'is_active']);
            $table->index(['resource_type', 'visibility']);
            $table->index(['file_type']);
            $table->index(['uploaded_by']);
            $table->index(['is_active']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('reg_resources');
    }
};
