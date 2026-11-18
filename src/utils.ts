/* ============================================================================
   FUNZIONI DI SUPPORTO — calcoli usati da più componenti
   ============================================================================ */
import type { SavedData, Title } from "./types";

/** Minuti → "2h 05m" */
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
