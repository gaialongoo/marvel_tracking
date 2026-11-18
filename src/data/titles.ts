/* ============================================================================
   CATALOGO DEI TITOLI
   ----------------------------------------------------------------------------
   BLOCCO 1 — MCU COMPLETO (raccolto il 18/11/2026)

   Fonti ufficiali usate:
   [T]  marvel.com — "See the Complete MCU Timeline on Disney+" (MCU Complete
        Timeline, 81 voci con le stagioni separate) → ORDINE CRONOLOGICO.
        Testo incollato dall'utente (il sito blocca la lettura automatica).
   [R]  disneyplus.com — "How to Watch the Marvel Movies in Order" (4/11/2026)
        → ordine di USCITA, ANNO e FASE dei film; elenco di serie/speciali/corti.
   [IT] disneyplus.com/it-it "Film e show Marvel" + disney.it (Universo Marvel,
        Marvel su Disney+) → TITOLI ITALIANI ufficiali.
   [M]  marvel.com — Spider-Man: Brand New Day: al cinema dal 31/07/2026.
   [D]  Disney (D23 2026, articoli Disney+) → Wonder Man (27/01/2026, 8 ep.),
        VisionQuest (14/10/2026, 8 ep.), Avengers: Doomsday (18/12/2026).

   Ogni titolo ha "unverified": l'elenco dei campi NON ancora confermati da
   una fonte ufficiale (durate, episodi, post-credits… non comparivano nelle
   pagine leggibili). L'app li mostra come "da verificare".

   I titoli fuori dall'MCU (X-Men, Spider-Man Sony) sono ancora quelli di
   ESEMPIO: arriveranno con i blocchi 2–4.
   ============================================================================ */
import type { Field, Link, Title, TitleType } from "../types";

/** Scorciatoia per un collegamento: L(id, motivo IT, motivo EN) */
const L = (id: string, it: string, en: string): Link => ({ id, why: { it, en } });

/* ----------------------------------------------------------------------------
   ORDINE CRONOLOGICO UFFICIALE [T] — la posizione nell'elenco = "chrono"
   ---------------------------------------------------------------------------- */
const TIMELINE = [
  "eow", "ca", "os-carter", "cm", "im", "im2", "hulk", "os-hammer", "thor", "os-consultant",
  "avg", "os-item47", "tdw", "im3", "os-king", "tws", "gotg", "gotg2", "groot1", "groot2",
  "dd1", "jj1", "aou", "antman", "dd2", "lc1", "if1", "defenders", "cw", "bw",
  "bp", "homecoming", "pun1", "ds", "jj2", "lc2", "if2", "dd3", "ragnarok", "pun2",
  "jj3", "amw", "iw", "eg", "loki1", "whatif1", "zombies", "wv", "shangchi", "fatws",
  "ffh", "eternals", "nwh", "dsmom", "hawkeye", "moonknight", "wf", "echo", "shehulk", "msmarvel",
  "lat", "ironheart", "wbn", "holiday", "quantumania", "gotg3", "si", "marvels", "loki2", "whatif2",
  "dpw", "agatha", "whatif3", "ddba1", "bnw", "thunderbolts", "ff", "wonderman", "ddba2", "punolk",
  "visionquest",
];

/* ----------------------------------------------------------------------------
   COSTRUTTORE — scrive i titoli in forma compatta e calcola il resto:
   - saga dalla Fase (1–3 Infinito, 4+ Multiverso)
   - chrono dalla TIMELINE (se il titolo non c'è: in fondo, da verificare)
   - unverified = campi rilevanti MENO quelli confermati (ok)
   ---------------------------------------------------------------------------- */
interface Spec {
  id: string; type: TitleType; it: string; en: string; y: number; min: number;
  eps?: number; ph?: number; c: string; ab: string;
  ch?: string[]; th?: string[]; b?: Link[]; a?: Link[]; pc?: number;
  ok?: Field[];   // campi confermati da fonte ufficiale
}
function mk(s: Spec): Title {
  const pos = TIMELINE.indexOf(s.id);
  const ok = new Set<Field>(s.ok ?? []);
  if (pos >= 0) ok.add("chrono");                          // in [T] → ordine confermato
  const relevant: Field[] = ["it", "y", "min", "pc", "chrono"];
  if (s.eps) relevant.push("eps");
  if (s.ph) relevant.push("phase");
  return {
    id: s.id, uni: "mcu", type: s.type, t: { it: s.it, en: s.en }, y: s.y, min: s.min, eps: s.eps,
    phase: s.ph, saga: s.ph ? (s.ph <= 3 ? "inf" : "multi") : undefined,
    chrono: pos >= 0 ? pos + 1 : TIMELINE.length + 1,
    c: s.c, abbr: s.ab, poster: null, chars: s.ch ?? [], themes: s.th ?? [],
    before: s.b ?? [], after: s.a ?? [], pc: s.pc ?? 0,
    unverified: relevant.filter((f) => !ok.has(f)),
  };
}

/* Insiemi di campi confermati ricorrenti */
const FILM: Field[] = ["it", "y", "phase"];   // film presenti in [R] con titolo italiano in [IT]
const IT: Field[] = ["it"];                   // solo titolo italiano confermato

/* ----------------------------------------------------------------------------
   MCU — scritto in ordine di uscita
   ---------------------------------------------------------------------------- */
const MCU: Title[] = [
  /* ===== FASE 1 ===== */
  mk({ id: "im", type: "film", it: "Iron Man", en: "Iron Man", y: 2008, min: 126, ph: 1, c: "#8c1d26", ab: "IM", ch: ["ironman"], pc: 1, ok: FILM,
    a: [L("im2", "Continua la storia di Tony", "Continues Tony's story"), L("avg", "Tony entra negli Avengers", "Tony joins the Avengers")] }),
  mk({ id: "hulk", type: "film", it: "L'incredibile Hulk", en: "The Incredible Hulk", y: 2008, min: 112, ph: 1, c: "#2f5d3a", ab: "HK", ch: ["hulk"], ok: FILM,
    a: [L("avg", "Bruce Banner torna in scena", "Bruce Banner returns")] }),
  mk({ id: "im2", type: "film", it: "Iron Man 2", en: "Iron Man 2", y: 2010, min: 124, ph: 1, c: "#7a2a1f", ab: "IM2", ch: ["ironman", "blackwidow"], pc: 1, ok: FILM,
    b: [L("im", "Il primo capitolo di Tony", "Tony's first chapter")], a: [L("avg", "Prepara la squadra", "Sets up the team")] }),
  mk({ id: "os-consultant", type: "short", it: "Irripetibili Marvel: Il Consulente", en: "Marvel One-Shot: The Consultant", y: 2011, min: 4, ph: 1, c: "#3a3f48", ab: "OS1", ok: IT,
    b: [L("hulk", "Ambientato dopo L'incredibile Hulk", "Set after The Incredible Hulk")], a: [L("avg", "Lo S.H.I.E.L.D. prepara gli Avengers", "S.H.I.E.L.D. prepares the Avengers")] }),
  mk({ id: "os-hammer", type: "short", it: "Scena comica nel raggiungere il Martello di Thor", en: "Marvel One-Shot: A Funny Thing Happened on the Way to Thor's Hammer", y: 2011, min: 4, ph: 1, c: "#3a3f48", ab: "OS2", ok: IT,
    b: [L("im2", "Coulson durante Iron Man 2", "Coulson during Iron Man 2")], a: [L("thor", "Il martello nel deserto", "The hammer in the desert")] }),
  mk({ id: "thor", type: "film", it: "Thor", en: "Thor", y: 2011, min: 115, ph: 1, c: "#2b4a78", ab: "THR", ch: ["thor", "loki"], pc: 1, ok: FILM,
    a: [L("avg", "Loki diventa il nemico", "Loki becomes the villain"), L("tdw", "Il seguito di Thor", "Thor's sequel")] }),
  mk({ id: "ca", type: "film", it: "Captain America - il primo vendicatore", en: "Captain America: The First Avenger", y: 2011, min: 124, ph: 1, c: "#24406b", ab: "CA", ch: ["cap"], pc: 1, ok: FILM,
    a: [L("os-carter", "Peggy dopo la guerra", "Peggy after the war"), L("avg", "Steve si risveglia nel presente", "Steve wakes up in the present"), L("tws", "Il seguito di Cap", "Cap's sequel")] }),
  mk({ id: "os-item47", type: "short", it: "Irripetibili Marvel: Item 47", en: "Marvel One-Shot: Item 47", y: 2012, min: 12, ph: 1, c: "#3a3f48", ab: "OS3", ok: IT,
    b: [L("avg", "Usa un'arma della battaglia di New York", "Uses a weapon from the Battle of New York")] }),
  mk({ id: "avg", type: "film", it: "The Avengers", en: "The Avengers", y: 2012, min: 143, ph: 1, c: "#3d3569", ab: "AVG", ch: ["ironman", "cap", "thor", "hulk", "loki", "blackwidow", "hawkeye"], th: ["avengers"], pc: 2, ok: FILM,
    b: [L("im", "Presenta Tony Stark", "Introduces Tony Stark"), L("hulk", "Presenta Bruce Banner", "Introduces Bruce Banner"), L("thor", "Presenta Thor e Loki", "Introduces Thor and Loki"), L("ca", "Presenta Steve Rogers", "Introduces Steve Rogers")],
    a: [L("im3", "Tony dopo New York", "Tony after New York"), L("tws", "Steve allo S.H.I.E.L.D.", "Steve at S.H.I.E.L.D."), L("aou", "Il ritorno della squadra", "The team returns")] }),

  /* ===== FASE 2 ===== */
  mk({ id: "im3", type: "film", it: "Iron Man 3", en: "Iron Man 3", y: 2013, min: 130, ph: 2, c: "#8c1d26", ab: "IM3", ch: ["ironman"], pc: 1, ok: FILM,
    b: [L("avg", "Tony dopo New York", "Tony after New York")], a: [L("os-king", "Il destino del finto Mandarino", "The fake Mandarin's fate"), L("aou", "Tony e Ultron", "Tony and Ultron")] }),
  mk({ id: "tdw", type: "film", it: "Thor - The Dark World", en: "Thor: The Dark World", y: 2013, min: 112, ph: 2, c: "#2b4a78", ab: "TDW", ch: ["thor", "loki"], pc: 2, ok: FILM,
    b: [L("thor", "Il primo Thor", "The first Thor"), L("avg", "Loki prigioniero", "Loki imprisoned")], a: [L("gotg", "Il Collezionista", "The Collector"), L("ragnarok", "Il terzo Thor", "The third Thor")] }),
  mk({ id: "os-carter", type: "short", it: "Irripetibili Marvel: Agente Carter", en: "Marvel One-Shot: Agent Carter", y: 2013, min: 15, ph: 2, c: "#3a3f48", ab: "OS4", ch: ["cap"], ok: IT,
    b: [L("ca", "Peggy dopo la guerra", "Peggy after the war")] }),
  mk({ id: "os-king", type: "short", it: "Irripetibili Marvel: Viva il Re", en: "Marvel One-Shot: All Hail the King", y: 2014, min: 14, ph: 2, c: "#3a3f48", ab: "OS5", ok: IT,
    b: [L("im3", "Trevor dopo Iron Man 3", "Trevor after Iron Man 3")], a: [L("shangchi", "Il vero Mandarino", "The real Mandarin")] }),
  mk({ id: "tws", type: "film", it: "Captain America - The Winter Soldier", en: "Captain America: The Winter Soldier", y: 2014, min: 136, ph: 2, c: "#24406b", ab: "TWS", ch: ["cap", "blackwidow", "falcon"], pc: 2, ok: FILM,
    b: [L("ca", "Chi è Bucky", "Who Bucky is"), L("avg", "Steve allo S.H.I.E.L.D.", "Steve at S.H.I.E.L.D.")], a: [L("aou", "La squadra si riunisce", "The team reunites"), L("cw", "Il seguito di Cap", "Cap's sequel")] }),
  mk({ id: "gotg", type: "film", it: "Guardiani della Galassia", en: "Guardians of the Galaxy", y: 2014, min: 121, ph: 2, c: "#5a2d6b", ab: "GG", ch: ["gotg"], pc: 1, ok: FILM,
    a: [L("gotg2", "Il seguito dei Guardiani", "The Guardians' sequel"), L("iw", "I Guardiani incontrano gli Avengers", "The Guardians meet the Avengers")] }),
  mk({ id: "aou", type: "film", it: "Avengers: Age of Ultron", en: "Avengers: Age of Ultron", y: 2015, min: 141, ph: 2, c: "#3d3569", ab: "AOU", ch: ["ironman", "cap", "thor", "hulk", "blackwidow", "hawkeye", "wanda"], th: ["avengers"], pc: 1, ok: FILM,
    b: [L("avg", "Il primo Avengers", "The first Avengers"), L("tws", "La caduta dello S.H.I.E.L.D.", "The fall of S.H.I.E.L.D.")], a: [L("cw", "Le conseguenze di Sokovia", "The Sokovia fallout"), L("wv", "Wanda e Visione", "Wanda and Vision")] }),
  mk({ id: "antman", type: "film", it: "Ant-Man", en: "Ant-Man", y: 2015, min: 117, ph: 2, c: "#6b2a2a", ab: "AM", ch: ["antman"], pc: 2, ok: FILM,
    a: [L("cw", "Scott si unisce a Cap", "Scott joins Cap"), L("amw", "Il seguito di Ant-Man", "Ant-Man's sequel")] }),

  /* ===== Marvel Television · Netflix (nella timeline ufficiale, senza Fase) ===== */
  mk({ id: "dd1", type: "serie", it: "Daredevil (Stagione 1)", en: "Daredevil (Season 1)", y: 2015, min: 700, eps: 13, c: "#6b1414", ab: "DD1", ch: ["daredevil"], th: ["defenders"], ok: IT,
    a: [L("dd2", "La stagione 2", "Season 2"), L("defenders", "Matt nei Defenders", "Matt in The Defenders")] }),
  mk({ id: "jj1", type: "serie", it: "Jessica Jones (Stagione 1)", en: "Jessica Jones (Season 1)", y: 2015, min: 680, eps: 13, c: "#4a2a5a", ab: "JJ1", ch: ["jessica"], th: ["defenders"], ok: IT,
    a: [L("lc1", "Luke Cage debutta qui", "Luke Cage debuts here"), L("jj2", "La stagione 2", "Season 2")] }),

  /* ===== FASE 3 ===== */
  mk({ id: "cw", type: "film", it: "Captain America: Civil War", en: "Captain America: Civil War", y: 2016, min: 147, ph: 3, c: "#24406b", ab: "CW", ch: ["cap", "ironman", "blackwidow", "spidey", "blackpanther", "antman", "falcon", "hawkeye", "wanda"], th: ["avengers"], pc: 2, ok: FILM,
    b: [L("tws", "Steve e Bucky", "Steve and Bucky"), L("aou", "Gli accordi di Sokovia", "The Sokovia Accords")], a: [L("bp", "T'Challa re", "T'Challa as king"), L("homecoming", "Peter dopo Berlino", "Peter after Berlin"), L("bw", "Natasha in fuga", "Natasha on the run")] }),
  mk({ id: "dd2", type: "serie", it: "Daredevil (Stagione 2)", en: "Daredevil (Season 2)", y: 2016, min: 700, eps: 13, c: "#6b1414", ab: "DD2", ch: ["daredevil", "punisher"], th: ["defenders"], ok: IT,
    b: [L("dd1", "La stagione 1", "Season 1")], a: [L("defenders", "I Defenders", "The Defenders"), L("pun1", "Il Punitore da solo", "The Punisher on his own")] }),
  mk({ id: "lc1", type: "serie", it: "Luke Cage (Stagione 1)", en: "Luke Cage (Season 1)", y: 2016, min: 700, eps: 13, c: "#5a4a1a", ab: "LC1", ch: ["lukecage"], th: ["defenders"], ok: IT,
    b: [L("jj1", "Dove appare Luke", "Where Luke appears")], a: [L("defenders", "I Defenders", "The Defenders")] }),
  mk({ id: "ds", type: "film", it: "Doctor Strange", en: "Doctor Strange", y: 2016, min: 115, ph: 3, c: "#5a1f4a", ab: "DS", ch: ["strange"], pc: 2, ok: FILM,
    a: [L("ragnarok", "Strange incontra Thor", "Strange meets Thor"), L("iw", "La Gemma del Tempo", "The Time Stone"), L("dsmom", "Il seguito di Strange", "Strange's sequel")] }),
  mk({ id: "gotg2", type: "film", it: "Guardiani della Galassia Vol. 2", en: "Guardians of the Galaxy Vol. 2", y: 2017, min: 136, ph: 3, c: "#5a2d6b", ab: "GG2", ch: ["gotg"], pc: 5, ok: FILM,
    b: [L("gotg", "Il primo film", "The first film")], a: [L("groot1", "Le avventure di Baby Groot", "Baby Groot's adventures"), L("holiday", "Lo speciale di Natale", "The holiday special"), L("iw", "I Guardiani e Thanos", "The Guardians and Thanos")] }),
  mk({ id: "if1", type: "serie", it: "Iron Fist (Stagione 1)", en: "Iron Fist (Season 1)", y: 2017, min: 700, eps: 13, c: "#2e5a2a", ab: "IF1", ch: ["ironfist"], th: ["defenders"], ok: IT,
    a: [L("defenders", "I Defenders", "The Defenders")] }),
  mk({ id: "homecoming", type: "film", it: "Spider-Man: Homecoming", en: "Spider-Man: Homecoming", y: 2017, min: 133, ph: 3, c: "#8a1c2a", ab: "SMH", ch: ["spidey", "ironman"], pc: 2, ok: IT,
    b: [L("cw", "Il debutto di Peter", "Peter's debut")], a: [L("iw", "Peter con gli Avengers", "Peter with the Avengers"), L("ffh", "Il seguito di Spider-Man", "Spider-Man's sequel")] }),
  mk({ id: "defenders", type: "serie", it: "The Defenders", en: "The Defenders", y: 2017, min: 400, eps: 8, c: "#4a1a1a", ab: "DEF", ch: ["daredevil", "jessica", "lukecage", "ironfist"], th: ["defenders"], ok: IT,
    b: [L("dd2", "Matt Murdock", "Matt Murdock"), L("jj1", "Jessica Jones", "Jessica Jones"), L("lc1", "Luke Cage", "Luke Cage"), L("if1", "Danny Rand", "Danny Rand")], a: [L("dd3", "Matt dopo i Defenders", "Matt after The Defenders")] }),
  mk({ id: "ragnarok", type: "film", it: "Thor: Ragnarok", en: "Thor: Ragnarok", y: 2017, min: 130, ph: 3, c: "#2b4a78", ab: "RAG", ch: ["thor", "hulk", "loki"], pc: 2, ok: FILM,
    b: [L("tdw", "Il secondo Thor", "The second Thor"), L("aou", "Dove era finito Hulk", "Where Hulk went")], a: [L("iw", "La nave di Asgard", "The Asgardian ship"), L("lat", "Il quarto Thor", "The fourth Thor")] }),
  mk({ id: "pun1", type: "serie", it: "The Punisher (Stagione 1)", en: "The Punisher (Season 1)", y: 2017, min: 700, eps: 13, c: "#2a2a2a", ab: "PUN1", ch: ["punisher"], th: ["defenders"], ok: IT,
    b: [L("dd2", "Il debutto di Frank Castle", "Frank Castle's debut")], a: [L("pun2", "La stagione 2", "Season 2")] }),
  mk({ id: "bp", type: "film", it: "Black Panther", en: "Black Panther", y: 2018, min: 134, ph: 3, c: "#3a2a5e", ab: "BP", ch: ["blackpanther"], pc: 2, ok: FILM,
    b: [L("cw", "Il debutto di T'Challa", "T'Challa's debut")], a: [L("iw", "La battaglia in Wakanda", "The battle in Wakanda"), L("wf", "Il seguito", "The sequel")] }),
  mk({ id: "jj2", type: "serie", it: "Jessica Jones (Stagione 2)", en: "Jessica Jones (Season 2)", y: 2018, min: 680, eps: 13, c: "#4a2a5a", ab: "JJ2", ch: ["jessica"], th: ["defenders"], ok: IT,
    b: [L("defenders", "Jessica nei Defenders", "Jessica in The Defenders")], a: [L("jj3", "La stagione 3", "Season 3")] }),
  mk({ id: "iw", type: "film", it: "Avengers: Infinity War", en: "Avengers: Infinity War", y: 2018, min: 149, ph: 3, c: "#4b2c6b", ab: "IW", ch: ["ironman", "cap", "thor", "hulk", "loki", "strange", "spidey", "gotg", "blackpanther", "blackwidow", "wanda", "falcon"], th: ["avengers"], pc: 1, ok: FILM,
    b: [L("ragnarok", "Thor e Hulk", "Thor and Hulk"), L("bp", "Il Wakanda", "Wakanda"), L("gotg2", "Gamora e Nebula", "Gamora and Nebula")], a: [L("eg", "Il seguito diretto", "The direct sequel")] }),
  mk({ id: "lc2", type: "serie", it: "Luke Cage (Stagione 2)", en: "Luke Cage (Season 2)", y: 2018, min: 700, eps: 13, c: "#5a4a1a", ab: "LC2", ch: ["lukecage"], th: ["defenders"], ok: IT,
    b: [L("lc1", "La stagione 1", "Season 1")] }),
  mk({ id: "amw", type: "film", it: "Ant-Man and the Wasp", en: "Ant-Man and the Wasp", y: 2018, min: 118, ph: 3, c: "#6b2a2a", ab: "AMW", ch: ["antman"], pc: 2, ok: FILM,
    b: [L("antman", "Il primo Ant-Man", "The first Ant-Man"), L("cw", "Scott agli arresti domiciliari", "Scott under house arrest")], a: [L("eg", "Il Regno Quantico", "The Quantum Realm"), L("quantumania", "Il terzo Ant-Man", "The third Ant-Man")] }),
  mk({ id: "if2", type: "serie", it: "Iron Fist (Stagione 2)", en: "Iron Fist (Season 2)", y: 2018, min: 520, eps: 10, c: "#2e5a2a", ab: "IF2", ch: ["ironfist"], th: ["defenders"], ok: IT,
    b: [L("if1", "La stagione 1", "Season 1")] }),
  mk({ id: "dd3", type: "serie", it: "Daredevil (Stagione 3)", en: "Daredevil (Season 3)", y: 2018, min: 730, eps: 13, c: "#6b1414", ab: "DD3", ch: ["daredevil"], th: ["defenders"], ok: IT,
    b: [L("defenders", "Il finale dei Defenders", "The Defenders' ending")], a: [L("ddba1", "Daredevil: Rinascita", "Daredevil: Born Again")] }),
  mk({ id: "pun2", type: "serie", it: "The Punisher (Stagione 2)", en: "The Punisher (Season 2)", y: 2019, min: 700, eps: 13, c: "#2a2a2a", ab: "PUN2", ch: ["punisher"], th: ["defenders"], ok: IT,
    b: [L("pun1", "La stagione 1", "Season 1")], a: [L("ddba1", "Frank torna in Rinascita", "Frank returns in Born Again")] }),
  mk({ id: "cm", type: "film", it: "Captain Marvel", en: "Captain Marvel", y: 2019, min: 123, ph: 3, c: "#2a3f7a", ab: "CM", ch: ["captainmarvel"], pc: 2, ok: FILM,
    a: [L("avg", "Fury e il Tesseract", "Fury and the Tesseract"), L("eg", "Carol torna", "Carol returns"), L("marvels", "Il seguito", "The sequel")] }),
  mk({ id: "eg", type: "film", it: "Avengers: Endgame", en: "Avengers: Endgame", y: 2019, min: 181, ph: 3, c: "#5a3a1c", ab: "EG", ch: ["ironman", "cap", "thor", "hulk", "loki", "strange", "spidey", "gotg", "blackpanther", "blackwidow", "antman", "captainmarvel", "hawkeye", "wanda", "falcon"], th: ["avengers"], ok: FILM,
    b: [L("iw", "Il seguito diretto", "The direct sequel"), L("cm", "Carol Danvers", "Carol Danvers"), L("amw", "Il Regno Quantico", "The Quantum Realm")],
    a: [L("loki1", "Una variante di Loki fugge", "A Loki variant escapes"), L("wv", "Wanda dopo la battaglia", "Wanda after the battle"), L("fatws", "Lo scudo di Cap", "Cap's shield"), L("ffh", "Il mondo dopo il Blip", "The world after the Blip")] }),
  mk({ id: "jj3", type: "serie", it: "Jessica Jones (Stagione 3)", en: "Jessica Jones (Season 3)", y: 2019, min: 650, eps: 13, c: "#4a2a5a", ab: "JJ3", ch: ["jessica"], th: ["defenders"], ok: IT,
    b: [L("jj2", "La stagione 2", "Season 2")] }),
  mk({ id: "ffh", type: "film", it: "Spider-Man: Far From Home", en: "Spider-Man: Far From Home", y: 2019, min: 129, ph: 3, c: "#8a1c2a", ab: "FFH", ch: ["spidey"], pc: 2, ok: IT,
    b: [L("homecoming", "Il primo Spider-Man MCU", "The first MCU Spider-Man"), L("eg", "Peter dopo Tony", "Peter after Tony")], a: [L("nwh", "L'identità rivelata", "The identity revealed")] }),

  /* ===== FASE 4 ===== */
  mk({ id: "wv", type: "serie", it: "WandaVision", en: "WandaVision", y: 2021, min: 350, eps: 9, ph: 4, c: "#6b1f3a", ab: "WV", ch: ["wanda"], ok: ["it", "y"],
    b: [L("eg", "Wanda dopo Endgame", "Wanda after Endgame")], a: [L("dsmom", "Scarlet Witch", "Scarlet Witch"), L("agatha", "Agatha", "Agatha"), L("visionquest", "Visione", "Vision")] }),
  mk({ id: "fatws", type: "serie", it: "The Falcon and The Winter Soldier", en: "The Falcon and the Winter Soldier", y: 2021, min: 330, eps: 6, ph: 4, c: "#2a4a6b", ab: "FWS", ch: ["falcon", "cap"], ok: IT,
    b: [L("eg", "Lo scudo di Cap", "Cap's shield")], a: [L("bnw", "Sam è Captain America", "Sam as Captain America"), L("thunderbolts", "John Walker", "John Walker")] }),
  mk({ id: "loki1", type: "serie", it: "Loki (Stagione 1)", en: "Loki (Season 1)", y: 2021, min: 300, eps: 6, ph: 4, c: "#3b5a2a", ab: "LK1", ch: ["loki"], th: ["multi"], ok: IT,
    b: [L("avg", "Il Loki del 2012", "The 2012 Loki"), L("eg", "Da dove fugge Loki", "Where Loki escapes from")], a: [L("loki2", "La stagione 2", "Season 2"), L("whatif1", "Il Multiverso", "The Multiverse")] }),
  mk({ id: "bw", type: "film", it: "Black Widow", en: "Black Widow", y: 2021, min: 134, ph: 4, c: "#2a2a3a", ab: "BW", ch: ["blackwidow"], pc: 1, ok: FILM,
    b: [L("cw", "Natasha in fuga", "Natasha on the run")], a: [L("hawkeye", "Yelena e Clint", "Yelena and Clint"), L("thunderbolts", "Yelena nei Thunderbolts*", "Yelena in the Thunderbolts*")] }),
  mk({ id: "whatif1", type: "anim", it: "What If…? (Stagione 1)", en: "What If…? (Season 1)", y: 2021, min: 300, eps: 9, ph: 4, c: "#5c4a1e", ab: "WI1", th: ["multi"], ok: IT,
    b: [L("loki1", "Il Multiverso si apre", "The Multiverse opens")], a: [L("zombies", "Gli zombie dell'episodio 5", "The zombies from episode 5"), L("whatif2", "La stagione 2", "Season 2")] }),
  mk({ id: "shangchi", type: "film", it: "Shang-Chi e la Leggenda dei Dieci Anelli", en: "Shang-Chi and the Legend of the Ten Rings", y: 2021, min: 132, ph: 4, c: "#6b2a1f", ab: "SC", ch: ["shangchi"], pc: 2, ok: FILM,
    b: [L("os-king", "Il vero Mandarino", "The real Mandarin")] }),
  mk({ id: "eternals", type: "film", it: "Eternals", en: "Eternals", y: 2021, min: 156, ph: 4, c: "#6b5a2a", ab: "ETR", pc: 2, ok: FILM,
    b: [L("eg", "Dopo il Blip", "After the Blip")] }),
  mk({ id: "hawkeye", type: "serie", it: "Hawkeye", en: "Hawkeye", y: 2021, min: 300, eps: 6, ph: 4, c: "#4a2a6b", ab: "HWK", ch: ["hawkeye", "blackwidow"], ok: IT,
    b: [L("eg", "Clint dopo Endgame", "Clint after Endgame"), L("bw", "Yelena", "Yelena")], a: [L("echo", "Maya Lopez", "Maya Lopez")] }),
  mk({ id: "nwh", type: "film", it: "Spider-Man: No Way Home", en: "Spider-Man: No Way Home", y: 2021, min: 148, ph: 4, c: "#8a1c2a", ab: "NWH", ch: ["spidey", "strange"], th: ["multi"], pc: 2, ok: IT,
    b: [L("ffh", "L'identità rivelata", "The identity revealed"), L("ds", "Doctor Strange", "Doctor Strange")], a: [L("dsmom", "Il Multiverso di Strange", "Strange's Multiverse"), L("bnd", "Il nuovo inizio di Peter", "Peter's new beginning")] }),
  mk({ id: "moonknight", type: "serie", it: "Moon Knight", en: "Moon Knight", y: 2022, min: 300, eps: 6, ph: 4, c: "#4a4a5a", ab: "MK", ok: ["it", "y"] }),
  mk({ id: "dsmom", type: "film", it: "Doctor Strange nel Multiverso della Follia", en: "Doctor Strange in the Multiverse of Madness", y: 2022, min: 126, ph: 4, c: "#5a1f4a", ab: "DS2", ch: ["strange", "wanda"], th: ["multi"], pc: 2, ok: FILM,
    b: [L("wv", "Wanda", "Wanda"), L("nwh", "Il Multiverso si apre", "The Multiverse opens")] }),
  mk({ id: "msmarvel", type: "serie", it: "Ms. Marvel", en: "Ms. Marvel", y: 2022, min: 300, eps: 6, ph: 4, c: "#2a4a7a", ab: "MSM", ch: ["captainmarvel"], ok: ["it", "y"],
    a: [L("marvels", "Kamala con Carol", "Kamala with Carol")] }),
  mk({ id: "lat", type: "film", it: "Thor: Love and Thunder", en: "Thor: Love and Thunder", y: 2022, min: 119, ph: 4, c: "#2b4a78", ab: "LAT", ch: ["thor", "gotg"], pc: 2, ok: FILM,
    b: [L("ragnarok", "Il terzo Thor", "The third Thor"), L("eg", "Thor parte coi Guardiani", "Thor leaves with the Guardians")] }),
  mk({ id: "groot1", type: "anim", it: "I Am Groot (Stagione 1)", en: "I Am Groot (Season 1)", y: 2022, min: 20, eps: 5, ph: 4, c: "#4a3a1f", ab: "IAG1", ch: ["gotg"], ok: IT,
    b: [L("gotg2", "Baby Groot", "Baby Groot")], a: [L("groot2", "La stagione 2", "Season 2")] }),
  mk({ id: "shehulk", type: "serie", it: "She-Hulk: Attorney at Law", en: "She-Hulk: Attorney at Law", y: 2022, min: 300, eps: 9, ph: 4, c: "#3a6b3a", ab: "SH", ch: ["hulk", "daredevil"], ok: ["it", "eps"],
    b: [L("eg", "Bruce dopo Endgame", "Bruce after Endgame")], a: [L("ddba1", "Matt Murdock", "Matt Murdock")] }),
  mk({ id: "wbn", type: "special", it: "Licantropus", en: "Werewolf by Night", y: 2022, min: 53, ph: 4, c: "#3a3a3a", ab: "WBN", ok: IT }),
  mk({ id: "wf", type: "film", it: "Black Panther: Wakanda Forever", en: "Black Panther: Wakanda Forever", y: 2022, min: 161, ph: 4, c: "#3a2a5e", ab: "WF", ch: ["blackpanther"], pc: 1, ok: FILM,
    b: [L("bp", "Il primo Black Panther", "The first Black Panther")], a: [L("ironheart", "Riri Williams", "Riri Williams")] }),
  mk({ id: "holiday", type: "special", it: "Marvel Studios presenta: Guardiani della Galassia Holiday Special", en: "The Guardians of the Galaxy Holiday Special", y: 2022, min: 44, ph: 4, c: "#2a5a3a", ab: "GHS", ch: ["gotg"], ok: IT,
    b: [L("gotg2", "I Guardiani", "The Guardians")], a: [L("gotg3", "Il terzo film", "The third film")] }),

  /* ===== FASE 5 ===== */
  mk({ id: "quantumania", type: "film", it: "Ant-Man and the Wasp: Quantumania", en: "Ant-Man and the Wasp: Quantumania", y: 2023, min: 124, ph: 5, c: "#6b2a2a", ab: "AMQ", ch: ["antman"], th: ["multi"], pc: 2, ok: FILM,
    b: [L("amw", "Il secondo Ant-Man", "The second Ant-Man"), L("loki1", "Colui che rimane", "He Who Remains")], a: [L("loki2", "Le varianti di Kang", "Kang's variants")] }),
  mk({ id: "gotg3", type: "film", it: "Guardiani della Galassia: Volume 3", en: "Guardians of the Galaxy Vol. 3", y: 2023, min: 150, ph: 5, c: "#5a2d6b", ab: "GG3", ch: ["gotg"], pc: 2, ok: FILM,
    b: [L("gotg2", "Il secondo film", "The second film"), L("holiday", "Lo speciale di Natale", "The holiday special")] }),
  mk({ id: "si", type: "serie", it: "Secret Invasion", en: "Secret Invasion", y: 2023, min: 280, eps: 6, ph: 5, c: "#2e4a3a", ab: "SI", ch: ["captainmarvel"], ok: ["it", "y"],
    b: [L("cm", "Gli Skrull", "The Skrulls"), L("fatws", "Rhodey e il governo", "Rhodey and the government")], a: [L("marvels", "Nick Fury nello spazio", "Nick Fury in space")] }),
  mk({ id: "groot2", type: "anim", it: "I Am Groot (Stagione 2)", en: "I Am Groot (Season 2)", y: 2023, min: 20, eps: 5, ph: 5, c: "#4a3a1f", ab: "IAG2", ch: ["gotg"], ok: IT,
    b: [L("groot1", "La stagione 1", "Season 1")] }),
  mk({ id: "loki2", type: "serie", it: "Loki (Stagione 2)", en: "Loki (Season 2)", y: 2023, min: 300, eps: 6, ph: 5, c: "#3b5a2a", ab: "LK2", ch: ["loki"], th: ["multi"], ok: ["it", "y"],
    b: [L("loki1", "La stagione 1", "Season 1"), L("quantumania", "Kang", "Kang")], a: [L("dpw", "La TVA", "The TVA")] }),
  mk({ id: "marvels", type: "film", it: "The Marvels", en: "The Marvels", y: 2023, min: 105, ph: 5, c: "#2a3f7a", ab: "MVL", ch: ["captainmarvel"], pc: 1, ok: FILM,
    b: [L("cm", "Carol Danvers", "Carol Danvers"), L("msmarvel", "Kamala Khan", "Kamala Khan"), L("wv", "Monica Rambeau", "Monica Rambeau")] }),
  mk({ id: "whatif2", type: "anim", it: "What If…? (Stagione 2)", en: "What If…? (Season 2)", y: 2023, min: 300, eps: 9, ph: 5, c: "#5c4a1e", ab: "WI2", th: ["multi"], ok: IT,
    b: [L("whatif1", "La stagione 1", "Season 1")], a: [L("whatif3", "La stagione 3", "Season 3")] }),
  mk({ id: "echo", type: "serie", it: "Echo", en: "Echo", y: 2024, min: 220, eps: 5, ph: 5, c: "#4a3a2a", ab: "ECH", ch: ["daredevil"], ok: IT,
    b: [L("hawkeye", "Il debutto di Maya", "Maya's debut")], a: [L("ddba1", "Kingpin", "Kingpin")] }),
  mk({ id: "dpw", type: "film", it: "Deadpool & Wolverine", en: "Deadpool & Wolverine", y: 2024, min: 128, ph: 5, c: "#7a1f2b", ab: "D&W", ch: ["wolverine", "deadpool"], th: ["multi"], pc: 1, ok: FILM,
    b: [L("logan", "L'ultimo Wolverine", "The last Wolverine"), L("loki2", "La TVA", "The TVA")] }),
  mk({ id: "agatha", type: "serie", it: "Agatha All Along", en: "Agatha All Along", y: 2024, min: 370, eps: 9, ph: 5, c: "#4a2a5a", ab: "AGA", ch: ["wanda"], ok: IT,
    b: [L("wv", "Agatha a Westview", "Agatha in Westview")], a: [L("visionquest", "Visione", "Vision")] }),
  mk({ id: "whatif3", type: "anim", it: "What If…? (Stagione 3)", en: "What If…? (Season 3)", y: 2024, min: 260, eps: 8, ph: 5, c: "#5c4a1e", ab: "WI3", th: ["multi"], ok: IT,
    b: [L("whatif2", "La stagione 2", "Season 2")] }),
  mk({ id: "ddba1", type: "serie", it: "Daredevil: Rinascita (Stagione 1)", en: "Daredevil: Born Again (Season 1)", y: 2025, min: 430, eps: 9, ph: 5, c: "#6b1414", ab: "DBA1", ch: ["daredevil", "punisher"], th: ["defenders"], ok: IT,
    b: [L("dd3", "Daredevil su Netflix", "Daredevil on Netflix"), L("echo", "Kingpin", "Kingpin")], a: [L("ddba2", "La stagione 2", "Season 2")] }),
  mk({ id: "bnw", type: "film", it: "Captain America: Brave New World", en: "Captain America: Brave New World", y: 2025, min: 118, ph: 5, c: "#24406b", ab: "BNW", ch: ["falcon", "cap"], pc: 1, ok: FILM,
    b: [L("fatws", "Sam prende lo scudo", "Sam takes the shield")], a: [L("thunderbolts", "Il governo e Valentina", "The government and Valentina")] }),
  mk({ id: "thunderbolts", type: "film", it: "Thunderbolts*", en: "Thunderbolts*", y: 2025, min: 127, ph: 5, c: "#3a3a2a", ab: "TB*", ch: ["blackwidow"], pc: 2, ok: FILM,
    b: [L("bw", "Yelena", "Yelena"), L("fatws", "John Walker", "John Walker"), L("bnw", "Valentina", "Valentina")] }),
  mk({ id: "ironheart", type: "serie", it: "Ironheart", en: "Ironheart", y: 2025, min: 280, eps: 6, ph: 5, c: "#7a2a1a", ab: "IH", ok: IT,
    b: [L("wf", "Il debutto di Riri", "Riri's debut")] }),
  mk({ id: "eow", type: "anim", it: "Eyes of Wakanda", en: "Eyes of Wakanda", y: 2025, min: 120, eps: 4, ph: 5, c: "#4a2a6b", ab: "EOW", ch: ["blackpanther"], ok: IT,
    a: [L("bp", "Il Wakanda di T'Challa", "T'Challa's Wakanda")] }),
  mk({ id: "zombies", type: "anim", it: "Marvel Zombies", en: "Marvel Zombies", y: 2025, min: 160, eps: 4, ph: 5, c: "#3a4a2a", ab: "MZ", th: ["multi"], ok: IT,
    b: [L("whatif1", "Nasce dall'episodio zombie", "Spun off from the zombie episode")] }),

  /* ===== FASE 6 ===== */
  mk({ id: "ff", type: "film", it: "I Fantastici 4: Gli Inizi", en: "The Fantastic Four: First Steps", y: 2025, min: 115, ph: 6, c: "#1f4a7a", ab: "FF", ch: ["fantastic4"], pc: 2, ok: FILM }),
  mk({ id: "wonderman", type: "serie", it: "Wonder Man", en: "Wonder Man", y: 2026, min: 260, eps: 8, ph: 6, c: "#6b4a1a", ab: "WM", ok: ["y", "eps"] }),
  mk({ id: "ddba2", type: "serie", it: "Daredevil: Rinascita (Stagione 2)", en: "Daredevil: Born Again (Season 2)", y: 2026, min: 400, eps: 8, ph: 6, c: "#6b1414", ab: "DBA2", ch: ["daredevil", "punisher"], th: ["defenders"], ok: IT,
    b: [L("ddba1", "La stagione 1", "Season 1")], a: [L("punolk", "Frank Castle", "Frank Castle")] }),
  mk({ id: "bnd", type: "film", it: "Spider-Man: Brand New Day", en: "Spider-Man: Brand New Day", y: 2026, min: 130, ph: 6, c: "#8a1c2a", ab: "BND", ch: ["spidey"], ok: ["y"],
    b: [L("nwh", "Peter dopo No Way Home", "Peter after No Way Home")] }),
  mk({ id: "punolk", type: "special", it: "The Punisher: One Last Kill", en: "The Punisher: One Last Kill", y: 2026, min: 50, ph: 6, c: "#2a2a2a", ab: "POK", ch: ["punisher"], th: ["defenders"], ok: IT,
    b: [L("ddba2", "Frank in Rinascita", "Frank in Born Again"), L("pun2", "The Punisher su Netflix", "The Punisher on Netflix")] }),
  mk({ id: "visionquest", type: "serie", it: "VisionQuest", en: "VisionQuest", y: 2026, min: 360, eps: 8, ph: 6, c: "#6b5a1a", ab: "VQ", ch: ["wanda"], ok: ["it", "y", "eps"],
    b: [L("wv", "Visione", "Vision"), L("agatha", "Dopo Agatha", "After Agatha")] }),
];

/* ----------------------------------------------------------------------------
   FUORI DALL'MCU — ancora titoli di ESEMPIO (blocchi 2–4), tutto da verificare
   ---------------------------------------------------------------------------- */
const ALL_FIELDS: Field[] = ["it", "y", "min", "pc", "chrono"];
const sample = (t: Omit<Title, "poster" | "themes" | "unverified" | "pc">): Title =>
  ({ ...t, poster: null, themes: [], pc: 0, unverified: ALL_FIELDS });

const OTHERS: Title[] = [
  sample({ id: "xmen", uni: "xmen", type: "film", t: { it: "X-Men", en: "X-Men" }, y: 2000, min: 104, chrono: 1, c: "#3b4a5c", abbr: "XM",
    chars: ["wolverine"], before: [], after: [L("x2", "Il seguito diretto", "The direct sequel")] }),
  sample({ id: "x2", uni: "xmen", type: "film", t: { it: "X-Men 2", en: "X2" }, y: 2003, min: 133, chrono: 2, c: "#2e3b52", abbr: "X2",
    chars: ["wolverine"], before: [L("xmen", "Il primo capitolo", "The first chapter")], after: [L("logan", "Il futuro di Logan", "Logan's future")] }),
  sample({ id: "logan", uni: "xmen", type: "film", t: { it: "Logan - The Wolverine", en: "Logan" }, y: 2017, min: 137, chrono: 3, c: "#5a4630", abbr: "LGN",
    chars: ["wolverine"], before: [L("x2", "Il passato di Logan", "Logan's past")], after: [L("dpw", "Wolverine nell'MCU", "Wolverine in the MCU")] }),
  sample({ id: "sm02", uni: "spider", type: "film", t: { it: "Spider-Man", en: "Spider-Man" }, y: 2002, min: 121, chrono: 1, c: "#8a1c2a", abbr: "SM",
    chars: ["spidey"], before: [], after: [] }),
];

/** Tutti i titoli in ordine di uscita (sort stabile: a parità di anno resta l'ordine scritto) */
export const DATA: Title[] = [...MCU, ...OTHERS].sort((a, b) => a.y - b.y);

/** Accesso rapido per id */
export const BY_ID: Record<string, Title> = Object.fromEntries(DATA.map((d) => [d.id, d]));
