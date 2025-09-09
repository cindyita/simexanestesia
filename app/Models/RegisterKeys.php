<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class RegisterKeys extends Model
{
    protected $table = 'reg_registerkeys';

    protected $fillable = [
        'id',
        'key',
        'note',
        'email',
        'id_company',
        'id_rol',
        'created_by',
        'created_at',
        'updated_at',
        'used_by',
        'used_at'
    ];

}
