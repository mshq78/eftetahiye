/**
 * Optional server sync (Vercel function + Neon). localStorage stays the
 * source the UI reads synchronously; the server is hydrated on startup and
 * receives debounced writes. If the API is missing (e.g. plain `vite dev`)
 * everything silently falls back to localStorage only.
 */

const API_URL = '/api/state';
const TOKEN_KEY = 'bootcamp_deck_admin_token';
const DEBOUNCE_MS = 800;

let pending: Record<string, unknown> = {};
let timer: ReturnType<typeof setTimeout> | null = null;
let remoteEnabled = true;

function getToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

/** Load server state into localStorage. Resolves quickly even if offline. */
export async function hydrateFromServer(storageKeys: string[]): Promise<void> {
  try {
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), 4000);
    const res = await fetch(API_URL, { signal: controller.signal, cache: 'no-store' });
    clearTimeout(t);
    if (!res.ok) {
      remoteEnabled = false;
      return;
    }
    const data = (await res.json()) as { entries?: Record<string, unknown> };
    for (const key of storageKeys) {
      const value = data.entries?.[key];
      if (value !== undefined) localStorage.setItem(key, JSON.stringify(value));
    }
  } catch {
    remoteEnabled = false;
  }
}

async function flush(): Promise<void> {
  timer = null;
  const entries = pending;
  pending = {};
  if (!remoteEnabled || Object.keys(entries).length === 0) return;

  let token = getToken();
  for (let attempt = 0; attempt < 2; attempt++) {
    if (!token) {
      token = window.prompt('برای ذخیرهٔ دائمی روی سرور، رمز مدیریت را وارد کنید (انصراف = فقط ذخیره در همین مرورگر):');
      if (!token) {
        remoteEnabled = false;
        return;
      }
    }
    try {
      const res = await fetch(API_URL, {
        method: 'PUT',
        headers: { 'content-type': 'application/json', 'x-admin-token': token },
        body: JSON.stringify({ entries }),
      });
      if (res.status === 401) {
        token = null;
        try {
          localStorage.removeItem(TOKEN_KEY);
        } catch {
          // ignore
        }
        continue;
      }
      if (res.ok) {
        try {
          localStorage.setItem(TOKEN_KEY, token);
        } catch {
          // ignore
        }
      } else {
        console.warn('Remote save failed:', res.status);
      }
      return;
    } catch (err) {
      console.warn('Remote save failed:', err);
      return;
    }
  }
}

/** Queue a value for the server (debounced, batched). */
export function queueRemoteSave(key: string, value: unknown) {
  if (!remoteEnabled) return;
  pending[key] = value;
  if (timer) clearTimeout(timer);
  timer = setTimeout(flush, DEBOUNCE_MS);
}
