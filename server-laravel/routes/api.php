<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\EmployeeController;
use App\Http\Controllers\Api\TemplateController;
use App\Http\Controllers\Api\DocumentController;
use App\Http\Controllers\Api\NotificationController;
use Illuminate\Support\Facades\Route;

Route::get('/ping', function () { return response()->json(['ok' => true]); });
Route::post('/fix-passwords', function () { \Illuminate\Support\Facades\DB::table('users')->where('email', 'Qettaribadr@gmail.com')->update(['password' => bcrypt('0000')]); \Illuminate\Support\Facades\DB::table('users')->where('email', 'ahmed.mhaira@uit.ac.ma')->update(['password' => bcrypt('0000')]); return response()->json(['fixed' => true]); });
Route::get('/debug-users', function () { $users = \Illuminate\Support\Facades\DB::table('users')->get(['id','email','first_name']); return response()->json($users); });
Route::post('/migrate', function () { \Illuminate\Support\Facades\Artisan::call('migrate --seed --force'); return response()->json(['output' => \Illuminate\Support\Facades\Artisan::output()]); });
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
