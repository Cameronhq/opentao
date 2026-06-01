import type { RichPlaybook } from '../playbook-rich';

// SN73 — slot tracked as parked in this dataset. Operating identity and miner
// stack are not stable enough in public sources to author a real playbook.
// Minimal stub: do not present synthetic install/run details.

export const sn73: RichPlaybook = {
  slug: '73-parked',
  netuid: 73,
  name: 'Parked',
  category: 'data',
  categoryLabel: 'Parked',

  blurb: 'Subnet slot tracked as parked — no verified miner playbook authored.',
  whatMinersDo: 'Not profiled. Consult taostats.io/subnets/73/ and the operator’s own channels for current status before deploying.',

  verifiedAt: '2026-06-01',
  verifiedBy: '@editorial',

  emission: '— τ/day',
  burnCostFallback: '— τ',
  minerCountFallback: 0,
  slotCap: 256,

  hardware: [{ role: 'n/a', cpuCores: 0, ramGb: 0, diskGb: 0, notes: 'Not profiled.' }],
  rentalOk: true,

  repo: { url: 'https://taostats.io/subnets/73/', branch: 'n/a', minerEntrypoint: 'n/a' },

  setupShape: 'simple-binary',
  setupOverview: 'No verified setup. Check taostats and the current operator’s channels before deploying.',
  install: [{ step: 'Not profiled', note: 'Operator identity not verified for this slot.' }],
  runSteps: [{ step: 'Not profiled' }],
  envVars: [{ name: 'WALLET', description: 'Coldkey name', required: true }, { name: 'HOTKEY', description: 'Hotkey name', required: true }],
  scoring: { summary: 'Not profiled.', rule: 'n/a', cheatPath: 'n/a' },
  profitability: { estimatedDailyEmissionPerUid: 0.0, tokenPriceUsdFallback: 284 },
  milestones: [{ day: 'n/a', target: 'Not profiled', note: 'Check taostats.io/subnets/73/ for live state.' }],
  monitoring: [{ metric: 'n/a', threshold: 'n/a', where: 'taostats' }],
  knownIssues: [{ symptom: 'No verified profile', cause: 'Operator identity and stack not stable in public sources.', fix: 'Check operator’s own channels before deploying capital or compute.' }],
  notes: ['Stub entry — replace when a stable operator profile is verifiable.'],
};
