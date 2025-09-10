# Script para cambiar entre versiones del diseño
param(
    [Parameter(Mandatory=$true)]
    [ValidateSet("classic", "futuristic")]
    [string]$Version
)

$clientPath = "c:\Users\Cesar\OneDrive - KnowBu\Learning - IA\Learning - GitHub\proyecto-playeras-ia\client"
$pagesPath = "$clientPath\pages"

Write-Host "Cambiando a versión: $Version" -ForegroundColor Green

# Parar proceso de desarrollo si está corriendo
$devProcess = Get-Process -Name "node" -ErrorAction SilentlyContinue | Where-Object {$_.CommandLine -like "*npm run dev*"}
if ($devProcess) {
    Write-Host "Deteniendo servidor de desarrollo..." -ForegroundColor Yellow
    $devProcess | Stop-Process -Force
    Start-Sleep -Seconds 2
}

# Cambiar archivos
Push-Location $pagesPath

if ($Version -eq "classic") {
    if (Test-Path "design.js") {
        Move-Item "design.js" "design-current-backup.js" -Force
    }
    Copy-Item "design-backup-original.js" "design.js" -Force
    Write-Host "✅ Versión clásica activada" -ForegroundColor Green
} 
elseif ($Version -eq "futuristic") {
    if (Test-Path "design.js") {
        Move-Item "design.js" "design-current-backup.js" -Force
    }
    Copy-Item "design-futuristic.js" "design.js" -Force
    Write-Host "✅ Versión futurística activada" -ForegroundColor Green
}

Pop-Location

# Reiniciar servidor
Write-Host "Iniciando servidor de desarrollo..." -ForegroundColor Blue
Push-Location $clientPath
Start-Process powershell -ArgumentList "-Command", "npm run dev" -NoNewWindow
Pop-Location

Write-Host "🚀 Servidor iniciado. Accede a: http://localhost:3000/design" -ForegroundColor Cyan
