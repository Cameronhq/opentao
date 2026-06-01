import type { RichPlaybook } from '../playbook-rich';

// SN43 — Graphite. Decentralized solving of graph optimization problems (TSP,
// MTSP, MDMTSP, CMDMTSP/RCMDMTSP, portfolio reallocation). Validators send
// graph problems; miners return tours / allocations; rewards split across
// problem categories plus Taotrader leader-portfolio scoring.

export const sn43: RichPlaybook = {
  slug: '43-graphite',
  netuid: 43,
  name: 'Graphite',
  category: 'reason',
  categoryLabel: 'Graph Optimization',

  blurb:
    'Decentralized graph optimization. Validators send TSP / multi-traveler / portfolio-rebalancing problems; miners return solutions; rewards are split 60% across graph-problem categories and 20%/20% across Taotrader leader-portfolio scoring and organic portfolio rebalancing.',

  whatMinersDo:
    "A miner runs neurons/miner.py and answers solver requests for graph problems. Each request specifies a problem type (TSP, MTSP, MDMTSP, CMDMTSP, RCMDMTSP, or portfolio reallocation) and an input graph. You return a candidate solution within a time budget; the validator compares it against (a) the best solution returned by any miner this round and (b) a greedy-heuristic benchmark. Reward is proportional to relative performance against the cohort best; you are penalized if you fail to beat the greedy benchmark.",

  verifiedAt: '2026-06-01',
  verifiedBy: '@editorial',

  emission: '— τ/day',
  burnCostFallback: '— τ',
  minerCountFallback: 0,
  slotCap: 256,

  hardware: [
    {
      role: 'Miner node',
      count: '1',
      cpuCores: 4,
      ramGb: 8,
      diskGb: 10,
      bandwidth: '100 Mbps',
      notes: 'min_compute.yml: 4 cores @ 2.5 GHz, 8 GB RAM min (16 GB recommended), 10 GB disk min (50 GB recommended), Ubuntu 22.04. No GPU required.',
    },
  ],
  hardwareNote:
    'CPU-bound subnet. Your earnings are driven by solver quality (heuristics, metaheuristics, exact methods) — a beefier CPU + more RAM lets you run more aggressive search inside the time budget, which is where the edge lives.',

  rentalOk: true,
  rentalUsdPerHr: { lambda: 0.20, runpod: 0.18, coreweave: 0.25 },

  repo: {
    url: 'https://github.com/GraphiteAI/Graphite-Subnet',
    branch: 'main',
  },

  setupShape: 'simple-binary',
  setupOverview:
    'Classic Bittensor neuron — clone, pip install -e ., copy .env.example to .env, run neurons/miner.py via PM2 or python directly. The repo ships a baseline miner using a greedy solver; replace it with something smarter (LKH for TSP, branch-and-cut for MTSP, custom heuristics for the CMDMTSP variants).',

  install: [
    { step: 'Clone the repo',
      cmd:  'git clone https://github.com/GraphiteAI/Graphite-Subnet && cd Graphite-Subnet' },
    { step: 'Upgrade pip and install',
      cmd:  'pip install --upgrade pip && pip install -e .' },
    { step: 'Copy env template',
      cmd:  'cp .env.example .env',
      note: 'Fill wallet / hotkey / axon variables.' },
    { step: 'Review minimum compute',
      note: 'See min_compute.yml — 4 cores / 8 GB / 10 GB disk min, Ubuntu 22.04.' },
    { step: 'Register your hotkey on SN43',
      cmd:  'btcli subnet register --netuid 43 --wallet.name $WALLET --wallet.hotkey $HOTKEY' },
  ],

  runSteps: [
    { step: 'Start the miner with PM2',
      cmd:  'pm2 start neurons/miner.py --name graphite_miner --interpreter python -- --netuid 43 --subtensor.network finney --wallet.name $WALLET --wallet.hotkey $HOTKEY --logging.debug --axon.port 8091 --blacklist.force_validator_permit True' },
    { step: 'Tail logs',
      cmd:  'pm2 logs graphite_miner' },
    { step: 'Verify on metagraph',
      cmd:  'btcli subnet metagraph --netuid 43' },
  ],

  envVars: [
    { name: 'WALLET',     description: 'Coldkey name',   required: true },
    { name: 'HOTKEY',     description: 'Hotkey name',    required: true },
    { name: 'NETUID',     description: 'Mainnet = 43',   required: false },
    { name: 'AXON_PORT',  description: 'Default 8091',   required: false },
  ],

  scoring: {
    summary:
      'Rewards split across three buckets: Graph Problems 60% (TSP 10%, MTSP 10%, MDMTSP 20%, CMDMTSP/RCMDMTSP 40%, Portfolio Reallocation 20% of the graph-problem share); Taotrader Leader Portfolio 20% (Sharpe 55%, daily P&L 10%, volume 10%, copy-trader count 10%, notional 5%, max drawdown 10%); Organic Portfolio Rebalancing 20%. Per-request scoring is relative to cohort best, with a penalty floor at the greedy benchmark.',
    rule: 'Beat the greedy heuristic on every request. The fattest reward bucket is CMDMTSP/RCMDMTSP (40% × 60% = 24% of total) — invest your solver effort there. For Taotrader portfolios, Sharpe dominates (55% of that bucket).',
    cheatPath:
      "Don't return the cohort-best on toy problems and the greedy benchmark on hard ones — relative scoring weights every request equally, so you must be competitive on the heaviest categories. Don't time out — the validator penalizes late responses by underperformance.",
  },

  profitability: {
    estimatedDailyEmissionPerUid: 0.0,
    tokenPriceUsdFallback: 284,
    capexNote: 'Light capex — a 4-core VPS suffices. The competitive moat is solver quality; invest in solver libraries (LKH, Concorde, OR-Tools) and heuristic tuning.',
  },

  milestones: [
    { day: 'day 1', target: 'Baseline miner registered, answering all problem types',
      note: 'Run the bundled baseline to confirm wiring before customizing.' },
    { day: 'day 3', target: 'Replace baseline with strong CMDMTSP solver',
      note: 'That bucket is 24% of total emission — the biggest single lever.' },
    { day: 'day 7', target: 'Consistently beating greedy benchmark across all categories',
      note: 'If you ever underperform greedy, you are penalized — coverage matters before optimization.' },
  ],

  monitoring: [
    { metric: 'Win-rate vs greedy benchmark', threshold: '100%',     where: 'pm2 logs graphite_miner — look for benchmark gap' },
    { metric: 'Median response time vs deadline', threshold: '< 60%', where: 'pm2 logs' },
    { metric: 'Per-category response counts',  threshold: 'balanced', where: 'pm2 logs' },
    { metric: 'Per-tempo incentive',           threshold: 'rising',   where: 'btcli subnet metagraph --netuid 43' },
  ],

  knownIssues: [
    {
      symptom: 'Score below 1.0 multiplier on some categories',
      cause:   'Your solver is slower than the greedy heuristic on that category, triggering the underperformance penalty.',
      fix:     'Per-category time budgets matter. Run greedy as the floor and only escalate to LKH / metaheuristics if time allows.',
    },
    {
      symptom: 'Miner times out on CMDMTSP / RCMDMTSP',
      cause:   'Constraint-rich variants explode the search space; naive backtracking does not finish in time.',
      fix:     'Use a metaheuristic (genetic, ALNS, tabu search) seeded by a feasibility-preserving greedy. Cap iteration count by elapsed wall-time.',
    },
    {
      symptom: 'Validator force_validator_permit blocking requests',
      cause:   'Default flag too restrictive for testnet — on mainnet, leave --blacklist.force_validator_permit True.',
      fix:     'On mainnet keep the flag True. On testnet, set False while debugging.',
    },
  ],

  notes: [
    'CMDMTSP/RCMDMTSP is the largest single reward bucket — focus there.',
    'For Taotrader portfolio scoring, Sharpe ratio dominates (55%). A high-Sharpe steady portfolio beats a high-P&L volatile one.',
    'Run the bundled baseline first to validate wiring; only then iterate the solver.',
  ],
};
