import type { RichPlaybook } from '../playbook-rich';

// SN19 — blockmachine. Minimal honest profile: no public miner repo identified
// on GitHub as of 2026-06. Subnet 19 was historically branded "Nineteen"
// under Rayon Labs (vision/inference) before transitioning to the blockmachine
// team; the current operator's miner code is not published in a discoverable
// public repo. Update when a verified repo URL is available.

export const sn19: RichPlaybook = {
  slug: '19-blockmachine',
  netuid: 19,
  name: 'blockmachine',
  category: 'compute',
  categoryLabel: 'Decentralized RPC · archive nodes',

  blurb:
    'Decentralized RPC + archive-node infrastructure. Operator information surfaces at blockmachine.io but a discoverable public miner repository is not currently identified — treat this page as a placeholder pending verified setup docs.',

  whatMinersDo:
    "Per the subnet description, miners run full and archive nodes for the supported chains and serve RPC calls dispatched by validators (block lookups, log filters, archive queries). Validators measure correctness against a trusted ground-truth node, with latency as a tiebreaker. Concrete miner repo, install steps, and env spec are not publicly documented from outside the project as of mid-2026.",

  verifiedAt: '2026-06-01',
  verifiedBy: '@editorial',

  emission: '— τ/day',
  burnCostFallback: '— τ',
  minerCountFallback: 0,
  slotCap: 256,

  hardware: [
    {
      role: 'Archive-node miner',
      count: '1',
      cpuCores: 8,
      ramGb: 32,
      diskGb: 4000,
      bandwidth: 'low-latency, high-throughput',
      notes: 'Archive-grade SSD storage (multi-TB), 32 GB+ RAM, and stable bandwidth are referenced in the subnet description. Concrete per-chain specs are not publicly documented.',
    },
  ],
  hardwareNote:
    'Per-chain hardware spec (which chains the network currently supports, archive vs full requirement per chain) is not in a discoverable public document. Confirm with the operator before provisioning.',

  rentalOk: true,
  rentalUsdPerHr: { lambda: 0.40, runpod: 0.34, coreweave: 0.50 },

  repo: {
    url: 'https://blockmachine.io',
    branch: 'main',
    minerEntrypoint: 'Not publicly documented as of 2026-06',
  },

  setupShape: 'simple-binary',
  setupOverview:
    'Operator surface is the blockmachine.io site; a public GitHub repo with miner setup instructions is not currently identified. Until the operator publishes one, this entry is a placeholder.',

  install: [
    { step: 'Contact the operator',
      note: 'Reach out via blockmachine.io for miner onboarding — the public miner repository is not currently discoverable.' },
    { step: 'Provision archive-grade hardware once specs are confirmed',
      note: 'Archive nodes per supported chain — multi-TB SSD, 32+ GB RAM, stable low-latency bandwidth.' },
    { step: 'Register hotkey on SN19',
      cmd:  'btcli subnet register --netuid 19 --wallet.name $WALLET --wallet.hotkey $HOTKEY' },
  ],

  runSteps: [
    { step: 'Run the miner per operator-provided docs',
      note: 'Specific run command not publicly documented.' },
    { step: 'Verify on metagraph',
      cmd:  'btcli subnet metagraph --netuid 19' },
  ],

  envVars: [
    { name: 'WALLET', description: 'Coldkey name', required: true },
    { name: 'HOTKEY', description: 'Hotkey name on that coldkey', required: true },
  ],

  scoring: {
    summary:
      'Per the subnet description: validator dispatches RPC probes, compares miner response to a trusted ground-truth node. Correctness is binary; latency is a tiebreaker. Archive-only queries weighed more heavily because few operators bother running archive nodes.',
    rule: 'Serve correct RPC responses across the supported chains with the lowest p95 latency. Cover archive state, not just recent blocks.',
    cheatPath:
      "Per the subnet description: returning cached / stale blocks fails freshness checks; proxying to Infura is detectable via TLS fingerprint and rate-limit patterns; skipping archive queries crushes the weighted score.",
  },

  profitability: {
    estimatedDailyEmissionPerUid: 0.0,
    tokenPriceUsdFallback: 284,
    notes:
      'No public earning data, no public miner count, no published target latency budget. Estimate only after the operator publishes a repo.',
  },

  milestones: [
    { day: 'day 1', target: 'Verified operator contact + access to setup docs',
      note: 'Until the operator publishes a public repo, the first step is private onboarding.' },
    { day: 'day 7', target: 'Archive node synced on supported chain',
      note: 'Multi-TB archive state can take days to sync depending on chain.' },
    { day: 'day 14', target: 'Hotkey registered + serving RPC probes',
      note: 'Visible in the metagraph, p95 latency within whatever the operator-published target is.' },
  ],

  monitoring: [
    { metric: 'Probe correctness rate', threshold: '100%', where: 'Operator-published dashboard (not public yet)' },
    { metric: 'p95 RPC latency',         threshold: '< 200 ms', where: 'Operator-published dashboard / local node' },
    { metric: 'Hotkey incentive',         threshold: 'rising or flat', where: 'btcli subnet metagraph --netuid 19' },
  ],

  knownIssues: [
    {
      symptom: 'No public miner repository discoverable as of 2026-06',
      cause:   'Subnet operator has not published a discoverable public miner repo from outside their Discord / website.',
      fix:     'Contact the operator via blockmachine.io. Treat any 3rd-party fork with skepticism until confirmed.',
    },
  ],

  notes: [
    'Subnet 19 was previously branded "Nineteen" under Rayon Labs (vision / inference) — current operator is blockmachine.',
    'Project surface is blockmachine.io; a public GitHub repo is not currently identified.',
    'Upgrade this page once the operator publishes a repo URL + setup docs.',
  ],
  placeholder: true,
};
