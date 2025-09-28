<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class ExamsQuestions extends Model
{
    protected $table = 'reg_exams_questions';

    protected $fillable = [
        'id',
        'id_exam',
        'question',
        'question_type',
        'options', //array
        'correct_answers', //array
        'explanation',
        'order',
        'image_path', //null
        'audio_path', //null
        'is_active',
        'created_at',
        'updated_at'
    ];


}
