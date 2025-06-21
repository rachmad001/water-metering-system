<?php

use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\DeviceController;
use App\Http\Controllers\Api\PelangganController;
use App\Http\Middleware\Admin;
use Illuminate\Support\Facades\Route;

Route::post('register', [AdminController::class, 'register']);
Route::post('login', [AdminController::class, 'login']);

Route::prefix('pelanggan')->middleware(Admin::class)->group(function(){
    Route::post('regist', [PelangganController::class, 'regist']);
    Route::post('login', [PelangganController::class, 'login']);
    Route::get('/', [PelangganController::class, 'list_pelanggan']);
    Route::put('/', [PelangganController::class, 'editProfile']);
});

Route::prefix('device')->middleware(Admin::class)->group(function(){
    Route::post('create', [PelangganController::class, 'addDevice']);
    Route::get('list', [DeviceController::class, 'list_all']);
    Route::put('edit', [DeviceController::class, 'editDevice']);
    Route::get('data-device/{tokenDevice}', [DeviceController::class, 'get_data']);
});

Route::prefix('data')->middleware(Admin::class)->group(function(){
    Route::get('/', [DeviceController::class, 'get_all_data_device']);
    Route::put('/', [DeviceController::class, 'edit_data_device']);
    Route::get('/dashboard', [DeviceController::class, 'data_admin_dashboard']);
});

