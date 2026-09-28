# Rimo - WebBridge-Helfer (dot-sourcen, kein Geheimnis enthalten)
# Aufruf:  . "$PSScriptRoot\lib.ps1"   (oder blocks.ps1/harvest.ps1/release.ps1/book.ps1/so.ps1)
$ErrorActionPreference = 'Continue'
$script:RimoSession = 'rimo-zeiterfassung'
# Verzeichnis dieses Skripts (enthaelt helpers.js und alle Aktionen)
$script:RimoScratch = if ($PSScriptRoot) { $PSScriptRoot } else { Split-Path -Parent $MyInvocation.MyCommand.Path }

function Resolve-RimoFile {
  param([Parameter(Mandatory)][string]$File)
  # WICHTIG: [System.IO.File] loest relativ zum PROZESS-CWD auf, nicht zur PS-Location.
  if ([System.IO.Path]::IsPathRooted($File)) { return $File }
  $abs = Join-Path $script:RimoScratch $File
  if (Test-Path -LiteralPath $abs) { return $abs }
  $alt = Join-Path (Get-Location).Path $File
  if (Test-Path -LiteralPath $alt) { return $alt }
  return $abs
}

function Invoke-WB {
  param(
    [Parameter(Mandatory)][string]$Action,
    [hashtable]$Args = @{},
    [string]$Session = $script:RimoSession,
    [int]$TimeoutSec = 120
  )
  $payload = @{ action = $Action; args = $Args; session = $Session } | ConvertTo-Json -Depth 8 -Compress
  $f = Join-Path $env:TEMP ('wb-' + [guid]::NewGuid().ToString('N').Substring(0,8) + '.json')
  [System.IO.File]::WriteAllText($f, $payload, (New-Object System.Text.UTF8Encoding($false)))
  try {
    $r = (Invoke-WebRequest -Uri 'http://127.0.0.1:10086/command' -Method Post -InFile $f `
          -ContentType 'application/json; charset=utf-8' -UseBasicParsing -TimeoutSec $TimeoutSec).Content | ConvertFrom-Json
    return $r
  } catch {
    return @{ ok = $false; error = $_.Exception.Message }
  } finally { Remove-Item $f -Force -ErrorAction SilentlyContinue }
}

# JS-Datei auswerten und (falls String) als JSON zurueckgeben
function Invoke-JS {
  param(
    [Parameter(Mandatory)][string]$File,
    [hashtable]$Replace = @{},
    [int]$TimeoutSec = 120,
    [switch]$Raw
  )
  $path = Resolve-RimoFile $File
  $code = [System.IO.File]::ReadAllText($path)
  foreach ($k in $Replace.Keys) { $code = $code.Replace($k, [string]$Replace[$k]) }
  $r = Invoke-WB -Action 'evaluate' -Args @{ code = $code } -TimeoutSec $TimeoutSec
  if (-not $r.ok) { return @{ __error = $r.error } }
  $v = $r.data.value
  if ($Raw) { return $v }
  if ($v -is [string]) {
    try { return ($v | ConvertFrom-Json) } catch { return @{ __raw = $v } }
  }
  return $v
}

# Helfer (helpers.js) + Aktion in EINEM evaluate ausfuehren
function Invoke-JSAct {
  param(
    [Parameter(Mandatory)][string]$File,
    [hashtable]$Replace = @{},
    [int]$TimeoutSec = 120
  )
  $hp = Join-Path $script:RimoScratch 'helpers.js'
  $ap = Resolve-RimoFile $File
  $code = [System.IO.File]::ReadAllText($hp) + "`n" + [System.IO.File]::ReadAllText($ap)
  foreach ($k in $Replace.Keys) { $code = $code.Replace($k, [string]$Replace[$k]) }
  $r = Invoke-WB -Action 'evaluate' -Args @{ code = $code } -TimeoutSec $TimeoutSec
  if (-not $r.ok) { return @{ __error = $r.error } }
  $v = $r.data.value
  if ($v -is [string]) { try { return ($v | ConvertFrom-Json) } catch { return @{ __raw = $v } } }
  return $v
}

function Show-JS {
  param($Obj)
  $Obj | ConvertTo-Json -Depth 8
}

function Mask-Secret {
  param([string]$Text)
  return ($Text -replace '_s=[^&"'' ]*', '_s=X' -replace '_k=[^&"'' ]*', '_k=X' -replace 'glp[A-Za-z0-9_-]+', '[REDACTED]')
}

# Bequem: Zeilen des aktuellen Tages lesen
function Get-RimoRows { Invoke-JSAct 'read-rows.js' }
