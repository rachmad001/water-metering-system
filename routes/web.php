<?php

use App\Http\Controllers\Api\PelangganController;
use Illuminate\Support\Facades\Route;

// Route::get('/', function () {
//     return view('welcome');
// });
Route::post('login', [PelangganController::class, 'login']);
Route::get('view', function(){
    return view('live.index');
});
