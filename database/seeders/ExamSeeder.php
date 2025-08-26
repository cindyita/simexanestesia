<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ExamSeeder extends Seeder
{
    public function run()
    {
        // Crear el examen
        $examId = DB::table('reg_exams')->insertGetId([
            'name' => 'Fundamentos de medicina',
            'description' => 'Examen sobre conceptos básicos de medicina general.',
            'id_subject' => 1,
            'created_by' => 1,
            'time_limit' => 60, // 60 minutos
            'total_questions' => 10,
            'exam_type' => 'multiple_choice',
            'difficulty' => 'intermediate',
            'passing_score' => 70.00,
            'max_attempts' => 3,
            'shuffle_questions' => true,
            'shuffle_options' => true,
            'is_active' => true,
            'show_results' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Crear las preguntas
        $questions = [
            [
                'question' => '¿Cuál es el órgano encargado de bombear la sangre al resto del cuerpo?',
                'options' => [
                    'A) Pulmones',
                    'B) Hígado',
                    'C) Corazón',
                    'D) Riñones'
                ],
                'correct_answers' => ['C'],
                'explanation' => 'El corazón es el órgano encargado de bombear la sangre oxigenada a todo el cuerpo.',
                'order' => 1
            ],
            [
                'question' => '¿Cuál es la unidad funcional básica del riñón?',
                'options' => [
                    'A) Neurona',
                    'B) Alvéolo',
                    'C) Glomérulo',
                    'D) Nefrona'
                ],
                'correct_answers' => ['D'],
                'explanation' => 'La nefrona es la unidad funcional básica del riñón, responsable de filtrar la sangre y formar la orina.',
                'order' => 2
            ],
            [
                'question' => '¿En qué parte del sistema digestivo ocurre la mayor absorción de nutrientes?',
                'options' => [
                    'A) Estómago',
                    'B) Intestino delgado',
                    'C) Intestino grueso',
                    'D) Esófago'
                ],
                'correct_answers' => ['B'],
                'explanation' => 'La mayor absorción de nutrientes ocurre en el intestino delgado, principalmente en el yeyuno e íleon.',
                'order' => 3
            ],
            [
                'question' => '¿Qué tipo de células transportan oxígeno en la sangre?',
                'options' => [
                    'A) Glóbulos blancos',
                    'B) Glóbulos rojos',
                    'C) Plaquetas',
                    'D) Neutrófilos'
                ],
                'correct_answers' => ['B'],
                'explanation' => 'Los glóbulos rojos contienen hemoglobina, la cual transporta oxígeno a los tejidos.',
                'order' => 4
            ],
            [
                'question' => '¿Cuál es la principal función de los glóbulos blancos?',
                'options' => [
                    'A) Transportar oxígeno',
                    'B) Defender al cuerpo contra infecciones',
                    'C) Coagular la sangre',
                    'D) Almacenar energía'
                ],
                'correct_answers' => ['B'],
                'explanation' => 'Los glóbulos blancos forman parte del sistema inmune y protegen al cuerpo de infecciones.',
                'order' => 5
            ],
            [
                'question' => '¿Cuál de las siguientes estructuras pertenece al sistema respiratorio?',
                'options' => [
                    'A) Tráquea',
                    'B) Esófago',
                    'C) Páncreas',
                    'D) Hígado'
                ],
                'correct_answers' => ['A'],
                'explanation' => 'La tráquea es una estructura del sistema respiratorio que conduce aire hacia los pulmones.',
                'order' => 6
            ],
            [
                'question' => '¿Cuál es la función principal del hígado?',
                'options' => [
                    'A) Filtrar toxinas y producir bilis',
                    'B) Bombear sangre',
                    'C) Producir hormonas sexuales',
                    'D) Regular la respiración'
                ],
                'correct_answers' => ['A'],
                'explanation' => 'El hígado filtra sustancias tóxicas de la sangre, almacena glucógeno y produce bilis para la digestión de grasas.',
                'order' => 7
            ],
            [
                'question' => '¿Qué vitamina es necesaria para la coagulación sanguínea?',
                'options' => [
                    'A) Vitamina A',
                    'B) Vitamina C',
                    'C) Vitamina K',
                    'D) Vitamina D'
                ],
                'correct_answers' => ['C'],
                'explanation' => 'La vitamina K es esencial para la síntesis de factores de coagulación.',
                'order' => 8
            ],
            [
                'question' => '¿Cuál es el hueso más largo del cuerpo humano?',
                'options' => [
                    'A) Fémur',
                    'B) Húmero',
                    'C) Tibia',
                    'D) Radio'
                ],
                'correct_answers' => ['A'],
                'explanation' => 'El fémur es el hueso más largo y fuerte del cuerpo humano, localizado en el muslo.',
                'order' => 9
            ],
            [
                'question' => '¿Cuál es la presión arterial normal en un adulto sano?',
                'options' => [
                    'A) 120/80 mmHg',
                    'B) 140/90 mmHg',
                    'C) 100/60 mmHg',
                    'D) 160/100 mmHg'
                ],
                'correct_answers' => ['A'],
                'explanation' => 'La presión arterial considerada normal en adultos sanos es de 120/80 mmHg.',
                'order' => 10
            ]
        ];

        // Insertar las preguntas
        foreach ($questions as $questionData) {
            DB::table('reg_exams_questions')->insert([
                'id_exam' => $examId,
                'question' => $questionData['question'],
                'question_type' => 'multiple_choice',
                'options' => json_encode($questionData['options']),
                'correct_answers' => json_encode($questionData['correct_answers']),
                'explanation' => $questionData['explanation'],
                'order' => $questionData['order'],
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
