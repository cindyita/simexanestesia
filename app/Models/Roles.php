<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Roles extends Model
{

    protected $table = 'sys_roles';

    protected $fillable = [
        'id',
        'name'
    ];
}