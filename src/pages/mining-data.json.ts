import type { APIRoute } from 'astro';
import { subnets } from '../data/subnets';
import { playbooks } from '../data/playbooks';
import { getRichPlaybook, playbookStatus } from '../data/playbook-rich';
import { agentSetupGuide } from '../data/setup-guide';
import chainStats from '../data/chain-stats.json';

// Single machine-readable source of truth for the "Start mining" surface.
// Both the site and the OpenTAO MCP server read this — taostats refresh + the
// playbook registry feed it, so the agent and the website never diverge.
// Served at /mining-data.json.

const SITE = 'https://opentao.ai';

const num = (s: string | number | undefined): number => {
  const m = String(s ?? '').match(/-?[\d.]+/);
  return m ? parseFloat(m[0]) : 0;
};
const emissionTao = (s: string | undefined): number | null => {
  if (!s || s.includes('—')) return null;
  return num(s); // "269 τ" → 269
};

const byNetuid = new Map(playbooks.map((p) => [Number(p.netuid), p]));

export const GET: APIRoute = () => {
  const records = subnets.map((s) => {
    const pb = byNetuid.get(s.netuid);
    // Resolve rich/status by the playbook's own slug (joined by netuid) — the
    // taostats-generated subnet slug can drift from the hand-keyed playbook slug.
    const rich = getRichPlaybook(pb?.slug ?? s.slug);
    const minersReg = num(s.miners);
    const minersEarning = num(s.minersEarning);
    return {
      netuid: s.netuid,
      slug: s.slug,
      name: s.name,
      category: s.cat,
      categoryLabel: s.catLabel,
      owner: s.owner,
      description: s.description,
      // live economics (from taostats via subnets.ts)
      emission: { display: s.emission, taoPerDay: emissionTao(s.emission) },
      marketCap: s.mcap,
      priceTao: num(s.price) || null,
      change7d: { display: s.delta7d, pct: s.delta7d === '—' ? null : num(s.delta7d) * (s.delta7dSign === 'neg' ? -1 : 1) },
      miners: {
        registered: minersReg,
        slots: num(s.minerSlots),
        earning: minersEarning,
        // share of registered miners actually earning — low = winner-take-all
        rewardConcentration: minersReg ? +(minersEarning / minersReg).toFixed(3) : null,
      },
      validators: num(s.validators),
      // playbook coverage — status derived from the rich registry (single source
      // of truth), same as the website listing/detail pages. Resolve by the
      // playbook's own slug (joined by netuid) since subnets.ts slugs are
      // taostats-generated and can drift from the hand-keyed playbook slugs.
      playbook: {
        status: playbookStatus(pb?.slug ?? s.slug).status, // verified | draft | missing
        url: `${SITE}/mine/playbooks/${pb?.slug ?? s.slug}`,
        hasRich: !!rich,
      },
      links: { github: s.github ?? null, twitter: s.twitter ?? null, site: s.url ?? null },
      // full operator playbook when we have one (hardware, commands, scoring, economics)
      rich: rich
        ? {
            whatMinersDo: rich.whatMinersDo,
            verifiedAt: rich.verifiedAt,
            hardware: rich.hardware,
            hardwareNote: rich.hardwareNote ?? null,
            rentalOk: rich.rentalOk,
            rentalUsdPerHr: rich.rentalUsdPerHr ?? null,
            repo: rich.repo,
            setupShape: rich.setupShape,
            setupOverview: rich.setupOverview,
            install: rich.install,
            runSteps: rich.runSteps,
            envVars: rich.envVars,
            scoring: rich.scoring,
            profitability: rich.profitability,
            knownIssues: rich.knownIssues,
          }
        : null,
    };
  });

  const body = {
    source: 'opentao.ai',
    license: 'CC BY-SA 4.0',
    notice: 'Read-only. Mining actions (registration, running a miner) cost real TAO/GPU and must be run and confirmed by the operator.',
    dataFetchedAt: chainStats.fetchedAt,
    counts: {
      subnets: records.length,
      playbooksVerified: records.filter((r) => r.playbook.status === 'verified').length,
      playbooksDraft: records.filter((r) => r.playbook.status === 'draft').length,
    },
    setupGuideUrl: `${SITE}/mine/general-setup`,
    // Full one-time setup guide (steps + per-OS commands) so the MCP serves it
    // from this single source instead of its own hardcoded copy.
    setupGuide: agentSetupGuide,
    subnets: records,
  };

  return new Response(JSON.stringify(body), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=300',
    },
  });
};
