$root = "C:\Users\Lenovo\OneDrive\commerce"
$db = "$root\server\database.sqlite"
$exe = "$root\sqlitebrowser\DB Browser for SQLite.exe"
$nodejs = (Get-Command node -ErrorAction SilentlyContinue).Source

if (-not $nodejs) { Write-Host "Node.js introuvable" -ForegroundColor Red; exit 1 }

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  STRUCTURE DE LA BASE DE DONNEES" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

$serverDir = "$root\server"
$tempScript = "$serverDir\_schema.js"
$dbPathJS = $db -replace '\\', '/'
$code = @"
import Database from 'better-sqlite3';
const dbPath = '$dbPathJS';

const db = new Database(dbPath, { readonly: true, timeout: 5000 });
const list = [
  {name:'users',label:'UTILISATEURS'},
  {name:'employees',label:'EMPLOYES'},
  {name:'templates',label:'TEMPLATES'},
  {name:'documents',label:'DOCUMENTS'}
];
for (const t of list) {
  const row = db.prepare("SELECT sql FROM sqlite_master WHERE type='table' AND name='" + t.name + "'").get();
  if (row) { console.log('--- ' + t.label + ' ---'); console.log(row.sql); console.log(''); }
}
db.close();
"@

Set-Content -LiteralPath $tempScript -Value $code -Force
Push-Location -LiteralPath $serverDir
$output = & $nodejs $tempScript 2>&1
Pop-Location
Remove-Item -LiteralPath $tempScript -Force
Write-Host $output -ForegroundColor White

Write-Host "Ouverture de DB Browser..." -ForegroundColor Green
if (Test-Path $exe) {
  Start-Process -FilePath $exe -ArgumentList """$db"""
} else {
  Write-Host "ERREUR : DB Browser introuvable" -ForegroundColor Red
}
