import type { RichPlaybook } from '../playbook-rich';

// SN98 — ForeverMoney. AI-quant subnet for Uniswap V3 / Aerodrome LP rebalancing
// on Base L2. Miners propose rebalances; validators forward-simulate and execute
// winners on-chain. Real PnL scoring net of gas + impermanent loss.

export const sn98: RichPlaybook = {
  slug: '98-forevermoney',
  netuid: 98,
  name: 'ForeverMoney',
  category: 'reason',
  categoryLabel: 'DeFi Quant',

  blurb:
    'On-chain market-making subnet — AI quant teams compete to manage Uniswap V3 / Aerodrome liquidity on Base L2. Miners implement a rebalance_query_handler; validators forward-simulate strategies, then execute winning strategies on-chain through subnet-controlled vaults. Real PnL scoring net of gas and impermanent loss.',

  whatMinersDo:
    "A ForeverMoney miner runs a Python neuron that exposes a rebalance_query_handler. Validators publish current pool state, price action, and the required rebalancing decision; your handler returns a proposed rebalance — tick range, liquidity amount, fee tier. Validators forward-simulate your proposal against realized price action, computing simulated PnL net of swap fees, gas, and impermanent loss. Strategies that beat the field get executed on-chain through Base L2 vaults — so simulated AND realized PnL both count. You build reputation through consistent participation for ~7 days before becoming eligible for live execution.",

  verifiedAt: '2026-06-01',
  verifiedBy: '@editorial',

  emission: '— τ/day',
  burnCostFallback: '— τ',
  minerCountFallback: 0,
  slotCap: 256,

  hardware: [
    {
      role: 'CPU node',
      count: '1',
      cpuCores: 4,
      ramGb: 8,
      diskGb: 50,
      bandwidth: 'standard public IP',
      notes: 'Quant-grade compute — modest CPU sufficient. Market-data feeds (price oracles, pool state) matter more than raw FLOPS.',
    },
  ],
  hardwareNote:
    "Python 3.10+ and Git required per README. The competitive surface is your strategy code, not hardware — most miners run on a small VM.",

  rentalOk: true,
  rentalUsdPerHr: { lambda: 0.10, runpod: 0.08, coreweave: 0.12 },

  repo: {
    url: 'https://github.com/SN98-ForeverMoney/forever-money',
    branch: 'main',
    minerEntrypoint: 'miner/miner.py',
    extraRepos: [
      { name: 'MINER_GUIDE.md',         url: 'https://github.com/SN98-ForeverMoney/forever-money/blob/main/MINER_GUIDE.md',         purpose: 'Comprehensive strategy implementation guide' },
      { name: 'MINER_REGISTRATION_GUIDE.md', url: 'https://github.com/SN98-ForeverMoney/forever-money/blob/main/MINER_REGISTRATION_GUIDE.md', purpose: 'Registration walkthrough' },
    ],
  },

  setupShape: 'simple-binary',
  setupOverview:
    'Standard Bittensor Python neuron setup. Clone the repo, set up a venv, copy .env.example to .env, register your hotkey per the registration guide, implement your rebalance_query_handler, and run under PM2. After ~7 days of consistent participation, your strategies become eligible for live on-chain execution.',

  install: [
    { step: 'Clone the miner repo',
      cmd:  'git clone https://github.com/SN98-ForeverMoney/forever-money.git && cd forever-money' },
    { step: 'Create and activate venv',
      cmd:  'python3 -m venv .venv && source .venv/bin/activate' },
    { step: 'Install dependencies',
      cmd:  'pip install -r requirements.txt' },
    { step: 'Configure .env',
      cmd:  'cp .env.example .env && $EDITOR .env',
      note: 'Adjust network settings + your wallet info.' },
    { step: 'Register hotkey on SN98 (see MINER_REGISTRATION_GUIDE.md)',
      cmd:  'btcli subnet register --netuid 98 --wallet.name $WALLET --wallet.hotkey $HOTKEY' },
    { step: 'Implement your rebalance_query_handler',
      note: 'Refer to MINER_GUIDE.md for the handler signature and strategy expectations.' },
  ],

  runSteps: [
    { step: 'Start miner (development)',
      cmd:  'python -m miner.miner --wallet.name $WALLET --wallet.hotkey $HOTKEY --netuid 98' },
    { step: 'Start miner under PM2 (production)',
      cmd:  'pm2 start miner/miner.py --name sn98-miner -- --wallet.name $WALLET --wallet.hotkey $HOTKEY --netuid 98' },
    { step: 'Confirm registration on metagraph',
      cmd:  'btcli subnet metagraph --netuid 98' },
  ],

  envVars: [
    { name: 'WALLET', description: 'Coldkey name (--wallet.name)', required: true },
    { name: 'HOTKEY', description: 'Hotkey name (--wallet.hotkey)', required: true },
  ],

  scoring: {
    summary:
      'Validators forward-simulate each miner\'s proposed rebalance against realized price action, computing simulated PnL net of swap fees, gas, and impermanent loss. Reward "value growth from pool price appreciation and fees" while penalizing inventory loss exponentially. Winning strategies actually execute on-chain — realized PnL diverging from simulated PnL exposes overfitting.',
    rule: 'Build a strategy whose forward-simulated PnL net of gas + IL beats peers. After ~7 days of consistent participation, your strategies become eligible for live on-chain execution on Base L2.',
    cheatPath: 'Overfitting to validator-simulator quirks — fails because winning strategies actually execute on-chain, and real PnL diverges from simulator PnL, exposing the overfit. Exponential penalty on inventory loss prevents simulator-only gaming.',
  },

  profitability: {
    estimatedDailyEmissionPerUid: 0.0,
    tokenPriceUsdFallback: 284,
    capexNote:
      'Infra is cheap (~$5-10/mo VM). The "capex" is research time on your LP-management strategy. Quality of market-data feeds matters more than hardware.',
    notes:
      'Roadmap target is $1B TVL managed through the protocol. Once mainnet vault execution scales, top miners capture both emission and a share of strategy-PnL — multi-rail incentive vs. emission-only subnets.',
  },

  milestones: [
    { day: 'day 1',  target: 'Miner registered, handler responding',  note: 'Validators are routing rebalance queries to your handler. Incentive > 0 after first tempo.' },
    { day: 'day 3',  target: 'Strategy simulated against price action', note: 'Simulated PnL scored at least once. Compare to top miners on taostats.' },
    { day: 'day 7',  target: 'Eligible for live execution',             note: 'After 7 days of consistent participation per README, your strategies become eligible for live on-chain execution on Base L2.' },
    { day: 'day 14', target: 'Out of immunity, surviving',              note: 'Incentive above lowest non-immune. Tune your strategy if close to floor.' },
    { day: 'day 30', target: 'Realized PnL tracking simulated PnL',     note: 'Live-execution PnL should track simulator PnL within reasonable tolerance — large divergence = overfit.' },
  ],

  monitoring: [
    { metric: 'Handler response latency',          threshold: '< 1s',           where: 'pm2 logs sn98-miner · validators timeout on slow handlers' },
    { metric: 'Simulated PnL vs. baseline',        threshold: '> hold',         where: 'Internal strategy backtest + validator response logs' },
    { metric: 'Realized vs. simulated PnL gap',    threshold: 'small',          where: 'Once live-execution eligible — large gap exposes overfit' },
    { metric: 'Per-tempo incentive',               threshold: 'rising or flat', where: 'btcli subnet metagraph --netuid 98' },
  ],

  knownIssues: [
    {
      symptom: 'Handler not responding to validator queries',
      cause:   'rebalance_query_handler not registered properly, or axon port closed.',
      fix:     'Verify handler is exposed per MINER_GUIDE.md. Open axon port at the firewall and confirm reachability with curl from outside.',
    },
    {
      symptom: 'Score low despite reasonable strategy',
      cause:   'Strategy ignores gas + IL — simulated PnL is positive gross but negative net of cost.',
      fix:     'Always net out gas and impermanent loss in your strategy decision. Validators score net PnL, not gross.',
    },
    {
      symptom: 'Live PnL diverges sharply from simulated PnL',
      cause:   'Overfitting to validator simulator quirks. Real on-chain execution exposes the gap.',
      fix:     'Use realistic backtesting (varied price paths, real gas costs, slippage) before submitting. Treat divergence as a regression signal.',
    },
  ],

  notes: [
    '7-day reputation period before live execution — plan for at least a week of simulator-only earn while building reputation.',
    'Base L2 vaults are the on-chain execution layer — winning strategies move real capital.',
    'ForeverMoney connects to the CreatorBid ecosystem and Phil (@philism_)\'s SONAR project — broader attention/reputation infrastructure context worth tracking.',
  ],
};
