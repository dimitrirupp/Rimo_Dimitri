. (Join-Path $PSScriptRoot 'release.ps1')

# Kompletter Block: neue Zeile anlegen (mit Reload-Rettung) und befuellen
function Book-RimoBlock {
  param(
    [Parameter(Mandatory)][string]$Von,
    [Parameter(Mandatory)][string]$Bis,
    [Parameter(Mandatory)][string]$Projekt,
    [Parameter(Mandatory)][string]$Psp,
    [string]$Job = 'Arbeitszeit/ Montage'
  )
  $add = Add-RimoRowSafe
  if (-not $add.ok) { return @{ ziel = "$Von-$Bis"; projekt = $Projekt; psp = $Psp; fehler = 'keine neue Zeile anlegbar' } }
  $open = $add.offen[0]
  $b = Fill-RimoRow -AlteVon $open.von -AlteBis $open.bis -Von $Von -Bis $Bis -Projekt $Projekt -Psp $Psp -Job $Job
  return $b
}

function Book-RimoTag {
  param(
    [Parameter(Mandatory)][string]$Tag,
    [Parameter(Mandatory)][array]$Bloecke,
    [switch]$Freigeben
  )
  $res = [ordered]@{ tag = $Tag }
  $res.start = Set-Tag -Day $Tag
  Show-Tag $res.start
  $ergebnisse = @()
  foreach ($b in $Bloecke) {
    "[Block $($b.Von)-$($b.Bis) | $($b.Projekt) | PSP $($b.Psp)]"
    $r = Book-RimoBlock -Von $b.Von -Bis $b.Bis -Projekt $b.Projekt -Psp $b.Psp
    Show-Block $r | Out-Null
    $ergebnisse += $r
    if ($r.fehler) { "   !! $($r.fehler)" }
  }
  $res.bloecke = $ergebnisse
  "--- Tagesstand $Tag ---"
  Show-Tag (Rimo-Day)
  if ($Freigeben) {
    $rel = Release-RimoTag
    $sub = Invoke-JSAct 'read-sub-day.js'
    "Freigabe: $($sub.statusAlle -join ', ')"
  }
  return $res
}
