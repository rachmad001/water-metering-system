<?php

namespace App\Http\Controllers\Api;

use App\Models\DataDevice;
use App\Models\device;
use App\Models\Pelanggan;
use App\Http\Controllers\Controller;
use App\Models\Harga;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Validator;
use CURLFile;
use Illuminate\Support\Facades\DB;

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

    function editDevice(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nama' => 'required',
            'alamat' => 'required',
            'nik' => 'required',
            'id' => 'required',
            'harga' => 'required|exists:customer_category,id'
        ]);

        if ($validator->fails()) {
            return response($this->responses(false, implode(",", $validator->messages()->all())), 400);
        }

        $data_updated = [
            'nama' => $request->nama,
            'alamat' => $request->alamat,
            'nik' => $request->nik,
            'category' => $request->harga
        ];

        $check_nik = Pelanggan::where('nik', $request->nik);
        if ($check_nik->count() == 0) {
            return response($this->responses(false, 'Nik not found'), 404);
        }

        if (device::where('id', $request->id)->count() == 0) {
            return response($this->responses(false, 'id tidak ditemukan'), 404);
        }

        $inserts = device::where('id', $request->id)->update($data_updated);

        return $this->responses(true, 'Device successusfully updated');
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

        $data = device::with('pelanggan', 'kategori');

        if ($search != NULL) {
            $data->where('id', 'LIKE', '%' . $search . '%')
                ->orWhere('nama', 'LIKE', '%' . $search . '%')
                ->orWhere('alamat', 'LIKE', '%' . $search . '%')
                ->orWhere('nik', 'LIKE', '%' . $search . '%');
            // $data->where(function ($query) use ($search) {
            //     $query->where('id', 'LIKE', '%' . $search . '%')
            //         ->orWhere('nama', 'LIKE', '%' . $search . '%')
            //         ->orWhere('alamat', 'LIKE', '%' . $search . '%')
            //         ->orWhere('nik', 'LIKE', '%' . $search . '%');
            // });
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

    function edit_data_device(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'status' => 'required',
            'value' => 'required',
            'id' => 'required'
        ]);

        if ($validator->fails()) {
            return response($this->responses(false, implode(",", $validator->messages()->all())), 400);
        }

        $data_device = DataDevice::where('id', $request->id);
        if ($data_device->count() == 0) {
            return response($this->responses(false, 'id tidak ditemukan'), 404);
        }

        $update = $data_device->update([
            'value' => $request->value,
            'is_paid' => $request->status
        ]);

        return $this->responses(true, 'Berhasil memperbarui data');
    }

    function getBill($tokenDevice, $id)
    {
        $device = device::where('token', $tokenDevice);
        if ($device->count() == 0) {
            return response($this->responses(false, "device tidak ditemukan"), 404);
        }

        $device = $device->get()[0];

        if (DataDevice::where('id', $id)->where('device', $device->id)->count() == 0) {
            return response($this->responses(false, 'Data tidak ditemukan'), 404);
        }
        // $harga = $device->harga;
        $latest_payment = DataDevice::where('device', $device->id)->where('is_paid', 1)->where('id', '<', $id)->orderBy('created_at', 'desc')->first()?->value ?? 0;
        $latest_data = DataDevice::where('id', $id)->where('device', $device->id)->first()->value;
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

        return $this->responses(true, "Berhasil mendapatkan data", [
            'latest_data' => $latest_data,
            'latest_payment' => $latest_payment,
            'selisih' => $selisih_awal,
            'total' => $total
        ]);
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

    function data_admin_dashboard(Request $request)
    {
        $search = $request->get('search', NULL);
        $ordered = $request->get('order', NULL);
        $type_order = $request->get('type_order', NULL);
        $per_pages = $request->get('per_page', 10);

        // $latestData = DataDevice::from(DB::raw("(
        //         SELECT *, 
        //             ROW_NUMBER() OVER (PARTITION BY device ORDER BY id DESC) AS rn
        //         FROM data_device
        //         WHERE deleted_at IS NULL 
        //     ) as ranked_data"))
        //     ->join('device', 'device.id', '=', 'data_device.device')
        //     ->where('rn', 1)
        //     ->with(['list_paid' => function($query){
        //         $query->where('is_paid', 1);
        //     },'device.pelanggan']);

        $latestData = DataDevice::select('data_device.*')
            ->join(DB::raw(
                '
        (
            SELECT MAX(id) as id from data_device
            GROUP BY device
        ) AS rd'
            ), 'data_device.id', '=', 'rd.id')
            ->join('device as dd', 'dd.id', '=', 'data_device.device')
            ->with(['list_paid' => function ($query) {
                $query->where('is_paid', 1);
            }, 'device.pelanggan']);

        // $data_device = DataDevice::select(
        //     DB::raw('max(id) AS id'),
        //     'device',
        //     DB::raw('max(value) AS value'),
        //     'is_paid',
        //     DB::raw('max(images_source) AS images_source'),
        //     DB::raw('max(execution_time) AS execution_time'),
        //     DB::raw('MAX(created_at) as created_at')
        // );
        if ($search != NULL) {

            // $data_device->where(function ($query) use ($search) {
            //     $query->where('device', 'LIKE', '%' . $search . '%')
            //         ->orWhere('value', 'LIKE', '%' . $search . '%')
            //         ->orWhere('created_at', 'LIKE', '%' . $search . '%');
            // });
            $latestData = $latestData->where(function ($query) use ($search) {
                $query->where('device', 'LIKE', '%' . $search . '%')
                    ->orWhere('value', 'LIKE', '%' . $search . '%')
                    ->orWhere('data_device.created_at', 'LIKE', '%' . $search . '%');
            })
                ->orWhereHas('device.pelanggan', function ($query) use ($search) {
                    $query->where('nik', 'LIKE', '%' . $search . '%');
                });
            // ->orWhere('device.nik', 'LIKE', '%' . $search . '%');

            if ($ordered != NULL) {
                if ($ordered == 'nik') {
                    // $data_device->with(['device.pelanggan' => function ($query) use ($search, $type_order) {
                    //     $query->select('nik', 'nama')->where('nik', 'LIKE', '%' . $search . '%')->orderBy('nik', $type_order);
                    // }]);

                    $latestData = $latestData->orderBy('dd.nik', $type_order);
                } else {
                    // $data_device->with(['device.pelanggan' => function ($query) use ($search) {
                    //     $query->select('nik', 'nama')->where('nik', 'LIKE', '%' . $search . '%');
                    // }])->orderBy($ordered, $type_order);

                    $latestData = $latestData->orderBy($ordered, $type_order);
                }
            }
            // else {
            //     $data_device->with(['device.pelanggan' => function ($query) use ($search) {
            //         $query->select('nik', 'nama')->where('nik', 'LIKE', '%' . $search . '%');
            //     }]);

            // }
        } else {
            if ($ordered != NULL) {
                if ($ordered == 'nik') {
                    // $data_device->with(['device.pelanggan' => function ($query) use ($search, $type_order) {
                    //     $query->select('nik', 'nama')->orderBy('nik', $type_order);
                    // }]);

                    $latestData = $latestData->orderBy('dd.nik', $type_order);
                } else {
                    // $data_device->with(['device.pelanggan' => function ($query) use ($search) {
                    //     $query->select('nik', 'nama');
                    // }])->orderBy($ordered, $type_order);

                    $latestData = $latestData->orderBy($ordered, $type_order);
                }
            }
            // else {
            //     $data_device->with(['device.pelanggan' => function ($query) use ($search) {
            //         $query->select('nik', 'nama');
            //     }]);
            // }
        }

        // return $data_device->groupBy('device', 'is_paid')->paginate($per_pages);
        $paginated = $latestData->paginate($per_pages);
        $paginated->getCollection()->transform(function ($item) {
            $item->append('bill');
            // Append bill to the related models
            if ($item->relationLoaded('list_paid')) {
                $item->list_paid->transform(function ($paid) {
                    return $paid->append('bill');
                });
            }

            return $item;
        });

        return $paginated;
        // return $data_device->groupBy('device', 'is_paid')->get();
    }

    function data_customer_dashboard(Request $request)
    {
        $pelanggan = Pelanggan::where('token', $request->bearerToken())->first();
        $search = $request->get('search', NULL);
        $ordered = $request->get('order', NULL);
        $type_order = $request->get('type_order', NULL);
        $per_pages = $request->get('per_page', 10);

        // $data_device = DataDevice::select(
        //     DB::raw('max(id) AS id'),
        //     'device',
        //     DB::raw('max(value) AS value'),
        //     'is_paid',
        //     DB::raw('max(images_source) AS images_source'),
        //     DB::raw('max(execution_time) AS execution_time'),
        //     DB::raw('MAX(created_at) as created_at')
        // );

        $latestData = DataDevice::select('data_device.*')
            ->join(DB::raw(
                '
        (
            SELECT MAX(id) as id from data_device
            GROUP BY device

        ) AS rd'
            ), 'data_device.id', '=', 'rd.id')
            ->join('device as dd', 'dd.id', '=', 'data_device.device')
            ->with(['list_paid' => function ($query) {
                $query->where('is_paid', 1);
            }, 'device.pelanggan']);
        if ($search != NULL) {
            // $data_device->where(function ($query) use ($search) {
            //     $query->where('device', 'LIKE', '%' . $search . '%')
            //         ->orWhere('value', 'LIKE', '%' . $search . '%')
            //         ->orWhere('created_at', 'LIKE', '%' . $search . '%');
            // });

            $latestData = $latestData->where(function ($query) use ($search) {
                $query->where('device', 'LIKE', '%' . $search . '%')
                    ->orWhere('value', 'LIKE', '%' . $search . '%')
                    ->orWhere('data_device.created_at', 'LIKE', '%' . $search . '%');
            });

            if ($ordered != NULL) {
                // if ($ordered == 'nik') {
                //     $data_device->with(['device.pelanggan' => function ($query) use ($search, $type_order) {
                //         $query->select('nik', 'nama')->where('nik', 'LIKE', '%' . $search . '%')->orderBy('nik', $type_order);
                //     }]);
                // } else {
                //     $data_device->with(['device.pelanggan' => function ($query) use ($search) {
                //         $query->select('nik', 'nama')->where('nik', 'LIKE', '%' . $search . '%');
                //     }])->orderBy($ordered, $type_order);

                $latestData = $latestData->orderBy($ordered, $type_order);
            }
            // else {
            //     $data_device->with(['device.pelanggan' => function ($query) use ($search) {
            //         $query->select('nik', 'nama')->where('nik', 'LIKE', '%' . $search . '%');
            //     }]);
            // }
        } else {
            if ($ordered != NULL) {
                $latestData = $latestData->orderBy($ordered, $type_order);
            }
            // else {
            //     $data_device->with(['device.pelanggan' => function ($query) use ($search) {
            //         $query->select('nik', 'nama');
            //     }]);
            // }
        }

        // $data_device->whereHas('device', function ($query) use ($pelanggan) {
        //     $query->where('nik', $pelanggan->nik);
        // });

        $latestData = $latestData->whereHas('device', function ($query) use ($pelanggan) {
            $query->where('nik', $pelanggan->nik);
        });
        // return $data_device->groupBy('device', 'is_paid')->paginate($per_pages);
        return $latestData->paginate($per_pages);
        // return $data_device->groupBy('device', 'is_paid')->get();
    }

    function data_customer_dashboard_history(Request $request)
    {
        $pelanggan = Pelanggan::where('token', $request->bearerToken())->first();
        $search = $request->get('search', NULL);
        $ordered = $request->get('order', NULL);
        $type_order = $request->get('type_order', NULL);
        $per_pages = $request->get('per_page', 10);

        // $data_device = DataDevice::select(
        //     DB::raw('max(id) AS id'),
        //     'device',
        //     DB::raw('max(value) AS value'),
        //     'is_paid',
        //     DB::raw('max(images_source) AS images_source'),
        //     DB::raw('max(execution_time) AS execution_time'),
        //     DB::raw('MAX(created_at) as created_at')
        // );

        $latestData = DataDevice::select('data_device.*')
            ->join('device as dd', 'dd.id', '=', 'data_device.device')
            ->with('device.pelanggan')
            ->where('is_paid', 1);
        if ($search != NULL) {
            // $data_device->where(function ($query) use ($search) {
            //     $query->where('device', 'LIKE', '%' . $search . '%')
            //         ->orWhere('value', 'LIKE', '%' . $search . '%')
            //         ->orWhere('created_at', 'LIKE', '%' . $search . '%');
            // });

            $latestData = $latestData->where(function ($query) use ($search) {
                $query->where('device', 'LIKE', '%' . $search . '%')
                    ->orWhere('value', 'LIKE', '%' . $search . '%')
                    ->orWhere('data_device.created_at', 'LIKE', '%' . $search . '%');
            });

            if ($ordered != NULL) {
                // if ($ordered == 'nik') {
                //     $data_device->with(['device.pelanggan' => function ($query) use ($search, $type_order) {
                //         $query->select('nik', 'nama')->where('nik', 'LIKE', '%' . $search . '%')->orderBy('nik', $type_order);
                //     }]);
                // } else {
                //     $data_device->with(['device.pelanggan' => function ($query) use ($search) {
                //         $query->select('nik', 'nama')->where('nik', 'LIKE', '%' . $search . '%');
                //     }])->orderBy($ordered, $type_order);

                $latestData = $latestData->orderBy($ordered, $type_order);
            }
            // else {
            //     $data_device->with(['device.pelanggan' => function ($query) use ($search) {
            //         $query->select('nik', 'nama')->where('nik', 'LIKE', '%' . $search . '%');
            //     }]);
            // }
        } else {
            if ($ordered != NULL) {
                $latestData = $latestData->orderBy($ordered, $type_order);
            }
            // else {
            //     $data_device->with(['device.pelanggan' => function ($query) use ($search) {
            //         $query->select('nik', 'nama');
            //     }]);
            // }
        }

        // $data_device->whereHas('device', function ($query) use ($pelanggan) {
        //     $query->where('nik', $pelanggan->nik);
        // });

        $latestData = $latestData->whereHas('device', function ($query) use ($pelanggan) {
            $query->where('nik', $pelanggan->nik);
        });
        // return $data_device->groupBy('device', 'is_paid')->paginate($per_pages);
        return $latestData->paginate($per_pages);
        // return $data_device->groupBy('device', 'is_paid')->get();
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
