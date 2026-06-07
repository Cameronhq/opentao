import type { RichPlaybook } from '../playbook-rich';

// SN3 — Deprecated. Slot formerly Templar (Covenant AI), publicly exited April 2026.
// No active operator, no mining workload, no scoring mechanism. Treat as inventory record.

export const sn3: RichPlaybook = {
  slug: '3-deprecated',
  netuid: 3,
  name: 'Subnet 3 (Deprecated)',
  category: 'compute',
  categoryLabel: 'Deprecated',

  blurb:
    'Deprecated slot. No active operator. Formerly Templar (Covenant AI), publicly exited Bittensor in April 2026. There is no miner workload to join.',

  whatMinersDo:
    'Nothing. Subnet 3 is currently dormant — no active scoring mechanism, no miner workload, no live operator publishing a setup. The netuid remains registered but is effectively a placeholder until a new operator takes it over and bootstraps a fresh mechanism.',

  verifiedAt: '2026-06-01',
  verifiedBy: '@editorial',

  emission: '— τ/day',
  burnCostFallback: '— τ',
  minerCountFallback: 0,
  slotCap: 256,

  hardware: [
    { role: 'n/a', count: '0', cpuCores: 0, ramGb: 0, diskGb: 0, notes: 'Subnet is deprecated — no hardware spec applies.' },
  ],
  hardwareNote: 'No active mechanism. Do not provision hardware for this subnet until a new operator takes it over.',

  rentalOk: true,
  rentalNote: 'Not applicable — no miner workload.',

  repo: {
    url: 'https://github.com/tplr-ai/templar',
    branch: 'main',
    minerEntrypoint: 'n/a (deprecated)',
  },

  setupShape: 'simple-binary',
  setupOverview:
    'No setup. The subnet is deprecated. The previous Templar codebase under tplr-ai/templar is the historical reference but is no longer the active mechanism.',

  install: [
    { step: 'Do not install', note: 'Subnet 3 is deprecated. Check taostats before assuming any of this is current.' },
  ],

  runSteps: [
    { step: 'No active run', note: 'There is no miner process to start on this netuid today.' },
  ],

  envVars: [
    { name: 'WALLET', description: 'Coldkey name (not relevant — subnet inactive)', required: false },
    { name: 'HOTKEY', description: 'Hotkey name (not relevant — subnet inactive)', required: false },
  ],

  scoring: {
    summary: 'No active scoring mechanism — subnet deprecated after Covenant AI exit in April 2026.',
    rule: 'n/a',
    cheatPath: 'n/a — nothing to score, nothing to cheat.',
  },

  profitability: {
    estimatedDailyEmissionPerUid: 0.0,
    tokenPriceUsdFallback: 284,
    capexNote: 'Do not allocate capital to this subnet.',
  },

  milestones: [
    { day: 'n/a', target: 'Subnet inactive', note: 'No milestones — wait for a new operator to take the slot.' },
  ],

  monitoring: [
    { metric: 'Slot status', threshold: 'check before participating', where: 'https://taostats.io/subnets/3/' },
  ],

  knownIssues: [
    { symptom: 'No emission', cause: 'Subnet is deprecated.', fix: 'Do not register a hotkey here. Pick an active subnet.' },
  ],

  notes: [
    'Covenant AI publicly exited Bittensor in April 2026 amid an Opentensor Foundation dispute, triggering a ~20% TAO drawdown.',
    'Slot remains registered but no production behaviour to analyse.',
  ],
  placeholder: true,
};
