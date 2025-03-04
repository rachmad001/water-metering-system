<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Admin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class AdminController extends Controller
{
    //
    function register(Request $request){
        $validator = Validator::make($request->all(), [
            'passsuperadmin' => 'required',
            'nama' => 'required',
            'nipn' => 'required',
            'nohp' => 'required',
            'email' => 'required',
            'password' => 'required',
            'wilayah_kerja' => 'required'
        ]);

        if($validator->fails()){
            return response($this->responses(false, implode(",", $validator->messages()->all())), 400);
        }

        if($request->passsuperadmin != env('SUPERADMIN_PASS')){
            return response($this->responses(false, 'restricted access'), 403);
        }

        $check_email = Admin::where('email', $request->email);
        if($check_email->count() > 0){
            return response($this->responses(false, 'Email address already exist.'), 409);
        }

        $token = $this->generateToken();
        $inserts = Admin::create([
            'nama' => $request->nama,
            'nipn' => $request->nipn,
            'nohp' => $request->nohp,
            'email' => $request->email,
            'password' => sha1(md5($request->password)),
            'wilayah_kerja' => $request->wilayah_kerja,
            'token' => $token
        ]);

        return $this->responses(true, 'Success for registry the account');
    }

    function login(Request $request){
        $validator = Validator::make($request->all(), [
            'email' => 'required',
            'password' => 'required'
        ]);

        if($validator->fails()){
            return response($this->responses(false, implode(",", $validator->messages()->all())), 400);
        }

        $admin = Admin::where('email', $request->email)->where('password', sha1(md5($request->password)));

        if($admin->count() == 0){
            return response($this->responses(false, 'Invalid username or password.'), 401);
        }

        return $this->responses(true, 'Login successful', $admin->get());
    }

    function generateToken(){
        $token = Str::random(30);
        $check_token = Admin::where('token', $token);

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
