<?php

namespace App\Models;

use App\Http\Controllers\Api\DeviceController;
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

    public function getBillAttribute(){
        $device = device::where('id', $this->device);
        $device = $device->get()[0];

        $latest_payment = DataDevice::where('device', $device->id)->where('is_paid', 1)->where('id', '<', $this->id)->orderBy('created_at', 'desc')->first()?->value ?? 0;
        $latest_data = DataDevice::where('id', $this->id)->where('device', $device->id)->first()->value;
        if ($latest_payment > $latest_data) {
            $selisih = 100000 - $latest_payment;
            $latest_data = $latest_data + $selisih;
            $latest_payment = 0;
        }
        $selisih_awal = $latest_data - $latest_payment;
        $selisih = $latest_data - $latest_payment;
        $total = 0;

        $harga = Harga::where('customer_category', $device->category)->get();
        $index = 0;
        while ($selisih > 0 && $index < count($harga)) {
            if ($harga[$index]->max <= $selisih) {
                $total += $harga[$index]->max * $harga[$index]->harga;
                $selisih -= $harga[$index]->max;
            } else {
                $total += $selisih * $harga[$index]->harga;
                $selisih = 0;
            }
            $index++;
        }

        return [
            'latest_data' => $latest_data,
            'latest_payment' => $latest_payment,
            'selisih' => $selisih_awal,
            'total' => $total
        ];
    }
}
