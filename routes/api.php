<?php

use App\Http\Controllers\Api\DeviceController;
use App\Http\Controllers\Api\PelangganController;
use App\Http\Middleware\User;
use Illuminate\Support\Facades\Route;

// Route::get('/', function () {
//     return view('welcome');
// });
Route::post('login', [PelangganController::class, 'login']);

Route::post('add-data-device/{tokenUser}/{tokenDevice}', [DeviceController::class, 'addDataDevice']);
Route::post('add-live-pictures/{tokenUser}/{tokenDevice}', [DeviceController::class, 'addLivePictures']);

Route::get('list_device', [DeviceController::class, 'list_all_by_pelanggan'])->middleware(User::class);
Route::get('data-device/{tokenDevice}', [DeviceController::class, 'get_data'])->middleware(User::class);

//cek tagihan
Route::get('bill/{tokenDevice}/{id}', [DeviceController::class, 'getBill']);

Route::get('data-dashboard-customer', [DeviceController::class, 'data_customer_dashboard'])->middleware(User::class);
Route::get('data-dashboard-customer-history', [DeviceController::class, 'data_customer_dashboard_history'])->middleware(User::class);

