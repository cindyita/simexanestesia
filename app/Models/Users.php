<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Users extends Model
{

    protected $table = 'sys_users';

    protected $fillable = [
        'id',
        'name',
        'email',
        'id_company',
        'id_rol',
        'email_verified_at',
        'created_at',
        'updated_at'
    ];
}
