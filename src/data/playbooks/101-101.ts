import type { RichPlaybook } from '../playbook-rich';

// SN101 — minimal stub. Slot is unnamed / dormant in opentao's registry; no
// public project name, website, or miner repo verified. This playbook is a
// 30-line placeholder until the slot has a verified operator profile.

export const sn101: RichPlaybook = {
  slug: '101-101',
  netuid: 101,
  name: '101',
  category: 'compute',
  categoryLabel: 'Compute',
  blurb: 'Unnamed / dormant subnet slot — no miner workload profiled.',
  whatMinersDo: 'Not profiled. SN101 has no published project name, website, or miner repository verified in opentao at this time. Check taostats for live state before considering registration.',
  verifiedAt: '2026-06-01',
  verifiedBy: '@editorial',
  emission: '— τ/day',
  burnCostFallback: '— τ',
  minerCountFallback: 0,
  slotCap: 256,
  hardware: [{ role: 'GPU node', count: '—', cpuCores: 0, ramGb: 0, diskGb: 0 }],
  rentalOk: true,
  repo: { url: 'https://taostats.io/subnets/101/', branch: 'main' },
  setupShape: 'simple-binary',
  setupOverview: 'No verified miner repo or setup instructions. Stub entry pending operator profile.',
  install: [{ step: 'Check live state on taostats before any registration', cmd: 'open https://taostats.io/subnets/101/' }],
  runSteps: [{ step: 'Not profiled', cmd: '—' }],
  envVars: [{ name: 'WALLET', description: 'Coldkey name', required: true }, { name: 'HOTKEY', description: 'Hotkey name', required: true }],
  scoring: { summary: 'Not profiled.', rule: 'Not profiled.', cheatPath: 'n/a' },
  profitability: { estimatedDailyEmissionPerUid: 0, tokenPriceUsdFallback: 284 },
  milestones: [{ day: 'day 1', target: 'Confirm operator', note: 'Wait until SN101 has a published roadmap before committing capex.' }],
  monitoring: [{ metric: 'Subnet activity', threshold: 'any', where: 'taostats.io/subnets/101/' }],
  knownIssues: [{ symptom: 'No public miner code found', cause: 'Slot tracked as unnamed/dormant.', fix: 'Skip until operator publishes a verified repo and roadmap.' }],
  notes: ['Stub entry — replace with full playbook once SN101 has a verified operator and miner repository.'],
};
