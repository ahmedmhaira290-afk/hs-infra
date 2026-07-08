<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ActionLog extends Model
{
    protected $fillable = ['user_id', 'action', 'target_type', 'target_id', 'details'];

    protected $table = 'action_logs';

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
