// Locandine - indirizzo dell'immagine su TMDB per un titolo del catalogo.
// I percorsi sono in data/posters.ts (generato da scripts/tmdb-posters.mjs).
// Usato dalle miniature (Thumb) e dal muro di locandine della pagina di accesso.
import { POSTERS } from "./data/posters";
import type { Lang } from "./types";

/** Larghezze offerte da TMDB che usiamo: w185 miniature, w342 grandi */
export type PosterSize = "w185" | "w342";

/** Percorso della locandina nella lingua scelta (o nell'altra), se c'è */
export function posterPath(id: string, lang: Lang): string | undefined {
  const p = POSTERS[id];
  return p?.[lang] ?? p?.en ?? p?.it;
}

/** Indirizzo completo dell'immagine su image.tmdb.org */
export const posterUrl = (path: string, size: PosterSize) => `https://image.tmdb.org/t/p/${size}${path}`;
