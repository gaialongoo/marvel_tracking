/* ============================================================================
   TOAST — messaggi temporanei in basso ("Backup scaricato", errori…)
   showToast() può essere chiamata da qualsiasi punto; il componente <Toast/>
   in App li mostra.
   ============================================================================ */
import { useSyncExternalStore } from "react";

interface ToastMsg { text: string; error: boolean; id: number }

let current: ToastMsg | null = null;
let timer: number | undefined;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

/** Mostra un messaggio per ~2,6 secondi */
export function showToast(text: string, error = false) {
  current = { text, error, id: Date.now() };
  emit();
  clearTimeout(timer);
  timer = window.setTimeout(() => { current = null; emit(); }, 2600);
}

/** Hook per il componente che disegna il messaggio */
export function useToast() {
  return useSyncExternalStore(
    (cb) => { listeners.add(cb); return () => listeners.delete(cb); },
    () => current,
  );
}
