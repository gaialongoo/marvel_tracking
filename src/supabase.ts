/* ============================================================================
   SUPABASE — collegamento al servizio che gestisce account e database.
   Indirizzo e chiave arrivano da .env.local (in locale) o dalle Variables di
   GitHub Actions (sul sito pubblicato). Se mancano, l'app mostra una pagina
   che spiega come configurarli (vedi components/Auth.tsx).
   ============================================================================ */
import { createClient } from "@supabase/supabase-js";

// Indirizzo base del progetto: tolgo un eventuale "/rest/v1/" o "/" finale
// (capita copiando l'indirizzo dalla pagina sbagliata della dashboard)
const url = (import.meta.env.VITE_SUPABASE_URL as string | undefined)?.trim().replace(/\/rest\/v1\/?$|\/+$/, "");
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;

/** true se l'app sa a quale progetto Supabase collegarsi */
export const isConfigured = !!(url && key);

/** Il client Supabase (null se non configurato).
    flowType "pkce": i link via email (conferma, recupero password) tornano
    con ?code=… invece di usare il "#", che l'app usa già per la navigazione. */
export const supabase = isConfigured
  ? createClient(url!, key!, { auth: { flowType: "pkce", persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } })
  : null;

/** Indirizzo a cui tornare dopo aver cliccato un link nell'email:
    la pagina attuale senza ?… e #… (funziona in locale e su GitHub Pages) */
export const redirectUrl = () => location.origin + location.pathname;
