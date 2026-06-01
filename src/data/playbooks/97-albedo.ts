import type { RichPlaybook } from '../playbook-rich';

// SN97 — Albedo. Subnet slot in transition. Previously operated as "Distil"
// (model distillation) and "FlameWire" (decentralized RPC). Current Albedo branding
// has no public miner repo, scoring spec, or hardware requirements as of 2026-06.

export const sn97: RichPlaybook = {
  slug: '97-albedo',
  netuid: 97,
  name: 'Albedo',
  category: 'reason',
  categoryLabel: 'In Transition',
  blurb:
    'Subnet 97 is currently labeled Albedo on taostats but the operating team, product surface, and mining spec are not publicly documented as of 2026-06. Slot has rotated through multiple identities (Distil → FlameWire → Albedo). Treat as not-yet-mineable until current operator publishes materials.',
  whatMinersDo:
    "Under prior incarnations: Distil ran competitive model distillation of Qwen3.5-35B-A3B with miners scored on KL divergence against the teacher across the full 248k-token vocabulary plus a 17-axis composite (math/code/reasoning/robustness). FlameWire was decentralized RPC infrastructure for blockchains. Whether the current Albedo branding inherits any of that scoring stack or operates a different protocol is not publicly documented.",
  verifiedAt: '2026-06-01',
  verifiedBy: '@editorial',
  emission: '— τ/day',
  burnCostFallback: '— τ',
  minerCountFallback: 0,
  slotCap: 256,
  hardware: [{ role: 'Compute node', count: '1', cpuCores: 8, ramGb: 32, diskGb: 100, bandwidth: 'standard', notes: 'Specifics not publicly disclosed under the Albedo branding.' }],
  rentalOk: true,
  repo: { url: 'https://taostats.io/subnets/97/', branch: 'main' },
  setupShape: 'simple-binary',
  setupOverview:
    'No publicly published miner repo or canonical setup under the current Albedo branding as of 2026-06. Cross-check the live owner coldkey and any linked external resources on taostats before engaging.',
  install: [{ step: 'Awaiting current-operator miner repo', note: 'Subnet has rotated through multiple identities. Confirm the live operator on taostats and wait for an official mining spec.' }],
  runSteps: [{ step: 'Awaiting public miner spec', note: 'No public run command exists under the Albedo branding.' }],
  envVars: [
    { name: 'WALLET', description: 'Coldkey name', required: true },
    { name: 'HOTKEY', description: 'Hotkey name', required: true },
  ],
  scoring: {
    summary: 'Current scoring rule under the Albedo branding is not publicly documented. Prior incarnations: Distil used KL divergence + 17-axis composite; FlameWire used decentralized RPC quality metrics.',
    rule: 'Verify current scoring with the live operator before mining.',
    cheatPath: 'Cannot enumerate cheat paths without a confirmed current scoring rule. Verify directly with the operator.',
  },
  profitability: { estimatedDailyEmissionPerUid: 0.0, tokenPriceUsdFallback: 284, notes: 'Subnet has been flagged for deregistration risk in community discussion — verify slot continuity before committing capital.' },
  milestones: [{ day: 'day 1', target: 'Verify current operator on taostats', note: 'Confirm the slot is actively operated and obtain an official mining spec.' }],
  monitoring: [{ metric: 'Operator identity + repo', threshold: 'confirmed', where: 'taostats.io/subnets/97/ · current owner coldkey' }],
  knownIssues: [
    { symptom: 'Slot identity has changed across cohorts', cause: 'Subnet 97 has rotated through Distil → FlameWire → Albedo via deregistration cycle.', fix: 'Always verify current operator on taostats before engaging.' },
    { symptom: 'No public miner code under Albedo branding', cause: 'Current operator has not published an open mining spec as of 2026-06.', fix: 'Wait for official Albedo onboarding materials.' },
  ],
  notes: [
    'Prior incarnations: Distil (unarbos team, model distillation), FlameWire (UnitOne Labs, decentralized RPC).',
    'Subnet has been flagged as deregistration risk by community observers — verify live operator before any capital deployment.',
    'Subnet slot identity can change via the deregistration cycle — netuid persists but the team operating it can rotate.',
  ],
};
