import type { RichPlaybook } from '../playbook-rich';

// SN20 — GroundLayer. Pre-launch as of 2026-06. The project surface is
// groundlayer.xyz with gated registration; no public miner repo or scoring
// spec has been published. This is a placeholder pending the public launch.

export const sn20: RichPlaybook = {
  slug: '20-groundlayer',
  netuid: 20,
  name: 'GroundLayer',
  category: 'data',
  categoryLabel: 'Capital markets · OTC',

  blurb:
    'A capital-layer subnet — structured OTC deals for subnet tokens. Pre-launch as of mid-2026; subnet-mining mechanics have not yet been publicly published.',

  whatMinersDo:
    "Per the GroundLayer architecture, the expected miner role is deal-state indexing and query-serving — indexing every active and historical deal and serving correct, low-latency responses to validator probes about deal terms, lockup schedules, fill rates, and fund-manager performance. The specific reference miner, scoring spec, and reward rubric have not been publicly published as of mid-2026.",

  verifiedAt: '2026-06-01',
  verifiedBy: '@editorial',

  emission: '— τ/day',
  burnCostFallback: '— τ',
  minerCountFallback: 0,
  slotCap: 256,

  hardware: [
    {
      role: 'Indexer / API node',
      count: '1',
      cpuCores: 4,
      ramGb: 16,
      diskGb: 200,
      bandwidth: 'standard',
      notes: 'Lightweight — indexer + database per the public architecture description. No GPU referenced. Concrete spec pending public launch.',
    },
  ],
  hardwareNote:
    'Pre-launch — hardware spec is a reasonable inference from the deal-indexer role and not a confirmed published requirement.',

  rentalOk: true,
  rentalUsdPerHr: { lambda: 0.05, runpod: 0.04, coreweave: 0.06 },

  repo: {
    url: 'https://www.groundlayer.xyz',
    branch: 'main',
    minerEntrypoint: 'Not publicly documented as of 2026-06',
  },

  setupShape: 'simple-binary',
  setupOverview:
    'GroundLayer is pre-launch. The site groundlayer.xyz accepts registrations across three lanes (investor, fund manager, subnet owner / seller) but the miner reference stack and validator scoring rubric are not yet public.',

  install: [
    { step: 'Register interest on groundlayer.xyz',
      note: 'Three lanes — investor, fund manager, subnet owner. Registration is application-gated as of mid-2026.' },
    { step: 'Wait for public miner repo publication',
      note: 'No public reference miner or validator code as of 2026-06.' },
    { step: 'Register hotkey on SN20 when miner spec is published',
      cmd:  'btcli subnet register --netuid 20 --wallet.name $WALLET --wallet.hotkey $HOTKEY' },
  ],

  runSteps: [
    { step: 'Pending public miner spec',
      note: 'No published run command. This page updates when the launch reference stack lands.' },
  ],

  envVars: [
    { name: 'WALLET', description: 'Coldkey name', required: true },
    { name: 'HOTKEY', description: 'Hotkey name on that coldkey', required: true },
  ],

  scoring: {
    summary:
      'Pre-launch. Per the public architecture, the expected scoring direction is correctness-first + freshness-second on deal-state queries, with the long tail of rare deal types weighted in by validator probe distribution. The exact rubric is not yet published.',
    rule: 'Index deal state accurately and serve fresh, correct responses to validator probes.',
    cheatPath:
      "Per the published architecture: stale data on recently-amended deals fails the freshness check; fabricated fund-manager performance is cross-checked against on-chain history; skipping rare deal types is caught by the validator probe distribution.",
  },

  profitability: {
    estimatedDailyEmissionPerUid: 0.0,
    tokenPriceUsdFallback: 284,
    notes:
      'No earning data — pre-launch.',
  },

  milestones: [
    { day: 'day 1', target: 'Application submitted on groundlayer.xyz',
      note: 'Pick the seller lane if you operate a subnet, fund-manager if you intend to deploy capital, investor if you want allocation.' },
    { day: 'day ?', target: 'Public launch of miner stack',
      note: 'No published timeline as of 2026-06.' },
  ],

  monitoring: [
    { metric: 'Public miner spec published', threshold: 'yes/no', where: 'groundlayer.xyz' },
    { metric: 'Hotkey incentive (post-launch)', threshold: 'rising or flat', where: 'btcli subnet metagraph --netuid 20' },
  ],

  knownIssues: [
    {
      symptom: 'No miner repo, scoring spec, or setup docs publicly available',
      cause:   'Subnet 20 is pre-launch / gated as of mid-2026.',
      fix:     'Register on groundlayer.xyz. This page updates when the public launch ships.',
    },
  ],

  notes: [
    'Subnet 20 previously hosted BitAgent / Rizzo Network and Bounty Hunter; the current operator is GroundLayer.',
    'Surface is gated by application at groundlayer.xyz across three lanes — investors, fund managers, subnet owners.',
    'Treat anyone selling a "GroundLayer miner repo" before public launch with skepticism.',
  ],
  placeholder: true,
};
