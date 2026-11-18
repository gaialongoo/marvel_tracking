/* ============================================================================
   COLLEZIONI DISNEY+ — le schede in alto nella Home
   ----------------------------------------------------------------------------
   Fonte: Disney+ Italia, pagina "Film e show Marvel"
   (disneyplus.com/it-it/browse/page-60f4707d-…) e le 10 pagine dei
   "Grandi personaggi", lette il 18/11/2026.

   Ogni collezione ha DUE versioni:
   - official: i titoli che mostra Disney+, nel suo ordine (Disney+ ne mostra
     al massimo 10 per riga, quindi spesso è incompleta);
   - completa: official + "add" (titoli aggiunti da noi, segnati nell'elenco)
     oppure, se c'è "match", tutti i titoli che rispettano la regola.

   Regole di conversione dai riquadri Disney+ ai titoli del catalogo:
   - un riquadro di una serie con più stagioni (es. "Loki", "Daredevil")
     = tutte le sue stagioni;
   - le VERSIONI ALTERNATIVE contano come il titolo base:
     "Avengers: Endgame Extra" → Avengers: Endgame,
     "Licantropus a colori" → Licantropus;
   - ESCLUSI (scelta dell'utente): extra, documentari, podcast
     (Marvel Studios LEGENDS, Assembled…) e animazione per bambini
     (Spidey e i suoi fantastici amici, LEGO, Phineas e Ferb,
     Super Hero Adventures, Squadra di Halloween, A Merry Marvel Christmas
     Carol…).
   Righe non usate: "In primo piano" (cambia spesso), "Amici Marvel"
   (bambini), "Documentari Marvel", "IMAX Enhanced" (è un formato video).
   La riga del conto alla rovescia per Doomsday è in Preparazione.
   ============================================================================ */
import type { I18nText, Title } from "../types";

export interface Collection extends I18nText {
  k: string;
  group: "dp" | "hero";          // riga della pagina Marvel | pagina di un personaggio
  official: string[];            // titoli mostrati da Disney+, nel suo ordine
  add?: string[];                // aggiunti da noi nella versione completa
  match?: (d: Title) => boolean; // oppure: versione completa = tutti i titoli che rispettano la regola
}

/* Serie con più stagioni: un riquadro Disney+ = tutte le stagioni */
const LOKI = ["loki1", "loki2"];
const WHATIF = ["whatif1", "whatif2", "whatif3"];
const DD = ["dd1", "dd2", "dd3"];
const DDBA = ["ddba1", "ddba2"];
const GROOT = ["groot1", "groot2"];

export const COLLECTIONS: Collection[] = [
  /* ----- Righe della pagina "Film e show Marvel" ----- */
  { k: "mcu", group: "dp", it: "MCU · Film e serie in ordine cronologico", en: "MCU · Movies and series in timeline order",
    official: ["eow", "ca", "os-carter", "cm", "im", "im2", "os-hammer", "thor", "os-consultant", "avg"],
    match: (d) => d.uni === "mcu" },
  { k: "mcufilm", group: "dp", it: "MCU · Film in ordine cronologico", en: "MCU · Movies in timeline order",
    official: ["ca", "cm", "im", "im2", "thor", "avg", "tdw", "im3", "tws", "gotg"],
    match: (d) => d.uni === "mcu" && d.type === "film" },
  { k: "inf", group: "dp", it: "MCU: Infinity Saga", en: "MCU: Infinity Saga",
    official: ["im", "im2", "thor", "os-consultant", "ca", "os-hammer", "avg", "os-item47", "im3", "os-carter"],
    match: (d) => d.saga === "inf" },
  { k: "multi", group: "dp", it: "MCU: Multiverse Saga", en: "MCU: Multiverse Saga",
    official: ["wv", "fatws", ...LOKI, "bw", ...WHATIF, "shangchi", "eternals", "hawkeye", "nwh", "moonknight"],
    match: (d) => d.saga === "multi" },
  { k: "f4", group: "dp", it: "Fantastici 4", en: "Fantastic Four",
    official: ["ff", "ff2005", "ff2007", "fant4stic", "dpw", "dsmom", "thunderbolts"] },
  { k: "defenders", group: "dp", it: "Defenders", en: "Defenders",
    official: [...DDBA, "punolk", "echo", ...DD, "jj1", "jj2", "jj3", "lc1", "lc2", "if1", "if2", "defenders", "pun1", "pun2"],
    add: ["shehulk", "hawkeye"] },
  { k: "origins", group: "dp", it: "Marvel: Le origini", en: "Marvel: Origins",
    official: ["ironheart", "thor", "shehulk", "antman", "ff", "gotg", "ds", "shangchi", "echo", "msmarvel"],
    add: ["im", "hulk", "ca", "bp", "cm", "eternals", "moonknight", "wbn", "wonderman"] },
  { k: "anim", group: "dp", it: "Animazione Marvel", en: "Marvel Animation",
    official: ["xmen97", "zombies", "fnsm", "eow", ...WHATIF, ...GROOT, "spiderverse", "jeff"],
    match: (d) => d.type === "anim" },
  { k: "monsters", group: "dp", it: "Mostri Marvel", en: "Marvel Monsters",
    official: ["zombies", "dsmom", "agatha", "wbn", "moonknight", "hulkwmd"] },
  { k: "spiderverse", group: "dp", it: "Spider-Verse", en: "Spider-Verse",
    official: ["nwh", "ffh", "homecoming", "tasm", "tasm2", "spiderverse", "fnsm", "iw", "eg", "sm2017"],
    add: ["cw", "smshorts", "bnd"] },
  { k: "mutants", group: "dp", it: "Legacy: Mutanti", en: "Legacy: Mutants",
    official: ["dofp", "dpw", "xmen97", "xmen", "logan", "x2", "x3", "xow", "xfc", "wolv13"],
    add: ["apocalypse", "darkphoenix", "deadpool", "deadpool2"] },
  { k: "wakanda", group: "dp", it: "Il mondo di Wakanda", en: "The World of Wakanda",
    official: ["bp", "wf", "eow"],
    add: ["cw", "iw", "eg"] },

  /* ----- Pagine dei "Grandi personaggi" ----- */
  { k: "h-daredevil", group: "hero", it: "Daredevil", en: "Daredevil",
    official: [...DDBA, ...DD, "defenders", "shehulk", "punolk", "echo", "hawkeye", "fnsm", "pun1", "pun2"],
    add: ["nwh"] },
  { k: "h-spidey", group: "hero", it: "Spider-Man", en: "Spider-Man",
    official: ["nwh", "ffh", "homecoming", "spiderverse", "tasm", "tasm2", "cw", "iw", "eg", "fnsm", "sm2017", "smshorts"],
    add: ["bnd"] },
  { k: "h-wanda", group: "hero", it: "Wanda e Visione", en: "Wanda and Vision",
    official: ["wv", "visionquest", "dsmom", "tws", "aou", "cw", "iw", "eg"],
    add: ["agatha"] },
  { k: "h-bp", group: "hero", it: "Black Panther", en: "Black Panther",
    official: ["eow", "cw", "bp", "iw", "eg", "wf", ...WHATIF] },
  { k: "h-falcon", group: "hero", it: "The Falcon and the Winter Soldier", en: "The Falcon and the Winter Soldier",
    official: ["bnw", "fatws", "thunderbolts", ...WHATIF, "ca", "tws", "aou", "antman", "cw"],
    add: ["iw", "eg"] },
  { k: "h-bw", group: "hero", it: "Black Widow", en: "Black Widow",
    official: ["bw", "thunderbolts", ...WHATIF, "eg", "iw", "cw", "aou", "tws"],
    add: ["im2", "avg", "hawkeye"] },
  { k: "h-antman", group: "hero", it: "Ant-Man", en: "Ant-Man",
    official: ["antman", "cw", "amw", "eg", ...WHATIF, "quantumania"] },
  { k: "h-strange", group: "hero", it: "Doctor Strange", en: "Doctor Strange",
    official: ["dsmom", "ds", "ragnarok", "iw", "eg", ...WHATIF],
    add: ["nwh"] },
  { k: "h-deadpool", group: "hero", it: "Deadpool", en: "Deadpool",
    official: ["deadpool", "deadpool2", "dpw"] },
  { k: "h-wolverine", group: "hero", it: "Wolverine", en: "Wolverine",
    official: ["xmen", "x2", "x3", "xow", "wolv13", "dofp", "logan", "xmen97", "dpw"],
    add: ["xfc", "apocalypse"] },
];

/** Titoli di una collezione nella versione scelta.
    Restituisce gli id e l'insieme di quelli aggiunti da noi (non su Disney+). */
export function collectionIds(c: Collection, full: boolean, all: Title[]): { ids: string[]; added: Set<string> } {
  if (!full) return { ids: [...new Set(c.official)], added: new Set() };
  const extra = c.match ? all.filter(c.match).map((d) => d.id) : c.add ?? [];
  const ids = [...new Set([...c.official, ...extra])];
  return { ids, added: new Set(ids.filter((id) => !c.official.includes(id))) };
}
