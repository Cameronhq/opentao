import type { RichPlaybook } from '../playbook-rich';

// SN115 — HashiChain. Layer-1 for agent coordination with TEE-based solver
// nodes. As of June 2026 the public repo (hashi115/hashichain) contains only
// the conceptual README + LICENSE + assets — no setup code, no scoring spec,
// no miner client. This playbook reflects what's public; treat as preview.

export const sn115: RichPlaybook = {
  slug: '115-hashichain',
  netuid: 115,
  name: 'HashiChain',
  category: 'reason',
  categoryLabel: 'Reasoning / Agents',

  blurb:
    'TEE-based solver subnet for agent-intent settlement. Public repo currently spec-only — no miner code, no install steps, no scoring rules published as of June 2026.',

  whatMinersDo:
    "The published design has miners running 'Solver Nodes' — distributed AI models inside Trusted Execution Environments (Intel SGX / AMD SEV) that simulate agent intents in secure sandboxes and propose semantically compatible settlements. As of June 2026 no reference miner client, install script, or scoring rule has been published; treat this entry as architectural preview.",

  verifiedAt: '2026-06-01',
  verifiedBy: '@editorial',

  emission: '— τ/day',
  burnCostFallback: '— τ',
  minerCountFallback: 0,
  slotCap: 256,

  hardware: [
    {
      role: 'TEE solver node (planned)',
      count: '1',
      gpu: 'inference GPU (model TBD)',
      vramGb: 24,
      cpuCores: 16,
      ramGb: 64,
      diskGb: 500,
      bandwidth: 'static IP',
      notes: 'CPU must support a TEE — Intel SGX, AMD SEV, or equivalent. Attestation chain back to the silicon vendor required. Hardware spec is design-implied; no official sheet published.',
    },
  ],

  rentalOk: false,
  rentalNote:
    'Rental availability for TEE-enabled compute is limited; most cloud providers expose SGX/SEV only on specific SKUs. The design implies physical-machine attestation, which rules out most consumer rental marketplaces.',

  repo: {
    url: 'https://github.com/hashi115/hashichain',
    branch: 'main',
    minerEntrypoint: 'TBD — no miner client published as of June 2026',
  },

  setupShape: 'simple-binary',
  setupOverview:
    "No public setup guide exists. The current repo (hashi115/hashichain) contains README.md, LICENSE (MIT), .gitignore, and assets/intro.png — that is the entire public footprint. Anyone planning to mine SN115 must wait for the team to publish the Solver Node reference implementation.",

  install: [
    { step: 'Watch the repo for Solver Node release',
      cmd:  'git clone https://github.com/hashi115/hashichain && cd hashichain',
      note: 'Today this gets you the spec README only — no code to install.' },
    { step: 'Procure TEE-capable hardware (planned)',
      note: 'Intel SGX-enabled Xeon or AMD SEV-SNP server. Verify attestation chain works before committing.' },
    { step: 'Register hotkey on SN115 (when miner client ships)',
      cmd:  'btcli subnet register --netuid 115 --wallet.name $WALLET --wallet.hotkey $HOTKEY' },
  ],

  runSteps: [
    { step: 'Run Solver Node (TBD)',
      note: 'No published command. Track repo + team channels for the binary or container that ships first.' },
  ],

  envVars: [
    { name: 'WALLET', description: 'Coldkey name', required: true },
    { name: 'HOTKEY', description: 'Hotkey name',  required: true },
  ],

  scoring: {
    summary:
      'Design: validators issue agent intents, multiple solvers simulate inside TEEs and propose settlements, validators score on probabilistic semantic compatibility plus TEE attestation. No deterministic scoring formula or reference implementation has been published.',
    rule: 'Produce a TEE-attested settlement that agrees with the cross-solver consensus on semantic compatibility.',
    cheatPath:
      "Running the simulation outside a TEE (no attestation) zeros emission by design. Proposing settlements that diverge from consensus also zeros — but the consensus rule itself isn't published in code yet.",
  },

  profitability: {
    estimatedDailyEmissionPerUid: 0.0,
    tokenPriceUsdFallback: 284,
    capexNote:
      "TEE-capable hardware is meaningfully more expensive than general-purpose compute; SGX/SEV servers carry an enterprise premium. Don't commit capex until the miner client ships.",
  },

  milestones: [
    { day: 'day 1',  target: 'Track public release',           note: 'Watch hashi115/hashichain for commits beyond the spec README.' },
    { day: 'day 30', target: 'Solver Node reference shipped',  note: 'Re-evaluate this playbook once code and scoring rules are public.' },
  ],

  monitoring: [
    { metric: 'Repo activity',  threshold: 'new commits beyond README', where: 'github.com/hashi115/hashichain' },
  ],

  knownIssues: [
    {
      symptom: 'Nothing to install',
      cause:   'No public miner client as of June 2026.',
      fix:     'Wait for the team to publish reference code; track repo + any X/Discord channel the operator surfaces.',
    },
  ],

  notes: [
    'Public footprint as of June 2026 is the README spec, MIT LICENSE, and one intro image. Treat the design as a thesis, not a runbook.',
    "Yuma consensus is repurposed as the validity layer for agent-intent compatibility — novel design, unimplemented in public.",
    'Long-horizon bet — value depends on autonomous-agent commerce materializing. No reason to commit capex before code ships.',
  ],
};
