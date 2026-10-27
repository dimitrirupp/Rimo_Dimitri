# Buchungsprotokoll Oktober 2026 (KW 42–43)

Gebucht am **27.10.2026** (DeepSeek/DSH, Kimi WebBridge) für **Dimitri Rupp**.
Auftrag (Chat, 27.10.2026 08:18): fehlende Tage **13.–16., 19., 21.–23.10.2026** nachbuchen,
bestehende Einträge der letzten zwei Wochen **nicht verändern**.

## Schema (mit Dimitri abgestimmt am 27.10.2026)

Vorgabe: 60 % NOC RedPath · 30 min Allgemeine Administration · Rest drittelgleich auf
TEF Telefonica / CloseOut / BMD · Tages-Soll gemäß Arbeitszeitmodell in Rimo.

| Anteil | Projekt | Arbeitspaket | Dauer Mo–Do | Dauer Fr |
|---|---|---|---|---|
| 60 % NOC | 70008 0043 | 2 Prozesse B&W | 5:15 | 3:18 |
| Allgemeine Administration | 70008 0041 | 36.2 Administratives & Internes | 0:30 | 0:30 |
| Rest, je ein Drittel | 70008 0041 | 50.2 TEF Telefonica und andere RPA Projekte | 1:00 | 0:34 |
| | 70008 0041 | 37.2 Mobile Netze DE „Close Out“ | 1:00 | 0:34 |
| | 70008 0041 | 47.7 BMD Support | 1:00 | 0:34 |
| **Summe** | | | **8:45 = 8,75 h** | **5:30 = 5,50 h** |

Zeitfenster (lückenlos, aufsteigend):

- **Mo–Do:** 07:30–12:45 · 12:45–13:15 · 13:15–14:15 · 14:15–15:15 · 15:15–16:15
- **Fr:** 07:30–10:48 · 10:48–11:18 · 11:18–11:52 · 11:52–12:26 · 12:26–13:00

Tätigkeit durchgehend **„Arbeitszeit/ Montage“**, Beschreibung = Auto-Text aus dem WP-Namen,
jeder Tag **freigegeben** (Status `SUB`).

**Begründung Tages-Soll:** Das Arbeitszeitmodell (in Rimo hinterlegt, vom Auftraggeber bestätigt)
rechnet Mo–Do brutto 07:30–16:15 = 8,75 h (8,25 h netto nach 0,5 h Pause), Fr 07:30–13:00 = 5,50 h
netto; Woche 38,50 h netto. Die 8,75/5,50 sind damit die in Rimo sichtbaren Tageswerte
(vgl. Urlaubswoche 05.–09.10.2026 im Monatskalender).

## Ergebnis je Tag (automatisiert gebucht)

| Tag | Datum | Blöcke | Summe | Kalender | Freigabe |
|---|---|---|---|---|---|
| Di | 13.10.2026 | 5 | 8:45 | 8,75 | alle `SUB` |
| Mi | 14.10.2026 | 5 | 8:45 | 8,75 | alle `SUB` |
| Do | 15.10.2026 | 5 | 8:45 | 8,75 | alle `SUB` |
| Fr | 16.10.2026 | 5 | 5:30 | 5,50 | alle `SUB` |
| Mo | 19.10.2026 | 5 | 8:45 | 8,75 | alle `SUB` (Freigabe beim 2. Versuch) |
| Mi | 21.10.2026 | 5 | 8:45 | 8,75 | **von Dimitri selbst** erfasst/freigegeben (siehe Zwischenfall) |
| Do | 22.10.2026 | 5 | 8:45 | 8,75 | alle `SUB` |
| Fr | 23.10.2026 | 5 | 5:30 | 5,50 | alle `SUB` |

## Verifikation (27.10.2026, 10:12)

Monatskalender Oktober 2026 (gelesen aus Rimo):

`12=9,50 · 13=8,75 · 14=8,75 · 15=8,75 · 16=5,50 · 19=8,75 · 20=8,75 (K) · 21=8,75 · 22=8,75 · 23=5,50`

Je automatisch gebuchtem Tag: 5 Einträge, Summe 8:45 bzw. 5:30, Status `SUB`,
WP-Beschreibungen `Prozesse B&W`, `Administratives & Internes`,
`TEF Telefonica und andere RPA Projekte`, `Mobile Netze DE "Close Out"`, `BMD Support`.

## Unverändert (ausdrücklich nicht angefasst)

- **Mo 12.10.2026:** 4 Einträge, 9:30 (Prozesse B&W 6:00 · Administratives & Internes 1:00 ·
  TEF Telefonica 1:30 · Close Out 1:00), Status `APR`.
- **Di 20.10.2026:** Krank-Eintrag 07:30–16:15, Projekt `70008, CC - IT & Digital Transformation`,
  Tätigkeit „krank ohne ärztliche Bestätigung/sick leave without confirmation“, Status `NEW`.
- **Mo–Fr 05.–09.10.2026:** Urlaub (Kalenderkennzeichen `U`), 8,75/8,75/8,75/8,75/5,50.

## Zwischenfall Mi 21.10.2026

1. Der erste Buchungsversuch (ca. 09:12) scheiterte: Der Tab war „taub“, das WP-Dialog-Ajax
   lieferte keinen Dialog („PSP 2 nicht im Dialog“); es blieben **3 Zeilen-Artefakte** auf 21.10.
   (07:30–12:45 / 0043 ohne WP · 13:15–14:15 / 0041 ohne Tätigkeit · 14:15–15:15 ohne Projekt)
   und die Warnung „Zeitüberschneidung prüfen“.
2. Reparaturversuche (Zeiten/Projekt/Tätigkeit setzen, neuer Tab, Reload der Session-URL)
   scheiterten: Für diesen Tag öffnete der WP-Dialog auch im frischen Tab nicht mehr –
   vermutlich inkonsistenter Serverzustand des Tages nach dem fehlgeschlagenen WP-Aufruf.
3. **Dimitri hat die 3 Zeilen am 27.10.2026 selbst gelöscht und den Tag selbst erfasst und
   freigegeben** (Kalender: 8,75). Keine Löschung durch die Automatisierung.

**Lehre:** Bleibt der WP-Dialog auf einem Tag aus, nicht weiter automatisiert auf dem Tag
arbeiten (kein wiederholtes „Zeit hinzufügen“) – Tag vom Benutzer bereinigen lassen und neu buchen.

## Technik / Reproduktion

- Buchung über Kimi WebBridge, Session `rimo-zeiterfassung`, Skripte `scripts/so.ps1`
  (`Book-BlockVoll`), Freigabe mit Retry (Klick → Dialogprüfung → Reload → Status-Readback),
  weil die Freigabe am 19.10. beim ersten Klick nicht griff.
- **Tagesheader** verlässlich über `span.fl` (Datums-Regex); die Suche im `body.innerText`
  trifft sonst den „--- Today ---“-Block und liefert das falsche Datum.
- Vor jedem Tag: Vorprüfung (Kalenderzelle leer, keine bearbeitbaren Zeilen), danach
  Readback (5 Zeilen, Summe, Status), erst dann Freigabe.

## Offen / Hinweis

- **Heute 27.10.2026** erfasst Dimitri selbst (auf seinen Wunsch, Chat 27.10.2026 10:12).
- Die Rimo-Session blieb während der Buchung durchgehend angemeldet; der Benutzer klickte
  laut Absprache nicht parallel in Rimo (Ausnahme: Bereinigung 13.10./21.10. nach Aufforderung).
