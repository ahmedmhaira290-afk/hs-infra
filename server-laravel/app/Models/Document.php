<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Document extends Model
{
    protected $fillable = [
        'reference', 'employee_id', 'template_id', 'content',
        'html_content', 'employee_name', 'document_type',
    ];

    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }

    public function template()
    {
        return $this->belongsTo(Template::class);
    }
}
