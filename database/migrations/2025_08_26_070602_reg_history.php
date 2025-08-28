<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('reg_history', function (Blueprint $table) {
            $table->id()->primary();
            $table->foreignId('id_user')->constrained('sys_users')->onDelete('cascade'); // Estudiante
            $table->foreignId('id_exam')->constrained('reg_exams')->onDelete('cascade');
            
            // Información del intento
            $table->integer('attempt_number')->default(1);
            $table->enum('status', ['in_progress', 'completed', 'abandoned', 'timed_out'])->default('in_progress');
            
            // Tiempos
            $table->timestamp('started_at');
            $table->timestamp('completed_at')->nullable();
            $table->integer('time_used')->nullable()->comment('Tiempo usado en minutos');
            
            // Resultados
            $table->decimal('score', 5, 2)->nullable()->comment('Puntuación en porcentaje (0-100)');
            $table->integer('correct_answers')->default(0);
            $table->boolean('passed')->nullable(); // Si aprobó o no
            
            // Respuestas del estudiante (JSON)
            $table->json('answers')->nullable(); // Estructura: {"question_id": "selected_answer", ...}
            $table->json('question_order')->nullable(); // Orden en que se presentaron las preguntas
            
            // Información adicional
            $table->string('ip_address', 45)->nullable(); // IP desde donde se realizó
            $table->text('user_agent')->nullable(); // Navegador usado
            $table->json('metadata')->nullable(); // Información adicional (configuración del examen al momento del intento)

            $table->unsignedBigInteger('id_company');
            
            $table->timestamps();
            
            // Índices
            $table->index(['id_company']);
            $table->index(['id_user', 'id_exam']);
            $table->index(['id_exam', 'status']);
            $table->index(['completed_at']);
            $table->unique(['id_user', 'id_exam', 'attempt_number']); // Evitar intentos duplicados
        });
    }

    public function down()
    {
        Schema::dropIfExists('reg_history');
    }
};
