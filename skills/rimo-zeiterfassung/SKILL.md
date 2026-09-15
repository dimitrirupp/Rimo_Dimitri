---
name: rimo-zeiterfassung
description: |
  Zeiterfassung in Rimo (rimo.spl-tele.com) für Dimitri Rupp: Tages-/Wochenbuchungen per Kimi WebBridge im echten Browser erfassen und freigeben. Verwenden, wenn Zeiteinträge in Rimo gebucht, geprüft oder freigegeben werden sollen, oder wenn Fragen zu Dimitris Projekten/Arbeitspaketen (70008 0041/0042/0043) und Buchungsregeln auftreten.
metadata:
  version: "1.1.0"
---

# Rimo Zeiterfassung (SPL-Tele, Dimitri Rupp)

Bucht Zeiteinträge in Rimo über Kimi WebBridge im echten Browser des Benutzers.
Vollständige Doku: Repo `Rimo_Dimitri` — docs/zeiterfassung.md, docs/automatisierung.md,
**docs/deepseek-anleitung.md (vollständige Übergabe/Referenz-Code)**.

## Buchungsregeln (Stand 15.09.2026)

- **Mo–Do: 9,25 h** (typisch 07:15–16:30) · **Fr: 07:15–13:00 (5,75 h)**
- Tätigkeit immer **„Arbeitszeit/ Montage"**, Beschreibung = Auto-Text aus WP-Name (nie anfassen)
- Hauptprojekt **70008 0042 Transformation Blue** = täglicher Ankerblock (WP **5**)
- Danach mischen: 0041:37.2 CloseOut · 0041:50.2 TEF · 0041:47.7 BMD ·
  0041:47.4 Monitoring · 0041:47.8 Application Management · 0041:36.2 Admin & Internes · 0043:2 Prozesse B&W
- WP immer über **PSP-Code** wählen (Namen mehrfach: 37.1/37.2/37.3, 50.1/50.2/50.3)
- Abweichungen nur auf explizite Anweisung (Bsp. 14.09.26: 10:00 h, 07:30–17:30, 5/2/2/1)
- Am Ende jeden Tag freigeben (Status SUB)

## Ablauf (Referenz-Code siehe docs/deepseek-anleitung.md)

1. WebBridge-Daemon prüfen (`"$USERPROFILE/.kimi-webbridge/bin/kimi-webbridge.exe" start`),
   Session `rimo-zeiterfassung`, Tab: `https://rimo.spl-tele.com/rimo`
2. **Bestandsaufnahme**: Kalenderwerte des Zeitraums lesen — keine Dubletten buchen!
3. Tageswechsel: `dayCell.parentElement.onclick()` (die Eltern-TD hat
   `act('setDay:on:','N',id)`), dann Header-Regex
   `/(Montag|…|Freitag), \d{2}\.\d{2}\.\d{4}/` verifizieren
4. Pro Block: `Zeit hinzufügen [t]` → Von/Bis (`HH:MM`) → Projekt → WP-Button
   (liegt in Zeile UNTER dem Eintrag, per `getBoundingClientRect().top` zuordnen) →
   Dialog: PSP-Zeile (`div.rd`) + OK → Tätigkeit „Arbeitszeit/ Montage"
5. Freigeben: `a[title^="Tag freigeben"]` → `onclick()` (Hotkey `r` unzuverlässig), Status `SUB` prüfen
6. Kalenderwerte + Screenshot verifizieren; Buchungsprotokoll im Repo ergänzen & pushen

## Fehler-Quickies

- Klicks wirkungslos? → `elementFromPoint` prüfen: verwaiste `div.mask` →
  `style.pointerEvents='none'; style.display='none'` setzen
- Tab hängt (alles timed out)? → `close_tab`, neuen Tab öffnen (Login bleibt via Cookie)
- Neue Zeile fehlt nach >15 s? → verwaiste Zeile mit Default-Zeiten einfach nachträglich befüllen
- Nach Re-Render DOM-Referenzen IMMER neu holen; nie über `name`-Attribute adressieren
- Benutzer darf während der Buchung **nicht parallel in Rimo klicken** (Tag-Auswahl = Server-State)

## Leitplanken

- Niemals Einträge löschen oder fremde Einträge ändern
- Keine Konfiguration/Stammdaten/Sprints/Projekte verändern (Unternehmens-Anwendung)
- Vor Buchung Bestand prüfen; nur fehlende Tage/Blöcke ergänzen
- Keine Credentials in Dateien/Repo/Logs
