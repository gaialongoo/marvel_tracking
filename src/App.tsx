/* ============================================================================
   APP — struttura generale: barra in alto + pagina attiva + messaggi.
   La pagina dipende dall'indirizzo (vedi router.ts):
   Home (bacheca) · Catalogo · Preparazione · Profilo · Scheda del titolo.
   Tutto è dentro AuthGate: senza aver fatto l'accesso si vede solo la
   pagina di login (vedi components/Auth.tsx).
   ============================================================================ */
import { useEffect, useState } from "react";
import { AuthGate } from "./components/Auth";
import { Detail } from "./components/Detail";
import { Catalog } from "./components/Catalog";
import { Home } from "./components/Home";
import { defaultHome, prefsToHome, type HomeState } from "./homeState";
import { Prep } from "./components/Prep";
import { Profile } from "./components/Profile";
import { TopBar } from "./components/TopBar";
import { useT } from "./i18n";
import { go, useRoute } from "./router";
import { useStore } from "./store";
import { useToast } from "./toast";
import type { TitleType } from "./types";

export default function App() {
  const route = useRoute();
  const { lang } = useT();
  const { loaded, data } = useStore();
  // Scelte del Catalogo tenute qui, così restano uguali tornando da una scheda
  const [home, setHome] = useState<HomeState>(defaultHome);
  const setHomePart = (p: Partial<HomeState>) => setHome((h) => ({ ...h, ...p }));

  // Preferenze di visione del profilo: il Catalogo parte da lì all'accesso
  // e si riallinea quando le cambi nel Profilo
  const { prefUni, prefOrder, prefPath, prefTypes } = data.profile ?? {};
  // i tipi come testo, così l'effetto riparte solo se cambiano davvero
  const typesKey = (prefTypes ?? []).join(",");
  useEffect(() => {
    if (loaded) setHome(prefsToHome({ prefUni, prefOrder, prefPath, prefTypes: typesKey ? (typesKey.split(",") as TitleType[]) : undefined }));
  }, [loaded, prefUni, prefOrder, prefPath, typesKey]);

  /** Dalla Home: apre il Catalogo su un universo (ordine e tipi restano quelli scelti) */
  const openUni = (uni: string) => {
    setHomePart({ uni });
    go({ page: "catalog" });
  };

  /** Dal Profilo: apre il Catalogo sul percorso del personaggio preferito */
  const openPath = (path: string) => {
    setHome({ uni: "all", order: "paths", path, types: [] });
    go({ page: "catalog" });
  };

  // Lingua del documento (per lettori di schermo e sillabazione)
  useEffect(() => { document.documentElement.lang = lang; }, [lang]);

  // Le pagine partono dall'alto (il Catalogo ripristina da solo la sua posizione)
  const key = route.page === "title" ? `t-${route.id}` : route.page;
  useEffect(() => { if (route.page !== "catalog") window.scrollTo(0, 0); }, [key, route.page]);

  return (
    <>
      <AuthGate>
        <TopBar route={route} />
        <main>
          {route.page === "home" && <Home openUni={openUni} />}
          {route.page === "catalog" && <Catalog s={home} set={setHomePart} />}
          {route.page === "prep" && <Prep />}
          {route.page === "profile" && <Profile openPath={openPath} />}
          {/* key: cambiando titolo la scheda riparte pulita (tab, spoiler chiusi) */}
          {route.page === "title" && <Detail key={route.id} id={route.id} />}
        </main>
      </AuthGate>
      <Toast />
    </>
  );
}

/** Messaggio temporaneo in basso */
function Toast() {
  const msg = useToast();
  return <div className={`toast${msg ? " on" : ""}${msg?.error ? " err" : ""}`}>{msg?.text}</div>;
}
