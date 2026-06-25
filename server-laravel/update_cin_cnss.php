<?php
$db = new PDO('sqlite:C:\Users\Lenovo\OneDrive\commerce\server-laravel\database\database.sqlite');
$db->exec("UPDATE employees SET cin='GN258778', cnss='254878795' WHERE id=1");
$db->exec("UPDATE employees SET cin='GN345678', cnss='345678901' WHERE id=2");
$db->exec("UPDATE employees SET cin='GN456789', cnss='456789012' WHERE id=3");
echo "Employees updated with CIN/CNSS\n";

// Seed templates (use insertOrIgnore)
$templates = [
    [1, 'Attestation de travail', 'Attestation de travail', true],
    [2, 'Attestation de salaire', 'Attestation de salaire', true],
    [3, 'Demande de prime', 'Demande de prime', true],
    [4, 'Certificat médical', 'Certificat médical', true],
    [5, "Demande d'avance", "Demande d'avance", true],
    [6, 'Certificat de travail', 'Certificat de travail', true],
    [7, 'Attestation de domiciliation irrévocable de salaire', 'Attestation de domiciliation irrévocable de salaire', true],
    [8, "Demande d'aide sociale", "Demande d'aide sociale", true],
    [9, 'Pièce de caisse dépense', 'Pièce de caisse dépense', true],
    [10, 'Demande prime', 'Demande prime', true],
    [11, 'Attestation de travail et salaire', 'Attestation de travail et salaire', true],
    [12, 'Attestation de travail en bonne et due forme', 'Attestation de travail en bonne et due forme', true],
];

// Re-run the seeder PHP file for templates only by using the seeder class
echo "Run: php artisan db:seed --class=DatabaseSeeder\n";
