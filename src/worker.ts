// OpenTAO Worker — fronts the static `dist/` asset bundle and serves a
// taostats API proxy at /api/subnet/[netuid]. Everything else falls through
// to the ASSETS binding (configured in wrangler.toml).

interface Env {
  ASSETS: Fetcher;
  TAOSTATS_KEY?: string;
}

const TAOSTATS_BASE = 'https://api.taostats.io';
const CACHE_TTL_SECONDS = 60;

const corsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, OPTIONS',
  'access-control-allow-headers': 'content-type',
};

async function fetchTaostats(path: string, key: string): Promise<unknown> {
  const r = await fetch(`${TAOSTATS_BASE}${path}`, {
    headers: { Authorization: key },
  });
  if (!r.ok) {
    return { _error: `taostats ${path} → ${r.status}`, _status: r.status };
  }
  return await r.json();
}

async function handleSubnet(netuid: string, env: Env): Promise<Response> {
  if (!env.TAOSTATS_KEY) {
    return Response.json(
      { error: 'TAOSTATS_KEY not configured on the Worker. Set via `wrangler secret put TAOSTATS_KEY`.' },
      { status: 503, headers: corsHeaders },
    );
  }
  if (!/^\d+$/.test(netuid)) {
    return Response.json({ error: 'invalid netuid' }, { status: 400, headers: corsHeaders });
  }

  const [pool, regCost, meta] = await Promise.all([
    fetchTaostats(`/api/dtao/pool/latest/v1?netuid=${netuid}`, env.TAOSTATS_KEY),
    fetchTaostats(`/api/subnet/registration_cost/latest/v1?netuid=${netuid}`, env.TAOSTATS_KEY),
    fetchTaostats(`/api/metagraph/latest/v1?netuid=${netuid}&limit=512`, env.TAOSTATS_KEY),
  ]);

  // Best-effort summary the page actually consumes. Raw upstream payloads are
  // included verbatim under `_raw` for agents that want everything.
  // Note: taostats returns several fields as strings ("0", "true", "1.234e9");
  // coerce defensively.
  const truthy = (v: unknown) => v === true || v === 'true' || v === 1 || v === '1';

  const metaAny = meta as { data?: Array<Record<string, unknown>> } | null;
  const rows = Array.isArray(metaAny?.data) ? metaAny!.data! : [];
  const registeredCount = rows.length || null;
  const validatorCount = rows.filter((n) => truthy(n.validator_permit)).length || null;
  // "Miners" = all non-validator UIDs registered on this subnet (slot pressure
  // signal). The `active` flag from taostats reflects neuron reachability and
  // is much narrower — we surface that separately as `currently_serving`.
  const minerCount = registeredCount != null && validatorCount != null
    ? registeredCount - validatorCount
    : null;
  const currentlyServing = rows.filter((n) => truthy(n.active)).length;

  const poolAny = pool as { data?: Array<Record<string, unknown>> } | null;
  const poolRow = Array.isArray(poolAny?.data) ? poolAny!.data![0] : undefined;
  // `price` on the dTao pool endpoint is the α token's price in TAO (NOT in
  // USD). A TAO→USD conversion would need a second call; for v1 we surface
  // the raw α-price-in-TAO and let the page format honestly.
  const alphaPriceTao = poolRow?.price != null ? Number(poolRow.price) : null;
  const marketCapRao = poolRow?.market_cap != null ? Number(poolRow.market_cap) : null;
  // marketCapRao is in RAO of the α token — convert to display TAO
  const marketCapTao = marketCapRao != null ? marketCapRao / 1e9 : null;

  const regAny = regCost as { data?: Array<Record<string, unknown>> } | null;
  const regRow = Array.isArray(regAny?.data) ? regAny!.data![0] : undefined;
  // Field is `registration_cost`, denominated in RAO (1 τ = 1e9 RAO).
  const burnRaw = regRow?.registration_cost ?? regRow?.cost;
  const burnCostTao = burnRaw != null ? Number(burnRaw) / 1e9 : null;

  const summary = {
    netuid: Number(netuid),
    fetched_at: new Date().toISOString(),
    cache_ttl_s: CACHE_TTL_SECONDS,
    alpha_price_tao: alphaPriceTao,
    market_cap_tao: marketCapTao,
    burn_cost_tao: burnCostTao,
    miner_count: minerCount,
    validator_count: validatorCount,
    currently_serving: currentlyServing,
    registered_count: registeredCount,
    _raw: { pool, registration_cost: regCost, metagraph: meta },
  };

  return new Response(JSON.stringify(summary, null, 2), {
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': `public, s-maxage=${CACHE_TTL_SECONDS}`,
      ...corsHeaders,
    },
  });
}

export default {
  async fetch(req: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(req.url);

    // CORS preflight
    if (req.method === 'OPTIONS' && url.pathname.startsWith('/api/')) {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    // Taostats proxy at /api/subnet/[netuid]
    const subnetMatch = url.pathname.match(/^\/api\/subnet\/(\d+)\/?$/);
    if (subnetMatch) {
      // Edge cache
      const cache = caches.default;
      const cacheKey = new Request(url.toString(), { method: 'GET' });
      const hit = await cache.match(cacheKey);
      if (hit) return hit;

      const fresh = await handleSubnet(subnetMatch[1], env);
      ctx.waitUntil(cache.put(cacheKey, fresh.clone()));
      return fresh;
    }

    // 404 JSON for any other /api/* miss — don't fall through to the SPA 404
    if (url.pathname.startsWith('/api/')) {
      return Response.json({ error: 'not found' }, { status: 404, headers: corsHeaders });
    }

    // Everything else → static assets
    return env.ASSETS.fetch(req);
  },
};
