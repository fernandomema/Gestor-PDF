<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\DocumentController;
use App\Http\Controllers\userController;
use App\Http\Controllers\WorkspaceController;
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();

});

Route::get('/documents', [DocumentController::class, 'index'])->middleware('auth:api');
Route::get('/workspaces', [WorkspaceController::class, 'index'])->middleware('auth:api');
Route::post('/documents/upload', [DocumentController::class, 'upload']); 
Route::get('/documents/{document}', [DocumentController::class, 'show']);

Route::post('login', [userController::class, 'login']);

Route::post('register', [userController::class, 'register']);

// ->name('password.reset');
Route::post('forgot-password', [userController::class, 'forgot']);

Route::post('reset-password', [userController::class, 'reset']);

Route::get('get-data', [userController::class, 'show_info'])->middleware('auth:api');

Route::post('edit', [userController::class, 'edit'])->middleware('auth:api');

Route::get('logout', [userController::class, 'logout'])->middleware('auth:api');

Route::post('delete-account', [userController::class, 'delete'])->middleware('auth:api');

// endpoints workspace

Route::post('create-workspace', [WorkspaceController::class, 'store'])->middleware('auth:api');

Route::get('edit-workspace', [WorkspaceController::class, 'edit'])->middleware('auth:api');