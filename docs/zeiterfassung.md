# Rimo – Zeiterfassung (Zeitschreibung)

Dokumentation des Buchungs-Workflows in Rimo bei SPL-Tele, Stand 14.09.2026.
Erarbeitet aus Bildschirmvideo + Live-Analyse der Anwendung (https://rimo.spl-tele.com/rimo).

## Aufruf

- Menü **Zeit → TimeManagement → Zeitschreibung** (id=10)
- Oben: Perioden-Auswahl (z. B. „September / 2026") und Monats-Kalenderstreifen
- Legende der Tagesfarben: **Nicht Freigegeben** (weiß) / **Freigegeben** (rot) / **Genehmigt** (blau) / **Exportiert** (grün)
- Unter dem Tagesdatum steht die gebuchte Stundensumme (Dezimal, z. B. 9.25)

## Einen Zeiteintrag anlegen

1. **Tag** im Kalenderstreifen anklicken (Datum erscheint in der Titelzeile, z. B. „Donnerstag, 03.09.2026")
2. Toolbar: **„Zeit hinzufügen [t]"** (grünes Plus) → neue leere Zeile erscheint
3. Felder der Zeile:
   - **Von** / **Bis**: Uhrzeit im Format `HH:MM` (z. B. 07:15 / 16:30); **Stunden** wird automatisch berechnet (z. B. 9:15)
   - **Projekt / Auftrag**: Dropdown mit den bevorrechtigten Projekten (siehe unten); bei >100 Einträgen Suchfeld rechts nutzen
   - **„→Ticket / WP wählen"**: öffnet Dialog **„Arbeitspaket wählen"**
     - Tabelle: PSP Code | Bezeichnung | Status | Geplanter Start | Ist Start | Gepl. Dauer | Fortschritt (%) | Ressourcen
     - Zeile per Radio-Punkt wählen → **OK**
     - Nach der Auswahl erscheint das WP als Label `PSP: Bezeichnung` unter der Zeile und das **Beschreibung**-Feld wird automatisch mit dem WP-Namen gefüllt (Auto-Text, kann so stehen bleiben)
   - **Tätigkeit**: Dropdown, Optionen u. a. `- Typ auswählen -`, `Abreise`, `Analyse`, `Anfahrt`, `Anreise Lager`, **`Arbeitszeit/ Montage`** (Standard für normale Projekt-Arbeit), `Stehzeit`. Optionen laden erst, nachdem Projekt/WP gewählt wurde.
   - **Lokation**: optional, bleibt leer
   - **Status**: NEW (neu) → SUB (freigegeben)
4. Weitere Zeilen: erneut „Zeit hinzufügen [t]"; Von/Bis schließt nahtlos an die vorherige Zeile an

**Speichern erfolgt live** (jede Feldänderung wird sofort per Ajax an den Server übertragen). Ein separater Speicherklick ist nicht nötig; es gibt aber „Änderungen speichern [s]" in der Toolbar.

## Tag abschließen (Freigabe)

- Toolbar: **„Tag freigeben [r]"** → alle Einträge des Tages wechseln Status NEW → **SUB**, Tag wird rot („Freigegeben")
- Alternativ **„Periode freigeben [p]"** für den ganzen Monat
- Freigegebene Zeilen werden gesperrt (Tätigkeit nur noch als Text, keine Dropdowns)
- Rückgängig: Menü rechts „Tagfreigabe rückgängig" (Aktionen)

## Weitere Toolbar-Funktionen

| Button | Wirkung |
|---|---|
| Zeit hinzufügen [t] | neue Zeiteintrag-Zeile |
| Zulage hinzufügen [a] | Zulagen-Eintrag |
| Nächtigung | Nächtigungs-Eintrag |
| Ersatzruhe hinzufügen | Ersatzruhe-Eintrag |
| Objekt kopieren [c] / einfügen [v] / löschen | Einträge kopieren/einfügen/löschen |
| Vorheriger/Nächster Tag [-]/[+] | Tageswechsel |
| Datum setzen | direkter Datums-Sprung |
| Tag freigeben [r] / Periode freigeben [p] | Freigaben |

## Regeln Dimitri (Stand 14.09.2026)

- **Mo–Do: 9,25 h** buchen (i. d. R. 07:15–16:30 durchgehend)
- **Fr: 07:15–13:00** (5,75 h) – ganze Firma arbeitet freitags nur bis 13:00
- Tätigkeit immer **„Arbeitszeit/ Montage"**
- Beschreibung = Auto-Text aus WP-Name, kein Individualtext nötig
- Mehrere Buchungsblöcke pro Tag über die Projekte verteilt (Hauptprojekt Transformation Blue zuerst/größter Block)

## Technische Hinweise (für Automatisierung)

- Rimo ist eine klassische Prototype.js-Ajax-Anwendung (`new Ajax.Request("/rimo", ...)`), Session über URL-Parameter `_s`/`_k`
- DOM-Element-`name`-Attribute ändern sich bei jedem Re-Render → Elemente immer über Inhalt/Struktur adressieren, nie über Namen
- Tageszellen: `div.day` (Text = Tag des Monats)
- Titelzeile enthält das gewählte Datum als Text („Donnerstag, 03.09.2026")
- WP-Dialog: Tabelle mit `div.rd` Radio-Punkten; OK/Abbrechen sind `<a>`-Buttons
- Nach Projekt-Auswahl re-rendert die Zeile → DOM-Referenzen neu holen
