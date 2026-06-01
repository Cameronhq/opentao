import type { RichPlaybook } from '../playbook-rich';

// SN59 — Babelbit. Real-time speech-to-speech translation with predictive LLM completion.
// Miner is an HTTP server (`bb server`) that loads the Hibiki/Moshi speech model family
// and answers validator-signed predict requests. The validator transcribes returned audio
// and scores on latency × meaning fidelity. README: github.com/babelbit/babelbit_miner.

export const sn59: RichPlaybook = {
  slug: '59-babelbit',
  netuid: 59,
  name: 'Babelbit',
  category: 'audio',
  categoryLabel: 'Audio · Speech',

  blurb:
    'Real-time speech-to-speech translation subnet. Miners run a `bb server` HTTP service loading a Hibiki/Moshi speech model and answer validator speech prompts under a tight latency budget.',
  whatMinersDo:
    "A Babelbit miner exposes an HTTP `predict` endpoint backed by a streaming speech model (Hibiki/Moshi family by default). The validator sends Bittensor-signed audio prompts; the miner has to predict the rest of the phrase and emit a translated audio segment under a strict latency budget. Scoring is done client-side by the validator transcribing the returned audio and grading prediction × meaning × latency.",

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
      gpu: '1× modern NVIDIA (Hibiki/Moshi-class)',
      vramGb: 24,
      cpuCores: 8,
      ramGb: 32,
      diskGb: 100,
      bandwidth: 'static public IP · low-latency uplink',
      notes: 'README does not pin a min-compute spec; Hibiki/Moshi family runs on consumer GPUs (RTX 4090 / A6000 class) for sub-second streaming.',
    },
  ],
  hardwareNote:
    'Latency is the score. Pick a GPU that hits real-time on your chosen speech model, and host close to the validator pool.',

  rentalOk: true,
  rentalUsdPerHr: { lambda: 0.79, runpod: 0.69, coreweave: 0.99 },

  repo: {
    url: 'https://github.com/babelbit/babelbit_miner',
    branch: 'main',
    extraRepos: [
      { name: 'babelbit_subnet', url: 'https://github.com/babelbit/babelbit_subnet', purpose: 'Validator + protocol code' },
    ],
  },

  setupShape: 'simple-binary',
  setupOverview:
    'Setup is a Python project managed with `uv`. Install deps, set the HF model env vars and your wallet, then run `uv run bb server --port 8000`. The miner is a FastAPI app that responds to signed validator requests; local testing uses `MINER_TEST_MODE=1` or `MINER_DEV_MODE=1`.',

  install: [
    { step: 'Clone the miner repo',
      cmd:  'git clone https://github.com/babelbit/babelbit_miner && cd babelbit_miner' },
    { step: 'Install Python deps via uv',
      cmd:  'uv sync' },
    { step: 'Register hotkey on SN59',
      cmd:  'btcli subnet register --netuid 59 --wallet.name $WALLET --wallet.hotkey $HOTKEY',
      note: 'Re-check burn-cost immediately before this.' },
  ],

  runSteps: [
    { step: 'Test mode (no model load, sanity check)',
      cmd:  'MINER_TEST_MODE=1 uv run bb server --port 8000' },
    { step: 'Dev mode (real model, no Bittensor header verification)',
      cmd:  'MINER_DEV_MODE=1 uv run bb server --port 8000' },
    { step: 'Production (signed requests only)',
      cmd:  'uv run bb server --port 8000',
      note: 'Open axon port to the public IP so validators can reach you.' },
  ],

  envVars: [
    { name: 'WALLET',             description: 'Coldkey name (matches btcli wallet list)',                  required: true },
    { name: 'HOTKEY',             description: 'Hotkey name on that coldkey',                               required: true },
    { name: 'MINER_IMPL',         description: 'Miner implementation module; default server.miner_impl_hibiki', required: false },
    { name: 'MINER_CONFIG_PATH',  description: 'Path to config JSON (default server/config/hibiki_config.json)', required: false },
    { name: 'HF_MODEL_REPO_ID',   description: 'Hugging Face model repo id (Hibiki/Moshi family)',         required: false },
    { name: 'HF_MODEL_REVISION',  description: 'HF revision pin',                                          required: false },
    { name: 'MINER_PRELOAD_MODEL',description: 'Load model weights on startup (default true)',             required: false },
    { name: 'MINER_RATE_LIMIT_RPS', description: 'Global app-level predict rate limit (default 20)',       required: false },
    { name: 'MINER_MAX_CONCURRENCY', description: 'In-flight request cap (default 8)',                     required: false },
  ],

  scoring: {
    summary:
      'Validator sends a Bittensor-signed audio prompt. The miner returns a translated/predicted audio segment. The validator transcribes the returned audio and grades on a composite of prediction accuracy, semantic fidelity, fluency, and end-to-end latency. Latency multiplies into the score, so stalling for context is the dominant losing move.',
    rule: 'Predict the phrase completion and emit translated audio earlier than your peers without losing meaning.',
    cheatPath:
      "Waiting for the full clause before answering — latency penalty crushes the score even if the translation is perfect. Don't run in MINER_DEV_MODE on mainnet; unsigned requests will be served and validators reject your axon's identity.",
  },

  profitability: {
    estimatedDailyEmissionPerUid: 0.0,
    tokenPriceUsdFallback: 284,
    notes:
      'No firm per-UID emission baseline disclosed; subnet is in early tournament phase. Treat estimates as zero until you observe a tempo or two.',
  },

  milestones: [
    { day: 'day 1', target: '`bb server` answers /predict locally in test mode', note: 'curl the local server with a test payload; latency under your target budget.' },
    { day: 'day 3', target: 'Live on mainnet, axon reachable, validator probes hitting',  note: 'Check btcli subnet metagraph --netuid 59 for UID + non-zero trust.' },
    { day: 'day 14', target: 'Out of immunity, incentive > floor',                        note: 'If still near zero, profile latency — that is almost always the bottleneck on SN59.' },
  ],

  monitoring: [
    { metric: 'predict() p95 latency',  threshold: '< target budget',  where: 'app logs · sub-second is the bar for streaming speech' },
    { metric: 'Axon reachability',      threshold: '100% from outside', where: 'curl http://<miner-ip>:8000/health from a different network' },
    { metric: 'Rejected unsigned requests', threshold: '0 on mainnet',  where: 'app logs — only DEV_MODE/TEST_MODE should serve unsigned' },
    { metric: 'Per-tempo incentive',    threshold: 'rising or flat',    where: 'btcli subnet metagraph --netuid 59 · check every ~72 min' },
  ],

  knownIssues: [
    {
      symptom: 'Local curl returns 401 / unsigned-request error',
      cause:   'Production mode rejects unsigned requests by design.',
      fix:     'Set `MINER_DEV_MODE=1` for local tests, or sign requests with a Bittensor hotkey.',
    },
    {
      symptom: '`bb test` succeeds but production audio scoring is bad',
      cause:   '`bb test` is a legacy container compatibility helper, not the authoritative audio end-to-end check.',
      fix:     'Validate against actual validator-shaped requests in DEV mode before going live.',
    },
    {
      symptom: 'Latency too high → score stays near zero',
      cause:   'Model too large for the GPU, or model preload disabled and first request pays the load tax.',
      fix:     'Keep `MINER_PRELOAD_MODEL=true`, profile model latency, downgrade to a smaller Hibiki variant if needed.',
    },
  ],

  notes: [
    'Hibiki/Moshi is the default speech stack but the `MINER_IMPL` env var lets you ship a custom implementation module.',
    'The subnet is operated by BabelBit Ltd (UK); founder Matthew Karas posts updates on x.com/babelbit.',
  ],
};
