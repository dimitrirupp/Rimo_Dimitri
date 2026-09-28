. (Join-Path $PSScriptRoot 'harvest.ps1')

function Release-RimoTag {
  $r = Invoke-JSAct 'act-release.js'
  Start-Sleep -Seconds 3
  Invoke-JSAct 'ok-dialog.js' | Out-Null
  Start-Sleep -Seconds 5
  $day = Rimo-Reload -Wait 12
  $status = @($day.rows | ForEach-Object { $_.status })
  $alleSub = ($day.rows.Count -gt 0) -and (@($status | Where-Object { $_ -ne 'SUB' }).Count -eq 0)
  return @{ klick = $r; day = $day; status = $status; alleSub = $alleSub }
}

# Legt eine neue Zeile an und wartet, bis sie serverseitig sichtbar ist (max. 3 Versuche)
function Add-RimoRowSafe {
  param([int]$Versuche = 3)
  for ($i = 1; $i -le $Versuche; $i++) {
    Invoke-JSAct 'act-purge-dialogs.js' | Out-Null
    Start-Sleep -Seconds 1
    Invoke-JSAct 'act-add-row.js' | Out-Null
    Start-Sleep -Seconds 8
    $day = Rimo-Reload -Wait 12
    $offen = @($day.rows | Where-Object { $_.projektIdx -eq 0 })
    if ($offen.Count -ge 1) { return @{ ok = $true; versuch = $i; day = $day; offen = $offen } }
    "      (Versuch ${i}: keine offene Zeile sichtbar, neuer Versuch)"
  }
  return @{ ok = $false; day = $day; offen = @() }
}
