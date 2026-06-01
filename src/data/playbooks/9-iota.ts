import type { RichPlaybook } from '../playbook-rich';

// SN9 — IOTA (Macrocosmos). Distributed pretraining of a Llama-inspired
// model across heterogeneous GPUs. Miners contribute compute to pipeline-
// parallel layers; validators reward usable gradient contributions.

export const sn9: RichPlaybook = {
  slug: '9-iota',
  netuid: 9,
  name: 'IOTA',
  category: 'compute',
  categoryLabel: 'Distributed pretraining',

  blurb:
    'Contribute a GPU to a pipeline-parallel pretraining run of a Llama-style model. Miners hold layers, exchange activations, and earn emission for useful gradient work.',

  whatMinersDo:
    "An IOTA miner runs a node that joins the cooperative pretraining run orchestrated by Macrocosmos. The miner is assigned a slice of a Llama-inspired model (currently a 1.5B-parameter, 3-layer architecture in bfloat16) and exchanges activations / gradients with the rest of the pipeline through the orchestrator. Validators check that contributed gradients are real and useful; emissions reward consistent, correct compute, and the architecture is designed to tolerate unreliable devices.",

  verifiedAt: '2026-06-01',
  verifiedBy: '@editorial',

  emission: '— τ/day',
  burnCostFallback: '— τ',
  minerCountFallback: 0,
  slotCap: 256,

  hardware: [
    {
      role: 'GPU miner node',
      count: '1',
      gpu: 'RTX 4090 (24 GB) or better; ≥ 16 GB VRAM minimum',
      vramGb: 24,
      cpuCores: 8,
      ramGb: 32,
      diskGb: 100,
      bandwidth: '500 Mbps (low-latency to orchestrator preferred)',
      notes: 'Ubuntu 22.04 (Jammy). Current model footprint is ~2 GB on disk; bigger model phases will raise the VRAM floor.',
    },
  ],
  hardwareNote:
    'Validator slots are stake-gated and small in number (~10). For most operators, running a miner is the contribution path.',

  rentalOk: true,
  rentalUsdPerHr: { lambda: 0.69, runpod: 0.59 },

  repo: {
    url: 'https://github.com/macrocosm-os/IOTA',
    branch: 'main',
    minerEntrypoint: 'start_miner.sh (PM2 config at pm2/miner.config.js)',
  },

  setupShape: 'simple-binary',
  setupOverview:
    "Clone the IOTA repo, run the interactive `setup.sh` and pick `Miner`, fill in the .env (wallet + HF token + endpoints), then start with `./start_miner.sh` or via PM2.",

  install: [
    { step: 'Install uv (Python package manager)',
      cmd:  'curl -LsSf https://astral.sh/uv/install.sh | sh' },
    { step: 'Clone the IOTA repo',
      cmd:  'git clone https://github.com/macrocosm-os/IOTA && cd IOTA' },
    { step: 'Run the interactive setup script (choose Miner)',
      cmd:  'bash setup.sh' },
    { step: 'Copy and fill the miner .env template',
      cmd:  'cp src/miner/miner-example.env .env',
      note: 'Fill MINER_WALLET, MINER_HOTKEY, HF_TOKEN at minimum.' },
    { step: 'Register the hotkey on SN9',
      cmd:  'btcli subnet register --netuid 9 --wallet.name $MINER_WALLET --wallet.hotkey $MINER_HOTKEY' },
  ],

  runSteps: [
    { step: 'Start the miner',
      cmd:  'bash ./start_miner.sh',
      note: 'Foreground run — fine for testing.' },
    { step: 'Or run in background with PM2',
      cmd:  'pm2 start pm2/miner.config.js' },
    { step: 'Check health endpoint',
      cmd:  'curl http://0.0.0.0:8001/health',
      note: 'MINER_HEALTH_HOST/PORT defaults to 0.0.0.0:8001.' },
  ],

  envVars: [
    { name: 'MINER_WALLET',          description: 'Coldkey name',                                  required: true },
    { name: 'MINER_HOTKEY',          description: 'Hotkey name registered on netuid 9',            required: true },
    { name: 'NETUID',                description: 'Defaults to 9 for mainnet',                     required: true },
    { name: 'NETWORK',               description: 'finney (mainnet) or test',                      required: true },
    { name: 'DEVICE',                description: 'cuda — required for GPU mining',                required: true },
    { name: 'BITTENSOR',             description: 'True for on-chain participation',               required: true },
    { name: 'MOCK',                  description: 'False — set True only for local testing',       required: false },
    { name: 'LOG_FILE_ENABLED',      description: 'False by default',                              required: false },
    { name: 'HF_TOKEN',              description: 'Hugging Face token to pull model artifacts',    required: true },
    { name: 'MINER_HEALTH_HOST',     description: 'Default 0.0.0.0',                               required: false },
    { name: 'MINER_HEALTH_PORT',     description: 'Default 8001',                                  required: false },
    { name: 'MINER_HEALTH_ENDPOINT', description: 'Default /health',                               required: false },
  ],

  scoring: {
    summary:
      "Validators verify each miner's contribution to the cooperative pretraining run — gradients must reduce the loss on the held-out validation slice and follow protocol. Miners contributing useful, on-schedule activations + gradients earn emission; stalled or fake contributions earn nothing.",
    rule: 'Useful, on-protocol gradient updates on assigned layers, delivered within the orchestrator window.',
    sourcePath: 'macrocosm-os/IOTA · src/miner + orchestrator code',
    cheatPath:
      "Submitting random or zero gradients is filtered by the validator. Time-sharing a single GPU across hotkeys cuts your effective throughput per UID and lowers score. Mock mode does not earn emissions.",
  },

  profitability: {
    estimatedDailyEmissionPerUid: 0,
    tokenPriceUsdFallback: 284,
    capexNote:
      "A single RTX 4090 box ($0.4–$0.7/hr rented, or ~$2k–$3k to own) is enough at the current 1.5B model scale. Bigger model phases will push the VRAM floor up to A100/H100 territory.",
    notes:
      "Macrocosmos pushes upgrades frequently; pin the IOTA repo to a tag, not main, in production and watch the Macrocosmos Discord for model-size changes.",
  },

  milestones: [
    { day: 'day 1', target: 'Miner healthy, incentive > 0', note: 'curl :8001/health returns ok and your hotkey appears in the IOTA dashboard.' },
    { day: 'day 3', target: 'Gradient contributions counted on dashboard', note: 'https://iota.macrocosmos.ai/ shows your hotkey contributing to a pipeline stage.' },
    { day: 'day 7', target: 'Incentive above the floor of non-immune miners', note: 'If you are at the floor, check VRAM headroom and bandwidth latency to the orchestrator.' },
    { day: 'day 14', target: 'Survives a model-size bump', note: 'When the model scales, miners with under-spec GPUs drop out — be ready to upgrade.' },
  ],

  monitoring: [
    { metric: 'Miner health endpoint',         threshold: '200 ok',     where: 'curl http://0.0.0.0:8001/health' },
    { metric: 'GPU memory in use',             threshold: '> 50% VRAM', where: 'nvidia-smi' },
    { metric: 'Activations/sec exchanged',     threshold: 'matches peers', where: 'Macrocosmos IOTA dashboard' },
    { metric: 'Incentive per tempo',           threshold: 'rising or flat', where: 'btcli subnet metagraph --netuid 9' },
  ],

  knownIssues: [
    {
      symptom: 'Miner starts but never participates in the pipeline',
      cause:   'HF_TOKEN is missing or unauthorised to pull model artifacts.',
      fix:     'Generate a read-scope HF token and put it in .env; restart the miner.',
    },
    {
      symptom: 'CUDA OOM during forward/backward pass',
      cause:   'VRAM at or below the 16 GB floor and the current model phase has grown.',
      fix:     'Move to a 24 GB+ card (RTX 4090, A6000, A100). Lower batch size in env if exposed.',
    },
    {
      symptom: 'High loss / stale gradients on dashboard',
      cause:   'High latency or packet loss between miner and orchestrator.',
      fix:     'Move closer (datacenter region) or move to a lower-jitter network. Verify ping to the orchestrator < 100 ms.',
    },
    {
      symptom: 'PM2 keeps restarting the miner',
      cause:   'Wallet not registered on netuid 9, or DEVICE=cpu accidentally set.',
      fix:     'Register the hotkey and double-check `DEVICE=cuda` in .env.',
    },
  ],

  notes: [
    'Repo: https://github.com/macrocosm-os/IOTA. Live training dashboard: https://iota.macrocosmos.ai/.',
    'Current scale is a 1.5B-parameter Llama-style model with 3 layers in bfloat16; expect model-size bumps over time.',
    'Validator slots are stake-gated (~10 total). Most contributors run miners.',
    'Architecture explicitly tolerates unreliable devices, but consistent uptime still wins emission share.',
  ],
};
