<?php
$db = new PDO('sqlite:C:\Users\Lenovo\OneDrive\commerce\server-laravel\database\database.sqlite');
echo "=== USERS ===\n";
$r = $db->query("SELECT id, name, first_name, email, role FROM users")->fetchAll(PDO::FETCH_ASSOC);
foreach ($r as $u) {
    echo "{$u['id']}. {$u['first_name']} {$u['name']} — {$u['email']} ({$u['role']})\n";
    // Check password
    $row = $db->query("SELECT password FROM users WHERE id = {$u['id']}")->fetch(PDO::FETCH_ASSOC);
    echo "   password hash: {$row['password']}\n";
}
echo "\n=== DOCUMENTS ===\n";
$count = $db->query("SELECT COUNT(*) FROM documents")->fetchColumn();
echo "Total: $count\n";
if ($count > 0) {
    $r = $db->query("SELECT id, reference, employee_name, document_type FROM documents ORDER BY id")->fetchAll(PDO::FETCH_ASSOC);
    foreach ($r as $d) echo "  {$d['id']}. {$d['reference']} — {$d['employee_name']} ({$d['document_type']})\n";
}
