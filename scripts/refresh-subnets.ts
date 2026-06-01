#!/usr/bin/env bun
// Refresh src/data/subnets.ts from live taostats — 3 bulk calls, well under the
// 5/min free tier. Run:  bun run scripts/refresh-subnets.ts
//
// Requires: source ~/.claude/credentials/taostats.env  (sets TAOSTATS_API_KEY)
// Output:   prints generated TS to stdout. Pipe into the data file:
//   bun run scripts/refresh-subnets.ts > src/data/subnets.ts

import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

const KEY = process.env.TAOSTATS_API_KEY;
if (!KEY) {
  console.error('TAOSTATS_API_KEY not set. Run: source ~/.claude/credentials/taostats.env');
  process.exit(1);
}

const BASE = 'https://api.taostats.io';

async function fetchTaostats<T = unknown>(path: string): Promise<T> {
  const r = await fetch(`${BASE}${path}`, { headers: { Authorization: KEY! } });
  if (!r.ok) throw new Error(`taostats ${path} → ${r.status}`);
  return r.json() as Promise<T>;
}

interface SubnetRow {
  netuid: number;
  owner: { ss58: string };
  emission: string;
  projected_emission: string;
  neuron_registration_cost: string;
  max_neurons: number;
  active_keys: number;
  active_miners: number;
  active_validators: number;
  validators: number;
  recycled_24_hours: string;
  net_flow_1_day: string;
  registration_timestamp: string;
}
interface IdentityRow {
  netuid: number;
  subnet_name?: string | null;
  github_repo?: string | null;
  subnet_url?: string | null;
  twitter?: string | null;
  description?: string | null;
  summary?: string | null;
  tags?: string[];
}
interface PoolRow {
  netuid: number;
  name?: string;
  symbol?: string;
  price?: string;
  market_cap?: string;
  price_change_1_week?: number | string;
}

// Map free-text tags → our internal category enum.
type Cat = 'llm' | 'vision' | 'audio' | 'robotics' | 'data' | 'reason' | 'storage' | 'compute';
const CAT_LABEL: Record<Cat, string> = {
  llm: 'LLM', vision: 'Vision', audio: 'Audio', robotics: 'Robotics',
  data: 'Data', reason: 'Reasoning', storage: 'Storage', compute: 'Compute',
};
function categorize(name: string, tags: string[]): { cat: Cat; label: string } {
  const t = new Set((tags || []).map((s) => s.toLowerCase()));
  const n = (name || '').toLowerCase();

  const has = (...keys: string[]) => keys.some((k) => t.has(k) || n.includes(k));

  if (has('llm', 'language-model', 'text-generation', 'chat', 'inference-llm', 'ai-text')) return { cat: 'llm', label: 'LLM' };
  if (has('vision', 'image', 'image-generation', 'video', 'visual', 'multimodal')) return { cat: 'vision', label: 'Vision' };
  if (has('audio', 'speech', 'tts', 'voice', 'music', 'asr')) return { cat: 'audio', label: 'Audio' };
  if (has('robot', 'robotics', 'motor', 'embodied')) return { cat: 'robotics', label: 'Robotics' };
  if (has('storage', 'data-storage', 'file', 'ipfs', 'arweave')) return { cat: 'storage', label: 'Storage' };
  if (has('reason', 'reasoning', 'math', 'logic', 'proof', 'agent', 'ai-agent', 'agents')) return { cat: 'reason', label: 'Reasoning' };
  if (has('prediction', 'forecasting', 'time-series', 'market-prediction', 'data', 'data-collection', 'scraping', 'finance', 'trading', 'analytics', 'research')) return { cat: 'data', label: 'Data' };
  // default — many compute/infra/training subnets fall here
  return { cat: 'compute', label: 'Compute' };
}

function slugify(name: string, netuid: number): string {
  const s = (name || `sn${netuid}`)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40) || `sn${netuid}`;
  return `${netuid}-${s}`;
}

function fmtRao(rao: string | undefined, digits = 2): string {
  if (!rao) return '0.00';
  return (Number(rao) / 1e9).toFixed(digits);
}

function fmtMcap(rao: string | undefined): string {
  if (!rao) return '—';
  const tao = Number(rao) / 1e9;
  if (tao > 1e6) return `${(tao / 1e6).toFixed(1)}M τ`;
  if (tao > 1e3) return `${(tao / 1e3).toFixed(1)}K τ`;
  return `${tao.toFixed(1)} τ`;
}

function fmtCount(n: number): string {
  if (n > 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

// Subnets to flag `rich: true` in the generated data. Currently empty: the
// directory's "featured" highlight was removed, and rich detail-page content is
// driven independently by subnet-rich.ts (getRichSubnet), not by this flag.
const RICH_SLUGS = new Set<string>([]);

async function main() {
  console.error('Fetching 3 bulk endpoints from taostats…');
  const [subRes, idRes, poolRes] = await Promise.all([
    fetchTaostats<{ data: SubnetRow[] }>('/api/subnet/latest/v1?limit=1024&order=netuid_asc'),
    fetchTaostats<{ data: IdentityRow[] }>('/api/subnet/identity/v1?limit=200'),
    fetchTaostats<{ data: PoolRow[] }>('/api/dtao/pool/latest/v1?limit=200&order=netuid_asc'),
  ]);

  const idByNetuid    = new Map(idRes.data.map((r) => [r.netuid, r]));
  const poolByNetuid  = new Map(poolRes.data.map((r) => [r.netuid, r]));

  // Skip netuid 0 (subtensor root) — not a real subnet from the user perspective.
  const rows = subRes.data
    .filter((s) => s.netuid > 0)
    .sort((a, b) => a.netuid - b.netuid);

  console.error(`Joined ${rows.length} subnets. Generating TS…`);

  const tsLines: string[] = [];
  tsLines.push("// Subnet registry — auto-generated from taostats by scripts/refresh-subnets.ts");
  tsLines.push(`// Last refreshed: ${new Date().toISOString().slice(0, 10)}`);
  tsLines.push(`// DO NOT EDIT BY HAND — re-run the script to refresh.\n`);
  tsLines.push("export interface Subnet {");
  tsLines.push("  slug: string;");
  tsLines.push("  netuid: number;");
  tsLines.push("  name: string;");
  tsLines.push("  cat: 'llm' | 'vision' | 'audio' | 'robotics' | 'data' | 'reason' | 'storage' | 'compute';");
  tsLines.push("  catLabel: string;");
  tsLines.push("  owner: string;");
  tsLines.push("  description: string;");
  tsLines.push("  hardware: string;");
  tsLines.push("  emission: string;       // τ/day display value");
  tsLines.push("  mcap: string;           // market cap display value");
  tsLines.push("  price: string;          // α-price in TAO");
  tsLines.push("  delta7d: string;        // 7-day α-price change, display e.g. '+2.4%' / '—'");
  tsLines.push("  delta7dSign: 'pos' | 'neg';");
  tsLines.push("  miners: string;         // registered miner slots filled (active_keys − validators)");
  tsLines.push("  minerSlots: string;     // total neuron slots (max_neurons)");
  tsLines.push("  minersEarning: string;  // miners earning rewards (incentive > 0)");
  tsLines.push("  validators: string;");
  tsLines.push("  registered: string;");
  tsLines.push("  verifiedNote: string;");
  tsLines.push("  tags?: string[];");
  tsLines.push("  github?: string;");
  tsLines.push("  twitter?: string;");
  tsLines.push("  url?: string;");
  tsLines.push("  rich?: boolean;");
  tsLines.push("}\n");
  tsLines.push("export const subnets: Subnet[] = [");

  for (const s of rows) {
    const id   = idByNetuid.get(s.netuid);
    const pool = poolByNetuid.get(s.netuid);
    const cleanName = (v?: string | null) => (v && v.trim() && v.trim().toLowerCase() !== 'unknown') ? v.trim() : '';
    const known: Record<number, string> = {
      42: 'Masa',           // Identity not set on-chain; project is github.com/masa-finance/subnet-42
    };
    const rawName = cleanName(id?.subnet_name) || cleanName(pool?.name) || known[s.netuid] || `Subnet ${s.netuid}`;
    const name = rawName.replace(/^subnet[\s-]*/i, '').trim() || `Subnet ${s.netuid}`;
    const { cat, label } = categorize(name, id?.tags || []);
    const slug = slugify(name, s.netuid);
    const owner = `@${s.owner.ss58.slice(0, 10)}`;
    const description = (id?.description || id?.summary || `Subnet ${s.netuid}.`).slice(0, 240).replace(/"/g, '\\"');
    // 24h net flow into the subnet (TAO bought / sold across the dTao pool) —
    // a better proxy for "daily emission" than the per-block `emission` field
    // (which is 0 outside tempo boundaries). Falls back to projected_emission
    // and finally to recycled_24_hours so dormant subnets still show *something*.
    const flowRao = Number(s.net_flow_1_day || s.projected_emission || s.recycled_24_hours || 0);
    const flowTao = Math.abs(flowRao) / 1e9;
    const emission = flowTao >= 1
      ? `${flowTao.toFixed(0)} τ`
      : flowTao >= 0.01
        ? `${flowTao.toFixed(2)} τ`
        : '— τ';
    const mcap = fmtMcap(pool?.market_cap);
    const price = pool?.price ? Number(pool.price).toFixed(4) : '—';
    const minerSlots = String(s.max_neurons);
    const miners = String(Math.max(0, s.active_keys - s.validators)); // registered miner slots filled
    const minersEarning = fmtCount(s.active_miners);                  // miners earning rewards (incentive > 0)
    const validators = String(s.active_validators);
    // 7-day α-price change comes straight from the dtao pool endpoint (already a %).
    const d7raw = pool?.price_change_1_week;
    const hasD7 = d7raw != null && d7raw !== '' && !Number.isNaN(Number(d7raw));
    const d7 = hasD7 ? Number(d7raw) : 0;
    const delta7dSign = d7 < 0 ? 'neg' : 'pos';
    const delta7d = hasD7 ? `${d7 >= 0 ? '+' : '−'}${Math.abs(d7).toFixed(1)}%` : '—';
    const registered = (s.registration_timestamp || '').slice(0, 10).replace(/-/g, '·');

    tsLines.push(`  {`);
    tsLines.push(`    slug: '${slug}', netuid: ${s.netuid}, name: "${name.replace(/"/g, '\\"')}",`);
    tsLines.push(`    cat: '${cat}', catLabel: '${label}', owner: "${owner}",`);
    tsLines.push(`    description: "${description}",`);
    tsLines.push(`    hardware: '—', emission: '${emission}', mcap: '${mcap}', price: '${price}',`);
    tsLines.push(`    delta7d: '${delta7d}', delta7dSign: '${delta7dSign}',`);
    tsLines.push(`    miners: '${miners}', minerSlots: '${minerSlots}', minersEarning: '${minersEarning}', validators: '${validators}',`);
    tsLines.push(`    registered: '${registered}',`);
    tsLines.push(`    verifiedNote: 'live data via taostats',`);
    if (id?.tags && id.tags.length)       tsLines.push(`    tags: ${JSON.stringify(id.tags.slice(0, 6))},`);
    if (id?.github_repo)                  tsLines.push(`    github: ${JSON.stringify(id.github_repo)},`);
    if (id?.twitter)                      tsLines.push(`    twitter: ${JSON.stringify(id.twitter)},`);
    if (id?.subnet_url)                   tsLines.push(`    url: ${JSON.stringify(id.subnet_url)},`);
    if (RICH_SLUGS.has(slug))             tsLines.push(`    rich: true,`);
    tsLines.push(`  },`);
  }

  tsLines.push("];");
  tsLines.push("");
  tsLines.push("export function getSubnet(slug: string): Subnet | undefined {");
  tsLines.push("  return subnets.find((s) => s.slug === slug);");
  tsLines.push("}");
  tsLines.push("");

  const out = tsLines.join('\n');
  console.error(`Generated ${rows.length} subnets, ${out.length} bytes.`);
  process.stdout.write(out);
}

main().catch((err) => { console.error('FAILED:', err); process.exit(1); });
