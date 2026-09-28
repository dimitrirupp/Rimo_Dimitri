. (Join-Path $PSScriptRoot 'lib.ps1')

function Set-RimoDay {
  param([Parameter(Mandatory)][string]$Day, [int]$WaitSec = 6)
  $r = Invoke-JS 'goto-day.js' @{ '__DAY__' = $Day }
  Start-Sleep -Seconds $WaitSec
  $h = (Invoke-JSAct 'read-rows.js').header
  return @{ clicked = $r; header = $h; ok = ($h -match "\.$Day\.2026") }
}

function Get-RimoDay { Invoke-JSAct 'read-rows.js' }

function Add-RimoBlock {
  param(
    [Parameter(Mandatory)][string]$Von,
    [Parameter(Mandatory)][string]$Bis,
    [Parameter(Mandatory)][string]$Projekt,
    [Parameter(Mandatory)][string]$Psp,
    [string]$Job = 'Arbeitszeit/ Montage',
    [switch]$Quiet
  )
  $res = [ordered]@{ von = $Von; bis = $Bis; projekt = $Projekt; psp = $Psp }

  $res.add = Invoke-JSAct 'act-add-row.js'
  Start-Sleep -Seconds 6

  $rows = Get-RimoDay
  $offen = @($rows.rows | Where-Object { $_.projektIdx -eq 0 })
  $res.offeneZeilen = $offen.Count
  if ($offen.Count -lt 1) { $res.fehler = 'keine offene Zeile nach "Zeit hinzufügen"'; return $res }

  $res.times = Invoke-JSAct 'act-set-times.js' @{ '__VON__' = $Von; '__BIS__' = $Bis }
  Start-Sleep -Seconds 2
  $res.save1 = Invoke-JSAct 'act-save.js'
  Start-Sleep -Seconds 5

  $res.proj = Invoke-JSAct 'act-set-project.js' @{ '__PROJ__' = $Projekt }
  Start-Sleep -Seconds 6

  $res.wpOpen = Invoke-JSAct 'act-click-wp.js'
  Start-Sleep -Seconds 5
  $res.wpPick = Invoke-JS 'act-pick-wp.js' @{ '__PSP__' = $Psp }
  Start-Sleep -Seconds 2
  $res.wpOk = Invoke-JSAct 'ok-dialog.js'
  Start-Sleep -Seconds 6

  $res.act = Invoke-JSAct 'act-set-activity.js' @{ '__JOB__' = $Job }
  Start-Sleep -Seconds 5
  $res.save2 = Invoke-JSAct 'act-save.js'
  Start-Sleep -Seconds 5

  $res.readback = (Get-RimoDay).rows
  if (-not $Quiet) {
    "[Block $Von-$Bis  $Projekt  PSP $Psp]"
    "   add=$($res.add.ok) offen=$($res.offeneZeilen) times=$($res.times.von)/$($res.times.bis) proj=$($res.proj.gesetzt)"
    "   wpPick=$($res.wpPick.ok) $(if($res.wpPick.zellen){$res.wpPick.zellen[1]+': '+$res.wpPick.zellen[2]})  act=$($res.act.gesetzt)"
    if ($res.wpPick.ok -eq $false) { "   !! WP-Problem: $($res.wpPick.why)" }
    if ($res.fehler) { "   !! $($res.fehler)" }
  }
  return $res
}

function Restore-RimoHelpers { Invoke-JSAct 'read-rows.js' | Out-Null }
