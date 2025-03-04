<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Admin extends Model
{
    //
    protected $table = 'admin';
    protected $primaryKey = 'nipn';
    public $incrementing = false;

    protected $fillable = [
        'nama',
        'nipn',
        'nohp',
        'email',
        'password',
        'wilayah_kerja',
        'token'
    ];
}
