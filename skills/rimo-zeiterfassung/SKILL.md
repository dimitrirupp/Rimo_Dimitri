---
name: rimo-zeiterfassung
description: |
  Zeiterfassung in Rimo (rimo.spl-tele.com) für Dimitri Rupp: Tages-/Wochenbuchungen per Kimi WebBridge im echten Browser erfassen und freigeben. Verwenden, wenn Zeiteinträge in Rimo gebucht, geprüft oder freigegeben werden sollen, oder wenn Fragen zu Dimitris Projekten/Arbeitspaketen (70008 0041/0042/0043) und Buchungsregeln auftreten.
metadata:
  version: "1.0.0"
---

# Rimo Zeiterfassung (SPL-Tele, Dimitri Rupp)

Bucht Zeiteinträge in Rimo über Kimi WebBridge im echten Browser des Benutzers.
Details und komplette Doku: Repo `Rimo_Dimitri` (docs/zeiterfassung.md, docs/automatisierung.md).

## Buchungsregeln (Stand 14.09.2026)

- **Mo–Do: 9,25 h** (typisch 07:15–16:30, 2–3 Blöcke) · **Fr: 07:15–13:00 (5,75 h)**
- Tätigkeit immer **„Arbeitszeit/ Montage"**, Beschreibung = Auto-Text aus WP-Name (stehen lassen)
- Hauptprojekt **70008 0042 Transformation Blue** = täglicher Ankerblock (WP **5** „Projekt Management und Administration")
- Danach frei mischen: 0041:37.2 CloseOut · 0041:50.2 TEF Telefonica · 0041:47.7 BMD Support ·
  0041:47.4 Monitoring · 0041:47.8 Application Management · 0041:36.2 Administratives & Internes · 0043:2 Prozesse B&W
- WP immer über **PSP-Code** wählen (Namen kommen mehrfach vor: 37.1/37.2/37.3, 50.1/50.2/50.3)
- Am Ende jeden Tag freigeben (Hotkey `r` → Status SUB)

## Ablauf (bewährt, Details in docs/automatisierung.md)

1. WebBridge-Daemon prüfen (`"$USERPROFILE/.kimi-webbridge/bin/kimi-webbridge.exe" start`),
   Tab: `https://rimo.spl-tele.com/rimo`, Session `rimo-zeiterfassung`
2. Vor Buchung **Bestandsaufnahme**: Kalenderwerte des Zeitraums lesen, keine Dubletten!
3. Pro Tag: Tageszelle `div.day` per Maus-Sequenz klicken (mousedown/mouseup/click),
   Header-Regex `/(Montag|…|Freitag), \d{2}\.\d{2}\.\d{4}/` verifizieren
4. Pro Block: `Zeit hinzufügen [t]` → Von/Bis (`HH:MM`) → Projekt-Select →
   WP-Button (liegt in Zeile UNTER dem Eintrag, per Y-Koordinate finden) →
   im Dialog „Arbeitspaket wählen" PSP-Zeile (`div.rd`) + OK → Tätigkeit setzen
5. Tag freigeben (Hotkey `r`, vorher `blur()`), Status `SUB` prüfen
6. Abschluss: Kalenderwerte + Screenshot pro Tag verifizieren

## Fallstricke

- DOM-`name`-Attribute ändern sich bei jedem Re-Render → nie über `name` adressieren
- Neue Zeilen erscheinen teils erst nach >15 s → sonst „verwaiste" Zeilen nachträglich befüllen
- Nach Projekt-Wahl/WP-Dialog DOM-Referenzen neu holen (Re-Render)
- Benutzer darf während der Buchung **nicht parallel in Rimo klicken** (Tag-Auswahl ist Server-State)
- Requests unter Windows immer als Datei-Body an `http://127.0.0.1:10086/command` senden

## Leitplanken

- Niemals Einträge löschen oder fremde Einträge ändern
- Keine Konfiguration/Stammdaten in Rimo verändern (Unternehmens-Anwendung)
- Vor Buchung Bestand prüfen; nur fehlende Tage/Blöcke ergänzen
