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
aktuell sind, im Gegensatz zum statischen Team-Verzeichnis oben.

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

// Liest ein einzelnes kv-Dokument (die App speichert alles als {key, value: JSON-String})
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

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'OPENAI_API_KEY ist nicht konfiguriert (Netlify Umgebungsvariablen prüfen).' }),
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

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        temperature: 0.3,
        messages: [
          {
            role: 'system',
            content: `Du bist der Weck AI Assistant. Hier ist dein gesamtes Wissen:\n${KNOWLEDGE_BASE}${liveDataBlock}`,
          },
          { role: 'user', content: userMessage },
        ],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      return {
        statusCode: 502,
        body: JSON.stringify({ error: 'OpenAI-Fehler: ' + errText.slice(0, 200) }),
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
