. (Join-Path $PSScriptRoot 'book.ps1')

# Projekt ueber den SO-Suchdialog setzen (fuer Projekte, die nicht im Dropdown stehen, z.B. 70008 0001)
function Set-RimoSo {
  param(
    [Parameter(Mandatory)][string]$Von,
    [Parameter(Mandatory)][string]$Bis,
    [Parameter(Mandatory)][string]$So
  )
  $r = [ordered]@{}
  $r.open = Invoke-JSAct 'row-click-searchso.js' @{ '__VON__' = $Von; '__BIS__' = $Bis }
  Start-Sleep -Seconds 5
  $r.filter = Invoke-JSAct 'so-filter.js' @{ '__FELD__' = 'SalesOrderNumber'; '__SUCHE__' = $So }
  Start-Sleep -Seconds 6
  $r.pick = Invoke-JS 'so-pick.js' @{ '__SO__' = $So }
  Start-Sleep -Seconds 2
  Invoke-JSAct 'ok-dialog.js' | Out-Null
  Start-Sleep -Seconds 6
  return $r
}

# Ein kompletter Block: Zeile anlegen, Zeiten, Projekt (Dropdown oder SO), WP, Taetigkeit
function Book-BlockVoll {
  param(
    [Parameter(Mandatory)][string]$Von,
    [Parameter(Mandatory)][string]$Bis,
    [Parameter(Mandatory)][string]$Projekt,
    [Parameter(Mandatory)][string]$Psp,
    [string]$So,
    [string]$Job = 'Arbeitszeit/ Montage'
  )
  $add = Add-RimoRowSafe
  if (-not $add.ok) { return @{ ziel = "$Von-$Bis"; projekt = $Projekt; psp = $Psp; fehler = 'keine neue Zeile anlegbar' } }
  $open = $add.offen[0]

  $t = Invoke-JSAct 'row-set-times.js' @{ '__VONALT__' = $open.von; '__BISALT__' = $open.bis; '__VON__' = $Von; '__BIS__' = $Bis }
  if (-not $t.ok) { return @{ ziel = "$Von-$Bis"; projekt = $Projekt; psp = $Psp; fehler = "Zeiten: $($t.why)" } }
  Start-Sleep -Seconds 2
  Invoke-JSAct 'act-save.js' | Out-Null
  Start-Sleep -Seconds 5

  if ($So) { $proj = Set-RimoSo -Von $Von -Bis $Bis -So $So }
  else {
    $proj = Invoke-JSAct 'row-set-project.js' @{ '__VON__' = $Von; '__BIS__' = $Bis; '__PROJ__' = $Projekt }
    Start-Sleep -Seconds 6
  }

  $wpOpen = Invoke-JSAct 'row-click-wp.js' @{ '__VON__' = $Von; '__BIS__' = $Bis }
  Start-Sleep -Seconds 5
  $wpPick = Invoke-JS 'act-pick-wp.js' @{ '__PSP__' = $Psp }
  Start-Sleep -Seconds 2
  Invoke-JSAct 'ok-dialog.js' | Out-Null
  Start-Sleep -Seconds 6

  $act = Invoke-JSAct 'row-set-activity.js' @{ '__VON__' = $Von; '__BIS__' = $Bis; '__JOB__' = $Job }
  Start-Sleep -Seconds 4
  Invoke-JSAct 'act-save.js' | Out-Null
  Start-Sleep -Seconds 5

  $day = Rimo-Reload -Wait 12
  $zeile = @($day.rows | Where-Object { $_.von -eq $Von -and $_.bis -eq $Bis })
  $ok = ($zeile.Count -eq 1) -and ($zeile[0].projekt -like "*$Projekt*") -and ($zeile[0].unterZeile -like "*$Psp`:*")
  return @{ ziel = "$Von-$Bis"; projekt = $Projekt; psp = $Psp; ok = $ok; zeile = $zeile; wpPick = $wpPick; proj = $proj; act = $act }
}

function Show-Voll {
  param($B)
  $mark = if ($B.ok) { 'OK ' } else { 'FEHLER ' }
  "[$mark] $($B.ziel) | $($B.projekt) | PSP $($B.psp)"
  if ($B.fehler) { "        !! $($B.fehler)" }
  if ($B.wpPick -and -not $B.wpPick.ok) { "        !! WP: $($B.wpPick.why)" }
  $B.zeile | ForEach-Object { "        -> $($_.von)-$($_.bis) $($_.std) | $($_.projekt) | T=$($_.taetigkeit) | $($_.status) | unter=$($_.unterZeile)" }
}
