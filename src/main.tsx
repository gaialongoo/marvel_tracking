/* ============================================================================
   PUNTO DI INGRESSO — monta l'app React nella pagina (index.html → #root)
   ============================================================================ */
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// Font inclusi nell'app (prima arrivavano da Google Fonts: così il browser
// non contatta server esterni, vedi la pagina Privacy)
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/ibm-plex-mono/500.css";
import "@fontsource/ibm-plex-mono/600.css";
import "./styles.css";
import { rememberInvite } from "./share";
import { applyTheme } from "./theme";

// Tema chiaro/scuro subito, prima di disegnare (niente lampo di colore sbagliato)
applyTheme();
import App from "./App.tsx";

// Se si arriva da un link di invito (#/u/<tag>) lo ricordo subito, prima
// che l'accesso o la conferma dell'email cambino l'indirizzo
rememberInvite();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
