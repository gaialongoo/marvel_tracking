// Tema chiaro / scuro
// La scelta vale per questo dispositivo (come la lingua) e resta salvata nel
// browser. "auto" segue l'impostazione del sistema (telefono o PC).
// Il tema si applica mettendo data-theme="light" | "dark" su <html>: i
// colori sono variabili CSS (vedi :root e :root[data-theme="light"] in
// styles.css).
import { useSyncExternalStore } from "react";

export type Theme = "auto" | "light" | "dark";

const KEY = "marvel-tracker-theme";
const media = window.matchMedia("(prefers-color-scheme: light)");

/** Scelta salvata (se manca: automatico) */
function load(): Theme {
  try {
    const t = localStorage.getItem(KEY);
    if (t === "light" || t === "dark" || t === "auto") return t;
  } catch { /* memoria del browser bloccata: uso il predefinito */ }
  return "auto";
}

let choice: Theme = load();
const listeners = new Set<() => void>();

/** Il tema effettivo: la scelta, oppure quello del sistema se "auto" */
export const resolved = (): "light" | "dark" => (choice === "auto" ? (media.matches ? "light" : "dark") : choice);

/** Applica il tema alla pagina (e al colore della barra del browser su telefono) */
export function applyTheme() {
  const r = resolved();
  document.documentElement.dataset.theme = r;
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", r === "light" ? "#f4f5f7" : "#0b0c0f");
  listeners.forEach((l) => l());
}

/** Cambia la scelta e la ricorda su questo dispositivo */
export function setTheme(t: Theme) {
  choice = t;
  try { localStorage.setItem(KEY, t); } catch { /* ignoro */ }
  applyTheme();
}

/** Passa da chiaro a scuro (e viceversa) rispetto a quello che si vede ora */
export const toggleTheme = () => setTheme(resolved() === "light" ? "dark" : "light");

// In automatico il tema segue i cambi del sistema (es. modalità notte)
media.addEventListener("change", () => { if (choice === "auto") applyTheme(); });
// Un'altra scheda ha cambiato il tema: mi adeguo
window.addEventListener("storage", (e) => { if (e.key === KEY) { choice = load(); applyTheme(); } });

/** Hook: { choice, resolved }, aggiornato quando cambia */
export function useTheme() {
  const snap = useSyncExternalStore(
    (cb) => { listeners.add(cb); return () => listeners.delete(cb); },
    () => `${choice}|${resolved()}`,
  );
  const [c, r] = snap.split("|") as [Theme, "light" | "dark"];
  return { choice: c, resolved: r };
}
