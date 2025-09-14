Write-Host "Iniciando servidor Next.js..." -ForegroundColor Green
Write-Host "Limpiando cache..." -ForegroundColor Yellow

# Limpiar .next si existe
if (Test-Path ".next") {
    Remove-Item ".next" -Recurse -Force -ErrorAction SilentlyContinue
    Write-Host ".next eliminado" -ForegroundColor Yellow
}

# Configurar variables de entorno para evitar errores en Windows
$env:NODE_OPTIONS = "--max-old-space-size=4096"
$env:FORCE_COLOR = "0"

Write-Host "Iniciando servidor en puerto 3000..." -ForegroundColor Green

# Intentar con npx next dev directamente
try {
    npx next dev --port 3000
} catch {
    Write-Host "Error al iniciar con npx, intentando con npm..." -ForegroundColor Red
    npm run dev
}

Write-Host "Presiona cualquier tecla para salir..." -ForegroundColor Cyan
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
