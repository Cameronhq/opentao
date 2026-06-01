import type { RichPlaybook } from '../playbook-rich';

// SN39 — DEPRECATED. Formerly operated by Covenant AI as Basilica.
// Covenant exited Bittensor in 2025; the subnet was deprecated thereafter.
// No active operator, no miner work, no scoring. Do not register here.

export const sn39: RichPlaybook = {
  slug: '39-deprecated',
  netuid: 39,
  name: 'Deprecated (formerly Basilica)',
  category: 'compute',
  categoryLabel: 'Deprecated',
  blurb:
    'SN39 is deprecated. Covenant AI operated Basilica here, exited Bittensor in 2025, and the netuid has been inactive since. No active operator produces work or scoring on this slot.',
  whatMinersDo:
    'Nothing. There is no active miner role on SN39. Registering a hotkey here will not earn emission. If you came here looking for Basilica, that team has left Bittensor — check the Covenant AI org for current activity (outside Bittensor).',
  verifiedAt: '2026-06-01',
  verifiedBy: '@editorial',
  emission: '0 τ/day',
  burnCostFallback: '— τ',
  minerCountFallback: 0,
  slotCap: 256,
  hardware: [{ role: 'N/A', cpuCores: 0, ramGb: 0, diskGb: 0, notes: 'No mining role — do not deploy hardware here.' }],
  rentalOk: false,
  rentalNote: 'N/A — subnet inactive.',
  repo: { url: 'https://taostats.io/subnets/39/', branch: 'main' },
  setupShape: 'simple-binary',
  setupOverview: 'Do not set up a miner on SN39. The slot is dormant.',
  install: [{ step: 'Do not install', note: 'SN39 is deprecated. No miner code is being scored.' }],
  runSteps: [{ step: 'Do not run', note: 'No active validators are issuing work on SN39.' }],
  envVars: [],
  scoring: {
    summary: 'No active scoring. Validators are inactive on this netuid.',
    rule: 'N/A',
    cheatPath: 'N/A — nothing to cheat.',
  },
  profitability: { estimatedDailyEmissionPerUid: 0, tokenPriceUsdFallback: 284, capexNote: 'Zero — do not spend on this subnet.' },
  milestones: [{ day: 'day 0', target: 'Pick a different subnet', note: 'See the directory at /playbooks for active subnets.' }],
  monitoring: [],
  knownIssues: [{ symptom: 'Registering yields zero emission', cause: 'Subnet deprecated', fix: 'Deregister; pick an active subnet.' }],
  notes: ['Historical operator: Covenant AI (Sam Dare). Exited Bittensor 2025.'],
};
