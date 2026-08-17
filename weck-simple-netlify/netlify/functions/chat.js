// Netlify Function: /.netlify/functions/chat
// Recibe { message: string } y devuelve { reply: string }.
// El "conocimiento" de la empresa está embebido directamente en el prompt
// del sistema (KNOWLEDGE_BASE más abajo) — no hay base de datos, no hay
// embeddings, no hay Supabase. Simple a propósito, para un primer test rápido.

const KNOWLEDGE_BASE = `
UNTERNEHMEN:
Weck Dental Technik GmbH ist ein familiengeführtes Dentallabor in Langenfeld
(Rheinland), Nordrhein-Westfalen. Es unterstützt Zahnarztpraxen bundesweit bei
der Herstellung von Zahnersatz, mit einer Kombination aus traditionellem
zahntechnischem Handwerk und moderner digitaler Fertigung (CAD/CAM,
Intraoralscanner, 3D-Druck).

KONTAKT:
Adresse: Hausinger Str. 3b, 40764 Langenfeld
Telefon: 02173 – 85 23 40
WhatsApp: +49 15170588073
E-Mail: info@weckdental.de
Öffnungszeiten: Mo, Di, Do 8:00–18:00 Uhr; Mi 8:00–17:00 Uhr; Fr 8:00–14:30 Uhr.
Das Gebäude ist barrierefrei. Für Beratungen und Passproben bitte vorher einen
Termin vereinbaren.

TEAM:
Inhaberin: Sabine Weck (Zahntechnikermeisterin).
Laborleiter: Gunnar W. (Zahntechnikermeister).
Das Team umfasst Fachbereiche wie Keramik, Kunststofftechnik/Galvano/Valplast,
Edelmetall/Modellguss, CAD/CAM, Arbeitsvorbereitung, Verwaltung sowie eigenen
Versand- und Botendienst für Praxen.

DIGITALES KUNDENPORTAL:
Weck Dental hat ein Kunden-/Patientenportal, über das Praxen und Patienten
digital Aufträge übermitteln, Kostenvoranschläge hochladen, Abholtermine für
den Botendienst buchen sowie Fotos, Videos und Dateien senden können.

LEISTUNG – VOLLKERAMIK & ZIRKONOXID-KRONEN:
Metallfreier Zahnersatz aus Zirkonoxid für Einzelkronen, Brücken,
Implantatversorgungen. Vorteile: metallfrei (gut bei Allergien), hohe
Bruchfestigkeit auch im Seitenzahnbereich, natürliche Farbverläufe durch
Multilayer-Rohlinge, keine dunklen Ränder am Zahnfleisch, gute
Langzeitprognose, Kosten unabhängig vom Goldpreis. Für Inlays/Onlays/Veneers
wird oft Lithiumdisilikat-Glaskeramik verwendet (sehr lichtdurchlässig).

LEISTUNG – TELESKOPPROTHETIK & DOPPELKRONEN:
Kombiniert festsitzend-herausnehmbarer Zahnersatz: eine fest zementierte
Primärkrone plus eine Sekundärkrone, die Teil der herausnehmbaren Prothese
ist. Erfordert präzise Analyse der Einschubrichtung, kontrollierte
Friktionseinstellung und ein strukturiertes Vorgehen (Analyse, Modell,
Parallelometer, Primärkronen, Sekundärstruktur, Einprobe, Fertigstellung,
Endkontrolle).

LEISTUNG – METALL- & EDELMETALL-ZAHNERSATZ:
NEM (Nicht-Edelmetall): wirtschaftlich, hohe Belastbarkeit, für Kronen/Brücken.
VMK (Verblend-Metall-Keramik): Metallgerüst plus Keramikverblendung, sehr
verbreitet und bewährt. Edelmetall/Gold: seltener, aber gute Option für
Inlays, Onlays, Kronen, Brücken, Stege, Abutments. Galvanotechnik: Keramik
kombiniert mit dünner Feingold-Innenschicht, hohe Passgenauigkeit.

LEISTUNG – PROTHESEN (HERAUSNEHMBARER ZAHNERSATZ):
Drei Produktlinien: Premium (höchste Qualität/Ästhetik), Basic-Line (gutes
Preis-Leistungs-Verhältnis), Eco-Angebot (günstig, ideal für
Interimsprothesen). Prothesenarten: Totalprothese (bei vollständigem
Zahnverlust), Modellgussprothese/Teilprothese (bei Restzähnen),
Interimsprothese (temporäre Übergangslösung).

LEISTUNG – IMPLANTATGETRAGENER ZAHNERSATZ:
Implantatkronen (verschraubt oder zementiert), implantatgetragene Brücken,
Stegkonstruktionen, Teleskoparbeiten auf Implantaten, individuelle Abutments
aus Titan oder Zirkon. Digitaler Workflow mit Intraoralscannern von der
Datenübernahme bis zur Suprakonstruktion.

LEISTUNG – VALPLAST (FLEXIBLE TEILPROTHESEN):
Biokompatibles, thermoplastisches Nylonmaterial für flexible, metallfreie
Teilprothesen ohne sichtbare Metallklammern. Vorteile: metallfrei, hohe
Ästhetik, komfortabel, minimalinvasiv, bruchresistent. Zwei Fertigungswege:
klassisch mit Abdrücken oder komplett digital mit Intraoralscan/CAD-CAM.
Geeignet bei Zahnlücken, ästhetisch sensiblen Bereichen, Interimsversorgungen
und Metallallergien.

LEISTUNG – ABFORMUNGEN MIT MUNDSCANNERN (Intraoralscanner):
Digitale Abformung statt klassischem Abdruck ist heute Standard. Weck Dental
verarbeitet Scandaten aller gängigen Intraoralscanner-Marken direkt im
digitalen CAD/CAM-Workflow. Vorteile: direkte Datenübermittlung ans Labor,
höchste Präzision, weniger Korrekturen/Neuanfertigungen, schnellere
Fertigung, mehr Patientenkomfort, planbarere Praxisabläufe. Der Workflow
reicht von digitaler Modellherstellung über Konstruktion bis zur
CAD/CAM-Fertigung. Bei Fragen zu Scannerkompatibilität oder Schulungen:
Telefon 02173 – 85 23 40.

LEISTUNG – ALLERGIEFREIER ZAHNERSATZ AUS KUNSTSTOFFEN (PEEK, Valplast,
Clearsplint): Metallfreie Alternativen für Patienten mit Metallallergie,
ganzheitlich orientierter Behandlung, empfindlichen Schleimhäuten oder hohem
ästhetischem Anspruch bei Interimsversorgungen.
- PEEK (Polyetheretherketon): Hochleistungspolymer mit knochenähnlicher
  Elastizität, geringem Gewicht, röntgentransparent, keine bekannten
  allergischen Reaktionen. Einsatz: provisorische Implantatabutments,
  Aufbissschienen, mehrgliedrige Brücken, Teleskopkonstruktionen,
  Modellgussprothesen mit Retentionselementen.
- Valplast: Nylonbasis, weltweit bewährt. Frei von Metall/Allergenen,
  gewebefreundlich, unzerbrechlich, hohe Transluzenz, geruchsneutral,
  plaque-/verfärbungsresistent, CE-zertifiziertes Medizinprodukt. Einsatz:
  Teilprothesen, Kinderprothesen, Interimsversorgungen, implantatgetragene
  Übergangslösungen.
- Clearsplint: MMA-freier (Methylmethacrylat-freier), metallfreier,
  transparenter Spezialkunststoff. Thermoaktiv flexibel, sehr belastbar,
  bruchstabil, unsichtbare Halteelemente. Einsatz: herausnehmbarer
  Zahnersatz, ästhetische Interimsversorgungen (bis ca. 6 Monate),
  MMA-freie Aufbissschienen. Für Labor/Praxis: leicht nachzuarbeiten, gut
  polierbar, unterfütterbar, kurze Produktionszeit.

LEISTUNG – ZAHNÄSTHETIK (aus Patientensicht): Keramik-Veneers (hauchdünne
Keramikschalen zur Korrektur verfärbter/verdrehter/abgesplitterter
Frontzähne, erhalten den natürlichen Zahn), Keramik-Inlays (ästhetische
Alternative zu Amalgam/Kunststoff/Gold-Füllungen, kaum erkennbar), Vollkeramik
ohne Metall (Kronen/Brücken, verträglich, farblich exakt anpassbar),
Zirkonoxid-Zahnersatz (Hochleistungskeramik, auch für Implantatversorgungen).

LEISTUNG – DENTALTECHNOLOGIEN (Überblick digitale/technische Verfahren):
digitale Abformung via Intraoralscanner, Implantattechnik mit 3D-Navigation,
Kombinationsarbeiten aus Edelmetall, Galvanotechnik (elektrochemischer
Feingoldauftrag auf das Modell — dünner/homogener als Guss, bessere
Passgenauigkeit, weniger Poren, hygienischer), Friktionserneuerung und
Friktionsvergoldung (für Teleskop-/Doppelkronen), Vollkeramik/Glaskeramik/
Metallkeramik, sowie Totalprothetik nach Prof. Gutowski (aufwändige
Kiefervermessung für besseren Sitz und Halt durch Unterdruck/Saugwirkung,
ganz ohne Implantate).

LEISTUNG – ERGÄNZENDE LEISTUNGEN FÜR PATIENTEN: Aufbissschienen (mit/ohne
adjustierter Oberfläche), Sportmundschutz (nach DGZMK-Empfehlung für alle
gängigen Sportarten), Schnarcherschienen, Aligner-Schienen (auch per
3D-Druck gefertigt), persönliche Beratung/Anpassung direkt im Weck-Labor,
sowie persönliche Unterstützung der Behandlung durch Zahntechniker direkt
in der Zahnarztpraxis vor Ort.

GEBURTSTAGE VON ÄRZTEN UND PRAXISMITARBEITERINNEN: Für Fragen wie "wer hat
bald Geburtstag" nutze IMMER den ANSTEHENDE_GEBURTSTAGE-Abschnitt weiter
unten (falls vorhanden) — dort sind die Tage bis zum Geburtstag bereits
korrekt vorgerechnet.

LIEFERANT – ZAHNWERK FRÄSTECHNIK GMBH (Preisliste 2026, gültig ab 1. Februar
2026): Dentales Fertigungszentrum für Fräsarbeiten und 3D-Druck, am selben
Standort wie Weck Dental (Hausinger Str. 3b, 40764 Langenfeld). Gegründet
2006 in Solingen. Kontakt: +49 (0)2173 2005944, zahnwerk-fraestechnik.de.
Geschäftsführung: Darko Savic (ZT) und Sabine Weck (ZTM), Prokurist Horst
Weck. Team u. a.: Marvin Andritzke (Büromanagement), Jurij Kan
(Fertigungsleiter), Tobias Welzel, Nicole Keller, Firas Kassar, Nils Roeder,
Katharina Evertz (ZTM), Jesus Jimenez, Panagiotis Baklavas (CAM), Michaela
Schmidtke, Pascal Weick, Söhret Deniz.

Zahlungsbedingungen: 10 Tage nach Rechnungsdatum abzgl. 2% Skonto, oder
30 Tage netto ohne Abzug; 3% Skonto bei SEPA-Lastschriftmandat. Alle Preise
zzgl. 19% MwSt. und ggf. Versandkosten.

WICHTIG: Die Preise unterscheiden sich je nachdem, WIE der Auftrag
eingereicht wird — Datentransfer (eigene CAD-Konstruktion) ist am
günstigsten, Intraoraldaten-Transfer (Rohdaten vom Scanner) liegt in der
Mitte, Modelleinsendung (physisches Modell) ist am teuersten, da Zahnwerk
dort selbst konstruiert.

--- PREISE BEI DATENTRANSFER (eigene Konstruktion eingereicht) ---
Zirkonoxid: ZrO2 opaque/transluzent 28,90€ · priti extra transluzent 35,90€
· priti multitransluzent plus 38,90€ · Katana UTML 39,90€ · Katana YML
42,90€ (kein Aufpreis für vollanatomische Fräsung).
Glaskeramik: IPS e.max CAD 52,90€ · Composite 49,90€ (Aufpreis vollanat.
4,90€).
CoCr additiv (Lasermelting): 13,90-17,90€ · Primärteleskop 13,90€.
CoCr gefräst: 24,90€ (Aufpreis vollanat. 2,90€) · Primärteleskop 26,90€ ·
Implantatstrukturen (Medentika Preform 99,90€, Brückenpfosten 117,90€,
Brückenglied 15,90€, Stegpfosten 117,90€, Steganteil 11,90€).
Titan: 26,90€ (Aufpreis vollanat. 2,90€) · Primärteleskop 28,90€ ·
Implantatstrukturen (Medentika Preform 99,90€, Brückenpfosten 119,90€,
Brückenglied 15,90€, Stegpfosten 119,90€, Steganteil 11,90€).
Original-Preform-Abutments mit Herstellergarantie: Camlog/Conelog/Camlog iSy
114,90€ · Straumann Bone Level/synOcta/BLX/TLX 121,90€ · Medentis ICX
99,90€ · TRI Narrow/Vent/Octa 114,90€ · Champion Evolution 114,90€.
Kunststoffe 3D-Druck: Aufbissschiene 44,90€ · Reiseprothese/Provisorium
12,90€ · Bohrschablone 79,00€.
Kunststoffe gefräst: Polyamid-Aufbissschiene 81,90€ · PMMA Cast 15,90€ ·
PMMA Multilayer 19,90€ (Aufpreis vollanat. 2,90€).
PEEK: Einheit 44,90€ · Primärteleskop 59,90€ · Sekundärteleskop 69,90€
(mit Sitec 79,90€) · Retention 33,90€ · palatinale Platte 295,00€ ·
sublingual Bügel 250,00€ · Klammerelement 49,90€.

--- PREISE BEI INTRAORALDATEN-TRANSFER (Rohdaten vom Intraoralscanner) ---
Zirkonoxid: opaque/transluzent 48,90€ · priti extra transluzent multicolor
55,90€ · priti multitransluzent plus 58,90€ · Katana UTML 59,90€ · Katana
YML 62,90€ (Aufpreis vollanat. Konstruktion/Fräsung/Ausarbeitung 10,00€).
Glaskeramik: IPS e.max CAD 72,90€ · Composite 69,90€ (Aufpreis 10,00€).
CoCr additiv: 33,90€ · Primärteleskop 33,90€ (Aufpreis 10,00€).
CoCr gefräst: 44,90€ · Primärteleskop 46,90€ (Aufpreis 10,00€) ·
Implantatstrukturen (Medentika 114,90€, Brückenpfosten 132,90€,
Brückenglied 25,90€, Stegpfosten 132,90€, Steganteil 20,90€).
Titan: 46,90€ (Aufpreis vollanat. 2,90€) · Primärteleskop 48,90€ ·
Implantatstrukturen (Medentika 114,90€, Brückenpfosten 134,90€,
Brückenglied 25,00€, Stegpfosten 134,90€, Steganteil 20,00€).
Original-Preform-Abutments: Camlog/Conelog/Camlog iSy 129,90€ · Straumann
Bone Level synOcta/BLX/TLX 136,90€ · Medentis ICX 114,90€ · TRI
Narrow/Vent/Octa 129,90€ · Champion Evolution 129,90€.
Kunststoffe 3D-Druck: Aufbissschiene 69,90€ · Reiseprothese/Provisorium
32,90€.
Kunststoffe gefräst: Polyamid-Aufbissschiene 106,90€ · PMMA Cast 35,90€ ·
PMMA Multilayer 39,90€ (Aufpreis 10,00€).
PEEK: Einheit 64,90€ · Primärteleskop 79,90€ · Sekundärteleskop 89,90€
(mit Sitec 99,90€) · Retention 39,90€ · palatinale Platte 365,00€ ·
sublingual Bügel 320,00€ · Klammerelement 59,90€.
Modellherstellung 3D-Druck: Modellpauschale 8,90€ · Modell pro Quadrant
10,45€ · 2 Quadranten 20,90€ · OK & UK komplett 29,90€ · Einzelstumpf/
Präparation 2,10€ · Platzhalter für Laboranalog 1,50€ · Gingivamaske pro
Segment 9,50€ / pro Quadrant 24,90€ · DIM-Analog ab 34,90€.

--- PREISE BEI MODELLEINSENDUNG (physisches Modell, Zahnwerk konstruiert) ---
Zirkonoxid: opaque/transluzent 54,90€ · priti extra transluzent multicolor
61,90€ · priti multitransluzent plus 64,90€ · Katana UTML 65,90€ · Katana
YML 68,90€ (Aufpreis 10,00€).
Glaskeramik: IPS e.max CAD 78,90€ · Composite 75,90€ (Aufpreis 10,00€).
CoCr additiv: 39,90€ · Primärteleskop 39,90€ (Aufpreis 10,00€).
CoCr gefräst: 50,90€ (Aufpreis 10,00€) · Primärteleskop 52,90€ ·
Sekundärteleskop 91,90€ (mit Sitec Tk-Soft 101,90€) · gefräste Retention
26,90€ · Tk-Soft Friktionselement 21,90€ (mini 25,90€) ·
Sekundärbrücke/Hybridkonstruktion pro Quadrant 299,90€ ·
Implantatstrukturen (Medentika 119,00€, Brückenpfosten 137,90€,
Brückenglied 25,00€, Stegpfosten 137,90€, Steganteil 20,00€).
Titan: 52,90€ (Aufpreis 10,00€) · Primärteleskop 54,90€ · Sekundärteleskop
(taktil, nur Absprache) 92,90€ (mit Tk-Soft 102,90€) · gefräste Retention
26,90€ · Friktionselement 21,90-25,90€ · Sekundärbrücke/Hybridkonstruktion
pro Quadrant 329,90€ · Implantatstrukturen (Medentika 119,90€,
Brückenpfosten 139,90€, Brückenglied 25,00€, Stegpfosten 139,90€,
Steganteil 20,00€).
Titan Original-OEM-Abutments: Camlog/Conelog/Camlog iSy 134,90€ · Straumann
Bone Level/synOcta 141,90€ · Medentis ICX 119,90€ · TRI Narrow/Vent/Octa
134,90€ · Champion Evolution 134,90€.
Kunststoffe 3D-Druck: Aufbissschiene 74,90€ · Reiseprothese/Provisorium
38,90€.
Kunststoffe gefräst: Aufbissschiene Polyamid 111,90€ · PMMA Cast 41,90€ ·
PMMA Multilayer 45,90€ (Aufpreis 10,00€).
PEEK: Einheit 70,90€ · Primärteleskop 85,90€ · Sekundärteleskop 95,90€
(mit Sitec 105,90€) · Retention 49,90€ · palatinale Platte 365,00€ ·
sublingual Bügel 320,00€ · Klammerelement 59,90€ ·
Sekundärbrücke/Hybridkonstruktion: Preis auf Anfrage.

--- ZUSATZLEISTUNGEN (gelten für alle drei Einreichungsarten, sofern nicht
anders angegeben) ---
ZW Premium Feinstfräsung 3,90€ · Umlaufende Fräsung für Primärteleskop inkl.
Politur 33,90€ · Politur Aufbissschiene 19,90€ · Bohrung Schraubenkanal
9,90€ · Bohrung für Locator 9,90€ · Verklebung Abutment mit Basis 12,90€
(nur bei Modell-/Intraoraldaten-Kunden) · Precihorix-/Precivertixgeschiebe
39,90€ (Datensatz) bzw. 59,90€ (Modell/Intraoral) · Teilungsgeschiebe
39,90€ (Datensatz) bzw. 79,90€ (Modell/Intraoral) · Schubverteilungsarm mit
Interlock 14,90€ (nur Modell/Intraoral) · Bearbeiten im Rohzustand vor dem
Sintern (Zirkon) 5,90€ · Aufpassen & Ausarbeiten auf Modell bei
Datensatz-Einsendung 10,00€ · Keramische Verblendung Zirkon pro Einheit
129,90€ (nur Modell/Intraoral) · Individualisieren (e.max/Zirkonoxid)
39,90€ · Glanzbrand 26,90€ · Kristallisationsbrand (e.max) 13,90€ ·
Einsetzschlüssel gedruckt 35,90€ (+10€ pro weiterem Implantat).

Fräsbare Implantat-Anschlussgeometrien (direktverschraubt): ASTRA TECH
OsseoSpeed/EV, Biomet 3i Certain/OSSEOTITE, bredent SKY (auch fast&fixed),
CAMLOG, Dentsply-Friadent FRIALIT-Xive, Medentis ICX, Neoss, Nobel Biocare
Active/Branemark/Multi-unit/Replace Select, Straumann Bone Level/synOcta,
Zimmer Tapered Screw-Vent — plus Titan-Preform-Systeme Conelog, Camlog iSy,
TRI-Narrow/Vent/Octa. Alle anderen Systeme auf Anfrage.

Versand: UPS Express 12-Uhr-Anlieferung (Folgetag bis 12:00) 9,90€ · UPS
Express Saver-Abholung (selber Tag, bis 16:00 beauftragt) 11,90€ · UPS
Express-Anlieferung (Folgetag bis 10:30) 13,90€ · GO!-EXPRESS Versand
12,90€ · GO!-EXPRESS Abholung 19,90€ · GO!-EXPRESS Terminlieferung bis
09:00 34,90€.

Lieferzeiten bei Modelleinsendung: Einzelkronen/kleine Brücken 1-2
Werktage · komplexe Versorgungen 2-8 Werktage · Kunststoffe 3D-Druck 2-3
Werktage · Aufbissschienen 4-5 Werktage.
Lieferzeiten bei Datentransfer (Eingang bis 13:00 Uhr): alle gefrästen
Materialien und direktverschraubte Versorgungen 1 Werktag · CoCr additiv
und Kunststoffe 3D-Druck 2-3 Werktage · Intraoralscans 4-5 Werktage (nach
Absprache).

KUNDENVERZEICHNIS (Zahnarztpraxen und Partnerlabore, die von Weck Dental betreut
werden — Praxisname, Adresse, Telefon, E-Mail, ggf. behandelnde Ärzte und
aktuell erfasster Urlaub):
- Dr. Fadi Alhaddad Alhamoui | Wiener-Neustädter-Str. 5-7, 40789 Monheim am Rhein | Tel: 02173 / 6 55 11 | info@zahnarzt-alhamoui.de | Urlaub: 2026-08-03 bis 2026-08-14
- Praxis Dr. Gerhard Amberger | Marktplatz 6, 40764 Langenfeld | Tel: 02173-83540 | info@amberger.com
- Dr. Klaus Binia & Dr. Thomas Wölfling | Holzweg 28, 40789 Monheim am Rhein | Tel: 02173 / 66 7 11 | dr.binia-dr.woelfling@t-online.de
- Prof. Dr. S. Krifka & Dr. A. Brackmann-Krifka | Marktplatz 18, 40764 Langenfeld | Tel: 02173 / 80 888 | praxis@za-marktplatz.de | Urlaub: 2026-07-03 bis 2026-07-10
- Dr. Bernhard Braun | Hauptstraße 71, 40764 Langenfeld | Tel: 02173 / 1 31 75 | zahnarztbraun62@web.de | Urlaub: 2026-08-10 bis 2026-08-26
- Dr. Marcus Dahmen | Graf-Adolf-Straße 16, 40212 Düsseldorf | Tel: 0211 / 38 18 18 | info@drdahmenundkollegen.de
- ZahnGut | Lindenstraße 4, 40789 Monheim am Rhein | Tel: 02173 / 5 55 11 | kontakt@zahngut-monheim.de
- Enzenbach Zahntechnik GmbH | Im Sommerfeld 8, 38304 Wolfenbüttel | Tel: 05331 / 60 45 | enzenbach.zahntechnik@t-online.de
- Dr. Robert Fricke & Dr. Benjamin Danckworth | Neuenhöfer Allee 84, 50935 Köln | Tel: 0221 / 42 31 56 60 | labor@koeln-zahnheilkunde.de
- Zahnarztpraxis am Rathaus Dr. Goch & Dr. van Betteray | Konrad-Adenauer-Platz 8, 40764 Langenfeld | Tel: 02173 / 80444 | info@zahnarztpraxisamrathaus.de | Urlaub: 2026-07-05 bis 2026-07-07 | Hinweis: Praxis zieht im Oktober 2026 um
- Dr. med. dent. Michael Gottschall | Cranachstr. 27, 40235 Düsseldorf | Tel: 0211 / 66 22 70 | info@dr-gottschall.de
- DDS (USA) MSc. S. Grau | Düsseldorfer Landstraße 249-251, 47259 Duisburg | Tel: 0203 / 781790 | praxis@grau-vaut.de
- Dr. Hendrik Heinzelmann | Keßlergasse 26, 97421 Schweinfurt | Tel: 09721 / 27087 | post@heinzelmann-zahnarztpraxis.de
- Zahnarztpraxis Josette Hentsch | Vohwinkelallee 2a, 40229 Düsseldorf | Tel: 0211 / 20 44 00 | praxisbrownie@aol.com
- M.Sc. Implantologie Zahnärztin Lisa Jahr | Beethovenstr. 40, 77694 Kehl | Tel: 07851-2521 | mail@lisa-jahr.de
- Dr. Michael Jung | Hauptstr. 32, 40597 Düsseldorf | Tel: 0211 / 719242 | labor@fligge-jung.de | Urlaub: 2026-08-07 bis 2026-08-21
- Dr. Joanna Kaczmarek | Friedrich-Ebert-Platz 17, 51373 Leverkusen | Tel: 02144 1905 | joanna@gzm-zahnarztpraxis.de
- Gemeinschaftspraxis Dr. Kaminski & Dr. Bork | Freiheitstraße 1-5, 40822 Mettmann | Tel: (02104) 2 47 47 | info@zahnarzt-mettmann.de
- Dr.med. Dr.med.dent. Kaupe & Engelbach | Steinstraße 20, 40212 Düsseldorf | Tel: 0211 / 17 39 20 | info@mkg-praxis.eu
- Kinderzahnwelt Monheim Margarita Nachemia | Alte Schulstraße 19, 40789 Monheim am Rhein | Tel: 02173 / 265 37 77 | info@kinderzahnwelt-monheim.de
- Dr. Lasse Kolligs | Schloßbleiche 12, 42103 Wuppertal | Tel: 0202 / 44 49 47 | frischemeier@lassekolligs.de
- Gemeinschaftspraxis Dr. Sven-Anneus Ohling und Jana Koch-Ohling | Angerburger Allee 41, 14055 Berlin | Tel: 030 / 30 45 45 2 | info@ohling.de
- Dr. Susanne Przybilla | Bergische Landstraße 30, 51375 Leverkusen | Tel: 0214 / 50 39 29 | drprzybilla@t-online.de
- rheinweiss Zahnmedizin | Krischerstraße 87, 40789 Monheim am Rhein | Tel: 02173 / 999 42 66 | verwaltung@rheinweiss-zahnmedizin.de
- Zahnarztpraxis Schönwald & Dr. Wesemann | Reichsweg 32, 44536 Lünen | Tel: 0231 / 87 64 20 | info@zahngesundheit-luenen.de
- Zahnarztpraxis Carsten Schütte | Untergrünewalder Str. 18a, 42103 Wuppertal | Tel: 0202 / 30 51 89 | verwaltung@zahnprax.de | Urlaub: 2026-08-10 bis 2026-08-28
- Ulrich Stapelfeldt | Gerhard-Hauptmann-Straße 40, 51379 Leverkusen | Tel: 02171 / 74 31 11 | ulrichstapelfeldt@web.de
- Zahnarztpraxis Dr. Diana Tasche | Grünewalder Str. 55, 42657 Solingen | Tel: 0212 / 2219473 | praxis@praxis-kt.de
- Zahntechnisches Labor Technodent | Kaiserstraße 52, 42781 Haan | Tel: 02129 / 93 44 0 | technodent@mail.de
- Dr. medic.- stom. (RO) Zahnärztin Dagmar Volk | Kasernenstr. 21, 42651 Solingen | Tel: 0212 / 202375 | fremdlabor@praxis-volk.de
- Zahnarztpraxis Dr. Wahler & Kollegen GbR MVZ | Rathausplatz 2, 97502 Euerbach | Tel: 09726 / 3051 | labor.eb@praxis-wahler.de
- Simone Weber | Opladener Str. 120, 40764 Langenfeld | Tel: 02173 / 20 440 90 | zahnarztweber@gmx.de
- Zahnärztin Le-Trang Weng | Gustav-Mahler-Str. 3, 40724 Hilden | Tel: 02103 / 4 33 51 | info@weng-zahnarztpraxis.de
- Praxis Z.Art | Manforter Str. 223-225, 51373 Leverkusen | Tel: 0214 / 4 55 30 | info@praxis-z-art.de
- Firma Zahnwerk Frästechnik GmbH | Hausinger Str. 3b, 40764 Langenfeld | office@zahnwerk-fraestechnik.de
- Zahnarztpraxis Daria Zimmermann | Hauptstraße 33/35, 97638 Mellrichstadt | Tel: 09776 / 50 40 | info@zahnarztpraxis-mellrichstadt.de
- Zahnarztpraxis Therese Friesen | Solinger Str. 140a, 51371 Leverkusen | Tel: 0214 / 2 25 99 | 51371@zahnarztpraxisfriesen.de
- Dr. Rainer Klaßen | Kaiserstr. 32-34, 40764 Langenfeld | Tel: 02173 / 99 41 11 | praxis-dr.klassen@t-online.de
- Zahnarztpraxis Olav Kohlhaase | Zur Abtei 35, 50859 Köln | Tel: 0221 / 48 49 884 | info@zahnarzt-widdersdorf.de
- Baron | Hauptstr. 119, 40764 Langenfeld | Tel: 02173 74773 | info@zahnmedizin-baron.de | Urlaub: 2026-08-24 bis 2026-08-28
- Frau Dr. med. dent. Irina Bertram-Weise | Solinger Str. 124, 40764 Langenfeld | Tel: 02173 1012152 | dr.irinaweise@googlemail.com | Urlaub: 2026-07-22 bis 2026-08-01
- Zahnarzt Dr.med.dent. Jürgen Esser | Peter Knecht Str. 4, 42651 Solingen | Tel: 201309 | praxis@esser-solingen.de
- Dr. Wolfram Herrmann | Bachstraße 40, 40764 Langenfeld | Tel: 02173 / 72031 | info@wolframherrmann.de
- Zahnarztpraxis Jörg Schienbein | Hauptstr. 59, 51399 Burscheid | Tel: 02174 / 2212 | weckdental@gmx.de
- Dr. Jonas Holterhaus | Heinestraße 9, 40789 Monheim | Tel: 02173 31777 | info@biologische-zahnmedizin-monheim.de

INTERNES CRM-TOOL ("WECK DNTL CRM"): Das Team nutzt zusätzlich ein eigenes CRM
für den Außendienst mit folgenden Bereichen: Übersicht (Kennzahlen, fällige
Aufgaben), Kunden (obige Praxisliste mit Details), Kontakte (Besuchs-/Anruf-/
WhatsApp-/E-Mail-Verlauf), Kundenwünsche (erfasste Bestellungen/Wünsche mit
Umsatz), Erinnerungen (Rückrufe, Reklamationen), Termine, Kalender (Urlaube,
Geburtstage, Praxisjubiläen), Tagesroute (Routenplanung nach PLZ), Kurse
(Schulungsangebote mit Interessentenlisten) und Neue Kontakte (Akquise bei
noch nicht Kunden gewordenen Praxen). Bei Fragen zu einem konkreten Kunden aus
der obigen Liste (Adresse, Telefonnummer, E-Mail, Urlaubszeiten) antworte
direkt mit den entsprechenden Daten aus dem Kundenverzeichnis oben.

TEAM-VERZEICHNIS (aus der internen Zeiterfassungs-App — Name, Position,
Abteilung, Soll-Stunden, Urlaubstage/Jahr; feste Stammdaten, keine
Live-Arbeitszeiten):
- Sabine Weck | Zahntechnikermeisterin, Inhaberin | Büro | 43 Std./Monat | 24 Urlaubstage/Jahr
- Gunnar W. | Zahntechnikermeister, Laborleiter | Büro | 43 Std./Monat | 24 Urlaubstage/Jahr
- Ursula A. | Zahntechnikermeisterin | Zahntechnik | 43 Std./Monat | 24 Urlaubstage/Jahr
- Julia K. | Labortechnische Verwaltungsmanagerin, Zahntechnikerin | Büro | 43 Std./Monat | 24 Urlaubstage/Jahr
- Alejandro M. | Versand und Logistik, Marketing | Büro | 43 Std./Monat | 24 Urlaubstage/Jahr
- Emre M. | Versand und Logistik, Zahntechniker | Büro | 43 Std./Monat | 24 Urlaubstage/Jahr
- Sigrid D. | Feel Good-Managerin | Büro | 43 Std./Monat | 24 Urlaubstage/Jahr
- Mario T. | Zahntechniker – Kunststoff, Galvano, Valplast, CAD/CAM | Zahntechnik | 43 Std./Monat | 24 Urlaubstage/Jahr
- Michael B. | Zahntechniker – Edelmetall, Modellguss | Zahntechnik | 43 Std./Monat | 24 Urlaubstage/Jahr
- Bärbel W. | Zahntechnikerin – Kunststoff, Valplast | Zahntechnik | 43 Std./Monat | 24 Urlaubstage/Jahr
- Sylvia M. | Zahntechnikerin – Kunststoff | Zahntechnik | 43 Std./Monat | 24 Urlaubstage/Jahr
- Heike M. | Zahntechnikerin – Kunststoff | Zahntechnik | 43 Std./Monat | 24 Urlaubstage/Jahr
- Sefa-Ali T. | Zahntechniker – Kunststoff | Zahntechnik | 43 Std./Monat | 24 Urlaubstage/Jahr
- Monika R. | Zahntechnikerin – Keramik | Zahntechnik | 43 Std./Monat | 24 Urlaubstage/Jahr
- Sandra M. | Zahntechnikerin – Allroundtechnikerin | Zahntechnik | 43 Std./Monat | 24 Urlaubstage/Jahr
- Clara W. | Zahntechnikerin – Keramik | Zahntechnik | 43 Std./Monat | 24 Urlaubstage/Jahr
- Patricia H. | Zahntechnikerin – Arbeitsvorbereitung, Edelmetall | Zahntechnik | 43 Std./Monat | 24 Urlaubstage/Jahr
- Ernani R. | Arbeitsvorbereitung | Büro | 43 Std./Monat | 24 Urlaubstage/Jahr
- Tim G. | Auszubildender Zahntechnik | Zahntechnik | 43 Std./Monat | 24 Urlaubstage/Jahr
- Miriam G. | Auszubildende Zahntechnikerin | Zahntechnik | 43 Std./Monat | 24 Urlaubstage/Jahr
- Markus R. | Botendienst | Botendienst | 43 Std./Monat | 24 Urlaubstage/Jahr
- Andreas F. | Botendienst | Botendienst | 43 Std./Monat | 24 Urlaubstage/Jahr
- Jörg P. | Botendienst | Botendienst | 43 Std./Monat | 24 Urlaubstage/Jahr
- Horst T. | Botendienst | Botendienst | 43 Std./Monat | 24 Urlaubstage/Jahr
- Ulrich W. | Botendienst | Botendienst | 43 Std./Monat | 24 Urlaubstage/Jahr
- Reiner F. | Botendienst | Botendienst | 43 Std./Monat | 24 Urlaubstage/Jahr
- Carlo W. | Botendienst | Botendienst | 43 Std./Monat | 24 Urlaubstage/Jahr
- Steffen Martin | CAD/CAM | Zahntechnik | 43 Std./Monat | 24 Urlaubstage/Jahr
- Vox L. | Botendienst | Botendienst | 43 Std./Monat | 24 Urlaubstage/Jahr
- Olaf I. | Botendienst | Botendienst | 43 Std./Monat | 24 Urlaubstage/Jahr
- Anja D. | Botendienst | Botendienst | 43 Std./Monat | 24 Urlaubstage/Jahr

WICHTIG ZU "LIVE_DATEN"-Abschnitten weiter unten (falls vorhanden): Das sind
tatsächliche, gerade eben aus der Zeiterfassungs-Datenbank abgerufene Zahlen
zu Arbeitsstunden, Überstunden und Urlaub eines Mitarbeiters — nutze diese
bevorzugt für konkrete Zahlenfragen ("wie viele Überstunden hat X"), da sie
aktuell sind, im Gegensatz zum statischen Team-Verzeichnis oben. Ein
LIVE_DATEN_HEUTE-Abschnitt (falls vorhanden) zeigt den heutigen Status ALLER
Mitarbeiter (im Dienst / heute gearbeitet / noch nicht eingestempelt) — nutze
ihn für allgemeine Fragen wie "wer arbeitet heute" oder "welche Mitarbeiter
sind da". Ein LIVE_DATEN_CRM-Abschnitt (falls vorhanden) zeigt die letzten
Kontakte (Besuche/Anrufe/WhatsApp/E-Mail) und Kundenwünsche zu einer
genannten Praxis, live aus dem CRM — nutze ihn für Fragen wie "wann war der
letzte Kontakt mit X" oder "was wollte Kunde Y zuletzt". Ein
LIVE_DATEN_CRM_BETRIEB-Abschnitt (falls vorhanden) zeigt je nach Frage offene
Erinnerungen/Reklamationen, anstehende Termine, Kursangebote mit
Interessenten, oder neue Kontakte/Leads — alles live aus dem CRM. Ein
LIVE_DATEN_CRM_BENUTZER-Abschnitt (falls vorhanden) zeigt, wer Zugang zum CRM
hat und mit welcher Rolle. LIVE_DATEN_TEAM_UEBERSTUNDEN und
LIVE_DATEN_BESUCHE_GESAMT zeigen Summen über das GESAMTE Team bzw. ALLE
Kunden (nicht nur eine Person). Ein ANSTEHENDE_GEBURTSTAGE-Abschnitt (falls
vorhanden) listet Geburtstage in den nächsten 21 Tagen — die Tage bis zum
Geburtstag ("inTagen") sind bereits fertig berechnet, rechne sie nicht neu.
Bei "letztePersoenlicheBesucheVorOrt" im LIVE_DATEN_CRM-Abschnitt handelt es
sich um tatsächliche Vor-Ort-Besuche mit Ein-/Auscheck-Zeit (Tagesroute),
getrennt von den übrigen Kontaktkanälen.

FAHRPLAN 2027 (Fahrer / Botendienst-Schichtplan): Es gibt 9 Fahrer, alle auf
Minijob-Basis (Grenze 43 Std./Monat), mit 8 Urlaubstagen/Jahr Anspruch
(gesetzliches Minimum bei 2 Arbeitstagen/Woche nach BUrlG):
Andreas Franke, Uli, Horst, Carlo, Penzek, Olaf, Rainer, Vox, Anja.

Feste Wochenvorlage (wiederholt sich jede Woche, Mo–Fr, keine Wochenenden):
- Montag: Vormittag (08:00–13:00) = Andreas Franke + Uli · Nachmittag (13:00–18:00) = Olaf + Rainer
- Dienstag: Vormittag = Andreas Franke + Horst · Nachmittag = Carlo + Vox
- Mittwoch: Vormittag = Uli + Horst · Nachmittag = Olaf + Vox
- Donnerstag: Vormittag = Penzek + Rainer · Nachmittag = Carlo + Anja
- Freitag: Ganztags (08:00–14:30) = Penzek + Anja

Feiertage 2027 (an diesen Tagen fährt niemand, bezahlt): 1. Januar
(Neujahrstag), 26. März (Karfreitag), 29. März (Ostermontag), 1. Mai (Tag der
Arbeit), 6. Mai (Christi Himmelfahrt), 17. Mai (Pfingstmontag), 27. Mai
(Fronleichnam), 3. Oktober (Tag der Deutschen Einheit), 1. November
(Allerheiligen), 25.–26. Dezember (Weihnachten).

Bei Fragen zu "welche Schicht hat X am [Wochentag]" antworte direkt aus der
Wochenvorlage oben. Bei Fragen zu Urlaub/Krankheit eines konkreten Fahrers
oder "wer ist gerade krank/im Urlaub" nutze bevorzugt den LIVE_DATEN-Abschnitt
weiter unten (falls vorhanden), da Urlaubsanträge und Krankmeldungen sich
laufend ändern und nicht Teil dieses festen Textes sind.

WICHTIG: Antworte nur mit Informationen aus diesem Text. Wenn die Antwort hier
nicht enthalten ist, sage das ehrlich und verweise auf den direkten Kontakt
(Telefon 02173 – 85 23 40 oder info@weckdental.de). Erfinde keine Fakten,
Preise oder Zusagen. Antworte auf Deutsch, kurz und klar.
`;

// ---------------------------------------------------------------------
// LIVE-DATEN AUS DER ZEITERFASSUNGS-APP (Firebase/Firestore)
// Im Unterschied zum KNOWLEDGE_BASE-Text oben (statisch) werden Stunden,
// Überstunden und Urlaubsstände HIER live aus der echten Datenbank der
// Zeiterfassungs-App geholt, weil sich diese Zahlen täglich ändern.
// ---------------------------------------------------------------------
const ZEIT_FIREBASE = {
  apiKey: 'AIzaSyBFVMPVX8-ree47cNJgZV29WCU5isRvURo',
  projectId: 'zeiterfassung-weck-dental',
};

let cachedIdToken = null;
let cachedIdTokenExpiry = 0;

async function getZeitIdToken() {
  if (cachedIdToken && Date.now() < cachedIdTokenExpiry) return cachedIdToken;
  const res = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${ZEIT_FIREBASE.apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ returnSecureToken: true }),
    }
  );
  const data = await res.json();
  if (!data.idToken) throw new Error('Anonyme Firebase-Anmeldung fehlgeschlagen');
  cachedIdToken = data.idToken;
  cachedIdTokenExpiry = Date.now() + 50 * 60 * 1000;
  return cachedIdToken;
}

function firestoreValueToJs(value) {
  if (value == null) return null;
  if ('stringValue' in value) return value.stringValue;
  if ('integerValue' in value) return parseInt(value.integerValue, 10);
  if ('doubleValue' in value) return value.doubleValue;
  if ('booleanValue' in value) return value.booleanValue;
  if ('nullValue' in value) return null;
  if ('mapValue' in value) return firestoreFieldsToJs(value.mapValue.fields || {});
  if ('arrayValue' in value) return (value.arrayValue.values || []).map(firestoreValueToJs);
  return null;
}
function firestoreFieldsToJs(fields) {
  const out = {};
  for (const k in fields) out[k] = firestoreValueToJs(fields[k]);
  return out;
}

// ---------------------------------------------------------------------
// LIVE-DATEN AUS DEM CRM (crm-weck-dental) — Kontakthistorie und
// Kundenwünsche pro Kunde. Anderes Firebase-Projekt als Zeiterfassung/
// Fahrplan, daher eigene Anmeldung und eigene Collection ("app_data" statt
// "kv", Schlüssel wie im CRM selbst: weck_clients_v1, weck_visits_v1, ...).
// ---------------------------------------------------------------------
const CRM_FIREBASE = {
  apiKey: 'AIzaSyCBNSKE3E74YClG-20I_7MG9Vh4JMiYsjs',
  projectId: 'crm-weck-dental',
};

let cachedCrmIdToken = null;
let cachedCrmIdTokenExpiry = 0;

async function getCrmIdToken() {
  if (cachedCrmIdToken && Date.now() < cachedCrmIdTokenExpiry) return cachedCrmIdToken;
  const res = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${CRM_FIREBASE.apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ returnSecureToken: true }),
    }
  );
  const data = await res.json();
  if (!data.idToken) throw new Error('Anonyme CRM-Anmeldung fehlgeschlagen');
  cachedCrmIdToken = data.idToken;
  cachedCrmIdTokenExpiry = Date.now() + 50 * 60 * 1000;
  return cachedCrmIdToken;
}

async function fetchCrmDoc(key) {
  const token = await getCrmIdToken();
  const url = `https://firestore.googleapis.com/v1/projects/${CRM_FIREBASE.projectId}/databases/(default)/documents/app_data/${encodeURIComponent(key)}`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) return null;
  const data = await res.json();
  if (!data.fields) return null;
  const obj = firestoreFieldsToJs(data.fields);
  try {
    return JSON.parse(obj.value);
  } catch {
    return obj.value;
  }
}

// Listet ALLE Dokumente einer eigenständigen Firestore-Collection (nicht das
// app_data/kv-Muster) — wird für die "users"-Collection des CRM gebraucht.
async function fetchCrmCollection(collectionName) {
  const token = await getCrmIdToken();
  let docs = [];
  let pageToken = null;
  let guard = 0;
  do {
    const url = `https://firestore.googleapis.com/v1/projects/${CRM_FIREBASE.projectId}/databases/(default)/documents/${collectionName}?pageSize=300${pageToken ? '&pageToken=' + pageToken : ''}`;
    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    if (!res.ok) break;
    const data = await res.json();
    (data.documents || []).forEach((doc) => {
      docs.push({ id: doc.name.split('/').pop(), ...firestoreFieldsToJs(doc.fields || {}) });
    });
    pageToken = data.nextPageToken;
    guard++;
  } while (pageToken && guard < 10);
  return docs;
}

// Team-Zugänge zum CRM selbst (wer hat einen Account, welche Rolle).
async function getCrmUsersForMessage(message) {
  const m = message.toLowerCase();
  if (!/(benutzer|nutzer|zugang|zugriff|welche rolle|wer hat.*account)/.test(m)) return null;
  try {
    const users = await fetchCrmCollection('users');
    return {
      crmBenutzer: users
        .filter((u) => !u.disabled)
        .map((u) => ({ name: u.name, rolle: u.role, email: u.email })),
    };
  } catch (e) {
    return { error: e.message };
  }
}

// Findet in der Frage genannte Kundennamen (Praxen) und holt Kontakthistorie
// + Kundenwünsche live aus dem CRM — im selben Format, das das CRM intern
// für seine eigene KI-Zusammenfassung nutzt (generateAiSummary).
async function getClientCrmInfoForMessage(message) {
  let clients;
  try {
    clients = await fetchCrmDoc('weck_clients_v1');
  } catch (e) {
    return { error: 'Verbindung zum CRM fehlgeschlagen: ' + e.message };
  }
  if (!clients || !clients.length) return null;

  const lowerMsg = message.toLowerCase();
  const matched = clients.filter((c) => {
    if (!c.name) return false;
    const nameLower = c.name.toLowerCase();
    if (lowerMsg.includes(nameLower)) return true;
    // Auch auf einzelne markante Wörter im Kundennamen prüfen (z. B. "Baron",
    // "Amberger"), da Praxen oft mit "Dr. Vorname Nachname" heißen.
    return nameLower
      .split(/[\s,&/]+/)
      .filter((w) => w.length >= 4 && !['praxis', 'zahnarzt', 'zahnarztpraxis', 'dr.', 'gemeinschaftspraxis'].includes(w))
      .some((w) => lowerMsg.includes(w));
  });
  if (!matched.length) return null;

  let visitsAll = [];
  let ordersAll = [];
  let checkinsAll = [];
  try {
    [visitsAll, ordersAll, checkinsAll] = await Promise.all([
      fetchCrmDoc('weck_visits_v1'),
      fetchCrmDoc('weck_orders_v1'),
      fetchCrmDoc('weck_checkins_v1'),
    ]);
  } catch (e) {
    /* weiter ohne Verlauf, falls das fehlschlägt */
  }
  visitsAll = visitsAll || [];
  ordersAll = ordersAll || [];
  checkinsAll = checkinsAll || [];

  const results = matched.slice(0, 2).map((c) => {
    const visits = visitsAll
      .filter((v) => v.clientId === c.id)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 6);
    const orders = ordersAll
      .filter((o) => o.clientId === c.id)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 6);
    const checkins = checkinsAll
      .filter((ci) => ci.clientId === c.id)
      .sort((a, b) => new Date(b.checkInAt) - new Date(a.checkInAt))
      .slice(0, 5);
    return {
      name: c.name,
      notizen: c.notes || '',
      letzteKontakte: visits.map((v) => ({
        datum: v.date,
        kanal: v.channel,
        grund: v.reason,
        themen: v.topics,
        ergebnis: v.outcome,
      })),
      letzteKundenwuensche: orders.map((o) => ({
        datum: o.date,
        produkte: o.products,
        betrag: o.amount,
        zufriedenheit: o.satisfaction,
      })),
      letztePersoenlicheBesucheVorOrt: checkins.map((ci) => ({
        datum: (ci.checkInAt || '').slice(0, 10),
        dauerMinuten: ci.checkOutAt
          ? Math.round((new Date(ci.checkOutAt) - new Date(ci.checkInAt)) / 60000)
          : null,
        laeuftNoch: !ci.checkOutAt,
      })),
    };
  });

  return { results };
}

// ---------------------------------------------------------------------
// AGGREGIERTE BERICHTE: Summen über das GESAMTE Team bzw. ALLE Kunden —
// eigener Pfad, weil hier keine Namensfilterung stattfindet, sondern über
// alle Datensätze aufsummiert wird.
// ---------------------------------------------------------------------
function looksLikeTeamAggregateQuery(message) {
  const m = message.toLowerCase();
  return /(gesamt|insgesamt|alle mitarbeiter|ganze team|team.*überstunden|überstunden.*team)/.test(m) &&
    /(überstunden|stunden)/.test(m);
}
function looksLikeVisitsAggregateQuery(message) {
  const m = message.toLowerCase();
  return /(wie viele besuche|anzahl.*besuche|besuche.*(monat|insgesamt|gemacht))/.test(m);
}

async function getTeamOvertimeAggregate() {
  let employees;
  try {
    employees = await fetchKvDoc('employees');
  } catch (e) {
    return { error: e.message };
  }
  if (!employees || !employees.length) return null;

  const now = new Date();
  const ym = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0');
  let requestKeys = [];
  try {
    requestKeys = await listKvKeysWithPrefix('request:');
  } catch (e) {
    /* ohne Anträge weitermachen */
  }
  const allRequests = [];
  for (const k of requestKeys) {
    const r = await fetchKvDoc(k);
    if (r) allRequests.push(r);
  }
  const approvedThisMonth = allRequests.filter(
    (r) => r.type === 'ueberstunden' && r.status === 'approved' && r.datum && r.datum.startsWith(ym)
  );
  const totalMinutes = approvedThisMonth.reduce((sum, r) => sum + timeRangeMinutes(r.startZeit, r.endZeit), 0);
  return {
    monat: ym,
    gesamtGenehmigteUeberstundenTeamStunden: (totalMinutes / 60).toFixed(1),
    anzahlMitarbeiterMitUeberstunden: new Set(approvedThisMonth.map((r) => r.employeeId)).size,
  };
}

async function getVisitsAggregate() {
  let visits;
  try {
    visits = await fetchCrmDoc('weck_visits_v1');
  } catch (e) {
    return { error: e.message };
  }
  if (!visits) return null;
  const now = new Date();
  const ym = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0');
  const thisMonth = visits.filter((v) => (v.date || '').startsWith(ym));
  const byChannel = {};
  thisMonth.forEach((v) => {
    byChannel[v.channel || 'Unbekannt'] = (byChannel[v.channel || 'Unbekannt'] || 0) + 1;
  });
  return { monat: ym, gesamtKontakteDiesenMonat: thisMonth.length, nachKanal: byChannel };
}

// ---------------------------------------------------------------------
// Weitere CRM-Bereiche: Erinnerungen, Termine, Kurse, Neue Kontakte (Leads).
// Eine gemeinsame Funktion, die je nach erkannter Absicht die passenden
// Daten aus "app_data" holt (immer live, da sich das laufend ändert).
// ---------------------------------------------------------------------
async function getCrmOperationalDataForMessage(message) {
  const m = message.toLowerCase();
  const wantsReminders = /(erinnerung|reklamation|rückruf|überfällig|offene aufgabe)/.test(m);
  const wantsAppointments = /(termin|kalender.*(heute|woche)|wann.*besuch)/.test(m);
  const wantsCourses = /(kurs|schulung|fortbildung|interessent)/.test(m);
  const wantsLeads = /(neue kontakte|lead|akquise|interessent(en)? praxis|noch kein kunde)/.test(m);

  if (!wantsReminders && !wantsAppointments && !wantsCourses && !wantsLeads) return null;

  const out = {};
  try {
    if (wantsReminders || wantsAppointments) {
      const [clients, reminders, appointments] = await Promise.all([
        fetchCrmDoc('weck_clients_v1'),
        wantsReminders ? fetchCrmDoc('weck_reminders_v1') : Promise.resolve(null),
        wantsAppointments ? fetchCrmDoc('weck_appointments_v1') : Promise.resolve(null),
      ]);
      const clientName = (id) => (clients || []).find((c) => c.id === id)?.name || 'Unbekannter Kunde';
      const todayIso = todayIsoDate();

      if (wantsReminders && reminders) {
        out.offeneErinnerungen = reminders
          .filter((r) => !r.done)
          .sort((a, b) => (a.dueDate || '').localeCompare(b.dueDate || ''))
          .slice(0, 15)
          .map((r) => ({
            praxis: clientName(r.clientId),
            typ: r.type,
            faellig: r.dueDate,
            ueberfaellig: r.dueDate < todayIso,
            notiz: r.notes || '',
          }));
      }
      if (wantsAppointments && appointments) {
        out.anstehendeTermine = appointments
          .filter((a) => a.status === 'geplant')
          .sort((a, b) => (a.date || '').localeCompare(b.date || ''))
          .slice(0, 15)
          .map((a) => ({
            praxis: clientName(a.clientId),
            datum: a.date,
            uhrzeit: a.time || '',
            thema: a.topic || '',
          }));
      }
    }

    if (wantsCourses) {
      const courses = await fetchCrmDoc('weck_courses_v1');
      if (courses) {
        out.kurse = courses.map((c) => ({
          titel: c.title,
          vorbildung: c.vorbildung || '',
          info: c.kurzinfo || '',
          anzahlInteressenten: (c.interested || []).length,
          interessenten: (c.interested || []).map((p) => p.name).filter(Boolean),
        }));
      }
    }

    if (wantsLeads) {
      const leads = await fetchCrmDoc('weck_leads_v1');
      if (leads) {
        out.neueKontakte = leads
          .filter((l) => l.status !== 'konvertiert')
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 15)
          .map((l) => ({
            praxis: l.practiceName,
            zahnarzt: l.dentistName || '',
            ansprechpartner: l.contactPerson || '',
            telefon: l.phone || '',
            email: l.email || '',
            notiz: l.notes || '',
            status: l.status,
          }));
      }
    }
  } catch (e) {
    return { error: e.message };
  }

  return Object.keys(out).length ? out : null;
}
async function fetchKvDoc(key) {
  const token = await getZeitIdToken();
  const url = `https://firestore.googleapis.com/v1/projects/${ZEIT_FIREBASE.projectId}/databases/(default)/documents/kv/${encodeURIComponent(key)}`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) return null;
  const data = await res.json();
  if (!data.fields) return null;
  const obj = firestoreFieldsToJs(data.fields);
  try {
    return JSON.parse(obj.value);
  } catch {
    return obj.value;
  }
}

// Listet alle kv-Dokument-Schlüssel mit einem bestimmten Präfix (z. B. "request:")
async function listKvKeysWithPrefix(prefix) {
  const token = await getZeitIdToken();
  let keys = [];
  let pageToken = null;
  let guard = 0;
  do {
    const url = `https://firestore.googleapis.com/v1/projects/${ZEIT_FIREBASE.projectId}/databases/(default)/documents/kv?pageSize=300${pageToken ? '&pageToken=' + pageToken : ''}`;
    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    if (!res.ok) break;
    const data = await res.json();
    (data.documents || []).forEach((doc) => {
      const name = doc.name.split('/').pop();
      if (name.startsWith(prefix)) keys.push(name);
    });
    pageToken = data.nextPageToken;
    guard++;
  } while (pageToken && guard < 20);
  return keys;
}

function computeDayMinutes(events) {
  if (!events || !events.length) return 0;
  const sorted = [...events].sort((a, b) => a.time.localeCompare(b.time));
  let total = 0,
    segStart = null;
  for (const ev of sorted) {
    if (ev.type === 'start' || ev.type === 'pause_end') {
      segStart = new Date(ev.time);
    } else if ((ev.type === 'pause_start' || ev.type === 'end') && segStart) {
      total += (new Date(ev.time) - segStart) / 60000;
      segStart = null;
    }
  }
  return total;
}
function timeRangeMinutes(startStr, endStr) {
  const [sh, sm] = startStr.split(':').map(Number);
  const [eh, em] = endStr.split(':').map(Number);
  let start = sh * 60 + sm,
    end = eh * 60 + em;
  if (end < start) end += 24 * 60;
  return end - start;
}
function countWorkdaysInRange(von, bis, arbeitstage) {
  const tage = arbeitstage && arbeitstage.length ? arbeitstage : [1, 2, 3, 4, 5];
  const a = new Date(von + 'T00:00:00'),
    b = new Date(bis + 'T00:00:00');
  if (isNaN(a) || isNaN(b) || b < a) return 0;
  let count = 0;
  const cur = new Date(a);
  while (cur <= b) {
    if (tage.includes(cur.getDay())) count++;
    cur.setDate(cur.getDate() + 1);
  }
  return count;
}

// Findet in der Frage genannte Mitarbeiternamen und holt für sie Live-Zahlen
// (Stunden diesen Monat, Überstunden, Urlaub) direkt aus Firestore.
async function getLiveEmployeeStatsForMessage(message) {
  let employees;
  try {
    employees = await fetchKvDoc('employees');
  } catch (e) {
    return { error: 'Verbindung zur Zeiterfassungs-Datenbank fehlgeschlagen: ' + e.message };
  }
  if (!employees || !employees.length) return null;

  const lowerMsg = message.toLowerCase();
  const matched = employees.filter((e) => {
    const vor = (e.vorname || '').toLowerCase();
    const nach = (e.nachname || '').toLowerCase();
    return vor && (lowerMsg.includes(vor) || (nach && lowerMsg.includes(nach)));
  });
  if (!matched.length) return null;

  const now = new Date();
  const ym = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0');

  let requestKeys = [];
  try {
    requestKeys = await listKvKeysWithPrefix('request:');
  } catch (e) {
    /* weiter ohne Anträge, falls das fehlschlägt */
  }

  const results = [];
  for (const emp of matched.slice(0, 3)) {
    const entries = (await fetchKvDoc('entries:' + emp.id)) || {};
    let monthMinutes = 0;
    Object.keys(entries).forEach((date) => {
      if (date.startsWith(ym)) monthMinutes += computeDayMinutes(entries[date]);
    });

    // Heutiger Anwesenheitsstatus — nutzt dieselben "entries", die wir gerade
    // schon für die Monatsstunden geholt haben, also keine zusätzliche Abfrage.
    const todayIso = todayIsoDate();
    const todayEvents = entries[todayIso];
    let heutigerStatus = 'noch nicht eingestempelt';
    if (todayEvents && todayEvents.length) {
      const sortedToday = [...todayEvents].sort((a, b) => a.time.localeCompare(b.time));
      const lastToday = sortedToday[sortedToday.length - 1];
      heutigerStatus =
        lastToday.type === 'start' || lastToday.type === 'pause_end'
          ? 'gerade im Dienst'
          : 'heute gearbeitet, aktuell ausgestempelt';
    }

    const empRequests = [];
    for (const k of requestKeys) {
      const r = await fetchKvDoc(k);
      if (r && r.employeeId === emp.id) empRequests.push(r);
    }

    const approvedOvertimeThisMonth = empRequests.filter(
      (r) => r.type === 'ueberstunden' && r.status === 'approved' && r.datum && r.datum.startsWith(ym)
    );
    const overtimeMinutesThisMonth = approvedOvertimeThisMonth.reduce(
      (sum, r) => sum + timeRangeMinutes(r.startZeit, r.endZeit),
      0
    );
    const pendingOvertime = empRequests.filter((r) => r.type === 'ueberstunden' && r.status === 'pending').length;

    const sollMinutes =
      emp.sollTyp === 'woche'
        ? (emp.sollstunden / ((emp.arbeitstage && emp.arbeitstage.length) || 5)) * 60 * 4.33
        : (emp.sollstunden || 0) * 60;

    const yearStr = String(now.getFullYear());
    const approvedVacationThisYear = empRequests.filter(
      (r) => r.type === 'urlaub' && r.status === 'approved' && r.von && r.von.startsWith(yearStr)
    );
    const usedVacationDays = approvedVacationThisYear.reduce(
      (sum, r) => sum + countWorkdaysInRange(r.von, r.bis, emp.arbeitstage),
      0
    );
    const vacationTotal = emp.urlaubstage != null ? emp.urlaubstage : 24;
    const pendingCount = empRequests.filter((r) => r.status === 'pending').length;

    results.push({
      name: `${emp.vorname} ${emp.nachname}`,
      position: emp.position || '',
      heutigerStatus,
      monat: ym,
      geleisteteStundenDiesenMonat: (monthMinutes / 60).toFixed(1),
      sollStundenDiesenMonat: (sollMinutes / 60).toFixed(1),
      differenzStunden: ((monthMinutes - sollMinutes) / 60).toFixed(1),
      genehmigteUeberstundenDiesenMonat: (overtimeMinutesThisMonth / 60).toFixed(1),
      offeneUeberstundenAntraege: pendingOvertime,
      urlaubstageGesamtProJahr: vacationTotal,
      urlaubstageGenommenDiesesJahr: usedVacationDays,
      urlaubstageVerbleibend: vacationTotal - usedVacationDays,
      offeneAntraegeGesamt: pendingCount,
    });
  }
  return { results };
}

// Erkennt allgemeine Fragen zur heutigen Belegschaft ("wer arbeitet heute",
// "welche Mitarbeiter sind heute da") und prüft für JEDEN Mitarbeiter, ob es
// heute einen Zeiterfassungs-Eintrag gibt und ob die Person gerade eingestempelt
// ist (letztes Ereignis heute ist "start" oder "pause_end" ohne Abschluss).
function looksLikeWhoIsWorkingQuery(message) {
  const m = message.toLowerCase();
  return /(wer|welche mitarbeiter|welche kolleg\w*)\s.*(arbeit|da|anwesend|im (büro|dienst)|eingestempelt|am arbeiten)/.test(m)
    || /(wer ist|wer arbeitet).*(heute|gerade|jetzt)/.test(m);
}

async function getWhoIsWorkingTodayFromZeiterfassung() {
  let employees;
  try {
    employees = await fetchKvDoc('employees');
  } catch (e) {
    return { error: 'Verbindung zur Zeiterfassungs-Datenbank fehlgeschlagen: ' + e.message };
  }
  if (!employees || !employees.length) return null;

  const todayIso = todayIsoDate();

  const statuses = await Promise.all(
    employees.map(async (emp) => {
      let entries = {};
      try {
        entries = (await fetchKvDoc('entries:' + emp.id)) || {};
      } catch {
        return { name: `${emp.vorname} ${emp.nachname}`, status: 'unbekannt' };
      }
      const todayEvents = entries[todayIso];
      if (!todayEvents || !todayEvents.length) {
        return { name: `${emp.vorname} ${emp.nachname}`, status: 'noch nicht eingestempelt' };
      }
      const sorted = [...todayEvents].sort((a, b) => a.time.localeCompare(b.time));
      const lastEvent = sorted[sorted.length - 1];
      const currentlyClockedIn = lastEvent.type === 'start' || lastEvent.type === 'pause_end';
      return {
        name: `${emp.vorname} ${emp.nachname}`,
        status: currentlyClockedIn ? 'gerade im Dienst' : 'heute gearbeitet, aktuell ausgestempelt',
      };
    })
  );

  return { datumHeute: todayIso, mitarbeiterStatus: statuses };
}

// ---------------------------------------------------------------------
// LIVE-DATEN AUS DEM FAHRPLAN 2027 (Urlaub, Krankmeldungen der Fahrer)
// Nutzt dieselbe Firebase-Datenbank wie die Zeiterfassung, nur mit dem
// Schlüssel-Präfix "fahrplan_" (siehe FP_PREFIX in der Fahrplan-App).
// Urlaub/Krankmeldung werden dort direkt unter dem kurzen Fahrernamen
// gespeichert (kein employeeId nötig wie bei der Zeiterfassung).
// ---------------------------------------------------------------------
const FAHRPLAN_DRIVERS = ['Andreas Franke', 'Uli', 'Horst', 'Carlo', 'Penzek', 'Olaf', 'Rainer', 'Vox', 'Anja'];

async function fetchFahrplanDoc(key) {
  return fetchKvDoc('fahrplan_' + key);
}

function todayIsoDate() {
  const now = new Date();
  return now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-' + String(now.getDate()).padStart(2, '0');
}

// Geburtstage von Ärzten und Praxismitarbeiterinnen (aus dem CRM, Format MM-DD).
// Statische Liste, aber die Berechnung "wer hat bald Geburtstag" wird HIER im
// Code gemacht (nicht vom Sprachmodell), damit das Datum garantiert stimmt.
const KNOWN_BIRTHDAYS = [
  { name: 'Prof. Dr. S. Krifka', kontext: 'Prof. Dr. S. Krifka & Dr. A. Brackmann-Krifka', md: '01-09' },
  { name: 'Dr. A. Brackmann-Krifka', kontext: 'Prof. Dr. S. Krifka & Dr. A. Brackmann-Krifka', md: '08-31' },
  { name: 'Zahnarztpraxis Josette Hentsch', kontext: 'Zahnarztpraxis Josette Hentsch', md: '09-13' },
  { name: 'M.Sc. Implantologie Zahnärztin Lisa Jahr', kontext: 'eigene Praxis', md: '11-22' },
  { name: 'Dr. Michael Jung', kontext: 'Dr. Michael Jung', md: '03-15' },
  { name: 'Frau Becker', kontext: 'Praxisteam Dr. Michael Jung', md: '03-06' },
  { name: 'Frau Parelli-Lache', kontext: 'Praxisteam Dr. Michael Jung', md: '03-07' },
  { name: 'Frau Lepen', kontext: 'Praxisteam Dr. Michael Jung', md: '04-28' },
  { name: 'Frau Schwarz', kontext: 'Praxisteam Dr. Michael Jung', md: '05-06' },
  { name: 'Frau Klingebiel', kontext: 'Praxisteam Dr. Michael Jung', md: '05-31' },
  { name: 'Ulrike Olefeld', kontext: 'Praxisteam Dr. Michael Jung', md: '06-16' },
  { name: 'Frau Calpacidou', kontext: 'Praxisteam Dr. Michael Jung', md: '08-26' },
  { name: 'Frau Grundmann', kontext: 'Praxisteam Dr. Michael Jung', md: '11-25' },
  { name: 'Tonja Kuntke', kontext: 'Praxisteam Dr. Michael Jung', md: '12-29' },
  { name: 'Dr. Sven-Anneus Ohling', kontext: 'Gemeinschaftspraxis Ohling/Koch-Ohling', md: '04-26' },
  { name: 'Zahnarztpraxis Carsten Schütte', kontext: 'Zahnarztpraxis Carsten Schütte', md: '02-07' },
  { name: 'Ulrich Stapelfeldt', kontext: 'Ulrich Stapelfeldt', md: '05-19' },
  { name: 'Lutterbach', kontext: 'Praxisteam Ulrich Stapelfeldt', md: '05-24' },
  { name: 'Zahnarztpraxis Dr. Diana Tasche', kontext: 'Zahnarztpraxis Dr. Diana Tasche', md: '02-14' },
  { name: 'Nancy Wrzosek', kontext: 'Praxisteam Dr. Diana Tasche', md: '04-15' },
  { name: 'Stephanie Schmand', kontext: 'Praxisteam Dr. Diana Tasche', md: '12-29' },
  { name: 'Dr. Dagmar Volk', kontext: 'eigene Praxis', md: '04-29' },
  { name: 'Darko Savic', kontext: 'Zahnwerk Frästechnik GmbH', md: '01-15' },
  { name: 'Firas Kassar', kontext: 'Zahnwerk Frästechnik GmbH', md: '01-24' },
  { name: 'Juri Kan', kontext: 'Zahnwerk Frästechnik GmbH', md: '03-07' },
  { name: 'Tobias Welzel', kontext: 'Zahnwerk Frästechnik GmbH', md: '10-26' },
  { name: 'Claus Deimel', kontext: 'Zahnwerk Frästechnik GmbH', md: '12-03' },
];

function getUpcomingBirthdays(daysAhead) {
  const now = new Date();
  const results = [];
  for (const b of KNOWN_BIRTHDAYS) {
    const [mm, dd] = b.md.split('-').map(Number);
    let next = new Date(now.getFullYear(), mm - 1, dd);
    if (next < new Date(now.getFullYear(), now.getMonth(), now.getDate())) {
      next = new Date(now.getFullYear() + 1, mm - 1, dd);
    }
    const diffDays = Math.round((next - new Date(now.getFullYear(), now.getMonth(), now.getDate())) / 86400000);
    if (diffDays <= daysAhead) {
      results.push({ name: b.name, kontext: b.kontext, datum: b.md, inTagen: diffDays });
    }
  }
  return results.sort((a, b) => a.inTagen - b.inTagen);
}

function isDateWithinRange(dateStr, von, bis) {
  return dateStr >= von && dateStr <= bis;
}

// Findet in der Frage genannte Fahrernamen (oder erkennt allgemeine Fragen wie
// "wer ist krank" / "wer hat Urlaub") und holt Live-Daten aus dem Fahrplan.
async function getFahrplanLiveDataForMessage(message) {
  let vacationData, sickData;
  try {
    [vacationData, sickData] = await Promise.all([
      fetchFahrplanDoc('urlaub-antraege-2027'),
      fetchFahrplanDoc('krankmeldungen-2027'),
    ]);
  } catch (e) {
    return { error: 'Verbindung zur Fahrplan-Datenbank fehlgeschlagen: ' + e.message };
  }
  if (!vacationData && !sickData) return null;

  vacationData = vacationData || {};
  sickData = sickData || {};

  const lowerMsg = message.toLowerCase();
  const matchedDrivers = FAHRPLAN_DRIVERS.filter((name) => {
    const first = name.split(' ')[0].toLowerCase();
    return lowerMsg.includes(name.toLowerCase()) || lowerMsg.includes(first);
  });

  const asksGeneral =
    /wer ist (gerade |aktuell |heute )?(krank|im urlaub)|wer (ist|sind) (krank|im urlaub)|wer fehlt|krankenstand/.test(lowerMsg);

  const today = todayIsoDate();
  const result = {};

  // Konkrete(r) genannte(r) Fahrer: volle Historie (Urlaub + Krankmeldungen)
  if (matchedDrivers.length) {
    result.angefragteFahrer = matchedDrivers.slice(0, 3).map((name) => {
      const vac = (vacationData[name] || []).map((r) => ({
        von: r.von,
        bis: r.bis,
        tage: r.tage,
        status: r.status,
      }));
      const sick = (sickData[name] || []).map((r) => ({
        von: r.von,
        bis: r.bis,
        notiz: r.notiz || '',
      }));
      const takenApproved = vac.filter((v) => v.status === 'approved').reduce((s, v) => s + (v.tage || 0), 0);
      const currentlySick = sick.some((r) => isDateWithinRange(today, r.von, r.bis));
      const currentlyOnVacation = vac.some((v) => v.status === 'approved' && isDateWithinRange(today, v.von, v.bis));
      return {
        name,
        urlaubsanspruchProJahr: 8,
        urlaubstageGenommenGenehmigt: takenApproved,
        urlaubstageVerbleibend: 8 - takenApproved,
        urlaubsantraege: vac,
        krankmeldungenHistorie: sick,
        istHeuteKrank: currentlySick,
        istHeuteImUrlaub: currentlyOnVacation,
      };
    });
  }

  // Allgemeine Frage ("wer ist krank/im Urlaub") oder kein Name erkannt:
  // aktuellen Status aller Fahrer für heute mitgeben (günstig, da schon geladen)
  if (asksGeneral || !matchedDrivers.length) {
    result.heutigerStatusAlleFahrer = FAHRPLAN_DRIVERS.map((name) => {
      const vac = vacationData[name] || [];
      const sick = sickData[name] || [];
      const currentlySick = sick.some((r) => isDateWithinRange(today, r.von, r.bis));
      const currentlyOnVacation = vac.some((v) => v.status === 'approved' && isDateWithinRange(today, v.von, v.bis));
      const pendingVacation = vac.some((v) => v.status === 'pending' && isDateWithinRange(today, v.von, v.bis));
      return {
        name,
        heute: currentlySick ? 'krank' : currentlyOnVacation ? 'im_urlaub' : pendingVacation ? 'urlaub_beantragt' : 'normal',
      };
    });
    result.datumHeute = today;
  }

  return Object.keys(result).length ? result : null;
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  let userMessage;
  try {
    const body = JSON.parse(event.body);
    userMessage = body.message;
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Ungültige Anfrage' }) };
  }

  if (!userMessage || typeof userMessage !== 'string') {
    return { statusCode: 400, body: JSON.stringify({ error: 'Keine Nachricht erhalten' }) };
  }

  // Sicherheitscheck: Passwort-/Zugangsdaten-Fragen werden NIE an das
  // Sprachmodell weitergegeben — direkte, feste Antwort, unabhängig davon,
  // wer fragt (diese Function hat kein Login, jeder mit der URL könnte
  // sonst fragen).
  if (/\b(passwort|password|zugangsdaten|login[- ]?daten|credentials?)\b/i.test(userMessage)) {
    return {
      statusCode: 200,
      body: JSON.stringify({
        reply:
          'Aus Sicherheitsgründen kann ich keine Zugangsdaten oder Passwörter herausgeben — das gilt für jede Anfrage, unabhängig davon, wer fragt. Bitte wende dich direkt an das Team unter 02173 – 85 23 40 oder info@weckdental.de.',
      }),
    };
  }

  // Kleiner Spaß-Easter-Egg — feste Antwort, damit sie immer genau gleich
  // und zuverlässig kommt, unabhängig von der Laune des Sprachmodells.
  if (/\bmazza\b/i.test(userMessage)) {
    return {
      statusCode: 200,
      body: JSON.stringify({
        reply:
          'Alejandro "Ale" Mazza ist der beste Mitarbeiter von Weck Dental Technik — kreativ, engagiert, und kommt noch dazu aus dem besten Land der Welt. 🇦🇷🏆',
      }),
    };
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'GEMINI_API_KEY ist nicht konfiguriert (Netlify Umgebungsvariablen prüfen).' }),
    };
  }

  // Wenn die Frage einen Mitarbeiternamen enthält, live aktuelle Stunden/
  // Überstunden/Urlaub aus der Zeiterfassungs-Datenbank abrufen und als
  // zusätzlichen Kontext mitgeben — das sind die einzigen wirklich "frischen"
  // Zahlen in diesem Chat, alles andere kommt aus dem statischen Text oben.
  let liveDataBlock = '';
  try {
    const liveStats = await getLiveEmployeeStatsForMessage(userMessage);
    if (liveStats && liveStats.error) {
      liveDataBlock = `\n\nLIVE_DATEN: Live-Abfrage der Zeiterfassung ist fehlgeschlagen (${liveStats.error}). Weise die Person darauf hin, dass die aktuellen Stunden gerade nicht abrufbar sind, und verweise auf die Zeiterfassungs-App direkt.`;
    } else if (liveStats && liveStats.results && liveStats.results.length) {
      liveDataBlock = '\n\nLIVE_DATEN (gerade eben aus der Zeiterfassungs-Datenbank abgerufen):\n' +
        liveStats.results.map((r) => JSON.stringify(r)).join('\n');
    }
  } catch (e) {
    liveDataBlock = `\n\nLIVE_DATEN: Live-Abfrage der Zeiterfassung ist fehlgeschlagen (${e.message}). Weise die Person darauf hin, dass die aktuellen Stunden gerade nicht abrufbar sind.`;
  }

  // Allgemeine Frage nach der heutigen Belegschaft ("wer arbeitet heute") —
  // separater Pfad, weil hier ALLE Mitarbeiter geprüft werden, nicht nur
  // eine namentlich genannte Person.
  if (looksLikeWhoIsWorkingQuery(userMessage)) {
    try {
      const todayStatus = await getWhoIsWorkingTodayFromZeiterfassung();
      if (todayStatus && todayStatus.error) {
        liveDataBlock += `\n\nLIVE_DATEN_HEUTE: Live-Abfrage ist fehlgeschlagen (${todayStatus.error}).`;
      } else if (todayStatus) {
        liveDataBlock += '\n\nLIVE_DATEN_HEUTE (Status aller Mitarbeiter, gerade eben abgerufen):\n' +
          JSON.stringify(todayStatus);
      }
    } catch (e) {
      liveDataBlock += `\n\nLIVE_DATEN_HEUTE: Live-Abfrage ist fehlgeschlagen (${e.message}).`;
    }
  }

  // Dasselbe für den Fahrplan (Urlaub/Krankmeldungen der Fahrer) — eigener
  // Datenblock, weil es eine andere Fragestellung ist (Fahrer statt Team).
  try {
    const fahrplanLive = await getFahrplanLiveDataForMessage(userMessage);
    if (fahrplanLive && fahrplanLive.error) {
      liveDataBlock += `\n\nLIVE_DATEN_FAHRPLAN: Live-Abfrage des Fahrplans ist fehlgeschlagen (${fahrplanLive.error}). Weise die Person darauf hin, dass Urlaub/Krankenstand der Fahrer gerade nicht abrufbar sind.`;
    } else if (fahrplanLive) {
      liveDataBlock += '\n\nLIVE_DATEN_FAHRPLAN (gerade eben aus der Fahrplan-Datenbank abgerufen, betrifft nur die 9 Fahrer):\n' +
        JSON.stringify(fahrplanLive);
    }
  } catch (e) {
    liveDataBlock += `\n\nLIVE_DATEN_FAHRPLAN: Live-Abfrage des Fahrplans ist fehlgeschlagen (${e.message}).`;
  }

  // Kontakthistorie/Kundenwünsche (CRM: crm-weck-dental) — drittes,
  // eigenständiges Firebase-Projekt.
  try {
    const crmInfo = await getClientCrmInfoForMessage(userMessage);
    if (crmInfo && crmInfo.error) {
      liveDataBlock += `\n\nLIVE_DATEN_CRM: Live-Abfrage des CRM ist fehlgeschlagen (${crmInfo.error}).`;
    } else if (crmInfo && crmInfo.results && crmInfo.results.length) {
      liveDataBlock += '\n\nLIVE_DATEN_CRM (Kontakthistorie und Kundenwünsche, gerade eben aus dem CRM abgerufen):\n' +
        crmInfo.results.map((r) => JSON.stringify(r)).join('\n');
    }
  } catch (e) {
    liveDataBlock += `\n\nLIVE_DATEN_CRM: Live-Abfrage des CRM ist fehlgeschlagen (${e.message}).`;
  }

  // Erinnerungen, Termine, Kurse, Neue Kontakte — je nach erkannter Absicht.
  try {
    const crmOps = await getCrmOperationalDataForMessage(userMessage);
    if (crmOps && crmOps.error) {
      liveDataBlock += `\n\nLIVE_DATEN_CRM_BETRIEB: Live-Abfrage ist fehlgeschlagen (${crmOps.error}).`;
    } else if (crmOps) {
      liveDataBlock += '\n\nLIVE_DATEN_CRM_BETRIEB (gerade eben aus dem CRM abgerufen — Erinnerungen/Termine/Kurse/Neue Kontakte):\n' +
        JSON.stringify(crmOps);
    }
  } catch (e) {
    liveDataBlock += `\n\nLIVE_DATEN_CRM_BETRIEB: Live-Abfrage ist fehlgeschlagen (${e.message}).`;
  }

  // Team-Zugänge zum CRM (wer hat einen Account, welche Rolle)
  try {
    const crmUsers = await getCrmUsersForMessage(userMessage);
    if (crmUsers && crmUsers.error) {
      liveDataBlock += `\n\nLIVE_DATEN_CRM_BENUTZER: Live-Abfrage ist fehlgeschlagen (${crmUsers.error}).`;
    } else if (crmUsers) {
      liveDataBlock += '\n\nLIVE_DATEN_CRM_BENUTZER (gerade eben abgerufen):\n' + JSON.stringify(crmUsers);
    }
  } catch (e) {
    liveDataBlock += `\n\nLIVE_DATEN_CRM_BENUTZER: Live-Abfrage ist fehlgeschlagen (${e.message}).`;
  }

  // Aggregierte Berichte: Team-Überstunden insgesamt, Besuche insgesamt
  if (looksLikeTeamAggregateQuery(userMessage)) {
    try {
      const agg = await getTeamOvertimeAggregate();
      if (agg && agg.error) {
        liveDataBlock += `\n\nLIVE_DATEN_TEAM_UEBERSTUNDEN: Live-Abfrage ist fehlgeschlagen (${agg.error}).`;
      } else if (agg) {
        liveDataBlock += '\n\nLIVE_DATEN_TEAM_UEBERSTUNDEN (Summe über das gesamte Team, gerade eben berechnet):\n' + JSON.stringify(agg);
      }
    } catch (e) {
      liveDataBlock += `\n\nLIVE_DATEN_TEAM_UEBERSTUNDEN: Live-Abfrage ist fehlgeschlagen (${e.message}).`;
    }
  }
  if (looksLikeVisitsAggregateQuery(userMessage)) {
    try {
      const aggV = await getVisitsAggregate();
      if (aggV && aggV.error) {
        liveDataBlock += `\n\nLIVE_DATEN_BESUCHE_GESAMT: Live-Abfrage ist fehlgeschlagen (${aggV.error}).`;
      } else if (aggV) {
        liveDataBlock += '\n\nLIVE_DATEN_BESUCHE_GESAMT (Summe über alle Kunden, gerade eben berechnet):\n' + JSON.stringify(aggV);
      }
    } catch (e) {
      liveDataBlock += `\n\nLIVE_DATEN_BESUCHE_GESAMT: Live-Abfrage ist fehlgeschlagen (${e.message}).`;
    }
  }

  // Anstehende Geburtstage — immer mitgeben (günstig, keine Netzwerkabfrage
  // nötig, ist statisch berechnet), damit Fragen wie "wer hat bald
  // Geburtstag" ohne Namenserkennung funktionieren.
  const upcomingBdays = getUpcomingBirthdays(21);
  if (upcomingBdays.length) {
    liveDataBlock += '\n\nANSTEHENDE_GEBURTSTAGE (nächste 21 Tage, heute ist ' + todayIsoDate() + '):\n' +
      JSON.stringify(upcomingBdays);
  }

  // Google Gemini (kostenloser Tarif) über die OpenAI-kompatible Schnittstelle,
  // damit der Rest des Codes (messages/roles-Format) unverändert bleiben kann.
  const heutigesDatum = todayIsoDate();
  try {
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/openai/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gemini-3.5-flash-lite',
        messages: [
          {
            role: 'system',
            content: `Du bist der Weck AI Assistant. Heutiges Datum: ${heutigesDatum}. Nutze dieses Datum, um mit Datumsangaben im Text (z. B. Urlaubszeiträumen von Kunden) zu vergleichen und zu bestimmen, ob "heute" innerhalb eines genannten Zeitraums liegt.\n\nHier ist dein gesamtes Wissen:\n${KNOWLEDGE_BASE}${liveDataBlock}`,
          },
          { role: 'user', content: userMessage },
        ],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      return {
        statusCode: 502,
        body: JSON.stringify({ error: 'Gemini-Fehler: ' + errText.slice(0, 200) }),
      };
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content ?? 'Keine Antwort erhalten.';

    return {
      statusCode: 200,
      body: JSON.stringify({ reply }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Interner Fehler: ' + err.message }),
    };
  }
};
