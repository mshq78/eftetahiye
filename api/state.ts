import { neon } from '@neondatabase/serverless';

/**
 * Key/value persistence for the deck state, backed by Neon Postgres.
 *
 *   GET /api/state  -> { entries: { [key]: json } }        (public, read-only)
 *   PUT /api/state  -> body { entries: { [key]: json } }   (requires x-admin-token)
 *
 * Env: DATABASE_URL (set by the Vercel Neon integration), ADMIN_TOKEN.
 */

const ALLOWED_KEYS = new Set([
  'bootcamp_deck_current_config',
  'bootcamp_deck_saved_events',
  'bootcamp_deck_active_id',
  'bootcamp_deck_master_team_roster',
]);

let tableReady: Promise<unknown> | null = null;

function getSql() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error('DATABASE_URL is not configured');
  return neon(url);
}

function ensureTable(sql: ReturnType<typeof getSql>) {
  if (!tableReady) {
    tableReady = sql`
      CREATE TABLE IF NOT EXISTS deck_state (
        key text PRIMARY KEY,
        value jsonb NOT NULL,
        updated_at timestamptz NOT NULL DEFAULT now()
      )
    `.catch((err) => {
      tableReady = null;
      throw err;
    });
  }
  return tableReady;
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  });
}

export default {
  async fetch(request: Request): Promise<Response> {
    try {
      const sql = getSql();
      await ensureTable(sql);

      if (request.method === 'GET') {
        const rows = (await sql`SELECT key, value FROM deck_state`) as { key: string; value: unknown }[];
        const entries: Record<string, unknown> = {};
        for (const row of rows) {
          if (ALLOWED_KEYS.has(row.key)) entries[row.key] = row.value;
        }
        return json({ entries });
      }

      if (request.method === 'PUT') {
        const adminToken = process.env.ADMIN_TOKEN;
        if (!adminToken) return json({ error: 'ADMIN_TOKEN is not configured' }, 503);
        if (request.headers.get('x-admin-token') !== adminToken) {
          return json({ error: 'Unauthorized' }, 401);
        }

        const body = (await request.json()) as { entries?: Record<string, unknown> };
        const entries = Object.entries(body?.entries ?? {}).filter(([k]) => ALLOWED_KEYS.has(k));
        if (entries.length === 0) return json({ error: 'No valid entries' }, 400);

        await sql.transaction(
          entries.map(
            ([key, value]) => sql`
              INSERT INTO deck_state (key, value, updated_at)
              VALUES (${key}, ${JSON.stringify(value)}::jsonb, now())
              ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now()
            `,
          ),
        );
        return json({ ok: true, saved: entries.length });
      }

      return json({ error: 'Method not allowed' }, 405);
    } catch (err) {
      console.error('api/state error:', err);
      return json({ error: 'Server error' }, 500);
    }
  },
};
