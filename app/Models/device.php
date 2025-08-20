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
        'category',
        'default_meter',
        'token'
    ];

    public function pelanggan(){
        return $this->hasOne(Pelanggan::class, 'nik', 'nik');
    }

    public function data(){
        return $this->hasMany(DataDevice::class, 'device', 'id');
    }

    public function latest_bill(){
        return $this->hasOne(DataDevice::class, 'device', 'id')->where('is_paid', 0);
    }

    public function latest_paid() {
        return $this->hasOne(DataDevice::class, 'device', 'id')->where('is_paid', 1);
    }

    public function kategori() {
        return $this->hasOne(CustomerCategory::class, 'id', 'category');
    }
}
