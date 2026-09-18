# Sprint-Planung in Rimo — Analyse für Dimitri Rupp

Stand **18.09.2026**, live gelesen in Rimo (SprintGroup „IT & Digital Transformation Sprints",
Sprint „IT & Digital Transformation 09/26 1/2", MyTasks) + Rimo-Wiki (wiki.rimo-systems.com).
Alle Zahlen sind abgelesen, nicht geschätzt. Quellen stehen am Ende.

---

## 1. Das Konzept in einem Satz

**Arbeitspaket (WP) → Person (Ressource) → Sprint.** Ein WP hat eine *geplante Dauer* in Stunden
und wird einer oder mehreren Personen zugewiesen (jede mit eigenem Stundenanteil). Wird das WP
einem **Sprint** zugeordnet, zählt der persönliche Anteil als **„Geplant (h)"** dieser Person in
diesem Sprint. Rimo stellt das der **„Verfügbar (h)"** der Person gegenüber — daraus entsteht die
Auslastung. Die **Zeiterfassung** (Zeitschreibung) läuft getrennt und liefert den Ist-Wert.

Es gibt also **zwei verschiedene Zahlenwelten**, und das ist die Hauptquelle der Verwirrung:

| | Planung (Sprint) | Ist (Zeiterfassung) |
|---|---|---|
| Wo | Projekt → Sprints → Sprint → Tab „Info" / „Arbeitspakete" | Zeit → Zeiterfassung |
| Einheit | WP mit geplanter Dauer (h) | Zeiteintrag mit Von/Bis je Tag |
| Meine Zahl | **Geplant (h)** im Sprint | gebuchte Stunden je Tag/Periode (9,25 / 5,75) |

Die tägliche Buchung (9,25 h / 5,75 h) ist **kein** Bestandteil der Sprint-Planung. Sie ist die
Ist-Seite. Die Sprint-Planung sagt nur: *welche WPs mit wie vielen Stunden sind für mich in diesem
Zeitraum vorgesehen.*

## 2. Begriffe (wörtlich aus dem Rimo-Wiki, Info-Tab des Sprints)

| Feld (dt. UI) | Wiki-Begriff | Bedeutung / Berechnung |
|---|---|---|
| Verfügbar (d) | Avail. (d) | Arbeitstage im Sprint minus Urlaub/ganztägige Abwesenheiten |
| **Verfügbar (h)** | Avail. (h) | Verfügbar (d) × h/Tag **lt. Arbeitszeitmodell** |
| inaktiv / aktiv / in Arbeit / geschlossen | inactive/active/inProgress/closed | WP-Stunden je Status, die mir zugewiesen sind |
| Geschwindigkeit | Velocity | geschlossene geplante Stunden ÷ Verfügbar (d); erst beim Sprintwechsel berechnet |
| **Geplant (h)** | Planned (h) | **Summe meiner Anteile an allen WPs des Sprints** (alle Status) |
| **Planbar (h)** | Planable (h) | Verfügbar (h) − Geplant (h) = was ich noch verplanen kann; rot wenn negativ |
| Offen (h) | Open (h) | mein Anteil × Restfortschritt des WPs (noch abzuarbeiten) |
| Übrige Zeit | Time left | Stunden der verbleibenden Tage bis Sprintende inkl. heute |
| — | My pl. (h) | mein persönlicher Stundenanteil **an einem einzelnen WP** (Spalte „Meine gepl. (h)") |

Merksatz: **Geplant (h) ist das, was ich steuere** — es ist die Summe der persönlichen Anteile
an den WPs, die im Sprint hängen. Nicht die gebuchte Zeit, nicht die WP-Gesamtdauer.

## 3. Meine Zahlen im aktiven Sprint (09/26 1/2, 01.09.–18.09.2026, 14 Arbeitstage)

| Kennzahl | Wert |
|---|---|
| Verfügbar (d) | 14 |
| **Verfügbar (h)** | **107,80** |
| aktiv (= Geplant) | 63,60 |
| **Geplant (h)** | **63,60** (≈ **59 %** Auslastung) |
| **Planbar (h)** | **44,20** |
| Offen (h) | 63,60 (Fortschritt aller WPs noch 0 %) |
| Übrige Zeit | 7,70 |

Daraus ableitbar: **107,80 ÷ 14 = 7,70 h/Tag → 38,5 h/Woche.** Rimo rechnet für mich also mit
einem Arbeitszeitmodell von **38,5 h/Woche**.

Vergleich im selben Sprint (Info-Tab): Gurschka 91,00/92,40 (98 %) · Prüßmeier 88,00/107,80 (82 %)
· Richter 30,00/30,80 · Petru 18,00/84,00 (21 %) · Svoboda 2,40/107,80 · alle übrigen 0,00.
→ Die meisten Kolleg:innen haben in diesem Sprint **nichts** verplant; nur drei Personen haben
nennenswerte Geplant-Werte.

**Der aktive Sprint endet heute (18.09.2026).** Der nächste, **09/26 2/2 (21.09.–02.10.2026)**,
hat 7 WPs und 0,80 h Split-Volumen — also praktisch noch keine Planung.

## 4. Meine Arbeitspakete (MyTasks, 18.09.2026)

**29 WPs sind mir zugewiesen** (Liste zeigt 25; sie ist paginiert „1 bis 25 von 29").

| Sprint-Zuordnung | Anzahl | WPs (Dauer in h) |
|---|---|---|
| **09/26 1/2** (aktiv) | 6 | 47.4 Monitoring (2) · 50.2 TEF (6) · 47.7 BMD (2) · 63 Redpath-NOC (12) · 64 Transformation Blue (24) · 65 Einschulung Raffi (6) = **52 h WP-Dauer** |
| IT Backlog | 3 | 46.1 Handover Sonderegger (8, 50 %) · 38.1 Cubic Copilot Labelling (16, 25 %) · 47.8 Application Management (80, 50 %) |
| 07/26 1/2 (vorbei) | 3 | 367 Ausschreibungs-Agent (40) · 48.2 Requirements Engineering (8) · 49.2 Secret Management Infisical (12) |
| 06/26 1/2 (vorbei) | 3 | 35.2 UiPath Academy (8) · 40 BluePath Ticketerstellung (24, 25 %) · 43 RIC Excel-Konsolidierung (24) |
| 06/26 2/2 (vorbei) | 1 | 12 Closeout (15) |
| **kein Sprint** | **9** | 2 Berechtigungsstrukturen (24) · 2 Prozesse B&W (112) · 2 ruppd Stundenschreibung (30) · 1.5 Go-Live (0) · 5 Projekt Management und Administration (40, **in Arbeit**, 25 %) · 395 WP5 Go-Live+Hypercare (80) · 1.4 Build Feature Complete (0) · 36.2 Administratives & Internes (0) · 1.6 Hypercare-Ende (0) |

Auffällig:
- **9 WPs hängen in keinem Sprint** — sie zählen in *keiner* Sprint-Auslastung mit. Das ist der
  größte Einzelhebel.
- **7 WPs hängen in längst vergangenen Sprints** (06/26, 07/26) — abgeschlossene Zeiträume.
- Fast alle WPs stehen auf **0 % Fortschritt**, obwohl auf mehreren seit Monaten gebucht wird
  (z. B. 64 Transformation Blue seit 01.09., 5 PM & Administration „in Arbeit").
- Status: keine geschlossenen WPs in der Liste, ein WP „in Arbeit", der Rest „aktiv".

## 5. Kann ich meine WPs bearbeiten / schließen? (live am eigenen WP geprüft)

Aktionsmenü am WP „64: Transformation Blue" (mein eigenes WP) — vollständig:

> Kommentar hinzufügen · Zeiteintrag erstellen · Upload · Team zuweisen · Person zuweisen ·
> Split · Serie erstellen · Als ungelesen markieren · Link kopieren · Mail senden ·
> Kontakt hinzufügen · Extern bestellen · Abhängigkeit erstellen · Arbeitsauftrag erstellen ·
> **Sprint zuweisen** · **wieder öffnen** · Aktivitätsprotokoll

Zusätzlich direkt in der Zeile: **„Zuweisung aufheben"** (mich vom WP entfernen) und „Link to MS".

Daraus folgt verifiziert:

- **Bearbeiten: ja.** Der WP-Editor ist über das Aktionsmenü („EDITOR") bzw. per Doppelklick auf
  die Zeile erreichbar; Felder wie geplante Dauer, Start/Ende, Fortschritt und Zuordnungen sind
  dort pflegbar. In der Listenansicht selbst gibt es keinen „Speichern"-Button — gespeichert wird
  im Editor.
- **Sprint zuweisen: ja** — genau der Menüpunkt, der fehlt, wenn ein WP „keinen Sprint" hat.
- **Zeiteintrag erstellen: ja** (auch über die Toolbar „Neuer Zeiteintrag").
- **Schließen: nicht direkt im WP-Menü.** Laut Rimo-Wiki läuft das Schließen über den
  **Usertask** (Dispatching: „verfügt ein WP über nur einen Usertask, wird beim Schließen des
  Usertasks auch gleich das WP geschlossen") bzw. beim Zeitschreiben über das Häkchen
  **„Close WP?"**, das erscheint, wenn das WP bereits „in Progress" ist.
  „wieder öffnen" (Reopen) ist im Menü vorhanden.
- **Kein Löschen** im Menü — WPs werden geschlossen, nicht gelöscht (passend zur Leitplanke).

## 6. Wie die vergangenen Sprints aussahen (Sprint-Tabelle der Gruppe)

| Sprint | Zeitraum | WPs | Split-Arbeitspakete |
|---|---|---|---|
| 05/26 1/2 | 01.05.–15.05.2026 | 19 | 3,80 h |
| 05/26 2/2 | 18.05.–29.05.2026 | 10 | 3,80 h |
| 06/26 1/2 | 01.06.–19.06.2026 | 12 | 0,80 h |
| 06/26 2/2 | 22.06.–30.06.2026 | 8 | 0,80 h |
| **07/26 1/2** | 01.07.–17.07.2026 | **26** | **92,59 h** |
| **07/26 2/2** | 20.07.–31.07.2026 | 17 | **61,18 h** |
| 08/26 1/2 | 03.08.–14.08.2026 | 10 | 16,80 h |
| 08/26 2/2 | 17.08.–31.08.2026 | 18 | 15,55 h |
| **09/26 1/2** | 01.09.–18.09.2026 | 7 | 0,80 h |
| 09/26 2/2 | 21.09.–02.10.2026 | 7 | 0,80 h |
| 10/26 1/2 | 05.10.–16.10.2026 | 7 | 0,80 h |
| IT Backlog | 17.03.2023–31.01.2028 | 2 | 123,75 h |

Lesart: „Split-Arbeitspakete pro Sprint" = *Anzahl gesplitteter WPs / weggesplittete Stunden*
(Wiki). Juli 2026 ist mit 92,59 h bzw. 61,18 h weggesplitteter Arbeit der auffälligste Monat —
dort wurde die Planung massiv umgebaut. Seit September sind es nur noch 0,80 h, dafür sind die
Sprints mit 7 WPs auch dünn besetzt. Ein Muster „so wurde früher geplant" ist in der Verteilung
also nicht erkennbar — die Planung war im Juli volatil und ist seither dünn.

## 7. Der Weg zu „36–38 h ausgebucht"

**Achtung — offene Definitionsfrage:** Rimo rechnet für mich mit **7,70 h/Tag = 38,5 h/Woche**
(siehe §3). Die Zahl **42,5** taucht in der Sprint-Planung nirgends auf. Meine *tatsächlich
gebuchte* Woche ist 9,25 × 4 + 5,75 = **42,75 h**. Vor dem Rechnen muss also geklärt werden,
worauf sich die 42,5 beziehen (Arbeitsvertrag? HR-Profil? AZN?). Siehe Frage unten.

Rechenwege, sobald die Basis klar ist (gleiche Mechanik, nur anderer Nenner):

| Ziel-Basis | Wochen-Ziel | Hochrechnung auf einen Halbmonats-Sprint (14 AT ≈ 2,8 Wochen) | Anteil an Verfügbar (107,80) |
|---|---|---|---|
| 42,5 h/Woche | 36–38 h | 100,8–106,4 h Geplant | 94–99 % |
| 38,5 h/Woche (Rimo) | 36–38 h | 100,8–106,4 h Geplant | 94–99 % |
| 38,5 h/Woche (Rimo) | 80 % (bisheriges Ziel) | ~86 h Geplant | 80 % |

Aktuell: **63,60 h von 107,80 h = 59 %** — es fehlen also rund **37–43 h Geplant** bis zum Ziel.

**Die Stellschrauben (in dieser Reihenfolge):**

1. **WPs ohne Sprint zuordnen** (9 Stück, §4) — Aktionsmenü → „Sprint zuweisen". Ohne Sprint
   zählt ein WP in keiner Auslastung.
2. **Persönlichen Anteil setzen** — „My pl. (h)" je WP. Die WP-Gesamtdauer (z. B. 112 h bei
   „2: Prozesse B&W") ist **nicht** automatisch mein Anteil; ich kann z. B. 12 h von 112 h haben.
3. **Fortschritt pflegen** — „Offen (h)" und die Velocity hängen am Fortschritt; 0 % bei
   monatelanger Buchung verzerrt jede Auswertung.
4. **Nächsten Sprint befüllen, bevor er startet** — 09/26 2/2 (21.09.–02.10.) ist praktisch leer.
   Die Sprint-Zuordnung ist der einzige Weg, „Geplant (h)" zu erzeugen.

## 8. Umgesetzt am 18.09.2026 — Planung Sprint 09/26 2/2

Freigabe durch Dimitri: „bestehen bereits sprints für die nächsten 2 wochen? wenn ja, dann bitte die
workpackages für mich zuordnen. auslastung sollte ca. 30 bis 33 stunden pro woche betragen.
hauptanteil soll projekt transformation blue sein mit 2/3." (Basiskorrektur: **38,5 h/Woche** ist
die richtige Zahl, die 42,5 waren ein Irrtum.)

Sprint **09/26 2/2** (21.09.–02.10.2026, 10 Arbeitstage). Vorher: **Geplant = 0**. Zuordnung über
WP-Aktionsmenü → „Sprint zuweisen":

| WP | Meine gepl. (h) | Neuer Sprint-Zeitraum (von Rimo gesetzt) |
|---|---|---|
| **5: Projekt Management und Administration** (70008 0042 Transformation Blue) | **40** | 21.09.2026 08:00 – 25.09.2026 16:00 |
| 50.2: TEF Telefonica und andere RPA Projekte | 6 | 21.09.2026 08:00 – 21.09.2026 14:00 |
| 47.7: BMD Support | 2 | 21.09.2026 08:00 – 21.09.2026 10:00 |
| 47.4: Monitoring | 2 | 21.09.2026 08:00 – 21.09.2026 10:00 |
| 63: Redpath – NOC | 12 | 21.09.2026 08:00 – 22.09.2026 12:00 |
| | **62** | |

**Readback Sprint-Info (18.09.2026):** Verfügbar (h) 77,00 · aktiv 22,00 · in Arbeit 40,00 ·
**Geplant (h) 62,00** · Planbar (h) 15,00 · Offen (h) 52,00 · Übrige Zeit 84,70.
→ **31 h/Woche** (Ziel 30–33 ✓), Transformation-Blue-Anteil **40/62 = 65 % ≈ 2/3 ✓**.

**Zwischenfall und Behebung:** Ein erster Auswahlversuch traf die *äußere* Dialog-Tabellenzeile
(dort hängt der erste Radio) und setzte WP 5 versehentlich auf „BE Backlog". Ursache: der Selektor
`tr` mit `div.rd` matcht auch verschachtelte Container-Zeilen. **Fix: nur Blattzeilen**
(`tr.querySelectorAll('tr').length === 0`) und exakter Namensvergleich auf die Sprint-Spalte;
die Auswahl wird über `class="selected"` der Zeile verifiziert, erst dann „OK". Korrigiert und
verifiziert.

**Wichtig für die Wiederholung:** Der Dialog „Sprint zuweisen" fragt **keine Stunden** ab — die
geplanten Stunden kommen aus „Meine gepl. (h)" des WPs (= volle WP-Dauer, da Dimitri einziger
Ressource ist). Rimo setzt „Geplanter Start/Ende" beim Zuordnen selbst in den Sprintzeitraum.

## 9. Offene Punkte / Wissenslücken

- **42,5 vs. 38,5:** Woher kommt die 42,5? (Rimo-Sprintplanung nutzt 38,5 h/Woche.)
  → Mein HR-Profil unter *Ressource → (Person) → HR-Profil → Arbeitszeitmodell* wurde **nicht**
  geprüft; dort steht die maßgebliche Wochenstundenzahl.
- **„Meine gepl. (h)" je WP** ist in MyTasks nicht als Spalte eingeblendet — die Einzelanteile
  wurden daher nicht je WP gelesen, sondern nur die Summe (63,60 h) aus dem Sprint-Info.
- 4 der 29 WPs wurden nicht gelesen (Liste paginiert „1 bis 25 von 29").
- Ob das Schließen bei mir tatsächlich durchgeht, wurde **nicht** getestet (Schreibzugriff).

## Quellen

- Live: Rimo 18.09.2026 — `Projekt → Sprints → IT & Digital Transformation Sprints`
  (Sprint-Liste, Sprint 09/26 1/2 → Tab Info, Tab Arbeitspakete), `Projekt → Meine Aufgaben`,
  WP-Aktionsmenü an „64: Transformation Blue". Session `_s`/`_k` nicht dokumentiert (Zugangsdaten).
- Rimo-Wiki (abgerufen 18.09.2026):
  - Sprints/Info-Tab-Attribute: <https://wiki.rimo-systems.com/index.php?title=Projectplus/Projekt_Management/Modul%C3%BCbersicht_und_-beschreibung/Sprints>
  - KPI (Velocity, Soll/Ist, Split-WPs): <https://wiki.rimo-systems.com/index.php?title=Projectplus/Projekt_Management/Key_Performance_Indicators>
  - MyTasks (Filter, Menü): <https://wiki.rimo-systems.com/index.php?title=Projectplus/Projekt_Management/Modul%C3%BCbersicht_und_-beschreibung/MyTasks>
  - Arbeitszeitmodell am Userprofil (HR-Profil) / h je Tag: <https://wiki.rimo-systems.com/index.php?title=Resource>
  - „Close WP?" beim Zeitschreiben: <https://wiki.rimo-systems.com/index.php?title=Projectplus/Add-Ons/Time_and_Travel/Zeitschreibung>
  - WP schließen über Usertask: <https://wiki.rimo-systems.com/index.php?title=App_Neu/Projectplus_mittels_neuer_App>
- Repo-Doku: `docs/sprints.md` (Stand 14.09.2026), `docs/projekte-arbeitspakete.md`
