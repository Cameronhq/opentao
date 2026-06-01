import type { RichPlaybook } from '../playbook-rich';

// SN30 — Pending. No currently-declared operator in 2026.
// Previous identities: WOMBO (text-to-image, 2023) → Bettensor (sports
// prediction, 2024). Both have stepped away. Until a new owner re-registers
// under the post-Sep-2025 deregistration mechanism, treat as an empty slot.
// No active miner playbook exists.

export const sn30: RichPlaybook = {
  slug: '30-pending',
  netuid: 30,
  name: 'Pending',
  category: 'compute',
  categoryLabel: 'Inactive',

  blurb:
    'Subnet 30 is currently in a Pending state — no actively-declared operator. Previous identities (WOMBO, Bettensor) no longer run on the slot. Check taostats before treating SN30 as live.',

  whatMinersDo:
    'No active miner role is publicly defined while the subnet is in a pending state. Anyone running on the netuid today is operating off legacy / experimental code from prior identities (WOMBO text-to-image or Bettensor sports prediction).',

  verifiedAt: '2026-06-01',
  verifiedBy: '@editorial',

  emission: '— τ/day',
  burnCostFallback: '— τ',
  minerCountFallback: 0,
  slotCap: 256,

  hardware: [],
  hardwareNote: 'No active operator — no hardware spec to publish.',

  rentalOk: false,
  rentalNote: 'Not applicable — no active miner role.',

  repo: {
    url: 'https://taostats.io/subnets/30/',
    branch: 'n/a',
  },

  setupShape: 'simple-binary',
  setupOverview:
    'No active miner playbook. Confirm the current operator at taostats.io/subnets/30 before treating any historical material as current. Under the post-September-2025 deregistration mechanism, a new operator may re-register at any time.',

  install: [],
  runSteps: [],
  envVars: [],

  scoring: {
    summary: 'No active scoring mechanism is currently published for subnet 30.',
    rule: 'n/a',
    cheatPath: 'Without an active scoring mechanism there is nothing meaningful to attack; the most relevant risk is buying an unallocated alpha token thinking there is product behind it.',
  },

  profitability: {
    estimatedDailyEmissionPerUid: 0.0,
    tokenPriceUsdFallback: 284,
    notes: 'No active operator — no meaningful profitability estimate.',
  },

  milestones: [],
  monitoring: [],
  knownIssues: [],

  notes: [
    'Slot has cycled through WOMBO (2023, text-to-image) and Bettensor (2024, sports prediction); both have stepped away.',
    'Always confirm the current declared operator on taostats.io/subnets/30 before mining, validating, or buying alpha.',
  ],
};
