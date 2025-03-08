<?php

use App\Http\Controllers\Api\PelangganController;
use Illuminate\Support\Facades\Route;

// Route::get('/', function () {
//     return view('welcome');
// });
Route::post('login', [PelangganController::class, 'login']);

Route::post('add-data-device/{tokenUser}/{tokenDevice}', [PelangganController::class, ]);