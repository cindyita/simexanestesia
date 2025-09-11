<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Permissions extends Model
{
    protected $table = 'sys_permissions';

    protected $fillable = [
        'id',
        'id_rol',
        'id_menu',
        'level'
    ];

     public $timestamps = false;

}
