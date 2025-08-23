<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;

use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::statement("CREATE VIEW view_role_permissions AS
            SELECT 
                r.id AS id_rol,
                r.name AS rol_name,
                r.id_company AS id_company,
                COALESCE(COUNT(p.id_menu), 0) AS total_menus,
                COALESCE(SUM(p.level), 0) AS total_levels
            FROM sys_roles r
            LEFT JOIN sys_permissions p ON r.id = p.id_rol
            GROUP BY r.id, r.name, r.id_company
        ");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('view_role_permissions');
    }
};
