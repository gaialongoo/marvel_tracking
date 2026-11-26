// Pulsante "visto"
// - film, o serie non iniziata -> cerchio vuoto
// - serie iniziata (1–99%)     -> anello di avanzamento con la percentuale
// - visto / serie al 100%      -> spunta verde
// Cliccando una serie a metà la si segna come vista tutta.
import { useT } from "../i18n";
import { toggleSeen, useStore } from "../store";
import type { Title } from "../types";
import { epsPct, epsSeen } from "../utils";
import { IconCheck } from "./Icons";

export function SeenButton({ d }: { d: Title }) {
  const { data } = useStore();
  const { t } = useT();
  const seen = !!data.seen[d.id];
  const pct = seen ? 0 : epsPct(d, data);

  // stopPropagation: il pulsante sta dentro una riga cliccabile, non deve aprire la scheda
  const onClick = (e: React.MouseEvent) => { e.stopPropagation(); toggleSeen(d.id); };

  if (pct > 0) {
    return (
      <button className="seen-btn partial" style={{ "--p": pct } as React.CSSProperties} onClick={onClick}
        title={`${t("markSeen")} · ${epsSeen(data, d.id)}/${d.eps} ${t("eps")}`} aria-pressed="mixed">
        <span>{pct}</span>
      </button>
    );
  }
  return (
    <button className={`seen-btn${seen ? " on" : ""}`} onClick={onClick} title={t("markSeen")} aria-pressed={seen}>
      <IconCheck />
    </button>
  );
}
