<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement("CREATE OR REPLACE VIEW view_resources_stats AS
        SELECT 
            r.id_company,
            r.resource_type,
            r.visibility,
            COUNT(r.id) AS total_resources,
            SUM(r.download_count) AS total_downloads,
            SUM(r.view_count) AS total_views
        FROM reg_resources r
        GROUP BY r.id_company, r.resource_type, r.visibility;
        ");

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement("DROP VIEW IF EXISTS view_resources_stats");
    }
};