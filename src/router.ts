/* ============================================================================
   NAVIGAZIONE — basata sull'indirizzo dopo il "#" (funziona anche su
   GitHub Pages senza configurazioni). Pagine:
     #/          → Home
     #/prep      → Preparazione
     #/t/<id>    → Scheda del titolo
   Così i pulsanti Avanti/Indietro del browser funzionano.
   ============================================================================ */
import { useSyncExternalStore } from "react";

export type Route = { page: "home" } | { page: "prep" } | { page: "title"; id: string };

/** Trasforma l'indirizzo in una pagina */
function parse(hash: string): Route {
  const h = hash.replace(/^#\/?/, "");
  if (h === "prep") return { page: "prep" };
  if (h.startsWith("t/")) return { page: "title", id: decodeURIComponent(h.slice(2)) };
  return { page: "home" };
}

/** Hook: la pagina attuale, aggiornata quando cambia l'indirizzo */
export function useRoute(): Route {
  const hash = useSyncExternalStore(
    (cb) => { window.addEventListener("hashchange", cb); return () => window.removeEventListener("hashchange", cb); },
    () => location.hash,
  );
  return parse(hash);
}

/** Vai a una pagina */
export function go(r: Route) {
  location.hash = r.page === "home" ? "/" : r.page === "prep" ? "/prep" : `/t/${encodeURIComponent(r.id)}`;
}
