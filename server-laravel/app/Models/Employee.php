<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Employee extends Model
{
    protected $fillable = [
        'first_name', 'last_name', 'civilite', 'email', 'phone', 'genre',
        'nationalite', 'ville', 'position', 'department', 'agence',
        'hire_date', 'salary', 'birth_date', 'birth_place',
        'bank_type', 'rib', 'bank_type_pro', 'rib_pro', 'cin', 'cnss',
        'cnss_remb', 'montant_accorde',
    ];
}
