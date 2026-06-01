import type { RichPlaybook } from '../playbook-rich';

// SN15 — ORO. Source: github.com/ORO-AI/oro README + docs.oroagents.com (2026-06).

export const sn15: RichPlaybook = {
  slug: '15-oro',
  netuid: 15,
  name: 'ORO',
  category: 'reason',
  categoryLabel: 'AI agent · commerce',

  blurb:
    'AI shopping agents evaluated on Bittensor. Miners write Python agents that solve real shopping tasks (ShoppingBench, 2.5M real products); validators run each agent in a Docker sandbox and score against ground truth.',

  whatMinersDo:
    "A miner writes a Python module exposing an `agent_main()` function. Inside a validator-run Docker sandbox the agent has access to tools — `find_product`, `view_product_information`, `recommend_product` — over a 2.5M-product index. The agent must reach the correct product, satisfy field constraints, and complete the requested action. The best-scoring agent on the leaderboard becomes the king and earns emissions; challengers must exceed a decaying score threshold to dethrone it.",

  verifiedAt: '2026-06-01',
  verifiedBy: '@editorial',

  emission: '— τ/day',
  burnCostFallback: '— τ',
  minerCountFallback: 0,
  slotCap: 256,

  hardware: [
    {
      role: 'Miner dev box',
      count: '1',
      cpuCores: 4,
      ramGb: 16,
      diskGb: 50,
      bandwidth: 'standard',
      notes: 'Miners write/test agents locally in Docker; the heavy sandbox runs on the validator side.',
    },
  ],
  hardwareNote:
    'Validator-side hardware is heavier — 16+ GB RAM, 32 GB recommended, Docker. Miners only need a dev environment that can build and test the agent container locally.',

  rentalOk: true,
  rentalUsdPerHr: { lambda: 0.40, runpod: 0.34, coreweave: 0.50 },

  repo: {
    url: 'https://github.com/ORO-AI/oro',
    branch: 'main',
    minerEntrypoint: 'src/agent/agent.py (reference agent)',
    extraRepos: [
      { name: 'docs', url: 'https://docs.oroagents.com', purpose: 'Miner quickstart, agent interface, local testing' },
      { name: 'leaderboard', url: 'https://oroagents.com', purpose: 'Live leaderboard of scoring agents' },
    ],
  },

  setupShape: 'docker-compose',
  setupOverview:
    'ORO uses Docker Compose with a `validator` profile and a separate miner-agent workflow. Miners build a Python agent against the ORO interface, test it locally with Docker, then submit through the platform. Validators clone the repo, set .env, and `docker compose --profile validator up`.',

  install: [
    { step: 'Clone the repo',
      cmd:  'git clone https://github.com/ORO-AI/oro.git && cd oro' },
    { step: 'Copy and fill env',
      cmd:  'cp .env.example .env',
      note: 'Set WALLET_NAME and WALLET_HOTKEY (and the validator-side keys if running a validator).' },
    { step: 'Read the miner quickstart',
      cmd:  'open https://docs.oroagents.com/docs/miners/quick-start',
      note: 'Walks through writing agent_main(), wiring tools, and local Docker testing.' },
    { step: 'Implement your agent',
      note: 'Reference agent at src/agent/agent.py — define agent_main() and use find_product / view_product_information / recommend_product.' },
    { step: 'Register hotkey on SN15',
      cmd:  'btcli subnet register --netuid 15 --wallet.name $WALLET_NAME --wallet.hotkey $WALLET_HOTKEY' },
  ],

  runSteps: [
    { step: 'Test agent locally with Docker',
      note: 'Follow docs.oroagents.com Local Testing guide — runs the same sandbox the validator uses.' },
    { step: 'Submit the agent',
      note: 'Submission flow per Miner Quickstart — the agent is fetched by validators, run in sandbox, scored against ShoppingBench.' },
    { step: 'Watch the leaderboard',
      cmd:  'open https://oroagents.com',
      note: 'The king holds emissions; challengers need a passing margin over a decaying threshold to take over.' },
  ],

  envVars: [
    { name: 'WALLET_NAME',   description: 'Coldkey name (matches btcli wallet list)',         required: true },
    { name: 'WALLET_HOTKEY', description: 'Hotkey name on that coldkey',                       required: true },
  ],

  scoring: {
    summary:
      'Validators run each miner agent inside an isolated Docker sandbox against the ShoppingBench problem suite (2.5M real products). Scoring combines ground-truth accuracy, format compliance, and field matching. Top-of-leaderboard becomes the king; challengers must exceed a decaying score threshold to take the top spot, which prevents trivial improvements from churning the leader.',
    rule: 'Build the agent that solves the most ShoppingBench problems correctly with valid output format.',
    sourcePath: 'ORO-AI/oro · src/agent/ + validator pipeline',
    cheatPath:
      "Don't memorize product IDs from prior tasks — the benchmark draws from 2.5M products and rotates. Don't return fixed format-passing junk — ground-truth field matching catches it. Don't try to escape the Docker sandbox — submissions are isolated and audited.",
  },

  profitability: {
    estimatedDailyEmissionPerUid: 0.0,
    tokenPriceUsdFallback: 284,
    capexNote:
      'King-of-the-hill economics: one agent holds the bulk of emission; everyone else earns very little until they dethrone it. Plan to iterate on the agent across days/weeks, not minutes.',
  },

  milestones: [
    { day: 'day 1',  target: 'Reference agent running locally in Docker',
      note: 'Clone, set .env, run src/agent/agent.py through the local test harness against the sample episode set.' },
    { day: 'day 3',  target: 'Hotkey registered, first submission accepted',
      note: 'Submission visible on the leaderboard with a non-zero score; verify validator-side logs show your agent ran.' },
    { day: 'day 7',  target: 'Above-median leaderboard rank',
      note: 'Improve product search and field-matching — accuracy first, format compliance second.' },
    { day: 'day 14', target: 'Within 2× of the king',
      note: 'If you are within the decaying threshold of the king, prepare a focused push — submitting weak iterations near the top is wasteful.' },
  ],

  monitoring: [
    { metric: 'Agent local score on ShoppingBench sample', threshold: 'rising',  where: 'Local Docker test harness' },
    { metric: 'Leaderboard rank',                          threshold: 'top decile', where: 'https://oroagents.com' },
    { metric: 'Submission acceptance rate',                threshold: '100%',     where: 'Submission API response / validator logs' },
    { metric: 'Hotkey incentive',                          threshold: 'rising or flat', where: 'btcli subnet metagraph --netuid 15' },
  ],

  knownIssues: [
    {
      symptom: 'Agent times out inside the sandbox',
      cause:   'Heavy synchronous work / unbounded loops in agent_main().',
      fix:     'Profile locally with the same Docker image; cap each tool call and short-circuit on the first valid recommendation.',
    },
    {
      symptom: 'Submission accepted but score is 0',
      cause:   'Output format mismatch — recommend_product called with wrong fields, or the agent returns before calling it.',
      fix:     'Re-read docs.oroagents.com Agent Interface — the validator scores both accuracy AND format compliance.',
    },
    {
      symptom: 'King never changes despite local improvements',
      cause:   'Challenger threshold is decaying but you have not exceeded it yet.',
      fix:     'Submit fewer, stronger iterations; the threshold protects against trivial churn so small improvements get rejected by design.',
    },
  ],

  notes: [
    'ShoppingBench paper: arxiv.org/abs/2508.04266 — read it before tuning the agent.',
    'Full docs at docs.oroagents.com cover agent interface, local testing, and validator config.',
    'Validators bundle a local Prometheus on 127.0.0.1:9090 with a prebuilt Grafana dashboard at docker/prometheus/dashboards/oro-validator.json.',
  ],
};
