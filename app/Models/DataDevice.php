<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class DataDevice extends Model
{
    //
    use SoftDeletes;
    protected $table = 'data_device';
    protected $primaryKey = 'id';
    
    protected $fillable = [
        'device',
        'value',
        'is_paid',
        'images_source'
    ];
}
