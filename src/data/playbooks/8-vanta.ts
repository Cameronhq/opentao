import type { RichPlaybook } from '../playbook-rich';

// SN8 — Vanta (Taoshi, formerly PTN). Risk-adjusted prop-trading signals.
// Lightweight CPU miner. Receives orders via REST API at 127.0.0.1:8088 then signs
// and posts on-chain. Multi-asset (forex, crypto, equities).

export const sn8: RichPlaybook = {
  slug: '8-vanta',
  netuid: 8,
  name: 'Vanta',
  category: 'reason',
  categoryLabel: 'Prop trading / signals',

  blurb:
    "Run a CPU-only neuron that signs long/short/flat signals across forex, crypto, and equities and posts them on-chain. Validators reconstruct your portfolio and score by Omega ratio + return under hard drawdown limits.",

  whatMinersDo:
    "A Vanta miner runs `python neurons/miner.py` on a small CPU box. The neuron starts a local REST server on port 8088 that accepts directional position signals (long / short / flat plus position size) via `POST /api/submit-order`. The miner signs each signal with its hotkey and posts it on-chain via the Vanta network so validators can reconstruct the miner's portfolio from first principles and score it on Omega ratio, total return, and hard drawdown limits.",

  verifiedAt: '2026-06-01',
  verifiedBy: '@editorial',

  emission: '— τ/day',
  burnCostFallback: '— τ',
  minerCountFallback: 0,
  slotCap: 256,

  hardware: [
    {
      role: 'Miner host (CPU)',
      count: '1',
      cpuCores: 2,
      ramGb: 8,
      diskGb: 50,
      bandwidth: 'standard internet · open axon port (default 8091) and local 8088 for order API',
      notes: 'Official stated minimum: 2 vCPU + 8 GB memory. CPU-only run path — most of the work is alpha research and model design done off-box.',
    },
  ],
  hardwareNote:
    "Compute scaling is via better models / data, not bigger hardware. The miner neuron is intentionally light — actual strategy code runs wherever you choose (your laptop, a research server) and posts signals to localhost:8088.",

  rentalOk: true,
  rentalNote: 'Any small VPS works. Strategy infrastructure is up to you.',
  rentalUsdPerHr: { lambda: 0.05, runpod: 0.04, coreweave: 0.06 },

  repo: {
    url: 'https://github.com/taoshidev/vanta-network',
    branch: 'main',
    minerEntrypoint: 'neurons/miner.py',
  },

  setupShape: 'simple-binary',
  setupOverview:
    "Clone the taoshidev/vanta-network repo, install Python 3.10 deps in a venv, create + register a wallet on SN8 (mainnet netuid 8, testnet netuid 116), and run `python neurons/miner.py`. The miner exposes a local REST endpoint at 127.0.0.1:8088 — your trading code POSTs orders to that endpoint and the miner signs and broadcasts them.",

  install: [
    { step: 'Clone the repo', cmd: 'git clone https://github.com/taoshidev/vanta-network.git && cd vanta-network' },
    { step: 'Create + activate venv (Python 3.10)', cmd: 'python3 -m venv venv && . venv/bin/activate' },
    { step: 'Install deps', cmd: 'export PIP_NO_CACHE_DIR=1 && pip install -r requirements.txt && python3 -m pip install -e .' },
    { step: 'Create wallet keys', cmd: 'btcli wallet new_coldkey --wallet.name $WALLET && btcli wallet new_hotkey --wallet.name $WALLET --wallet.hotkey $HOTKEY' },
    { step: 'Register on SN8 (mainnet)', cmd: 'btcli subnet register --wallet.name $WALLET --wallet.hotkey $HOTKEY --netuid 8' },
  ],

  runSteps: [
    {
      step: 'Start the miner (mainnet)',
      cmd: 'python neurons/miner.py --netuid 8 --wallet.name $WALLET --wallet.hotkey $HOTKEY',
    },
    {
      step: 'OR start on testnet (netuid 116)',
      cmd: 'python neurons/miner.py --netuid 116 --subtensor.network test --wallet.name $WALLET --wallet.hotkey $HOTKEY',
    },
    {
      step: 'Submit an order from your strategy code',
      cmd: 'curl -X POST http://127.0.0.1:8088/api/submit-order -H "Content-Type: application/json" -d \'{"asset": "BTCUSD", "direction": "long", "size": 0.5}\'',
      note: 'Schema matches the docs — confirm against docs/miner.md before live.',
    },
    { step: 'For a second miner on the same host, set a different axon port', cmd: 'python neurons/miner.py --netuid 8 --wallet.name $WALLET --wallet.hotkey $HOTKEY --axon.port 8095' },
  ],

  envVars: [
    { name: 'WALLET', description: 'Coldkey name', required: true },
    { name: 'HOTKEY', description: 'Hotkey name', required: true },
  ],

  scoring: {
    summary:
      'Risk-adjusted: Omega ratio + total return under hard drawdown limits. High drawdown disqualifies; smooth equity curves dominate. Every signal is signed and timestamped on-chain so validators can reconstruct portfolios deterministically.',
    rule: 'Generate positive, risk-adjusted returns under strict drawdown limits. A trader who triples capital with 50% drawdown can score worse than one delivering steady 20% with low volatility.',
    cheatPath:
      'Signals are signed and timestamped on-chain — no retroactive edits. Hard drawdown limits disqualify reckless leverage attempts to juice short-term Omega. Look-ahead bias is impossible because validators evaluate signals against subsequent market data the miner does not control.',
  },

  profitability: {
    estimatedDailyEmissionPerUid: 0.0,
    tokenPriceUsdFallback: 284,
    capexNote:
      'Capex is essentially data subscriptions + research time. The neuron itself runs on a $5/mo VPS.',
    notes: 'Hard drawdown caps mean variance kills you — gambling strategies blow up. Top miners are quant traders with real risk management discipline.',
  },

  milestones: [
    { day: 'day 1', target: 'Miner running, UID assigned, first signal posted', note: 'btcli metagraph shows UID; curl localhost:8088 returns; signal visible on-chain via Vanta dashboards.' },
    { day: 'day 3', target: 'Equity curve forming', note: 'Validators have reconstructed several days of your portfolio. Inspect via taostats or Vanta-side dashboards.' },
    { day: 'day 7', target: 'Score above floor', note: 'If drawdown breached, you are at zero. Tune position sizing and stop-loss logic.' },
    { day: 'day 30', target: 'Sustained risk-adjusted score', note: 'Omega and drawdown remain stable across the evaluation window. Top quartile = meaningful emission.' },
  ],

  monitoring: [
    { metric: 'Drawdown vs cap', threshold: 'below disqualification threshold', where: 'Vanta dashboards / on-chain portfolio reconstruction' },
    { metric: 'Order submission success', threshold: '100%', where: 'POST /api/submit-order responses · 4xx = order rejected' },
    { metric: 'Signal post latency to chain', threshold: '< 1 tempo (~72 min)', where: 'On-chain confirmation via Vanta logs' },
    { metric: 'Per-tempo incentive', threshold: 'rising or flat', where: 'btcli subnet metagraph --netuid 8' },
  ],

  knownIssues: [
    { symptom: 'Order endpoint returns 4xx', cause: 'Schema mismatch with current docs/miner.md (asset name, direction enum, size field).', fix: 'Match the schema exactly against docs/miner.md in your installed version. Update strategy code on schema changes.' },
    { symptom: 'Hit drawdown cap, score → 0', cause: 'Over-leveraged or no stop-loss discipline.', fix: 'Reduce position size, add hard stops upstream. Drawdown caps are a structural feature — they will not move.' },
    { symptom: 'Two miners on one host conflict on port', cause: 'Both default to axon port 8091.', fix: 'Pass --axon.port 8095 (or any free port) to additional miners.' },
    { symptom: 'Signals submitted but not reflected in portfolio', cause: 'Signal not signed or not posted to chain (network issue, wallet permission).', fix: 'Add --logging.debug; verify hotkey is correctly loaded; ensure subtensor endpoint reachable.' },
  ],

  notes: [
    'Subnet was previously branded PTN (Proprietary Trading Network) before becoming Vanta.',
    'Vanta Trading (vanta.trade) is the consumer prop-firm product layered on this subnet — 100% profit split, on-chain rules.',
    'Strategy code lives outside the miner repo — Taoshi explicitly leaves alpha research to participants.',
  ],
};
