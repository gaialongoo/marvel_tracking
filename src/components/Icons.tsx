/* ============================================================================
   ICONE — piccole icone SVG a tratto, colore = colore del testo (currentColor)
   ============================================================================ */

const base = { viewBox: "0 0 16 16", fill: "none", stroke: "currentColor", strokeWidth: 1.5, "aria-hidden": true } as const;

/** Spunta (stroke ereditato dal CSS del pulsante "visto") */
export const IconCheck = () => (
  <svg viewBox="0 0 16 16" fill="none" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3.5 8.5l3 3 6-7" />
  </svg>
);
/** Spunta che usa il colore del testo */
export const IconCheckText = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3.5 8.5l3 3 6-7" />
  </svg>
);
/** Link esterno */
export const IconExternal = () => (
  <svg {...base}><path d="M9 2h5v5M14 2L7 9M12 9.5V14H2V4h4.5" /></svg>
);
/** Lucchetto (spoiler) */
export const IconLock = () => (
  <svg {...base} width={13} height={13}><rect x="3" y="7" width="10" height="7" rx="1.5" /><path d="M5.5 7V5a2.5 2.5 0 015 0v2" /></svg>
);
/** Lente (ricerca) */
export const IconSearch = () => (
  <svg {...base} strokeWidth={1.6}><circle cx="7" cy="7" r="4.5" /><path d="M10.5 10.5L14 14" /></svg>
);
/** Freccia giù (scarica) */
export const IconDown = () => (
  <svg {...base}><path d="M8 2v8M4.5 6.5L8 10l3.5-3.5M2.5 13.5h11" /></svg>
);
/** Freccia su (carica) */
export const IconUp = () => (
  <svg {...base}><path d="M8 10V2M4.5 5.5L8 2l3.5 3.5M2.5 13.5h11" /></svg>
);
/** Segnalibro (lista "Da vedere"); pieno = titolo in lista */
export const IconBookmark = ({ on = false }: { on?: boolean }) => (
  <svg {...base} width={14} height={14}><path d="M4 2h8v12l-4-3-4 3z" fill={on ? "currentColor" : "none"} strokeLinejoin="round" /></svg>
);
/** Sole (tema chiaro) */
export const IconSun = () => (
  <svg {...base} width={13} height={13}><circle cx="8" cy="8" r="3" /><path d="M8 1v1.6M8 13.4V15M1 8h1.6M13.4 8H15M3 3l1.1 1.1M11.9 11.9L13 13M3 13l1.1-1.1M11.9 4.1L13 3" strokeLinecap="round" /></svg>
);
/** Luna (tema scuro) */
export const IconMoon = () => (
  <svg {...base} width={13} height={13}><path d="M13.5 9.5A6 6 0 016.5 2.5a6 6 0 107 7z" strokeLinejoin="round" /></svg>
);
