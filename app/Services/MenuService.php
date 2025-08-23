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

    // /**
    //  * Construye el menú jerárquico (si tienes parent_id en sys_menu)
    //  */
    // public function buildHierarchicalMenu($roleId, $companyId = null)
    // {
    //     $menuItems = $this->getMenuByRole($roleId, $companyId);
        
    //     // Si no tienes parent_id, retorna el menú plano
    //     return $menuItems;
        
    //     // Si tienes parent_id, aquí construirías la jerarquía
    //     // return $this->buildMenuTree($menuItems);
    // }

    // /**
    //  * Construye árbol de menú (para menús jerárquicos)
    //  */
    // private function buildMenuTree($items, $parentId = null)
    // {
    //     $tree = [];
        
    //     foreach ($items as $item) {
    //         if ($item->parent_id == $parentId) {
    //             $item->children = $this->buildMenuTree($items, $item->id);
    //             $tree[] = $item;
    //         }
    //     }
        
    //     return $tree;
    // }

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