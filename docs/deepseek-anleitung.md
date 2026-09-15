# Übergabe-Anleitung Zeiterfassung Rimo — für DeepSeek (und jedes andere KI-Modell)

Dieses Dokument ist die vollständige Betriebsanleitung, um die Rimo-Zeiterfassung von
Dimitri Rupp (SPL-Tele) per Browser-Automatisierung nahtlos fortzuführen. Es ersetzt jede
Einarbeitung: Kontext, Werkzeuge, DOM-Wissen, Abläufe, Regeln, Fehlerbehandlung, Leitplanken.
Stand: 15.09.2026 (geschrieben von Kimi, nach produktiver Buchung von 9 Arbeitstagen).

---

## 1. Auftrag und Kontext

- **Ziel**: Zeiteinträge in Rimo (https://rimo.spl-tele.com/rimo) für Dimitri Rupp erfassen,
  prüfen und freigeben — exakt so, wie Dimitri es manuell tun würde.
- **Rimo** ist das SPL-Tele-weite Projektmanagement-Tool (Hersteller: rimo-systems.com).
  **Unternehmenskritisch**: NIEMALS Einträge löschen, fremde Einträge ändern oder
  Konfigurationen/Stammdaten verändern. Es werden ausschließlich NEUE Zeiteinträge für
  Dimitri angelegt und Tage freigegeben.
- Dokumentation & Buchungsprotokolle: Repo `github.com/dimitrirupp/Rimo_Dimitri`
  (lokal `C:\Users\ruppd\Kimi_Projects\Rimo_Dimitri`). Nach jeder Buchungsserie:
  Protokoll ergänzen, committen, pushen.

## 2. Werkzeug: Kimi WebBridge (Browser-Steuerung)

Die Automatisierung läuft über **Kimi WebBridge**: ein lokaler Daemon
(`http://127.0.0.1:10086`) steuert den **echten Browser des Benutzers** inkl. seiner
Login-Session. Kein eigenes Login nötig, solange der Benutzer im Browser bei Rimo
angemeldet ist (sonst: Benutzer einmal einloggen lassen).

### Aufrufkonvention (Windows, Git Bash)

- Jede Anfrage als **JSON-Datei-Body** (niemals inline — Encoding-Probleme mit Umlauten):

```bash
curl.exe -sS -X POST http://127.0.0.1:10086/command \
  -H "Content-Type: application/json" --data-binary "@C:/Users/ruppd/Kimi_Projects/.tmp/webbridge-req-<n>.json" --max-time 90
```

- Immer `curl.exe` (nicht `curl`), Datei danach löschen.
- **Session-Name** konstant: `"session":"rimo-zeiterfassung"` (top-level im JSON).
- Wichtige Actions: `navigate`, `evaluate` (JS, async/await ok), `screenshot`,
  `list_tabs`, `close_tab`, `cdp`.
- `evaluate` hat ein **300-s-Timeout** → Warte-Loops kurz halten, Gesamtdauer < 4 min.
- Daemon nicht erreichbar → starten: `"$USERPROFILE/.kimi-webbridge/bin/kimi-webbridge.exe" start`

## 3. Rimo-Grundlagen (Domäne)

- Rimo = klassische **Prototype.js-Ajax-App** (`new Ajax.Request("/rimo",...)`),
  Session über URL-Parameter `_s`/`_k`.
- **Live-Save**: jede Feldänderung wird sofort serverseitig gespeichert. Es gibt kein
  „ungespeichert" — aber auch keine Undo-Sicherung. Sorgfalt!
- Zeiterfassung: Menü **Zeit → TimeManagement → Zeitschreibung**.
- Oben: Perioden-Auswahl (Monat) + **Kalenderstreifen** (Tageszellen `div.day`).
  Unter jedem Tag die Stundensumme (Dezimal: `9.25` = 9:15).
- Legende: Nicht Freigegeben (weiß) / Freigegeben (rot) / Genehmigt (blau) / Exportiert (grün).
- Eintrags-Status: **NEW** (offen) → **SUB** (freigegeben). Freigegebene Zeilen sind gesperrt.

### Buchungsregeln Dimitri (Stand 15.09.2026)

| Regel | Wert |
|---|---|
| Mo–Do | **9,25 h** (typisch 07:15–16:30, 2–3 Blöcke nahtlos) |
| Freitag | **07:15–13:00 = 5,75 h** (ganze Firma nur bis 13:00) |
| Tätigkeit | immer **„Arbeitszeit/ Montage"** |
| Beschreibung | **Auto-Text** aus WP-Name, nie manuell ändern |
| Lokation | leer |
| Abschluss | jeder Tag wird freigegeben (SUB) |

Abweichungen nur auf ausdrückliche Anweisung Dimitris (Beispiel 14.09.2026: 10:00 h,
07:30–17:30, Blöcke 5/2/2/1 h — dokumentiert im Buchungsprotokoll).

### Projekte & Arbeitspakete (WPs)

| Projekt | PSP | Arbeitspaket | Verwendung |
|---|---|---|---|
| **70008 0042** Transformation Blue | **5** | Projekt Management und Administration | **Hauptprojekt, täglicher Ankerblock** |
| 70008 0041 Automation & AI | 37.2 | Mobile Netze DE "Close Out" | CloseOut-Datenübernahme |
| 70008 0041 | 50.2 | TEF Telefonica und andere RPA Projekte | TEF |
| 70008 0041 | 47.7 | BMD Support | BMD |
| 70008 0041 | 47.4 | Monitoring | interne IT |
| 70008 0041 | 47.8 | Application Management | interne IT |
| 70008 0041 | 36.2 | Administratives & Internes | Internes/Admin |
| 70008 0043 NOC Automatisierung | 2 | Prozesse B&W | NOC |

**Immer per PSP-Code wählen** — WP-Namen existieren mehrfach (37.1/37.2/37.3, 50.1/50.2/50.3).

## 4. DOM-Adressierung (das A und O)

**Niemals über `name`-Attribute adressieren** — sie ändern sich bei jedem Re-Render.
Immer über Inhalt/Struktur:

```js
// Tageszelle (Kalender): Text = Monatstag
const dayCell = [...document.querySelectorAll('div.day')].find(e=>e.textContent.trim()==='14');

// Gewähltes Datum prüfen (EINZIG verlässliche Quelle):
const curDay = () => { const m=document.body.innerText.match(
  /(Montag|Dienstag|Mittwoch|Donnerstag|Freitag), (\d{2}\.\d{2}\.\d{4})/); return m?m[2]:null };

// Eintrags-Zeilen (Zeilen mit Projekt-Select):
const entryRows = () => [...document.querySelectorAll('tr')].filter(tr=>{
  const s=tr.querySelector('select');
  return s && [...s.options].some(o=>o.textContent.includes('70008 0041')) });

// Neue Zeile anlegen:
const addBtn = [...document.querySelectorAll('a')].find(e=>(e.getAttribute('title')||'').startsWith('Zeit hinzufügen'));

// WP-Dialog "Arbeitspaket wählen": Zeilen mit td[1]=PSP, td[2]=Bezeichnung, Radio=div.rd
// OK-Button im Dialog: <a> mit Text "OK"

// Freigeben-Button:
const relBtn = [...document.querySelectorAll('a')].find(e=>(e.getAttribute('title')||'').startsWith('Tag freigeben'));
```

## 5. Referenz-Code (bewährt, wiederverwenden)

### 5.1 Helfer

```js
const sleep = ms => new Promise(r=>setTimeout(r,ms));
const waitFor = async (fn,timeout=15000,step=250) => {
  const t0=Date.now();
  while(Date.now()-t0<timeout){ try{ const v=fn(); if(v) return v }catch(e){} await sleep(step) }
  return null };
const setVal = (el,v) => {
  const proto = el.tagName==='SELECT' ? HTMLSelectElement.prototype : HTMLInputElement.prototype;
  Object.getOwnPropertyDescriptor(proto,'value').set.call(el,v);
  ['input','change','blur'].forEach(t=>el.dispatchEvent(new Event(t,{bubbles:true}))) };
```

### 5.2 Tageswechsel (zuverlässigste Methode)

Die Tageszelle hat keinen eigenen Handler — ihre **Eltern-TD** hat
`onclick="act('setDay:on:','14',<requestId>)"`. Direkt aufrufen:

```js
dayCell.parentElement.onclick();
await waitFor(()=>curDay()==='14.09.2026');
```

(Maus-Event-Sequenzen und CDP-Trusted-Clicks sind UNZUVERLÄSSIG — nur Fallback.)

### 5.3 Einen Block buchen (komplett)

1. `addBtn.click()` → mit `waitFor` auf neue Zeile warten (kann >15 s dauern!)
2. Von/Bis in den beiden benannten Zeit-Inputs setzen (`setVal`), Format `HH:MM`
3. Projekt-Select der Zeile setzen (`70008 0041/0042/0043` im Optionstext), ~1 s warten
   (Zeile re-rendert → DOM-Referenzen neu holen!)
4. WP-Button klicken: `a` mit Text `Ticket / WP w` — liegt in einer **separaten Tabellenzeile
   UNTER** dem Eintrag → über `getBoundingClientRect().top` der richtigen Zeile zuordnen
5. Im Dialog: Zeile mit `td[1].innerText.trim()===PSP` finden, `div.rd` klicken, `OK` klicken,
   Schließen des Dialogs abwarten
6. Tätigkeits-Select: warten bis Option „Arbeitszeit/ Montage" existiert, dann setzen
7. Beschreibung (Auto-Text) NICHT anfassen

### 5.4 Tag freigeben

```js
const b=[...document.querySelectorAll('a')].find(e=>(e.getAttribute('title')||'').startsWith('Tag freigeben'));
b.onclick ? b.onclick() : b.click();
// danach: alle Status-Inputs === 'SUB' prüfen
```

(Hotkey `r` funktioniert nicht zuverlässig.)

## 6. Fehlerkatalog (alle bisher aufgetretenen Probleme + Lösungen)

| # | Problem | Erkennung | Lösung |
|---|---|---|---|
| 1 | Verwaiste `div.mask` (opacity:0) blockiert ALLE Klicks | `document.elementFromPoint(x,y)` liefert `DIV.mask` | `[...document.querySelectorAll('div.mask')].forEach(e=>{e.style.pointerEvents='none';e.style.display='none'})` |
| 2 | Tab eingefroren (evaluate+screenshot timeouts) | curl-Timeout, keine Antwort | `close_tab`, neuen Tab öffnen (Login bleibt über Cookie) |
| 3 | „Verwaiste" Zeilen ohne Projekt (Zeile erscheint erst nach >15 s) | Zeile mit Default-Zeiten, kein Projekt | Zeile nachträglich befüllen (Zeiten/Projekt/WP/Tätigkeit) — kein Löschen nötig |
| 4 | DOM-Referenz stale nach Re-Render | Element nicht mehr im DOM | Nach jedem Ajax-Schritt DOM neu abfragen |
| 5 | WP-Button nicht in der Zeilen-`<tr>` | Suche in Zeile scheitert | Position (`top`-Koordinate) zur Zeile nutzen |
| 6 | Tätigkeits-Optionen fehlen | Select hat nur „- Typ auswählen -" | Sie laden erst nach WP-Zuordnung → `waitFor` |
| 7 | Freigeben-Button flackert / Hotkey `r` wirkungslos | Status bleibt NEW | Button per Titel-Attribut finden, `onclick()` aufrufen |
| 8 | Tages-Check per `innerText.includes(datum)` falsch-positiv | Datum taucht in Historien auf | Nur Header-Regex (siehe 4) verwenden |
| 9 | Benutzer klickt parallel in Rimo → Tag wechselt „geisterhaft" | Header-Regex zeigt anderen Tag | Vor jeder Aktion Tag prüfen; Benutzer bitten, während der Buchung nicht zu klicken |
| 10 | Abbruch einer langen `evaluate` mid-request | Zustand inkonsistent | Header-Regex lesen, synchronisieren, ggf. Tab neu laden |

## 7. Standard-Ablauf einer Buchungsserie

1. **Bestandsaufnahme**: Kalenderwerte des Zeitraums lesen (welche Tage haben schon Stunden?).
   NIEMALS doppelt buchen. Bei vorhandenen Einträgen eines Tages: nur fehlende Blöcke ergänzen.
2. Pro Tag: Tageswechsel (5.2), Header-Regex verifizieren
3. Pro Block: Buchung (5.3)
4. Tag freigeben (5.4), Status `SUB` verifizieren
5. **Verifikation**: Kalenderwerte prüfen (Summe je Tag) + Screenshot pro Tag
6. **Protokoll**: `docs/buchungsprotokoll-<jahr>-<monat>.md` im Repo ergänzen
   (Datum, Blöcke mit Projekt:PSP, Zeiten, Summen), committen, pushen
7. Dem Benutzer Ergebnis-Tabelle berichten (Tag | Stunden | Blöcke | Status)

## 8. Leitplanken (unbedingt einhalten)

- KEINE Einträge löschen, KEINE fremden Einträge ändern
- KEINE Änderungen an Konfiguration, Stammdaten, Sprints, Projekten
- Nur Zeiteinträge für Dimitri anlegen + Tage freigeben
- Vor jeder Buchung Bestand prüfen (keine Dubletten)
- Bei Unsicherheit über Projekt/WP/Zeiten: zuerst Dimitri fragen, nicht raten
- Passwörter/Credentials niemals in Dateien, Repo oder Logs speichern

## 9. Glossar (UI-Begriffe)

Zeitschreibung = Zeitenerfassungs-Ansicht · Arbeitspaket (WP) = buchbarer Task im Projekt ·
PSP-Code = WP-Nummer (z. B. 37.2) · Tätigkeit = Art der Arbeit („Arbeitszeit/ Montage") ·
Tag freigeben = Tag zur Genehmigung einreichen (Status SUB) · Periode = Kalendermonat ·
Sprint = Halbmonats-Einheit („IT & Digital Transformation MM/JJ 1/2|2/2") ·
SUB = submitted/freigegeben · NEW = offen
