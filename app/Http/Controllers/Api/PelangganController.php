<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Pelanggan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redis;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class PelangganController extends Controller
{
    //
    function regist(Request $request){
        $validator = Validator::make($request->all(), [
            'nik' => 'required',
            'nama' => 'required',
            'tanggal_lahir' => 'required',
            'alamat' => 'required',
            'no_hp' => 'required',
            'email' => 'required',
            'password' => 'required',
        ]);

        if($validator->fails()){
            return response($this->responses(false, implode(",", $validator->messages()->all())), 400);
        }

        $check_nik = Pelanggan::where('nik', $request->email);
        if($check_nik->count() > 0){
            return response($this->responses(false, 'Nik address already exist.'), 409);
        }

        $check_email = Pelanggan::where('email', $request->email);
        if($check_email->count() > 0){
            return response($this->responses(false, 'Nik address already exist.'), 409);
        }

        $token = $this->generateToken();

        $insert = Pelanggan::create([
            'nik' => $request->nik,
            'nama' => $request->nama,
            'tanggal_lahir' => $request->tanggal_lahir,
            'alamat' => $request->alamat,
            'no_hp' => $request->no_hp,
            'email' => $request->email,
            'password' => sha1(md5($request->password)),
            'token' => $token
        ]);

        return $this->responses(true, 'Success for registry the account');
    }

    function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required',
            'password' => 'required',
        ]);

        if($validator->fails()){
            return response($this->responses(false, implode(",", $validator->messages()->all())), 400);
        }

        $pelanggan = Pelanggan::where('email', $request->email)->where('password', sha1(md5($request->password)));
        if($pelanggan->count() == 0){
            return response($this->responses(false, 'Invalid username or password.'), 401);
        }

        return $this->responses(true, 'Login successfull', $pelanggan->get());
    }

    function generateToken(){
        $token = Str::random(30);
        $check_token = Pelanggan::where('token', $token);

        if($check_token->count() > 0){
            return $this->generateToken();
        }

        return $token;
    }

    function responses($status, $message, $data = array()){
        return json_encode(array(
            'status' => $status,
            'message' => $message,
            'data' => $data
        ));
    }
}
