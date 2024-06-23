<?php

use Illuminate\Support\Facades\Route;


Route::get('/', function(){
    return "Welcome to ".config('app.name')." (Application Programming Interface)";
});