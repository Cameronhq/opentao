import type { APIRoute } from 'astro';
import { playbooks } from '../../../data/playbooks';
import { getRichPlaybook } from '../../../data/playbook-rich';

export async function getStaticPaths() {
  return playbooks.map((p) => ({ params: { slug: p.slug } }));
}

export const GET: APIRoute = ({ params }) => {
  const slug = params.slug as string;
  const list = playbooks.find((p) => p.slug === slug);
  const rich = getRichPlaybook(slug);

  if (!list) {
    return new Response(JSON.stringify({ error: 'playbook not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const body = rich
    ? {
        spec_version: '1',
        netuid: rich.netuid,
        slug: rich.slug,
        name: rich.name,
        category: rich.category,
        verified: { at: rich.verifiedAt, by: rich.verifiedBy },
        blurb: rich.blurb,
        what_miners_do: rich.whatMinersDo,
        live_data_fallback: {
          emission: rich.emission,
          burn_cost: rich.burnCostFallback,
          miner_count: rich.minerCountFallback,
          slot_cap: rich.slotCap,
          live_endpoint: `/api/subnet/${rich.netuid}`,
        },
        hardware: rich.hardware,
        hardware_note: rich.hardwareNote,
        rental_ok: rich.rentalOk,
        rental_note: rich.rentalNote,
        rental_usd_per_hr: rich.rentalUsdPerHr,
        repo: rich.repo,
        setup: {
          shape: rich.setupShape,
          overview: rich.setupOverview,
          install: rich.install,
          run: rich.runSteps,
          env_vars: rich.envVars,
        },
        scoring: rich.scoring,
        profitability: rich.profitability,
        milestones: rich.milestones,
        monitoring: rich.monitoring,
        known_issues: rich.knownIssues,
        notes: rich.notes,
        sources: {
          web: `https://opentao.ai/mine/playbooks/${rich.slug}`,
          markdown: `https://opentao.ai/mine/playbooks/${rich.slug}.md`,
          edit: `https://github.com/opentao-ai/opentao/blob/main/src/data/playbooks/${rich.slug}.ts`,
        },
      }
    : {
        spec_version: '1',
        netuid: list.netuid,
        slug: list.slug,
        name: list.name,
        category: list.category,
        verified: false,
        status: list.status,
        blurb: list.blurb,
        live_data_fallback: {
          emission: list.emission,
          live_endpoint: `/api/subnet/${list.netuid}`,
        },
        note: 'This playbook is not yet fully written. Only the directory metadata is available. Contribute at https://github.com/opentao-ai/opentao',
        sources: {
          web: `https://opentao.ai/mine/playbooks/${list.slug}`,
          edit: `https://github.com/opentao-ai/opentao/blob/main/src/data/playbook-rich.ts`,
        },
      };

  return new Response(JSON.stringify(body, null, 2), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=300',
    },
  });
};
