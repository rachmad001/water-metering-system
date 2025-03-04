<?php

use App\Http\Controllers\Api\AdminController;
use Illuminate\Support\Facades\Route;

Route::post('register', [AdminController::class, 'register']);
Route::post('login', [AdminController::class, 'login']);

Route::prefix('pelanggan')->middleware()->group(function(){
    // Route::post('create')
});
