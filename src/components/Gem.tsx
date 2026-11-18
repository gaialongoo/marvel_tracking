/* ============================================================================
   GEMME DELL'INFINITO — forme ispirate ai film
   Spazio = cubo (Tesseract) · Mente = goccia · Realtà = forma fluida (Aether)
   Potere = sfera con anelli (Orb) · Tempo = occhio (Occhio di Agamotto) · Anima = ovale
   Nel disegno: .f = forma principale, .hl = riflessi (visibili solo se accesa).
   ============================================================================ */
import { GEMS } from "../data/meta";

/* Disegni SVG (viewBox 24x24): stringhe costanti, scritte da noi */
const SHAPES: Record<string, string> = {
  space: `<path class="f" d="M12 2.5l8.5 4.8v9.4L12 21.5l-8.5-4.8V7.3z"/>
    <path class="hl" d="M12 2.5l8.5 4.8L12 12 3.5 7.3z" fill="#fff" opacity=".35"/>
    <path class="hl" d="M12 12l8.5-4.7v9.4L12 21.5z" fill="#000" opacity=".25"/>
    <path class="hl" d="M12 12v9.5M12 12L3.5 7.3M12 12l8.5-4.7" stroke="#fff" stroke-opacity=".4" stroke-width=".6" fill="none"/>`,
  mind: `<path class="f" d="M12 2c3.5 4.6 7 8.4 7 12.3a7 7 0 01-14 0C5 10.4 8.5 6.6 12 2z"/>
    <path class="hl" d="M12 2c-2 4-3.4 7.6-3.4 11.4 0 3 1.5 5.6 3.4 7.6" stroke="#fff" stroke-opacity=".45" stroke-width=".7" fill="none"/>
    <ellipse class="hl" cx="9.3" cy="13" rx="1.6" ry="3" fill="#fff" opacity=".45"/>`,
  reality: `<path class="f" d="M12 2.8c2.6 2.4 6.8 2.9 7.2 7.4.3 3.2 2.3 5.6-.6 8.6-2.5 2.6-5.1.6-7.6 2-2.7 1.4-6.4-.4-6.9-3.8-.4-2.5 1-3.6.8-6.4C4.7 7.4 9.4 5.2 12 2.8z"/>
    <path class="hl" d="M8 10.5c2-1.6 4.6-1.4 6.2.2 1.2 1.2 3 1 4-.2M7.5 15.5c1.8 1 3.6.4 5-.8" stroke="#fff" stroke-opacity=".45" stroke-width=".8" fill="none" stroke-linecap="round"/>
    <circle class="hl" cx="9" cy="7.5" r="1.3" fill="#fff" opacity=".5"/>`,
  power: `<circle class="f" cx="12" cy="12" r="8.8"/>
    <ellipse class="hl" cx="12" cy="12" rx="8.8" ry="3" stroke="#000" stroke-opacity=".35" stroke-width="1" fill="none"/>
    <ellipse class="hl" cx="12" cy="12" rx="3" ry="8.8" stroke="#000" stroke-opacity=".25" stroke-width="1" fill="none"/>
    <circle class="hl" cx="8.8" cy="8.6" r="2.4" fill="#fff" opacity=".35"/>`,
  time: `<path class="f" d="M1.8 12C5 6.2 9 4.8 12 4.8S19 6.2 22.2 12C19 17.8 15 19.2 12 19.2S5 17.8 1.8 12z"/>
    <circle class="hl" cx="12" cy="12" r="4.3" fill="#0f3d24" opacity=".7"/>
    <circle class="hl" cx="12" cy="12" r="1.8" fill="#000" opacity=".6"/>
    <circle class="hl" cx="10.4" cy="10.4" r="1" fill="#fff" opacity=".7"/>`,
  soul: `<ellipse class="f" cx="12" cy="12" rx="6.6" ry="9.2"/>
    <ellipse class="hl" cx="9.6" cy="8.6" rx="2" ry="3.4" fill="#fff" opacity=".4" transform="rotate(-15 9.6 8.6)"/>
    <ellipse class="hl" cx="13.5" cy="16" rx="3" ry="2" fill="#000" opacity=".18"/>`,
};

/** Una gemma: index 0–5, on = accesa */
export function Gem({ index, on }: { index: number; on: boolean }) {
  const k = GEMS[index].k;
  return (
    <svg
      className={`gem${on ? " on" : ""}`}
      viewBox="0 0 24 24"
      style={{ "--c": `var(--${k})` } as React.CSSProperties}
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: SHAPES[k] }}
    />
  );
}

/** Fila di 6 gemme piccole con le prime n accese; con 0 mostra un trattino */
export function GemsRow({ n }: { n: number }) {
  if (!n) return <span className="gems none">—</span>;
  return (
    <span className="gems" title={`${n}/6`}>
      {GEMS.map((_, i) => <Gem key={i} index={i} on={i < n} />)}
    </span>
  );
}
