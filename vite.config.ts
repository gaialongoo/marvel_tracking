// Configurazione di Vite (lo strumento che avvia e impacchetta l'app)
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // Percorsi relativi: l'app funziona sia in locale sia su GitHub Pages
  // (dove sta in una sottocartella, es. /marvel_tracking/)
  base: "./",
});
