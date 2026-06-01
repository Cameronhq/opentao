import type { RichPlaybook } from '../playbook-rich';

// SN63 — Enigma. qBittensor Labs cryptanalysis subnet (Q-Day prize challenges).
// No public miner repo published on github.com/qbittensorlabs as of 2026-06-01;
// only third-party derivative SAGE design doc exists. Treat as dormant playbook
// until the team ships an official reference miner. Public surface lives at
// qbittensorlabs.com/enigma and x.com/qBitTensorLabs.

export const sn63: RichPlaybook = {
  slug: '63-enigma',
  netuid: 63,
  name: 'Enigma',
  category: 'reason',
  categoryLabel: 'Reasoning · Cryptanalysis',

  blurb:
    'Cryptographic prize challenges from qBittensor Labs. Miners attack published targets — keys, ciphers, lattice problems — and the first valid break claims a TAO prize pool. No public reference miner has been open-sourced yet.',
  whatMinersDo:
    "An Enigma miner attacks the active cryptographic challenge with whatever combination of classical compute, novel algorithms or quantum-inspired heuristics is most effective, then submits a reproducible proof of break to the validator. Today the challenge mechanics live behind qBittensor Labs' own infrastructure — no canonical open-source miner repo exists.",

  verifiedAt: '2026-06-01',
  verifiedBy: '@editorial',

  emission: '— τ/day',
  burnCostFallback: '— τ',
  minerCountFallback: 0,
  slotCap: 256,

  hardware: [
    {
      role: 'Compute node',
      count: '1+',
      cpuCores: 16,
      ramGb: 64,
      diskGb: 200,
      bandwidth: 'stable broadband',
      notes: 'Highly variable — brute-force runs on big GPU/CPU farms; an algorithmic breakthrough can be mined from a laptop. No official min-compute spec published.',
    },
  ],
  hardwareNote:
    'qBittensor Labs has not published an official miner reference or minimum-compute file. Sizing is workload-specific.',

  rentalOk: true,

  repo: {
    url: 'https://www.qbittensorlabs.com/enigma',
    branch: 'n/a',
    extraRepos: [
      { name: 'SAGE-Enigma-Subnet (third-party)', url: 'https://github.com/jbequ5/SAGE-Enigma-Subnet', purpose: 'Community design doc — not an official miner' },
    ],
  },

  setupShape: 'simple-binary',
  setupOverview:
    'No canonical open-source miner repo from qBittensor Labs at time of writing. Operators are pointed to qbittensorlabs.com/enigma and the @qBitTensorLabs handle for challenge specs and submission instructions. Treat this playbook as a stub until the team ships a reference implementation.',

  install: [
    { step: 'Watch for the official miner repo + challenge spec',
      note: 'qBittensor Labs publishes via Medium and X — subscribe to @qBitTensorLabs for the first reference miner drop.' },
    { step: 'Register hotkey on SN63 once you have a working attack',
      cmd:  'btcli subnet register --netuid 63 --wallet.name $WALLET --wallet.hotkey $HOTKEY' },
  ],

  runSteps: [
    { step: 'No public run command — submission flow is operator-defined',
      note: 'Check qbittensorlabs.com/enigma for the current challenge and submission endpoint.' },
  ],

  envVars: [
    { name: 'WALLET', description: 'Coldkey name', required: true },
    { name: 'HOTKEY', description: 'Hotkey name',  required: true },
  ],

  scoring: {
    summary:
      'Validator publishes a target + break condition + prize pool. The first miner to submit a cryptographically reproducible break claims the prize; the technique is then open-sourced and the next challenge starts from a higher floor.',
    rule: 'First valid, reproducible break wins. No partial credit, no subjective grading.',
    cheatPath: 'Submitting an unreproducible break or fabricated proof — verification is deterministic and public.',
  },

  profitability: {
    estimatedDailyEmissionPerUid: 0.0,
    tokenPriceUsdFallback: 284,
    notes:
      'Reward shape is prize-pool, not steady-state per-tempo. Expect long zero-emission stretches punctuated by large single-event payouts on a successful break.',
  },

  milestones: [
    { day: 'day 1', target: 'Track @qBitTensorLabs + qbittensorlabs.com/enigma for active challenge spec', note: 'No miner can be set up without the current challenge target.' },
  ],

  monitoring: [
    { metric: 'Active challenge spec', threshold: 'published', where: 'qbittensorlabs.com/enigma' },
    { metric: 'Per-tempo incentive',   threshold: 'event-driven', where: 'btcli subnet metagraph --netuid 63' },
  ],

  knownIssues: [
    {
      symptom: 'No public reference miner to start from',
      cause:   "qBittensor Labs hasn't published an open-source miner; only the SAGE design doc exists from a third party.",
      fix:     "Wait for an official drop, or build directly against the challenge spec at qbittensorlabs.com/enigma.",
    },
  ],

  notes: [
    'qBittensor Labs also operates SN48 (Quantum Compute) — the two share a "quantum-on-Bittensor" thesis.',
    'Treat this page as a stub. Re-verify monthly until the team ships a canonical miner repo.',
  ],
};
