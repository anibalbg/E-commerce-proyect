<?php

use Illuminate\Support\Facades\Route;

// Web desactivado, sólo sirve la vista principal si quieres
Route::get('/', function () {
    return "Backend API funcionando";
});
