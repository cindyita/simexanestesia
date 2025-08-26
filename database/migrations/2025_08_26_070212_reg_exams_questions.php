<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('reg_exams_questions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_exam')->constrained('reg_exams')->onDelete('cascade');
            $table->text('question'); // La pregunta
            $table->enum('question_type', ['multiple_choice', 'true_false', 'essay','other'])->default('multiple_choice');
            
            // Opciones de respuesta (JSON para flexibilidad)
            $table->json('options')->nullable(); // Para multiple choice: ["A", "B", "C", "D"]
            $table->json('correct_answers'); // Respuestas correctas (puede ser múltiple)
            $table->text('explanation')->nullable(); // Explicación de la respuesta correcta
            
            // Configuración
            $table->integer('order')->default(0); // Orden de la pregunta en el examen
            
            // Multimedia (opcional)
            $table->string('image_path')->nullable(); // Ruta de imagen si la pregunta la incluye
            $table->string('audio_path')->nullable(); // Ruta de audio si la pregunta lo incluye
            
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            
            // Índices
            $table->index(['id_exam', 'order']);
            $table->index(['id_exam', 'is_active']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('reg_exams_questions');
    }
};
