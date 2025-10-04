<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement("CREATE OR REPLACE VIEW view_user_performance AS
        SELECT 
            u.id AS id_user,
            u.name AS user_name,
            u.id_company,
            COUNT(h.id) AS total_attempts,
            ROUND(AVG(h.score), 2) AS avg_score,
            SUM(CASE WHEN h.passed = 1 THEN 1 ELSE 0 END) AS passed_exams,
            SUM(CASE WHEN h.passed = 0 THEN 1 ELSE 0 END) AS failed_exams
        FROM sys_users u
        LEFT JOIN reg_history h ON h.id_user = u.id
        GROUP BY u.id, u.name, u.id_company;
        ");

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement("DROP VIEW IF EXISTS view_user_performance");
    }
};