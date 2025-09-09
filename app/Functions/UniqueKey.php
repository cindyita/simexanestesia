<?php

namespace App\Functions;

use Illuminate\Support\Facades\DB;

class UniqueKey
{
    public static function getUniqueKey(string $email, int $id, int $length = 10): string
    {
        $time = microtime(true) * 10000;
        $random = random_int(1000, 9999);
        $seed = $id . $email . $time . $random;
        $hash = sha1($seed);
        $decimal = hexdec(substr($hash, 0, 15));
        $key = strtoupper(base_convert($decimal, 10, 36));
        return substr($key, 0, $length);
    }
}