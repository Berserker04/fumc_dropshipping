param(
  [string]$BackupPath = "",
  [switch]$UseExistingBackup
)

$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
$envPath = Join-Path $root ".env"

if (-not (Test-Path $envPath)) {
  throw "Missing .env at $envPath"
}

$databaseUrlLine = Get-Content $envPath |
  Where-Object { $_ -match '^\s*DATABASE_URL\s*=' } |
  Select-Object -First 1

if (-not $databaseUrlLine) {
  throw "DATABASE_URL was not found in .env"
}

$databaseUrl = $databaseUrlLine -replace '^\s*DATABASE_URL\s*=\s*', ''
$databaseUrl = $databaseUrl.Trim().Trim('"').Trim("'")
$uri = [System.Uri]$databaseUrl
$userInfo = $uri.UserInfo.Split(':', 2)

if ($userInfo.Count -lt 2) {
  throw "DATABASE_URL must include user and password"
}

$user = [System.Uri]::UnescapeDataString($userInfo[0])
$password = [System.Uri]::UnescapeDataString($userInfo[1])
$database = [System.Uri]::UnescapeDataString($uri.AbsolutePath.TrimStart('/'))
$port = if ($uri.Port -gt 0) { $uri.Port } else { 5432 }
$sslmode = if ($databaseUrl -match 'sslmode=([^&]+)') { $Matches[1] } else { "require" }
$targetConnection = "sslmode=$sslmode host=$($uri.Host) port=$port dbname=$database user=$user"

if (-not $BackupPath) {
  $backupDir = Join-Path $root "backups"
  New-Item -ItemType Directory -Force -Path $backupDir | Out-Null
  $stamp = Get-Date -Format "yyyyMMdd-HHmmss"
  $BackupPath = Join-Path $backupDir "fumc-local-$stamp.sql"
}

if (-not $UseExistingBackup) {
  Write-Host "Creating local dump at $BackupPath"
  docker exec fumc-postgres pg_dump -U fumc -d fumc --schema=public --no-owner --no-privileges --clean --if-exists |
    Set-Content -Path $BackupPath -Encoding UTF8

  if ($LASTEXITCODE -ne 0) {
    throw "pg_dump failed. Is the fumc-postgres container running?"
  }
} elseif (-not (Test-Path $BackupPath)) {
  throw "Backup file does not exist: $BackupPath"
}

Write-Warning "This restore replaces matching objects in the target public schema."

$env:PGPASSWORD = $password
try {
  docker exec -e PGPASSWORD=$env:PGPASSWORD fumc-postgres psql $targetConnection -v ON_ERROR_STOP=1 -tAc "select 1;" | Out-Host
  if ($LASTEXITCODE -ne 0) {
    throw "Could not connect to the target database."
  }

  Get-Content $BackupPath |
    docker exec -i -e PGPASSWORD=$env:PGPASSWORD fumc-postgres psql $targetConnection -v ON_ERROR_STOP=1

  if ($LASTEXITCODE -ne 0) {
    throw "Restore failed."
  }

  @'
select 'Usuario=' || count(*) from "Usuario";
select 'Proveedor=' || count(*) from "Proveedor";
select 'Producto=' || count(*) from "Producto";
select 'VendedorExterno=' || count(*) from "VendedorExterno";
select 'Cliente=' || count(*) from "Cliente";
select 'Pedido=' || count(*) from "Pedido";
select 'LineaPedido=' || count(*) from "LineaPedido";
select 'OrdenDespacho=' || count(*) from "OrdenDespacho";
select 'Factura=' || count(*) from "Factura";
select 'MovimientoInventario=' || count(*) from "MovimientoInventario";
select 'PedidoEspecial=' || count(*) from "PedidoEspecial";
select 'Liquidacion=' || count(*) from "Liquidacion";
select 'Notificacion=' || count(*) from "Notificacion";
select '_prisma_migrations=' || count(*) from "_prisma_migrations";
'@ |
    docker exec -i -e PGPASSWORD=$env:PGPASSWORD fumc-postgres psql $targetConnection -tA

  Write-Host "Migration completed from local PostgreSQL to Clever Cloud."
} finally {
  Remove-Item Env:\PGPASSWORD -ErrorAction SilentlyContinue
}
