<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Resources extends Model
{
    protected $table = 'reg_resources';

    protected $fillable = [
        'id',
        'name',
        'description',
        'id_subject',
        'uploaded_by',
        'file_path',
        'file_type',
        'resource_type',
        'metadata',
        'download_count',
        'view_count',
        'visibility',
        'is_active',
        'tags',
        'id_company',
        'created_at',
        'updated_at'
    ];

    public function subject(){
        return $this->belongsTo(Subjects::class, 'id_subject', 'id');
    }

}
