/* ============================================================================
   DATI DI CONTORNO: universi, percorsi, prossime uscite, Gemme.
   ============================================================================ */
import type { I18nText } from "../types";

/** Universi = continuità narrativa (chi ha prodotto i film). Servono per
    l'ordine cronologico, che si calcola DENTRO ogni universo, e per le
    statistiche. Le schede in alto nella Home sono invece le collezioni
    Disney+ (vedi collections.ts). "all" = tutti. */
export interface Universe extends I18nText {
  k: string;
  short?: string; // etichetta breve
}
export const UNIVERSES: Universe[] = [
  { k: "all", it: "Tutto", en: "All" },
  { k: "mcu", it: "Marvel Cinematic Universe", en: "Marvel Cinematic Universe", short: "MCU" },
  { k: "xmen", it: "X-Men (20th Century Fox)", en: "X-Men (20th Century Fox)", short: "X-Men" },
  { k: "f4fox", it: "Fantastici 4 (20th Century Fox)", en: "Fantastic Four (20th Century Fox)", short: "F4 Fox" },
  { k: "sony", it: "Spider-Man (Sony Pictures)", en: "Spider-Man (Sony Pictures)", short: "Sony" },
  { k: "animation", it: "Animazione Marvel", en: "Marvel Animation", short: "Animazione" },
];

/** Percorsi: per personaggio (campo chars) o per tema (campo themes) */
export interface Path extends I18nText {
  key: string;
  kind: "chars" | "themes";
}
export const PATHS: Path[] = [
  // Personaggi
  { key: "ironman", kind: "chars", it: "Iron Man", en: "Iron Man" },
  { key: "cap", kind: "chars", it: "Captain America (Steve)", en: "Captain America (Steve)" },
  { key: "falcon", kind: "chars", it: "Falcon / Captain America (Sam)", en: "Falcon / Captain America (Sam)" },
  { key: "thor", kind: "chars", it: "Thor", en: "Thor" },
  { key: "hulk", kind: "chars", it: "Hulk", en: "Hulk" },
  { key: "loki", kind: "chars", it: "Loki", en: "Loki" },
  { key: "blackwidow", kind: "chars", it: "Black Widow", en: "Black Widow" },
  { key: "hawkeye", kind: "chars", it: "Occhio di Falco", en: "Hawkeye" },
  { key: "strange", kind: "chars", it: "Doctor Strange", en: "Doctor Strange" },
  { key: "spidey", kind: "chars", it: "Spider-Man", en: "Spider-Man" },
  { key: "antman", kind: "chars", it: "Ant-Man", en: "Ant-Man" },
  { key: "gotg", kind: "chars", it: "Guardiani della Galassia", en: "Guardians of the Galaxy" },
  { key: "blackpanther", kind: "chars", it: "Black Panther", en: "Black Panther" },
  { key: "captainmarvel", kind: "chars", it: "Captain Marvel", en: "Captain Marvel" },
  { key: "wanda", kind: "chars", it: "Wanda e Visione", en: "Wanda and Vision" },
  { key: "shangchi", kind: "chars", it: "Shang-Chi", en: "Shang-Chi" },
  { key: "daredevil", kind: "chars", it: "Daredevil", en: "Daredevil" },
  { key: "punisher", kind: "chars", it: "The Punisher", en: "The Punisher" },
  { key: "jessica", kind: "chars", it: "Jessica Jones", en: "Jessica Jones" },
  { key: "lukecage", kind: "chars", it: "Luke Cage", en: "Luke Cage" },
  { key: "ironfist", kind: "chars", it: "Iron Fist", en: "Iron Fist" },
  { key: "fantastic4", kind: "chars", it: "Fantastici 4", en: "Fantastic Four" },
  { key: "wolverine", kind: "chars", it: "Wolverine", en: "Wolverine" },
  { key: "deadpool", kind: "chars", it: "Deadpool", en: "Deadpool" },
  // Temi
  { key: "avengers", kind: "themes", it: "Tema · Avengers", en: "Theme · Avengers" },
  { key: "multi", kind: "themes", it: "Tema · Multiverso", en: "Theme · Multiverse" },
  { key: "defenders", kind: "themes", it: "Tema · Strade di New York (Defenders)", en: "Theme · Street level (Defenders)" },
];

/** Prossime uscite con la lista di preparazione UFFICIALE (id dal catalogo).
    - Avengers: Doomsday: 18/12/2026 (Disney+ "Marvel Movies in Order").
      Lista = riga "Avengers: Doomsday – Inizia il conto alla rovescia" di
      Disney+ Italia. Conversioni: il riquadro "Loki" = entrambe le
      stagioni; "Avengers: Endgame Extra" (versione Extra) = Avengers: Endgame.
    - Avengers: Secret Wars: Disney indica solo "dicembre 2027" →
      il giorno è provvisorio (approx = true); nessuna lista ufficiale.
    Nessuna proposta nostra: solo liste ufficiali (scelta dell'utente).
    I ripassi sono ancora testi segnaposto. */
export interface Upcoming {
  id: string;
  t: string;
  date: string;          // AAAA-MM-GG
  approx?: boolean;      // true = giorno esatto non ancora annunciato
  list: string[];        // lista ufficiale (vuota = non ancora pubblicata)
  recap: { title: I18nText; text: I18nText }[];
}
export const UPCOMING: Upcoming[] = [
  {
    id: "doomsday", t: "Avengers: Doomsday", date: "2026-12-18",
    list: ["xmen", "x2", "ca", "avg", "iw", "eg", "loki1", "loki2", "shangchi", "nwh"],
    recap: [
      { title: { it: "Fine della Saga dell'Infinito", en: "End of the Infinity Saga" }, text: { it: "Testo segnaposto: cosa è successo in Endgame.", en: "Placeholder: what happened in Endgame." } },
      { title: { it: "Il Multiverso è aperto", en: "The Multiverse is open" }, text: { it: "Testo segnaposto: le conseguenze di Loki.", en: "Placeholder: consequences of Loki." } },
      { title: { it: "Chi tenere d'occhio", en: "Who to watch" }, text: { it: "Testo segnaposto: i personaggi chiave.", en: "Placeholder: key characters." } },
    ],
  },
  {
    id: "secretwars", t: "Avengers: Secret Wars", date: "2027-12-17", approx: true,
    list: [],
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
