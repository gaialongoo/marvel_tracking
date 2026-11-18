/* ============================================================================
   MINIATURA — copertina generata (colore del titolo + sigla).
   Quando nei dati ci sarà "poster", qui si mostrerà la locandina.
   ============================================================================ */
import type { Title } from "../types";

export function Thumb({ d, large = false }: { d: Title; large?: boolean }) {
  return (
    <div className={`thumb${large ? " lg" : ""}`} style={{ "--c": d.c } as React.CSSProperties}>
      {/* Etichetta tipo: TV per le serie, ANI per l'animazione */}
      {d.type !== "film" && <i className="type">{d.type === "serie" ? "TV" : "ANI"}</i>}
      <span>{d.abbr}</span>
    </div>
  );
}
