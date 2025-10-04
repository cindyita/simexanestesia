<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement("CREATE OR REPLACE VIEW view_exam_stats AS
        SELECT 
            e.id AS id_exam,
            e.name AS exam_name,
            e.id_company,
            s.name AS subject_name,
            COUNT(h.id) AS total_attempts,
            COUNT(DISTINCT h.id_user) AS total_students,
            ROUND(AVG(h.score), 2) AS avg_score,
            SUM(CASE WHEN h.passed = 1 THEN 1 ELSE 0 END) AS passed_count,
            SUM(CASE WHEN h.passed = 0 THEN 1 ELSE 0 END) AS failed_count
        FROM reg_exams e
        LEFT JOIN reg_subjects s ON s.id = e.id_subject
        LEFT JOIN reg_history h ON h.id_exam = e.id
        GROUP BY e.id, e.name, e.id_company, s.name;
        ");

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement("DROP VIEW IF EXISTS view_exam_stats");
    }
};
