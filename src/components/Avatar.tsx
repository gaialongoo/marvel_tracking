/* ============================================================================
   AVATAR — riquadro con il personaggio del profilo.
   - Se esiste l'immagine public/avatars/<chiave>.webp (generata e poi
     ottimizzata con scripts/ottimizza-immagini.py) si mostra quella.
   - Se l'immagine manca si usa il disegno di riserva in data/avatars.ts.
   - Senza avatar scelto si vede l'iniziale del nome su sfondo grafite.
   ============================================================================ */
import { useState } from "react";
import { AVATAR_BY_KEY } from "../data/avatars";

/** Indirizzo dell'immagine di un avatar (funziona anche su GitHub Pages) */
const avatarUrl = (k: string) => `${import.meta.env.BASE_URL}avatars/${k}.webp`;

/** Avatar la cui immagine non esiste: si ricordano, così non si riprova a ogni disegno */
const missing = new Set<string>();

/** size = lato in pixel */
export function Avatar({ k, size = 40, fallback = "?", className = "" }: { k?: string; size?: number; fallback?: string; className?: string }) {
  const a = k ? AVATAR_BY_KEY[k] : undefined;
  // Forza un nuovo disegno quando un'immagine non si carica
  const [, setFailed] = useState(0);
  const style = { width: size, height: size, "--bg": a?.bg ?? "var(--surface2)", fontSize: size * 0.42 } as React.CSSProperties;

  if (!a) return <span className={`avatar empty-av ${className}`} style={style} aria-hidden="true">{fallback.slice(0, 1).toUpperCase()}</span>;

  return (
    <span className={`avatar ${className}`} style={style} aria-hidden="true">
      {missing.has(a.key)
        /* Disegno di riserva: stringa costante scritta da noi (nessun testo dell'utente), sicura da inserire così */
        ? <svg viewBox="0 0 100 100" dangerouslySetInnerHTML={{ __html: a.svg }} />
        : <img src={avatarUrl(a.key)} alt="" loading="lazy" draggable={false}
            onError={() => { missing.add(a.key); setFailed((n) => n + 1); }} />}
    </span>
  );
}
