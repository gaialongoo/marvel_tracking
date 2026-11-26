// Controllo anti-bot di Cloudflare (Turnstile) per accesso, registrazione e
// "password dimenticata". Di solito non chiede niente: Cloudflare verifica il
// browser da solo e passa un "gettone" che mandiamo a Supabase insieme alla
// richiesta. Supabase lo controlla con la chiave segreta (che sta solo nel
// suo pannello) e rifiuta le richieste senza gettone valido.
// Ogni gettone vale una volta sola: dopo ogni tentativo il widget va rifatto
// (lo fa AuthPage cambiando la "key" del componente).
// Si accende solo se TURNSTILE_SITE_KEY in config.ts non è vuota.
import { useEffect, useRef } from "react";
import { TURNSTILE_SITE_KEY } from "../config";
import { useT } from "../i18n";
import { useTheme } from "../theme";

/** Le poche funzioni di Turnstile che usiamo */
interface TurnstileApi {
  render(el: HTMLElement, opts: Record<string, unknown>): string;
  remove(id: string): void;
}
declare global {
  interface Window { turnstile?: TurnstileApi }
}

const SCRIPT_URL = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

/** Carica lo script di Cloudflare una volta sola */
let loading: Promise<TurnstileApi> | null = null;
function loadTurnstile(): Promise<TurnstileApi> {
  if (window.turnstile) return Promise.resolve(window.turnstile);
  loading ??= new Promise((ok, fail) => {
    const s = document.createElement("script");
    s.src = SCRIPT_URL;
    s.async = true;
    s.onload = () => (window.turnstile ? ok(window.turnstile) : fail(new Error("turnstile")));
    // se non si carica (rete, blocchi) riprovo alla prossima apertura
    s.onerror = () => { loading = null; s.remove(); fail(new Error("turnstile")); };
    document.head.appendChild(s);
  });
  return loading;
}

/** true se il controllo è attivo (c'è la chiave pubblica) */
export const captchaOn = TURNSTILE_SITE_KEY !== "";

/** Il riquadro del controllo; onToken riceve il gettone (null se scade o va in errore) */
export function Turnstile({ onToken }: { onToken: (token: string | null) => void }) {
  const { lang } = useT();
  const { resolved } = useTheme();
  const box = useRef<HTMLDivElement>(null);
  // tengo l'ultima onToken senza dover rifare il widget a ogni render
  const cb = useRef(onToken);
  cb.current = onToken;

  useEffect(() => {
    if (!captchaOn) return;
    let id: string | null = null;
    let gone = false;
    loadTurnstile().then((ts) => {
      if (gone || !box.current) return;
      id = ts.render(box.current, {
        sitekey: TURNSTILE_SITE_KEY,
        theme: resolved,
        language: lang,
        size: "flexible",
        // visibile solo se Cloudflare ha un dubbio e chiede di cliccare: di solito non si vede
        appearance: "interaction-only",
        callback: (t: string) => cb.current(t),
        "expired-callback": () => cb.current(null),
        "error-callback": () => cb.current(null),
      });
    }).catch(() => cb.current(null));
    return () => { gone = true; if (id) window.turnstile?.remove(id); };
  }, [lang, resolved]);

  if (!captchaOn) return null;
  return <div className="turnstile" ref={box} />;
}
