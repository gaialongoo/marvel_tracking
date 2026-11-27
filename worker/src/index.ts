// ============================================================================
// MARVEL TRACKER — backend (Cloudflare Worker) su api.marveltracker.com
//
// Sta in mezzo tra il sito e Supabase:
// - il sito chiama SOLO questi indirizzi (/login, /data, /friends…) e non
//   conosce né l'indirizzo né la chiave di Supabase, né i nomi delle tabelle;
// - la chiave di Supabase è un segreto del Worker (wrangler secret put);
// - la sessione sta in due cookie "httpOnly": il JavaScript della pagina non
//   li può leggere, li manda il browser da solo a ogni richiesta;
// - il Worker parla con Supabase COME l'utente (con il suo token): le regole
//   RLS di supabase/schema.sql restano attive come seconda barriera.
//
// Ogni risposta è JSON. In caso di errore: { error: "codice" } con lo stato
// HTTP adatto; i codici li traduce l'app (src/auth.ts, src/friends.ts…).
// ============================================================================

/** Variabili del Worker: segreti (SUPABASE_*) e impostazioni (wrangler.toml) */
interface Env {
  SUPABASE_URL: string;    // segreto: indirizzo del progetto Supabase
  SUPABASE_KEY: string;    // segreto: chiave "publishable" del progetto
  ALLOWED_ORIGINS: string; // siti che possono chiamare il backend, separati da virgola
}

/** JSON restituito da Supabase o mandato dall'app: forma libera, controllata a mano dove serve */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Json = any;

/** Sessione dell'utente (dai cookie) */
interface Session {
  at: string;       // access token (JWT, dura circa un'ora)
  rt: string;       // refresh token (serve per averne uno nuovo)
  uid: string;      // id dell'utente (dentro il JWT)
  fresh?: Tokens;   // token appena rinnovati: vanno rimessi nei cookie
}

/** Token restituiti da Supabase dopo accesso, conferma o rinnovo */
interface Tokens { access_token: string; refresh_token: string; expires_in: number; user?: { id: string; email?: string } }

// ---------------------------------------------------------------------------
// Regole di formato (gli stessi controlli dell'app e del database)
// ---------------------------------------------------------------------------
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
const HANDLE_RE = /^[a-z0-9_]{3,20}$/;
const REASONS = ["handle", "name", "bio", "spam", "other"];
/** Dimensione massima di una richiesta (i dati di un utente sono pochi KB) */
const MAX_BODY = 256 * 1024;
/** Codici di PostgREST/Postgres che vogliono dire "tabella non ancora creata" */
const MISSING = ["42P01", "PGRST205", "42703"];

// Nomi dei cookie (brevi e generici: non dicono niente su cosa c'è dietro)
const C_AT = "mt_s";
const C_RT = "mt_r";
/** Il refresh token resta per 30 giorni (si rinnova a ogni uso) */
const RT_MAX_AGE = 30 * 24 * 3600;

// ---------------------------------------------------------------------------
// Risposte
// ---------------------------------------------------------------------------

/** Risposta JSON (headers = intestazioni in più, es. i cookie) */
function json(body: unknown, status = 200, headers: [string, string][] = []): Response {
  const h = new Headers({ "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" });
  for (const [k, v] of headers) h.append(k, v);
  return new Response(JSON.stringify(body), { status, headers: h });
}
const fail = (error: string, status = 400) => json({ error }, status);

/** Errore lanciato dentro le funzioni e trasformato in risposta */
class HttpError extends Error {
  constructor(public code: string, public status = 400) { super(code); }
}

// ---------------------------------------------------------------------------
// Cookie della sessione
// ---------------------------------------------------------------------------

/** Legge un cookie dalla richiesta */
function cookie(req: Request, name: string): string | null {
  const all = req.headers.get("Cookie") || "";
  for (const part of all.split(/;\s*/)) {
    const i = part.indexOf("=");
    if (i > 0 && part.slice(0, i) === name) return decodeURIComponent(part.slice(i + 1));
  }
  return null;
}

/**
 * Intestazione Set-Cookie. httpOnly = invisibile al JavaScript della pagina;
 * Secure = solo https (localhost va bene lo stesso); SameSite=Lax = un altro
 * sito non può usarli per fare richieste a nome tuo.
 */
const setCookie = (name: string, value: string, maxAge: number): [string, string] =>
  ["Set-Cookie", `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=${maxAge}; HttpOnly; Secure; SameSite=Lax`];

/** Cookie per una sessione nuova o rinnovata */
const sessionCookies = (t: Tokens): [string, string][] => [
  setCookie(C_AT, t.access_token, Math.max(60, t.expires_in - 30)),
  setCookie(C_RT, t.refresh_token, RT_MAX_AGE),
];
/** Cookie che cancellano la sessione (uscita, account eliminato, sessione scaduta) */
const clearCookies = (): [string, string][] => [setCookie(C_AT, "", 0), setCookie(C_RT, "", 0)];

/** Legge il contenuto di un JWT (senza verificarlo: lo verifica Supabase a ogni chiamata) */
function jwtPayload(token: string): { sub?: string; exp?: number } | null {
  try {
    const b64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(b64 + "=".repeat((4 - (b64.length % 4)) % 4)));
  } catch { return null; }
}

// ---------------------------------------------------------------------------
// Chiamate a Supabase
// ---------------------------------------------------------------------------

/** Chiamata grezza a Supabase con la chiave del progetto (e il token dell'utente, se c'è) */
async function sb(env: Env, path: string, init: { method?: string; body?: unknown; token?: string; prefer?: string; ip?: string | null } = {}) {
  const headers: Record<string, string> = { apikey: env.SUPABASE_KEY, "Content-Type": "application/json" };
  if (init.token) headers.Authorization = `Bearer ${init.token}`;
  if (init.prefer) headers.Prefer = init.prefer;
  // IP di chi usa il sito: così i limiti anti-abuso di Supabase valgono per
  // persona e non per il Worker (che fa da tramite per tutti)
  if (init.ip) headers["X-Forwarded-For"] = init.ip;
  const res = await fetch(env.SUPABASE_URL.replace(/\/+$/, "") + path, {
    method: init.method || "GET", headers,
    body: init.body === undefined ? undefined : JSON.stringify(init.body),
  });
  const text = await res.text();
  let data: Json = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = null; }
  return { ok: res.ok, status: res.status, data };
}

/**
 * Chiamata alle tabelle (PostgREST) come l'utente collegato.
 * Lancia HttpError con un codice semplice se qualcosa va storto.
 */
async function db(env: Env, s: Session, path: string, init: { method?: string; body?: unknown; prefer?: string } = {}) {
  const r = await sb(env, "/rest/v1/" + path, { ...init, token: s.at });
  if (!r.ok) {
    const code: string = r.data?.code || "";
    if (MISSING.includes(code)) throw new HttpError("missing", 503);
    if (code === "23505") throw new HttpError("duplicate", 409);   // c'è già (vincolo "unico")
    if (r.status === 401) throw new HttpError("session", 401);     // token non più valido
    throw new HttpError("db", 502);
  }
  return r.data;
}

/** Codice d'errore di Supabase Auth, ridotto a quelli che l'app conosce */
function authErr(r: { status: number; data: Json }): Response {
  const code: string = r.data?.error_code || r.data?.code || (r.status === 429 ? "over_request_rate_limit" : "auth");
  return fail(String(code).slice(0, 60), r.status >= 400 && r.status < 600 ? r.status : 400);
}

// ---------------------------------------------------------------------------
// Sessione
// ---------------------------------------------------------------------------

/**
 * Sessione dell'utente dai cookie. Se il token è scaduto (o sta per
 * scadere) lo rinnova con il refresh token. null = nessuna sessione valida.
 */
async function getSession(req: Request, env: Env): Promise<Session | null> {
  const at = cookie(req, C_AT);
  const rt = cookie(req, C_RT);
  const p = at ? jwtPayload(at) : null;
  // token ancora buono per almeno un minuto
  if (at && rt && p?.sub && p.exp && p.exp * 1000 > Date.now() + 60_000) return { at, rt, uid: p.sub };
  if (!rt) return null;
  const r = await sb(env, "/auth/v1/token?grant_type=refresh_token", { method: "POST", body: { refresh_token: rt }, ip: clientIp(req) });
  if (!r.ok || !r.data?.access_token) return null;
  const t = r.data as Tokens;
  const sub = jwtPayload(t.access_token)?.sub;
  return sub ? { at: t.access_token, rt: t.refresh_token, uid: sub, fresh: t } : null;
}

/** IP di chi fa la richiesta (Cloudflare lo mette in questa intestazione) */
const clientIp = (req: Request) => req.headers.get("CF-Connecting-IP");

/** Legge il corpo JSON della richiesta (con un limite di dimensione) */
async function body(req: Request): Promise<Json> {
  const text = await req.text();
  if (text.length > MAX_BODY) throw new HttpError("too_big", 413);
  try { return text ? JSON.parse(text) : {}; } catch { throw new HttpError("bad_json"); }
}

/** Stringa di al massimo n caratteri, oppure null */
const str = (v: unknown, n: number) => (typeof v === "string" && v.trim() ? v.trim().slice(0, n) : null);

/** Scheda pubblica di una persona (come la vede la ricerca amici) */
const PERSON = "user_id,handle,name,avatar";
const person = (c: Json) => ({ id: c.user_id, handle: c.handle, name: c.name ?? null, avatar: c.avatar ?? null });

// ---------------------------------------------------------------------------
// Accesso e account (non serve essere collegati)
// ---------------------------------------------------------------------------

/** Utente da restituire all'app: solo id ed email */
const userOut = (u: Json) => ({ id: u?.id, email: u?.email ?? null });

async function login(req: Request, env: Env) {
  const b = await body(req);
  const email = str(b.email, 320), password = typeof b.password === "string" ? b.password : "";
  if (!email || !password) return fail("invalid_credentials");
  const r = await sb(env, "/auth/v1/token?grant_type=password", {
    method: "POST", ip: clientIp(req),
    body: { email, password, gotrue_meta_security: { captcha_token: str(b.captcha, 4096) ?? undefined } },
  });
  if (!r.ok) return authErr(r);
  return json({ user: userOut(r.data.user) }, 200, sessionCookies(r.data));
}

async function signup(req: Request, env: Env) {
  const b = await body(req);
  const email = str(b.email, 320), password = typeof b.password === "string" ? b.password : "";
  if (!email || !password) return fail("validation_failed");
  const r = await sb(env, "/auth/v1/signup", {
    method: "POST", ip: clientIp(req),
    body: { email, password, gotrue_meta_security: { captcha_token: str(b.captcha, 4096) ?? undefined } },
  });
  if (!r.ok) return authErr(r);
  // Email già registrata e confermata: per privacy Supabase non dà errore ma
  // restituisce un utente senza "identities"
  const u = r.data?.user ?? r.data;
  if (u && Array.isArray(u.identities) && u.identities.length === 0) return fail("user_already_exists", 422);
  // Con la conferma via email attiva non arriva nessuna sessione: serve il link
  if (r.data?.access_token) return json({ user: userOut(r.data.user), needsConfirm: false }, 200, sessionCookies(r.data));
  return json({ needsConfirm: true });
}

async function reset(req: Request, env: Env) {
  const b = await body(req);
  const email = str(b.email, 320);
  if (!email) return fail("validation_failed");
  const r = await sb(env, "/auth/v1/recover", {
    method: "POST", ip: clientIp(req),
    body: { email, gotrue_meta_security: { captcha_token: str(b.captcha, 4096) ?? undefined } },
  });
  return r.ok ? json({ ok: true }) : authErr(r);
}

/**
 * Link delle email (conferma account o nuova password): l'app manda il
 * codice che trova nell'indirizzo, qui lo verifico e apro la sessione.
 */
async function verify(req: Request, env: Env) {
  const b = await body(req);
  const type = b.type === "recovery" ? "recovery" : b.type === "email" || b.type === "signup" ? "email" : null;
  const tokenHash = str(b.token_hash, 200);
  if (!type || !tokenHash) return fail("otp_expired");
  const r = await sb(env, "/auth/v1/verify", { method: "POST", ip: clientIp(req), body: { type, token_hash: tokenHash } });
  if (!r.ok || !r.data?.access_token) return authErr(r.ok ? { status: 400, data: { error_code: "otp_expired" } } : r);
  return json({ user: userOut(r.data.user), recovery: type === "recovery" }, 200, sessionCookies(r.data));
}

// ---------------------------------------------------------------------------
// Indirizzi del backend
// ---------------------------------------------------------------------------

/**
 * Tutte le funzioni che richiedono di essere collegati.
 * s = sessione valida; m = metodo; parts = pezzi dell'indirizzo.
 */
async function withUser(req: Request, env: Env, s: Session, m: string, parts: string[]): Promise<Response> {
  const [a, b, c] = parts;
  const me = s.uid;

  // --- account ---
  if (a === "me" && m === "GET") {
    const r = await sb(env, "/auth/v1/user", { token: s.at });
    if (!r.ok) throw new HttpError("session", 401);
    return json({ user: userOut(r.data) });
  }
  if (a === "password" && m === "POST") {
    const bd = await body(req);
    if (typeof bd.password !== "string") return fail("weak_password", 422);
    const r = await sb(env, "/auth/v1/user", { method: "PUT", token: s.at, body: { password: bd.password }, ip: clientIp(req) });
    return r.ok ? json({ ok: true }) : authErr(r);
  }
  if (a === "logout" && m === "POST") {
    await sb(env, "/auth/v1/logout?scope=local", { method: "POST", token: s.at });
    return json({ ok: true }, 200, clearCookies());
  }
  if (a === "account" && m === "DELETE") {
    const r = await sb(env, "/rest/v1/rpc/delete_my_account", { method: "POST", token: s.at, body: {} });
    if (!r.ok) return fail(r.data?.code === "PGRST202" ? "missing" : "db", r.data?.code === "PGRST202" ? 503 : 502);
    return json({ ok: true }, 200, clearCookies());
  }

  // --- i miei dati (visti, voti, episodi, profilo) ---
  if (a === "data" && !b) {
    if (m === "GET") {
      const rows = await db(env, s, `progress?select=data&user_id=eq.${me}`);
      return json({ data: rows?.[0]?.data ?? null });
    }
    if (m === "PUT") {
      const bd = await body(req);
      const d = bd.data;
      if (!d || typeof d !== "object" || typeof d.seen !== "object" || typeof d.rating !== "object") return fail("bad_data");
      await db(env, s, "progress", { method: "POST", prefer: "resolution=merge-duplicates,return=minimal",
        body: { user_id: me, data: d, updated_at: new Date().toISOString() } });
      return json({ ok: true });
    }
  }

  // --- il mio @tag ---
  if (a === "handle" && !b) {
    if (m === "GET") {
      const rows = await db(env, s, `handles?select=handle&user_id=eq.${me}`);
      return json({ handle: rows?.[0]?.handle ?? null });
    }
    if (m === "PUT") {
      const bd = await body(req);
      const h = typeof bd.handle === "string" ? bd.handle : "";
      if (!HANDLE_RE.test(h)) return fail("invalid");
      try {
        await db(env, s, "handles", { method: "POST", prefer: "resolution=merge-duplicates,return=minimal",
          body: { user_id: me, handle: h, updated_at: new Date().toISOString(), name: str(bd.name, 30), avatar: str(bd.avatar, 30) } });
      } catch (e) {
        if (e instanceof HttpError && e.code === "duplicate") return fail("taken", 409);
        throw e;
      }
      return json({ ok: true });
    }
  }
  // il tag è libero?
  if (a === "handle" && b === "check" && m === "GET") {
    const h = new URL(req.url).searchParams.get("h") || "";
    if (!HANDLE_RE.test(h)) return fail("invalid");
    const rows = await db(env, s, `handles?select=user_id&handle=eq.${h}`);
    const owner = rows?.[0]?.user_id;
    return json({ status: !owner ? "free" : owner === me ? "mine" : "taken" });
  }
  // nome e avatar accanto al tag (la "scheda pubblica")
  if (a === "card" && m === "PUT") {
    const bd = await body(req);
    await db(env, s, `handles?user_id=eq.${me}`, { method: "PATCH", prefer: "return=minimal",
      body: { name: str(bd.name, 30), avatar: str(bd.avatar, 30) } });
    return json({ ok: true });
  }

  // --- persone ---
  // cerca per inizio del @tag (max 10, me escluso)
  if (a === "search" && m === "GET") {
    const q = (new URL(req.url).searchParams.get("q") || "").toLowerCase().replace(/[^a-z0-9_]/g, "").slice(0, 20);
    if (q.length < 2) return json({ people: [] });
    const rows = await db(env, s, `handles?select=${PERSON}&handle=like.${q}*&user_id=neq.${me}&order=handle&limit=10`);
    return json({ people: (rows ?? []).map(person) });
  }
  // scheda di una persona dal @tag (pagina di un amico / link di invito)
  if (a === "people" && b && !c && m === "GET") {
    if (!HANDLE_RE.test(b)) return json({ person: null });
    const rows = await db(env, s, `handles?select=${PERSON}&handle=eq.${b}`);
    return json({ person: rows?.[0] ? person(rows[0]) : null });
  }

  // --- amici ---
  // situazione completa: amici, richieste ricevute e mandate, bloccati
  if (a === "friends" && !b && m === "GET") {
    const rows: { requester: string; addressee: string; status: string }[] = await db(env, s, "friendships?select=requester,addressee,status");
    // blocchi: se la tabella non c'è ancora la lista resta vuota
    let blockedIds: string[] = [];
    try { blockedIds = ((await db(env, s, "blocks?select=blocked")) ?? []).map((x: Json) => x.blocked); } catch { blockedIds = []; }
    const other = (r: { requester: string; addressee: string }) => (r.requester === me ? r.addressee : r.requester);
    const ids = [...new Set([...rows.map(other), ...blockedIds])];
    const cards: Record<string, ReturnType<typeof person>> = {};
    if (ids.length) {
      const list = await db(env, s, `handles?select=${PERSON}&user_id=in.(${ids.join(",")})`);
      for (const x of list ?? []) cards[x.user_id] = person(x);
    }
    // chi ha tolto il proprio tag compare comunque, con un segnaposto
    const p = (id: string) => cards[id] ?? { id, handle: "?", name: null, avatar: null };
    return json({
      friends: rows.filter((r) => r.status === "accepted").map((r) => p(other(r))),
      incoming: rows.filter((r) => r.status === "pending" && r.addressee === me).map((r) => p(r.requester)),
      outgoing: rows.filter((r) => r.status === "pending" && r.requester === me).map((r) => p(r.addressee)),
      blocked: blockedIds.map(p),
    });
  }
  if (a === "friends" && b) {
    if (!UUID_RE.test(b) || b === me) return fail("bad_id");
    const pair = `or=(and(requester.eq.${me},addressee.eq.${b}),and(requester.eq.${b},addressee.eq.${me}))`;
    // manda una richiesta (se c'era già va bene così)
    if (c === "request" && m === "POST") {
      try { await db(env, s, "friendships", { method: "POST", prefer: "return=minimal", body: { requester: me, addressee: b } }); }
      catch (e) { if (!(e instanceof HttpError && e.code === "duplicate")) throw e; }
      return json({ ok: true });
    }
    // accetta una richiesta ricevuta
    if (c === "accept" && m === "POST") {
      await db(env, s, `friendships?requester=eq.${b}&addressee=eq.${me}`, { method: "PATCH", prefer: "return=minimal", body: { status: "accepted" } });
      return json({ ok: true });
    }
    // rifiuta, ritira o togli l'amicizia
    if (!c && m === "DELETE") {
      await db(env, s, `friendships?${pair}`, { method: "DELETE", prefer: "return=minimal" });
      return json({ ok: true });
    }
    // dati di un amico (null se non siete amici: lo decide la regola RLS)
    if (c === "data" && m === "GET") {
      const rows = await db(env, s, `progress?select=data&user_id=eq.${b}`);
      return json({ data: rows?.[0]?.data ?? null });
    }
  }

  // --- blocchi ---
  if (a === "blocks" && b) {
    if (!UUID_RE.test(b) || b === me) return fail("bad_id");
    if (m === "POST") {
      // bloccare toglie anche l'amicizia o la richiesta
      await db(env, s, `friendships?or=(and(requester.eq.${me},addressee.eq.${b}),and(requester.eq.${b},addressee.eq.${me}))`, { method: "DELETE", prefer: "return=minimal" });
      try { await db(env, s, "blocks", { method: "POST", prefer: "return=minimal", body: { blocker: me, blocked: b } }); }
      catch (e) { if (!(e instanceof HttpError && e.code === "duplicate")) throw e; }
      return json({ ok: true });
    }
    if (m === "DELETE") {
      await db(env, s, `blocks?blocker=eq.${me}&blocked=eq.${b}`, { method: "DELETE", prefer: "return=minimal" });
      return json({ ok: true });
    }
  }

  // --- segnalazioni ---
  if (a === "reports" && m === "POST") {
    const bd = await body(req);
    if (typeof bd.id !== "string" || !UUID_RE.test(bd.id) || bd.id === me) return fail("bad_id");
    if (!REASONS.includes(bd.reason)) return fail("bad_reason");
    await db(env, s, "reports", { method: "POST", prefer: "return=minimal",
      body: { reporter: me, reported: bd.id, reason: bd.reason, note: str(bd.note, 300) } });
    return json({ ok: true });
  }

  return fail("not_found", 404);
}

// ---------------------------------------------------------------------------
// Ingresso del Worker
// ---------------------------------------------------------------------------
export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    // CORS: rispondo solo ai siti in elenco (marveltracker.com e, in locale, localhost)
    const origin = req.headers.get("Origin") || "";
    const allowed = env.ALLOWED_ORIGINS.split(",").map((o) => o.trim()).filter(Boolean);
    const okOrigin = allowed.includes(origin);
    const cors: [string, string][] = okOrigin ? [
      ["Access-Control-Allow-Origin", origin],
      ["Access-Control-Allow-Credentials", "true"],
      ["Vary", "Origin"],
    ] : [];
    const withCors = (res: Response) => { for (const [k, v] of cors) res.headers.set(k, v); return res; };

    // Richiesta "di prova" del browser prima di una chiamata vera
    if (req.method === "OPTIONS") {
      if (!okOrigin) return new Response(null, { status: 403 });
      return withCors(new Response(null, { status: 204, headers: {
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Max-Age": "86400",
      } }));
    }
    // Da un altro sito (o senza Origin) non si fa niente: protegge i cookie
    if (!okOrigin) return fail("forbidden", 403);
    // Le richieste che modificano qualcosa devono essere JSON (un form di un
    // altro sito non può mandarle)
    if (req.method !== "GET" && !(req.headers.get("Content-Type") || "").includes("application/json")) {
      return withCors(fail("bad_content_type", 415));
    }

    const parts = new URL(req.url).pathname.split("/").filter(Boolean);
    try {
      // Pubblici (servono per entrare)
      if (req.method === "POST" && parts.length === 1) {
        if (parts[0] === "login") return withCors(await login(req, env));
        if (parts[0] === "signup") return withCors(await signup(req, env));
        if (parts[0] === "reset") return withCors(await reset(req, env));
        if (parts[0] === "verify") return withCors(await verify(req, env));
      }
      // Tutto il resto richiede la sessione
      const s = await getSession(req, env);
      if (!s) return withCors(json({ error: "session" }, 401, clearCookies()));
      const res = await withUser(req, env, s, req.method, parts);
      // token rinnovati: li rimetto nei cookie (tranne dopo uscita/eliminazione)
      if (s.fresh && !res.headers.has("Set-Cookie")) for (const h of sessionCookies(s.fresh)) res.headers.append(h[0], h[1]);
      return withCors(res);
    } catch (e) {
      if (e instanceof HttpError) {
        const res = fail(e.code, e.status);
        if (e.code === "session") for (const h of clearCookies()) res.headers.append(h[0], h[1]);
        return withCors(res);
      }
      return withCors(fail("server", 500));
    }
  },
};
