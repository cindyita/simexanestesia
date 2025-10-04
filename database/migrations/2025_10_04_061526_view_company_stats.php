<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::statement("CREATE OR REPLACE VIEW view_company_stats AS
        SELECT 
            c.id AS id_company,
            c.name AS company_name,
            COUNT(DISTINCT u.id) AS total_users,
            COUNT(DISTINCT s.id) AS total_subjects,
            COUNT(DISTINCT e.id) AS total_exams,
            COUNT(DISTINCT r.id) AS total_resources,
            COUNT(DISTINCT h.id) AS total_exam_attempts
        FROM sys_company c
        LEFT JOIN sys_users u ON u.id_company = c.id
        LEFT JOIN reg_subjects s ON s.id_company = c.id
        LEFT JOIN reg_exams e ON e.id_company = c.id
        LEFT JOIN reg_resources r ON r.id_company = c.id
        LEFT JOIN reg_history h ON h.id_company = c.id
        GROUP BY c.id, c.name;
        ");

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement("DROP VIEW IF EXISTS view_company_stats");
    }
};
