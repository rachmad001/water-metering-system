<?php

use App\Http\Controllers\Api\PelangganController;
use Illuminate\Support\Facades\Request;
use Illuminate\Support\Facades\Route;

// Route::get('/', function () {
//     return view('welcome');
// });
Route::post('login', [PelangganController::class, 'login']);
Route::get('view/{tokenDevice}', function($tokenDevice){
    return view('live.index', ['token'=>$tokenDevice]);
});
