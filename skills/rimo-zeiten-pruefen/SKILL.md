---
name: rimo-zeiten-pruefen
description: |
  Liest und verifiziert Zeiteinträge in Rimo (rimo.spl-tele.com) read-only, ohne etwas zu buchen oder zu verändern: Tagesblöcke, Von/Bis-Zeiten, Stundensummen, Projekt und Status (NEW/SUB) auslesen. Verwenden, wenn geprüft werden soll, was in Rimo gebucht ist — „sind die Zeiten von gestern drin", „wie viele Stunden stehen am 14.09.", „ist der Tag freigegeben", „stimmt das Buchungsprotokoll mit Rimo überein". Nicht für Buchungen — dafür `rimo-zeiterfassung`.
metadata:
  version: "1.0.0"
---

# Rimo-Zeiten prüfen (read-only)

Beantwortet „was ist in Rimo gebucht?" **ohne jede Schreiboperation**. Gegenstück zu
`rimo-zeiterfassung` (bucht und gibt frei) — dieser Skill liest nur und ist damit auch dann
einsetzbar, wenn eine Buchung nicht gewünscht oder nicht erlaubt ist.

Grundlagen, DOM-Wissen und Fehlerkatalog: Repo `Rimo_Dimitri`
(`docs/automatisierung.md`, `docs/zeiterfassung.md`, `docs/deepseek-anleitung.md`).

## Zweck und Abgrenzung

| Frage | Dieser Skill | `rimo-zeiterfassung` |
|---|---|---|
| Was ist gebucht? | ✅ liest | — |
| Stimmt Protokoll ↔ Rimo? | ✅ gleicht ab | — |
| Tag/Block buchen | ❌ nie | ✅ |
| Tag freigeben | ❌ nie | ✅ |

**Leitplanke:** ausschließlich `evaluate` mit lesendem JavaScript. Kein `click`, kein `fill`,
kein `onclick()`, kein Senden von Formularen — auch nicht „nur zum Testen".

## Voraussetzungen

1. Daemon läuft: `~/.kimi-webbridge/bin/kimi-webbridge.exe start` (Port `127.0.0.1:10086`).
2. Rimo ist im Browser des Benutzers **angemeldet** (Tab existiert, Login über Cookie).
3. Session-Name konstant, z. B. `rimo-zeiterfassung` — dann wird der bestehende Tab genutzt.

## Ablauf

### 1. Tab und Datum feststellen

```
POST http://127.0.0.1:10086/command
{"action":"list_tabs","session":"rimo-zeiterfassung"}
```

Aus der Antwort `tabId` und die Rimo-URL übernehmen (enthält `_s=`/`_k=`, also eine gültige Sitzung).
**Wichtig:** relative Tagesangaben immer gegen das echte Datum in `Europe/Vienna` auflösen —
„gestern" ist ein Datum, kein Wort. Wochentag mitprüfen (Mo–Do = Arbeitstag, Fr = Halbtag).

### 2. Gewählten Tag und Kalender lesen

```js
const m = document.body.innerText.match(
  /(Montag|Dienstag|Mittwoch|Donnerstag|Freitag|Samstag|Sonntag), (\d{2}\.\d{2}\.\d{4})/);
return m ? m[0] : null;
```

Diese Kopfzeile ist die **einzige verlässliche Quelle** für den gewählten Tag.
`body.innerText.includes('14.09.2026')` ist **falsch-positiv** (Historien-/Infopaneele).

### 3. Einträge des Tages auslesen (die tragende Abfrage)

Eintragszeilen werden **nicht** über den Zellinhalt gefunden, sondern über ihre **Zeit-Inputs**:

```js
const tables = [...document.querySelectorAll('table')];
const t = tables.find(tb => tb.querySelectorAll('tr').length > 20);
const rows = [...t.querySelectorAll('tr')];
const treffer = [];
rows.forEach((tr, i) => {
  const inputs = [...tr.querySelectorAll('input')].map(x => x.value);
  const hatZeit = inputs.some(v => /^\d{1,2}:\d{2}$/.test((v || '').trim()));
  if (!hatZeit) return;
  const zellen = [...tr.querySelectorAll('td')].map(td => td.innerText.replace(/\s+/g, ' ').trim());
  treffer.push({
    zeile: i,
    von: inputs[2], bis: inputs[3], stunden: inputs[4], status: inputs[5],
    projekt: zellen[0], taetigkeit: zellen[1], wp: zellen[zellen.length - 1]
  });
});
return JSON.stringify(treffer);
```

**Kopfzeile der Eintragstabelle (live verifiziert 15.09.2026):**
`Von | Bis | Stunden | Projekt / Auftrag | Tätigkeit | Status | Historie` — **sieben** Spalten.

**Robustes Auslesen — über die Input-Reihenfolge, nicht über Spaltenposition:**
Innerhalb einer Eintragszeile sind die Inputs `on, leer, Von, Bis, Stunden, Status` —
also `inputs[2]`=Von, `inputs[3]`=Bis, `inputs[4]`=Stunden (read-only), `inputs[5]`=Status
(`NEW`/`SUB`). Projekt und Tätigkeit liest man über die `td`-Texte derselben Zeile
(`70008 0042, Transformation Blue` bzw. `Arbeitszeit/ Montage`).

**Nicht** über Zelltexte wie „Von Bis Stunden …" filtern und **nicht** `\d{1,2}:\d{2}` auf
`tr.innerText` anwenden — das trifft Historien-Zeilen wie `[10.04.2026 07:59:39]`.
Die **Zeit-Inputs** sind das sichere Kennzeichen einer Eintragszeile.

### 4. Auswertung und Abgleich

- **Pro Tag:** Anzahl Blöcke, Summe der Stunden, Status jedes Blocks.
- **Soll-Ist:** Regel Mo–Do 9,25 h · Fr 5,75 h (Abweichungen nur wenn dokumentiert).
- **Protokoll-Abgleich:** gegen `docs/buchungsprotokoll-<jahr>-<monat>.md` im Repo — Blockzeiten,
  Projekte und Summen müssen übereinstimmen.
- **Freigabe:** alle Blöcke `SUB` = Tag freigegeben; `NEW` = noch offen.

### 5. Berichten

Ergebnis als Tabelle (Datum | Projekt | Von–Bis | Stunden | Status), Summe und Abweichungen.
Bei Abweichung zum Protokoll: beide Werte nennen, nicht stillschweigend den neueren nehmen.

## Prüfkriterien

- Der gelesene Tag entspricht dem per Kopfzeilen-Regex bestätigten Datum.
- Jeder gemeldete Block hat Von, Bis, Stunden und Status **aus derselben Zeile**.
- Summe der Blöcke = Summe der Tagesstunden (Gegenrechnung, nicht Addition der Kopfzahl).
- Kein Schreibzugriff: es wurde ausschließlich `evaluate` mit lesendem Code gesendet.

## Bekannte Fallstricke

- **Falscher Tag bei paralleler Nutzung:** klickt der Benutzer gleichzeitig in Rimo, wechselt der
  Server-State den Tag. Immer erst Kopfzeile lesen, dann auswerten.
- **Mehrere Tabellen:** die Zeitschreibungs-Tabelle ist die mit >20 Zeilen; die Kalenderstreifen
  (3–4 Zeilen) und Info-Panels (je ~10 Zeilen) sind nicht die Eintragstabelle.
- **Kalender-Stundensummen aktualisieren verzögert:** als Gegenprobe die Eintragszeilen summieren,
  nicht nur den Kalenderwert lesen.
- **Zwölf statt vier „Zeit-Inputs":** pro Block existieren mehrere `HH:MM`-Felder (auch
  berechnete). Deshalb **pro Zeile** auswerten, nie über alle Inputs der Seite.
- **Zwei Rimo-Ansichten:** Dieselben Daten erscheinen in der Zeitschreibung und im Monatskalender.
  Für Blockdetails immer die Zeitschreibung lesen.

## Versionshistorie

- **v1.0 (2026-09-15)** — Erstfassung. Live verifiziert am 15.09.2026 (Tag 14.09.2026: vier Blöcke,
  07:30–12:30 / 12:30–14:30 / 14:30–16:30 / 16:30–17:30, Summe 10:00 h, alle Status `SUB`).
  Zwei Korrekturen an der Repo-Doku aufgenommen: die Eintragstabelle hat **sieben** Spalten
  (Von/Bis/Stunden/Projekt/Tätigkeit/Status/Historie) und das sichere Zeilenkennzeichen sind die
  **Zeit-Inputs**, nicht der Zelltext.
