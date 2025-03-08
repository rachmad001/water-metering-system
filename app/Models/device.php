<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class device extends Model
{
    //
    use SoftDeletes;
    protected $table = 'device';
    protected $primaryKey = 'id';

    protected $fillable = [
        'nama',
        'alamat',
        'nik',
        'token'
    ];
}
