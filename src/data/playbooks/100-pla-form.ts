import type { RichPlaybook } from '../playbook-rich';

// SN100 — Plaτform. Cortex Foundation. Multi-challenge sub-subnet platform.
// Early-launch state — production challenge marketplace still being stood up
// (website "Coming Soon" as of late 2025/early 2026). No public miner repo
// with a battle-tested install script yet. Treat this playbook as a scaffold
// that records the announced architecture; expect changes when the live
// marketplace ships.

export const sn100: RichPlaybook = {
  slug: '100-pla-form',
  netuid: 100,
  name: 'Plaτform',
  category: 'compute',
  categoryLabel: 'Compute',

  blurb:
    'Multi-challenge sub-subnet platform — researchers register tasks via a Challenge SDK and share TAO emissions. Miners pick which sub-challenges to compete in; hardware depends entirely on the challenge.',

  whatMinersDo:
    "A Plaτform miner registers against one or more sub-challenges defined via the Challenge SDK and runs whatever model or pipeline that challenge requires — there is no single 'Plaτform model' the way there is on a normal subnet. The miner pulls task batches from Platform-API, returns per-challenge inference outputs, and is scored by each challenge's own scoring function before the validator aggregates across challenges into one weight vector.",

  verifiedAt: '2026-06-01',
  verifiedBy: '@editorial',

  emission: '— τ/day',
  burnCostFallback: '— τ',
  minerCountFallback: 0,
  slotCap: 256,

  hardware: [
    {
      role: 'GPU node',
      count: '1 per sub-challenge slot',
      gpu: 'Challenge-dependent (LLM/vision/audio sub-challenges have different needs)',
      vramGb: 24,
      cpuCores: 8,
      ramGb: 32,
      diskGb: 200,
      bandwidth: 'public IP · 1 Gbps',
      notes: 'Plaτform is challenge-agnostic by design — size the node to the heaviest sub-challenge you plan to enter. A 24 GB card is the minimum we would budget for the LLM-class challenges most teams have publicly proposed.',
    },
  ],
  hardwareNote:
    "Hardware floor is determined by the sub-challenges you join, not the subnet itself. The Cortex Foundation has not published a canonical reference rig.",

  rentalOk: true,
  rentalUsdPerHr: { lambda: 1.99, runpod: 1.89, coreweave: 2.10 },

  repo: {
    url: 'https://github.com/cortex-foundation',
    branch: 'main',
    extraRepos: [
      { name: 'Platform',         url: 'https://github.com/cortex-foundation', purpose: 'On-chain coordinator (org-level link — specific repo names per Cortex Foundation announcements)' },
      { name: 'Platform-API',     url: 'https://github.com/cortex-foundation', purpose: 'Public endpoint + challenge router' },
      { name: 'Challenge SDK',    url: 'https://github.com/cortex-foundation', purpose: 'Bring-your-own-challenge SDK — task, scoring, reward share' },
    ],
  },

  setupShape: 'simple-binary',
  setupOverview:
    "Setup is a two-step model that is still being finalised: install the Plaτform miner client, then enrol against each sub-challenge you want to compete in. Each sub-challenge ships its own per-challenge runtime requirements via the Challenge SDK — read those before sizing hardware.",

  install: [
    { step: 'Clone the Plaτform miner repo (when published)',
      cmd:  'git clone https://github.com/cortex-foundation/platform && cd platform',
      note: 'Specific repo name will be confirmed once the marketplace ships; the org-level link above is canonical.' },
    { step: 'Install Python dependencies in a venv',
      cmd:  'python -m venv .venv && source .venv/bin/activate && pip install -e .' },
    { step: 'Configure Platform-API endpoint + wallet',
      cmd:  'cp .env.example .env && $EDITOR .env',
      note: 'Set WALLET / HOTKEY / NETUID=100 and the Platform-API URL once published.' },
    { step: 'Register your hotkey on SN100',
      cmd:  'btcli subnet register --netuid 100 --wallet.name $WALLET --wallet.hotkey $HOTKEY' },
    { step: 'Enrol against the sub-challenges you want to run',
      note: 'Each Challenge SDK task has its own enrolment flow defined by the challenge author.' },
  ],

  runSteps: [
    { step: 'Start the miner against Platform-API',
      cmd:  'python -m neurons.miner --netuid 100 --wallet.name $WALLET --wallet.hotkey $HOTKEY' },
    { step: 'Watch sub-challenge dispatch + score',
      note: 'Per-challenge logs surface which tasks are being routed and how your aggregate weight is evolving.' },
  ],

  envVars: [
    { name: 'WALLET',          description: 'Coldkey name',                                         required: true },
    { name: 'HOTKEY',          description: 'Hotkey name',                                          required: true },
    { name: 'NETUID',          description: 'Subnet UID — 100 for Plaτform',                       required: true },
    { name: 'PLATFORM_API_URL',description: 'Plaτform-API endpoint (published by Cortex Foundation)', required: true },
  ],

  scoring: {
    summary:
      "Each sub-challenge defines its own scoring rule via the Challenge SDK (accuracy, latency, ranking, or custom). Validators run that scoring function against your outputs, then aggregate per-challenge scores into one weight per miner using Plaτform's published aggregation policy.",
    rule:
      'Earn by ranking high on the specific sub-challenges you enrol in. Aggregation across challenges is the platform-level lever — picking the right challenges is itself the strategy.',
    cheatPath:
      "Over-specialising on one trivial sub-challenge and ignoring the rest only works if the aggregation rule rewards narrow wins — the team's stated design discourages this. The opposite failure (a Challenge SDK task with a weak scoring function) is bounded by Plaτform's admission policy for sub-challenges.",
  },

  profitability: {
    estimatedDailyEmissionPerUid: 0.0,
    tokenPriceUsdFallback: 284,
    notes:
      'Production marketplace still being stood up — emissions per UID are not yet meaningful enough to estimate. Treat any pre-launch capex as speculative.',
  },

  milestones: [
    { day: 'day 1', target: 'Hotkey registered, miner connected to Platform-API', note: 'btcli metagraph shows your UID; logs show successful enrolment against at least one sub-challenge.' },
    { day: 'day 3', target: 'Per-challenge scores arriving', note: 'You should see at least one sub-challenge returning a non-zero score in your logs.' },
    { day: 'day 7', target: 'Aggregated weight non-zero', note: 'btcli subnet metagraph --netuid 100 shows incentive > 0.' },
    { day: 'day 14', target: 'Out of immunity period', note: 'If your aggregate weight is near the floor, consider enrolling in different sub-challenges instead of buying more GPUs.' },
  ],

  monitoring: [
    { metric: 'Platform-API connectivity',     threshold: '100%',          where: 'Miner logs' },
    { metric: 'Sub-challenge enrolment count', threshold: '≥ 1',           where: 'Platform-API dashboard (when published)' },
    { metric: 'Per-challenge score trend',     threshold: 'rising or flat',where: 'Miner logs' },
    { metric: 'Aggregated incentive',          threshold: 'rising or flat',where: 'btcli subnet metagraph --netuid 100' },
  ],

  knownIssues: [
    {
      symptom: 'Aggregated weight stuck at zero',
      cause:   "Either Platform-API can't reach you, or you have not successfully enrolled against any sub-challenge.",
      fix:     'Confirm the Platform-API URL in .env, open the listening port if behind a firewall, and re-run enrolment for at least one sub-challenge.',
    },
    {
      symptom: 'One sub-challenge dominates score, others ignored',
      cause:   'You only enrolled against one challenge, or your stack is mis-sized for the others.',
      fix:     'Plaτform rewards breadth across challenges via its aggregation policy — enrol in at least 2-3 sub-challenges sized to your GPU.',
    },
  ],

  notes: [
    'Production marketplace still being stood up as of mid-2026 — re-check Cortex Foundation channels for the official miner repo URL and Platform-API endpoint before any capex.',
    'Treat this playbook as a scaffold — many parameters will be confirmed at launch.',
  ],
};
