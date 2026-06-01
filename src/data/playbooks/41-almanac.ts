import type { RichPlaybook } from '../playbook-rich';

// SN41 — Almanac (operated by Sportstensor). Repo: sportstensor/sn41.
// IMPORTANT: Almanac is the front-end / mining surface for Sportstensor's
// pivoted product — miners earn by TRADING on Polymarket via the Almanac dApp,
// not by running a prediction model neuron. Scoring is two-phase optimization
// over 30-day rolling trading P&L. Validator-side neuron lives in the repo;
// miner side is "register metadata once + trade on the app".

export const sn41: RichPlaybook = {
  slug: '41-almanac',
  netuid: 41,
  name: 'Almanac (Sportstensor)',
  category: 'data',
  categoryLabel: 'Prediction Market',

  blurb:
    'Sports + prediction-market trading subnet. Almanac is the dApp front-end; miners earn by trading Polymarket markets through Almanac, with rewards distributed over a rolling 30-day window by a two-phase optimizer that weights ROI and qualified trading volume.',

  whatMinersDo:
    "Miners do NOT run a prediction model daemon. They register a metadata record on SN41 once (mapping their Bittensor coldkey to an Almanac account and a Polymarket-routed proxy wallet), then trade on https://beta.almanac.market. Every trade becomes a scored prediction. Validators ingest each miner's 30-day trading history hourly, run a two-phase optimizer (phase 1 maximizes funded qualified volume under budget; phase 2 redistributes toward higher-ROI traders), apply diversity caps, and set on-chain weights. Manual strategies, custom models, and automated systems are all allowed — scoring is model-agnostic.",

  verifiedAt: '2026-06-01',
  verifiedBy: '@editorial',

  emission: '— τ/day',
  burnCostFallback: '— τ',
  minerCountFallback: 0,
  slotCap: 256,

  hardware: [
    {
      role: 'Miner workstation',
      count: '1',
      cpuCores: 2,
      ramGb: 4,
      diskGb: 20,
      bandwidth: 'normal home internet',
      notes: 'CPU only. Python 3.10+. No GPU required. The "miner" is essentially a wallet + trading client — your edge is alpha, not silicon.',
    },
  ],
  hardwareNote:
    'There is no GPU inference loop. If you build an algorithmic trading bot, that bot is YOUR infrastructure and is separate from the subnet wiring. SN41 itself runs on a laptop.',

  rentalOk: true,
  rentalUsdPerHr: { lambda: 0.05, runpod: 0.05, coreweave: 0.06 },

  repo: {
    url: 'https://github.com/sportstensor/sn41',
    branch: 'main',
    extraRepos: [
      { name: 'sportstensor/MLB', url: 'https://github.com/sportstensor/MLB', purpose: 'Sport-specific models from the previous SN41 incarnation (reference)' },
      { name: 'sportstensor/NFL', url: 'https://github.com/sportstensor/NFL', purpose: 'NFL model reference' },
      { name: 'sportstensor/EPL', url: 'https://github.com/sportstensor/EPL', purpose: 'EPL model reference' },
      { name: 'sportstensor/MLS', url: 'https://github.com/sportstensor/MLS', purpose: 'MLS model reference' },
    ],
  },

  setupShape: 'simple-binary',
  setupOverview:
    'Three pieces: (1) Almanac account + safe wallet + Polymarket funding. (2) Bittensor coldkey linked to that Almanac account via the wallet extension. (3) One-shot `python miner.py` to register metadata on SN41. After that, all "mining" is just trading on the dApp (or via the Almanac API trading client).',

  install: [
    { step: 'Create an Almanac account + Polymarket-linked safe wallet',
      note: 'Go to https://beta.almanac.market — deploy safe, sign approvals, fund the safe.' },
    { step: 'Install the Bittensor wallet extension and import your coldkey',
      note: 'Used to link your coldkey to the Almanac account.' },
    { step: 'Link coldkey ↔ Almanac account',
      note: 'In Almanac settings, connect the wallet extension. The link is what the validator will index.' },
    { step: 'Register your hotkey on SN41',
      cmd:  'btcli subnet register --netuid 41 --wallet.name $WALLET --wallet.hotkey $HOTKEY' },
    { step: 'Clone the subnet repo and register metadata once',
      cmd:  'git clone https://github.com/sportstensor/sn41/ && cd sn41 && pip install -r requirements.txt && python miner.py' },
  ],

  runSteps: [
    { step: 'Trade on Almanac (dApp path)',
      note: 'Place trades on https://beta.almanac.market. Validators auto-detect trades and score them hourly.' },
    { step: 'OR trade via the Almanac API trading client',
      note: 'Use api_trading.py to generate Polymarket API creds, open Almanac sessions, search markets, and submit proxy-signed EIP-712 CLOB orders programmatically.' },
    { step: 'Watch incentive climb',
      cmd:  'btcli subnet metagraph --netuid 41',
      note: 'First weights appear after the validator has ≥ 1 epoch (24h) of trading history.' },
  ],

  envVars: [
    { name: 'WALLET',         description: 'Coldkey name (must match the one linked in Almanac)', required: true },
    { name: 'HOTKEY',         description: 'Hotkey name on that coldkey',                        required: true },
    { name: 'WANDB_API_KEY',  description: 'Optional W&B logging (more relevant for validators)', required: false },
  ],

  scoring: {
    summary:
      'Two-phase optimization over a 30-day rolling window of daily epochs. For each epoch: ROI = profit / volume, qualified_volume = volume from winning trades after fees, trailing_performance = historical score. Phase 1 maximizes funded qualified volume under a fixed budget. Phase 2 redistributes payouts toward higher-ROI traders while preserving the volume target. Diversity caps prevent any single trader from dominating. Decaying memory weights recent activity more heavily.',
    rule: 'Trade profitably with meaningful volume. Eligibility gates: minimum ROI (filters unprofitable traders), minimum volume (filters dabblers), build-up period (consistent activity across multiple epochs). Pure ROI without volume earns little; pure volume with negative ROI earns nothing.',
    sourcePath: 'sportstensor/sn41 · scoring.py',
    cheatPath:
      "Don't wash-trade — phase-1 only credits winning trades (after fees), so two-sided self-trades net negative. Don't try to splash one big bet — the build-up period requires activity over multiple epochs. Don't try to dominate — diversity caps automatically clip any single trader's share of the budget.",
  },

  profitability: {
    estimatedDailyEmissionPerUid: 0.0,
    tokenPriceUsdFallback: 284,
    capexNote: 'Negligible hardware capex. Your real capex is your TRADING BANKROLL — enough USDC/USDT on Polymarket to clear the minimum-volume gate while staying ROI-positive.',
    notes:
      'This is a sports-prediction trading subnet wearing Bittensor clothes. If you have sports modeling alpha (or any prediction-market alpha), SN41 is a clean monetization route. If you have none, you are gambling.',
  },

  milestones: [
    { day: 'day 1',  target: 'Almanac account + safe + Bittensor link done',
      note: '`python miner.py` succeeds and metadata is on-chain.' },
    { day: 'day 3',  target: 'First trades placed, validator indexing them',
      note: 'Volume + ROI start populating in the W&B dashboard.' },
    { day: 'day 7',  target: 'Past the build-up period, weight > 0',
      note: 'If still zero: re-check minimum-volume gate. Below threshold = no payout.' },
    { day: 'day 30', target: 'Full rolling-window populated',
      note: 'Your score now reflects sustained performance. Top miners by here have meaningful daily ROI on six-figure volume.' },
  ],

  monitoring: [
    { metric: 'Daily qualified_volume', threshold: '> minimum gate',  where: 'Almanac trading dashboard' },
    { metric: 'Rolling 30d ROI',        threshold: '> minimum gate',  where: 'Almanac trading dashboard' },
    { metric: 'Coldkey ↔ Almanac link', threshold: 'linked',          where: 'Almanac account settings' },
    { metric: 'Per-tempo incentive',    threshold: 'rising',          where: 'btcli subnet metagraph --netuid 41' },
  ],

  knownIssues: [
    {
      symptom: 'Validator sees no trades despite trading on Almanac',
      cause:   'Coldkey not linked to the Almanac account, or linked to a different coldkey than the one you registered on SN41.',
      fix:     'Use ONE coldkey end-to-end. Re-link in Almanac settings. Re-run `python miner.py` after a clean link.',
    },
    {
      symptom: 'Trading positive ROI but earning zero emission',
      cause:   'Volume below the minimum-volume eligibility gate.',
      fix:     'Scale up bankroll or trade count. The optimizer skips low-volume traders by design — small ROI on big volume beats huge ROI on tiny volume.',
    },
    {
      symptom: 'Earnings dropped sharply after a single losing day',
      cause:   'Decaying-memory weighting — recent epochs dominate older ones, so one bad day can drag the rolling score.',
      fix:     'Size positions to survive bad days. The system is designed to favor steady traders.',
    },
  ],

  notes: [
    'SN41 has pivoted from sport-specific prediction-model neurons to a Polymarket-trading model via Almanac. The older MLB/NFL/EPL/MLS repos are reference material from the previous incarnation.',
    'If you want a model-as-neuron sports subnet, you are looking at the wrong subnet — this is now a prediction-market wrapper.',
  ],
};
