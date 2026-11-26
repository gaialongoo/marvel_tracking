/// <reference types="vite/client" />

// Variabili d'ambiente usate dall'app (vedi .env.example)
interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_PUBLISHABLE_KEY?: string;
}
