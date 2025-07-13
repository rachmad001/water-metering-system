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
        'images_source',
        'execution_time'
    ];

    public function device(){
        return $this->hasOne(device::class, 'id', 'device');
    }

    public function pelanggan(){
        return $this->hasOneThrough(Pelanggan::class, device::class, 'nik', 'nik', 'device', 'id');
    }

    public function list_paid(){
        return $this->hasMany(DataDevice::class, 'device', 'device');
    }
}
