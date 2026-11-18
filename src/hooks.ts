/* ============================================================================
   HOOK CONDIVISI tra più componenti
   ============================================================================ */
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
