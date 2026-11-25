/* ============================================================================
   COLORI E SIMBOLI DEGLI UNIVERSI — usati dalle porte della Home e dai
   badge degli universi nel Profilo. Disegni SVG nostri (viewBox 100x100,
   pensati per linee bianche: fill e stroke li decide chi li usa).
   ============================================================================ */

/** Colore di sfondo di ogni porta: una tinta diversa per ciascun universo,
    così si riconoscono a colpo d'occhio */
export const DOOR_COLOR: Record<string, string> = {
  mcu: "#8a1c1c",       // rosso
  xmen: "#1f3f8a",      // blu
  f4fox: "#0f6a6e",     // verde acqua
  sony: "#7a1a55",      // magenta
  other: "#8a5212",     // arancio
  tv: "#2f6a2c",        // verde
  animation: "#53318f", // viola
};

/** Simbolo in filigrana di ogni porta (viewBox 100x100, linee bianche).
    Disegni nostri: richiamano l'universo con un oggetto, un personaggio
    o il suo segno più noto (la X degli X-Men, la scritta MARVEL). */
export const DOOR_SYMBOL: Record<string, string> = {
  // MCU: lo scudo di Captain America (anelli + stella piena)
  mcu: `<circle cx="50" cy="50" r="43"/><circle cx="50" cy="50" r="31"/><circle cx="50" cy="50" r="19"/>`
    + `<path d="M50.0 33.0 L54.1 44.3 L66.2 44.7 L56.7 52.2 L60.0 63.8 L50.0 57.0 L40.0 63.8 L43.3 52.2 L33.8 44.7 L45.9 44.3Z" fill="#fff" stroke-width="2"/>`,
  // X-Men: la "X" con le punte allargate dentro il cerchio
  xmen: `<circle cx="50" cy="50" r="43"/><path d="M24 20 H40 L50 38 L60 20 H76 L58 50 L76 80 H60 L50 62 L40 80 H24 L42 50Z"/>`,
  // Fantastici 4: un "4" pieno e squadrato, con il buco a triangolo
  f4fox: `<path d="M56 10 H71 V56 H82 V70 H71 V90 H56 V70 H16 V57Z M56 33 L33 56 H56Z" fill-rule="evenodd"/>`,
  // Spider-Man: ragno come quello sul costume: testa, torace e addome pieni,
  // otto zampe curve (le prime due coppie in su, le altre in giù)
  sony: `<ellipse cx="50" cy="29" rx="5" ry="6" fill="#fff" stroke="none"/><ellipse cx="50" cy="43" rx="8" ry="9.5" fill="#fff" stroke="none"/>`
    + `<path d="M50 52 Q59 56 57 72 Q54 88 50 95 Q46 88 43 72 Q41 56 50 52Z" fill="#fff" stroke="none"/>`
    + `<path d="M44 37 Q31 29 31 15 Q31 8 25 2 M43 41 Q25 38 19 25 Q16 19 8 15 M43 47 Q25 51 19 65 Q16 72 8 77 M45 52 Q33 62 31 77 Q31 88 25 97 M56 37 Q69 29 69 15 Q69 8 75 2 M57 41 Q75 38 81 25 Q84 19 92 15 M57 47 Q75 51 81 65 Q84 72 92 77 M55 52 Q67 62 69 77 Q69 88 75 97" stroke-width="4"/>`,
  // Altri film: la scritta MARVEL nel riquadro (testo pieno, senza contorno)
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
