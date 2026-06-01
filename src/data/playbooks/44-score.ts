import type { RichPlaybook } from '../playbook-rich';

// SN44 — Score Vision. Sports computer vision (initially soccer). Miners run
// detection + tracking pipelines on validator-supplied video, returning
// standardized bounding-box annotations with confidence scores. Validation uses
// GS-HOTA = sqrt(Detection × Association) for quality scoring.

export const sn44: RichPlaybook = {
  slug: '44-score',
  netuid: 44,
  name: 'Score Vision',
  category: 'vision',
  categoryLabel: 'Computer Vision',

  blurb:
    'Decentralized sports computer vision. Miners run player / goalkeeper / referee / ball detection + tracking on soccer video served by validators, returning bounding-box annotations with confidence scores. Validation uses GS-HOTA (geometric mean of detection and association accuracy).',

  whatMinersDo:
    "A miner runs a FastAPI service (default port 7999) that accepts video clips from validators and returns standardized JSON annotations: per-frame bounding boxes for players, goalkeepers, referees, and the ball, each with a confidence score and a track ID for association across frames. The pipeline ships pre-configured for soccer (Roboflow Sports models). Validators re-evaluate samples and score on GS-HOTA = √(Detection × Association) — i.e. you must hit BOTH detection accuracy (right boxes) AND association accuracy (consistent track IDs).",

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
      gpu: 'RTX 3060 (12 GB) minimum; RTX 4090 recommended',
      vramGb: 12,
      cpuCores: 8,
      ramGb: 16,
      diskGb: 50,
      bandwidth: '100 Mbps',
      notes: 'min_compute spec: 4 cores / 8 GB RAM / 20 GB NVMe minimum. Production recommendation: dedicated 4090-class GPU. DEVICE env var supports cuda / cpu / mps.',
    },
  ],
  hardwareNote:
    'GPU is strongly recommended — the README explicitly defaults DEVICE=cuda and the troubleshooting section is full of CUDA-VRAM guidance. CPU fallback works but is non-competitive on real-time video.',

  rentalOk: true,
  rentalUsdPerHr: { lambda: 0.55, runpod: 0.49, coreweave: 0.65 },

  repo: {
    url: 'https://github.com/score-technologies/score-vision',
    branch: 'main',
  },

  setupShape: 'simple-binary',
  setupOverview:
    'Uses uv (the fast Python package manager) plus a FastAPI miner served by uvicorn. Two paths: (1) dev mode with `uvicorn main:app --reload`, (2) production with PM2 wrapping the venv\'s uvicorn binary. Default port 7999. Mainnet netuid 44; testnet netuid 261.',

  install: [
    { step: 'Clone the repo',
      cmd:  'git clone https://github.com/score-technologies/score-vision && cd score-vision' },
    { step: 'Install uv if not already installed',
      cmd:  'curl -LsSf https://astral.sh/uv/install.sh | sh' },
    { step: 'Install the miner extras',
      cmd:  'cd miner && uv pip install -e ".[miner]"' },
    { step: 'Copy env.example to .env',
      note: 'Set NETUID=44, SUBTENSOR_NETWORK, WALLET_NAME, HOTKEY_NAME, DEVICE=cuda, MIN_STAKE_THRESHOLD=2.' },
    { step: 'Register your hotkey on SN44',
      cmd:  'btcli subnet register --netuid 44 --wallet.name $WALLET_NAME --wallet.hotkey $HOTKEY_NAME' },
  ],

  runSteps: [
    { step: 'Production start with PM2',
      cmd:  'pm2 start --name "sn44-miner" --interpreter "../.venv/bin/python" "../.venv/bin/uvicorn" -- main:app --host 0.0.0.0 --port 7999',
      note: 'Pin the interpreter to the venv binary, not system python.' },
    { step: 'Dev start (auto-reload)',
      cmd:  'uvicorn main:app --reload --host 0.0.0.0 --port 7999',
      note: 'Use this when iterating on detection / tracking code.' },
    { step: 'Verify',
      cmd:  'curl http://localhost:7999/health && btcli subnet metagraph --netuid 44' },
  ],

  envVars: [
    { name: 'NETUID',              description: '44 for mainnet, 261 for testnet',     required: true },
    { name: 'SUBTENSOR_NETWORK',   description: 'finney (mainnet) or test',             required: true },
    { name: 'WALLET_NAME',         description: 'Bittensor coldkey name',               required: true },
    { name: 'HOTKEY_NAME',         description: 'Bittensor hotkey name',                required: true },
    { name: 'DEVICE',              description: 'cuda / cpu / mps — strongly cuda',     required: true },
    { name: 'MIN_STAKE_THRESHOLD', description: 'Minimum validator stake to serve (default 2)', required: false },
  ],

  scoring: {
    summary:
      'Quality scoring on GS-HOTA = √(Detection × Association). Detection measures bounding-box accuracy (IoU vs ground truth, class correctness). Association measures track-ID consistency across frames (same player keeps the same ID). Validators also weight by response time and contribution volume.',
    rule: 'Win both halves: high-precision bounding boxes AND stable tracks. A great detector with reshuffling IDs scores near-zero on association; a strong tracker on wrong boxes scores zero on detection. The geometric mean punishes weakness in either factor.',
    cheatPath:
      "Don't return only high-confidence detections to fake precision — the validator's re-evaluation samples include hard frames and your recall craters. Don't reset track IDs on every frame — the association term goes to zero. Don't run CPU when you said cuda — the time-budget penalty compounds.",
  },

  profitability: {
    estimatedDailyEmissionPerUid: 0.0,
    tokenPriceUsdFallback: 284,
    capexNote: 'Mid capex — a 4090-class workstation is $2-3k, or rent for ~$0.50/hr. Roboflow-Sports baseline gets you in the door; differentiated tracking is where the edge lives.',
  },

  milestones: [
    { day: 'day 1', target: 'Baseline miner running on cuda, registered, answering /health',
      note: 'Use the bundled Roboflow Sports models to validate the wiring.' },
    { day: 'day 3', target: 'GS-HOTA above the baseline median',
      note: 'Improve the tracker first (ByteTrack / OC-SORT) — association is usually the weaker term.' },
    { day: 'day 7', target: 'Out of immunity period, weight rising',
      note: 'If still floored, log per-frame inference time — you may be missing the time budget on long clips.' },
  ],

  monitoring: [
    { metric: 'GPU VRAM utilization',         threshold: '< 90%',     where: 'nvidia-smi · OOM = silent failed frames' },
    { metric: 'Per-frame inference time',     threshold: '< 50 ms',   where: 'miner logs' },
    { metric: 'Detection precision/recall',   threshold: '> 0.7',     where: 'local eval vs sample annotations' },
    { metric: 'Track-ID switches per minute', threshold: '< 5',       where: 'tracker debug output' },
    { metric: 'Per-tempo incentive',          threshold: 'rising',    where: 'btcli subnet metagraph --netuid 44' },
  ],

  knownIssues: [
    {
      symptom: 'CUDA OOM mid-clip',
      cause:   'Detector + tracker + intermediate frame buffers exceed VRAM on long clips.',
      fix:     'Process in batched windows, free intermediate tensors, use lower-precision (FP16) inference. RTX 3060 12 GB is tight — 16 GB+ is safer.',
    },
    {
      symptom: 'High detection score but low GS-HOTA',
      cause:   'Association term is dragging the geometric mean — tracker is reshuffling IDs.',
      fix:     'Swap the default tracker for ByteTrack or OC-SORT with Kalman filter. Tune ID-switch tolerance via the IoU + appearance feature thresholds.',
    },
    {
      symptom: 'Validator marks you offline despite running',
      cause:   'PM2 interpreter pointed at system python, not venv python — module imports fail silently inside the process.',
      fix:     'Always set `--interpreter ../.venv/bin/python`. Check `pm2 logs sn44-miner` for ModuleNotFoundError.',
    },
  ],

  notes: [
    'GS-HOTA punishes weakness in either detection or association. Optimize the weaker term first.',
    'Soccer-only at launch (Roboflow Sports models). Other sports may follow — check repo issues.',
    'Phase 1 is current; previously deployed on testnet netuid 261 before mainnet launch on 44.',
  ],
};
