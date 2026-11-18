/* ============================================================================
   DATI DI CONTORNO: universi, percorsi, prossime uscite, Gemme.
   ============================================================================ */
import type { I18nText } from "../types";

/** Universi (come le collezioni Marvel di Disney+). "all" = tutti. */
export interface Universe extends I18nText {
  k: string;
  short?: string; // etichetta breve per le schede
}
export const UNIVERSES: Universe[] = [
  { k: "all", it: "Tutto", en: "All" },
  { k: "mcu", it: "Marvel Cinematic Universe", en: "Marvel Cinematic Universe", short: "MCU" },
  { k: "xmen", it: "X-Men", en: "X-Men" },
  { k: "spider", it: "Spider-Man (Sony)", en: "Spider-Man (Sony)" },
];

/** Percorsi: per personaggio (campo chars) o per tema (campo themes) */
export interface Path extends I18nText {
  key: string;
  kind: "chars" | "themes";
}
export const PATHS: Path[] = [
  { key: "ironman", kind: "chars", it: "Iron Man", en: "Iron Man" },
  { key: "cap", kind: "chars", it: "Captain America", en: "Captain America" },
  { key: "thor", kind: "chars", it: "Thor", en: "Thor" },
  { key: "hulk", kind: "chars", it: "Hulk", en: "Hulk" },
  { key: "loki", kind: "chars", it: "Loki", en: "Loki" },
  { key: "strange", kind: "chars", it: "Doctor Strange", en: "Doctor Strange" },
  { key: "wolverine", kind: "chars", it: "Wolverine", en: "Wolverine" },
  { key: "spidey", kind: "chars", it: "Spider-Man", en: "Spider-Man" },
  { key: "avengers", kind: "themes", it: "Tema · Avengers", en: "Theme · Avengers" },
  { key: "multi", kind: "themes", it: "Tema · Multiverso", en: "Theme · Multiverse" },
];

/** Prossime uscite con liste di preparazione (id dal catalogo).
    ⚠ Date di ESEMPIO, da verificare su marvel.com. */
export interface Upcoming {
  id: string;
  t: string;
  date: string;          // AAAA-MM-GG
  min: string[];         // lista minima
  ext: string[];         // lista estesa
  recap: { title: I18nText; text: I18nText }[];
}
export const UPCOMING: Upcoming[] = [
  {
    id: "doomsday", t: "Avengers: Doomsday", date: "2026-12-18",
    min: ["eg", "loki", "dsmom"], ext: ["avg", "iw", "eg", "loki", "whatif", "dsmom"],
    recap: [
      { title: { it: "Fine della Saga dell'Infinito", en: "End of the Infinity Saga" }, text: { it: "Testo segnaposto: cosa è successo in Endgame.", en: "Placeholder: what happened in Endgame." } },
      { title: { it: "Il Multiverso è aperto", en: "The Multiverse is open" }, text: { it: "Testo segnaposto: le conseguenze di Loki.", en: "Placeholder: consequences of Loki." } },
      { title: { it: "Chi tenere d'occhio", en: "Who to watch" }, text: { it: "Testo segnaposto: i personaggi chiave.", en: "Placeholder: key characters." } },
    ],
  },
  {
    id: "secretwars", t: "Avengers: Secret Wars", date: "2027-12-17",
    min: ["eg", "dsmom"], ext: ["iw", "eg", "loki", "whatif", "dsmom"],
    recap: [{ title: { it: "Testo segnaposto", en: "Placeholder" }, text: { it: "Da scrivere.", en: "To be written." } }],
  },
];

/** Le 6 Gemme in ordine di voto (k = nome della variabile colore CSS) */
export const GEMS: (I18nText & { k: string })[] = [
  { k: "space", it: "Spazio", en: "Space" },
  { k: "mind", it: "Mente", en: "Mind" },
  { k: "reality", it: "Realtà", en: "Reality" },
  { k: "power", it: "Potere", en: "Power" },
  { k: "time", it: "Tempo", en: "Time" },
  { k: "soul", it: "Anima", en: "Soul" },
];
