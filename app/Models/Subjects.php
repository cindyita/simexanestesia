<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Subjects extends Model
{
    protected $table = 'reg_subjects';

    protected $fillable = [
        'id',
        'name',
        'code',
        'description',
        'color',
        'is_active',
        'id_company'
    ];


}
