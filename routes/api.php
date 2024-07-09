<?php

use App\Http\Controllers\Authentication\AuthController;
use App\Http\Controllers\Authentication\RoleController;
use Illuminate\Support\Facades\Route;




Route::get('/', function(){
    return "Welcome to ".config('app.name')." (Application Programming Interface)";
});

// Unauthenticates routes
Route::post('auth/login', [AuthController::class, 'login']);

// Authenticated routes
Route::group([
    'middleware' => ['auth:sanctum'],
], function () {
    Route::group(['prefix' => 'auth'], function () {
        Route::group(['prefix' => 'role'], function () {
            Route::post('/', [RoleController::class, 'createRole']);
            Route::get('/', [RoleController::class, 'viewRole']);
            Route::put('/{role_id}', [RoleController::class, 'editRole']);
            Route::delete('/{role_id}', [RoleController::class, 'deleteRole']);
        });
    });
});