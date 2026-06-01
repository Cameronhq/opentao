import type { APIRoute } from 'astro';
import { playbooks } from '../../../data/playbooks';
import { getRichPlaybook, type RichPlaybook } from '../../../data/playbook-rich';

export async function getStaticPaths() {
  return playbooks.map((p) => ({ params: { slug: p.slug } }));
}

function renderMarkdown(rich: RichPlaybook): string {
  const out: string[] = [];
  out.push(`# SN${rich.netuid} · ${rich.name} — Mining Playbook`);
  out.push('');
  out.push(`> ${rich.blurb}`);
  out.push('');
  out.push(`**Verified:** ${rich.verifiedAt} by ${rich.verifiedBy}`);
  out.push(`**Live data:** \`https://opentao.ai/api/subnet/${rich.netuid}\``);
  out.push(`**Structured:** \`https://opentao.ai/mine/playbooks/${rich.slug}.json\``);
  out.push('');

  out.push('## What miners do');
  out.push('');
  out.push(rich.whatMinersDo);
  out.push('');

  out.push('## Hardware');
  out.push('');
  if (!rich.rentalOk) {
    out.push(`> ⚠ Rented GPUs (Runpod, Vast, etc.) are NOT allowed: ${rich.rentalNote}`);
    out.push('');
  }
  for (const node of rich.hardware) {
    out.push(`### ${node.role}${node.count ? ` — ${node.count}` : ''}`);
    if (node.gpu)       out.push(`- GPU: ${node.gpu}`);
    if (node.vramGb)    out.push(`- VRAM: ${node.vramGb} GB`);
    out.push(`- CPU: ${node.cpuCores} cores`);
    out.push(`- RAM: ${node.ramGb} GB`);
    out.push(`- Disk: ${node.diskGb} GB`);
    if (node.bandwidth) out.push(`- Network: ${node.bandwidth}`);
    if (node.notes)     out.push(`- Notes: ${node.notes}`);
    out.push('');
  }
  if (rich.hardwareNote) {
    out.push(rich.hardwareNote);
    out.push('');
  }

  out.push('## Repository');
  out.push('');
  out.push(`- Main: ${rich.repo.url} (branch \`${rich.repo.branch}\`)`);
  if (rich.repo.verifiedCommit) out.push(`- Verified commit: \`${rich.repo.verifiedCommit}\``);
  if (rich.repo.extraRepos) {
    for (const r of rich.repo.extraRepos) {
      out.push(`- ${r.name}: ${r.url} — ${r.purpose}`);
    }
  }
  out.push('');

  out.push('## Setup');
  out.push('');
  out.push(`*Shape: \`${rich.setupShape}\`*`);
  out.push('');
  out.push(rich.setupOverview);
  out.push('');

  out.push('### Install');
  out.push('');
  rich.install.forEach((s, i) => {
    out.push(`${i + 1}. **${s.step}**`);
    if (s.cmd) {
      out.push('   ```bash');
      out.push(`   ${s.cmd.replace(/\n/g, '\n   ')}`);
      out.push('   ```');
    }
    if (s.note) out.push(`   _${s.note}_`);
    out.push('');
  });

  out.push('### Run');
  out.push('');
  rich.runSteps.forEach((s, i) => {
    out.push(`${i + 1}. **${s.step}**`);
    if (s.cmd) {
      out.push('   ```bash');
      out.push(`   ${s.cmd.replace(/\n/g, '\n   ')}`);
      out.push('   ```');
    }
    if (s.note) out.push(`   _${s.note}_`);
    out.push('');
  });

  out.push('### Env vars');
  out.push('');
  out.push('| Name | Required | Description |');
  out.push('|---|---|---|');
  for (const e of rich.envVars) {
    out.push(`| \`${e.name}\` | ${e.required ? 'yes' : 'no'} | ${e.description} |`);
  }
  out.push('');

  out.push('## Validator scoring');
  out.push('');
  out.push(rich.scoring.summary);
  out.push('');
  out.push(`**Rule:** ${rich.scoring.rule}`);
  if (rich.scoring.sourcePath) out.push(`**Source:** \`${rich.scoring.sourcePath}\``);
  out.push('');
  out.push(`**Don't:** ${rich.scoring.cheatPath}`);
  out.push('');

  out.push('## First-week milestones');
  out.push('');
  for (const m of rich.milestones) {
    out.push(`- **${m.day}** — ${m.target}. ${m.note}`);
  }
  out.push('');

  out.push('## Monitoring');
  out.push('');
  out.push('| Metric | Threshold | Where |');
  out.push('|---|---|---|');
  for (const m of rich.monitoring) {
    out.push(`| ${m.metric} | \`${m.threshold}\` | ${m.where} |`);
  }
  out.push('');

  out.push('## Common failures');
  out.push('');
  rich.knownIssues.forEach((iss, i) => {
    out.push(`### ${i + 1}. ${iss.symptom}`);
    out.push(`**Cause:** ${iss.cause}`);
    out.push('');
    out.push(`**Fix:** ${iss.fix}`);
    out.push('');
  });

  if (rich.notes && rich.notes.length) {
    out.push('## Operator notes');
    out.push('');
    for (const n of rich.notes) out.push(`- ${n}`);
    out.push('');
  }

  out.push('---');
  out.push(`Edit on GitHub: https://github.com/opentao-ai/opentao/blob/main/src/data/playbooks/${rich.slug}.ts`);

  return out.join('\n') + '\n';
}

export const GET: APIRoute = ({ params }) => {
  const slug = params.slug as string;
  const list = playbooks.find((p) => p.slug === slug);
  const rich = getRichPlaybook(slug);

  if (!list) {
    return new Response('# Not found\n', {
      status: 404,
      headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
    });
  }

  const body = rich
    ? renderMarkdown(rich)
    : `# SN${list.netuid} · ${list.name} — Mining Playbook

> ${list.blurb}

**Status:** stub — full playbook not yet written.

This playbook has not been verified by a community miner yet. Only directory metadata is available below.

- **Category:** ${list.categoryLabel}
- **Emission:** ${list.emission}
- **Live data:** https://opentao.ai/api/subnet/${list.netuid}

If you've mined SN${list.netuid} for >7 days, write the first verified playbook:
https://github.com/opentao-ai/opentao/blob/main/src/data/playbook-rich.ts
`;

  return new Response(body, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=300',
    },
  });
};
