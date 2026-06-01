import type { RichPlaybook } from '../playbook-rich';

// SN79 — MVTRX / TAOS. Agent-based market simulation. Miners submit risk-managed
// trading instructions per simulation tick. Optional GenTRX track adds GPU
// gradient training (~5% of reward).

export const sn79: RichPlaybook = {
  slug: '79-mvtrx',
  netuid: 79,
  name: 'MVTRX',
  category: 'reason',
  categoryLabel: 'Reasoning',

  blurb:
    'Agent-based market simulation. Miners implement automated trading strategies and submit risk-managed orders into ~40 simulated orderbooks (1,000 background agents each). Scored on intraday Kappa-3 risk-adjusted P&L.',

  whatMinersDo:
    "A MVTRX miner runs `taos/im/neurons/miner.py` (wrapped by `run_miner.sh`). Each validator-published simulation state (orderbook snapshots + background agent activity + market conditions) lands on the miner's axon; the miner returns a set of risk-managed trading instructions within the response window. Instructions execute inside the simulation. The standard trading pool (~95% of reward) is scored on intraday Kappa-3. An optional GenTRX track (~5%) lets miners participate in distributed gradient training against held-out orderbook data — opt in with the `-G` flag.",

  verifiedAt: '2026-06-01',
  verifiedBy: '@editorial',

  emission: '— τ/day',
  burnCostFallback: '— τ',
  minerCountFallback: 0,
  slotCap: 256,

  hardware: [
    {
      role: 'Strategy miner',
      count: '1',
      cpuCores: 4,
      ramGb: 4,
      diskGb: 50,
      bandwidth: 'Low-latency to validator axons',
      notes: '~1 GB RAM per miner instance for the base package; resource needs scale with strategy complexity. Multiple UIDs need different ports + hotkeys.',
    },
    {
      role: 'GenTRX miner (optional, +5% reward pool)',
      count: '1',
      gpu: 'NVIDIA 6–8 GB VRAM minimum',
      vramGb: 8,
      cpuCores: 8,
      ramGb: 16,
      diskGb: 100,
      bandwidth: 'Standard',
      notes: 'CPU-only training is supported but may miss round deadlines. Install NVIDIA drivers + CUDA before enabling GenTRX. The shipped HybridTrainingAgent is a template — tune before serious use.',
    },
  ],
  hardwareNote: 'Strategy pool is CPU-bound and capex-light. GenTRX is optional, adds GPU but only ~5% of the reward pool.',

  rentalOk: true,
  rentalUsdPerHr: { lambda: 0.30, runpod: 0.25, coreweave: 0.40 },

  repo: {
    url: 'https://github.com/taos-im/sn-79',
    branch: 'main',
    minerEntrypoint: 'taos/im/neurons/miner.py',
  },

  setupShape: 'simple-binary',
  setupOverview:
    'Run `./install_miner.sh` to install Python 3.10.9, pm2, pyenv, prometheus-node-exporter, and the τaos framework. Re-open the shell, then `./run_miner.sh -w $WALLET -h $HOTKEY -u 79 -a 8091` to launch under pm2. Add `-G` to opt into GenTRX (requires NVIDIA drivers + CUDA). First GenTRX run creates `.env` with S3 (R2/Hippius) bucket creds + API keys.',

  install: [
    { step: 'Clone repo',
      cmd: 'git clone https://github.com/taos-im/sn-79.git && cd sn-79' },
    { step: 'Run install script',
      cmd: './install_miner.sh',
      note: 'Installs Python 3.10.9, pm2, pyenv, prometheus-node-exporter, τaos framework. Re-open shell after install.' },
    { step: 'Optional: install NVIDIA drivers + CUDA',
      note: 'Required only if you plan to use the `-G` GenTRX training flag.' },
    { step: 'Register on subnet',
      cmd: 'btcli subnet register --netuid 79 --wallet.name $WALLET --wallet.hotkey $HOTKEY' },
  ],

  runSteps: [
    { step: 'Start miner (standard trading pool)',
      cmd: './run_miner.sh -w $WALLET -h $HOTKEY -u 79 -a 8091' },
    { step: 'Start miner with GenTRX training (optional)',
      cmd: './run_miner.sh -G -w $WALLET -h $HOTKEY -u 79 -a 8091',
      note: 'First run creates `.env` with S3 bucket creds + API keys.' },
    { step: 'Manual launch (no pm2)',
      cmd: `cd taos/im/neurons && python miner.py \\
  --netuid 79 \\
  --subtensor.chain_endpoint $ENDPOINT \\
  --wallet.path $WALLET_PATH \\
  --wallet.name $WALLET \\
  --wallet.hotkey $HOTKEY \\
  --axon.port $AXON_PORT` },
  ],

  envVars: [
    { name: 'WALLET',     description: 'Coldkey name',                                                            required: true },
    { name: 'HOTKEY',     description: 'Hotkey name',                                                             required: true },
    { name: 'ENDPOINT',   description: 'Subtensor chain endpoint (default: finney)',                              required: false },
    { name: 'WALLET_PATH',description: 'Path to btcli wallet dir (default ~/.bittensor/wallets)',                 required: false },
    { name: 'AXON_PORT',  description: 'Port miner listens on (e.g. 8091)',                                       required: true },
  ],

  scoring: {
    summary:
      'Two-pool scoring. Trading pool (~95% of reward): intraday Kappa-3 ratio on realised P&L inside the simulation; Kappa-3 penalises downside variance more heavily than upside. Miners must also maintain a minimum trading volume to get their risk-adjusted score allocated in full. GenTRX pool (~5%): gradient quality against held-out orderbook data (opt-in via -G).',
    rule: 'Trading: Kappa-3 × min_volume_gate. GenTRX (optional): gradient_quality × deadline_compliance.',
    sourcePath: 'taos-im/sn-79 · README + scoring docs',
    cheatPath:
      'Over-fitting to specific simulation regimes, exploiting toy assumptions in the background-agent model, or trading on knowledge of upcoming state if any leaks. Counters: diverse simulated regimes, evolving background-agent populations, statistical-significance requirements that scale-up to 1,000+ orderbooks targets.',
  },

  profitability: {
    estimatedDailyEmissionPerUid: 0.0,
    tokenPriceUsdFallback: 284,
    capexNote: 'Strategy-only: capex near zero — a small VM is enough. GenTRX adds the cost of a 6–8 GB GPU.',
    notes: 'Alpha generation dominates — top miners differ on strategy, not hardware. The ~5% GenTRX pool is bonus, not the main game.',
  },

  milestones: [
    { day: 'day 1',  target: 'Miner running, responding to ticks', note: 'pm2 process up; logs show simulation-state requests + order responses within the window.' },
    { day: 'day 3',  target: 'Positive Kappa-3 across cycles',     note: 'Default template strategies need tuning — expect to iterate.' },
    { day: 'day 7',  target: 'Minimum volume threshold cleared',   note: 'Below the volume gate, risk-adjusted score is not allocated in full.' },
    { day: 'day 30', target: 'Top-half on Kappa-3 leaderboard',    note: 'Strategy iteration matters more than compute; consider rotating regimes for robustness.' },
  ],

  monitoring: [
    { metric: 'Response within window',  threshold: '100%',           where: 'Miner logs / validator timeout reports' },
    { metric: 'Kappa-3 (trailing)',      threshold: '> 0',            where: 'Validator scoring outputs / project dashboard' },
    { metric: 'Daily volume',            threshold: '≥ min gate',     where: 'Validator outputs (volume threshold for full-score allocation)' },
    { metric: 'pm2 status',              threshold: 'online',         where: '`pm2 ls`' },
    { metric: 'Per-tempo incentive',     threshold: 'rising or flat', where: 'btcli subnet metagraph --netuid 79' },
  ],

  knownIssues: [
    {
      symptom: 'GenTRX missing round deadlines',
      cause:   'CPU-only training too slow for the round budget.',
      fix:     'Add a 6–8 GB NVIDIA GPU + CUDA. Or drop the -G flag and earn from the trading pool only.',
    },
    {
      symptom: 'Risk-adjusted score not fully allocated',
      cause:   'Daily trading volume below the minimum gate.',
      fix:     'Increase order frequency (within risk discipline) until the volume gate is cleared.',
    },
    {
      symptom: 'Default HybridTrainingAgent earns poorly',
      cause:   'It is a template, not a competitive strategy.',
      fix:     'Tune the agent or replace with your own strategy class. The shipped one is a starting point.',
    },
    {
      symptom: 'Newly installed commands not found',
      cause:   'install_miner.sh installs into pyenv-managed Python; PATH not refreshed.',
      fix:     'Re-open the shell session (or `source ~/.bashrc`) after running install_miner.sh.',
    },
    {
      symptom: 'Multiple miner UIDs colliding',
      cause:   'Same wallet/hotkey/port across instances.',
      fix:     'Assign each miner a distinct hotkey + axon port (-h, -a flags).',
    },
  ],

  notes: [
    'Roadmap: scale simulation from ~40 orderbooks (1,000 agents each) to 1,000+ orderbooks for statistical significance.',
    'MVTRX exchange surface (for dTAO alpha-token trading) is the downstream live-trading deployment of SN79 simulation work.',
    'GenTRX is optional and worth ~5% of the reward pool — main game is the strategy pool.',
  ],
};
