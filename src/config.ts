// Impostazioni del sito - da cambiare qui, in un posto solo.

/** Indirizzo pubblico del sito (serve per i link di invito e la scheda da condividere) */
export const SITE_URL = "https://marveltracker.com/";

/**
 * Email per le richieste sulla privacy (copia o cancellazione dei dati,
 * segnalazioni). Vuota = la pagina Privacy mostra "contatto in arrivo".
 */
export const CONTACT_EMAIL = "info@marveltracker.com";

/**
 * Età minima per creare un account (in Italia sotto i 14 anni serve il
 * consenso dei genitori per i servizi online)
 */
export const MIN_AGE = 14;

/**
 * Chiave pubblica ("Site Key") del controllo anti-bot Cloudflare Turnstile
 * (Cloudflare -> Turnstile). È fatta per stare nel sito. La chiave segreta
 * invece va solo in Supabase (Authentication -> Attack Protection).
 * Vuota = controllo spento.
 */
export const TURNSTILE_SITE_KEY = "0x4AAAAAAGU6JoIk_f26ef8H";
