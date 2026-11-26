// Hook condivisi tra più componenti
import { useAuth } from "./auth";
import { useT } from "./i18n";
import { useStore } from "./store";
import type { Title } from "./types";
import { epsSeen, hasEps } from "./utils";

/** Riga informativa sotto un titolo: anno · tipo · durata (o episodi visti/totali) */
export function useMetaLine() {
  const { t } = useT();
  const { data } = useStore();
  return (d: Title) => {
    if (!hasEps(d)) return `${d.y} · ${t(d.type)} · ${d.min} ${t("min")}`;
    const n = epsSeen(data, d.id);
    return `${d.y} · ${t(d.type)} · ${n && n < (d.eps as number) ? `${n}/` : ""}${d.eps} ${t("eps")}`;
  };
}

/**
 * Nome da mostrare: quello scelto nel profilo, altrimenti la parte
 * dell'email prima di "@" (es. "mario.rossi@…" -> "mario.rossi")
 */
export function useDisplayName() {
  const { data } = useStore();
  const { user } = useAuth();
  return data.profile?.name || (user?.email ?? "").split("@")[0] || "?";
}
