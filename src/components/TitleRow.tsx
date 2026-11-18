/* ============================================================================
   RIGA DI UN TITOLO (Home e Preparazione)
   numero | miniatura | titolo + info | voto | pulsante "visto"
   Cliccando la riga si apre la scheda.
   ============================================================================ */
import { useMetaLine } from "../hooks";
import { useT } from "../i18n";
import { go } from "../router";
import { useStore } from "../store";
import type { Title } from "../types";
import { GemsRow } from "./Gem";
import { SeenButton } from "./SeenButton";
import { Thumb } from "./Thumb";

export function TitleRow({ d, n }: { d: Title; n?: number }) {
  const { lang } = useT();
  const { data } = useStore();
  const meta = useMetaLine();
  const seen = !!data.seen[d.id];
  return (
    <div className={`row${seen ? " is-seen" : ""}${n === undefined ? " no-n" : ""}`} onClick={() => go({ page: "title", id: d.id })}>
      {n !== undefined && <span className="n">{String(n).padStart(2, "0")}</span>}
      <Thumb d={d} />
      <div className="t"><b>{d.t[lang]}</b><small>{meta(d)}</small></div>
      <GemsRow n={data.rating[d.id] || 0} />
      <SeenButton d={d} />
    </div>
  );
}
