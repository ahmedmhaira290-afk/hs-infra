<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

// Update employees with CIN/CNSS
\App\Models\Employee::where('id', 1)->update(['cin' => 'GN258778', 'cnss' => '254878795']);
\App\Models\Employee::where('id', 2)->update(['cin' => 'GN345678', 'cnss' => '345678901']);
\App\Models\Employee::where('id', 3)->update(['cin' => 'GN456789', 'cnss' => '456789012']);
echo "Employees updated.\n";

// Re-seed templates using the seeder
$seeder = new Database\Seeders\DatabaseSeeder;
// Just seed templates - they use insertOrIgnore
$templates = [
    [1, 'Attestation de travail', 'Attestation de travail', true, "ATTESTATION DE TRAVAIL\n\nJe soussigné, M. BADR Qettari, né le 12/02/1990, Responsable des Ressources Humaines de la société HS-INFRA — Agence Barid Bank — RIB : 007 000 000000000000000000, ayant son siège social à Tanger (Maroc),\n\nAtteste par la présente que :\n\n{{civilite}} {{first_name}} {{last_name}}\nNé(e) le {{birth_date}} à {{birth_place}}\nCIN : {{cin}}\nCNSS : {{cnss}}\nGenre : {{genre}}\nNationalité : {{nationalite}}\nVille : {{ville}}\nExerçant la fonction de {{position}}\nDépartement : {{department}} — Agence : {{agence}}\nType agence : {{bank_type}} — RIB : {{rib}}\n\nLa présente attestation est délivrée à l'intéressé(e) sur sa demande pour servir et valoir ce que de droit.\n\nFait à {{ville}}, le {{date}}\n\nSignature et cachet : M. BADR Qettari\nResponsable des Ressources Humaines\nNé le 12/02/1990 à Tanger"],
];
foreach ($templates as $t) {
    \App\Models\Template::updateOrCreate(
        ['id' => $t[0]],
        ['title' => $t[1], 'type' => $t[2], 'is_active' => $t[3], 'content' => $t[4]]
    );
}
echo "Template 1 updated.\n";

// Verify
echo "\nEmployee 1: " . \App\Models\Employee::find(1)->cin . " / " . \App\Models\Employee::find(1)->cnss . "\n";
echo "Template 1 contains CIN: " . (strpos(\App\Models\Template::find(1)->content, '{{cin}}') !== false ? 'YES' : 'NO') . "\n";
