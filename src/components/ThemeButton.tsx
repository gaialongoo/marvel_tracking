// Pulsante del tema - sole/luna accanto alla lingua (barra in alto, pagina
// di accesso, Privacy). Un clic passa da scuro a chiaro e viceversa.
// La scelta completa (Automatico / Chiaro / Scuro) è nelle preferenze del Profilo.
import { useT } from "../i18n";
import { toggleTheme, useTheme } from "../theme";
import { IconMoon, IconSun } from "./Icons";

export function ThemeButton() {
  const { t } = useT();
  const { resolved } = useTheme();
  // mostra l'icona del tema in cui si passa cliccando
  const label = resolved === "dark" ? t("themeLight") : t("themeDark");
  return (
    <button className="theme-btn" onClick={toggleTheme} title={label} aria-label={label}>
      {resolved === "dark" ? <IconSun /> : <IconMoon />}
    </button>
  );
}
