<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Pelanggan extends Model
{
    //
    use SoftDeletes;
    protected $table = 'pelanggan';
    protected $primaryKey = 'nik';
    public $incrementing = false;

    protected $fillable = [
        'nik',
        'nama',
        'tanggal_lahir',
        'alamat',
        'no_hp',
        'email',
        'password',
        'token'
    ];
}
