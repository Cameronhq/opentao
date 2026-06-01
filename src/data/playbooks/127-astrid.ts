import type { RichPlaybook } from '../playbook-rich';

// SN127 — Astrid Arena. Operated by Astrid Intelligence PLC (AQSE: ASTR).
// Miners build agents in the astrid-arena-agent repo (Python FastAPI or
// TypeScript Express), test locally with `make simulate`, then ZIP and upload
// to the Arena platform. The validator (sn-127) runs strategies in Docker
// sandboxes and scores on live PnL + risk metrics.

export const sn127: RichPlaybook = {
  slug: '127-astrid',
  netuid: 127,
  name: 'Astrid',
  category: 'reason',
  categoryLabel: 'Trading agents · tournament',

  blurb:
    'AI trading-agent tournament run by a UK-listed PLC (AQSE: ASTR). Miners build strategy servers (Python FastAPI or TypeScript Express) exposing /initialize + /execute, test locally with make simulate, zip with make zip, and upload to Astrid Arena. Validators run strategies in Docker sandboxes and score on live risk-adjusted PnL.',

  whatMinersDo:
    "An Astrid miner is a strategy server. Pick Python (FastAPI) or TypeScript (Express), implement two HTTP endpoints — POST /initialize (called once with 500 historical candles) and POST /execute (called once per trading interval, e.g. every 5 minutes) — and place orders by calling the platform's Order API during /execute. A `strategy.json` manifest describes the strategy. Local development uses `make install && make simulate` (runs strategy server + test-runner locally). For submission you `make zip` to produce a timestamped archive and upload it through the Arena platform.",

  verifiedAt: '2026-06-01',
  verifiedBy: '@editorial',

  emission: '— τ/day',
  burnCostFallback: '— τ',
  minerCountFallback: 0,
  slotCap: 256,

  hardware: [
    {
      role: 'Strategy server',
      count: '1',
      cpuCores: 4,
      ramGb: 8,
      diskGb: 50,
      bandwidth: 'standard broadband · low latency to market feeds preferred',
      notes: 'No GPU required. Strategy logic runs on a small server. The Arena platform handles market data feeds and order execution — your miner only needs to compute decisions.',
    },
  ],
  hardwareNote:
    "Astrid runs the strategy in a Docker sandbox on validator infrastructure — your local hardware only matters during development. Optimise for code quality and strategy logic, not raw compute.",

  rentalOk: true,
  rentalUsdPerHr: { lambda: 0.10, runpod: 0.09, coreweave: 0.12 },

  repo: {
    url: 'https://github.com/astridintelligence/astrid-arena-agent',
    branch: 'main',
    extraRepos: [
      { name: 'sn-127',         url: 'https://github.com/astridintelligence/sn-127',         purpose: 'Validator daemon (Docker sandbox, Bittensor weight management) — read to understand scoring' },
      { name: 'sn-127-install', url: 'https://github.com/astridintelligence/sn-127-install', purpose: 'Validator install scripts (shell)' },
    ],
  },

  setupShape: 'docker-compose',
  setupOverview:
    "Pick Python or TypeScript inside the astrid-arena-agent repo, run `make install && make simulate` to develop locally, iterate on your /initialize + /execute logic, then `make zip` and upload through Astrid Arena (arena.astrid.global). Strategies run inside the validator's Docker sandbox.",

  install: [
    { step: 'Clone the agent template repo',
      cmd:  'git clone https://github.com/astridintelligence/astrid-arena-agent && cd astrid-arena-agent' },
    { step: 'Choose your language',
      cmd:  'cd python   # or: cd typescript',
      note: 'Both stacks are first-class. Python uses FastAPI, TypeScript uses Express.' },
    { step: 'Install dependencies',
      cmd:  'make install',
      note: 'Per-language Makefile target — pulls Python deps or runs npm install.' },
    { step: 'Run a local simulation',
      cmd:  'make simulate',
      note: 'Boots your strategy server, runs the test-runner against it, prints trade summaries. Use this to debug /initialize + /execute before submitting.' },
    { step: 'Register hotkey on SN127',
      cmd:  'btcli subnet register --netuid 127 --wallet.name $WALLET --wallet.hotkey $HOTKEY',
      note: 'Re-check burn cost on taostats.io/subnets/127 immediately before this.' },
  ],

  runSteps: [
    { step: 'Implement /initialize',
      note: 'Called once before the round with 500 historical candles. Use this to load any state your strategy needs at the start of a round.' },
    { step: 'Implement /execute',
      note: 'Called per trading interval (e.g. every 5 minutes). Place orders by calling the platform Order API. The response body carries metadata (signals, reasoning), not order instructions.' },
    { step: 'Configure strategy.json',
      note: 'Manifest file describing strategy metadata. See the docs/ folder of the chosen language stack for the field reference.' },
    { step: 'Package for submission',
      cmd:  'make zip',
      note: 'Generates a timestamped ZIP ready to upload to Astrid Arena.' },
    { step: 'Upload via Astrid Arena',
      note: 'Go to arena.astrid.global, sign in with your hotkey, and upload the ZIP. The validator will sandbox-run your strategy on the next round.' },
    { step: 'Verify on the metagraph',
      cmd:  'btcli subnet metagraph --netuid 127',
      note: "Confirm UID assignment and watch incentive accrue as your strategy is graded across rounds." },
  ],

  envVars: [
    { name: 'WALLET',  description: 'Coldkey name (matches btcli wallet list)', required: true },
    { name: 'HOTKEY',  description: 'Hotkey name on that coldkey',              required: true },
  ],

  scoring: {
    summary:
      "Validators (sn-127 daemon) open trading rounds in Astrid Arena, execute each agent's strategy in a Docker sandbox against live market data, and score on realised PnL over the round, drawdown, Sharpe-style risk-adjusted return, and consistency across rolling rounds. A single lucky round does not dominate — long-run risk-adjusted performance wins.",
    rule: 'Produce risk-adjusted returns that beat other agents consistently across rolling rounds.',
    cheatPath:
      "Pumping a high-variance bet to spike a single round is bounded by drawdown penalties and rolling-round consistency weighting. Front-running validator orders is bounded by trade-execution rules inside the Arena. Overfitting to one market regime is demoted by scoring across diverse rounds.",
  },

  profitability: {
    estimatedDailyEmissionPerUid: 0.0,
    tokenPriceUsdFallback: 284,
    capexNote:
      'Near-zero capex — a small VPS during development is enough. The validator runs your strategy on its own infrastructure post-submission.',
    notes:
      'Astrid Intelligence is a UK-listed PLC (AQSE: ASTR) with mandatory disclosure — corporate IR at investors.astrid.global is the most reliable source for roadmap and KPIs.',
  },

  milestones: [
    { day: 'day 1',  target: 'make simulate runs end-to-end',
      note: 'Strategy server boots, /initialize accepts 500 candles, /execute returns a trade summary.' },
    { day: 'day 7',  target: 'First submission uploaded',
      note: 'ZIP uploaded to arena.astrid.global. UID assigned on-chain.' },
    { day: 'day 14', target: 'First few rounds scored',
      note: 'Risk-adjusted PnL trending. If consistently negative, revisit /execute logic — likely over-trading or missing risk limits.' },
    { day: 'day 30', target: 'Consistent positive Sharpe across rounds',
      note: 'Single big wins matter less than consistent, drawdown-controlled performance.' },
  ],

  monitoring: [
    { metric: 'Local make simulate PnL',     threshold: '> 0',           where: 'make simulate output' },
    { metric: 'Round completion rate',       threshold: '100%',          where: 'Astrid Arena dashboard' },
    { metric: 'Drawdown',                    threshold: 'within policy', where: 'Astrid Arena dashboard' },
    { metric: 'Per-tempo incentive',         threshold: 'rising or flat',where: 'btcli subnet metagraph --netuid 127' },
  ],

  knownIssues: [
    {
      symptom: '/execute times out inside the sandbox',
      cause:   "Strategy is too heavy for the per-interval deadline.",
      fix:     'Pre-compute features in /initialize, cache state across /execute calls, and avoid expensive synchronous calls.',
    },
    {
      symptom: 'Trades execute but PnL is negative even on a known-good idea',
      cause:   "Order API misuse — placing orders inside the /execute response body instead of calling the Order API.",
      fix:     "Orders must be placed by HTTP call to the platform's Order API during /execute. The /execute response body is metadata only (signals, reasoning).",
    },
    {
      symptom: 'High Sharpe in one round, terrible the next',
      cause:   "Overfit to a single market regime.",
      fix:     'Train / tune against multiple historical regimes. The scoring rule weights consistency across rolling rounds, so regime-fragile strategies lose.',
    },
    {
      symptom: 'Submission rejected by Arena',
      cause:   "Missing strategy.json fields or invalid ZIP structure.",
      fix:     'Re-read the manifest field reference in the docs/ folder and re-run make zip. Verify locally with make simulate before re-uploading.',
    },
  ],

  notes: [
    'Astrid Intelligence acquired TaoFi (former SN10) in 2026·01 and rebranded it Astrid Bridge — same PLC, two complementary subnets.',
    'Two-language template (Python FastAPI / TypeScript Express) is unusual on Bittensor — pick the stack your existing strategy code lives in.',
    'Validator code at github.com/astridintelligence/sn-127 is worth reading to understand the sandbox and scoring loop in detail.',
    'Branding moved from SigmaArena to Astrid Arena during 2026; old docs may still reference the previous name.',
  ],
};
