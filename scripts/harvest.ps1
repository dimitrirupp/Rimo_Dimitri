. (Join-Path $PSScriptRoot 'lib.ps1')

function Rimo-Day { Invoke-JSAct 'read-rows.js' }

function Rimo-Reload {
  param([int]$Wait = 12)
  Invoke-JS 'reload.js' | Out-Null
  Start-Sleep -Seconds $Wait
  return (Rimo-Day)
}

function Set-Tag {
  param([Parameter(Mandatory)][string]$Day, [int]$Wait = 7)
  Invoke-JS 'goto-day.js' @{ '__DAY__' = $Day } | Out-Null
  Start-Sleep -Seconds $Wait
  return (Rimo-Day)
}

function Show-Tag {
  param($Tag)
  if (-not $Tag) { return }
  "  header=$($Tag.header)  nRows=$($Tag.nRows)"
  $Tag.rows | ForEach-Object {
    "   $($_.von)-$($_.bis)  $($_.std)  | $($_.projekt)  | T=$($_.taetigkeit) | $($_.status) | unter=$($_.unterZeile)"
  }
}

# Neue Zeile anlegen (mit Reload-Rettung, da der Tab haeufig "taub" wird)
function New-RimoRow {
  Invoke-JSAct 'act-purge-dialogs.js' | Out-Null
  Start-Sleep -Seconds 1
  Invoke-JSAct 'act-add-row.js' | Out-Null
  Start-Sleep -Seconds 8
  $day = Rimo-Reload -Wait 12
  $offen = @($day.rows | Where-Object { $_.projektIdx -eq 0 })
  return @{ day = $day; offen = $offen }
}

# Eine bestehende offene Zeile vollstaendig befuellen
function Fill-RimoRow {
  param(
    [Parameter(Mandatory)][string]$AlteVon,
    [Parameter(Mandatory)][string]$AlteBis,
    [Parameter(Mandatory)][string]$Von,
    [Parameter(Mandatory)][string]$Bis,
    [Parameter(Mandatory)][string]$Projekt,
    [Parameter(Mandatory)][string]$Psp,
    [string]$Job = 'Arbeitszeit/ Montage',
    [switch]$KeinReload
  )
  $r = [ordered]@{ ziel = "$Von-$Bis"; projekt = $Projekt; psp = $Psp }

  $r.times = Invoke-JSAct 'row-set-times.js' @{ '__VONALT__' = $AlteVon; '__BISALT__' = $AlteBis; '__VON__' = $Von; '__BIS__' = $Bis }
  if (-not $r.times.ok) { $r.fehler = "Zeiten: $($r.times.why)"; return $r }
  Start-Sleep -Seconds 2
  Invoke-JSAct 'act-save.js' | Out-Null
  Start-Sleep -Seconds 5

  $r.proj = Invoke-JSAct 'row-set-project.js' @{ '__VON__' = $Von; '__BIS__' = $Bis; '__PROJ__' = $Projekt }
  if (-not $r.proj.ok) { $r.fehler = "Projekt: $($r.proj.why)"; return $r }
  Start-Sleep -Seconds 6

  $r.wpOpen = Invoke-JSAct 'row-click-wp.js' @{ '__VON__' = $Von; '__BIS__' = $Bis }
  if (-not $r.wpOpen.ok) { $r.fehler = "WP-Dialog: $($r.wpOpen.why)"; return $r }
  Start-Sleep -Seconds 5
  $r.wpPick = Invoke-JS 'act-pick-wp.js' @{ '__PSP__' = $Psp }
  Start-Sleep -Seconds 2
  Invoke-JSAct 'ok-dialog.js' | Out-Null
  Start-Sleep -Seconds 6

  $r.act = Invoke-JSAct 'row-set-activity.js' @{ '__VON__' = $Von; '__BIS__' = $Bis; '__JOB__' = $Job }
  Start-Sleep -Seconds 4
  Invoke-JSAct 'act-save.js' | Out-Null
  Start-Sleep -Seconds 5

  $r.day = if ($KeinReload) { Rimo-Day } else { Rimo-Reload -Wait 12 }
  $r.zeile = @($r.day.rows | Where-Object { $_.von -eq $Von -and $_.bis -eq $Bis })
  return $r
}

function Show-Block {
  param($B)
  $ok = ($B.zeile.Count -eq 1) -and ($B.zeile[0].projekt -like "*$($B.projekt)*") -and ($B.zeile[0].unterZeile -like "*$($B.psp):*")
  "[$($B.ziel)]  projekt=$($B.projekt)  psp=$($B.psp)  ->  ERFOLG=$ok"
  if ($B.fehler) { "   !! $($B.fehler)" }
  if ($B.wpPick -and -not $B.wpPick.ok) { "   !! WP-Auswahl: $($B.wpPick.why)" }
  if ($B.wpPick -and $B.wpPick.ok) { "   WP-Zeile: $($B.wpPick.zellen[1]): $($B.wpPick.zellen[2])" }
  $B.zeile | ForEach-Object { "   -> $($_.von)-$($_.bis) $($_.std) | $($_.projekt) | T=$($_.taetigkeit) | $($_.status) | unter=$($_.unterZeile)" }
  return $ok
}
