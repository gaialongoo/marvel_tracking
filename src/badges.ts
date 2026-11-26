// Badge - traguardi che si conquistano guardando (sezione del Profilo).
// - Ogni badge ha 3 livelli: Bronzo, Argento, Oro. Per ognuno c'è una
//   soglia (es. 10 / 50 / 100 titoli): il livello è quante soglie hai superato.
// - I badge "di completamento" (una Fase, un universo, un percorso…) hanno
//   come soglie un terzo, due terzi e tutti i titoli.
// - Tutto si calcola dai dati già salvati (visti, episodi, voti, profilo),
//   più il contatore "back" per Ritorno al passato (vedi store.ts).
// - I badge segreti mostrano "???" finché non conquisti il Bronzo.
import { AVATARS, AVATAR_BY_KEY } from "./data/avatars";
import { BADGE_ART, phaseArt } from "./data/badgeArt";
import { PATHS, UNIVERSES, UPCOMING } from "./data/meta";
import { DATA } from "./data/titles";
import { DOOR_COLOR, DOOR_SYMBOL } from "./data/universeArt";
import type { I18nText, SavedData, Title } from "./types";
import { watchedMin } from "./utils";

/** Sezioni della pagina, nell'ordine in cui si vedono */
export const BADGE_GROUPS = ["qty", "mcu", "uni", "paths", "style", "secret"] as const;
export type BadgeGroup = (typeof BADGE_GROUPS)[number];

/** Un badge già calcolato per i dati dell'utente */
export interface Badge {
  key: string;
  group: BadgeGroup;
  name: I18nText;
  /** Cosa fare; {n} = soglia del prossimo livello, {tot} = totale disponibile */
  how: I18nText;
  art: string;            // disegno SVG (viewBox 100x100)
  tint: string;           // colore di fondo della medaglia
  secret?: boolean;       // nascosto ("???") finché non conquisti il Bronzo
  value: number;          // a che punto sei
  levels: [number, number, number]; // soglie Bronzo, Argento, Oro
  level: 0 | 1 | 2 | 3;   // livelli conquistati
}

/** Soglie per i badge di completamento: un terzo, due terzi, tutto */
const thirds = (tot: number): [number, number, number] =>
  tot <= 0 ? [1, 1, 1] : [Math.max(1, Math.ceil(tot / 3)), Math.max(1, Math.ceil((tot * 2) / 3)), tot];

/** Quanti titoli di questa lista hai visto */
const seenOf = (list: Title[], d: SavedData) => list.filter((t) => d.seen[t.id]).length;

/** Cattivi degli avatar -> i film in cui compaiono (per "Cattivo dentro") */
const VILLAIN_TITLES: Record<string, string[]> = {
  thanos: ["avg", "gotg", "aou", "iw", "eg"],
  ultron: ["aou"],
  magneto: ["xmen", "x2", "x3", "xfc", "dofp", "apocalypse", "darkphoenix"],
  venom: ["sm3", "venom", "venom2", "venom3"],
  doom: ["ff2005", "ff2007", "fant4stic"],
  hela: ["ragnarok"],
};

/** Colori delle mascherine per i percorsi senza avatar (scelti a giro) */
const MASK_COLORS = ["#2e5fae", "#d8262f", "#3fae5a", "#8a4fd0", "#f08a24", "#1f9aa0", "#c8323f", "#6b7280"];

/** Nomi speciali dei badge degli universi */
const UNI_NAMES: Record<string, I18nText> = {
  mcu: { it: "Cittadino dell'MCU", en: "MCU Citizen" },
  xmen: { it: "Mutante onorario", en: "Honorary Mutant" },
  f4fox: { it: "Famiglia fantastica", en: "Fantastic Family" },
  sony: { it: "Amichevole di quartiere", en: "Friendly Neighborhood" },
  other: { it: "Collezionista di rarità", en: "Rarity Collector" },
  tv: { it: "Prima di Disney+", en: "Before Disney+" },
  animation: { it: "Mondo animato", en: "Animated World" },
};

/** Calcola tutti i badge per i dati dell'utente */
export function computeBadges(d: SavedData): Badge[] {
  const out: Badge[] = [];
  /** Aggiunge un badge calcolando il livello dalle soglie */
  const add = (b: Omit<Badge, "level">) => {
    const level = b.levels.filter((x) => b.value >= x).length as Badge["level"];
    out.push({ ...b, level });
  };
  /** Badge "completa questa lista" (soglie a terzi) */
  const complete = (b: Omit<Badge, "level" | "value" | "levels">, list: Title[]) =>
    add({ ...b, value: seenOf(list, d), levels: thirds(list.length) });

  const seenList = DATA.filter((t) => d.seen[t.id]);
  const mcu = DATA.filter((t) => t.uni === "mcu");

  // 1. Quantità
  add({ key: "first", group: "qty", name: { it: "Primo passo", en: "First Step" },
    how: { it: "Guarda {n} titoli", en: "Watch {n} titles" }, art: BADGE_ART.popcorn, tint: "#ffe9b8",
    value: seenList.length, levels: [1, 5, 10] });
  add({ key: "marathon", group: "qty", name: { it: "Maratoneta", en: "Marathoner" },
    how: { it: "Guarda {n} titoli", en: "Watch {n} titles" }, art: BADGE_ART.sneaker, tint: "#ffd6d6",
    value: seenList.length, levels: [25, 75, 150] });
  add({ key: "hours", group: "qty", name: { it: "Ore di volo", en: "Flight Hours" },
    how: { it: "Arriva a {n} ore di visione", en: "Reach {n} hours watched" }, art: BADGE_ART.hourglass, tint: "#d8ecff",
    value: Math.floor(DATA.reduce((a, t) => a + watchedMin(t, d), 0) / 60), levels: [24, 100, 250] });
  add({ key: "episodes", group: "qty", name: { it: "Divoratore di episodi", en: "Episode Devourer" },
    how: { it: "Guarda {n} episodi", en: "Watch {n} episodes" }, art: BADGE_ART.tvface, tint: "#d6f0ff",
    value: Object.values(d.eps).reduce((a, e) => a + e.length, 0), levels: [50, 200, 500] });

  // 2. MCU
  for (let p = 1; p <= 6; p++) {
    complete({ key: `phase${p}`, group: "mcu", name: { it: `Fase ${p}`, en: `Phase ${p}` },
      how: { it: `Guarda {n} titoli della Fase ${p} (su {tot})`, en: `Watch {n} Phase ${p} titles (of {tot})` },
      art: phaseArt(p), tint: "#ece4ff" }, mcu.filter((t) => t.phase === p));
  }
  complete({ key: "infinity", group: "mcu", name: { it: "Saga dell'Infinito", en: "Infinity Saga" },
    how: { it: "Guarda {n} titoli delle Fasi 1–3 (su {tot})", en: "Watch {n} Phase 1–3 titles (of {tot})" },
    art: BADGE_ART.gauntlet, tint: "#fff1c2" }, mcu.filter((t) => t.saga === "inf"));
  complete({ key: "multiverse", group: "mcu", name: { it: "Saga del Multiverso", en: "Multiverse Saga" },
    how: { it: "Guarda {n} titoli dalla Fase 4 in poi (su {tot})", en: "Watch {n} titles from Phase 4 on (of {tot})" },
    art: BADGE_ART.portal, tint: "#ffe2c2" }, mcu.filter((t) => t.saga === "multi"));
  complete({ key: "avengers", group: "mcu", name: { it: "Avengers Assemble", en: "Avengers Assemble" },
    how: { it: "Guarda {n} titoli del tema Avengers (su {tot})", en: "Watch {n} Avengers-theme titles (of {tot})" },
    art: BADGE_ART.shield, tint: "#dfe6ff" }, DATA.filter((t) => t.themes.includes("avengers")));
  // Prossima uscita con una lista ufficiale (oggi Avengers: Doomsday)
  const up = UPCOMING.find((u) => u.list.length > 0);
  if (up) {
    complete({ key: "prep", group: "mcu", name: { it: `Pronto per ${up.t.replace(/^Avengers:\s*/, "")}`, en: `Ready for ${up.t.replace(/^Avengers:\s*/, "")}` },
      how: { it: "Guarda {n} titoli della lista ufficiale (su {tot})", en: "Watch {n} titles from the official list (of {tot})" },
      art: AVATAR_BY_KEY.doom?.svg ?? BADGE_ART.shield, tint: "#d9f0dc" },
      up.list.map((id) => DATA.find((t) => t.id === id)).filter((t): t is Title => !!t));
  }

  // 3. Universi
  const unis = UNIVERSES.filter((u) => u.k !== "all");
  add({ key: "explorer", group: "uni", name: { it: "Esploratore del Multiverso", en: "Multiverse Explorer" },
    how: { it: "Guarda almeno un titolo in {n} universi diversi", en: "Watch at least one title in {n} different universes" },
    art: BADGE_ART.planet, tint: "#d6f0ff",
    value: unis.filter((u) => seenList.some((t) => t.uni === u.k)).length, levels: [3, 5, unis.length] });
  for (const u of unis) {
    complete({ key: `uni-${u.k}`, group: "uni", name: UNI_NAMES[u.k] ?? { it: u.it, en: u.en },
      how: { it: `Guarda {n} titoli di ${u.short || u.it} (su {tot})`, en: `Watch {n} ${u.short || u.en} titles (of {tot})` },
      // simbolo della porta della Home, bianco sul colore dell'universo
      art: `<g transform="translate(17 17) scale(.66)" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round" stroke-linejoin="round">${DOOR_SYMBOL[u.k] ?? ""}</g>`,
      tint: DOOR_COLOR[u.k] ?? "#444" }, DATA.filter((t) => t.uni === u.k));
  }
  complete({ key: "defenders", group: "uni", name: { it: "Strade di New York", en: "Streets of New York" },
    how: { it: "Guarda {n} titoli dei Defenders (su {tot})", en: "Watch {n} Defenders titles (of {tot})" },
    art: BADGE_ART.skyline, tint: "#dfe2ff" }, DATA.filter((t) => t.themes.includes("defenders")));

  // 4. Percorsi (uno per personaggio)
  PATHS.filter((p) => p.kind === "chars").forEach((p, i) => {
    const av = AVATARS.find((a) => a.path === p.key);
    complete({ key: `path-${p.key}`, group: "paths", name: { it: p.it, en: p.en },
      how: { it: `Guarda {n} titoli del percorso ${p.it} (su {tot})`, en: `Watch {n} titles of the ${p.en} path (of {tot})` },
      // l'avatar kawaii del personaggio, se c'è; altrimenti una mascherina colorata
      art: av ? av.svg : BADGE_ART.mask.replace("var(--mk,#2e5fae)", MASK_COLORS[i % MASK_COLORS.length]),
      tint: "#eef0f4" }, DATA.filter((t) => t.chars.includes(p.key)));
  });

  // 5. Modo di guardare
  // Cronologista: la fila più lunga di titoli MCU consecutivi (in ordine cronologico) tutti visti
  let run = 0, best = 0;
  for (const t of [...mcu].sort((a, b) => a.chrono - b.chrono)) { run = d.seen[t.id] ? run + 1 : 0; best = Math.max(best, run); }
  add({ key: "chrono", group: "style", name: { it: "Cronologista", en: "Chronologist" },
    how: { it: "Guarda {n} titoli MCU di fila nella linea temporale", en: "Watch {n} MCU titles in a row on the timeline" },
    art: BADGE_ART.clock, tint: "#ffe2c2", value: best, levels: [5, 10, 25] });
  add({ key: "postcredits", group: "style", name: { it: "Resta fino alla fine", en: "Stay Till the End" },
    how: { it: "Guarda {n} titoli con scene dopo i titoli", en: "Watch {n} titles with post-credit scenes" },
    art: BADGE_ART.shawarma, tint: "#fff1c2", value: seenList.filter((t) => t.pc > 0).length, levels: [10, 25, 50] });
  add({ key: "critic", group: "style", name: { it: "Critico", en: "Critic" },
    how: { it: "Vota {n} titoli con le Gemme", en: "Rate {n} titles with Gems" },
    art: BADGE_ART.critic, tint: "#f0e0ff", value: Object.values(d.rating).filter((v) => v > 0).length, levels: [10, 25, 50] });
  add({ key: "sixgems", group: "style", name: { it: "Sei Gemme", en: "Six Gems" },
    how: { it: "Dai il voto massimo (6 Gemme) a {n} titoli", en: "Give the top score (6 Gems) to {n} titles" },
    art: BADGE_ART.sixgems, tint: "#2a2340", value: Object.values(d.rating).filter((v) => v === 6).length, levels: [1, 5, 10] });
  add({ key: "archaeologist", group: "style", name: { it: "Archeologo", en: "Archaeologist" },
    how: { it: "Guarda {n} titoli di prima del 2000", en: "Watch {n} titles released before 2000" },
    art: BADGE_ART.vhs, tint: "#e8e0d4", value: seenList.filter((t) => t.y < 2000).length, levels: [1, 5, 15] });
  add({ key: "series", group: "style", name: { it: "Fan delle serie", en: "Series Fan" },
    how: { it: "Finisci {n} serie", en: "Finish {n} series" },
    art: BADGE_ART.couch, tint: "#ffdfe3", value: seenList.filter((t) => t.type === "serie").length, levels: [1, 5, 15] });
  add({ key: "cartoons", group: "style", name: { it: "Cartoni del sabato", en: "Saturday Cartoons" },
    how: { it: "Guarda {n} titoli d'animazione", en: "Watch {n} animated titles" },
    art: BADGE_ART.cereal, tint: "#d6f0ff", value: seenList.filter((t) => t.type === "anim").length, levels: [5, 15, 30] });

  // 6. Segreti
  add({ key: "back", group: "secret", secret: true, name: { it: "Ritorno al passato", en: "Back in Time" },
    how: { it: "Recupera {n} titoli che avevi saltato", en: "Catch up on {n} titles you had skipped" },
    art: BADGE_ART.rewind, tint: "#d9f0dc", value: d.back ?? 0, levels: [1, 5, 10] });
  // Il preferito: il percorso del personaggio preferito del profilo
  const fav = d.profile?.favChar ? AVATAR_BY_KEY[d.profile.favChar] : undefined;
  const favList = fav?.path ? DATA.filter((t) => t.chars.includes(fav.path!)) : [];
  add({ key: "favorite", group: "secret", secret: true, name: { it: "Il preferito", en: "The Favorite" },
    how: favList.length
      ? { it: `Guarda {n} titoli del percorso di ${fav!.it} (su {tot})`, en: `Watch {n} titles of ${fav!.en}'s path (of {tot})` }
      : { it: "Scegli un personaggio preferito con un percorso", en: "Pick a favorite character that has a path" },
    art: BADGE_ART.heart, tint: "#ffdfe3", value: seenOf(favList, d), levels: favList.length ? thirds(favList.length) : [1, 1, 1] });
  // Cattivo dentro: l'avatar è un cattivo e guardi i film in cui compare
  const av = d.profile?.avatar ? AVATAR_BY_KEY[d.profile.avatar] : undefined;
  const vList = av?.villain ? (VILLAIN_TITLES[av.key] ?? []).map((id) => DATA.find((t) => t.id === id)).filter((t): t is Title => !!t) : [];
  add({ key: "villain", group: "secret", secret: true, name: { it: "Cattivo dentro", en: "Villain Inside" },
    how: vList.length
      ? { it: `Con l'avatar di ${av!.it}, guarda {n} titoli in cui compare (su {tot})`, en: `With the ${av!.en} avatar, watch {n} titles they appear in (of {tot})` }
      : { it: "Scegli l'avatar di un cattivo e guarda i suoi film", en: "Pick a villain avatar and watch their films" },
    art: BADGE_ART.villain, tint: "#ece4ff", value: seenOf(vList, d), levels: vList.length ? thirds(vList.length) : [1, 1, 1] });

  return out;
}

/** Testo "cosa fare" con i numeri: {n} = prossima soglia (o l'Oro se finito), {tot} = Oro */
export function howText(b: Badge, lang: "it" | "en"): string {
  const n = b.levels[Math.min(b.level, 2)];
  let s = b.how[lang].replace("{n}", String(n)).replace("{tot}", String(b.levels[2]));
  // con 1 il singolare: "Guarda 1 titolo", "Watch 1 title"
  if (n === 1) s = s.replace(/\b1 (titoli|titles|episodi|episodes|serie|series)\b/, (_, w: string) =>
    `1 ${({ titoli: "titolo", titles: "title", episodi: "episodio", episodes: "episode", serie: "serie", series: "series" } as Record<string, string>)[w]}`);
  return s;
}
