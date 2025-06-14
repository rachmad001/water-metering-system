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

    public function pelanggan(){
        return $this->hasOne(Pelanggan::class, 'nik', 'nik');
    }

    public function data(){
        return $this->hasMany(DataDevice::class, 'device', 'id');
    }
}
