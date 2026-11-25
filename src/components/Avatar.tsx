/* ============================================================================
   AVATAR — riquadro con il personaggio del profilo (disegni in data/avatars.ts,
   stile "si affacciano dal bordo" con il tratto disegnato a mano).
   Senza avatar scelto si vede l'iniziale del nome su sfondo grafite.
   ============================================================================ */
import { AVATAR_BY_KEY } from "../data/avatars";

/** size = lato in pixel */
export function Avatar({ k, size = 40, fallback = "?", className = "" }: { k?: string; size?: number; fallback?: string; className?: string }) {
  const a = k ? AVATAR_BY_KEY[k] : undefined;
  // cerchio con fondo grigio chiaro (vedi .avatar in styles.css)
  const style = { width: size, height: size, fontSize: size * 0.42 } as React.CSSProperties;
  if (!a) return <span className={`avatar empty-av ${className}`} style={style} aria-hidden="true">{fallback.slice(0, 1).toUpperCase()}</span>;
  return (
    <span className={`avatar ${className}`} style={style} aria-hidden="true">
      {/* Disegno costante scritto da noi (nessun testo dell'utente): sicuro da inserire così */}
      <svg viewBox="0 0 100 100" dangerouslySetInnerHTML={{ __html: a.svg }} />
    </span>
  );
}
