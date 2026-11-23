/* ============================================================================
   APP — struttura generale: barra in alto + pagina attiva + messaggi.
   La pagina dipende dall'indirizzo (vedi router.ts).
   Tutto è dentro AuthGate: senza aver fatto l'accesso si vede solo la
   pagina di login (vedi components/Auth.tsx).
   ============================================================================ */
import { useEffect, useState } from "react";
import { AuthGate } from "./components/Auth";
import { Detail } from "./components/Detail";
import { Home } from "./components/Home";
import { defaultHome, type HomeState } from "./homeState";
import { Prep } from "./components/Prep";
import { TopBar } from "./components/TopBar";
import { useT } from "./i18n";
import { useRoute } from "./router";
import { useToast } from "./toast";

export default function App() {
  const route = useRoute();
  const { lang } = useT();
  // Scelte della Home tenute qui, così restano uguali tornando da una scheda
  const [home, setHome] = useState<HomeState>(defaultHome);
  const setHomePart = (p: Partial<HomeState>) => setHome((h) => ({ ...h, ...p }));

  // Lingua del documento (per lettori di schermo e sillabazione)
  useEffect(() => { document.documentElement.lang = lang; }, [lang]);

  // Scheda e Preparazione partono dall'alto (la Home ripristina da sola la sua posizione)
  const key = route.page === "title" ? `t-${route.id}` : route.page;
  useEffect(() => { if (route.page !== "home") window.scrollTo(0, 0); }, [key, route.page]);

  return (
    <>
      <AuthGate>
        <TopBar route={route} />
        <main>
          {route.page === "home" && <Home s={home} set={setHomePart} />}
          {route.page === "prep" && <Prep />}
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
