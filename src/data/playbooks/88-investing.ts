import type { RichPlaybook } from '../playbook-rich';

// SN88 — Investing. Decentralized asset management: miners submit
// allocation strategies (TAO/Alpha staking, US equities, forex), validators
// score on risk-adjusted return, top strategies allocate the 88 Quant Fund.
// Repo: mobiusfund/investing. Ubuntu 22.04, Python venv, pm2-managed miner.
// Strategies live as files in Investing/strat/ and are auto-submitted.

export const sn88: RichPlaybook = {
  slug: '88-investing',
  netuid: 88,
  name: 'Investing',
  category: 'reason',
  categoryLabel: 'Quant / AUM',

  blurb:
    'Decentralized quant fund on Bittensor. Miners submit allocation strategies across TAO/Alpha staking, US equities, and forex; validators score risk-adjusted returns and the 88 Quant Fund deploys real capital on top.',

  whatMinersDo:
    'A SN88 miner is mostly a strategy file. You drop an allocation strategy into Investing/strat/ — weights across the available assets for the active scoring window — and the miner client auto-submits it. Validators score on a composite of return, volatility, drawdown, and timeframe metrics; daily scoring runs at 00:00 UTC for TAO/Alpha and 06:00 UTC for US stocks. Better risk-adjusted alpha = higher emissions, and top strategies inform real capital deployment in the 88 Quant Fund.',

  verifiedAt: '2026-06-01',
  verifiedBy: '@editorial',

  emission: '— τ/day',
  burnCostFallback: '— τ',
  minerCountFallback: 0,
  slotCap: 256,

  hardware: [
    {
      role: 'Strategy node (CPU)',
      count: '1',
      cpuCores: 4,
      ramGb: 16,
      diskGb: 50,
      bandwidth: 'normal connection',
      notes: 'Strategy compute is generally feasible on a single workstation; quant talent matters more than GPUs. Ubuntu 22.04 is officially supported.',
    },
  ],
  hardwareNote:
    'Modest hardware. The lever is the quality of the allocation logic in Investing/strat/ — not raw compute.',

  rentalOk: true,
  rentalUsdPerHr: { lambda: 1.99, runpod: 1.89, coreweave: 2.10 },

  repo: {
    url: 'https://github.com/mobiusfund/investing',
    branch: 'main',
    minerEntrypoint: 'neurons/miner.py',
  },

  setupShape: 'simple-binary',
  setupOverview:
    'Standard Bittensor neurons/miner.py pattern but managed under pm2 for persistence. Install on Ubuntu 22.04 as a regular (non-root) user, clone mobiusfund/investing, install with `pip install -e .`, then `pm2 start neurons/miner.py`. Strategies dropped into Investing/strat/ are picked up and submitted automatically.',

  install: [
    { step: 'Install system prereqs (Ubuntu 22.04)',
      cmd:  'sudo apt update && sudo apt install npm -y' },
    { step: 'Install pm2 globally',
      cmd:  'sudo npm install pm2 -g' },
    { step: 'Clone repo',
      cmd:  'git clone https://github.com/mobiusfund/investing && cd investing' },
    { step: 'Create venv + install package',
      cmd:  'python -m venv .venv && . .venv/bin/activate && python -m pip install -e .' },
    { step: 'Create wallet + register on SN88',
      cmd:  'btcli wallet new_coldkey --wallet.name $WALLET && btcli wallet new_hotkey --wallet.name $WALLET --wallet.hotkey $HOTKEY && btcli subnet register --netuid 88 --wallet.name $WALLET --wallet.hotkey $HOTKEY --subtensor.network finney' },
  ],

  runSteps: [
    { step: 'Launch the miner under pm2',
      cmd:  'pm2 start neurons/miner.py \\\n  --name investing-miner -- \\\n  --wallet.name $WALLET \\\n  --wallet.hotkey $HOTKEY \\\n  --netuid 88',
      note: 'Once running, any strategy file dropped into Investing/strat/ is automatically submitted by the miner.' },
    { step: 'Drop in a strategy file',
      note: 'Place your allocation strategy in Investing/strat/ — the miner picks it up on the next cycle.' },
    { step: 'Verify on the metagraph',
      cmd:  'btcli subnet metagraph --netuid 88' },
  ],

  envVars: [
    { name: 'WALLET',  description: 'Coldkey name (matches btcli wallet list)', required: true },
    { name: 'HOTKEY',  description: 'Hotkey name on that coldkey',              required: true },
  ],

  scoring: {
    summary:
      'Composite score across return, volatility, drawdown, and timeframe metrics versus an asset-class benchmark. Risk-adjusted alpha is what pays — high-volatility strategies that win one window then blow up are penalized. Daily scoring at 00:00 UTC (TAO/Alpha) and 06:00 UTC (US stocks). New miners get a 3-day immunity window after first dashboard appearance.',
    rule: 'Excess return − risk penalty across the scoring window → composite score → weight vector. Same scoring engine drives capital allocation in the 88 Quant Fund.',
    cheatPath:
      'Strategies that overfit a single window or take undisclosed leverage are punished by the risk penalty and drawdowns in the next window. Single-trade luck does not score — sustained risk-adjusted alpha does.',
  },

  profitability: {
    estimatedDailyEmissionPerUid: 0.0,
    tokenPriceUsdFallback: 284,
    capexNote: 'Capex-light. A $200/mo VPS is fine. Edge is in the strategy file itself.',
    notes:
      'Real capital deployment in the 88 Quant Fund adds an unusual layer — top-scoring strategies indirectly influence allocations in a live hedge fund, which is a different dynamic than pure emission farming.',
  },

  milestones: [
    { day: 'day 1',  target: 'Miner up under pm2, first strategy file submitted', note: '`pm2 logs investing-miner` shows submission events.' },
    { day: 'day 3',  target: 'Score appears on the operator dashboard',           note: 'Out of the 3-day immunity window after first dashboard appearance.' },
    { day: 'day 7',  target: 'Iterate strategy based on benchmark drawdowns',     note: 'Look at where your strategy diverges from the benchmark; tune risk parameters.' },
    { day: 'day 30', target: 'Stable risk-adjusted alpha',                         note: 'Sustained outperformance across windows is what climbs the leaderboard.' },
  ],

  monitoring: [
    { metric: 'pm2 process up',          threshold: 'online',           where: 'pm2 list' },
    { metric: 'Strategy submissions/day', threshold: '> 0',             where: 'pm2 logs investing-miner' },
    { metric: 'Per-tempo incentive',     threshold: 'rising or flat',   where: 'btcli subnet metagraph --netuid 88' },
    { metric: 'Composite score',         threshold: 'rising or flat',   where: 'Investing operator dashboard' },
  ],

  knownIssues: [
    { symptom: 'Strategy not getting submitted',     cause: 'File not in Investing/strat/, or filename does not match the expected format.', fix: 'Re-read the strat/ README; move the file into the right directory and restart pm2.' },
    { symptom: 'Running as root → permission errors', cause: 'Repo expects a regular user account.',                                        fix: 'Set up a non-root user and re-clone there.' },
    { symptom: 'Score appears low despite hits',     cause: 'High volatility / drawdown — composite penalizes these.',                       fix: 'Reduce position size on losing legs; add a stop-loss / volatility cap to the strategy logic.' },
  ],

  notes: [
    'Operated by the Mobius Fund team (Jake, Glenn, Josh) — also runs the HODL ETF project.',
    'Phase I = TAO/Alpha staking, Phase II = US equities (added 2025-07), Phase III = 88 Quant Fund live (Dec 2025).',
    '3-day immunity window starts after your hotkey first shows up on the dashboard — not at registration.',
  ],
};
