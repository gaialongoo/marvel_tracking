/* ============================================================================
   MINIATURA — copertina generata (colore del titolo + sigla).
   Quando nei dati ci sarà "poster", qui si mostrerà la locandina.
   ============================================================================ */
import type { Title, TitleType } from "../types";

/** Sigla del tipo mostrata nell'angolo della miniatura */
const TYPE_LABEL: Record<TitleType, string> = { film: "", serie: "TV", anim: "ANI", special: "SPC", short: "ONE" };

export function Thumb({ d, large = false }: { d: Title; large?: boolean }) {
  return (
    <div className={`thumb${large ? " lg" : ""}`} style={{ "--c": d.c } as React.CSSProperties}>
      {/* Etichetta tipo: TV serie, ANI animazione, SPC speciale, ONE corto (One-Shot) */}
      {d.type !== "film" && <i className="type">{TYPE_LABEL[d.type]}</i>}
      <span>{d.abbr}</span>
    </div>
  );
}
