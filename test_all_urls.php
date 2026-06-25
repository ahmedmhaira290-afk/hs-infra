<?php
$urls = [
    'http://127.0.0.1:9000/api/ping',
    'http://127.0.0.1:9000/api/login',
    'http://127.0.0.1:9000/',
];
foreach ($urls as $url) {
    $c = curl_init($url);
    $body = ($url == 'http://127.0.0.1:9000/api/login') ? '{"email":"Qettaribadr@gmail.com","password":"0000"}' : null;
    $opts = [CURLOPT_RETURNTRANSFER => true, CURLOPT_TIMEOUT => 15];
    if ($body) { $opts[CURLOPT_POST] = true; $opts[CURLOPT_POSTFIELDS] = $body; $opts[CURLOPT_HTTPHEADER] = ['Content-Type: application/json']; }
    curl_setopt_array($c, $opts);
    $r = curl_exec($c);
    $code = curl_getinfo($c, CURLINFO_HTTP_CODE);
    $err = curl_error($c);
    curl_close($c);
    echo "$url => HTTP $code " . ($err ? "ERROR: $err" : (strlen($r) > 100 ? substr($r, 0, 100) . '...' : $r)) . "\n\n";
}
