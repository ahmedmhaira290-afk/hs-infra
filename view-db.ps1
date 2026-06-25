$root = "C:\Users\Lenovo\OneDrive\commerce"
$db = "$root\server\database.sqlite"
$exe = "$root\sqlitebrowser\DB Browser for SQLite.exe"
$schema = "$root\server\show-schema.mjs"

Write-Host "=== HS-INFRA RH - Base de donnees ===" -ForegroundColor Cyan
Write-Host ""

# Affiche le schema
node $schema 2>&1

Write-Host ""
Write-Host "Ouverture de DB Browser pour SQLite..." -ForegroundColor Cyan
Start-Process -FilePath $exe -ArgumentList """$db"""
