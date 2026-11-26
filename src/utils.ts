// Funzioni di supporto - calcoli usati da più componenti
import { NEW_DAYS, RELEASE_DATES } from "./data/meta";
import type { SavedData, Title } from "./types";

/** Minuti -> "2h 05m" */
export const fmtMin = (m: number) => `${Math.floor(m / 60)}h ${String(m % 60).padStart(2, "0")}m`;

/** true se il titolo ha episodi da spuntare (serie/animazione) */
export const hasEps = (d: Title) => d.type !== "film" && (d.eps ?? 0) > 0;

/** Quanti episodi ho visto */
export const epsSeen = (data: SavedData, id: string) => (data.eps[id] || []).length;

/** Minuti effettivamente visti: film = tutto o niente; serie = in proporzione agli episodi */
export function watchedMin(d: Title, data: SavedData) {
  if (!hasEps(d)) return data.seen[d.id] ? d.min : 0;
  return Math.round((d.min / (d.eps as number)) * epsSeen(data, d.id));
}

/** Percentuale di episodi visti (0–100) */
export const epsPct = (d: Title, data: SavedData) =>
  hasEps(d) ? Math.round((epsSeen(data, d.id) / (d.eps as number)) * 100) : 0;

/** Normalizza un testo per la ricerca: minuscole e senza accenti */
export const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

/**
 * true se il titolo è uscito da meno di NEW_DAYS giorni (etichetta «Nuovo»).
 * Conta solo i titoli con una data in RELEASE_DATES (data/meta.ts) e già usciti.
 */
export function isNew(id: string, now = Date.now()) {
  const date = RELEASE_DATES[id];
  if (!date) return false;
  const days = (now - new Date(date + "T00:00:00").getTime()) / 86400000;
  return days >= 0 && days < NEW_DAYS;
}

/** Lista "Da vedere": titoli in lista e non ancora visti, dal più vecchio aggiunto */
export const watchIds = (data: SavedData) =>
  Object.entries(data.watch ?? {}).filter(([id]) => !data.seen[id]).sort((a, b) => a[1] - b[1]).map(([id]) => id);
