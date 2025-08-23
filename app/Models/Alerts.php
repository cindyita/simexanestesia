<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Alerts extends Model
{
    protected $table = 'reg_alerts';

     protected $fillable = [
        'title',
        'type',
        'description',
        'id_company',
        'expire',
    ];

    /**
     * Borra todas las alertas expiradas.
     */
    public static function deleteExpired()
    {
        self::whereNotNull('expire')
            ->where('expire', '<', Carbon::now())
            ->delete();
    }

}
