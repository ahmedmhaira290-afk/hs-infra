<?php
$db = new PDO('sqlite:server-laravel/database/database.sqlite');

$tables = ['users', 'employees', 'templates', 'documents', 'action_logs'];

foreach ($tables as $table) {
    echo "\n=== $table ===\n";
    $rows = $db->query("SELECT * FROM $table ORDER BY id DESC LIMIT 10");
    $cols = $db->query("PRAGMA table_info($table)")->fetchAll(PDO::FETCH_COLUMN, 1);
    echo implode(" | ", $cols) . "\n";
    echo str_repeat("-", 80) . "\n";
    foreach ($rows as $r) {
        $vals = array_map(fn($c) => substr($r[$c] ?? '', 0, 30), $cols);
        echo implode(" | ", $vals) . "\n";
    }
}
