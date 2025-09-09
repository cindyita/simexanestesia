<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;

class MenuService
{

    public function getMenuByRole($roleId)
    {
        $query = DB::table('sys_menu as m')
            ->leftJoin('sys_permissions as p', function($join) use ($roleId) {
                $join->on('m.id', '=', 'p.id_menu')
                     ->where('p.id_rol', '=', $roleId);
            })
            ->select([
                'm.id',
                'm.name',
                'm.icon',
                'm.url',
                'm.menu_level',
                'm.id_parent',
                'm.reg_order',
                'p.level',
                DB::raw('CASE WHEN p.id_menu IS NOT NULL THEN 1 ELSE 0 END as has_permission')
            ])
            ->whereNotNull('p.id_menu')
            ->orderBy('m.reg_order');

        // if ($companyId) {
        //     $query->where('m.id_company', $companyId);
        // }

        return $query->get();
    }


    public function setMenuInSession($roleId) {
        $menu = $this->getMenuByRole($roleId);

        $menuById = $menu->keyBy('id')->toArray();

        session(['user_menu' => $menuById]);
        
        return $menuById;
    }


    public function getMenuFromSession()
    {
        return session('user_menu', []);
    }

    public function hasMenuPermission($menuId, $roleId)
    {
        return DB::table('sys_permissions')
            ->where('id_rol', $roleId)
            ->where('id_menu', $menuId)
            ->exists();
    }

    public function getPermissionLevel($menuId, $roleId)
    {
        return DB::table('sys_permissions')
            ->where('id_rol', $roleId)
            ->where('id_menu', $menuId)
            ->value('level');
    }
}