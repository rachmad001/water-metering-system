<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Harga extends Model
{
    //
    use HasFactory;
    use SoftDeletes;

    protected $table = 'harga';
    protected $primaryKey = 'id';

    protected $fillable = [
        'min',
        'max',
        'harga',
        'device'
    ];
}
