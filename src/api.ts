// API - collegamento al backend di Marvel Tracker (worker/ → api.marveltracker.com).
// L'app non parla più direttamente con Supabase: chiama solo questi indirizzi.
// La sessione sta in cookie che il browser manda da solo ("credentials:
// include") e che il JavaScript della pagina non può leggere.
// L'indirizzo arriva da VITE_API_URL (.env.local in locale, Variables di
// GitHub Actions sul sito pubblicato).

/** Indirizzo del backend, senza "/" finale */
const BASE = (import.meta.env.VITE_API_URL as string | undefined)?.trim().replace(/\/+$/, "") || "";

/** true se l'app sa a quale backend collegarsi */
export const isConfigured = BASE !== "";

/** Risposta del backend: ok + dati, oppure il codice d'errore */
export type ApiResult<T> = { ok: true; data: T } | { ok: false; status: number; error: string };

/** Chi vuole sapere quando la sessione è scaduta (lo usa auth.ts) */
let onExpired: (() => void) | null = null;
export const setOnExpired = (cb: () => void) => { onExpired = cb; };

/**
 * Chiama il backend. Senza rete risponde con error "network".
 * Se la sessione non è più valida (401) avvisa auth.ts, che torna alla
 * pagina di accesso.
 */
export async function api<T = unknown>(path: string, method: "GET" | "POST" | "PUT" | "DELETE" = "GET", body?: unknown): Promise<ApiResult<T>> {
  let res: Response;
  try {
    res = await fetch(BASE + path, {
      method,
      credentials: "include",
      headers: body === undefined && method === "GET" ? undefined : { "Content-Type": "application/json" },
      body: body === undefined ? (method === "GET" ? undefined : "{}") : JSON.stringify(body),
    });
  } catch {
    return { ok: false, status: 0, error: "network" };
  }
  let data: unknown = null;
  try { data = await res.json(); } catch { data = null; }
  if (res.ok) return { ok: true, data: data as T };
  const error = (data as { error?: string } | null)?.error || "error";
  if (res.status === 401 && error === "session") onExpired?.();
  return { ok: false, status: res.status, error };
}
