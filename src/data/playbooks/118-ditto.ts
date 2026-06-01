import type { RichPlaybook } from '../playbook-rich';

// SN118 — Ditto / DittoSN118 ("Open-Source Claude Cowork"). No public GitHub
// org / setup repo discoverable as of June 2026 — registry listing only,
// ~9 validators, minimal footprint. This playbook reflects the public framing.

export const sn118: RichPlaybook = {
  slug: '118-ditto',
  netuid: 118,
  name: 'Ditto',
  category: 'reason',
  categoryLabel: 'Reasoning / Agents',

  blurb:
    'Open-Source Claude Cowork — miners run multi-agent loops (planner / executor / critic) and submit completed work artifacts for grading. No public setup repo as of June 2026.',

  whatMinersDo:
    "Run a Claude-style cowork agent team: a planner decomposes the task, an executor produces draft output, a critic reviews, and a reviser improves. Each validator-issued task exercises that loop end-to-end. The final artifact is graded for completeness, correctness, and adherence to the task spec. Single-shot prompting loses against real multi-agent loops in the rubric.",

  verifiedAt: '2026-06-01',
  verifiedBy: '@editorial',

  emission: '— τ/day',
  burnCostFallback: '— τ',
  minerCountFallback: 0,
  slotCap: 256,

  hardware: [
    {
      role: 'Cowork orchestration node',
      count: '1',
      cpuCores: 8,
      ramGb: 32,
      diskGb: 100,
      bandwidth: 'standard broadband',
      notes: 'No GPU required if you call hosted Claude / compatible APIs. Local inference would need substantial GPU; most miners are expected to broker hosted models inside the cowork loop.',
    },
  ],

  rentalOk: true,
  rentalUsdPerHr: { lambda: 0.20, runpod: 0.18, coreweave: 0.22 },

  repo: {
    url: 'https://taostats.io/subnets/118/',
    branch: 'main',
    minerEntrypoint: 'TBD — no public miner repo discoverable as of June 2026',
  },

  setupShape: 'simple-binary',
  setupOverview:
    "No public miner repo or setup guide is centrally surfaced as of June 2026 — the subnet is listed on bittensor.ai / taostats as 'DittoSN118 — Open-Source Claude Cowork' with about 9 validators and a small footprint. Operators will likely publish a reference cowork loop; until then, anyone targeting SN118 has to track the registry for updates.",

  install: [
    { step: 'Track the registry for repo surfacing',
      note: 'taostats.io/subnets/118 and bittensor.ai/subnets — watch for operator-published GitHub or website link.' },
    { step: 'Prepare a cowork stack',
      note: 'Pick a multi-agent framework (CrewAI / AutoGen / hand-rolled) wired to Claude or a compatible API. Build planner / executor / critic / reviser loop locally.' },
    { step: 'Register hotkey on SN118 (when miner client ships)',
      cmd:  'btcli subnet register --netuid 118 --wallet.name $WALLET --wallet.hotkey $HOTKEY' },
  ],

  runSteps: [
    { step: 'Run cowork loop (TBD)',
      note: 'No published reference command. Implementation will look like: serve an axon endpoint that accepts a task spec, runs your multi-agent loop, returns the final artifact.' },
  ],

  envVars: [
    { name: 'WALLET',             description: 'Coldkey name',                                              required: true },
    { name: 'HOTKEY',             description: 'Hotkey name',                                               required: true },
    { name: 'ANTHROPIC_API_KEY',  description: 'Anthropic API key (if loop calls Claude directly)',         required: false },
    { name: 'OPENROUTER_API_KEY', description: 'OpenRouter key for compatible model access (alternative)', required: false },
  ],

  scoring: {
    summary:
      'Validator issues multi-step tasks (research / write / code / analyze). Final artifact is graded on completeness, correctness, and adherence to the spec — likely against a reference solution or rubric. Multi-agent cowork structure is what is rewarded; single-shot calls underperform.',
    rule: 'Run a real cowork loop and ship a complete, correct, on-spec artifact within the task budget.',
    cheatPath: "Single-shot prompting without the cowork loop fails the rubric — the task design rewards the structural pattern, not raw inference quality.",
  },

  profitability: {
    estimatedDailyEmissionPerUid: 0.0,
    tokenPriceUsdFallback: 284,
    capexNote:
      'Low capex. Opex dominated by per-call model spend (Claude / OpenRouter). Heavy task corpora can become expensive if your loop does many critique/revise turns per task.',
  },

  milestones: [
    { day: 'day 1',  target: 'Track repo + spec release',
      note: 'No public install path yet. Watch the registry and any operator-surfaced channel.' },
    { day: 'day 7',  target: 'Local cowork loop demonstrably better than single-shot',
      note: 'Bench against a small task set — if your loop does not beat plain prompting, it will not score.' },
    { day: 'day 30', target: 'Hotkey live (assuming spec ships)',
      note: 'Re-read this playbook once Ditto publishes a miner repo + scoring spec.' },
  ],

  monitoring: [
    { metric: 'Repo / spec surfacing',  threshold: 'public link available', where: 'taostats.io/subnets/118 + bittensor.ai/subnets' },
    { metric: 'Per-tempo incentive',    threshold: 'rising or flat',         where: 'btcli subnet metagraph --netuid 118' },
  ],

  knownIssues: [
    {
      symptom: 'No miner code to install',
      cause:   'Operator has not published a public reference repo as of June 2026.',
      fix:     'Watch registry; consider engaging operator directly via any public X / Discord channel that surfaces.',
    },
    {
      symptom: 'Cowork loop times out before producing an artifact',
      cause:   'Too many critique/revise turns; each turn is a model call with its own latency tail.',
      fix:     'Cap turns explicitly (planner → executor → critic → reviser → done); skip revision if critic score is above threshold.',
    },
  ],

  notes: [
    'Public footprint as of June 2026 is a registry listing only; ~9 validators, small miner cohort.',
    "Brand: 'Open-Source Claude Cowork' — implies the cowork pattern is the product, not any specific model.",
    'Worth revisiting once the operator publishes a GitHub repo or website.',
  ],
};
