<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Company extends Model
{
    protected $table = 'sys_company';

    protected $fillable = [
        'id',
        'name',
        'description',
        'title',
        'primary_color',
        'secondary_color',
        'tertiary_color',
        'font_color',
        'box_color',
        'text_color',
        'text_color_reverse',
        'style_type',
        'logo',
        'icon',
        'url',
        'use_uniquekeys',
        'register_key',
        'id_rol_register',
        'created_at',
        'updated_at'
    ];

}
