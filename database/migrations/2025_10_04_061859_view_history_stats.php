<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement("CREATE OR REPLACE VIEW view_history_stats AS
        SELECT 
            h.id_company,
            DATE(h.completed_at) AS date,
            COUNT(h.id) AS exams_completed,
            ROUND(AVG(h.score), 2) AS avg_score
        FROM reg_history h
        WHERE h.status = 'completed'
        GROUP BY h.id_company, DATE(h.completed_at)
        ORDER BY DATE(h.completed_at);
        ");

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement("DROP VIEW IF EXISTS view_history_stats");
    }
};
