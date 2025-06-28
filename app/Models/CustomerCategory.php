<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CustomerCategory extends Model
{
    //
    use HasFactory;
    use SoftDeletes;

    protected $table = 'customer_category';
    protected $primaryKey = 'id';

    protected $fillable = [
        'nama'
    ];

    public function harga(){
        return $this->hasMany(Harga::class, 'customer_category', 'id');
    }
}
