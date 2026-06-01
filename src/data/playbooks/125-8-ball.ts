import type { RichPlaybook } from '../playbook-rich';

// SN125 — 8 Ball. Registered but no public technical write-up, GitHub, or
// website as of 2026-06. Minimal stub until primary sources are available.

export const sn125: RichPlaybook = {
  slug: '125-8-ball',
  netuid: 125,
  name: '8 Ball',
  category: 'reason',
  categoryLabel: 'Undocumented',
  blurb: 'SN125 ("8 Ball") is registered in the Bittensor directory but has no public miner repo, website, or technical write-up as of 2026-06.',
  whatMinersDo: 'Not publicly documented. No miner repo or runbook has been published; this entry will be expanded once the team releases primary-source documentation.',
  verifiedAt: '2026-06-01',
  verifiedBy: '@editorial',
  emission: '— τ/day', burnCostFallback: '— τ', minerCountFallback: 0, slotCap: 256,
  hardware: [{ role: 'Unknown', count: '—', cpuCores: 0, ramGb: 0, diskGb: 0, notes: 'Not publicly documented.' }],
  rentalOk: true,
  repo: { url: 'https://taostats.io/subnets/125/', branch: 'main' },
  setupShape: 'simple-binary',
  setupOverview: 'No setup instructions are available. Watch taostats.io/subnets/125 and the Bittensor subnet directory for an official announcement.',
  install: [{ step: 'Wait for the team to publish primary-source docs', note: 'No repo or runbook available as of 2026-06.' }],
  runSteps: [{ step: 'N/A — undocumented subnet' }],
  envVars: [
    { name: 'WALLET', description: 'Coldkey name', required: true },
    { name: 'HOTKEY', description: 'Hotkey name',  required: true },
  ],
  scoring: { summary: 'Scoring rule not publicly documented.', rule: 'Unknown until the team publishes a spec.', cheatPath: 'Unknown until the scoring rule is published.' },
  profitability: { estimatedDailyEmissionPerUid: 0.0, tokenPriceUsdFallback: 284, notes: 'No public profitability data — treat as dormant until the team publishes.' },
  milestones: [{ day: 'day 0', target: 'Wait for primary sources', note: 'Watch taostats and the Bittensor directory for an official announcement.' }],
  monitoring: [{ metric: 'Subnet directory listing', threshold: 'updated', where: 'taostats.io/subnets/125' }],
  knownIssues: [{ symptom: 'No miner code or runbook published', cause: 'Operator has not published primary-source documentation.', fix: 'Wait for an official release; do not register until at least the scoring rule is known.' }],
  notes: ['Promote this stub to a full RichPlaybook once the team publishes a repo, website, or technical write-up.'],
};
