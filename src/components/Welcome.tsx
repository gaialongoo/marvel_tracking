// Benvenuto - mini guida in 3 schede al primo accesso
// 1. scegli universo e ordine   2. segna i visti e vota   3. amici e badge
// Si sfoglia con Avanti/Indietro (o le frecce della tastiera), si chiude con
// «Salta», con Esc o con «Inizia» nell'ultima scheda.
// Una volta chiusa non riappare: lo ricorda il profilo (introDone), quindi
// vale su tutti i dispositivi. Dal Profilo «Rivedi la guida» la riapre.
import { useEffect, useState } from "react";
import { DOOR_COLOR, DOOR_SYMBOL } from "../data/universeArt";
import { useT } from "../i18n";
import { setProfile, useStore } from "../store";
import { Avatar } from "./Avatar";
import { Gem } from "./Gem";
import { IconBookmark, IconCheck } from "./Icons";

/** Testi delle schede (italiano e inglese) */
const STEPS = {
  it: [
    { h: "Scegli da dove partire", p: "Nel Catalogo trovi tutto l'universo Marvel diviso per universi (MCU, X-Men, Sony…). Puoi vederlo in ordine di uscita, cronologico, per Fase o seguire un percorso su un personaggio. Le tue scelte preferite si salvano nel Profilo." },
    { h: "Segna e vota", p: "Tocca la spunta per segnare un titolo come visto (nelle serie anche episodio per episodio) e dagli un voto da 1 a 6 Gemme dell'Infinito. Con il segnalibro lo metti nella lista «Da vedere». In Home trovi sempre il prossimo da guardare." },
    { h: "Amici e badge", p: "Scegli un @tag nel Profilo per farti trovare dagli amici e confrontare cosa avete visto. Ogni titolo visto ti fa salire di livello nei badge: prova a prenderli tutti d'oro!" },
  ],
  en: [
    { h: "Pick where to start", p: "The Catalogue holds the whole Marvel universe, split by universe (MCU, X-Men, Sony…). View it in release or chronological order, by Phase, or follow a character's path. Your favourite settings are saved in your Profile." },
    { h: "Check off and rate", p: "Tap the tick to mark a title as watched (series episode by episode, too) and rate it from 1 to 6 Infinity Stones. The bookmark adds it to your watchlist. Home always shows what to watch next." },
    { h: "Friends and badges", p: "Pick an @tag in your Profile so friends can find you and compare what you've watched. Every title you watch levels up your badges: try to get them all gold!" },
  ],
};

/** Disegnino in cima a ogni scheda, fatto con i pezzi dell'app */
function Art({ step }: { step: number }) {
  if (step === 0) return (
    <div className="wl-doors">
      {["mcu", "xmen", "sony"].map((k) => (
        <div key={k} className="wl-door" style={{ background: DOOR_COLOR[k] }}>
          <svg viewBox="0 0 100 100" aria-hidden="true" dangerouslySetInnerHTML={{ __html: DOOR_SYMBOL[k] ?? "" }} />
        </div>
      ))}
    </div>
  );
  if (step === 1) return (
    <div className="wl-mark">
      <span className="wl-tick"><IconCheck /></span>
      <span className="wl-gems">{[0, 1, 2, 3, 4, 5].map((i) => <Gem key={i} index={i} on={i < 5} />)}</span>
      <span className="wl-book"><IconBookmark on /></span>
    </div>
  );
  return (
    <div className="wl-friends">
      {["spidey", "ironman", "cap"].map((k) => <Avatar key={k} k={k} size={64} />)}
    </div>
  );
}

export function Welcome() {
  const { t, lang } = useT();
  const { data } = useStore();
  const [step, setStep] = useState(0);
  const show = !data.profile?.introDone;
  const steps = STEPS[lang];
  const last = step === steps.length - 1;

  /** Chiude e ricorda (nel profilo) che la guida è stata vista */
  const close = () => { setProfile({ introDone: true }); setStep(0); };

  // tastiera: frecce per sfogliare, Esc per chiudere
  useEffect(() => {
    if (!show) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") setStep((s) => Math.min(s + 1, steps.length - 1));
      if (e.key === "ArrowLeft") setStep((s) => Math.max(s - 1, 0));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [show, steps.length]);

  if (!show) return null;
  const s = steps[step];
  return (
    <div className="modal-back">
      <div className="modal panel wl" role="dialog" aria-modal="true" aria-labelledby="wl-title">
        <button className="wl-skip" onClick={close}>{t("wlSkip")}</button>
        <div className="wl-art"><Art step={step} /></div>
        <span className="eyebrow">{step + 1}/{steps.length}</span>
        <h2 id="wl-title">{s.h}</h2>
        <p>{s.p}</p>
        <div className="wl-foot">
          {/* pallini: dove sei, e cliccabili per saltare a una scheda */}
          <div className="wl-dots">
            {steps.map((_, i) => (
              <button key={i} className={i === step ? "on" : ""} onClick={() => setStep(i)} aria-label={`${i + 1}`} />
            ))}
          </div>
          <div className="wl-btns">
            {step > 0 && <button className="btn" onClick={() => setStep(step - 1)}>{t("wlBack")}</button>}
            <button className="btn primary" onClick={() => (last ? close() : setStep(step + 1))}>{t(last ? "wlStart" : "wlNext")}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
