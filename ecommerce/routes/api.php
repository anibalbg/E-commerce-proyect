<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\AdminUserController;
use App\Http\Controllers\CategoryController;
use App\Http\Middleware\IsAdmin;

//  Test route
Route::get('/ping', fn() => response()->json(['message' => 'API working']));

//  Rutas públicas
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',    [AuthController::class, 'login']);

//  Rutas protegidas
Route::middleware('auth:sanctum')->group(function () {

    // Perfil del usuario
    Route::get('/me', fn(\Illuminate\Http\Request $request) => $request->user());

    // Logout
    Route::post('/logout', function (\Illuminate\Http\Request $request) {
        $request->user()->tokens()->delete();
        return response()->json(['message' => 'Logged out']);
    });

    
    // 📦 Categorías
   
    Route::get('/categories', [CategoryController::class, 'index']);

    
    //  Productos
    
    Route::get('/products',      [ProductController::class, 'index']);
    Route::get('/products/{id}', [ProductController::class, 'show']);

   
    //  Carrito
    
    Route::get('/cart',                [CartController::class, 'index']);
    Route::post('/cart/add',           [CartController::class, 'add']);
    Route::delete('/cart/remove/{id}', [CartController::class, 'remove']);
    Route::delete('/cart/clear',       [CartController::class, 'clear']);

    
    //  Pedidos 
    
    Route::get('/orders',         [OrderController::class, 'index']);
    Route::post('/orders',        [OrderController::class, 'store']);
    Route::get('/orders/{id}',    [OrderController::class, 'show']);
    Route::delete('/orders/{id}', [OrderController::class, 'destroy']);

    
    // ZONA ADMIN 
    
    Route::middleware(IsAdmin::class)->group(function () {

        
        Route::post('/products',             [ProductController::class, 'store']);
        Route::put('/products/{id}',         [ProductController::class, 'update']);
        Route::delete('/products/{id}',      [ProductController::class, 'destroy']);
        Route::put('/products/{id}/restock', [ProductController::class, 'restock']);

        
        Route::get('/admin/users',               [AdminUserController::class, 'index']);
        Route::patch('/admin/users/{user}/role', [AdminUserController::class, 'updateRole']);

        
        Route::get('/admin/orders',      [OrderController::class, 'adminIndex']);
        Route::get('/admin/orders/{id}', [OrderController::class, 'adminShow']);
        Route::put('/admin/orders/{id}', [OrderController::class, 'update']);
    });

});
