import type { RichPlaybook } from '../playbook-rich';

// SN50 — Synth (Mode Network / synthdata.co)
// Two competitions: 24h (50% emissions) and 1h HFT (50% emissions). Miners
// submit 1000 Monte Carlo price paths per asset. Scoring is CRPS on
// basis-point price changes, smoothed via per-timeframe rolling windows, then
// softmaxed for emissions.

export const sn50: RichPlaybook = {
  slug: '50-synth',
  netuid: 50,
  name: 'Synth',
  category: 'reason',
  categoryLabel: 'Forecasting',

  blurb:
    'Probabilistic price-path miner — 1000-path Monte Carlo simulations across crypto, equities, and commodities. Scored by CRPS.',
  whatMinersDo:
    "On each prompt the miner receives (asset, start_time, time_increment, time_horizon, num_simulations) and must return 1000 simulated price paths over the validator's time grid. Two competitions run in parallel: 24h (5-min increments, 24h horizon, every ~60 min, 12 assets) and 1h HFT (1-min increments, 1h horizon, every ~10 min, 5 assets). The model you plug in lives at synth/miner/simulations.py.",

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
      diskGb: 50,
      bandwidth: 'normal (port 8091 open inbound)',
      notes: 'No GPU required — difficulty is statistical, not compute. A modest VPS is sufficient unless your model is heavy.',
    },
  ],
  hardwareNote:
    'Synth is unusual: top miners win on modelling sophistication, not on hardware spend. Volatility clustering + fat-tail capture beats GPUs.',

  rentalOk: true,
  rentalUsdPerHr: { lambda: 0.10, runpod: 0.08, coreweave: 0.12 },

  repo: {
    url: 'https://github.com/synthdataco/synth-subnet',
    branch: 'main',
    extraRepos: [
      { name: 'miner_tutorial', url: 'https://github.com/synthdataco/synth-subnet/blob/main/docs/miner_tutorial.md', purpose: 'Step-by-step miner setup' },
      { name: 'miner_reference', url: 'https://github.com/synthdataco/synth-subnet/blob/main/docs/miner_reference.md', purpose: 'CLI flags + FAQ' },
      { name: 'miner-setup',     url: 'https://github.com/synthdataco/synth-subnet/tree/main/miner-setup', purpose: 'Terraform / Docker / Ansible one-shot installers' },
    ],
  },

  setupShape: 'simple-binary',
  setupOverview:
    'Standard Bittensor neuron under PM2. Install Python 3.11, clone the repo, pip install requirements, plug your model into synth/miner/simulations.py (the function receives all prompt parameters except sigma), then `pm2 start miner.config.js`. Port 8091 must be reachable.',

  install: [
    { step: 'System deps',
      cmd: 'sudo add-apt-repository ppa:deadsnakes/ppa && sudo apt update && sudo apt install nodejs npm python3.11 python3.11-venv pkg-config -y' },
    { step: 'Rust (for some deps)', cmd: "curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh" },
    { step: 'PM2', cmd: 'sudo npm install pm2 -g' },
    { step: 'Clone repo', cmd: 'git clone https://github.com/synthdataco/synth-subnet.git && cd synth-subnet' },
    { step: 'Venv + install', cmd: 'python3.11 -m venv bt_venv && source bt_venv/bin/activate && pip install -r requirements.txt' },
    { step: 'Sanity check', cmd: 'python synth/miner/run.py', note: 'Should print "CORRECT" — confirms dummy model format is valid.' },
    { step: 'Plug in your model', note: 'Edit synth/miner/simulations.py around line 25 — return 1000 paths in the validator-specified format.' },
    { step: 'Register hotkey', cmd: 'btcli subnet register --netuid 50 --wallet.name $WALLET --wallet.hotkey $HOTKEY', note: 'Coldkey needs ≥ 0.25 TAO to register.' },
  ],

  runSteps: [
    { step: 'Start (mainnet)',  cmd: 'pm2 start miner.config.js' },
    { step: 'Start (testnet)',  cmd: 'pm2 start miner.test.config.js' },
    { step: 'Tail logs',        cmd: 'pm2 logs' },
    { step: 'Verify metagraph', cmd: 'btcli subnet metagraph --netuid 50' },
  ],

  envVars: [
    { name: 'WALLET', description: 'Coldkey name', required: true },
    { name: 'HOTKEY', description: 'Hotkey name',  required: true },
  ],

  scoring: {
    summary:
      'CRPS on basis-point price changes at multiple time increments. For 24h: 5min, 30min, 3h, 24h. For 1h HFT: 1, 2, 5, 15, 30, 60 min plus "gaps from start" every 5 min. Per-prompt CRPS is summed, worst 10% capped at the 90th percentile (invalid submissions also = 90th pct), best score subtracted to 0. Rolling window: 10 days (24h comp) or 3 days (1h comp). Softmax with β=0.1 (24h) and β=0.2 (1h, sharper). Emissions split 50/50 between the two competitions.',
    rule: 'Lowest CRPS over the rolling window → most emissions. Calibration beats sharpness; over-confident narrow predictions and lazy wide priors both lose.',
    sourcePath: 'synthdataco/synth-subnet · synth/validator/',
    cheatPath:
      "Submitting paths from a smooth Gaussian fit to recent returns doesn't survive — crypto returns are fat-tailed; naive fits get hammered on the days that matter. Missing a deadline or returning malformed paths assigns the 90th-percentile penalty score.",
  },

  profitability: {
    estimatedDailyEmissionPerUid: 0.0,
    tokenPriceUsdFallback: 284,
    capexNote:
      'Capex-light. Top miners differentiate on modelling — GARCH variants, copula-stitched ensembles, deep generative path models. A laptop will run the reference model.',
    notes:
      'Synth has paid out >$2M cumulative to miners since Feb 2025; distribution is skewed to top modellers.',
  },

  milestones: [
    { day: 'day 1',  target: 'Reference miner up',  note: 'pm2 shows the process running. Logs show prompts arriving from validators and dummy predictions going out.' },
    { day: 'day 3',  target: 'Custom model plugged in', note: 'Replace synth/miner/simulations.py logic. Compare local CRPS to the dummy baseline.' },
    { day: 'day 10', target: 'First full rolling-window score', note: '24h competition uses a 10-day window — your true rank only stabilizes after that window fills.' },
    { day: 'day 21', target: 'Above-median rank', note: 'If still bottom-half, suspect: (a) Gaussian fit, (b) wrong asset weights, (c) missed deadlines.' },
  ],

  monitoring: [
    { metric: 'Deadline hit rate',     threshold: '100%',         where: 'pm2 logs — search "invalid" / "missed"' },
    { metric: 'Per-prompt CRPS',       threshold: 'below median', where: 'Validator dashboard or synth.mode.network leaderboard' },
    { metric: 'Port 8091 reachability', threshold: 'reachable',   where: 'curl from outside your network' },
    { metric: 'Per-tempo incentive',   threshold: 'rising/flat',  where: 'btcli subnet metagraph --netuid 50' },
  ],

  knownIssues: [
    { symptom: 'Submissions marked invalid',
      cause:   'Returned paths in wrong format, wrong number of paths, or after start_time.',
      fix:     'Re-read synth/miner/run.py output. Format = list of 1000 paths, each list of {time, price} dicts on the validator grid.' },
    { symptom: 'Validator cannot reach miner',
      cause:   'Port 8091 closed at firewall or cloud-provider ingress.',
      fix:     '`ufw allow 8091/tcp` and open it in the cloud console; verify with `curl <ip>:8091` from elsewhere.' },
    { symptom: 'Registration fails',
      cause:   'Coldkey has < 0.25 TAO or burn-cost spiked.',
      fix:     'Top up the coldkey; re-check burn-cost immediately before re-running register.' },
    { symptom: 'CRPS stays at 90th pct',
      cause:   'You are returning invalid submissions every cycle.',
      fix:     'Run `python synth/miner/run.py` until it prints CORRECT; only then switch to your real model.' },
  ],

  notes: [
    'Asset weights differ per asset (BTC=1.0, SPYX=3.44, XAU=1.74, etc.) — high-weight assets dominate the leaderboard math.',
    'Recommended to fetch start-time price from the Pyth Oracle for both miner and validator alignment.',
    "The 1h HFT competition's β=0.2 sharper softmax means rank gaps translate into bigger emission gaps than the 24h competition.",
  ],
};
