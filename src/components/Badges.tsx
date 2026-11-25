/* ============================================================================
   BADGE — sezione del Profilo con tutti i traguardi, divisi per gruppo.
   I gruppi sono tendine (chiuse all'inizio) con la frazione di completamento.
   Ogni badge è una medaglia rotonda con il suo disegno: il bordo è di
   bronzo, argento o oro secondo il livello; se non l'hai ancora conquistato
   è grigia e sbiadita. Sotto: nome, livello, stelline e cosa manca.
   I calcoli sono in badges.ts.
   ============================================================================ */
import { useMemo, useState } from "react";
import { BADGE_GROUPS, computeBadges, howText, type Badge, type BadgeGroup } from "../badges";
import { BADGE_ART } from "../data/badgeArt";
import { useT } from "../i18n";
import { useStore } from "../store";

/** Nome di ogni livello (0 = non ancora conquistato) */
const LEVEL_KEY = ["lvlNone", "lvlBronze", "lvlSilver", "lvlGold"] as const;

export function Badges() {
  const { t } = useT();
  const { data } = useStore();
  // ricalcolo solo quando cambiano i dati
  const badges = useMemo(() => computeBadges(data), [data]);
  // "Solo conquistati": nasconde i badge ancora a zero
  const [onlyWon, setOnlyWon] = useState(false);

  const won = badges.filter((b) => b.level > 0).length;
  const levels = badges.reduce((a, b) => a + b.level, 0);
  const gold = badges.filter((b) => b.level === 3).length;

  return (
    <section className="block badges">
      <div className="badges-head">
        <div>
          <span className="eyebrow">{t("badges")}</span>
          <p className="muted-p">
            <span className="mono">{won}/{badges.length}</span> {t("badgesWon")} · <span className="mono">{levels}/{badges.length * 3}</span> {t("levelsWon")} · <span className="mono">{gold}</span> {t("lvlGold")}
          </p>
        </div>
        <div className="chips">
          <button className={`chip${!onlyWon ? " on" : ""}`} onClick={() => setOnlyWon(false)}>{t("all")}</button>
          <button className={`chip${onlyWon ? " on" : ""}`} onClick={() => setOnlyWon(true)}>{t("onlyWon")}</button>
        </div>
      </div>

      {BADGE_GROUPS.map((g: BadgeGroup) => {
        const list = badges.filter((b) => b.group === g && (!onlyWon || b.level > 0));
        if (!list.length) return null;
        // completamento del gruppo: badge conquistati e livelli (3 per badge)
        const all = badges.filter((b) => b.group === g);
        const gWon = all.filter((b) => b.level > 0).length;
        const gLv = all.reduce((n, b) => n + b.level, 0);
        return (
          // Tendina per gruppo (chiusa all'inizio): nell'intestazione nome,
          // frazione di completamento e barra
          <details key={g} className="badge-group">
            <summary>
              <span className="bgs-name">{t(`bg_${g}`)}</span>
              <span className="bgs-frac mono">{gWon}/{all.length}</span>
              <span className="bgs-lv">{gLv}/{all.length * 3} {t("levelsWon")}</span>
              <span className="progress bgs-bar" style={{ "--w": `${(gLv / (all.length * 3)) * 100}%` } as React.CSSProperties}><i /></span>
            </summary>
            <div className="badge-grid">{list.map((b) => <BadgeCard key={b.key} b={b} />)}</div>
          </details>
        );
      })}
    </section>
  );
}

/** Una medaglia con nome, livello, stelline, barra e cosa fare per il prossimo livello */
function BadgeCard({ b }: { b: Badge }) {
  const { t, lang } = useT();
  // badge segreto non ancora scoperto: niente nome né disegno
  const hidden = b.secret && b.level === 0;
  const next = b.levels[Math.min(b.level, 2)];
  const prev = b.level === 0 ? 0 : b.levels[b.level - 1];
  // barra: avanzamento dal livello attuale al prossimo
  const pct = b.level === 3 ? 100 : Math.max(0, Math.min(100, ((b.value - prev) / Math.max(1, next - prev)) * 100));
  return (
    <div className={`badge-card lv${b.level}`} title={hidden ? t("secretHow") : howText(b, lang)}>
      <Medal art={hidden ? BADGE_ART.secret : b.art} tint={hidden ? "#2b2f36" : b.tint} level={b.level} />
      <div className="badge-txt">
        <b>{hidden ? "???" : b.name[lang]}</b>
        <span className="badge-lvl">
          <span className="stars" aria-hidden="true">{[1, 2, 3].map((i) => <i key={i} className={i <= b.level ? "on" : ""}>★</i>)}</span>
          {t(LEVEL_KEY[b.level])}
        </span>
        <div className="progress" style={{ "--w": `${pct}%` } as React.CSSProperties}><i /></div>
        <small>{hidden ? t("secretHow") : b.level === 3 ? t("badgeDone") : `${howText(b, lang)} · ${Math.min(b.value, next)}/${next}`}</small>
      </div>
    </div>
  );
}

/** Medaglia rotonda: fondo colorato, disegno, bordo del colore del livello */
export function Medal({ art, tint, level, size = 64 }: { art: string; tint: string; level: number; size?: number }) {
  return (
    <span className={`medal lv${level}`} style={{ "--tint": tint, width: size, height: size } as React.CSSProperties}>
      {/* Disegno costante scritto da noi (nessun testo dell'utente): sicuro da inserire così */}
      <svg viewBox="0 0 100 100" aria-hidden="true" dangerouslySetInnerHTML={{ __html: art }} />
    </span>
  );
}
