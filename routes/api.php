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
