<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DataDevice;
use App\Models\device;
use App\Models\Pelanggan;
use CURLFile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redis;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class PelangganController extends Controller
{
    //
    function regist(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nik' => 'required',
            'nama' => 'required',
            'tanggal_lahir' => 'required',
            'alamat' => 'required',
            'no_hp' => 'required',
            'email' => 'required',
            'password' => 'required',
        ]);

        if ($validator->fails()) {
            return response($this->responses(false, implode(",", $validator->messages()->all())), 400);
        }

        $check_nik = Pelanggan::where('nik', $request->nik);
        if ($check_nik->count() > 0) {
            return response($this->responses(false, 'Nik already exist.'), 409);
        }

        $check_email = Pelanggan::where('email', $request->email);
        if ($check_email->count() > 0) {
            return response($this->responses(false, 'Email address already exist.'), 409);
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

        if ($validator->fails()) {
            return response($this->responses(false, implode(",", $validator->messages()->all())), 400);
        }

        $pelanggan = Pelanggan::where('email', $request->email)->where('password', sha1(md5($request->password)));
        if ($pelanggan->count() == 0) {
            return response($this->responses(false, 'Invalid username or password.'), 401);
        }

        return $this->responses(true, 'Login successfull', $pelanggan->get());
    }

    function list_pelanggan(Request $request)
    {
        $search = $request->get('search', NULL);
        $order = $request->get('order', NULL);
        $order_type = $request->get('type_order', NULL);
        $per_pages = $request->get('per_page', 10);

        $data = Pelanggan::query();
        if ($search != NULL) {
            $data->where(function ($query) use ($search) {
                $query->where('nik', 'LIKE', '%' . $search . '%')
                    ->orWhere('nama', 'LIKE', '%' . $search . '%')
                    ->orWhere('tanggal_lahir', 'LIKE', '%' . $search . '%')
                    ->orWhere('alamat', 'LIKE', '%' . $search . '%')
                    ->orWhere('no_hp', 'LIKE', '%' . $search . '%')
                    ->orWhere('email', 'LIKE', '%' . $search . '%');
            });
        }

        if ($order != NULL) {
            $data->orderBy($order, $order_type);
        }

        return $data->paginate($per_pages);
    }

    function addDevice(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nama' => 'required',
            'alamat' => 'required',
            'nik' => 'required'
        ]);

        if ($validator->fails()) {
            return response($this->responses(false, implode(",", $validator->messages()->all())), 400);
        }

        $check_nik = Pelanggan::where('nik', $request->nik);
        if ($check_nik->count() == 0) {
            return response($this->responses(false, 'Nik not found'), 404);
        }

        $token = $this->generateTokenDevice();
        $inserts = device::create([
            'nama' => $request->nama,
            'alamat' => $request->alamat,
            'nik' => $request->nik,
            'token' => $token
        ]);

        return $this->responses(true, 'Device successusfully registry');
    }

    function editProfile(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nama' => 'required',
            'tanggal_lahir' => 'required',
            'alamat' => 'required',
            'no_hp' => 'required',
            'nik' => 'required',
            'password' => 'nullable'
        ]);

        $password = $request->input('password', NULL);

        if ($validator->fails()) {
            return response($this->responses(false, implode(",", $validator->messages()->all())), 400);
        }

        $pelanggan = Pelanggan::where('nik', $request->nik);
        if ($pelanggan->count() == 0) {
            return response($this->responses(false, 'Nik tidak ditemukan'), 404);
        }

        if ($password != NULL) {
            $updates = $pelanggan->update([
                'nama' => $request->nama,
                'tanggal_lahir' => $request->tanggal_lahir,
                'alamat' => $request->alamat,
                'no_hp' => $request->no_hp,
                'password' => sha1(md5($password))
            ]);
        } else {
            $updates = $pelanggan->update([
                'nama' => $request->nama,
                'tanggal_lahir' => $request->tanggal_lahir,
                'alamat' => $request->alamat,
                'no_hp' => $request->no_hp
            ]);
        }


        return $this->responses(true, 'Berhasil memperbarui data');
    }

    function addDataDevice(string $tokenUser, string $tokenDevice, Request $request)
    {
        $user = Pelanggan::where('token', $tokenUser);
        if ($user->count() == 0) {
            return response($this->responses(false, 'Pelanggan is not found'), 404);
        }

        $device = device::where('token', $tokenDevice)->where('nik', $user->first()->nik);
        if ($device->count() == 0) {
            return response($this->responses(false, 'Device is not found or device is not match with the customer'), 404);
        }

        if ($request->hasFile('imageFile')) {
            $imagePath = $request->file('imageFile')->getPathname();
            $imageName = $request->file('imageFile')->getClientOriginalName();

            $curl = curl_init();

            $postData = [
                'image' => new CURLFile($imagePath, $request->file('imageFile')->getMimeType(), $imageName)
            ];

            curl_setopt_array($curl, [
                CURLOPT_URL => env('OCR_URL') . "/api/ocr/", // Adjust API endpoint
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_POST => true,
                CURLOPT_POSTFIELDS => $postData,
            ]);

            $response = curl_exec($curl);
            $err = curl_error($curl);

            curl_close($curl);

            if ($err) {
                return response()->json(['success' => false, 'message' => 'cURL Error: ' . $err], 500);
            } else {
                $response = json_decode($response);
                if ($response->text != "") {
                    $tanggal = date("Y-m-d");
                    $available_data = DataDevice::where('device', $device->first()->id)->whereDate('created_at', '=', $tanggal)->where('is_paid', '=', 0);
                    if ($available_data->count() > 0) {
                        unlink(public_path($available_data->first()->images_source));

                        $files = $request->file('imageFile');
                        $filesName = $tanggal . '.' . $files->getClientOriginalExtension();
                        $files->move(public_path($tokenDevice), $filesName);

                        $updates = $available_data->update([
                            'value' => $response->text,
                            'images_source' => $tokenDevice . '/' . $filesName
                        ]);
                    } else {
                        $files = $request->file('imageFile');
                        $filesName = $tanggal . '.' . $files->getClientOriginalExtension();
                        $files->move(public_path($tokenDevice), $filesName);
                        $inserts = DataDevice::create([
                            'device' => $device->first()->id,
                            'value' => $response->text,
                            'images_source' => $tokenDevice . '/' . $filesName
                        ]);
                    }

                    $files = $request->file('imageFile');
                    $files->move(public_path($tokenDevice), 'live.jpg');
                    return $this->responses(true, 'Data received successfully, the value is ' . $response->text);
                } else {
                    $files = $request->file('imageFile');
                    $files->move(public_path($tokenDevice), 'live.jpg');
                    return $this->responses(false, 'Data read the number fail');
                }
            }
        } else {
            return response($this->responses(false, 'imageFile not found'), 400);
        }
    }

    function generateToken()
    {
        $token = Str::random(30);
        $check_token = Pelanggan::where('token', $token);

        if ($check_token->count() > 0) {
            return $this->generateToken();
        }

        return $token;
    }

    function generateTokenDevice()
    {
        $token = Str::random(30);
        $check_token = device::where('token', $token);

        if ($check_token->count() > 0) {
            return $this->generateTokenDevice();
        }

        return $token;
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
