<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return redirect('/index.html');
});

Route::fallback(function () {
    if (str_starts_with(request()->path(), 'api/')) {
        return response()->json(['error' => 'Not Found'], 404);
    }
    return redirect('/index.html');
});
