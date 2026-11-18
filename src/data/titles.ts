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

   BLOCCO 2 (in fondo al file): film e animazione fuori MCU presenti su
   Disney+ Italia. Quelli non su Disney+ arriveranno nei blocchi successivi.
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
  uni?: string;   // universo (predefinito "mcu")
  cr?: number;    // posizione cronologica per i titoli fuori MCU (= ordine di uscita, da verificare)
}
/* ----------------------------------------------------------------------------
   VERIFICHE DALLE PAGINE DISNEY+ ITALIA DEI SINGOLI TITOLI (18/11/2026)
   disneyplus.com/it-it/browse/entity-… → durata (film/corti/speciali),
   anno, numero di episodi. Le pagine delle serie NON mostrano la durata
   degli episodi: per le serie la durata totale resta "da verificare".
   min = durata ufficiale · eps = episodi confermati · y = anno confermato
   ---------------------------------------------------------------------------- */
const DPV: Record<string, { min?: number; eps?: boolean; y?: boolean }> = {
  // Film
  im: { min: 127 }, im2: { min: 124 }, thor: { min: 117 }, ca: { min: 126 }, avg: { min: 146 },
  im3: { min: 132 }, tdw: { min: 115 }, tws: { min: 139 }, gotg: { min: 123 }, aou: { min: 144 },
  antman: { min: 120 }, cw: { min: 151 }, ds: { min: 116 }, gotg2: { min: 138 }, homecoming: { min: 133, y: true },
  ragnarok: { min: 133 }, bp: { min: 138 }, iw: { min: 154 }, amw: { min: 122 }, cm: { min: 127 },
  eg: { min: 185 }, ffh: { min: 129, y: true }, bw: { min: 136 }, shangchi: { min: 135 }, eternals: { min: 156 },
  nwh: { min: 148, y: true }, dsmom: { min: 128 }, lat: { min: 121 }, wf: { min: 163 }, quantumania: { min: 126 },
  gotg3: { min: 152 }, marvels: { min: 106 }, dpw: { min: 130 }, bnw: { min: 120 }, thunderbolts: { min: 128 }, ff: { min: 116 },
  // Corti (Irripetibili Marvel) e speciali
  "os-consultant": { min: 3, y: true }, "os-item47": { min: 11, y: true }, "os-carter": { min: 15, y: true },
  "os-king": { min: 13, y: true }, "os-hammer": { min: 3, y: true },
  wbn: { min: 54, y: true }, holiday: { min: 44, y: true }, punolk: { min: 50, y: true },
  // Serie: episodi; anno solo se coincide con l'inizio/fine indicati da Disney+
  wv: { eps: true, y: true }, fatws: { eps: true, y: true }, loki1: { eps: true, y: true }, loki2: { eps: true, y: true },
  whatif1: { eps: true, y: true }, whatif2: { eps: true }, whatif3: { eps: true, y: true },
  hawkeye: { eps: true, y: true }, moonknight: { eps: true, y: true }, msmarvel: { eps: true, y: true }, shehulk: { eps: true, y: true },
  groot1: { eps: true, y: true }, groot2: { eps: true, y: true }, si: { eps: true, y: true }, echo: { eps: true, y: true },
  agatha: { eps: true, y: true }, ddba1: { eps: true, y: true }, ddba2: { eps: true, y: true }, ironheart: { eps: true, y: true },
  eow: { eps: true, y: true }, zombies: { eps: true, y: true }, visionquest: { eps: true, y: true },
  dd1: { eps: true, y: true }, dd2: { eps: true }, dd3: { eps: true, y: true },
  jj1: { eps: true, y: true }, jj2: { eps: true }, jj3: { eps: true, y: true },
  lc1: { eps: true, y: true }, lc2: { eps: true, y: true }, if1: { eps: true, y: true }, if2: { eps: true, y: true },
  defenders: { eps: true, y: true }, pun1: { eps: true, y: true }, pun2: { eps: true, y: true },
};

/* ----------------------------------------------------------------------------
   VERIFICHE DA FONTI NON UFFICIALI MA AFFIDABILI (18/11/2026)
   it.wikipedia.org / en.wikipedia.org (voci dei film e delle serie, "List of
   television series based on Marvel Comics publications", "Mid-credits and
   post-credits scenes in the Marvel Cinematic Universe").
   Usate SOLO dove le pagine ufficiali non dicono nulla. Se Disney+ e
   Wikipedia non coincidono (es. numero di episodi), vale Disney+.
   it = titolo italiano (stringa = corregge il nostro) · y = anno confermato ·
   min / eps = valore confermato · pc = numero di scene dopo i titoli
   ---------------------------------------------------------------------------- */
const REL: Record<string, { it?: string | true; y?: true; min?: number; eps?: number; pc?: number }> = {
  // MCU — scene dopo i titoli (voce Wikipedia letta per intero fino a Captain Marvel)
  im: { pc: 1 }, hulk: { pc: 0, min: 112, it: true, y: true }, im2: { pc: 1 }, thor: { pc: 1 }, ca: { pc: 1 },
  avg: { pc: 2 }, im3: { pc: 1 }, tdw: { pc: 2 }, tws: { pc: 2 }, gotg: { pc: 2 }, aou: { pc: 1 },
  antman: { pc: 2 }, cw: { pc: 2 }, ds: { pc: 2 }, gotg2: { pc: 5 }, homecoming: { pc: 2 }, ragnarok: { pc: 2 },
  bp: { pc: 2 }, iw: { pc: 1 }, amw: { pc: 2 }, cm: { pc: 2 }, eg: { pc: 0 }, wbn: { pc: 0 },
  bnd: { min: 145, it: true },
  // Film fuori MCU (it.wikipedia + en.wikipedia)
  sm1: { it: true, y: true, min: 121 }, sm2: { it: true, y: true, min: 127 }, sm3: { it: true, y: true, min: 139 },
  venom: { it: true, y: true, min: 112 }, venom2: { it: true, y: true, min: 97 }, morbius: { it: true, y: true, min: 104 },
  madameweb: { it: true, y: true, min: 116 }, venom3: { it: true, y: true, min: 109 }, kraven: { it: true, y: true, min: 127 },
  newmutants: { it: true, y: true, min: 94 }, atsv: { it: true, y: true, min: 140 },
  // Serie live-action fuori MCU
  hulk77: { it: "L'incredibile Hulk (1977)", y: true, eps: 80 }, asm77: { it: "The Amazing Spider-Man (1977)", y: true, eps: 13 },
  aos: { y: true, eps: 136 }, legion: { it: true, y: true, eps: 27 }, gifted: { it: true, y: true, eps: 29 },
  runaways: { it: true, y: true, eps: 33 }, cloakdagger: { it: true, y: true, eps: 20 },
  // Animazione fuori MCU (episodi e anni dalla lista Wikipedia; titoli italiani dalle voci it.wikipedia)
  f467: { it: "I Fantastici Quattro (1967)", y: true, eps: 20 }, sm67: { it: "L'Uomo Ragno (1967)", y: true, eps: 52 },
  f478: { it: "I Fantastici Quattro (1978)", y: true, eps: 13 }, spiderwoman79: { it: "Donna Ragno", y: true, eps: 16 }, sm81: { it: "L'Uomo Ragno (1981)", y: true, eps: 26 },
  smaf: { it: true, y: true, eps: 24 },
  sm94: { it: "Spider-Man - L'Uomo Ragno", y: true, eps: 65 },
  smtnas: { it: true, y: true, eps: 13 },
  "anime-im": { y: true, eps: 12 }, "anime-wolv": { eps: 12 }, "anime-xmen": { eps: 12 }, "anime-blade": { eps: 12 },
  assemble: { eps: 127 },
};

/* Secondo giro di verifiche (stesse fonti): si FONDE con REL campo per campo */
const REL2: typeof REL = {
  // MCU: scene dopo i titoli dei One-Shot (voce "Mid-credits and post-credits scenes…")
  "os-item47": { pc: 1 }, "os-carter": { pc: 1 }, "os-king": { pc: 1 },
  // Film fuori MCU: scene dopo i titoli lette nelle trame delle voci en.wikipedia
  xmen: { pc: 0 }, x2: { pc: 0 }, x3: { pc: 1 }, xow: { pc: 3 }, xfc: { pc: 0 }, wolv13: { pc: 1 }, dofp: { pc: 1 },
  deadpool: { pc: 1 }, apocalypse: { pc: 1 }, logan: { pc: 0 }, darkphoenix: { pc: 0 }, newmutants: { pc: 0 },
  ff2005: { pc: 0 }, ff2007: { pc: 1 }, fant4stic: { pc: 0 }, tasm: { pc: 1 },
  sm1: { pc: 0 }, sm2: { pc: 0 }, sm3: { pc: 0 }, venom: { pc: 2 }, venom2: { pc: 1 }, morbius: { pc: 2 },
  madameweb: { pc: 0 }, venom3: { pc: 2 }, kraven: { pc: 0 },
  // Film fuori MCU: titolo italiano, anno, durata (it.wikipedia; animati dalla tabella "Marvel Animated Features")
  howard: { it: true, y: true, min: 111 }, punisher89: { it: "Il vendicatore (1989)", y: true, min: 89 },
  capamerica90: { it: "Capitan America (1990)", y: true, min: 97 }, blade: { it: true, y: true, min: 120 },
  blade2: { it: true, y: true, min: 117 }, hulk03: { it: true, min: 138 },
  ultavengers: { it: true, y: true, min: 72 }, ultavengers2: { it: true, y: true, min: 73 },
  invincibleim: { it: "L'invincibile Iron Man", y: true, min: 83 }, drstrange07: { it: "Dottor Strange - Il mago supremo", y: true, min: 76 },
  nextavengers: { it: "Next Avengers - Gli eroi di domani", y: true, min: 78 }, hulkvs: { it: "Hulk Vs.", y: true, min: 78 },
  planethulk: { it: true, y: true, min: 81 }, thortales: { it: true, y: true, min: 77 },
  // Serie: titoli italiani e anni (it.wikipedia)
  f494: { it: "I Fantastici Quattro (1994)", y: true, eps: 26 }, spectacular: { it: "The Spectacular Spider-Man", y: true, eps: 26 },
  wolvxmen: { it: true, y: true, eps: 26 }, imaa: { it: true, y: true, eps: 52 }, xmenevo: { it: true, y: true, eps: 52 },
  silversurfer: { it: true, y: true, eps: 13 },
  hulk96: { it: true, y: true, eps: 21 }, ironman94: { it: true, y: true, eps: 26 }, hulk82: { it: true, y: true, eps: 13 },
  msh66: { it: true, y: true, eps: 65 },
  helstrom: { it: true, y: true, eps: 10 }, modok: { it: true, y: true, eps: 10 }, hitmonkey: { it: true, y: true, eps: 20 },
  moongirl: { it: "Moon Girl e Devil Dinosaur", y: true, eps: 41 }, xmen92: { it: "Insuperabili X-Men", y: true, eps: 76 },
  dd2: { y: true }, jj2: { y: true }, whatif2: { y: true }, wonderman: { it: true, y: true, eps: 8 },
};

/** Fasi MCU confermate (en.wikipedia: "Marvel Cinematic Universe: Phase Four/Five/Six",
    titoli di sezione della voce sulle scene dopo i titoli per Fase 1–3) */
const PHASE_OK = new Set([
  "wv", "fatws", "loki1", "loki2", "whatif1", "whatif2", "whatif3", "hawkeye", "moonknight", "msmarvel", "shehulk",
  "groot1", "groot2", "wbn", "holiday", "si", "echo", "agatha", "ddba1", "ddba2", "ironheart", "eow", "zombies",
  "wonderman", "punolk", "visionquest", "homecoming", "ffh", "nwh", "bnd", "os-item47", "os-carter", "os-king",
]);

/* Terzo giro (en/it.wikipedia lette parola per parola).
   Scene dopo i titoli: confermate solo se il testo letto coincide con le altre
   fonti. Se la trama non ne parla ma altre fonti sì, il valore resta in SOFT. */
const REL3: typeof REL = {
  // MCU (sezione Trama delle voci dei film)
  ffh: { pc: 2 }, bw: { pc: 1 }, shangchi: { pc: 2 }, eternals: { pc: 2 }, lat: { pc: 2 }, wf: { pc: 1 },
  quantumania: { pc: 2 }, marvels: { pc: 1 }, bnw: { pc: 1 }, "os-consultant": { pc: 0 }, "os-hammer": { pc: 0 },
  // Film fuori MCU
  daredevil03: { it: true, y: true, min: 103, pc: 0 }, elektra: { it: true, y: true, min: 97, pc: 0 },
  punisher04: { it: true, y: true, min: 123, pc: 0 }, warzone: { it: true, y: true, min: 103, pc: 0 },
  manthing: { it: true, y: true, min: 97, pc: 0 }, ghostrider: { it: true, y: true, min: 110 },
  ghostrider2: { it: true, y: true, min: 95 }, blade3: { it: true, y: true, min: 113, pc: 0 },
  technovore: { it: true, y: true, min: 88, pc: 0 }, avconf: { it: "Avengers Confidential: La Vedova Nera & Punisher", y: true, min: 83, pc: 0 },
  rising: { it: "Marvel Rising - Secret Warriors", y: true, min: 80, pc: 0 }, genx: { it: true, y: true, min: 87, pc: 0 },
  nickfury98: { it: "Nick Fury", y: true, min: 90, pc: 0 },
  punisher89: { pc: 0 }, capamerica90: { pc: 0 }, blade: { pc: 0 }, blade2: { pc: 0 }, hulk03: { y: true },
  deadpool2: { pc: 2 }, spiderverse: { pc: 1 }, hulkwmd: { pc: 0 }, imhulk: { pc: 0 }, imcap: { pc: 0 },
  // Marvel Anime (Madhouse): anni ed episodi; i titoli italiani coincidono con gli originali
  "anime-im": { it: true }, "anime-wolv": { it: true, y: true }, "anime-xmen": { it: true, y: true }, "anime-blade": { it: true, y: true },
};

/** Verifiche unite: per ogni titolo i campi di REL, REL2 e REL3 insieme */
const VER: typeof REL = { ...REL };
for (const extra of [REL2, REL3]) for (const [id, f] of Object.entries(extra)) VER[id] = { ...VER[id], ...f };

/* Valori aggiornati da un riassunto delle fonti affidabili, NON ancora
   confermati parola per parola: si usano ma restano "da verificare". */
const SOFT: Record<string, { pc?: number }> = {
  // la trama su Wikipedia ne cita meno di quante indicate dalle altre letture → resta da verificare
  holiday: { pc: 1 }, bnd: { pc: 1 }, nwh: { pc: 2 }, dsmom: { pc: 2 }, gotg3: { pc: 2 }, dpw: { pc: 1 },
  thunderbolts: { pc: 2 }, ff: { pc: 2 }, tasm2: { pc: 1 }, atsv: { pc: 0 },
};

function mk(s: Spec): Title {
  const uni = s.uni ?? "mcu";
  const pos = uni === "mcu" ? TIMELINE.indexOf(s.id) : -1;
  const ok = new Set<Field>(s.ok ?? []);
  // Applica le verifiche Disney+ (durata ufficiale sostituisce quella stimata)
  const v = DPV[s.id];
  if (v?.min) { s = { ...s, min: v.min }; ok.add("min"); }
  if (v?.eps) ok.add("eps");
  if (v?.y || v?.min) ok.add("y");
  if (v) ok.add("it");
  // Applica le verifiche delle fonti affidabili (Wikipedia)
  const r = VER[s.id];
  if (r) {
    if (typeof r.it === "string") s = { ...s, it: r.it };
    if (r.it) ok.add("it");
    if (r.y) ok.add("y");
    if (r.min) { s = { ...s, min: r.min }; ok.add("min"); }
    if (r.eps && !v?.eps) { s = { ...s, eps: r.eps }; ok.add("eps"); } // Disney+ ha la precedenza
    if (r.pc !== undefined) { s = { ...s, pc: r.pc }; ok.add("pc"); }
  }
  if (PHASE_OK.has(s.id)) ok.add("phase");
  const soft = SOFT[s.id];
  if (soft?.pc !== undefined) s = { ...s, pc: soft.pc };
  // Serie: la durata totale è sempre una stima (episodi × durata media) → non si segnala.
  // Fuori MCU l'ordine "cronologico" è per definizione l'anno di uscita → non si segnala.
  if (s.eps) { ok.add("min"); ok.add("pc"); } // serie: niente conteggio unico delle scene dopo i titoli
  if (uni !== "mcu") ok.add("chrono");
  if (pos >= 0) ok.add("chrono");                          // in [T] → ordine confermato
  const relevant: Field[] = ["it", "y", "min", "pc", "chrono"];
  if (s.eps) relevant.push("eps");
  if (s.ph) relevant.push("phase");
  return {
    id: s.id, uni, type: s.type, t: { it: s.it, en: s.en }, y: s.y, min: s.min, eps: s.eps,
    phase: s.ph, saga: s.ph ? (s.ph <= 3 ? "inf" : "multi") : undefined,
    // MCU: posizione nella timeline ufficiale (fuori timeline = in fondo);
    // altri universi: nessuna timeline ufficiale → anno di uscita (da verificare)
    chrono: pos >= 0 ? pos + 1 : uni === "mcu" ? TIMELINE.length + 1 : s.y,
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
  mk({ id: "eow", type: "anim", it: "Eyes of Wakanda", en: "Eyes of Wakanda", y: 2025, min: 120, eps: 4, ph: 6, c: "#4a2a6b", ab: "EOW", ch: ["blackpanther"], ok: IT,
    a: [L("bp", "Il Wakanda di T'Challa", "T'Challa's Wakanda")] }),
  mk({ id: "zombies", type: "anim", it: "Marvel Zombies", en: "Marvel Zombies", y: 2025, min: 160, eps: 4, ph: 6, c: "#3a4a2a", ab: "MZ", th: ["multi"], ok: IT,
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
   BLOCCO 2 — FUORI DALL'MCU, presenti su Disney+ Italia
   Fonte [E]: pagine dei singoli titoli su disneyplus.com/it-it (titolo
   italiano, anno, durata, stagioni/episodi). L'ordine cronologico dentro
   ogni universo per ora segue l'uscita → da verificare.
   ---------------------------------------------------------------------------- */
const DP: Field[] = ["it", "y", "min"];   // film: confermati dalla pagina Disney+ del titolo
const DPS: Field[] = ["it", "y", "eps"];  // serie: anno ed episodi dalla pagina Disney+

const OTHERS: Title[] = [
  /* ===== X-Men (20th Century Fox) ===== */
  mk({ uni: "xmen", cr: 1, id: "xmen", type: "film", it: "X-Men", en: "X-Men", y: 2000, min: 105, c: "#3b4a5c", ab: "XM", ch: ["wolverine"], ok: DP,
    a: [L("x2", "Il seguito diretto", "The direct sequel")] }),
  mk({ uni: "xmen", cr: 2, id: "x2", type: "film", it: "X-Men 2", en: "X2", y: 2003, min: 134, c: "#2e3b52", ab: "X2", ch: ["wolverine"], ok: DP,
    b: [L("xmen", "Il primo film", "The first film")], a: [L("x3", "Il terzo capitolo", "The third chapter")] }),
  mk({ uni: "xmen", cr: 3, id: "x3", type: "film", it: "X-Men - Conflitto finale", en: "X-Men: The Last Stand", y: 2006, min: 105, c: "#3a3550", ab: "X3", ch: ["wolverine"], ok: DP,
    b: [L("x2", "Jean e il lago Alkali", "Jean and Alkali Lake")], a: [L("wolv13", "Logan dopo Jean", "Logan after Jean")] }),
  mk({ uni: "xmen", cr: 4, id: "xow", type: "film", it: "X-Men Le origini - Wolverine", en: "X-Men Origins: Wolverine", y: 2009, min: 108, c: "#5a3f2a", ab: "XOW", ch: ["wolverine", "deadpool"], ok: DP,
    a: [L("xmen", "Logan incontra gli X-Men", "Logan meets the X-Men")] }),
  mk({ uni: "xmen", cr: 5, id: "xfc", type: "film", it: "X-Men: L'Inizio", en: "X-Men: First Class", y: 2011, min: 133, c: "#2f4a6b", ab: "XFC", ok: DP,
    a: [L("dofp", "Il seguito", "The sequel")] }),
  mk({ uni: "xmen", cr: 6, id: "wolv13", type: "film", it: "Wolverine - L'immortale", en: "The Wolverine", y: 2013, min: 127, c: "#4a3a2a", ab: "WLV", ch: ["wolverine"], ok: DP,
    b: [L("x3", "Logan dopo Conflitto finale", "Logan after The Last Stand")], a: [L("dofp", "La scena dopo i titoli", "The mid-credits scene")] }),
  mk({ uni: "xmen", cr: 7, id: "dofp", type: "film", it: "X-Men: Giorni di un futuro passato", en: "X-Men: Days of Future Past", y: 2014, min: 133, c: "#3a3f5a", ab: "DFP", ch: ["wolverine"], ok: DP,
    b: [L("xfc", "Gli X-Men giovani", "The young X-Men"), L("x3", "Gli X-Men del futuro", "The future X-Men")], a: [L("apocalypse", "Il seguito", "The sequel"), L("logan", "Il futuro di Logan", "Logan's future")] }),
  mk({ uni: "xmen", cr: 8, id: "deadpool", type: "film", it: "Deadpool", en: "Deadpool", y: 2016, min: 110, c: "#7a1f2b", ab: "DP", ch: ["deadpool"], ok: DP,
    a: [L("deadpool2", "Il seguito", "The sequel")] }),
  mk({ uni: "xmen", cr: 9, id: "apocalypse", type: "film", it: "X-Men: Apocalisse", en: "X-Men: Apocalypse", y: 2016, min: 145, c: "#4a3a5e", ab: "APO", ch: ["wolverine"], ok: DP,
    b: [L("dofp", "La nuova linea temporale", "The new timeline")], a: [L("darkphoenix", "Il seguito", "The sequel")] }),
  mk({ uni: "xmen", cr: 10, id: "logan", type: "film", it: "Logan - The Wolverine", en: "Logan", y: 2017, min: 139, c: "#5a4630", ab: "LGN", ch: ["wolverine"], ok: DP,
    b: [L("wolv13", "Il secondo Wolverine", "The second Wolverine")], a: [L("dpw", "Wolverine nell'MCU", "Wolverine in the MCU")] }),
  mk({ uni: "xmen", cr: 11, id: "deadpool2", type: "film", it: "Deadpool 2", en: "Deadpool 2", y: 2018, min: 121, c: "#7a1f2b", ab: "DP2", ch: ["deadpool"], ok: DP,
    b: [L("deadpool", "Il primo Deadpool", "The first Deadpool")], a: [L("dpw", "Deadpool nell'MCU", "Deadpool in the MCU")] }),
  mk({ uni: "xmen", cr: 12, id: "darkphoenix", type: "film", it: "X-Men: Dark Phoenix", en: "Dark Phoenix", y: 2019, min: 116, c: "#6b2a1f", ab: "DPX", ok: DP,
    b: [L("apocalypse", "Il film precedente", "The previous film")] }),

  /* ===== Fantastici 4 (20th Century Fox) ===== */
  mk({ uni: "f4fox", cr: 1, id: "ff2005", type: "film", it: "I Fantastici 4", en: "Fantastic Four", y: 2005, min: 106, c: "#1f4a7a", ab: "F4", ch: ["fantastic4"], ok: DP,
    a: [L("ff2007", "Il seguito", "The sequel")] }),
  mk({ uni: "f4fox", cr: 2, id: "ff2007", type: "film", it: "I fantastici 4 e Silver Surfer", en: "Fantastic Four: Rise of the Silver Surfer", y: 2007, min: 92, c: "#2a4a6b", ab: "F4SS", ch: ["fantastic4"], ok: DP,
    b: [L("ff2005", "Il primo film", "The first film")] }),
  mk({ uni: "f4fox", cr: 3, id: "fant4stic", type: "film", it: "Fantastic 4 - I fantastici quattro", en: "Fantastic Four", y: 2015, min: 102, c: "#2a3a5a", ab: "F4·15", ch: ["fantastic4"], ok: DP }),

  /* ===== Spider-Man (Sony Pictures) ===== */
  mk({ uni: "sony", cr: 1, id: "tasm", type: "film", it: "The Amazing Spider-Man", en: "The Amazing Spider-Man", y: 2012, min: 136, c: "#8a1c2a", ab: "TASM", ch: ["spidey"], ok: DP,
    a: [L("tasm2", "Il seguito", "The sequel")] }),
  mk({ uni: "sony", cr: 2, id: "tasm2", type: "film", it: "The Amazing Spider-Man 2", en: "The Amazing Spider-Man 2", y: 2014, min: 141, c: "#7a1c3a", ab: "TASM2", ch: ["spidey"], ok: DP,
    b: [L("tasm", "Il primo film", "The first film")], a: [L("nwh", "Questo Peter torna", "This Peter returns")] }),
  mk({ uni: "sony", cr: 3, id: "spiderverse", type: "anim", it: "Spider-Man: Un nuovo universo", en: "Spider-Man: Into the Spider-Verse", y: 2018, min: 116, c: "#6b1f5a", ab: "SV", ch: ["spidey"], th: ["multi"], ok: DP }),

  /* ===== Animazione Marvel (fuori MCU) ===== */
  mk({ uni: "animation", cr: 1, id: "hulkwmd", type: "anim", it: "Hulk: nella terra dei mostri", en: "Hulk: Where Monsters Dwell", y: 2016, min: 77, c: "#2f5d3a", ab: "HWMD", ch: ["hulk", "strange"], ok: DP }),
  mk({ uni: "animation", cr: 2, id: "sm2017", type: "anim", it: "Spider-Man", en: "Marvel's Spider-Man", y: 2017, min: 1320, eps: 60, c: "#8a1c2a", ab: "SM17", ch: ["spidey"], ok: DPS }),
  mk({ uni: "animation", cr: 3, id: "smshorts", type: "anim", it: "Spider-Man (Shorts)", en: "Spider-Man (Shorts)", y: 2017, min: 20, eps: 6, c: "#8a1c2a", ab: "SMS", ch: ["spidey"], ok: DPS }),
  mk({ uni: "animation", cr: 4, id: "xmen97", type: "anim", it: "X-Men ’97", en: "X-Men ’97", y: 2024, min: 570, eps: 19, c: "#3b4a5c", ab: "X97", ch: ["wolverine"], ok: DPS }),
  mk({ uni: "animation", cr: 5, id: "fnsm", type: "anim", it: "Il vostro amichevole Spider-Man di quartiere", en: "Your Friendly Neighborhood Spider-Man", y: 2025, min: 280, eps: 10, c: "#8a1c2a", ab: "FNSM", ch: ["spidey", "daredevil"], ok: DPS }),
  mk({ uni: "animation", cr: 6, id: "jeff", type: "anim", it: "Jeff e i suoi amici supereroi", en: "Jeff and His Superhero Friends", y: 2026, min: 30, eps: 6, c: "#2a5a6b", ab: "JEFF", ok: DPS }),

  /* ===== Spider-Man e Sony (fuori da Disney+) ===== */
  mk({ uni: "sony", id: "sm1", type: "film", it: "Spider-Man", en: "Spider-Man", y: 2002, min: 121, c: "#8a1c2a", ab: "SM1", ch: ["spidey"] }),
  mk({ uni: "sony", id: "sm2", type: "film", it: "Spider-Man 2", en: "Spider-Man 2", y: 2004, min: 127, c: "#8a1c2a", ab: "SM2", ch: ["spidey"] }),
  mk({ uni: "sony", id: "sm3", type: "film", it: "Spider-Man 3", en: "Spider-Man 3", y: 2007, min: 139, c: "#2a2a3a", ab: "SM3", ch: ["spidey"] }),
  mk({ uni: "sony", id: "venom", type: "film", it: "Venom", en: "Venom", y: 2018, min: 112, c: "#1a1a22", ab: "VNM", ch: ["venom"] }),
  mk({ uni: "sony", id: "venom2", type: "film", it: "Venom - La furia di Carnage", en: "Venom: Let There Be Carnage", y: 2021, min: 97, c: "#5a1414", ab: "VNM2", ch: ["venom"] }),
  mk({ uni: "sony", id: "morbius", type: "film", it: "Morbius", en: "Morbius", y: 2022, min: 104, c: "#2a3a4a", ab: "MRB" }),
  mk({ uni: "sony", id: "atsv", type: "anim", it: "Spider-Man: Across the Spider-Verse", en: "Spider-Man: Across the Spider-Verse", y: 2023, min: 140, c: "#6b1f5a", ab: "ATSV", ch: ["spidey"] }),
  mk({ uni: "sony", id: "madameweb", type: "film", it: "Madame Web", en: "Madame Web", y: 2024, min: 116, c: "#6b2a3a", ab: "MW" }),
  mk({ uni: "sony", id: "venom3", type: "film", it: "Venom: The Last Dance", en: "Venom: The Last Dance", y: 2024, min: 109, c: "#1a1a22", ab: "VNM3", ch: ["venom"] }),
  mk({ uni: "sony", id: "kraven", type: "film", it: "Kraven - Il cacciatore", en: "Kraven the Hunter", y: 2024, min: 127, c: "#4a3a1a", ab: "KRV" }),

  /* ===== Fox, fuori da Disney+ ===== */
  mk({ uni: "xmen", id: "newmutants", type: "film", it: "The New Mutants", en: "The New Mutants", y: 2020, min: 94, c: "#3a2a4a", ab: "NM" }),

  /* ===== Altri film Marvel (altri studi) ===== */
  mk({ uni: "other", id: "daredevil03", type: "film", it: "Daredevil", en: "Daredevil", y: 2003, min: 103, c: "#6b1414", ab: "DD03", ch: ["daredevil"] }),
  mk({ uni: "other", id: "elektra", type: "film", it: "Elektra", en: "Elektra", y: 2005, min: 97, c: "#5a1a2a", ab: "ELK", ch: ["daredevil"] }),
  mk({ uni: "other", id: "howard", type: "film", it: "Howard e il destino del mondo", en: "Howard the Duck", y: 1986, min: 110, c: "#5a4a2a", ab: "HTD" }),
  mk({ uni: "other", id: "punisher89", type: "film", it: "The Punisher (1989)", en: "The Punisher", y: 1989, min: 89, c: "#2a2a2a", ab: "P89", ch: ["punisher"] }),
  mk({ uni: "other", id: "capamerica90", type: "film", it: "Captain America (1990)", en: "Captain America", y: 1990, min: 97, c: "#24406b", ab: "CA90", ch: ["cap"] }),
  mk({ uni: "other", id: "blade", type: "film", it: "Blade", en: "Blade", y: 1998, min: 120, c: "#2a1a1a", ab: "BLD", ch: ["blade"] }),
  mk({ uni: "other", id: "blade2", type: "film", it: "Blade II", en: "Blade II", y: 2002, min: 117, c: "#2a1a1a", ab: "BLD2", ch: ["blade"] }),
  mk({ uni: "other", id: "hulk03", type: "film", it: "Hulk", en: "Hulk", y: 2003, min: 138, c: "#2f5d3a", ab: "HLK03", ch: ["hulk"] }),
  mk({ uni: "other", id: "punisher04", type: "film", it: "The Punisher (2004)", en: "The Punisher", y: 2004, min: 124, c: "#2a2a2a", ab: "P04", ch: ["punisher"] }),
  mk({ uni: "other", id: "blade3", type: "film", it: "Blade: Trinity", en: "Blade: Trinity", y: 2004, min: 113, c: "#2a1a1a", ab: "BLD3", ch: ["blade"] }),
  mk({ uni: "other", id: "manthing", type: "film", it: "Man-Thing - La natura del terrore", en: "Man-Thing", y: 2005, min: 97, c: "#2a3a2a", ab: "MT" }),
  mk({ uni: "other", id: "ghostrider", type: "film", it: "Ghost Rider", en: "Ghost Rider", y: 2007, min: 110, c: "#6b2a0a", ab: "GR", ch: ["ghostrider"] }),
  mk({ uni: "other", id: "warzone", type: "film", it: "Punisher - Zona di guerra", en: "Punisher: War Zone", y: 2008, min: 103, c: "#2a2a2a", ab: "PWZ", ch: ["punisher"] }),
  mk({ uni: "other", id: "ghostrider2", type: "film", it: "Ghost Rider - Spirito di vendetta", en: "Ghost Rider: Spirit of Vengeance", y: 2012, min: 96, c: "#6b2a0a", ab: "GR2", ch: ["ghostrider"] }),

  /* ===== Serie live-action fuori dalla timeline MCU (Marvel Television, ABC, Hulu, Freeform, FX…) ===== */
  mk({ uni: "tv", id: "hulk77", type: "serie", it: "L'incredibile Hulk (1977)", en: "The Incredible Hulk", y: 1977, min: 3800, eps: 80, c: "#2f5d3a", ab: "HLK77", ch: ["hulk"] }),
  mk({ uni: "tv", id: "asm77", type: "serie", it: "L'uomo ragno (1977)", en: "The Amazing Spider-Man", y: 1977, min: 600, eps: 13, c: "#8a1c2a", ab: "ASM77", ch: ["spidey"] }),
  mk({ uni: "tv", id: "genx", type: "special", it: "Generation X", en: "Generation X", y: 1996, min: 85, c: "#3a3f5a", ab: "GENX" }),
  mk({ uni: "tv", id: "nickfury98", type: "special", it: "Nick Fury", en: "Nick Fury: Agent of S.H.I.E.L.D.", y: 1998, min: 90, c: "#3a3f48", ab: "NF98" }),
  mk({ uni: "tv", id: "aos", type: "serie", it: "Agents of S.H.I.E.L.D.", en: "Agents of S.H.I.E.L.D.", y: 2013, min: 5800, eps: 136, c: "#2a3f5a", ab: "AOS", ch: ["shield"], ok: ["it", "y"] }),
  mk({ uni: "tv", id: "agentcarter", type: "serie", it: "Agent Carter", en: "Agent Carter", y: 2015, min: 760, eps: 18, c: "#4a2a2a", ab: "AC", ch: ["cap"], ok: ["it", "y", "eps"] }),
  mk({ uni: "tv", id: "inhumans", type: "serie", it: "Inhumans", en: "Inhumans", y: 2017, min: 340, eps: 8, c: "#3a3a5a", ab: "INH", ok: ["it", "y", "eps"] }),
  mk({ uni: "tv", id: "legion", type: "serie", it: "Legion", en: "Legion", y: 2017, min: 1400, eps: 27, c: "#3a2a5a", ab: "LGN·S" }),
  mk({ uni: "tv", id: "gifted", type: "serie", it: "The Gifted", en: "The Gifted", y: 2017, min: 1250, eps: 29, c: "#3a4a5a", ab: "GFT" }),
  mk({ uni: "tv", id: "runaways", type: "serie", it: "Runaways", en: "Runaways", y: 2017, min: 1500, eps: 33, c: "#4a3a5a", ab: "RUN" }),
  mk({ uni: "tv", id: "cloakdagger", type: "serie", it: "Cloak & Dagger", en: "Cloak & Dagger", y: 2018, min: 860, eps: 20, c: "#2a2a4a", ab: "C&D" }),
  mk({ uni: "tv", id: "helstrom", type: "serie", it: "Helstrom", en: "Helstrom", y: 2020, min: 450, eps: 10, c: "#3a1a1a", ab: "HLS" }),

  /* ===== Animazione classica e recente (fuori MCU) ===== */
  mk({ uni: "animation", id: "msh66", type: "anim", it: "The Marvel Super Heroes", en: "The Marvel Super Heroes", y: 1966, min: 1300, eps: 65, c: "#4a3a2a", ab: "MSH" }),
  mk({ uni: "animation", id: "f467", type: "anim", it: "I Fantastici 4 (1967)", en: "Fantastic Four", y: 1967, min: 400, eps: 20, c: "#1f4a7a", ab: "F4·67", ch: ["fantastic4"] }),
  mk({ uni: "animation", id: "sm67", type: "anim", it: "L'Uomo Ragno (1967)", en: "Spider-Man", y: 1967, min: 1100, eps: 52, c: "#8a1c2a", ab: "SM67", ch: ["spidey"] }),
  mk({ uni: "animation", id: "f478", type: "anim", it: "I nuovi Fantastici Quattro (1978)", en: "The New Fantastic Four", y: 1978, min: 290, eps: 13, c: "#1f4a7a", ab: "F4·78", ch: ["fantastic4"] }),
  mk({ uni: "animation", id: "spiderwoman79", type: "anim", it: "Spider-Woman", en: "Spider-Woman", y: 1979, min: 350, eps: 16, c: "#6b1f3a", ab: "SW79" }),
  mk({ uni: "animation", id: "sm81", type: "anim", it: "Spider-Man (1981)", en: "Spider-Man", y: 1981, min: 570, eps: 26, c: "#8a1c2a", ab: "SM81", ch: ["spidey"] }),
  mk({ uni: "animation", id: "smaf", type: "anim", it: "L'Uomo Ragno e i suoi fantastici amici", en: "Spider-Man and His Amazing Friends", y: 1981, min: 550, eps: 24, c: "#8a1c2a", ab: "SMAF", ch: ["spidey"] }),
  mk({ uni: "animation", id: "hulk82", type: "anim", it: "L'incredibile Hulk (1982)", en: "The Incredible Hulk", y: 1982, min: 290, eps: 13, c: "#2f5d3a", ab: "HLK82", ch: ["hulk"] }),
  mk({ uni: "animation", id: "xmen92", type: "anim", it: "X-Men", en: "X-Men: The Animated Series", y: 1992, min: 1680, eps: 76, c: "#3b4a5c", ab: "XTAS", ch: ["wolverine"], ok: ["it", "y"] }),
  mk({ uni: "animation", id: "ironman94", type: "anim", it: "Iron Man (1994)", en: "Iron Man", y: 1994, min: 570, eps: 26, c: "#8c1d26", ab: "IM94", ch: ["ironman"] }),
  mk({ uni: "animation", id: "f494", type: "anim", it: "I Fantastici Quattro (1994)", en: "Fantastic Four", y: 1994, min: 570, eps: 26, c: "#1f4a7a", ab: "F4·94", ch: ["fantastic4"] }),
  mk({ uni: "animation", id: "sm94", type: "anim", it: "Spider-Man (1994)", en: "Spider-Man: The Animated Series", y: 1994, min: 1430, eps: 65, c: "#8a1c2a", ab: "SMTAS", ch: ["spidey"] }),
  mk({ uni: "animation", id: "hulk96", type: "anim", it: "L'incredibile Hulk (1996)", en: "The Incredible Hulk", y: 1996, min: 460, eps: 21, c: "#2f5d3a", ab: "HLK96", ch: ["hulk"] }),
  mk({ uni: "animation", id: "silversurfer", type: "anim", it: "Silver Surfer", en: "Silver Surfer", y: 1998, min: 290, eps: 13, c: "#5a6b7a", ab: "SS", ch: ["fantastic4"] }),
  mk({ uni: "animation", id: "xmenevo", type: "anim", it: "X-Men: Evolution", en: "X-Men: Evolution", y: 2000, min: 1140, eps: 52, c: "#3b4a5c", ab: "XEVO", ch: ["wolverine"] }),
  mk({ uni: "animation", id: "smtnas", type: "anim", it: "Spider-Man: The New Animated Series", en: "Spider-Man: The New Animated Series", y: 2003, min: 290, eps: 13, c: "#8a1c2a", ab: "SMNAS", ch: ["spidey"] }),
  mk({ uni: "animation", id: "ultavengers", type: "anim", it: "Ultimate Avengers", en: "Ultimate Avengers", y: 2006, min: 72, c: "#3d3569", ab: "UA", ch: ["cap", "ironman", "thor", "hulk"] }),
  mk({ uni: "animation", id: "ultavengers2", type: "anim", it: "Ultimate Avengers 2", en: "Ultimate Avengers 2", y: 2006, min: 73, c: "#3d3569", ab: "UA2", ch: ["cap", "ironman", "thor", "hulk"] }),
  mk({ uni: "animation", id: "invincibleim", type: "anim", it: "The Invincible Iron Man", en: "The Invincible Iron Man", y: 2007, min: 83, c: "#8c1d26", ab: "TIIM", ch: ["ironman"] }),
  mk({ uni: "animation", id: "drstrange07", type: "anim", it: "Doctor Strange - Il mago supremo", en: "Doctor Strange: The Sorcerer Supreme", y: 2007, min: 76, c: "#5a1f4a", ab: "DS07", ch: ["strange"] }),
  mk({ uni: "animation", id: "nextavengers", type: "anim", it: "Next Avengers: Heroes of Tomorrow", en: "Next Avengers: Heroes of Tomorrow", y: 2008, min: 78, c: "#3d3569", ab: "NXA" }),
  mk({ uni: "animation", id: "spectacular", type: "anim", it: "Spectacular Spider-Man", en: "The Spectacular Spider-Man", y: 2008, min: 570, eps: 26, c: "#8a1c2a", ab: "SSM", ch: ["spidey"] }),
  mk({ uni: "animation", id: "hulkvs", type: "anim", it: "Hulk Vs", en: "Hulk Vs.", y: 2009, min: 82, c: "#2f5d3a", ab: "HVS", ch: ["hulk", "wolverine", "thor"] }),
  mk({ uni: "animation", id: "wolvxmen", type: "anim", it: "Wolverine e gli X-Men", en: "Wolverine and the X-Men", y: 2009, min: 570, eps: 26, c: "#3b4a5c", ab: "W&X", ch: ["wolverine"] }),
  mk({ uni: "animation", id: "imaa", type: "anim", it: "Iron Man: Armored Adventures", en: "Iron Man: Armored Adventures", y: 2009, min: 1140, eps: 52, c: "#8c1d26", ab: "IMAA", ch: ["ironman"] }),
  mk({ uni: "animation", id: "planethulk", type: "anim", it: "Planet Hulk", en: "Planet Hulk", y: 2010, min: 81, c: "#2f5d3a", ab: "PH", ch: ["hulk"] }),
  mk({ uni: "animation", id: "emh", type: "anim", it: "Gli Avengers: I più potenti eroi della Terra!", en: "The Avengers: Earth's Mightiest Heroes", y: 2010, min: 1060, eps: 48, c: "#3d3569", ab: "EMH", ch: ["ironman", "cap", "thor", "hulk"], ok: ["it", "y", "eps"] }),
  mk({ uni: "animation", id: "anime-im", type: "anim", it: "Marvel Anime: Iron Man", en: "Marvel Anime: Iron Man", y: 2010, min: 270, eps: 12, c: "#8c1d26", ab: "MA-IM", ch: ["ironman"] }),
  mk({ uni: "animation", id: "anime-wolv", type: "anim", it: "Marvel Anime: Wolverine", en: "Marvel Anime: Wolverine", y: 2011, min: 270, eps: 12, c: "#5a4630", ab: "MA-W", ch: ["wolverine"] }),
  mk({ uni: "animation", id: "anime-xmen", type: "anim", it: "Marvel Anime: X-Men", en: "Marvel Anime: X-Men", y: 2011, min: 270, eps: 12, c: "#3b4a5c", ab: "MA-X", ch: ["wolverine"] }),
  mk({ uni: "animation", id: "anime-blade", type: "anim", it: "Marvel Anime: Blade", en: "Marvel Anime: Blade", y: 2011, min: 270, eps: 12, c: "#2a1a1a", ab: "MA-B", ch: ["blade"] }),
  mk({ uni: "animation", id: "thortales", type: "anim", it: "Thor: Tales of Asgard", en: "Thor: Tales of Asgard", y: 2011, min: 77, c: "#2b4a78", ab: "TTA", ch: ["thor", "loki"] }),
  mk({ uni: "animation", id: "usm", type: "anim", it: "Ultimate Spider-Man", en: "Ultimate Spider-Man", y: 2012, min: 2100, eps: 96, c: "#8a1c2a", ab: "USM", ch: ["spidey"], ok: ["it", "y", "eps"] }),
  mk({ uni: "animation", id: "technovore", type: "anim", it: "Iron Man: Rise of Technovore", en: "Iron Man: Rise of Technovore", y: 2013, min: 88, c: "#8c1d26", ab: "IMRT", ch: ["ironman"] }),
  mk({ uni: "animation", id: "imhulk", type: "anim", it: "Iron Man & Hulk: Heroes United", en: "Iron Man & Hulk: Heroes United", y: 2013, min: 74, c: "#5a3a1c", ab: "IMH", ch: ["ironman", "hulk"], ok: ["it", "y", "min"] }),
  mk({ uni: "animation", id: "assemble", type: "anim", it: "Avengers Assemble", en: "Avengers Assemble", y: 2013, min: 2650, eps: 121, c: "#3d3569", ab: "AA", ch: ["ironman", "cap", "thor", "hulk"], ok: ["it", "y"] }),
  mk({ uni: "animation", id: "smash", type: "anim", it: "Hulk e gli Agenti S.M.A.S.H.", en: "Hulk and the Agents of S.M.A.S.H.", y: 2013, min: 1060, eps: 48, c: "#2f5d3a", ab: "SMASH", ch: ["hulk"], ok: ["it", "y", "eps"] }),
  mk({ uni: "animation", id: "imcap", type: "anim", it: "Iron Man & Captain America: Heroes United", en: "Iron Man & Captain America: Heroes United", y: 2014, min: 72, c: "#24406b", ab: "IMCA", ch: ["ironman", "cap"], ok: ["it", "y", "min"] }),
  mk({ uni: "animation", id: "avconf", type: "anim", it: "Avengers Confidential: La Vedova Nera e Punisher", en: "Avengers Confidential: Black Widow & Punisher", y: 2014, min: 83, c: "#2a2a3a", ab: "AVC", ch: ["blackwidow", "punisher"] }),
  mk({ uni: "animation", id: "gotg15", type: "anim", it: "Guardiani della galassia (serie animata)", en: "Guardians of the Galaxy", y: 2015, min: 1580, eps: 72, c: "#5a2d6b", ab: "GG·TV", ch: ["gotg"], ok: ["it", "y", "eps"] }),
  mk({ uni: "animation", id: "futureavengers", type: "anim", it: "Gli Avengers del Futuro", en: "Marvel Future Avengers", y: 2017, min: 870, eps: 37, c: "#3d3569", ab: "MFA", ok: ["it", "y", "eps"] }),
  mk({ uni: "animation", id: "rising", type: "anim", it: "Marvel Rising: Secret Warriors", en: "Marvel Rising: Secret Warriors", y: 2018, min: 85, c: "#4a2a6b", ab: "MR" }),
  mk({ uni: "animation", id: "modok", type: "anim", it: "M.O.D.O.K.", en: "M.O.D.O.K.", y: 2021, min: 230, eps: 10, c: "#5a4a2a", ab: "MODOK" }),
  mk({ uni: "animation", id: "hitmonkey", type: "anim", it: "Hit-Monkey", en: "Hit-Monkey", y: 2021, min: 460, eps: 20, c: "#4a3a2a", ab: "HM" }),
  mk({ uni: "animation", id: "moongirl", type: "anim", it: "Moon Girl and Devil Dinosaur", en: "Moon Girl and Devil Dinosaur", y: 2023, min: 700, eps: 31, c: "#6b2a6b", ab: "MGDD" }),
];

/** Tutti i titoli in ordine di uscita (sort stabile: a parità di anno resta l'ordine scritto) */
export const DATA: Title[] = [...MCU, ...OTHERS].sort((a, b) => a.y - b.y);

/** Accesso rapido per id */
export const BY_ID: Record<string, Title> = Object.fromEntries(DATA.map((d) => [d.id, d]));
