import type { RichPlaybook } from '../playbook-rich';

// SN69 — placeholder. No public operator, repo, name or product as of 2026-06-01.
// Stub playbook until an operator lands the slot.

export const sn69: RichPlaybook = {
  slug: '69-69',
  netuid: 69,
  name: '69',
  category: 'compute',
  categoryLabel: 'Unannounced',

  blurb:
    'Subnet 69 — no public operator, repo, name or product surface as of 2026-06-01. The slot exists on chain but no mining playbook can be written yet.',
  whatMinersDo:
    "Not documented. No public miner repo or challenge spec exists for subnet 69. Track taostats and Bittensor Discord for the first operator announcement before attempting to mine this slot.",

  verifiedAt: '2026-06-01',
  verifiedBy: '@editorial',
  emission: '— τ/day',
  burnCostFallback: '— τ',
  minerCountFallback: 0,
  slotCap: 256,

  hardware: [
    { role: 'Unknown', count: '—', cpuCores: 0, ramGb: 0, diskGb: 0, notes: 'No spec published.' },
  ],
  hardwareNote: 'No min-compute spec exists for SN69 at time of writing.',
  rentalOk: true,

  repo: { url: 'https://taostats.io/subnets/69/', branch: 'n/a' },
  setupShape: 'simple-binary',
  setupOverview: 'No public miner setup exists. Watch taostats/owner-key activity for the first operator announcement.',
  install: [{ step: 'Wait for an operator to publish a miner repo + challenge spec', note: 'taostats.io/subnets/69/ is the canonical place to check.' }],
  runSteps: [{ step: 'No public run command' }],
  envVars: [
    { name: 'WALLET', description: 'Coldkey name', required: true },
    { name: 'HOTKEY', description: 'Hotkey name',  required: true },
  ],
  scoring: { summary: 'Not documented.', rule: 'Not documented.', cheatPath: 'n/a — no scoring spec to game.' },
  profitability: { estimatedDailyEmissionPerUid: 0.0, tokenPriceUsdFallback: 284, notes: 'No emission baseline; slot is a stub.' },
  milestones: [{ day: 'day 1', target: 'Check for operator drop', note: 'taostats + Bittensor Discord.' }],
  monitoring: [{ metric: 'Public repo + challenge spec', threshold: 'published', where: 'taostats.io/subnets/69/' }],
  knownIssues: [{ symptom: 'No miner repo exists', cause: 'Slot not yet claimed by a public operator.', fix: 'Wait for an announcement; re-verify monthly.' }],
  notes: ['Treat this page as a placeholder until an operator lands the slot.'],
};
