import type { APIRoute } from 'astro';
import { subnets } from '../data/subnets';

const cols = [
  'netuid', 'slug', 'name', 'category', 'owner', 'description',
  'hardware', 'emission_24h', 'market_cap', 'price_tao', 'change_7d',
  'miners_registered', 'miner_slots', 'miners_earning', 'validators', 'registered', 'verified_note',
] as const;

function esc(v: string | number): string {
  const s = String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export const GET: APIRoute = () => {
  const rows = subnets.map((s) => [
    s.netuid, s.slug, s.name, s.catLabel, s.owner, s.description,
    s.hardware, s.emission, s.mcap, s.price, s.delta7d,
    s.miners, s.minerSlots, s.minersEarning, s.validators, s.registered, s.verifiedNote,
  ].map(esc).join(','));
  const body = [cols.join(','), ...rows].join('\n') + '\n';
  return new Response(body, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="opentao-subnets.csv"',
    },
  });
};
