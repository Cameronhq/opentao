#!/usr/bin/env bun
/**
 * Fetch live chain stats from Taostats and write to src/data/chain-stats.json.
 *
 * Usage:
 *   source ~/.claude/credentials/taostats.env
 *   bun run scripts/fetch-chain-stats.ts
 *
 * On API failure: logs error and exits non-zero WITHOUT overwriting the
 * existing JSON, so the last-known-good snapshot is preserved.
 */

import { writeFileSync, existsSync, readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const OUT_PATH = resolve(__dirname, '..', 'src', 'data', 'chain-stats.json');

const API_KEY = process.env.TAOSTATS_API_KEY;
if (!API_KEY) {
  console.error('[fetch-chain-stats] TAOSTATS_API_KEY env var is not set.');
  console.error('  Source ~/.claude/credentials/taostats.env first, or set the GitHub secret.');
  process.exit(1);
}

const BASE = 'https://api.taostats.io';
const HEADERS = { Authorization: API_KEY, accept: 'application/json' };

// 1 TAO = 10^9 RAO
const RAO_PER_TAO = 1_000_000_000n;

const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

// taostats free tier is ~5 req/min and returns 429 when exceeded. Retry on
// 429/5xx with exponential backoff (honoring Retry-After) so a near-limit burst
// self-heals instead of failing the run.
async function get(path: string): Promise<any> {
  const maxAttempts = 5;
  for (let attempt = 1; ; attempt++) {
    const res = await fetch(`${BASE}${path}`, { headers: HEADERS });
    if (res.ok) return res.json();
    const retryable = res.status === 429 || res.status >= 500;
    if (!retryable || attempt >= maxAttempts) {
      throw new Error(`GET ${path} → ${res.status} ${res.statusText}: ${await res.text().catch(() => '')}`);
    }
    const retryAfter = Number(res.headers.get('retry-after'));
    const waitMs = Number.isFinite(retryAfter) && retryAfter > 0
      ? retryAfter * 1000
      : Math.min(60_000, 15_000 * attempt); // 15s, 30s, 45s, 60s
    console.error(`[fetch-chain-stats] ${path} → ${res.status}, retry ${attempt}/${maxAttempts - 1} in ${Math.round(waitMs / 1000)}s`);
    await sleep(waitMs);
  }
}

function fmtThousands(n: number): string {
  return n.toLocaleString('en-US');
}

/** Format a TAO amount (as a plain number) as "7.42M" / "812K" / "1.2B". */
function fmtTaoCompact(taoUnits: number): string {
  const abs = Math.abs(taoUnits);
  if (abs >= 1e9) return `${(taoUnits / 1e9).toFixed(2)}B`;
  if (abs >= 1e6) return `${(taoUnits / 1e6).toFixed(2)}M`;
  if (abs >= 1e3) return `${(taoUnits / 1e3).toFixed(1)}K`;
  return taoUnits.toFixed(0);
}

/** Convert a stringified RAO amount to TAO as a plain number. */
function raoStrToTao(s: string | number): number {
  // Use BigInt to safely divide, then back to Number for display.
  try {
    const rao = BigInt(String(s).split('.')[0]);
    // Get TAO with 2 decimals of precision: multiply, divide, then /100.
    const taoTimes100 = rao * 100n / RAO_PER_TAO;
    return Number(taoTimes100) / 100;
  } catch {
    return 0;
  }
}

async function main() {
  console.log('[fetch-chain-stats] querying Taostats...');

  // ---- 1. latest chain stats: subnets count + total TAO staked
  const statsLatest = await get('/api/stats/latest/v1');
  const latest = statsLatest?.data?.[0];
  if (!latest) throw new Error('Empty response from /api/stats/latest/v1');

  const subnetTotal: number = Number(latest.subnets);
  const taoStakedNow = raoStrToTao(latest.staked);

  // ---- 2. historical chain stats: pull ~32 daily points to compute 30d delta
  const histRes = await get('/api/stats/history/v1?frequency=by_day&page=1&limit=35&order=block_number_desc');
  const histRows: any[] = histRes?.data ?? [];
  const oldest = histRows[histRows.length - 1];
  const subnets30dAgo = oldest ? Number(oldest.subnets) : subnetTotal;
  const subnetDelta = subnetTotal - subnets30dAgo;

  // ---- 3. subnet list: aggregate neuron counts across subnets
  //
  // Taostats fields per subnet:
  //   active_miners      — pure miners (mining only)
  //   active_dual        — nodes doing both miner + validator roles
  //   active_validators  — pure validators
  //   active_keys        — all live registered neurons (miners + validators + dual + others)
  //
  // "Active miners" on the landing page = active_miners + active_dual
  //   (anyone actually producing miner work).
  // The miner caption surfaces active_keys ("X active neurons across N subnets")
  // so the reader sees overall network scale, not just the strict miner subset.
  const subnetList = await get('/api/subnet/latest/v1?limit=1024');
  const subnetRows: any[] = subnetList?.data ?? [];

  let activeMinersSum = 0;
  let activeDualSum = 0;
  let activeValidatorsSum = 0;
  let activeKeysSum = 0;
  for (const row of subnetRows) {
    activeMinersSum     += Number(row.active_miners     ?? 0);
    activeDualSum       += Number(row.active_dual       ?? 0);
    activeValidatorsSum += Number(row.active_validators ?? 0);
    activeKeysSum       += Number(row.active_keys       ?? 0);
  }
  const minersTotal = activeMinersSum + activeDualSum;

  // ---- 4. notional USD (rough): try the TAO price endpoint, fallback to omit
  let notionalText: string | null = null;
  try {
    const priceRes = await get('/api/price/latest/v1?asset=tao');
    const price = Number(priceRes?.data?.[0]?.price ?? 0);
    if (price > 0) {
      const notionalUsd = taoStakedNow * price;
      // Compact USD: e.g. "$3.1B"
      const abs = Math.abs(notionalUsd);
      let txt: string;
      if (abs >= 1e9) txt = `$${(notionalUsd / 1e9).toFixed(1)}B`;
      else if (abs >= 1e6) txt = `$${(notionalUsd / 1e6).toFixed(1)}M`;
      else txt = `$${notionalUsd.toFixed(0)}`;
      notionalText = `~${txt} notional`;
    }
  } catch (e) {
    console.warn('[fetch-chain-stats] price lookup failed, skipping notional:', (e as Error).message);
  }

  // ---- assemble output
  const out = {
    fetchedAt: new Date().toISOString(),
    subnets: {
      total: subnetTotal,
      totalText: fmtThousands(subnetTotal),
      deltaText: subnetDelta > 0
        ? `+${subnetDelta} in last 30d`
        : subnetDelta < 0
          ? `${subnetDelta} in last 30d`
          : 'flat in last 30d',
    },
    miners: {
      total: minersTotal,
      totalText: fmtThousands(minersTotal),
      deltaText: `${fmtThousands(activeKeysSum)} active neurons across ${subnetTotal} subnets`,
    },
    tao: {
      stakedTao: Math.round(taoStakedNow),
      stakedText: fmtTaoCompact(taoStakedNow),
      unit: 'τ',
      deltaText: notionalText ?? `${fmtThousands(Math.round(taoStakedNow))} τ on chain`,
    },
    validators: {
      total: activeValidatorsSum,
      totalText: fmtThousands(activeValidatorsSum),
      deltaText: 'top 64 receive emission',
    },
  };

  writeFileSync(OUT_PATH, JSON.stringify(out, null, 2) + '\n', 'utf8');
  console.log(`[fetch-chain-stats] wrote ${OUT_PATH}`);
  console.log(JSON.stringify(out, null, 2));
}

main().catch((err) => {
  console.error('[fetch-chain-stats] FAILED:', err?.message ?? err);
  if (existsSync(OUT_PATH)) {
    const prev = readFileSync(OUT_PATH, 'utf8');
    console.error('[fetch-chain-stats] preserving last-known-good chain-stats.json');
    console.error(`  fetchedAt (kept) = ${(JSON.parse(prev).fetchedAt) ?? 'unknown'}`);
  } else {
    console.error('[fetch-chain-stats] no existing chain-stats.json to fall back on');
  }
  process.exit(1);
});
