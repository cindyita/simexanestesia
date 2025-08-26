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
        $res = self::whereNotNull('expire')
            ->where('expire', '<', Carbon::now())
            ->delete();
        
        activity('alert delete')
            ->causedBy(session('user')['id'])
            ->withProperties($res)
            ->event(session('user')['id_company'])
            ->log('Se depuraron las alertas expiradas');
    }

}
