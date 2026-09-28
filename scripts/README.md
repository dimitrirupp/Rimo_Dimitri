# scripts/ — Rimo-Automatisierung (Kimi WebBridge)

Wiederverwendbare Werkzeuge für Zeiterfassung, Projekt-/WP-Pflege und Sprint-Arbeit in Rimo.
Erarbeitet und live verifiziert bei der Buchung der KW 39 (28.09.2026).

**Keine Zugangsdaten in diesen Dateien.** Die Rimo-Session lebt im Browser des Benutzers; die
Skripte sprechen nur den lokalen WebBridge-Daemon an (`http://127.0.0.1:10086`).

## Voraussetzungen

1. Kimi WebBridge läuft und die Extension ist verbunden:

   ```powershell
   & "$env:USERPROFILE\.kimi-webbridge\bin\kimi-webbridge.exe" start
   (Invoke-WebRequest 'http://127.0.0.1:10086/status' -UseBasicParsing).Content   # extension_connected: true
   ```

2. In Rimo ist ein Tab **angemeldet** (Session-Name `rimo-zeiterfassung`).
3. Genau **ein** Tab dieser Session bedienen — der „aktuelle Tag" liegt serverseitig pro Session.
4. Der Benutzer klickt während der Buchung **nicht** selbst in Rimo.

## Einstieg

```powershell
. "$PSScriptRoot\so.ps1"        # laedt lib.ps1, helpers.js, blocks.ps1, harvest.ps1, release.ps1, book.ps1

Show-Tag (Set-Tag -Day '21')    # Tag oeffnen und Ist-Stand lesen (Kalender + Eintraege)

Show-Voll (Book-BlockVoll -Von '07:15' -Bis '12:45' -Projekt '70008 0042' -Psp '5')
Show-Voll (Book-BlockVoll -Von '13:45' -Bis '15:45' -Projekt '70008 0001' -So '70008 0001' -Psp '63')

$rel = Release-RimoTag          # Tag freigeben
(Invoke-JSAct 'read-sub-day.js').statusAlle    # muss nur 'SUB' enthalten
```

## Funktionen

| Funktion | Wirkung |
|---|---|
| `Set-Tag -Day 'NN'` | Tageszelle anklicken, Header verifizieren, Zeilen lesen |
| `Rimo-Day` | aktuelle Tageszeilen lesen (ohne Schreiben) |
| `Rimo-Reload` | `location.reload()` + Warten + neu lesen (Rettung bei „taubem" Tab) |
| `Add-RimoRowSafe` | neue Zeile anlegen, mit Reload-Rettung und bis zu 3 Versuchen |
| `Book-BlockVoll` | **kompletter Block**: Zeile → Zeiten → Projekt (Dropdown oder `-So`) → WP → Tätigkeit → Readback |
| `Book-RimoBlock` | wie oben, aber immer mit neuer Zeile (kein SO) |
| `Fill-RimoRow` | bestehende offene Zeile über ihr Von/Bis-Paar befüllen |
| `Set-RimoSo` | Projekt über den SO-Suchdialog setzen (Projekte außerhalb des Dropdowns) |
| `Release-RimoTag` | Tag freigeben und Status zurücklesen |
| `Show-Tag`, `Show-Block`, `Show-Voll` | kompakte Ausgabe für Readback und Bericht |

## Aufbau

```
lib.ps1        Transport (Invoke-WB), JS-Ausfuehrung (Invoke-JS, Invoke-JSAct), Pfadaufloesung
helpers.js     DOM-Helfer, wird VOR jede Aktion geladen (__rimoRows, __rimoRowInfo, __rimoSet, ...)
blocks.ps1     Set-RimoDay, Get-RimoDay, Add-RimoBlock
harvest.ps1    Rimo-Reload, Set-Tag, Show-Tag, New-RimoRow, Fill-RimoRow, Show-Block
release.ps1    Release-RimoTag, Add-RimoRowSafe
book.ps1       Book-RimoBlock, Book-RimoTag
so.ps1         Set-RimoSo, Book-BlockVoll, Show-Voll        <- Haupteinstieg
act-*.js       Einzelaktionen (neue Zeile, speichern, freigeben, Dialoge, WP waehlen)
row-*.js       Zeilenadressierung ueber Von/Bis (row-set-times, row-set-project, row-click-wp, ...)
so-*.js        SO-Suchdialog (so-filter, so-read-results, so-pick)
read-*.js      Tages-/Toolbar-/Freigabe-Readback
verify-*.js    Gesamtverifikation (Eintraege, Projektzuordnung, Kalender)
dump-*.js      Diagnose (Zustand, Dialoge, Tabellen, Handler)
```

## Harte Regeln (aus den Fehlern vom 28.09.2026)

- **Zeilen nie über den Index** adressieren — der Server sortiert nach „Von" neu.
- **Vor dem Anlegen prüfen, ob eine offene Zeile existiert** und diese wiederverwenden.
- **Blöcke aufsteigend** buchen, sonst verschiebt Rimo Zeiten und meldet Überschneidungen.
- **Nie auf die parameterlose URL** `https://rimo.spl-tele.com/rimo` navigieren — das beendet die
  Session des Tabs. Immer den Session-Link des Tabs verwenden.
- Relative JS-Pfade vermeiden: `[System.IO.File]` löst gegen den **Prozess-CWD** auf, nicht gegen
  die PowerShell-Location (`Resolve-RimoFile` erledigt das).
- Vor dem Schreiben lesen, nach dem Schreiben **zurücklesen** — `ok:true` der Brücke heißt nur
  „Transport erfolgreich".

## Hintergrund

- `docs/automatisierung.md` — vollständige Technik-Doku inkl. §11 (KW-39-Erkenntnisse)
- `docs/zeiterfassung.md` — Workflow in der Oberfläche
- `docs/deepseek-anleitung.md` — Übergabe-Anleitung für KI-Modelle
- DSH-Skills: `~/.dsh/skills/rimo-zeiterfassung`, `rimo-projektplanung`, `rimo-sprint-management`
