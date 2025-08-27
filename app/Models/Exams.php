<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Exams extends Model
{
    protected $table = 'reg_exams';

    protected $fillable = [
        'id',
        'name',
        'description',
        'id_subject',
        'created_by',
        'time_limit',
        'total_questions',
        'exam_type',
        'difficulty',
        'passing_score',
        'max_attempts',
        'shuffle_questions',
        'shuffle_options',
        'is_active',
        'show_results',
        'id_company'
    ];

    public function histories(){
        return $this->hasMany(History::class, 'id_exam', 'id');
    }

    public function subject(){
        return $this->belongsTo(Subjects::class, 'id_subject', 'id');
    }


}
