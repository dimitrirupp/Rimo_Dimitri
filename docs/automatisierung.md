# Rimo-Automatisierung mit Kimi WebBridge

Technische Dokumentation der Browser-Automatisierung für Rimo (rimo.spl-tele.com),
erarbeitet am 14.09.2026. Grundlage: Kimi WebBridge (Daemon auf `http://127.0.0.1:10086`),
der den echten Browser mit den Login-Sessions des Benutzers steuert.

## 1. Grundlagen der Anwendung

- Rimo ist eine klassische **Prototype.js-Ajax-Anwendung** (`new Ajax.Request("/rimo", ...)`)
- Session über URL-Parameter `_s` und `_k` (z. B. `/rimo?_s=lp6l5rudi6Krnpk1&_k=...`)
- **Live-Save**: Jede Feldänderung wird sofort per Ajax an den Server übertragen.
  Es gibt keinen Entwurfs-Modus — das macht Automatisierung sicher, aber auch fehleranfällig
  (jede Aktion wirkt sofort).
- Der Server hält den UI-State pro Session. **Achtung bei paralleler Nutzung**: Klickt der
  Benutzer im selben Rimo-Session-Verbund selbst herum, ändert sich z. B. der ausgewählte Tag
  unter der laufenden Automatisierung. → Vor jeder Aktion den Zustand prüfen und den Benutzer
  bitten, während der Buchung nicht selbst in Rimo zu klicken.

## 2. WebBridge-Aufrufe (Windows/Git Bash)

- Jeder Request als **Datei-Body** senden (keine Inline-JSON wegen Encoding):

```bash
curl.exe -sS -X POST http://127.0.0.1:10086/command \
  -H "Content-Type: application/json" --data-binary "@webbridge-req-<n>.json" --max-time 90
```

- Session-Name pro Aufgabe konstant (z. B. `rimo-zeiterfassung`), Tab-Gruppe beim ersten
  `navigate` mit `group_title` benennen.
- `evaluate` (JS mit async/await) ist das Arbeitstier; Limit: **300 s Runtime.evaluate-Timeout**.
  Lange Warteschleifen vermeiden; curl mit `--max-time` absichern.
- Daemon-Start falls nicht erreichbar: `"$USERPROFILE/.kimi-webbridge/bin/kimi-webbridge.exe" start`

## 3. Element-Adressierung (wichtigste Lektion)

**DOM-`name`-Attribute ändern sich bei jedem Re-Render** (z. B. Perioden-Select hieß nacheinander
`224`, `305`, `549`). Deshalb Elemente IMMER über Inhalt/Struktur adressieren:

| Element | Adressierung |
|---|---|
| Tageszelle | `div.day` mit Text = Monatstag (`'2'`, `'14'` …) |
| Gewähltes Datum | Header-Regex: `/(Montag\|Dienstag\|Mittwoch\|Donnerstag\|Freitag), \d{2}\.\d{2}\.\d{4}/` auf `body.innerText` |
| Perioden-Select | `select` dessen Optionen „September / 2026" o. ä. enthalten |
| Neue-Zeile-Button | `a[title^="Zeit hinzufügen"]` (Tastenkürzel `t`) |
| Projekt-Select | `select` mit Option „70008 0041, Automation & AI" |
| WP-Button | `a` mit Text „Ticket / WP wählen" — liegt in **eigener Tabellenzeile UNTER dem Eintrag** → über `getBoundingClientRect().top` dem Eintrag zuordnen |
| WP-Dialog | Container mit Text „Arbeitspaket wählen" + „PSP Code"; Zeilen: `td[1]` = PSP-Code, `td[2]` = Bezeichnung; Radio = `div.rd`; Bestätigung = `a` mit Text „OK" |
| Tätigkeits-Select | `select` mit Option „Arbeitszeit/ Montage" (Optionen laden erst nach WP-Zuordnung) |
| Tag freigeben | Toolbar-Button per `title^="Tag freigeben"` finden und `onclick()` aufrufen — siehe §9.4 (Hotkey `r` ist unzuverlässig) |
| Status | read-only `input` mit Wert `NEW` oder `SUB` |

## 4. Werte setzen (Framework-kompatibel)

```js
const setVal=(el,v)=>{
  const proto=el.tagName==='SELECT'?HTMLSelectElement.prototype:HTMLInputElement.prototype;
  Object.getOwnPropertyDescriptor(proto,'value').set.call(el,v);
  ['input','change','blur'].forEach(t=>el.dispatchEvent(new Event(t,{bubbles:true})));
};
```

- Von/Bis: `HH:MM` (`07:15`), Stunden-Feld (unbenanntes Input) rechnet sofort um
- Nach Projekt-Wahl **re-rendert die Zeile** → alle DOM-Referenzen neu holen!

## 5. Tageswechsel

Die zuverlässigste Methode ist der **`onclick` der Elternzelle** — die Tageszelle (`div.day`)
selbst hat keinen Handler, ihre Eltern-`TD` trägt `onclick="act('setDay:on:','N',<requestId>)"`:

```js
const d=[...document.querySelectorAll('div.day')].find(e=>e.textContent.trim()==='14');
d.parentElement.onclick();
```

Siehe §9.2. Eine simulierte Maus-Sequenz (`mousedown`/`mouseup`/`click` mit Koordinaten) ist nur
Fallback und kann fehlschlagen. Danach per Header-Regex verifizieren, dass der Ziel-Tag aktiv ist.

## 6. Bekannte Fallstricke

1. **Verwaiste Zeilen („orphan rows")**: Nach „Zeit hinzufügen" erscheint die neue Zeile manchmal
   erst nach >15 s (Server-Roundtrip). Erkennt die Automation sie nicht rechtzeitig, bleibt eine
   Zeile mit Default-Zeiten (Fortsetzung ab letztem Bis) ohne Projekt stehen.
   → Reparatur: Zeile danach gezielt befüllen (Zeiten/Projekt/WP/Tätigkeit) — funktioniert immer.
2. **Veraltete Referenzen**: Nach Projekt-Wahl/WP-Dialog ist das alte Zeilen-Objekt detached.
   → Nach jedem Ajax-Schritt DOM neu abfragen.
3. **WP-Button gehört nicht zur Zeilen-`<tr>`**: er liegt in einer separaten Zeile darunter.
   → Zuordnung über Y-Koordinate (`getBoundingClientRect`).
4. **Tätigkeits-Optionen fehlen**: Sie laden erst nach WP-Zuordnung (und ggf. Projekt).
   → `waitFor` auf die Option „Arbeitszeit/ Montage".
5. **Freigeben-Button flackert**: Toolbar rendert bei jedem Save um; Button mal da, mal weg.
   → Hotkey `r` (vorher `document.activeElement.blur()`).
6. **Parallele Benutzer-Klicks**: Der Tag wechselt „geisterhaft".
   → Vor jedem Schritt Header-Regex prüfen; Benutzer hinweisen.
7. **Buchung auf falschem Tag vermeiden**: Jede Buchungs-Aktion beginnt mit Tages-Check;
   bei Abweichung Tageszelle erneut klicken.
8. **Spurious Date Matches**: `body.innerText.includes('02.09.2026')` kann durch Historien-/Info-
   Panels falsch-positiv sein → nur den Header-Regex verwenden.

## 7. Ablauf einer kompletten Buchung (bewährt)

1. Tab auf `https://rimo.spl-tele.com/rimo` (Login prüfen; ggf. Benutzer einloggen lassen)
2. Zeit → Zeitschreibung; Periode wählen (Select mit Monats-Optionen)
3. Tageszelle per **`onclick` der Eltern-Zelle** aufrufen (siehe 5a); Header-Regex verifizieren
4. `Zeit hinzufügen [t]` klicken; neue Zeile abwarten (`waitFor`, 15 s)
5. Von/Bis setzen; Projekt wählen; 1 s warten (Re-Render)
6. WP-Button der Zeile (Y-Position) klicken; im Dialog PSP-Zeile wählen (`div.rd`), „OK",
   Dialog-Schließen abwarten
7. Tätigkeit „Arbeitszeit/ Montage" setzen (sobald Optionen geladen)
8. Pro Tag wiederholen; Beschreibung = Auto-Text (nicht anfassen)
9. Tag freigeben: Toolbar-Button per Titel finden und `onclick()` aufrufen (Hotkey `r` ist unzuverlässig); Status `SUB` verifizieren
10. Abschluss: Monatskalender prüfen (Stundensummen) + Screenshot pro Tag

## 8. Verifikation

- Kalenderstreifen zeigt pro Tag die Stundensumme (Achtung: aktualisiert zeitverzögert — ggf. Tag erneut anklicken)
- Zeilen-Status: `SUB` = freigegeben, `NEW` = offen
- Freigegebene Zeilen sind gesperrt (Tätigkeit als Text, keine Selects)

## 9. Weitere Fallstricke (Erkenntnisse vom 14./15.09.2026)

### 9.1 Verwaiste `div.mask` blockiert alle Klicks

Nach abgebrochenen Dialogen/Ajax bleibt manchmal eine unsichtbare Maske
(`<div class="mask">`, `opacity:0`) über der Seite liegen. Symptom: Klicks auf
Tageszellen/Buttons kommen nicht an — egal ob synthetisch, Maus-Sequenz oder CDP-Trusted-Input.

Diagnose:
```js
document.elementFromPoint(x,y)   // liefert DIV.mask statt dem Zielelement
```
Fix (kein Dialog offen → Maske ist stale):
```js
[...document.querySelectorAll('div.mask')].forEach(e=>{e.style.pointerEvents='none';e.style.display='none'});
```
Danach `elementFromPoint` erneut prüfen (muss das Zielelement treffen, z. B. `DIV.day`).

### 9.2 Tageswechsel: zuverlässigste Methode ist der `onclick` der Elternzelle

Die Tageszelle selbst (`div.day`) hat KEINEN Handler — ihre Eltern-`TD` hat:
```
onclick="act('setDay:on:','14',126179390977)"
```
Direkter Aufruf (die Request-ID im dritten Argument einfach aus dem Attribut belassen):
```js
const d=[...document.querySelectorAll('div.day')].find(e=>e.textContent.trim()==='14');
d.parentElement.onclick();
```
Das funktioniert auch, wenn simulierte Maus-Events versagen. Danach Header-Regex prüfen.

### 9.3 Eingefrorener Tab (Session-Recovery)

Symptom: `evaluate` UND `screenshot` laufen in Timeouts (30–300 s), Tab antwortet nicht
(vermutlich blockiert ein js-Dialog oder die Seite hängt nach einem abgebrochenen Request).

Recovery:
1. `close_tab` (geht auch bei hängender Seite, läuft über die Extension)
2. Neuen Tab auf `https://rimo.spl-tele.com/rimo` öffnen — **kein erneuter Login nötig**,
   die Browser-Session gilt weiter (Cookie)
3. Weiterarbeiten

### 9.4 Freigabe: Hotkey `r` unzuverlässig → Toolbar-Button per `onclick()`

Der Button `a[title^="Tag freigeben"]` flackert mit Re-Renders, der Tastendruck `r`
wurde in einer Session nicht ausgewertet. Robust:
```js
const btn=[...document.querySelectorAll('a')].find(e=>(e.getAttribute('title')||'').startsWith('Tag freigeben'));
btn.onclick ? btn.onclick() : btn.click();
```

### 9.5 Abgebrochene `evaluate` mitten im Tageswechsel

Wird eine lange `evaluate` (mit Warte-Loops) von außen abgebrochen (Timeout/User-Interrupt),
kann der Server-State vom DOM-State abweichen (Tab zeigt alten Tag, Aktionen laufen ins Leere).
→ Nach jedem Abbruch zuerst Header-Regex lesen und Zustand neu synchronisieren,
im Zweifel Tab neu laden (Session bleibt).

## 10. Erkenntnisse 18.09.2026 (Buchung 15.–18.09., DeepSeek/DSH)

Diese Punkte ergänzen §6 und §9 — sie sind bei der Buchung vom 18.09.2026 aufgetreten und
haben dort zu einer Fehlbuchung geführt (fremde Zeile auf dem falschen Tag).

### 10.1 Der „aktuelle Tag" ist serverseitig pro Session global — nicht pro Tab

Rimo hält den ausgewählten Tag **pro Session (`_s`)** auf dem Server. Zwei Tabs mit demselben
Link teilen sich diesen Zustand: Klick in Tab A wechselt den Tag auch für Tab B. Besonders
tückisch: POSTs eines hängenden Tabs (siehe 10.2) werden **verspätet** ausgeführt und
verschieben den Tag Minuten später — man bucht dann auf einem anderen Tag als die Anzeige zeigt.

**Regel: pro Session immer nur EINEN Tab bedienen.** Vor **jeder** schreibenden Aktion die
Kopfzeile (Header-Regex) lesen; nach jedem Schritt erneut. Nach einem Tageswechsel immer
gegenprüfen (Reload oder frischer Tab) — die Anzeige im selben Tab kann veraltet sein.

### 10.2 Tabs werden „taub": POST ohne Antwort, Aktion trotzdem ausgeführt

Symptom: `new Ajax.Request` wird gesendet, aber **kein** `readystatechange` mehr (readyState
bleibt 1, kein `load`). Triviale `evaluate`-Aufrufe und Seitenaufbau funktionieren weiter.
Der Server führt die Aktion dennoch aus. Folge: Anzeige und Serverzustand laufen auseinander.

Diagnose:
```js
// Hook vor der Aktion setzen, dann Aktion auslösen, dann __rs lesen
window.__rs=[];const S=XMLHttpRequest.prototype.send;
XMLHttpRequest.prototype.send=function(b){const s=this;
  window.__rs.push({ev:'send',b:String(b).replace(/_s=[^&]*/,'_s=X').replace(/_k=[^&]*/,'_k=X').slice(0,90)});
  this.addEventListener('readystatechange',function(){window.__rs.push({ev:'rs'+s.readyState,st:s.status})});
  return S.apply(this,arguments)};
```
Recovery: **frischen Tab** auf denselben `_s`-Link öffnen (Login/Cookie bleibt). Der neue Tab
zeigt den echten Serverstand (inkl. Tag!). Alte Tabs danach nicht mehr anfassen.

### 10.3 Zeitfelder speichern NICHT selbst

Die Von/Bis-`input`s haben **keine** Handler (`onchange`/`onblur` = `null`). Ein `setVal` ändert
nur das DOM. Auf den Server kommt der Wert ausschließlich über

- **„Änderungen speichern [s]"** → POST `341` + `$(form).serializeAll()` + `342=desktopOop`, oder
- als **Nebenwirkung** eines Projekt- (`select[0]`) bzw. Tätigkeitswechsels (`select[1]`) → POST mit `serialize()`.

Wer also Zeiten setzt und danach einen Dialog öffnet, verliert sie beim nächsten Re-Render
(der Server antwortet mit seinem alten Stand). **Regel: Zeiten setzen → sofort speichern →
erst dann Projekt/WP/Tätigkeit.**

### 10.4 Zeilen NIE über Index adressieren

Nach jedem Save sortiert/rendert der Server die Eintragszeilen neu (Sortierung nach Von).
`rows[1]` ist vor und nach einem Save eine andere Zeile. **Immer inhaltlich identifizieren:**
über den Optionstext des Projekt-Selects oder über das Von/Bis-Paar. Beispiel-Matcher:

```js
const rows=[...document.querySelector('form[id^=foo]').querySelectorAll('tr')].filter(tr=>tr.querySelector('select'));
const timesOf=tr=>[...tr.querySelectorAll('input[type=text]')]
  .filter(i=>i.readOnly!==true&&!i.disabled&&(i.className||'').toString().indexOf('desc')<0).map(i=>i.value);
const row=rows.find(tr=>{const t=timesOf(tr);return t[0]==='11:15'&&t[1]==='14:15'});
```

### 10.5 Komplette Buchung je Block — bewährte Reihenfolge

1. `a[title^="Zeit hinzufügen"]` klicken, 3–5 s warten (neue Zeile, Vorgabezeiten).
2. Zeiten setzen (Zeile = die **ohne** Projekt: `select.selectedIndex === 0`).
3. **„Änderungen speichern [s]"** klicken, ~5 s warten.
4. Projekt-Select setzen (`select[0]`, Optionstext beginnt mit `70008 00xx`), ~5 s warten
   (Zeile re-rendert, Namen ändern sich).
5. WP-Button der Zeile: `a` mit Text „Ticket / WP wählen", Zuordnung über
   `getBoundingClientRect().top`-Nähe zur Zeile. Klick, ~4 s warten.
6. Im Dialog „Arbeitspaket wählen": Zeile mit `td`-Text **exakt** = PSP-Code suchen
   (z. B. `37.2`), `div.rd` klicken → Zeile bekommt `class="selected"`; dann `a` mit Text „OK".
7. Tätigkeits-Select (`select[1]`) auf „Arbeitszeit/ Montage" (Optionen laden erst nach WP).
8. „Änderungen speichern [s]" klicken, dann verifizieren (Reload + Zeilen lesen).

### 10.6 Lange Sammel-`evaluate` liefern keine Antwort

Ein `evaluate` mit der ganzen Sequenz inkl. `await sleep(...)` lief serverseitig korrekt durch,
die Antwort kam aber nie zurück (Harness-Timeout, Tab danach „taub"). → **Ein `evaluate` je
Aktion**, dazwischen Pausen von 3–5 s. Fortschritt immer über Reload + Readback prüfen.

