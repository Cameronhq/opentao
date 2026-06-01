import type { RichPlaybook } from '../playbook-rich';

// SN114 — SOMA. Operated by Dendrite. Brings MCP servers / competition tasks
// to Bittensor. Current active competition: CoT compression. Miners upload a
// Python solution; the platform evaluates automatically.

export const sn114: RichPlaybook = {
  slug: '114-soma',
  netuid: 114,
  name: 'SOMA',
  category: 'reason',
  categoryLabel: 'Reasoning',

  blurb:
    'MCP / agent-task subnet from Dendrite. Miners upload a Python solution with a main() entry point; the platform evaluates against the active competition (CoT compression as of mid-2026).',

  whatMinersDo:
    "Write a Python function with a main() entry point that solves the active competition task (currently chain-of-thought compression). Upload the solution via the operator's upload script with your hotkey credentials. The platform evaluates submissions automatically and assigns weight across difficulty tiers (Easy / Medium / Hard) and layer combinations — Layer 0 (all tiers), Layer 1 (pairs), Layer 2 (singles), with weights W(L_i) = 1/2^i.",

  verifiedAt: '2026-06-01',
  verifiedBy: '@editorial',

  emission: '— τ/day',
  burnCostFallback: '— τ',
  minerCountFallback: 0,
  slotCap: 256,

  hardware: [
    {
      role: 'Submission node',
      count: '1',
      cpuCores: 4,
      ramGb: 16,
      diskGb: 100,
      bandwidth: 'standard broadband',
      notes: 'Validator minimum spec published: 4 CPU cores, 16 GB RAM, 500 GB SSD. Miner-side compute happens upstream during solution development — at submit time you mostly need network + signing.',
    },
  ],

  rentalOk: true,
  rentalUsdPerHr: { lambda: 0.10, runpod: 0.08, coreweave: 0.12 },

  repo: {
    url: 'https://github.com/DendriteHQ/SOMA',
    branch: 'main',
    minerEntrypoint: 'miner/upload_miner_with_openrouter_key.py',
  },

  setupShape: 'simple-binary',
  setupOverview:
    "SOMA is competition-style, not always-on inference. You develop a solution offline (a Python file with main()), then run the upload script which signs the submission with your hotkey and pushes it to the platform. Evaluation runs server-side on the active competition's task set (currently CoT compression). New competitions cycle; check docs/miner before targeting a specific task.",

  install: [
    { step: 'Clone repo',
      cmd:  'git clone https://github.com/DendriteHQ/SOMA && cd SOMA' },
    { step: 'Create + activate venv',
      cmd:  'python3 -m venv .venv && source .venv/bin/activate' },
    { step: 'Create wallet (if needed)',
      cmd:  'btcli wallet new_coldkey --wallet.name $WALLET && btcli wallet new_hotkey --wallet.name $WALLET --wallet.hotkey $HOTKEY' },
    { step: 'Register hotkey on SN114',
      cmd:  'btcli subnet register --netuid 114 --wallet.name $WALLET --wallet.hotkey $HOTKEY' },
    { step: 'Read docs/miner/miner-setup.md + docs/miner/INCENTIVE_MECHANISM.md',
      note: 'These are the canonical sources for the current competition spec and scoring layout.' },
  ],

  runSteps: [
    { step: 'Write your solution',
      note: 'A Python file with a main() entry point. All imports at the top; no obfuscation. Args and return types depend on the active competition.' },
    { step: 'Upload via the operator script',
      cmd:  'cd miner && python3 miner/upload_miner_with_openrouter_key.py' },
    { step: 'Watch upload output',
      note: 'Expect: wallet loaded, hotkey verified, solution byte count, upload request details, response signature confirmation.' },
  ],

  envVars: [
    { name: 'WALLET', description: 'Coldkey name', required: true },
    { name: 'HOTKEY', description: 'Hotkey name',  required: true },
  ],

  scoring: {
    summary:
      'Tasks are split into Easy / Medium / Hard tiers. Scoring is layered: Layer 0 covers all tiers combined, Layer 1 covers pairs (E+M, E+H, M+H), Layer 2 covers singles. Each layer has weight W(L_i) = 1/2^i; each element inside a layer has weight W(L_i)/|L_i|. Winners take proportional shares; total miner weight is summed across elements they win. Final incentive = (your weight / all weights) × X% (rest goes to burn).',
    rule: 'Win as many task elements across difficulty tiers as possible — wins compound across Layer 0/1/2 because the same solution is graded against multiple slicings.',
    sourcePath: 'docs/miner/INCENTIVE_MECHANISM.md',
    cheatPath:
      "Don't submit obfuscated code — explicitly disallowed; submission is rejected. Don't hard-code outputs for the current task set — competitions rotate and the evaluation includes held-out cases.",
  },

  profitability: {
    estimatedDailyEmissionPerUid: 0.0,
    tokenPriceUsdFallback: 284,
    capexNote:
      'Pure brainpower play. R&D cost is the bottleneck — designing a solution that wins across Easy/Medium/Hard tiers. Submitting is nearly free; iterating well is expensive in time.',
  },

  milestones: [
    { day: 'day 1',  target: 'Hotkey registered, first submission uploaded',
      note: 'Walkthrough docs/miner/miner-setup.md end-to-end. Confirm upload signature in the script output.' },
    { day: 'day 7',  target: 'Score on at least one tier',
      note: 'Easy tier is the cheapest place to land a win and start accruing Layer 0/1/2 share.' },
    { day: 'day 30', target: 'Solution placing across multiple tiers',
      note: "Winning Hard alone is worth more (per element) than winning Easy, but winning across tiers stacks Layer 1 + Layer 0 contributions. Read the example in INCENTIVE_MECHANISM.md to plan." },
  ],

  monitoring: [
    { metric: 'Submission accepted',         threshold: 'signature confirmed', where: 'upload script output' },
    { metric: 'Per-tempo incentive',         threshold: 'rising or flat',      where: 'btcli subnet metagraph --netuid 114' },
    { metric: 'Active competition spec',     threshold: 'tracked',             where: 'SOMA repo docs/ — competitions rotate' },
  ],

  knownIssues: [
    {
      symptom: 'Upload rejected for obfuscation',
      cause:   "Solution uses obfuscated bytecode, lambda packing, or imports inside function bodies.",
      fix:     'All imports at the top of the file. Plain readable Python. main() entry point present.',
    },
    {
      symptom: 'Solution scores 0 across all tiers',
      cause:   "Solving the wrong task — competition rotated and the active task changed.",
      fix:     "Re-read the current docs/miner/ and the announcement channel; rewrite against the live spec.",
    },
    {
      symptom: 'Wallet load failure in upload script',
      cause:   'Coldkey name mismatch, or hotkey not registered on netuid 114.',
      fix:     "Confirm `btcli wallet list` shows the expected wallet, and `btcli subnet metagraph --netuid 114` lists your hotkey UID.",
    },
  ],

  notes: [
    'Built and operated by Dendrite (50+ engineers / mathematicians). SOMA brands as "Bridge for Intelligence" — MCP framing in marketing, competition-task framing in the current incentive mechanism.',
    'Active competition as of mid-2026 is CoT compression — expect rotation to other MCP-style tool tasks over time.',
    'The upload script references an OpenRouter key — check docs for whether your solution needs to call out to OpenRouter at evaluation time.',
  ],
};
