# deploy.ps1 — Build + ZIP para despliegue en cPanel
# Uso: .\deploy.ps1
# Genera zx-deploy.zip listo para subir a cPanel

$ErrorActionPreference = "Stop"
$ProjectRoot = $PSScriptRoot
$ZipName = "zx-deploy.zip"
$ZipPath = Join-Path $ProjectRoot $ZipName

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  ZX LINE — Deploy Builder" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 1. Build
Write-Host "[1/3] Compilando proyecto (npm run build)..." -ForegroundColor Yellow
Set-Location $ProjectRoot
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: El build falló. Revisa los errores arriba." -ForegroundColor Red
    exit 1
}
Write-Host "      Build completado." -ForegroundColor Green

# 2. Eliminar ZIP anterior
if (Test-Path $ZipPath) {
    Remove-Item $ZipPath -Force
    Write-Host "[2/3] ZIP anterior eliminado." -ForegroundColor Yellow
} else {
    Write-Host "[2/3] No había ZIP anterior." -ForegroundColor Yellow
}

# 3. Crear ZIP con los archivos necesarios
Write-Host "[3/3] Creando $ZipName..." -ForegroundColor Yellow

$include = @(
    ".next",
    "public",
    "server.js",
    "package.json",
    "package-lock.json",
    "next.config.mjs"
)

# Usar System.IO.Compression para crear el ZIP
Add-Type -AssemblyName System.IO.Compression.FileSystem

$zip = [System.IO.Compression.ZipFile]::Open($ZipPath, 'Create')

foreach ($item in $include) {
    $fullPath = Join-Path $ProjectRoot $item
    if (-not (Test-Path $fullPath)) {
        Write-Host "      ADVERTENCIA: '$item' no encontrado, se omite." -ForegroundColor DarkYellow
        continue
    }

    if (Test-Path $fullPath -PathType Container) {
        # Es una carpeta — agregar todos los archivos recursivamente
        $files = Get-ChildItem $fullPath -Recurse -File
        foreach ($file in $files) {
            $relativePath = $file.FullName.Substring($ProjectRoot.Length + 1)
            $entry = $zip.CreateEntry($relativePath, [System.IO.Compression.CompressionLevel]::Optimal)
            $stream = $entry.Open()
            $fileStream = [System.IO.File]::OpenRead($file.FullName)
            $fileStream.CopyTo($stream)
            $fileStream.Close()
            $stream.Close()
        }
    } else {
        # Es un archivo
        $relativePath = (Resolve-Path $fullPath -Relative).TrimStart('.\')
        $entry = $zip.CreateEntry($relativePath, [System.IO.Compression.CompressionLevel]::Optimal)
        $stream = $entry.Open()
        $fileStream = [System.IO.File]::OpenRead($fullPath)
        $fileStream.CopyTo($stream)
        $fileStream.Close()
        $stream.Close()
    }
}

$zip.Dispose()

$zipSize = [math]::Round((Get-Item $ZipPath).Length / 1MB, 2)

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  ZIP generado: $ZipName ($zipSize MB)" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Pasos para desplegar en cPanel:" -ForegroundColor Cyan
Write-Host ""
Write-Host "  IMPORTANTE: borra .next antes de extraer el ZIP" -ForegroundColor Red
Write-Host "  Si no lo haces, los chunks viejos quedan mezclados con los nuevos." -ForegroundColor Red
Write-Host ""
Write-Host "  1. Sube $ZipName al directorio raiz de tu app en cPanel" -ForegroundColor White
Write-Host "  2. En File Manager: elimina la carpeta .next" -ForegroundColor Yellow
Write-Host "  3. Extrae el ZIP" -ForegroundColor White
Write-Host "  4. Si cambiaste dependencias: npm install --omit=dev" -ForegroundColor White
Write-Host "  5. Reinicia la aplicacion Node.js" -ForegroundColor White
Write-Host "  6. Verifica en zxline.us/account/system" -ForegroundColor White
Write-Host ""
