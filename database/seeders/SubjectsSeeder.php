<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SubjectsSeeder extends Seeder
{
    public function run()
    {
        $subjects = [
            [
                'name' => 'Anatomía Humana',
                'code' => 'ANAT101',
                'description' => 'Estudio de la estructura del cuerpo humano.',
                'color' => '#FF5733',
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Fisiología',
                'code' => 'FISIO102',
                'description' => 'Funciones y procesos normales del cuerpo humano.',
                'color' => '#33C1FF',
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Farmacología',
                'code' => 'FARMA103',
                'description' => 'Estudio de los medicamentos y su aplicación en la medicina.',
                'color' => '#9B59B6',
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Anestesiología',
                'code' => 'ANES201',
                'description' => 'Principios y prácticas de la anestesia en procedimientos médicos y quirúrgicos.',
                'color' => '#28B463',
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Medicina Interna',
                'code' => 'MEDINT202',
                'description' => 'Diagnóstico y tratamiento de enfermedades en adultos.',
                'color' => '#E67E22',
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Cirugía General',
                'code' => 'CIRUG203',
                'description' => 'Fundamentos de cirugía y técnicas quirúrgicas.',
                'color' => '#C0392B',
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Urgencias Médicas',
                'code' => 'URGEN204',
                'description' => 'Atención y manejo de situaciones médicas de emergencia.',
                'color' => '#2ECC71',
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Cuidados Intensivos',
                'code' => 'UCI205',
                'description' => 'Manejo de pacientes críticos en unidades de terapia intensiva.',
                'color' => '#1ABC9C',
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        DB::table('reg_subjects')->insert($subjects);
    }
}
