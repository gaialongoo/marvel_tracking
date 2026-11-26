// Condivisione
// - shareCard(): disegna un'immagine 1080x1350 (formato dei post e delle
//   storie) con avatar, nome, @tag, titoli visti, ore, badge e una barra per
//   ogni universo, poi la condivide (telefono) o la scarica (PC).
// - shareInvite(): condivide (o copia) il link di invito #/u/<tag>: chi lo
//   apre vede la tua pagina e può chiederti l'amicizia, anche dopo essersi
//   registrato (vedi rememberInvite / takeInvite).
// Il disegno è fatto con <canvas>: niente servizi esterni.
import { ARC_SVG } from "./components/ArcReactor";
import { computeBadges } from "./badges";
import { AVATAR_BY_KEY } from "./data/avatars";
import { UNIVERSES } from "./data/meta";
import { DATA } from "./data/titles";
import { DOOR_COLOR } from "./data/universeArt";
import { SITE_URL } from "./config";
import type { Lang, SavedData } from "./types";
import { fmtMin, watchedMin } from "./utils";

// Immagine da condividere
const W = 1080, H = 1350;
const GOLD = "#c9a24b", TEXT = "#e6e8ec", MUTED = "#868d99", LINE = "#24282f";

/** Carica un disegno SVG (stringa) come immagine per il canvas */
function svgImage(inner: string, viewBox = "0 0 100 100"): Promise<HTMLImageElement> {
  // Alcuni disegni hanno attributi ripetuti: nella pagina vanno bene, ma come
  // immagine il browser li rifiuta. Li faccio leggere come HTML (che li
  // perdona) e poi riscrivere come SVG pulito.
  const doc = new DOMParser().parseFromString(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}">${inner}</svg>`, "text/html");
  const xml = new XMLSerializer().serializeToString(doc.querySelector("svg")!);
  const src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(xml)}`;
  return new Promise((ok, ko) => { const img = new Image(); img.onload = () => ok(img); img.onerror = ko; img.src = src; });
}

/** Testi della scheda nelle due lingue */
const TXT = {
  it: { titles: "titoli visti", hours: "ore di visione", badges: "badge", gold: "d'oro", cta: "Tieni il conto anche tu" },
  en: { titles: "titles watched", hours: "watch time", badges: "badges", gold: "gold", cta: "Track yours too" },
};

/** Disegna la scheda e la restituisce come PNG */
export async function drawCard(d: SavedData, name: string, handle: string | null, lang: Lang): Promise<Blob> {
  const tx = TXT[lang];
  const c = document.createElement("canvas");
  c.width = W; c.height = H;
  const g = c.getContext("2d")!;
  // I font vengono scaricati solo quando servono: li chiedo prima di scrivere
  // (altrimenti il canvas userebbe un carattere di riserva)
  await Promise.all(["500 30px Inter", "600 30px Inter", "700 30px Inter", "500 30px 'IBM Plex Mono'", "600 30px 'IBM Plex Mono'"]
    .map((f) => document.fonts.load(f).catch(() => null)));

  // sfondo grafite con un alone dorato in alto e cornice
  g.fillStyle = "#0b0c0f"; g.fillRect(0, 0, W, H);
  const glow = g.createRadialGradient(W * 0.8, 0, 0, W * 0.8, 0, 900);
  glow.addColorStop(0, "rgba(201,162,75,.22)"); glow.addColorStop(1, "rgba(201,162,75,0)");
  g.fillStyle = glow; g.fillRect(0, 0, W, H);
  g.strokeStyle = "rgba(201,162,75,.45)"; g.lineWidth = 3; roundRect(g, 30, 30, W - 60, H - 60, 36); g.stroke();

  // logo + nome dell'app
  const logo = await svgImage(ARC_SVG, "0 0 64 64");
  g.drawImage(logo, 90, 90, 72, 72);
  g.fillStyle = TEXT; g.font = "700 34px Inter"; g.textBaseline = "middle";
  g.fillText("MARVEL TRACKER", 182, 127);

  // avatar (cerchio grigio come nell'app) o iniziale
  const ax = W / 2, ay = 330, ar = 120;
  g.save(); g.beginPath(); g.arc(ax, ay, ar, 0, Math.PI * 2); g.closePath();
  g.fillStyle = "#b3b8c0"; g.fill(); g.clip();
  const av = AVATAR_BY_KEY[d.profile?.avatar ?? ""];
  if (av) g.drawImage(await svgImage(av.svg), ax - ar, ay - ar, ar * 2, ar * 2);
  else { g.fillStyle = "#181b21"; g.fillRect(ax - ar, ay - ar, ar * 2, ar * 2); g.fillStyle = GOLD; g.font = "500 110px 'IBM Plex Mono'"; g.textAlign = "center"; g.fillText(name.slice(0, 1).toUpperCase(), ax, ay + 6); }
  g.restore();

  // nome e @tag
  g.textAlign = "center"; g.fillStyle = TEXT; g.font = "700 64px Inter";
  g.fillText(fit(g, name, W - 200), W / 2, 510);
  if (handle) { g.fillStyle = GOLD; g.font = "500 34px 'IBM Plex Mono'"; g.fillText(`@${handle}`, W / 2, 568); }

  // tre numeri grandi
  const seen = DATA.filter((x) => d.seen[x.id]).length;
  const minutes = DATA.reduce((a, x) => a + watchedMin(x, d), 0);
  const badges = computeBadges(d);
  const won = badges.filter((b) => b.level > 0).length, gold = badges.filter((b) => b.level === 3).length;
  const kpis = [
    [`${seen}/${DATA.length}`, tx.titles],
    [fmtMin(minutes), tx.hours],
    [`${won}`, `${tx.badges} · ${gold} ${tx.gold}`],
  ];
  kpis.forEach(([big, small], i) => {
    const x = 90 + i * 300, y = 620, w = 280, h = 170;
    g.fillStyle = "#121418"; roundRect(g, x, y, w, h, 22); g.fill();
    g.strokeStyle = LINE; g.lineWidth = 2; g.stroke();
    g.fillStyle = GOLD; g.font = "600 52px 'IBM Plex Mono'"; g.fillText(fit(g, big, w - 30), x + w / 2, y + 72);
    g.fillStyle = MUTED; g.font = "500 24px Inter"; g.fillText(fit(g, small, w - 30), x + w / 2, y + 128);
  });

  // una barra per universo
  g.textAlign = "left";
  UNIVERSES.filter((u) => u.k !== "all").forEach((u, i) => {
    const items = DATA.filter((x) => x.uni === u.k);
    const n = items.filter((x) => d.seen[x.id]).length;
    const y = 860 + i * 48;
    g.fillStyle = TEXT; g.font = "500 26px Inter"; g.fillText(u.short || u[lang], 90, y);
    g.fillStyle = "rgba(255,255,255,.08)"; roundRect(g, 330, y - 9, 520, 18, 9); g.fill();
    if (n) { g.fillStyle = lighten(DOOR_COLOR[u.k] ?? GOLD); roundRect(g, 330, y - 9, Math.max(18, (520 * n) / items.length), 18, 9); g.fill(); }
    g.fillStyle = MUTED; g.font = "500 24px 'IBM Plex Mono'"; g.textAlign = "right"; g.fillText(`${n}/${items.length}`, W - 90, y); g.textAlign = "left";
  });

  // invito in fondo
  g.textAlign = "center"; g.fillStyle = TEXT; g.font = "600 30px Inter"; g.fillText(tx.cta, W / 2, H - 120);
  g.fillStyle = GOLD; g.font = "500 26px 'IBM Plex Mono'"; g.fillText(SITE_URL.replace(/^https:\/\//, "").replace(/\/$/, ""), W / 2, H - 78);

  return new Promise((ok) => c.toBlob((b) => ok(b!), "image/png"));
}

/** Rettangolo con angoli arrotondati (solo il tracciato) */
function roundRect(g: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r);
  g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath();
}

/** Accorcia un testo con "…" se è più largo di max */
function fit(g: CanvasRenderingContext2D, s: string, max: number) {
  if (g.measureText(s).width <= max) return s;
  while (s.length > 1 && g.measureText(s + "…").width > max) s = s.slice(0, -1);
  return s + "…";
}

/** Colore più chiaro (le barre si devono vedere sul fondo scuro) */
function lighten(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  const ch = (v: number) => Math.min(255, Math.round(v + (255 - v) * 0.35));
  return `rgb(${ch(n >> 16)},${ch((n >> 8) & 255)},${ch(n & 255)})`;
}

/**
 * Condivide l'immagine (telefono: menu di condivisione) o la scarica (PC).
 * "shared" | "downloaded" | "cancelled"
 */
export async function shareCard(d: SavedData, name: string, handle: string | null, lang: Lang, text: string) {
  const blob = await drawCard(d, name, handle, lang);
  const file = new File([blob], "marvel-tracker.png", { type: "image/png" });
  if (navigator.canShare?.({ files: [file] })) {
    try { await navigator.share({ files: [file], text: `${text} ${SITE_URL}` }); return "shared"; }
    catch { return "cancelled"; } // chiuso il menu di condivisione
  }
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob); a.download = "marvel-tracker.png"; a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  return "downloaded";
}

// Link di invito
/** Il link di invito di un @tag */
export const inviteUrl = (handle: string) => `${SITE_URL}#/u/${encodeURIComponent(handle)}`;

/**
 * Condivide il link (telefono) o lo copia negli appunti (PC).
 * "shared" | "copied" | "cancelled" | "error"
 */
export async function shareInvite(handle: string, text: string) {
  const url = inviteUrl(handle);
  if (navigator.share) {
    try { await navigator.share({ text, url }); return "shared"; }
    catch { return "cancelled"; }
  }
  try { await navigator.clipboard.writeText(`${text} ${url}`); return "copied"; }
  catch { return "error"; }
}

// Chi apre un link di invito senza aver fatto l'accesso deve prima
// registrarsi (e magari confermare l'email, che riapre il sito senza il
// "#/u/…"): il tag dell'invito resta salvato nel browser fino all'accesso.
const INVITE_KEY = "marvel-tracker-invite";

/** Ricorda l'invito presente nell'indirizzo (se c'è); restituisce il tag */
export function rememberInvite(): string | null {
  const m = location.hash.match(/^#\/u\/([a-z0-9_]{3,20})$/);
  try {
    if (m) localStorage.setItem(INVITE_KEY, m[1]);
    return m ? m[1] : localStorage.getItem(INVITE_KEY);
  } catch { return m ? m[1] : null; }
}

/** Prende (e dimentica) l'invito salvato */
export function takeInvite(): string | null {
  try {
    const t = localStorage.getItem(INVITE_KEY);
    localStorage.removeItem(INVITE_KEY);
    return t;
  } catch { return null; }
}
