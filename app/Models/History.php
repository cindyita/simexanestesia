<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class History extends Model
{
    protected $table = 'reg_history';

    protected $fillable = [
        'id',
        'id_user',
        'id_exam',
        'attempt_number',
        'status',
        'started_at',
        'completed_at',
        'time_used',
        'score',
        'correct_answers',
        'passed',
        'answers',
        'question_order',
        'ip_address',
        'user_agent',
        'metadata',
        'id_company'
    ];

    public function exam(){
        return $this->belongsTo(Exams::class, 'id_exam', 'id');
    }

}
