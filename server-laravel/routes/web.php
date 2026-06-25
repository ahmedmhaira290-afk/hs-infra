<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    $path = public_path('index.html');
    if (file_exists($path)) {
        return response(file_get_contents($path), 200)->header('Content-Type', 'text/html');
    }
    return response('Not found', 404);
});

Route::fallback(function () {
    if (str_starts_with(request()->path(), 'api/')) {
        return response()->json(['error' => 'Not Found'], 404);
    }
    return redirect('/index.html');
});
