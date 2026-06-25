<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\EmployeeController;
use App\Http\Controllers\Api\TemplateController;
use App\Http\Controllers\Api\DocumentController;
use App\Http\Controllers\Api\NotificationController;
use Illuminate\Support\Facades\Route;

Route::get('/ping', function () { return response()->json(['ok' => true]); });
Route::post('/migrate', function () { try { \Illuminate\Support\Facades\Artisan::call('optimize:clear'); \Illuminate\Support\Facades\Artisan::call('migrate:fresh --seed --force'); $o = \Illuminate\Support\Facades\Artisan::output(); return response()->json(['ok' => true, 'output' => $o]); } catch (\Throwable $e) { return response()->json(['ok' => false, 'error' => $e->getMessage()], 500); } });
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    Route::get('/users', [AuthController::class, 'list']);
    Route::put('/users/{id}', [AuthController::class, 'update']);
    Route::delete('/users/{id}', [AuthController::class, 'destroy']);

    Route::get('/employees', [EmployeeController::class, 'index']);
    Route::get('/employees/{id}', [EmployeeController::class, 'show']);
    Route::post('/employees', [EmployeeController::class, 'store']);
    Route::put('/employees/{id}', [EmployeeController::class, 'update']);
    Route::delete('/employees/{id}', [EmployeeController::class, 'destroy']);

    Route::get('/templates', [TemplateController::class, 'index']);
    Route::get('/templates/{id}', [TemplateController::class, 'show']);
    Route::post('/templates', [TemplateController::class, 'store']);
    Route::put('/templates/{id}', [TemplateController::class, 'update']);
    Route::delete('/templates/{id}', [TemplateController::class, 'destroy']);

    Route::get('/documents', [DocumentController::class, 'index']);
    Route::post('/documents/generate', [DocumentController::class, 'generate']);
    Route::delete('/documents/{id}', [DocumentController::class, 'destroy']);

    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::put('/notifications/{id}/read', [NotificationController::class, 'markAsRead']);
    Route::put('/notifications/read-all', [NotificationController::class, 'markAllAsRead']);
});
