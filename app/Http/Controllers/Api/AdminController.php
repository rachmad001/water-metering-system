<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AdminController extends Controller
{
    //
    function register(Request $request){
        $validator = Validator::make($request->all(), [
            'passsuperadmin' => 'required',
            'nama' => 'required',
            'nip' => 'required',
            'nohp' => 'required',
            'email' => 'required',
            'password' => 'required'
        ]);

        if($validator->fails()){
            return response($this->responses(false, implode(",", $validator->messages()->all())), 401);
        }

        if($request->passsuperadmin != env('SUPERADMIN_PASS')){
            return response($this->responses(false, 'restricted access'), 403);
        }

        
    }

    function responses($status, $message, $data = array()){
        return json_encode(array(
            'status' => $status,
            'message' => $message,
            'data' => $data
        ));
    }
}
