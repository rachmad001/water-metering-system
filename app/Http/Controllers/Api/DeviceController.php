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
            $files = $request->file('imageFile');
            $files->move(public_path($tokenDevice), 'live.jpg');

            $original_date = time();
            $tanggal = date("Y-m-d_H-i-s", $original_date);
            $filesNameOCR = $tanggal . '-ocr.' . $files->getClientOriginalExtension();
            copy(public_path($tokenDevice . '/live.jpg'), public_path($tokenDevice . '/' . $filesNameOCR));

            $response = shell_exec('py ' . public_path('gemini.py') . ' ' . $tokenDevice . '/' . $filesNameOCR);
            $response = json_decode($response);

            unlink(public_path($tokenDevice . '/' . $filesNameOCR));

            if ($response->text != "") {
                $tanggal = date("Y-m-d_H-i-s", $original_date);
                $available_data = DataDevice::where('device', $device->first()->id)->whereDate('created_at', '=', date("Y-m-d", $original_date))->where('value', '=', $response->text);
                if ($available_data->count() == 0) {
                    $filesName = $tanggal . '.' . $files->getClientOriginalExtension();
                    copy(public_path($tokenDevice . '/live.jpg'), public_path($tokenDevice . '/' . $filesName));
                    $inserts = DataDevice::create([
                        'device' => $device->first()->id,
                        'value' => $response->text,
                        'images_source' => $tokenDevice . '/' . $filesName,
                        'execution_time' => $response->execution_time
                    ]);
                }
                return $this->responses(true, 'Data received successfully, the value is ' . $response->text);
            } else {
                return $this->responses(false, 'Data read the number fail');
            }
            // $imagePath = $request->file('imageFile')->getPathname();
            // $imageName = $tokenDevice.'_'.$request->file('imageFile')->getClientOriginalName();

            // $curl = curl_init();

            // $postData = [
            //     'image' => new CURLFile($imagePath, $request->file('imageFile')->getMimeType(), $imageName)
            // ];

            // curl_setopt_array($curl, [
            //     CURLOPT_URL => env('OCR_URL') . "/api/ocr/", // Adjust API endpoint
            //     CURLOPT_RETURNTRANSFER => true,
            //     CURLOPT_POST => true,
            //     CURLOPT_POSTFIELDS => $postData,
            // ]);

            // $response = curl_exec($curl);
            // $err = curl_error($curl);

            // curl_close($curl);

            // if ($err) {
            //     return response()->json(['success' => false, 'message' => 'cURL Error: ' . $err], 500);
            // } else {
            //     $response = json_decode($response);
            //     if ($response->text != "") {
            //         $tanggal = date("Y-m-d_H-i-s");
            //         $available_data = DataDevice::where('device', $device->first()->id)->whereDate('created_at', '=', $tanggal)->where('value', '=', $response->text);
            //         if ($available_data->count() == 0) {
            //             $files = $request->file('imageFile');
            //             $filesName = $tanggal . '.' . $files->getClientOriginalExtension();
            //             $files->move(public_path($tokenDevice), $filesName);
            //             $inserts = DataDevice::create([
            //                 'device' => $device->first()->id,
            //                 'value' => $response->text,
            //                 'images_source' => $tokenDevice . '/' . $filesName,
            //                 'execution_time' => $response->execution_time
            //             ]);

            //             copy(public_path($tokenDevice . '/' . $filesName), public_path($tokenDevice . '/live.jpg'));
            //         }
            //         return $this->responses(true, 'Data received successfully, the value is ' . $response->text);
            //     } else {
            //         $files = $request->file('imageFile');
            //         $files->move(public_path($tokenDevice), 'live.jpg');
            //         return $this->responses(false, 'Data read the number fail');
            //     }
            // }
        } else {
            return response($this->responses(false, 'imageFile not found'), 400);
        }
    }

    function addLivePictures(string $tokenUser, string $tokenDevice, Request $request)
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
            $files = $request->file('imageFile');
            $files->move(public_path($tokenDevice), 'live.jpg');
            return $this->responses(true, 'Success add live data');
        }
    }

    function list_all(Request $request)
    {
        $search = $request->get('search', NULL);
        $order = $request->get('order', NULL);
        $order_type = $request->get('type_order', NULL);
        $per_pages = $request->get('per_page', 10);

        $data = device::query();
        if ($search != NULL) {
            $data->where(function ($query) use ($search) {
                $query->where('id', 'LIKE', '%' . $search . '%')
                    ->orWhere('nama', 'LIKE', '%' . $search . '%')
                    ->orWhere('alamat', 'LIKE', '%' . $search . '%')
                    ->orWhere('nik', 'LIKE', '%' . $search . '%');
            });
        }

        if ($order != NULL) {
            $data->orderBy($order, $order_type);
        }

        return $data->paginate($per_pages);
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

    function get_all_data_device(Request $request)
    {
        $search = $request->get('search', NULL);
        $ordered = $request->get('order', NULL);
        $type_order = $request->get('type_order', NULL);
        $per_pages = $request->get('per_page', 10);

        $data_device = DataDevice::query();
        if ($search != NULL) {
            $data_device->where(function ($query) use ($search) {
                $query->where('device', 'LIKE', '%' . $search . '%')
                    ->orWhere('value', 'LIKE', '%' . $search . '%')
                    ->orWhere('created_at', 'LIKE', '%' . $search . '%');
            });

            if ($ordered != NULL) {
                if ($ordered == 'nik') {
                    $data_device->with(['device.pelanggan' => function ($query) use ($search, $type_order) {
                        $query->select('nik', 'nama')->where('nik', 'LIKE', '%' . $search . '%')->orderBy('nik', $type_order);
                    }]);
                } else {
                    $data_device->with(['device.pelanggan' => function ($query) use ($search) {
                        $query->select('nik', 'nama')->where('nik', 'LIKE', '%' . $search . '%');
                    }])->orderBy($ordered, $type_order);
                }
            } else {
                $data_device->with(['device.pelanggan' => function ($query) use ($search) {
                    $query->select('nik', 'nama')->where('nik', 'LIKE', '%' . $search . '%');
                }]);
            }
        } else {
            if ($ordered != NULL) {
                if ($ordered == 'nik') {
                    $data_device->with(['device.pelanggan' => function ($query) use ($search, $type_order) {
                        $query->select('nik', 'nama')->orderBy('nik', $type_order);
                    }]);
                } else {
                    $data_device->with(['device.pelanggan' => function ($query) use ($search) {
                        $query->select('nik', 'nama');
                    }])->orderBy($ordered, $type_order);
                }
            } else {
                $data_device->with(['device.pelanggan' => function ($query) use ($search) {
                    $query->select('nik', 'nama');
                }]);
            }
        }

        return $data_device->paginate($per_pages);
    }

    function edit_data_device(Request $request){
        $validator = Validator::make($request->all(), [
            'status' => 'required',
            'value' => 'required',
            'id' => 'required'
        ]);

        if($validator->fails()){
            return response($this->responses(false, implode(",", $validator->messages()->all())), 400);
        }

        $data_device = DataDevice::where('id', $request->id);
        if($data_device->count() == 0){
            return response($this->responses(false, 'id tidak ditemukan'), 404);
        }

        $update = $data_device->update([
            'value' => $request->value,
            'is_paid' => $request->status
        ]);

        return $this->responses(true, 'Berhasil memperbarui data');
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
