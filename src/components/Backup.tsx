// Backup - i dati si salvano già da soli nell'account; qui puoi anche
// scaricarne una copia (.json) e reimportarla. Importare un backup
// sostituisce i dati dell'account (su tutti i dispositivi).
import { useT } from "../i18n";
import { getData, isSavedData, replaceData } from "../store";
import { showToast } from "../toast";
import { IconDown, IconUp } from "./Icons";

export function Backup() {
  const { t } = useT();

  /** Scarica un file marvel-tracker-backup-AAAA-MM-GG.json */
  const exportBackup = () => {
    const payload = { app: "marvel-tracker", version: 1, exported: new Date().toISOString(), ...getData() };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `marvel-tracker-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    showToast(t("exported"));
  };

  /** Legge il file scelto, controlla che sia un nostro backup e chiede conferma */
  const importBackup = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const s = JSON.parse(String(reader.result));
        if (s.app !== "marvel-tracker" || !isSavedData(s)) throw new Error("formato non valido");
        if (!confirm(t("importConfirm"))) return;
        replaceData(s);
        showToast(t("imported"));
      } catch {
        showToast(t("importError"), true);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="panel backup block">
      <div>
        <h2 style={{ marginBottom: 4 }}>{t("backup")}</h2>
        <p>{t("backupSub")}</p>
      </div>
      <div className="actions" style={{ margin: 0 }}>
        <button className="btn" onClick={exportBackup}><IconDown /> {t("exportB")}</button>
        <label className="btn">
          <IconUp /> {t("importB")}
          {/* value svuotato dopo la scelta, così si può riscegliere lo stesso file */}
          <input type="file" accept=".json,application/json" hidden
            onChange={(e) => { const f = e.target.files?.[0]; if (f) importBackup(f); e.target.value = ""; }} />
        </label>
      </div>
    </div>
  );
}
