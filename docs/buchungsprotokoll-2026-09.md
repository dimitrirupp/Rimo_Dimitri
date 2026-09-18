# Buchungsprotokoll Zeiterfassung September 2026 (KW 36–38)

Erfasst am 14./15.09.2026 durch Kimi (Browser-Automatisierung via Kimi WebBridge) für Dimitri Rupp.
Regeln: Mo–Do 9,25 h (07:15–16:30), Fr 5,75 h (07:15–13:00), Tätigkeit immer „Arbeitszeit/ Montage",
Beschreibung = Auto-Text aus dem Arbeitspaket. Alle Tage anschließend freigegeben (Status SUB).

## KW 36

| Datum | Block 1 | Block 2 | Block 3 | Summe |
|---|---|---|---|---|
| Di 01.09. | 0042:5 PM & Administration, 07:15–10:15 (3:00) | 0043:2 Prozesse B&W, 10:15–13:15 (3:00) | 0041:37.2 CloseOut, 13:15–16:30 (3:15) | **9,25** (von Dimitri im Video gebucht) |
| Mi 02.09. | 0042:5, 07:15–10:15 (3:00) *(war schon gebucht)* | 0041:50.2 TEF Telefonica, 10:15–13:15 (3:00) | 0043:2 Prozesse B&W, 13:15–16:30 (3:15) | **9,25** |
| Do 03.09. | 0042:5, 07:15–11:15 (4:00) | 0041:37.2 Mobile Netze DE "Close Out", 11:15–14:15 (3:00) | 0041:47.7 BMD Support, 14:15–16:30 (2:15) | **9,25** |
| Fr 04.09. | 0042:5, 07:15–10:15 (3:00) | 0041:47.7 BMD Support, 10:15–13:00 (2:45) | – | **5,75** |

## KW 37

| Datum | Block 1 | Block 2 | Block 3 | Summe |
|---|---|---|---|---|
| Mo 07.09. | 0042:5, 07:15–11:15 (4:00) | 0041:37.2 CloseOut, 11:15–14:15 (3:00) | 0041:47.4 Monitoring, 14:15–16:30 (2:15) | **9,25** |
| Di 08.09. | 0042:5, 07:15–11:15 (4:00) | 0041:50.2 TEF Telefonica, 11:15–14:15 (3:00) | 0041:47.8 Application Management, 14:15–16:30 (2:15) | **9,25** |
| Mi 09.09. | 0042:5, 07:15–11:15 (4:00) | 0043:2 Prozesse B&W, 11:15–14:15 (3:00) | 0041:47.7 BMD Support, 14:15–16:30 (2:15) | **9,25** |
| Do 10.09. | 0042:5, 07:15–11:15 (4:00) | 0041:37.2 CloseOut, 11:15–14:15 (3:00) | 0041:36.2 Administratives & Internes, 14:15–16:30 (2:15) | **9,25** |
| Fr 11.09. | 0042:5, 07:15–10:15 (3:00) | 0041:50.2 TEF Telefonica, 10:15–13:00 (2:45) | – | **5,75** |

## KW 38

| Datum | Block 1 | Block 2 | Block 3 | Block 4 | Summe |
|---|---|---|---|---|---|
| Mo 14.09. | 0042:5 PM & Administration, 07:30–12:30 (5:00) | 0041:37.2 CloseOut, 12:30–14:30 (2:00) | 0041:50.2 TEF Telefonica, 14:30–16:30 (2:00) | 0041:36.2 Administratives & Internes, 16:30–17:30 (1:00) | **10,00** |

Mo 14.09. hatte Dimitri explizit so bestellt: 5 h Transformation Blue (Projektarbeit, **nicht** WP 2
Berechtigungsstrukturen), 2 h CloseOut, 2 h TEF, 1 h Allgemeine Administration intern,
Arbeitsbeginn 07:30 / Arbeitsende 17:30. Nachgebucht am 15.09., freigegeben (4 × SUB).

| Di 15.09. | 0042:5 PM & Administration, 07:15–11:15 (4:00) | 0041:37.2 CloseOut, 11:15–14:15 (3:00) | 0043:2 Prozesse B&W, 14:15–16:30 (2:15) | – | **9,25** |
| Mi 16.09. | 0042:5, 07:15–11:15 (4:00) | 0041:50.2 TEF Telefonica, 11:15–14:15 (3:00) | 0041:47.7 BMD Support, 14:15–16:30 (2:15) | – | **9,25** |
| Do 17.09. | 0042:5, 07:15–11:15 (4:00) | 0041:37.2 CloseOut, 11:15–14:15 (3:00) | 0041:36.2 Administratives & Internes, 14:15–16:30 (2:15) | – | **9,25** |
| Fr 18.09. | 0042:5, 07:15–10:15 (3:00) | 0041:50.2 TEF Telefonica, 10:15–13:00 (2:45) | – | – | **5,75** |

Alle vier Tage nach den Standardregeln gebucht und **freigegeben (SUB)**, ohne Abweichungen
(Freigabe durch Dimitri am 18.09.2026, „keine Abweichungen"). Tätigkeit durchgehend
„Arbeitszeit/ Montage", Beschreibung = Auto-Text aus dem Arbeitspaket.

Verifikation am 18.09.2026 (DeepSeek/DSH, Kimi WebBridge): Tagesansichten 15.–18.09. je
Zeile geprüft (Von/Bis/Stunden, Projekt, WP-Beschreibung, Status `SUB`); Monatskalender
zeigt 9.25 / 9.25 / 9.25 / 5.75 für 15.–18.09.2026.

**Zwischenfall (18.09.2026, behoben):** Bei der Buchung entstand auf **Di 15.09.** zusätzlich
eine leere Zeile `10:15–13:00 (2:45)`, Projekt 70008 0041, **ohne** Arbeitspaket, Status `NEW`.
Ursache: Der serverseitige „aktuelle Tag" gilt pro Session (`_s`), nicht pro Tab — parallele Tabs
derselben Session (bzw. verspätet ausgeführte POSTs eines hängenden Tabs) verschoben ihn, sodass
eine für 18.09. gedachte Zeile auf 15.09. landete. Die freigegebene Tagessumme blieb korrekt bei
9,25 h (der Kalender zählt die offene Zeile nicht). **Dimitri hat die Zeile am 18.09.2026 selbst
entfernt** — 15.09. ist damit wieder vollständig freigegeben (3 Zeilen, 9,25 h, alle `SUB`).
Technische Lehren dazu: `docs/automatisierung.md` §10.


## Projekt-Verteilung (Summen beide Wochen, ohne 01.09.)

- **70008 0042 Transformation Blue** (WP 5): 8 Tage × 3–4 h ≈ **28,5 h** (Hauptprojekt, täglicher Ankerblock)
- **70008 0041 Automation & AI**: CloseOut 4× ≈ 12 h · TEF 3× ≈ 8,75 h · BMD 3× ≈ 7 h · Monitoring/AppMgmt/Admin je 1× ≈ 6,45 h
- **70008 0043 NOC Automatisierung** (WP 2): 2× ≈ 6,15 h

Verifikation am 14.09.2026: Monatskalender zeigt 9.25/9.25/9.25/5.75 (KW36) und 9.25×4 + 5.75 (KW37),
alle Einträge Status SUB. Stichproben-Screenshots je Tag vorhanden.
Verifikation am 15.09.2026: 14.09. zeigt 4 Einträge (5:00/2:00/2:00/1:00 = 10:00), alle SUB.
