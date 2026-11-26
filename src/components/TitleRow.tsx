// Riga di un titolo (Home e Preparazione)
// numero | miniatura | titolo + info | voto | pulsante "visto"
// Cliccando la riga si apre la scheda.
import { useMetaLine } from "../hooks";
import { useT } from "../i18n";
import { go } from "../router";
import { useStore } from "../store";
import type { Title } from "../types";
import { isNew } from "../utils";
import { GemsRow } from "./Gem";
import { IconBookmark } from "./Icons";
import { SeenButton } from "./SeenButton";
import { Thumb } from "./Thumb";

/** added = titolo aggiunto da noi alla versione completa di una lista Disney+ */
export function TitleRow({ d, n, added = false }: { d: Title; n?: number; added?: boolean }) {
  const { lang, t } = useT();
  const { data } = useStore();
  const meta = useMetaLine();
  const seen = !!data.seen[d.id];
  return (
    <div className={`row${seen ? " is-seen" : ""}${n === undefined ? " no-n" : ""}`} onClick={() => go({ page: "title", id: d.id })}>
      {n !== undefined && <span className="n">{String(n).padStart(2, "0")}</span>}
      <Thumb d={d} />
      <div className="t">
        <b>
          {d.t[lang]}
          {added && <span className="added" title={t("addedNote")}>{t("added")}</span>}
          {/* «Nuovo»: uscito da poco · segnalibro: è nella lista "Da vedere" */}
          {isNew(d.id) && <span className="added new" title={t("newNote")}>{t("newTag")}</span>}
          {data.watch?.[d.id] && !seen && <span className="row-wl" title={t("watchlist")}><IconBookmark on /></span>}
        </b>
        <small>{meta(d)}</small>
      </div>
      <GemsRow n={data.rating[d.id] || 0} />
      <SeenButton d={d} />
    </div>
  );
}
