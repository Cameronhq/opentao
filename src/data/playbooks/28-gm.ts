import type { RichPlaybook } from '../playbook-rich';

// SN28 — gm (Foundry S&P 500 Oracle). Operated by Foundry Digital (DCG).
// Short-term S&P 500 price prediction via commit-reveal. Miners must
// open-source models AND training data on HuggingFace to earn emission.

export const sn28: RichPlaybook = {
  slug: '28-gm',
  netuid: 28,
  name: 'gm (S&P 500 Oracle)',
  category: 'reason',
  categoryLabel: 'Forecasting',

  blurb:
    'Decentralized S&P 500 short-horizon forecasting oracle. Miners predict six 5-minute close prices during US market hours via commit-reveal; all models + training data must be open-sourced on HuggingFace.',

  whatMinersDo:
    'A SN28 miner runs `snp_oracle/neurons/miner.py` (via `make miner`) which loads a neural-net time-series model (default base_lstm in `mining_models/base_lstm_new.h5`) and serves predictions to validators. During US market hours the validator sends a future timestamp; the miner returns six committed price predictions for the next six 5-minute intervals using commit-reveal. The miner also auto-publishes its model + encrypted training data to a public HuggingFace repo defined by `--hf_repo_id`; data is decrypted on-chain after validator evaluation.',

  verifiedAt: '2026-06-01',
  verifiedBy: '@editorial',

  emission: '— τ/day',
  burnCostFallback: '— τ',
  minerCountFallback: 0,
  slotCap: 256,

  hardware: [
    {
      role: 'GPU node',
      count: '1',
      gpu: '1× modern NVIDIA (RTX 3090 / 4090 / A4000 sufficient for default LSTM)',
      vramGb: 8,
      cpuCores: 2,
      ramGb: 8,
      diskGb: 50,
      bandwidth: 'reliable market-data ingestion · 100 Mbps',
      notes: 'Base miner only needs 8 GB RAM + 2 vCPU per docs. Custom transformer models may need more VRAM.',
    },
  ],
  hardwareNote:
    'README explicitly warns: "DO NOT RUN THE BASE MINER ON MAINNET" — the bundled LSTM is a placeholder; custom forecasting models are required to earn meaningful emission.',

  rentalOk: true,
  rentalUsdPerHr: { lambda: 0.49, runpod: 0.39, coreweave: 0.50 },

  repo: {
    url: 'https://github.com/foundryservices/snpOracle',
    branch: 'main',
    minerEntrypoint: 'snp_oracle/neurons/miner.py',
  },

  setupShape: 'simple-binary',
  setupOverview:
    'Install PM2 + Python + Poetry, clone snpOracle, fill `.env` with a HuggingFace access token, edit the Makefile with your wallet info + ports + model path, then `make miner`. Model + training data are auto-uploaded to a public HuggingFace repo so validators can fetch them.',

  install: [
    { step: 'Install PM2',
      cmd: 'sudo apt update && sudo apt install -y nodejs npm && sudo npm install pm2@latest -g' },
    { step: 'Clone snpOracle',
      cmd: 'git clone https://github.com/foundryservices/snpOracle.git && cd snpOracle' },
    { step: 'Create venv',
      cmd: 'python3 -m venv .venv && source .venv/bin/activate' },
    { step: 'Install with poetry',
      cmd: 'pip install poetry && poetry install' },
    { step: 'Copy env template',
      cmd: 'cp .env.miner.template .env' },
    { step: 'Add HuggingFace access token to .env',
      note: 'Set MINER_HF_ACCESS_TOKEN in .env — get it from huggingface.co/settings/tokens. The HF repo will be created automatically and must be public.' },
    { step: 'Edit Makefile with wallet info',
      note: 'Set coldkey, miner_hotkey, axon port (default 8092), --hf_repo_id (your HF org/repo), and --model (path to your model file).' },
    { step: 'Register on SN28',
      cmd: 'btcli subnet register --netuid 28 --wallet.name $WALLET --wallet.hotkey $HOTKEY' },
  ],

  runSteps: [
    { step: 'Start base miner via Makefile',
      cmd: 'make miner',
      note: 'Make sure the virtualenv is activated. For a custom miner, edit `forward()` in snp_oracle/neurons/miner.py first.' },
    { step: 'Verify on metagraph',
      cmd: 'btcli subnet metagraph --netuid 28' },
  ],

  envVars: [
    { name: 'WALLET',                   description: 'Coldkey name',                                                       required: true },
    { name: 'HOTKEY',                   description: 'Hotkey name',                                                        required: true },
    { name: 'MINER_HF_ACCESS_TOKEN',    description: 'HuggingFace token with write access — auto-publishes model + data',  required: true },
  ],

  scoring: {
    summary:
      'Commit-reveal price forecasts evaluated against real S&P 500 prints over six 5-minute horizons. Two metrics per the incentive white paper: directional accuracy (was the prediction in the same direction as the true move?) and mean absolute error (how far off?).',
    rule: 'Best directional accuracy + lowest MAE over the rolling scoring window wins. Open-sourced model + training data on HuggingFace are required for emission.',
    sourcePath: 'foundryservices/snpOracle · docs/SN28 Incentive Mechanism.pdf',
    cheatPath:
      "Commit-reveal kills any 'see-the-future' cheat — predictions are hashed before reveal. Copying another miner's HuggingFace model gives identical accuracy but not higher score — Pareto efficiency / novelty terms in the spec disadvantage clones. Hiding training data fails the open-source requirement and scores zero.",
  },

  profitability: {
    estimatedDailyEmissionPerUid: 0.0,
    tokenPriceUsdFallback: 284,
    capexNote:
      'Very light infra — a single A4000 or 4090 box is plenty. Cost is model R&D, not hardware.',
    notes:
      'Distribution skews to the few miners with genuinely better architectures or feature sets. Base miner explicitly will not earn meaningfully.',
  },

  milestones: [
    { day: 'day 1',  target: 'Miner serving during US market hours', note: 'PM2 process up; predictions visible in HuggingFace repo; metagraph shows your UID.' },
    { day: 'day 3',  target: 'First scored predictions',             note: 'Validators have rolled enough 5-min windows to score you; weights start writing on-chain.' },
    { day: 'day 7',  target: 'Custom model deployed',                note: 'Base LSTM swapped out; directional accuracy noticeably above 50% on validator probes.' },
    { day: 'day 14', target: 'Out of immunity period',               note: 'Surviving deregistration; if borderline, retrain with better features (macro data, sector ETFs).' },
    { day: 'day 30', target: 'Top-quartile MAE',                     note: 'Score consistently in the top 25% of miners — emissions justify the R&D investment.' },
  ],

  monitoring: [
    { metric: 'Market-hours availability',  threshold: '100% Mon-Fri 9:30-16:00 ET', where: 'pm2 logs · miner must be up during US market hours' },
    { metric: 'HuggingFace upload success', threshold: '100%',                       where: 'huggingface.co/<your-repo> — should have latest model + data files' },
    { metric: 'Directional accuracy',       threshold: '> 55%',                      where: 'validator dashboards · 50% is random-walk baseline' },
    { metric: 'Axon reachability',          threshold: '> 99.5%',                    where: 'curl http://<miner-ip>:<axon-port>/ from outside' },
  ],

  knownIssues: [
    {
      symptom: 'Validators score you at zero despite serving',
      cause:   'HuggingFace repo is private or upload failed — open-source requirement violated.',
      fix:     'Verify the repo at huggingface.co/<user>/<repo> is public and contains both model weights + data. Re-run with valid MINER_HF_ACCESS_TOKEN if upload failed.',
    },
    {
      symptom: 'Predictions arrive outside the commit window',
      cause:   'Clock drift on the host or slow inference latency — commit must land before reveal.',
      fix:     '`sudo ntpdate -s pool.ntp.org` and confirm system clock; profile model inference time and trim feature pipeline if it exceeds the commit window.',
    },
    {
      symptom: 'Running base LSTM and earning nothing',
      cause:   "README explicitly warns the base miner is not for mainnet — it has no useful predictive power.",
      fix:     "Build a custom model. Edit `forward()` in snp_oracle/neurons/miner.py; reference `base_miner.py` for the call shape. Many top miners use transformer or hybrid LSTM/transformer architectures.",
    },
    {
      symptom: 'Miner running on weekends / off-hours but earning nothing',
      cause:   'SN28 only scores during US market hours; off-hours probes are practice runs.',
      fix:     "This is expected — you don't need to mine 24/7, only during market hours, but reliable uptime during those hours is critical.",
    },
  ],

  notes: [
    'Subnet was the v1.0.0 SN28 release (Feb 2024) — codebase is mature and changes infrequently.',
    'Foundry is a DCG subsidiary; SN28 is one of the flagship Yuma-backed financial subnets.',
    'Wiki contains a Registration Fee Schedule — check it before registering; SN28 burn cost spikes pre-market on Mondays.',
  ],
};
