import type { RichPlaybook } from '../playbook-rich';

// SN47 — EvolAI in the supplied subnet dossier, but our cross-checks against
// taostat/subnets-infos resolve netuid 47 to "Condense AI" (neural token
// compression). The local subnet data uses the EvolAI naming, so we honor that
// slug. Public documentation is THIN — no canonical miner README, no published
// hardware spec. This playbook is conservative; verify the active operator's
// repo on the Bittensor subnets directory and Discord before deploying capital.

export const sn47: RichPlaybook = {
  slug: '47-evolai',
  netuid: 47,
  name: 'EvolAI',
  category: 'llm',
  categoryLabel: 'LLM Evaluation',

  blurb:
    'Decentralized LLM model-evaluation network. AI researchers submit custom language models; a distributed pool of validators returns scored evaluations against an open rubric. Operator and roadmap detail is publicly thin as of 2026-06-01 — verify the active repo before deploying.',

  whatMinersDo:
    'In the documented EvolAI design, miners host LLM models that are graded by validator panels against an open evaluation rubric. The differentiation vs. a single-host leaderboard is the panel-of-validators scoring and open model submission. Specific operator-side endpoints and a canonical miner repo are not publicly disclosed; cross-checks against taostat resolve netuid 47 to "Condense AI" (token compression). Either way, expect a GPU-hosting role serving model outputs to validators.',

  verifiedAt: '2026-06-01',
  verifiedBy: '@editorial',

  emission: '— τ/day',
  burnCostFallback: '— τ',
  minerCountFallback: 0,
  slotCap: 256,

  hardware: [
    {
      role: 'GPU host (provisional)',
      count: '1',
      gpu: 'A6000 / L40S / H100 class (depends on submitted model size)',
      vramGb: 48,
      cpuCores: 16,
      ramGb: 64,
      diskGb: 500,
      bandwidth: '1 Gbps',
      notes: 'Provisional spec inferred from comparable LLM-serving subnets. Verify the actual operator min-compute before purchasing hardware.',
    },
  ],
  hardwareNote:
    'No canonical min_compute.yml is publicly published. Treat hardware as inferred — confirm with the operator team on Discord before any capex.',

  rentalOk: true,
  rentalUsdPerHr: { lambda: 1.49, runpod: 1.39, coreweave: 1.59 },

  repo: {
    url: 'https://bittensor.ai/subnets/47',
    branch: 'main',
  },

  setupShape: 'simple-binary',
  setupOverview:
    'No canonical miner repo or README is publicly indexed for SN47 as of 2026-06-01. Recommended path: (1) confirm the current operator from the Bittensor subnets directory and Discord. (2) clone their published miner repo if one exists. (3) follow their README — do NOT extrapolate from generic Bittensor templates because the scoring rubric is operator-specific.',

  install: [
    { step: 'Confirm the current SN47 operator',
      note: 'Check https://bittensor.ai/subnets/47, taostats.io/subnets/47, and the Bittensor Discord #subnets channel.' },
    { step: 'Locate the operator-published miner repo',
      note: 'There is no canonical public miner repo we can endorse here as of 2026-06-01.' },
    { step: 'Follow the operator README verbatim',
      note: 'Generic Bittensor neuron templates will NOT score on this subnet — the rubric is operator-specific.' },
    { step: 'Register your hotkey on SN47 (only after confirming the operator)',
      cmd:  'btcli subnet register --netuid 47 --wallet.name $WALLET --wallet.hotkey $HOTKEY' },
  ],

  runSteps: [
    { step: 'Run the operator\'s miner per their README',
      note: 'No standardized run command is publicly documented.' },
    { step: 'Verify on metagraph',
      cmd:  'btcli subnet metagraph --netuid 47' },
  ],

  envVars: [
    { name: 'WALLET', description: 'Bittensor coldkey name', required: true },
    { name: 'HOTKEY', description: 'Bittensor hotkey name',  required: true },
  ],

  scoring: {
    summary:
      'Per the public dossier, EvolAI scores submitted LLMs via a distributed validator panel against an open rubric — model-agnostic. Specific weight aggregation and rubric fields are not publicly published. If the active operator is Condense AI (per taostat lookup), scoring is on neural-token-compression quality, which is a different scoring surface entirely.',
    rule: 'Wait for operator clarity. Mining blindly on an operator-specific rubric you have not read is a path to zero emission.',
    cheatPath:
      "Don't deploy GPU rentals before confirming the operator and reading their actual rubric — there is no generic playbook that scores well on an undocumented subnet.",
  },

  profitability: {
    estimatedDailyEmissionPerUid: 0.0,
    tokenPriceUsdFallback: 284,
    capexNote: 'Hold capex until operator + rubric is confirmed.',
    notes:
      'Public documentation is the thinnest of any subnet in this batch. Treat SN47 as "research first, deploy second".',
  },

  milestones: [
    { day: 'day 0', target: 'Confirm operator + canonical repo',
      note: 'Discord, Twitter, taostats. Do not proceed past this milestone without it.' },
    { day: 'day 1', target: 'Clone operator repo + read README in full',
      note: 'Especially the scoring section. If unclear, ask in their Discord BEFORE registering.' },
    { day: 'day 3', target: 'Baseline miner running per operator instructions',
      note: 'Iterate on the operator-specific rubric.' },
  ],

  monitoring: [
    { metric: 'Operator-defined metrics', threshold: 'per their docs', where: 'Operator dashboard / repo' },
    { metric: 'Per-tempo incentive',      threshold: 'rising',         where: 'btcli subnet metagraph --netuid 47' },
  ],

  knownIssues: [
    {
      symptom: 'Subnet name confusion (EvolAI vs Condense AI)',
      cause:   'Public dossier names this subnet EvolAI; taostat\'s subnets-infos maps netuid 47 to Condense AI. The operator may have changed.',
      fix:     'Verify the CURRENT operator before depositing. Names and operators can change across subnet leases.',
    },
    {
      symptom: 'No public miner repo found',
      cause:   'As of 2026-06-01 there is no widely-indexed canonical repo on GitHub for SN47.',
      fix:     'Ask the operator directly for the miner repo URL. Do not extrapolate from generic templates.',
    },
  ],

  notes: [
    'Public docs are thin. The most important step is verifying the active operator BEFORE any capex.',
    'If taostat is correct and SN47 is currently Condense AI, the actual repo is https://github.com/condenses/neural-condense-subnet — but this contradicts the EvolAI dossier we have on file.',
  ],
};
