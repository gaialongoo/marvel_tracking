// Colori e simboli degli universi - usati dalle porte della Home e dai
// badge degli universi nel Profilo. Disegni SVG nostri (viewBox 100x100,
// pensati per linee bianche: fill e stroke li decide chi li usa).

/**
 * Colore di sfondo di ogni porta: una tinta diversa per ciascun universo,
 * così si riconoscono a colpo d'occhio
 */
export const DOOR_COLOR: Record<string, string> = {
  mcu: "#8a1c1c",       // rosso
  xmen: "#1f3f8a",      // blu
  f4fox: "#0f6a6e",     // verde acqua
  sony: "#7a1a55",      // magenta
  other: "#8a5212",     // arancio
  tv: "#2f6a2c",        // verde
  animation: "#53318f", // viola
};

/**
 * Simbolo in filigrana di ogni porta (viewBox 100x100, linee bianche).
 * Disegni nostri: richiamano l'universo con un oggetto, un personaggio
 * o il suo segno più noto (la X degli X-Men, la scritta Marvel).
 */
export const DOOR_SYMBOL: Record<string, string> = {
  // MCU: lo scudo di Captain America (anelli + stella piena)
  mcu: `<circle cx="50" cy="50" r="43"/><circle cx="50" cy="50" r="31"/><circle cx="50" cy="50" r="19"/>`
    + `<path d="M50.0 33.0 L54.1 44.3 L66.2 44.7 L56.7 52.2 L60.0 63.8 L50.0 57.0 L40.0 63.8 L43.3 52.2 L33.8 44.7 L45.9 44.3Z" fill="#fff" stroke-width="2"/>`,
  // X-Men: la "X" con le punte allargate dentro il cerchio
  xmen: `<circle cx="50" cy="50" r="43"/><path d="M24 20 H40 L50 38 L60 20 H76 L58 50 L76 80 H60 L50 62 L40 80 H24 L42 50Z"/>`,
  // Fantastici 4: un "4" pieno e squadrato, con il buco a triangolo
  f4fox: `<path d="M56 10 H71 V56 H82 V70 H71 V90 H56 V70 H16 V57Z M56 33 L33 56 H56Z" fill-rule="evenodd"/>`,
  // Spider-Man: la maschera - ovale del volto con la ragnatela (14 raggi e 3 giri
  // di fili incurvati) e i due grandi occhi bianchi appuntiti verso il naso
  sony: `<path d="M50 50 L50 5.9 M50 50 L65.7 10.3 M50 50 L78.3 22.5 M50 50 L85.4 40.2 M50 50 L85.4 59.8 M50 50 L78.3 77.5 M50 50 L65.7 89.7 M50 50 L50 94.1 M50 50 L34.3 89.7 M50 50 L21.7 77.5 M50 50 L14.6 59.8 M50 50 L14.6 40.2 M50 50 L21.7 22.5 M50 50 L34.3 10.3 M50 36.5 Q52.1 38.7 54.8 37.8 M54.8 37.8 Q56 40.9 58.7 41.6 M58.7 41.6 Q58.6 45 60.8 47 M60.8 47 Q59.5 50 60.8 53 M60.8 53 Q58.6 55 58.7 58.4 M58.7 58.4 Q56 59.1 54.8 62.2 M54.8 62.2 Q52.1 61.3 50 63.5 M50 63.5 Q47.9 61.3 45.2 62.2 M45.2 62.2 Q44 59.1 41.3 58.4 M41.3 58.4 Q41.4 55 39.2 53 M39.2 53 Q40.5 50 39.2 47 M39.2 47 Q41.4 45 41.3 41.6 M41.3 41.6 Q44 40.9 45.2 37.8 M45.2 37.8 Q47.9 38.7 50 36.5 M50 25.2 Q53.9 29.2 58.8 27.7 M58.8 27.7 Q60.9 33.4 65.9 34.6 M65.9 34.6 Q65.8 40.8 69.8 44.5 M69.8 44.5 Q67.5 50 69.8 55.5 M69.8 55.5 Q65.8 59.2 65.9 65.4 M65.9 65.4 Q60.9 66.6 58.8 72.3 M58.8 72.3 Q53.9 70.8 50 74.8 M50 74.8 Q46.1 70.8 41.2 72.3 M41.2 72.3 Q39.1 66.6 34.1 65.4 M34.1 65.4 Q34.2 59.2 30.2 55.5 M30.2 55.5 Q32.5 50 30.2 44.5 M30.2 44.5 Q34.2 40.8 34.1 34.6 M34.1 34.6 Q39.1 33.4 41.2 27.7 M41.2 27.7 Q46.1 29.2 50 25.2 M50 14 Q55.7 19.8 62.8 17.6 M62.8 17.6 Q65.9 25.8 73.1 27.6 M73.1 27.6 Q72.9 36.6 78.9 42 M78.9 42 Q75.5 50 78.9 58 M78.9 58 Q72.9 63.4 73.1 72.4 M73.1 72.4 Q65.9 74.2 62.8 82.4 M62.8 82.4 Q55.7 80.2 50 86 M50 86 Q44.3 80.2 37.2 82.4 M37.2 82.4 Q34.1 74.2 26.9 72.4 M26.9 72.4 Q27.1 63.4 21.1 58 M21.1 58 Q24.5 50 21.1 42 M21.1 42 Q27.1 36.6 26.9 27.6 M26.9 27.6 Q34.1 25.8 37.2 17.6 M37.2 17.6 Q44.3 19.8 50 14" stroke-width="1.6" fill="none"/>`
    + `<path d="M50 4 C75 4 87 24 87 46 C87 72 69 96 50 96 C31 96 13 72 13 46 C13 24 25 4 50 4Z" stroke-width="4" fill="none"/>`
    + `<path d="M46 53 C41 42 31 34 19 31 C16 42 20 54 30 58 C37 61 43 59 46 53Z M54 53 C59 42 69 34 81 31 C84 42 80 54 70 58 C63 61 57 59 54 53Z" fill="#fff" stroke-width="3" stroke-linejoin="round"/>`,
  // Altri film: la scritta Marvel nel riquadro (testo pieno, senza contorno)
  other: `<rect x="5" y="31" width="90" height="38" rx="3"/>`
    + `<text x="50" y="60" text-anchor="middle" textLength="78" lengthAdjust="spacingAndGlyphs" fill="#fff" stroke="none"`
    + ` font-family="Impact, 'Arial Black', sans-serif" font-weight="900" font-size="30">MARVEL</text>`,
  // Serie TV: vecchio televisore con le antenne
  tv: `<rect x="12" y="30" width="76" height="54" rx="10"/><rect x="21" y="39" width="45" height="36" rx="6"/>`
    + `<circle cx="77" cy="47" r="3.5"/><circle cx="77" cy="62" r="3.5"/><path d="M44 30 L30 10 M56 30 L70 10 M28 84 V92 M72 84 V92"/>`,
  // Animazione: striscia di pellicola con la pallina che rimbalza (il primo esercizio di ogni animatore)
  animation: `<rect x="28" y="4" width="44" height="92" rx="4"/><rect x="37" y="10" width="26" height="24" rx="2" stroke-width="3"/>`
    + `<rect x="37" y="38" width="26" height="24" rx="2" stroke-width="3"/><rect x="37" y="66" width="26" height="24" rx="2" stroke-width="3"/>`
    + `<circle cx="50" cy="18" r="5" fill="#fff"/><circle cx="50" cy="47" r="5" fill="#fff"/><ellipse cx="50" cy="85" rx="7" ry="3.5" fill="#fff"/>`
    + `<path d="M32.5 12 V16 M32.5 26 V30 M32.5 40 V44 M32.5 54 V58 M32.5 68 V72 M32.5 82 V86 M67.5 12 V16 M67.5 26 V30 M67.5 40 V44 M67.5 54 V58 M67.5 68 V72 M67.5 82 V86" stroke-width="3.5"/>`,
};
