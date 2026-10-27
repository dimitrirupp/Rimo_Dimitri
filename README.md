# Rimo_Dimitri

Alles über Rimo inklusive Zeiterfassung — Dokumentation, Buchungsprotokolle und
Automatisierungs-Know-how für das SPL-Tele-Projektmanagement-Tool Rimo
(https://rimo.spl-tele.com/rimo).

## Inhalt

### docs/

| Datei | Inhalt |
|---|---|
| [deepseek-anleitung.md](docs/deepseek-anleitung.md) | **Vollständige Übergabe-Anleitung für DeepSeek/andere KI-Modelle**: Kontext, Werkzeuge, DOM-Wissen, Referenz-Code, Fehlerkatalog, Leitplanken — nahtloses Weitermachen ohne Einarbeitung |
| [zeiterfassung.md](docs/zeiterfassung.md) | Workflow Zeitschreibung: Eintrag anlegen, WP wählen, Tätigkeit, Freigabe, Toolbar/Tastenkürzel, Buchungsregeln Dimitri |
| [projekte-arbeitspakete.md](docs/projekte-arbeitspakete.md) | Projekte 70008 0041/0042/0043, alle buchungsrelevanten Arbeitspakete mit PSP-Codes, PM-Board-Ansichten |
| [sprints.md](docs/sprints.md) | Sprint-Modell (Halbmonats-Sprints), Sprint-Gruppen, WP-Zuordnung, 80-%-Auslastungsziel |
| [sprintplanung-analyse.md](docs/sprintplanung-analyse.md) | **Analyse 18.09.2026**: Wie die Sprint-Planung funktioniert (WP → Person → Sprint), alle Kennzahlen (Verfügbar/Geplant/Planbar), eigene 29 WPs, Bearbeiten-vs-Schließen, historische Sprints, Weg zu 36–38 h Auslastung |
| [automatisierung.md](docs/automatisierung.md) | Technische Doku der Browser-Automatisierung (Kimi WebBridge): Element-Adressierung, JS-Helfer, Fallstricke inkl. Masken-/Frozen-Tab-/Recovery-Themen |
| [buchungsprotokoll-2026-09.md](docs/buchungsprotokoll-2026-09.md) | Buchungsprotokoll September 2026 (KW 36–38): alle gebuchten Blöcke pro Tag, Projekt-Verteilung, Verifikation |
| [buchungsprotokoll-2026-10.md](docs/buchungsprotokoll-2026-10.md) | Buchungsprotokoll Oktober 2026 (KW 42–43): Schema 60 % NOC / 30 min Admin / Rest TEF-CloseOut-BMD, Tages-Soll 8,75/5,50 h, alle Blöcke, Verifikation, Zwischenfall 21.10. |

### scripts/

Wiederverwendbare PowerShell-/JavaScript-Werkzeuge für die Browser-Automatisierung
(Kimi WebBridge). Einstieg: `so.ps1` lädt `lib.ps1`, `helpers.js`, `blocks.ps1`, `harvest.ps1`,
`release.ps1`, `book.ps1`.

| Datei | Zweck |
|---|---|
| `lib.ps1` | WebBridge-Aufruf, JS-Ausführung, Pfadauflösung (`Invoke-WB`, `Invoke-JS`, `Invoke-JSAct`) |
| `helpers.js` | DOM-Helfer, wird vor jede Aktion geladen (`__rimoRows`, `__rimoRowInfo`, `__rimoCalSums`) |
| `so.ps1` | **Haupteinstieg**: `Book-BlockVoll`, `Set-RimoSo`, `Release-RimoTag`, `Show-Tag`, `Show-Voll` |
| `harvest.ps1`, `blocks.ps1`, `book.ps1`, `release.ps1` | Aufbau in dieser Reihenfolge (Block-, Tages- und Freigabelogik) |
| `act-*.js` | Einzelaktionen (Zeile hinzufügen, speichern, freigeben, Dialoge, WP wählen) |
| `row-*.js` | Zeilen-Adressierung über das Von/Bis-Paar (nie über den Index) |
| `so-*.js` | SO-Suchdialog (Projekt außerhalb des Dropdowns, z. B. `70008 0001`) |
| `read-*.js`, `verify-*.js`, `dump-*.js` | Readback, Verifikation, Diagnose |

### skills/

| Skill | Zweck |
|---|---|
| [rimo-zeiterfassung](skills/rimo-zeiterfassung/SKILL.md) | Wiederverwendbarer Kimi-Skill: bucht/prüft/gibt Zeiteinträge in Rimo frei (Buchungsregeln, Ablauf, Fehler-Quickies, Leitplanken) |
| [rimo-zeiten-pruefen](skills/rimo-zeiten-pruefen/SKILL.md) | Read-only-Verifikation: liest gebuchte Tagesblöcke, Zeiten, Stundensummen und Status aus Rimo aus, ohne etwas zu verändern — für Fragen wie „sind die Zeiten von gestern drin?" oder Protokoll-Abgleich |

## Quellen & Links

- Anwendung: https://rimo.spl-tele.com/rimo
- Hersteller: https://rimo-systems.com/
- Rimo-API (Doku): https://rimo-api.d-prod.spl-tele.com/docs/
- Hersteller-Wiki: https://wiki.rimo-systems.com/
- Internes Wiki (SPL-Tele): http://xwiki.spl-tele.com/bin/view/IT-Wiki/

## Buchungsregeln Dimitri (Kurzfassung)

- **Ab Oktober 2026:** Mo–Do **8,75 h** brutto (07:30–16:15, 8,25 h netto) · Fr **5,50 h**
  (07:30–13:00) — Arbeitszeitmodell in Rimo, Woche 38,50 h netto.
  Davor (Sep 2026): Mo–Do 9,25 h (07:15–16:30) · Fr 5,75 h (07:15–13:00).
- Tätigkeit „Arbeitszeit/ Montage", Beschreibung = Auto-Text
- Oktober-Schema: 60 % NOC `70008 0043:2` · 0:30 Admin `0041:36.2` · Rest je 1/3 auf
  `0041:50.2` TEF / `0041:37.2` CloseOut / `0041:47.7` BMD (Details:
  [buchungsprotokoll-2026-10.md](docs/buchungsprotokoll-2026-10.md))
- Jeden Tag freigeben (Status SUB)

## Stand der Buchungen (27.10.2026)

| Zeitraum | Summen je Tag | Status |
|---|---|---|
| KW 36 (01.–04.09.) | 9,25 / 9,25 / 9,25 / 5,75 | ✓ freigegeben |
| KW 37 (07.–11.09.) | 9,25 × 4 / 5,75 | ✓ freigegeben |
| Mo 14.09. | 10,00 (07:30–17:30, Blöcke 5/2/2/1) | ✓ freigegeben |
| KW 38 (15.–18.09.) | 9,25 / 9,25 / 9,25 / 5,75 | ✓ freigegeben |
| **KW 39 (21.–25.09.)** | **9,25 / 9,25 / 9,25 / 9,75 / 5,75** | **✓ freigegeben** |
| KW 40 (28.09.–02.10.) | 10,25 (01.10.) / 5,75 (02.10.) | ✓ freigegeben |
| KW 41 (05.–09.10.) | 8,75 × 4 / 5,50 (Urlaub, `U`) | ✓ freigegeben |
| **KW 42/43 (12.–23.10.)** | **12.10.: 9,50 (bestand) · 13.–15., 19., 22.: 8,75 · 21.: 8,75 (Dimitri) · 16., 23.: 5,50** | **✓ freigegeben** |

Offen bei Buchung von KW 39: die Woche 21.–25.09. ist vollständig erfasst (**43,25 h**),
alle Einträge Status `SUB`, verifiziert über Monatskalender, Zeilen-Readback und
Projekt-Info-Hover. Details: [buchungsprotokoll-2026-09.md](docs/buchungsprotokoll-2026-09.md).

## Ablage und Spiegelung

- **GitHub:** `github.com/dimitrirupp/Rimo_Dimitri`
- **GitLab (SPL):** `gitlab.spl-tele.com/dimitri/Rimo_Dimitri`
- Beide Remotes werden **parallel** gepflegt. Die Entscheidung über eine endgültige Umstellung
  von GitHub auf GitLab steht noch aus (Besprechung am **Donnerstag, 01.10.2026**).
- Standardbranch ist **`main`**; `bmd-dimitri` ist per Fast-Forward in `main` enthalten.

## KI-Skills für Rimo (DSH-Station)

Liegen unter `~/.dsh/skills/` und werden automatisch geladen:

| Skill | Zweck |
|---|---|
| `rimo-zeiterfassung` | Zeiten buchen, prüfen, freigeben (verifiziertes Verfahren inkl. Taub-Tab-Rettung, SO-Dialog) |
| `rimo-projektplanung` | Projekte und Arbeitspakete lesen/zuordnen, PSP-Codes, MyTasks |
| `rimo-sprint-management` | Sprint-Zuordnung, Auslastung, Kennzahlen, Plan/Ist-Abgleich |
