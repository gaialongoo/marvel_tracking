/// <reference types="vite/client" />

// Variabili d'ambiente usate dall'app (vedi .env.example)
interface ImportMetaEnv {
  readonly VITE_API_URL?: string; // indirizzo del backend (worker/), es. https://api.marveltracker.com
}
