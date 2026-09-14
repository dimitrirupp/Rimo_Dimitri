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
| Tag freigeben | Tastenkürzel **`r`** auf `document.body` (Button flackert mit Re-Renders) |
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

Plain `el.click()` auf `div.day` schlägt manchmal fehl. Zuverlässig ist die Maus-Sequenz:

```js
const r=d.getBoundingClientRect();
const o={bubbles:true,cancelable:true,view:window,clientX:r.x+r.width/2,clientY:r.y+r.height/2};
d.dispatchEvent(new MouseEvent('mousedown',o));
d.dispatchEvent(new MouseEvent('mouseup',o));
d.dispatchEvent(new MouseEvent('click',o));
```

Danach per Header-Regex verifizieren, dass der Ziel-Tag aktiv ist.

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
3. Tageszelle per Maus-Sequenz klicken; Header-Regex verifizieren
4. `Zeit hinzufügen [t]` klicken; neue Zeile abwarten (`waitFor`, 15 s)
5. Von/Bis setzen; Projekt wählen; 1 s warten (Re-Render)
6. WP-Button der Zeile (Y-Position) klicken; im Dialog PSP-Zeile wählen (`div.rd`), „OK",
   Dialog-Schließen abwarten
7. Tätigkeit „Arbeitszeit/ Montage" setzen (sobald Optionen geladen)
8. Pro Tag wiederholen; Beschreibung = Auto-Text (nicht anfassen)
9. Tag mit Hotkey `r` freigeben; Status `SUB` verifizieren
10. Abschluss: Monatskalender prüfen (Stundensummen) + Screenshot pro Tag

## 8. Verifikation

- Kalenderstreifen zeigt pro Tag die Stundensumme (Achtung: aktualisiert zeitverzögert — ggf. Tag erneut anklicken)
- Zeilen-Status: `SUB` = freigegeben, `NEW` = offen
- Freigegebene Zeilen sind gesperrt (Tätigkeit als Text, keine Selects)
