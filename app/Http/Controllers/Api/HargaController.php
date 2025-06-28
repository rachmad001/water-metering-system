<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CustomerCategory;
use App\Models\Harga;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class HargaController extends Controller
{
    //
    function add(Request $request) {
        $validator = Validator::make($request->all(), [
            'nama' => 'required',
            'harga' => 'required'
        ]);

        if($validator->fails()){
            return response($this->responses(false, implode(",", $validator->messages()->all())), 400);
        }

        $inserts = CustomerCategory::create([
            'nama' => $request->nama
        ]);

        $harga = json_decode($request->harga, true);
        foreach($harga as $item){
            $item['customer_category'] = $inserts->id;
            $harga_create = Harga::create($item);
        }

        return $this->responses(true, 'Berhasil menambahkan data');
    }

    function get(Request $request){
        $search = $request->get('search', NULL);
        $ordered = $request->get('order', NULL);
        $type_order = $request->get('type_order', NULL);
        $per_pages = $request->get('per_page', 10);

        $data = CustomerCategory::query();
        if($search != NULL){
            $data = $data->where('nama', 'LIKE', '%'.$search.'%')
                    ->orWhereHas('harga', function($query) use($search){
                        $query->where('min', 'LIKE', '%'.$search.'%')
                        ->orWhere('max','LIKE', '%'.$search.'%')
                        ->orWhere('harga','LIKE', '%'.$search.'%');
                    });

            if($ordered != NULL){
                $data = $data->orderBy($ordered, $type_order);
            }
        }else {
            $data = $data->with('harga');
            if($ordered != NULL){
                $data = $data->orderBy($ordered, $type_order);
            }
        }

        return $data->paginate($per_pages);
    }

    function edit(Request $request){
        $validator = Validator::make($request->all(), [
            'nama' => 'required',
            'harga' => 'required',
            'id' => 'required|exists:customer_category,id'
        ]);

        if($validator->fails()){
            return response($this->responses(false, implode(",", $validator->messages()->all())), 400);
        }

        $inserts = CustomerCategory::where('id', $request->id)->update([
            'nama' => $request->nama
        ]);

        $delete_harga = Harga::where('customer_category', $request->id)->delete(); 

        $harga = json_decode($request->harga, true);
        foreach($harga as $item){
            $item['customer_category'] = $request->id;
            $harga_create = Harga::create($item);
        }
        return $this->responses(true, 'Berhasil memperbarui data');

    }

    function responses($status, $message, $data = array())
    {
        return json_encode(array(
            'status' => $status,
            'message' => $message,
            'data' => $data
        ));
    }
}
