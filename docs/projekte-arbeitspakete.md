# Rimo – Projekte & Arbeitspakete (Dimitri Rupp)

Stand 28.09.2026. Buchungsrelevante Projekte im Zeit-Modul („Projekt / Auftrag"-Dropdown):

## Projekte

| Projekt/Auftrag | Name | Bemerkung |
|---|---|---|
| **70008 0042** | **Transformation Blue** | Hauptprojekt, höchste Priorität |
| 70008 0041 | Automation & AI | Sammelprojekt Automatisierung/KI |
| 70008 0043 | NOC Automatisierung | |
| 70008 0001 | Project-Overhead CC - IT & Digital Transformation | **nicht im Dropdown** — über SO-Suchdialog wählen |
| 70008 0020 | Rimo Stundenschreibung | **nicht im Dropdown** — über SO-Suchdialog wählen |
| 70006 0001 | Project-Overhead CC - SPL Tele IT | z. B. WP 367, 395 |
| 70008 | CC - IT & Digital Transformation | Übergeordneter Auftrag (nicht direkt buchen) |

> **Dropdown-Falle (verifiziert 28.09.2026):** Das Projektfeld der Zeitschreibung bietet nur
> `70008 0041`, `70008 0042`, `70008 0043` und `70008` an. Projekte wie `70008 0001` sind
> ausschließlich über den Link `title="Search SO"` erreichbar (Ablauf: `docs/automatisierung.md`
> §11.6).

Daneben existiert **70008 0001 Project-Overhead CC - IT & Digital Transformation** (WP 12 Closeout,
**63 Redpath - NOC**, 64 Transformation Blue, 65 Einschulung Raffi, 66 Update KI Server,
68 RPA Analyse Kundentool) und **70008 0020 Rimo Stundenschreibung** (WP 2 „ruppd Stundenschreibung").

## Arbeitspakete für die tägliche Buchung

| Projekt | PSP | Arbeitspaket | Thema |
|---|---|---|---|
| 0042 | 5 | Projekt Management und Administration | Hauptbuchungsblock Transformation Blue |
| 0041 | 37.2 | Mobile Netze DE "Close Out" | CloseOut-Datenübernahme |
| 0041 | 50.2 | TEF Telefonica und andere RPA Projekte | TEF Telefonica |
| 0041 | 47.7 | BMD Support | BMD Support |
| 0041 | 47.4 | Monitoring | Unterhalt/Monitoring interne IT |
| 0041 | 47.8 | Application Management | interne IT-Anwendungen |
| 0041 | 36.2 | Administratives & Internes | Internes |
| 0041 | **54** | **GitLab** | neu angelegt **28.09.2026** (Dimitri), 20 h geplant, Sprint 09/26 2/2 — Installation, Konfiguration, Report-Seiten, Präsentation, Anpassungen, Tests |
| 0043 | 2 | Prozesse B&W | NOC Automatisierung |
| **0001** | **63** | **Redpath - NOC** | NOC Redpath (12 h im Sprint 09/26 2/2) |

> **WP-Namensfalle:** WP 63 heißt „Redpath - NOC" in **70008 0001**, WP 2 heißt „Prozesse B&W" in
> **70008 0043** (NOC Automatisierung). „NOC Redpath" ≠ „NOC Automatisierung" — vor dem Buchen
> klären, welches der beiden gemeint ist (im Zweifel fragen).

Hinweis: Mehrere WPs gleichen Namens existieren mit verschiedenen PSP-Codes und Status
(z. B. 37.1/37.2/37.3 „Mobile Netze DE Close Out", 50.1/50.2/50.3 „TEF Telefonica").
**Immer auf den PSP-Code + Status „aktiv"/„in Arbeit" achten**, nicht auf den Namen.

## Weitere WPs in 0042 Transformation Blue (aus PM Board)

2 Berechtigungsstrukturen · 3.2 BMD-Rimo Rechnungsprozess · 4.2 Stammdaten Rimo-BMD ·
6 Field Quality Assurance: Vyntelligence · 7 Work & Service Management ·
9.2 Daten Lucanet Initialsetup · 11 Lohnarten BMD 2 Board · 12 Migration Jira datasource

## Ansichten

- **Projekt → Meine Aufgaben**: Liste aller eigenen WPs mit Sprint-Zuordnung, geplanten Stunden, Fortschritt
- **Mein PM Board**: Kanban (NEU / VORBEREITUNG / DURCHFÜHRUNG / NACHBEARBEITUNG / ABRECHNUNG) je Projekt; 70008 0041 zeigt INAKTIV/AKTIV-Spalten aller WPs
- WP-Karte zeigt: PSP-Code, Titel, geplante Dauer, Anzahl Ressourcen, Sprint
