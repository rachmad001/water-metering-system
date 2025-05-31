<?php

namespace App\Http\Controllers\Api;

use App\Models\DataDevice;
use App\Models\device;
use App\Models\Pelanggan;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Validator;
use CURLFile;


class DeviceController extends Controller
{
    //
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
            $imageName = $tokenDevice.'_'.$request->file('imageFile')->getClientOriginalName();

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
                    $tanggal = date("Y-m-d_H-i-s");
                    $available_data = DataDevice::where('device', $device->first()->id)->whereDate('created_at', '=', $tanggal)->where('value', '=', $response->text);
                    if ($available_data->count() == 0) {
                        $files = $request->file('imageFile');
                        $filesName = $tanggal . '.' . $files->getClientOriginalExtension();
                        $files->move(public_path($tokenDevice), $filesName);
                        $inserts = DataDevice::create([
                            'device' => $device->first()->id,
                            'value' => $response->text,
                            'images_source' => $tokenDevice . '/' . $filesName,
                            'execution_time' => $response->execution_time
                        ]);

                        copy(public_path($tokenDevice . '/' . $filesName), public_path($tokenDevice . '/live.jpg'));
                    }
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

    function list_all(Request $request)
    {
        $query = device::query();

        if ($request->has('nama')) {
            $query->where('nama', 'like', '%' . $request->input('nama') . '%');
        }
        if ($request->has('nik')) {
            $query->where('nik', 'like', '%' . $request->input('nik') . '%');
        }
        if ($request->has('alamat')) {
            $query->where('alamat', 'like', '%' . $request->input('alamat') . '%');
        }

        return $query->paginate(10)->withQueryString();
    }

    function list_all_by_pelanggan(Request $request)
    {
        $token = $request->bearerToken();
        $user = Pelanggan::where('token', $token)->first();

        return device::where('nik', $user->nik)->paginate(10)->withQueryString();
    }

    function get_data(string $tokenDevice)
    {
        $device = device::where('token', $tokenDevice)->first();
        $data = DataDevice::query();
        $data->where('device', $device->id);

        return $data->paginate(10)->withQueryString();
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
