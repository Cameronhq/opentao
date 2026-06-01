import type { RichPlaybook } from '../playbook-rich';

// SN34 — BitMind / GAS (Generative Adversarial Subnet). Deepfake detection
// + generation across image, video, audio. Major change: discriminative
// miners no longer need to host GPUs — models are CLOUD-EVALUATED on
// BitMind's gasbench infrastructure. Generative miners still serve via
// pm2 + axon. Format is safetensors; ONNX is deprecated.

export const sn34: RichPlaybook = {
  slug: '34-bitmind',
  netuid: 34,
  name: 'BitMind (GAS)',
  category: 'vision',
  categoryLabel: 'Deepfake Detection',

  blurb:
    'Generative Adversarial Subnet — detectors and generators compete across image, video, and audio. Discriminative miners submit safetensors models via gascli; models are cloud-evaluated (no GPU hosting needed). Generative miners serve on-demand synthesis.',

  whatMinersDo:
    "Two tracks. Discriminative miners ZIP up a safetensors model (model_config.yaml + model.py + *.safetensors), run `gascli d push --image-model image_detector.zip --wallet-name $WALLET --wallet-hotkey $HOTKEY` to upload, and the model is benchmarked on BitMind's cloud infrastructure (no miner GPU required). Generative miners run a synthesis server via `gascli generator start` (or `pm2 start gen_miner.config.js`) which receives prompts from validators, generates synthetic media, and is scored on validity + adversarial multiplier (fooling discriminators). One model per modality per hotkey for discriminative miners.",

  verifiedAt: '2026-06-01',
  verifiedBy: '@editorial',

  emission: '— τ/day',
  burnCostFallback: '— τ',
  minerCountFallback: 0,
  slotCap: 256,

  hardware: [
    {
      role: 'Discriminative miner (CPU only)',
      count: '1',
      cpuCores: 4,
      ramGb: 8,
      diskGb: 30,
      bandwidth: '100 Mbps · only used for push + status checks',
      notes: "MAJOR change vs older versions: models evaluate on BitMind's cloud, NOT on miner hardware. A laptop is sufficient — you only need it to package + push and to check `gascli d perf`.",
    },
    {
      role: 'Generative miner (GPU host)',
      count: '1',
      gpu: '1× modern NVIDIA (A6000 / L40S / H100 depending on generator)',
      vramGb: 24,
      cpuCores: 8,
      ramGb: 64,
      diskGb: 200,
      bandwidth: 'static public IP · open axon port · 1 Gbps',
      notes: 'Generative miners host the actual synthesis stack and receive prompts in real time.',
    },
  ],
  hardwareNote:
    'Discriminative mining lowered the capital barrier dramatically — no GPU hosting required. Generative mining is still GPU-heavy because synthesis happens on-miner.',

  rentalOk: true,
  rentalUsdPerHr: { lambda: 1.49, runpod: 1.29, coreweave: 1.69 },

  repo: {
    url: 'https://github.com/BitMind-AI/bitmind-subnet',
    branch: 'main',
    minerEntrypoint: 'neurons/discriminator/push_model.py',
    extraRepos: [
      { name: 'bitmind-ai/gasbench', url: 'https://github.com/bitmind-ai/gasbench', purpose: 'Cloud benchmark spec, safetensors model format, local --small entrance-exam simulator' },
    ],
  },

  setupShape: 'simple-binary',
  setupOverview:
    'Clone the bitmind-subnet repo, run `./install.sh` (option `--no-system-deps` for discriminative miners). Activate the venv to use `gascli`. For discriminative mining: package your detector as a safetensors zip, push with `gascli d push`, then check status with `gascli d perf`. For generative mining: start the synthesis server with `gascli generator start` or `pm2 start gen_miner.config.js`.',

  install: [
    { step: 'Clone repo + install',
      cmd: 'git clone https://github.com/BitMind-AI/bitmind-subnet.git && cd bitmind-subnet && ./install.sh' },
    { step: '(Discriminative miners only) Skip system deps',
      cmd: './install.sh --no-system-deps',
      note: 'Use this flag if you only intend to push detector models — no need for GPU drivers, ffmpeg, etc.' },
    { step: 'Activate virtual env',
      cmd: 'source .venv/bin/activate' },
    { step: 'Register on SN34',
      cmd: 'btcli subnet register --netuid 34 --wallet.name $WALLET --wallet.hotkey $HOTKEY' },
    { step: '(Discriminative) Package your detector model',
      cmd: 'cd my_model/ && zip -r ../my_detector.zip model_config.yaml model.py model.safetensors',
      note: 'Required structure: model_config.yaml (metadata + preprocessing config) + model.py (architecture with load_model() function) + *.safetensors weights. See bitmind-ai/gasbench docs/Safetensors.md for the full spec.' },
    { step: '(Discriminative) Run entrance exam locally',
      cmd: 'gasbench run --image-model ./my_image_model/ --small',
      note: 'Replicates the cloud entrance exam (≥ 80% accuracy on ~100 samples per dataset required to pass).' },
  ],

  runSteps: [
    { step: '(Discriminative) Push detector model(s)',
      cmd: `gascli d push \\
  --image-model image_detector.zip \\
  --video-model video_detector.zip \\
  --audio-model audio_detector.zip \\
  --wallet-name $WALLET --wallet-hotkey $HOTKEY` },
    { step: '(Discriminative) Check performance',
      cmd: 'gascli d perf --wallet-name $WALLET --wallet-hotkey $HOTKEY',
      note: 'Shows status (queued / running / success / failed), modality, vertical, SN34 score, MCC, Brier per benchmark run.' },
    { step: '(Generative) Start generator server',
      cmd: 'gascli generator start',
      note: 'Or: `pm2 start gen_miner.config.js` if not using the gascli wrapper.' },
    { step: 'Verify on metagraph',
      cmd: 'btcli subnet metagraph --netuid 34' },
  ],

  envVars: [
    { name: 'WALLET', description: 'Coldkey name (passed as --wallet-name)', required: true },
    { name: 'HOTKEY', description: 'Hotkey name (passed as --wallet-hotkey)', required: true },
  ],

  scoring: {
    summary:
      'Discriminative: per-modality `sn34_score = sqrt(MCC_norm^1.2 × Brier_norm^1.8)` — geometric mean of normalized Matthews Correlation Coefficient (accuracy) and Brier score (calibration). Three modalities (image / video / audio) scored independently. Generative: base reward for valid synthetic content × multiplier for fooling discriminators. Up to three models per modality per hotkey.',
    rule: 'Maximize both raw accuracy (MCC) AND probability calibration (Brier). Pass the entrance exam (≥ 80% accuracy on small benchmark) before getting scored on the full dataset.',
    sourcePath: 'BitMind-AI/bitmind-subnet · docs/Incentive.md + bitmind-ai/gasbench',
    cheatPath:
      "Always-AI or always-real strategies fail MCC (one TN/TP is zero so MCC ≈ 0). ONNX models embedding lookup tables / memorization artifacts are scanned and BLOCKED before the exam runs. Network access / system calls / dynamic code execution are disabled in the sandbox — model.py runs in a restricted environment with only torch/torchvision/torchaudio/transformers/timm/einops/flash_attn/PIL/cv2/scipy/numpy/safetensors allowed.",
  },

  profitability: {
    estimatedDailyEmissionPerUid: 0.0,
    tokenPriceUsdFallback: 284,
    capexNote:
      'Discriminative mining is essentially capex-free — just a laptop and the cost of training data + experiment GPUs (rentable on Lambda/Runpod). Generative mining needs an always-on GPU box.',
    notes:
      'Discriminative pool is now much more crowded because the GPU-hosting barrier is gone; differentiation is in detector architecture + training data + calibration tuning.',
  },

  milestones: [
    { day: 'day 1',  target: 'Entrance exam passed', note: 'Local `gasbench run --small` gives ≥ 80% accuracy; first cloud push enters `examining` then `confirmed`.' },
    { day: 'day 3',  target: 'Full benchmark scored', note: '`gascli d perf` shows a `success` row with SN34 score + MCC + Brier; weights start writing on-chain.' },
    { day: 'day 7',  target: 'Iterated to v2',         note: 'Trained on fresh generators (Sora-class video, ElevenLabs-class audio); pushed v2, score climbs.' },
    { day: 'day 14', target: 'Out of immunity',        note: 'Surviving deregistration; if borderline, expand training data with the weekly GAS-Station refresh.' },
    { day: 'day 30', target: 'Top-quartile sn34_score', note: 'Score consistently in top 25% across at least one modality. Multi-modality submissions earn additively.' },
  ],

  monitoring: [
    { metric: 'Entrance exam status',  threshold: 'confirmed (not exam_failed/blocked)', where: '`gascli d perf` · status column' },
    { metric: 'sn34_score',            threshold: 'rising or flat',  where: '`gascli d perf --modality image/video/audio`' },
    { metric: 'MCC',                   threshold: '> 0',             where: '`gascli d perf` · MCC ≤ 0 means constant-output bug' },
    { metric: 'Brier score',           threshold: '< 0.25',          where: '`gascli d perf` · calibration matters for sn34_score' },
    { metric: '(Generative) Pass rate', threshold: '> 95%',          where: 'pm2 logs gen-miner · synthesis must validate cleanly' },
  ],

  knownIssues: [
    {
      symptom: 'Entrance exam status returns `exam_failed`',
      cause:   'Average accuracy across submitted modalities is below 80% on the small benchmark.',
      fix:     "Run `gasbench run --image-model ./my_model/ --small` locally first to replicate exam conditions. Iterate until ≥ 80% before pushing to the cloud.",
    },
    {
      symptom: 'Model returns `blocked` status permanently',
      cause:   'ONNX cheat-pattern scanner detected embedded lookup tables or memorization artifacts. ONNX is also being deprecated.',
      fix:     'Migrate to safetensors format. Remove any pre-computed lookups embedded in the graph; the model.py must compute predictions from raw weights.',
    },
    {
      symptom: 'sn34_score collapses after a weekly dataset refresh',
      cause:   'GAS-Station refreshed with samples from a new generator family your detector was never trained on.',
      fix:     "Pull fresh data from the GAS-Station HuggingFace org (huggingface.co/gasstation), retrain, push a v2 model. This is the expected operational loop.",
    },
    {
      symptom: 'Sandbox execution error during exam: "ImportError: No module named X"',
      cause:   'Imported a library outside the allowed list (only torch, torchvision, torchaudio, transformers, timm, einops, flash_attn, PIL, cv2, scipy, numpy, safetensors).',
      fix:     "Rewrite model.py to only use allowed imports. See bitmind-ai/gasbench/docs/Safetensors.md#allowed-imports for the canonical list.",
    },
    {
      symptom: 'Three models per modality limit hit when pushing v4',
      cause:   "Subnet allows up to three image, three video, three audio models per hotkey.",
      fix:     'Replace the lowest-scoring of your existing three rather than appending a fourth; the gascli push will surface the slot pressure.',
    },
  ],

  notes: [
    'Discriminative miners no longer host GPUs — this lowered the barrier dramatically but increased competition.',
    'Safetensors only; ONNX is deprecated and being phased out.',
    'Full benchmark timeout is 5 hours per modality; entrance exam timeout is 1h25m.',
    'Datasets refresh weekly — winning miners ship a new model every week.',
  ],
};
