/* ============================================================================
   LOGO — il reattore arc (il "cuore" di Iron Man), disegno SVG nostro:
   anello esterno d'oro, 10 bobine di rame tutto intorno, anello interno
   azzurro e il nucleo che si illumina (pulsa piano, vedi .arc in styles.css).
   ============================================================================ */

/** Le 10 bobine di rame, ruotate intorno al centro (32, 32) */
const COILS = Array.from({ length: 10 }, (_, i) =>
  `<rect x="28.5" y="7.5" width="7" height="10" rx="1.6" fill="url(#arc-copper)" stroke="#5a3418" stroke-width=".8" transform="rotate(${i * 36} 32 32)"/>`,
).join("");

/** Disegno completo (viewBox 64x64) */
export const ARC_SVG = `
<defs>
  <radialGradient id="arc-core" cx="50%" cy="50%" r="50%">
    <stop offset="0" stop-color="#ffffff"/>
    <stop offset=".35" stop-color="#c8f6ff"/>
    <stop offset=".7" stop-color="#4fd6ff"/>
    <stop offset="1" stop-color="#4fd6ff" stop-opacity="0"/>
  </radialGradient>
  <linearGradient id="arc-copper" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#e3a066"/>
    <stop offset="1" stop-color="#9a5a2c"/>
  </linearGradient>
  <linearGradient id="arc-gold" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#f3d58a"/>
    <stop offset="1" stop-color="#a87f2e"/>
  </linearGradient>
</defs>
<circle cx="32" cy="32" r="30" fill="#14171c" stroke="url(#arc-gold)" stroke-width="3"/>
<circle cx="32" cy="32" r="25.5" fill="#0d1014" stroke="#2a2f37" stroke-width="1"/>
${COILS}
<circle cx="32" cy="32" r="13.5" fill="#0b2a36" stroke="#8fe9ff" stroke-width="1.6"/>
<circle class="arc-glow" cx="32" cy="32" r="13" fill="url(#arc-core)"/>
<circle cx="32" cy="32" r="5.2" fill="#ffffff"/>
<path d="M32 21 L41.5 37.5 H22.5Z" fill="none" stroke="#bff4ff" stroke-width="1.2" stroke-linejoin="round" opacity=".7"/>
`;

/** Il logo come componente (size = lato in pixel) */
export function ArcReactor({ size = 30 }: { size?: number }) {
  return (
    <svg className="arc" width={size} height={size} viewBox="0 0 64 64" aria-hidden="true"
      // Disegno costante scritto da noi: sicuro da inserire così
      dangerouslySetInnerHTML={{ __html: ARC_SVG }} />
  );
}
