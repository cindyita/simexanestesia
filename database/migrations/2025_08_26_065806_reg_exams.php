<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('reg_exams', function (Blueprint $table) {
            $table->id()->primary();
            $table->string('name', 200);
            $table->text('description')->nullable();
            $table->foreignId('id_subject')->constrained('reg_subjects')->onDelete('cascade');
            $table->foreignId('created_by')->constrained('sys_users')->onDelete('cascade');
            
            // Configuración del examen
            $table->integer('time_limit')->comment('Tiempo límite en minutos');
            $table->integer('total_questions')->default(0); // Se actualiza automáticamente
            $table->enum('exam_type', ['multiple_choice', 'true_false', 'essay', 'mixed','other'])->default('multiple_choice');
            $table->enum('difficulty', ['basic', 'intermediate', 'advanced'])->default('intermediate');
            
            // Configuración de calificación
            $table->decimal('passing_score', 5, 2)->default(70); // Puntuación mínima para aprobar
            $table->integer('max_attempts')->default(1); // Número máximo de intentos permitidos
            $table->boolean('shuffle_questions')->default(false); // Barajar preguntas
            $table->boolean('shuffle_options')->default(false); // Barajar opciones de respuesta
            
            // Control de disponibilidad
            $table->boolean('is_active')->default(true);
            $table->boolean('show_results')->default(true); // Mostrar resultados al terminar

            $table->unsignedBigInteger('id_company');
            
            $table->timestamps();
            
            // Índices
            $table->index(['id_subject', 'is_active']);
            $table->index(['id_company']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('reg_exams');
    }
};
