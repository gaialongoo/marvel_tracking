/* ============================================================================
   CATALOGO DEI TITOLI
   ⚠ Al momento contiene i 16 titoli di ESEMPIO del prototipo (verified: false).
   Verrà sostituito dai dati veri, verificati sulle fonti ufficiali, a blocchi:
   1) MCU completo  2) altri film Marvel  3) serie live-action  4) animazione.
   ============================================================================ */
import type { Link, Title } from "../types";

/** Scorciatoia per scrivere un collegamento: L(id, motivo IT, motivo EN) */
const L = (id: string, it: string, en: string): Link => ({ id, why: { it, en } });

/** Campi comuni a tutti i titoli di esempio */
const sample = { poster: null, verified: false, themes: [] as string[] };

const RAW: Title[] = [
  /* ---------------- MCU ---------------- */
  { ...sample, id: "im", uni: "mcu", type: "film", t: { it: "Iron Man", en: "Iron Man" }, y: 2008, min: 126, phase: 1, saga: "inf", chrono: 2, c: "#8c1d26", abbr: "IM",
    chars: ["ironman"], before: [], after: [L("im2", "Continua la storia di Tony", "Continues Tony's story"), L("avg", "Tony entra negli Avengers", "Tony joins the Avengers")], pc: 1 },
  { ...sample, id: "hulk", uni: "mcu", type: "film", t: { it: "L'incredibile Hulk", en: "The Incredible Hulk" }, y: 2008, min: 112, phase: 1, saga: "inf", chrono: 4, c: "#2f5d3a", abbr: "HK",
    chars: ["hulk"], before: [], after: [L("avg", "Bruce Banner torna in squadra", "Bruce Banner joins the team")], pc: 0 },
  { ...sample, id: "im2", uni: "mcu", type: "film", t: { it: "Iron Man 2", en: "Iron Man 2" }, y: 2010, min: 124, phase: 1, saga: "inf", chrono: 3, c: "#7a2a1f", abbr: "IM2",
    chars: ["ironman"], before: [L("im", "Il primo capitolo di Tony", "Tony's first chapter")], after: [L("avg", "Prepara la squadra", "Sets up the team")], pc: 1 },
  { ...sample, id: "thor", uni: "mcu", type: "film", t: { it: "Thor", en: "Thor" }, y: 2011, min: 115, phase: 1, saga: "inf", chrono: 5, c: "#2b4a78", abbr: "THR",
    chars: ["thor", "loki"], before: [], after: [L("avg", "Loki diventa il nemico", "Loki becomes the villain")], pc: 1 },
  { ...sample, id: "ca", uni: "mcu", type: "film", t: { it: "Captain America: Il primo vendicatore", en: "Captain America: The First Avenger" }, y: 2011, min: 124, phase: 1, saga: "inf", chrono: 1, c: "#24406b", abbr: "CA",
    chars: ["cap"], before: [], after: [L("avg", "Steve si risveglia nel presente", "Steve wakes up in the present")], pc: 1 },
  { ...sample, id: "avg", uni: "mcu", type: "film", t: { it: "The Avengers", en: "The Avengers" }, y: 2012, min: 143, phase: 1, saga: "inf", chrono: 6, c: "#3d3569", abbr: "AVG",
    chars: ["ironman", "cap", "thor", "hulk", "loki"], themes: ["avengers"],
    before: [L("im", "Presenta Tony Stark", "Introduces Tony Stark"), L("hulk", "Presenta Bruce Banner", "Introduces Bruce Banner"), L("thor", "Presenta Thor e Loki", "Introduces Thor and Loki"), L("ca", "Presenta Steve Rogers", "Introduces Steve Rogers")],
    after: [L("iw", "Arriva Thanos", "Thanos arrives")], pc: 2 },
  { ...sample, id: "iw", uni: "mcu", type: "film", t: { it: "Avengers: Infinity War", en: "Avengers: Infinity War" }, y: 2018, min: 149, phase: 3, saga: "inf", chrono: 7, c: "#4b2c6b", abbr: "IW",
    chars: ["ironman", "cap", "thor", "hulk", "loki", "strange"], themes: ["avengers"], before: [L("avg", "La squadra si forma", "The team forms")], after: [L("eg", "Il seguito diretto", "The direct sequel")], pc: 1 },
  { ...sample, id: "eg", uni: "mcu", type: "film", t: { it: "Avengers: Endgame", en: "Avengers: Endgame" }, y: 2019, min: 181, phase: 3, saga: "inf", chrono: 8, c: "#5a3a1c", abbr: "EG",
    chars: ["ironman", "cap", "thor", "hulk", "loki", "strange"], themes: ["avengers"], before: [L("iw", "Il seguito diretto", "The direct sequel")],
    after: [L("loki", "Una variante di Loki fugge", "A Loki variant escapes"), L("dsmom", "Strange dopo il Blip", "Strange after the Blip")], pc: 0 },
  { ...sample, id: "loki", uni: "mcu", type: "serie", t: { it: "Loki (Stagione 1)", en: "Loki (Season 1)" }, y: 2021, min: 300, eps: 6, phase: 4, saga: "multi", chrono: 9, c: "#3b5a2a", abbr: "LOK",
    chars: ["loki"], themes: ["multi"], before: [L("avg", "Il Loki del 2012", "The 2012 Loki"), L("eg", "Da dove fugge Loki", "Where Loki escapes from")],
    after: [L("whatif", "Il Multiverso si apre", "The Multiverse opens"), L("dsmom", "Conseguenze sul Multiverso", "Multiverse consequences")], pc: 0 },
  { ...sample, id: "whatif", uni: "mcu", type: "anim", t: { it: "What If...? (Stagione 1)", en: "What If...? (Season 1)" }, y: 2021, min: 300, eps: 9, phase: 4, saga: "multi", chrono: 10, c: "#5c4a1e", abbr: "WI",
    chars: ["strange"], themes: ["multi"], before: [L("loki", "Il Multiverso si apre", "The Multiverse opens")], after: [], pc: 0 },
  { ...sample, id: "dsmom", uni: "mcu", type: "film", t: { it: "Doctor Strange nel Multiverso della Follia", en: "Doctor Strange in the Multiverse of Madness" }, y: 2022, min: 126, phase: 4, saga: "multi", chrono: 11, c: "#5a1f4a", abbr: "DS2",
    chars: ["strange"], themes: ["multi"], before: [L("eg", "Strange dopo il Blip", "Strange after the Blip"), L("loki", "Il Multiverso si apre", "The Multiverse opens")], after: [], pc: 2 },
  { ...sample, id: "dpw", uni: "mcu", type: "film", t: { it: "Deadpool & Wolverine", en: "Deadpool & Wolverine" }, y: 2024, min: 128, phase: 5, saga: "multi", chrono: 12, c: "#7a1f2b", abbr: "D&W",
    chars: ["wolverine"], themes: ["multi"], before: [L("logan", "L'ultimo capitolo di Wolverine", "Wolverine's last chapter"), L("loki", "La TVA", "The TVA")], after: [], pc: 1 },

  /* ---------------- Fuori dall'MCU ---------------- */
  { ...sample, id: "xmen", uni: "xmen", type: "film", t: { it: "X-Men", en: "X-Men" }, y: 2000, min: 104, chrono: 1, c: "#3b4a5c", abbr: "XM",
    chars: ["wolverine"], before: [], after: [L("x2", "Il seguito diretto", "The direct sequel")], pc: 0 },
  { ...sample, id: "x2", uni: "xmen", type: "film", t: { it: "X-Men 2", en: "X2" }, y: 2003, min: 133, chrono: 2, c: "#2e3b52", abbr: "X2",
    chars: ["wolverine"], before: [L("xmen", "Il primo capitolo", "The first chapter")], after: [L("logan", "Il futuro di Logan", "Logan's future")], pc: 0 },
  { ...sample, id: "logan", uni: "xmen", type: "film", t: { it: "Logan - The Wolverine", en: "Logan" }, y: 2017, min: 137, chrono: 3, c: "#5a4630", abbr: "LGN",
    chars: ["wolverine"], before: [L("x2", "Il passato di Logan", "Logan's past")], after: [L("dpw", "Wolverine nell'MCU", "Wolverine in the MCU")], pc: 0 },
  { ...sample, id: "sm02", uni: "spider", type: "film", t: { it: "Spider-Man", en: "Spider-Man" }, y: 2002, min: 121, chrono: 1, c: "#8a1c2a", abbr: "SM",
    chars: ["spidey"], before: [], after: [], pc: 0 },
];

/** Tutti i titoli in ordine di uscita (sort stabile: a parità di anno resta l'ordine scritto) */
export const DATA: Title[] = [...RAW].sort((a, b) => a.y - b.y);

/** Accesso rapido per id */
export const BY_ID: Record<string, Title> = Object.fromEntries(DATA.map((d) => [d.id, d]));
