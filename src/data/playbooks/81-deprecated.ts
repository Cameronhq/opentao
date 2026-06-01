import type { RichPlaybook } from '../playbook-rich';

// SN81 — deprecated. Formerly "Grail" under Covenant AI (same team as SN3
// Templar and SN39 Basilica). Covenant AI publicly exited Bittensor in
// April 2026 after a dispute with the Opentensor Foundation; SN81 was
// deprecated on chain along with SN3 and SN39. There is no active
// mechanism, no current operator, and no published playbook to follow.
// Treat this entry as an inventory record.

export const sn81: RichPlaybook = {
  slug: '81-deprecated',
  netuid: 81,
  name: 'Subnet 81 (Deprecated)',
  category: 'data',
  categoryLabel: 'Deprecated',

  blurb:
    'Dormant netuid. Formerly "Grail" under Covenant AI (decentralized LLM pretraining), deprecated April 2026 after the Covenant AI exit. No active mechanism, no published miner workflow.',

  whatMinersDo:
    'Nothing is currently being mined on SN81. Under the previous Covenant AI operator the subnet ran a permissionless distributed-pretraining experiment (producing Covenant-72B) where miners submitted partial gradients and updates against a global model. That mechanism is no longer running, and no successor operator has published a miner workflow.',

  verifiedAt: '2026-06-01',
  verifiedBy: '@editorial',

  emission: '— τ/day',
  burnCostFallback: '— τ',
  minerCountFallback: 0,
  slotCap: 256,

  hardware: [
    { role: 'n/a — subnet deprecated', cpuCores: 0, ramGb: 0, diskGb: 0, notes: 'No active workload. Do not provision hardware against this netuid.' },
  ],

  rentalOk: true,
  rentalNote: 'Not applicable — no active workload to run.',

  repo: {
    url: 'https://taostats.io/subnets/81/',
    branch: 'n/a',
  },

  setupShape: 'simple-binary',
  setupOverview:
    'There is no setup to perform. The slot will only become meaningful if a new operator registers a fresh mechanism on netuid 81. Until that happens, queries against this subnet should treat it as vestigial.',

  install: [
    { step: 'No active mechanism', note: 'Check taostats subnet 81 page for any successor operator announcement before doing anything else.' },
  ],

  runSteps: [
    { step: 'Do not register on SN81', note: 'Without an active mechanism, registration burn would be unrecoverable.' },
  ],

  envVars: [
    { name: 'WALLET', description: 'Coldkey name (matches btcli wallet list) — not applicable while subnet is dormant', required: false },
    { name: 'HOTKEY', description: 'Hotkey name on that coldkey — not applicable while subnet is dormant', required: false },
  ],

  scoring: {
    summary:
      'No active scoring mechanism. Under the previous Covenant AI operator, Grail scored partial gradients feeding the Covenant-72B pretraining run. After the April 2026 exit, that mechanism was deprecated.',
    rule: 'n/a — no active reward function.',
    cheatPath: 'n/a — no active scoring surface to exploit.',
  },

  profitability: {
    estimatedDailyEmissionPerUid: 0.0,
    tokenPriceUsdFallback: 284,
    notes: 'Subnet is dormant. There is no expected emission.',
  },

  milestones: [
    { day: 'n/a', target: 'Watch for successor operator', note: 'Monitor taostats and Bittensor discussion channels for any announcement that SN81 has been re-registered with a new mechanism.' },
  ],

  monitoring: [
    { metric: 'Operator status', threshold: 'any announcement', where: 'https://taostats.io/subnets/81/' },
  ],

  knownIssues: [
    { symptom: 'Tooling lists SN81 as active', cause: 'Cached metadata predating the April 2026 Covenant AI exit.', fix: 'Cross-check taostats — the slot has been deprecated on chain.' },
  ],

  notes: [
    'Covenant AI also operated SN3 (Templar) and SN39 (Basilica), both deprecated alongside SN81 in April 2026.',
    'Some community discussion has floated reviving work on SN3/SN39/SN81 but as of this writing no production operator has formally taken over the slot.',
  ],
};
