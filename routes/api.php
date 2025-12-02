<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\KioskController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Kiosk API endpoints (public, no authentication)
Route::prefix('kiosk')->group(function () {
    Route::get('/config', [KioskController::class, 'getConfig']);
    Route::get('/slides', [KioskController::class, 'getSlides']);
    Route::get('/services', [KioskController::class, 'getServices']);
    Route::get('/running-text', [KioskController::class, 'getRunningText']);
    Route::post('/analytics/track', [KioskController::class, 'trackAnalytics']);
});
