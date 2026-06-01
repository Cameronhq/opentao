import type { RichPlaybook } from '../playbook-rich';

// SN112 — minotaur. DEX aggregator / swap-intent solver. Miners are solvers
// bidding signed settlements; validators replay deterministically.

export const sn112: RichPlaybook = {
  slug: '112-minotaur',
  netuid: 112,
  name: 'minotaur',
  category: 'reason',
  categoryLabel: 'Reasoning / DeFi',

  blurb:
    'DEX aggregator solver market. Miners compute multi-pool swap settlements, sign and bid; validators replay deterministically and rank on user surplus, gas, and speed.',

  whatMinersDo:
    "Run a solver agent: ingest a stream of swap intents (token in/out, amount, deadline) from the Aggregator, compute the best multi-pool settlement, sign the bid with your hotkey, and submit. Scoring is deterministic replay — every validator pulls the same event window and arrives at the same weight vector. Realized user surplus dominates; gas efficiency and execution speed are secondary; protocol-fee contribution is only a tie-breaker.",

  verifiedAt: '2026-06-01',
  verifiedBy: '@editorial',

  emission: '— τ/day',
  burnCostFallback: '— τ',
  minerCountFallback: 0,
  slotCap: 256,

  hardware: [
    {
      role: 'Solver node',
      count: '1',
      cpuCores: 8,
      ramGb: 16,
      diskGb: 100,
      bandwidth: 'low-latency uplink · static public IP',
      notes: 'No GPU required. Latency to chain RPC and the Aggregator matters more than core count. Local Anvil fork helps for testing.',
    },
  ],

  rentalOk: true,
  rentalUsdPerHr: { lambda: 0.20, runpod: 0.18, coreweave: 0.22 },

  repo: {
    url: 'https://github.com/subnet112/minotaur_subnet',
    branch: 'main',
    minerEntrypoint: 'minotaur_subnet.miner.main',
  },

  setupShape: 'simple-binary',
  setupOverview:
    "Setup is a Python solver agent plus a Node.js scoring runtime and Foundry for local Solidity testing against Anvil. Once installed, you point the agent at the validator URL with your EVM signing key and Bittensor wallet; bids flow through the live execution window and are scored on replay after chain finalization.",

  install: [
    { step: 'Clone repo',
      cmd:  'git clone https://github.com/subnet112/minotaur_subnet && cd minotaur_subnet' },
    { step: 'Create + activate venv',
      cmd:  'python3 -m venv .venv && source .venv/bin/activate' },
    { step: 'Install Python deps',
      cmd:  'pip install -r requirements.txt' },
    { step: 'Install Node.js 20+',
      note: 'Required for the JS scoring engine runtime.' },
    { step: 'Install Docker',
      note: 'Used for local testnet and emulation scenarios.' },
    { step: 'Install Foundry (forge)',
      cmd:  'curl -L https://foundry.paradigm.xyz | bash && foundryup',
      note: 'For Solidity tests and E2E on Anvil.' },
    { step: 'Register hotkey on SN112',
      cmd:  'btcli subnet register --netuid 112 --wallet.name $WALLET --wallet.hotkey $HOTKEY' },
  ],

  runSteps: [
    { step: 'Start the solver agent',
      cmd:  'python -m minotaur_subnet.miner.main agent --validator-url http://localhost:8080',
      note: 'Replace --validator-url with the live Aggregator endpoint (set in env / docs).' },
  ],

  envVars: [
    { name: 'WALLET',                description: 'Coldkey name',                                       required: true },
    { name: 'HOTKEY',                description: 'Hotkey name',                                        required: true },
    { name: 'WALLET_NAME',           description: 'Wallet identifier (same as WALLET in some configs)', required: true },
    { name: 'HOTKEY_NAME',           description: 'Hotkey identifier (same as HOTKEY in some configs)', required: true },
    { name: 'VALIDATOR_PRIVATE_KEY', description: 'EVM private key used to sign solver submissions',    required: true },
    { name: 'SUBTENSOR_URL',         description: 'Subtensor RPC endpoint',                             required: true },
    { name: 'NETUID',                description: 'Subnet ID — must be 112',                            required: true },
  ],

  scoring: {
    summary:
      "Validators replay the recorded execution window deterministically and grade each signed solver submission on three tiers: (1) realized user surplus (higher effective price wins, minOut respected); (2) correctness, gas efficiency, revert risk; (3) protocol-fee contribution as tie-breaker only — never at the expense of user surplus.",
    rule: 'Win the user the best price, with clean execution and low gas, signed by your registered hotkey.',
    sourcePath: 'minotaur_subnet/scoring',
    cheatPath:
      "Don't submit unsigned bids or bids from unregistered hotkeys — they're filtered before scoring. Don't optimize for protocol fees at the expense of user surplus — surplus is the primary axis and fees only break ties.",
  },

  profitability: {
    estimatedDailyEmissionPerUid: 0.0,
    tokenPriceUsdFallback: 284,
    capexNote:
      'Low capex. The hard problem is the solver itself — pool-state tracking, pathfinding, gas modeling. The "Champion" engine (top scorer) runs across all validators, which makes the top spot highly contested.',
  },

  milestones: [
    { day: 'day 1',  target: 'Solver agent online, hotkey registered, bids landing',
      note: 'Aggregator picks up signed submissions; scoring replay starts populating after chain finalization.' },
    { day: 'day 7',  target: 'Win at least some auctions',
      note: 'User-surplus grade non-zero for a measurable fraction of intents; gas-efficiency reasonable.' },
    { day: 'day 30', target: 'Climb past the bottom quartile',
      note: 'Iterate pathfinding and pool coverage. Phase B (MEV protection + Base rollout) reshuffles competition — watch for spec changes.' },
  ],

  monitoring: [
    { metric: 'Signed submission rate',        threshold: '> 95% of intent stream',  where: 'agent logs · unsigned/dropped bids are filtered' },
    { metric: 'Replay-scored surplus',         threshold: 'rising',                   where: 'validator scoring output / metagraph incentive' },
    { metric: 'RPC latency to chain',          threshold: '< 100 ms',                 where: 'agent metrics · solver speed bound to RPC' },
    { metric: 'Per-tempo incentive',           threshold: 'rising or flat',           where: 'btcli subnet metagraph --netuid 112' },
  ],

  knownIssues: [
    {
      symptom: 'Bids filtered before scoring',
      cause:   'Submission unsigned, or signing hotkey not registered to SN112.',
      fix:     "Confirm VALIDATOR_PRIVATE_KEY is set and the corresponding hotkey is registered. Check the agent's signature output.",
    },
    {
      symptom: 'Win rate near zero despite competitive pathfinding',
      cause:   'RPC lag making your quote stale by the time the Aggregator records it.',
      fix:     'Move the agent closer to chain RPC; use a dedicated RPC node; reduce upstream latency.',
    },
    {
      symptom: 'Score regression after upgrade',
      cause:   'Champion engine changed; spec update to scoring criteria.',
      fix:     "Pin to a known-good ref + diff scoring/ for changes. Re-tune surplus vs gas weighting if Phase B rollout altered the curve.",
    },
  ],

  notes: [
    'Top-scoring engine becomes the "Champion" and runs across all validators — there is real winner-take-most dynamics.',
    'Phase B brings MEV protection and a Base rollout — watch for spec changes when L2 settlement comes online.',
    'Deterministic replay scoring means validators do not disagree about your score; disputes are bounded.',
  ],
};
