<?php
$dbPath = $argv[1] ?? 'server/database.sqlite';
$db = new PDO("sqlite:$dbPath");
$tables = $db->query("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name");
echo "=== $dbPath ===\n";
foreach ($tables as $t) {
    echo $t['name'] . "\n";
}
