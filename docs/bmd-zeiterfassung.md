# BMD Web — Zeiterfassung für Dimitri Rupp

Branch: `bmd-dimitri` · Stand **18.09.2026** · Auftrag: „diese Woche gemäß den Einträgen in Rimo
von meinen Zeiten für diese Woche buchen" + Dokumentation.

> **Keine Zugangsdaten in dieser Datei.** Benutzername/Passwort werden nirgends abgelegt.

## 1. System und Zugang

- URL (vom Auftraggeber): `https://bmdweb.spl-tele.com/bmdweb/bmdweb.dll/EXEC/kxsbaeiuutupnaiuaege/`
- Nach dem Aufruf leitet BMD auf eine andere `EXEC/<token>/`-URL um; Titel:
  „SPL TELE Group / Electrify (2026.29.25.23, 32 Bit)" → **Mandant SPL TELE Group / Electrify**,
  BMD-Version **2026.29.25.23 (32 Bit)**.
- **Zustand 18.09.2026:** Es erscheint ein **Login-Formular** (`input[name=user]`, `input[name=pass]`,
  Button „Login"). Die Browsersession ist **nicht** angemeldet.
- **Blocker:** Der Benutzername aus der Auftragsnachricht wurde vom PII-Filter maskiert
  (`<EMAIL_1>`) und ist für den Agenten nicht lesbar. Das Passwort liegt vor, wird aber nicht
  verwendet, solange der Benutzername fehlt. **Raten ist ausgeschlossen** (Gefahr der
  Kontosperre durch Fehlversuche).

## 2. Datenquelle: Was in Rimo für diese Woche (KW 38) steht

Quelle: `docs/buchungsprotokoll-2026-09.md`, in Rimo verifiziert am 18.09.2026 (alle Tage `SUB`).

| Tag | Blöcke (Projekt:WP · Von–Bis · Stunden) | Summe |
|---|---|---|
| Mo 14.09. | 0042:5 · 07:30–12:30 (5:00) \| 0041:37.2 · 12:30–14:30 (2:00) \| 0041:50.2 · 14:30–16:30 (2:00) \| 0041:36.2 · 16:30–17:30 (1:00) | 10,00 |
| Di 15.09. | 0042:5 · 07:15–11:15 (4:00) \| 0041:37.2 · 11:15–14:15 (3:00) \| 0043:2 · 14:15–16:30 (2:15) | 9,25 |
| Mi 16.09. | 0042:5 · 07:15–11:15 (4:00) \| 0041:50.2 · 11:15–14:15 (3:00) \| 0041:47.7 · 14:15–16:30 (2:15) | 9,25 |
| Do 17.09. | 0042:5 · 07:15–11:15 (4:00) \| 0041:37.2 · 11:15–14:15 (3:00) \| 0041:36.2 · 14:15–16:30 (2:15) | 9,25 |
| Fr 18.09. | 0042:5 · 07:15–10:15 (3:00) \| 0041 [Build Feature Complete] · 10:15–11:15 (1:00) \| 0041:37.2 · 11:15–13:00 (1:45) | 5,75 |
| | | **43,50** |

Offene Frage für die BMD-Abbildung: Wie heißen diese Projekte/Arbeitspakete in BMD
(andere Projekt-/Leistungsart-Codes)? Die Zuordnung Rimo → BMD ist **nicht** 1:1 bekannt und muss
aus BMD (Projektliste/Leistungsarten) oder aus der IT-Wiki-Doku ermittelt werden.

## 3. Hersteller-Dokumentation (BMD)

Recherche 18.09.2026. Die vom Auftraggeber genannte URL folgt dem Muster
`https://www.bmd.at/Portaldata/1/Resources/help/00.00/OES/Documents/<ID>.html`
(Versionspfad `00.00` = aktuelle Hilfe; die ID wurde maskiert).

Gefundene Einstiegspunkte (über Websuche):

| Dokument | Fundstelle | Status |
|---|---|---|
| BMD WEB 2.0 – ZEITERFASSUNG und Mobile APP (PDF) | `bmd.at/Portaldata/1/Resources/help/00.00/OES/Samples/BMDWeb_2.0_Zeiterfassung_und_Mobile_APP.pdf` | geprüft |
| BMD Web: Projektwochenerfassung | `bmd.at/…/help/27.02/OES/Documents/1485606467000008800.html` | **404** (alte Versionspfade entfernt) |
| BMD Web: Einzelerfassung | `bmd.at/…/help/27.01/OES/Documents/1365955896000106140.html` | **404** |
| BMD Web: LEA | `bmd.at/…/help/00.00/OES/Documents/1464434096000506190.html` | nicht geprüft |

**Begriffe aus der BMD-Welt** (aus den Suchergebnis-Auszügen): *Projektwochenerfassung* (Erfassung
je Projekt mit Von-/Bis-Zeit, Von-Zeit wird vom Arbeitszeitmodell vorgeschlagen), *Einzelerfassung*,
*LEA* (Leistungsarten), *BDE-Stempelungen*.

## 4. Interne Quellen

- **IT-Wiki** `http://xwiki.spl-tele.com/bin/view/IT-Wiki/` → im Browser (Edge, normales Profil)
  Antwort **„no available server"**; über den Agenten-Netzwerkzugang nicht erreichbar
  (nicht-öffentliche IP). Der Auftraggeber hat das Wiki in einem **Inkognito-Fenster** offen —
  darauf hat die Browser-Brücke keinen Zugriff.
- **Infisical** (SPL): Aufruf `infisical secrets --projectId 3aff11b1-… --domain
  https://infisical.spl-tele.com` → **„No valid login session found"**, Login-Flow zeigt auf
  `https://infisical.lumi-systems.io/login?callback_port=…` (bekannter Domain-Cache-Fehler).
  Ohne gültige CLI-Session keine Secret-Abfrage möglich.

## 5. Nächste Schritte

1. **Benutzername für BMD klären** (maskiert) — entweder vom Auftraggeber nennen lassen oder
   selbst im BMD-Login-Feld eintragen; der Agent übernimmt dann Passwort + Navigation.
2. BMD-Oberfläche erkunden (read-only): Menü → Zeiterfassung, Wochenansicht, Projekt-/Leistungsart-
   Auswahl, bestehende Einträge dieser Woche prüfen (nichts doppelt buchen!).
3. Mapping Rimo-Projekte → BMD-Projekte/Leistungsarten dokumentieren.
4. Erst danach buchen — mit Readback je Tag (gleiche Sorgfaltspflicht wie in Rimo:
   keine Löschungen, keine fremden Daten, keine Stammdaten).
