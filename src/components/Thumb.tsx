/* ============================================================================
   MINIATURA — locandina del titolo (da TMDB) oppure, se manca o non si
   carica, la copertina generata (colore del titolo + sigla).
   Le locandine sono in data/posters.ts (generato da scripts/tmdb-posters.mjs)
   e si caricano dal server di TMDB, nella lingua dell'interfaccia.
   ============================================================================ */
import { useState } from "react";
import { POSTERS } from "../data/posters";
import { useT } from "../i18n";
import type { Title, TitleType } from "../types";

/** Sigla del tipo mostrata nell'angolo della miniatura */
const TYPE_LABEL: Record<TitleType, string> = { film: "", serie: "TV", anim: "ANI", special: "SPC", short: "ONE" };

/** Indirizzo dell'immagine su TMDB: w185 per le miniature, w342 per quella grande */
const tmdbUrl = (path: string, large: boolean) => `https://image.tmdb.org/t/p/${large ? "w342" : "w185"}${path}`;

export function Thumb({ d, large = false }: { d: Title; large?: boolean }) {
  const { lang } = useT();
  const p = POSTERS[d.id];
  const path = p?.[lang] ?? p?.en ?? p?.it;
  // se l'immagine non arriva (rete, TMDB giù) torno alla copertina generata
  const [broken, setBroken] = useState<string | null>(null);
  const showPoster = !!path && broken !== path;
  return (
    <div className={`thumb${large ? " lg" : ""}${showPoster ? " has-poster" : ""}`} style={{ "--c": d.c } as React.CSSProperties}>
      {showPoster && (
        <img src={tmdbUrl(path, large)} alt="" loading="lazy" decoding="async" onError={() => setBroken(path)} />
      )}
      {/* Etichetta tipo: TV serie, ANI animazione, SPC speciale, ONE corto (One-Shot) */}
      {d.type !== "film" && <i className="type">{TYPE_LABEL[d.type]}</i>}
      {!showPoster && <span>{d.abbr}</span>}
    </div>
  );
}
