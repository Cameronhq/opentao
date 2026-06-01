import type { RichPlaybook } from '../playbook-rich';

// SN17 — 404—GEN. Source: github.com/404-Repo/three-gen-subnet README +
// docs/running_validator.md (2026-06). Public miner-side docs reference the
// reference miner stack in the same repo; miner setup mirrors validator setup
// (conda envs + PM2). Hardware below is what the validator publishes.

export const sn17: RichPlaybook = {
  slug: '17-404-gen',
  netuid: 17,
  name: '404—GEN',
  category: 'vision',
  categoryLabel: 'Text-to-3D · Gaussian Splatting',

  blurb:
    'Text-to-3D asset generation. Miners run open 3D generative pipelines (Gaussian Splatting / NeRF / diffusion / point-cloud); validators render outputs, score with CLIP alignment + topology checks, and resolve duels via a vLLM-based GLM-4V judge.',

  whatMinersDo:
    "A miner runs a text-to-3D generative pipeline behind the reference Bittensor neuron. The validator pulls prompts from the autonomous prompt-generation service (two generators using Qwen2.5-7B-Instruct-1M / phi-4 / glm-4-9b-chat-1m and a letter-seeded variant) and broadcasts them. The miner returns a 3D asset (typically Gaussian Splatting / .ply). The validator renders the asset, runs a CLIP-style alignment score, checks topology/geometry, and resolves head-to-head duels with a vLLM-based Judge Service (GLM-4V).",

  verifiedAt: '2026-06-01',
  verifiedBy: '@editorial',

  emission: '— τ/day',
  burnCostFallback: '— τ',
  minerCountFallback: 0,
  slotCap: 256,

  hardware: [
    {
      role: 'Miner GPU node',
      count: '1',
      gpu: 'RTX 4090 / A6000-class (24+ GB VRAM)',
      vramGb: 24,
      cpuCores: 8,
      ramGb: 32,
      diskGb: 100,
      bandwidth: 'stable broadband',
      notes: 'README positions 24+ GB VRAM as the practical floor for the reference generation pipeline. A100 / H100 are not recommended on the validator side per the running_validator.md guide — for miners, prosumer GPUs (4090) are the sweet spot.',
    },
  ],
  hardwareNote:
    'Validator hardware floor (for context): RTX 6000 Ada 48 GB VRAM minimum, or 2×4090. A100/H100 explicitly NOT recommended — they show poor inference performance during validation and duel judging.',

  rentalOk: true,
  rentalUsdPerHr: { lambda: 0.69, runpod: 0.59, coreweave: 0.79 },

  repo: {
    url: 'https://github.com/404-Repo/three-gen-subnet',
    branch: 'main',
    minerEntrypoint: 'serve_miner.py / neurons + miner/ directory',
    extraRepos: [
      { name: 'text-prompt-generator', url: 'https://github.com/404-Repo/text-prompt-generator', purpose: 'Autonomous prompt generator the validator pulls from' },
      { name: 'get-prompts',           url: 'https://github.com/404-Repo/get-prompts',           purpose: 'Prompt collector that batches prompts to validators' },
      { name: 'dashboard',             url: 'https://dashboard.404.xyz/d/main/404-gen/',         purpose: 'Live subnet activity, validator performance, network metrics' },
    ],
  },

  setupShape: 'simple-binary',
  setupOverview:
    'Per-component conda environments managed via the repo\'s `setup_env.sh` scripts, launched and supervised by PM2. The repo ships three components — neurons (the miner / validator neuron), validation (local validation service), judge-service (vLLM-based GLM-4V judge, validator-side). Miners run the neuron + the generation pipeline; validators run all three.',

  install: [
    { step: 'Clone the repo',
      cmd:  'git clone https://github.com/404-Repo/three-gen-subnet.git && cd three-gen-subnet' },
    { step: 'Install conda + PM2 (recommended by the project)',
      note: 'Ubuntu 22.04 LTS with NVIDIA drivers + CUDA. Conda for the per-component envs, PM2 for process supervision.' },
    { step: 'Set up the miner neuron env',
      cmd:  'cd neurons && ./setup_env.sh',
      note: 'Creates the conda env, installs dependencies. The repo also exposes a top-level setup_env.sh, conda_env_neurons.yml, requirements.txt, pyproject.toml.' },
    { step: 'Configure miner.config.js (PM2)',
      note: 'Set wallet.name, wallet.hotkey, subtensor network, axon.port, and axon.external_port. The validator-side README shows the same pattern for validator.config.js.' },
    { step: 'Register hotkey on SN17',
      cmd:  'btcli subnet register --netuid 17 --wallet.name $WALLET --wallet.hotkey $HOTKEY' },
  ],

  runSteps: [
    { step: 'Start the miner under PM2',
      cmd:  'pm2 start miner.config.js',
      note: 'Equivalent to `pm2 start validator.config.js` on the validator side per docs/running_validator.md.' },
    { step: 'Tail logs',
      cmd:  'pm2 logs',
      note: 'Look for incoming prompts, generation timing, and submission acks.' },
    { step: 'Watch the public dashboard',
      cmd:  'open https://dashboard.404.xyz/d/main/404-gen/',
      note: 'Subnet activity + your UID performance.' },
  ],

  envVars: [
    { name: 'WALLET', description: 'Coldkey name (matches btcli wallet list)', required: true },
    { name: 'HOTKEY', description: 'Hotkey name on that coldkey',               required: true },
  ],

  scoring: {
    summary:
      'Validators render each submitted asset, run a CLIP-style alignment score against the prompt, and check topology / geometry (no holes, reasonable poly count, no NaN normals). Head-to-head duels between miners are resolved by a vLLM-based GLM-4V Judge Service. Composite score: alignment first, render quality second, latency as tiebreaker.',
    rule: 'High CLIP-prompt alignment + clean topology beats fast-but-wrong every time. Win duels against the current top miners to climb.',
    sourcePath: '404-Repo/three-gen-subnet · validation/ + judge-service/',
    cheatPath:
      "Returning a cached asset for a known prompt — the catalog rotates and includes novel letter-seeded combinations. Pretty but unrelated meshes — CLIP alignment kills the score. Broken / NaN geometry — topology checks fail it. Trying to spoof the judge — the duel goes through GLM-4V which sees both renders side by side.",
  },

  profitability: {
    estimatedDailyEmissionPerUid: 0.0,
    tokenPriceUsdFallback: 284,
    capexNote:
      'A single 24 GB GPU node is the entry capex. Beyond that, the win is in the model — running the right open 3D architecture against the current validator scoring tilt. The model landscape shifts; the README explicitly notes the subnet upgrades automatically as new architectures register.',
  },

  milestones: [
    { day: 'day 1',  target: 'Reference miner generating an asset locally',
      note: 'Test the pipeline on a sample prompt before registering.' },
    { day: 'day 3',  target: 'Hotkey registered, submissions accepted',
      note: 'Visible on dashboard.404.xyz under your UID, non-zero composite score.' },
    { day: 'day 7',  target: 'Winning duels against bottom-quartile miners',
      note: 'The Judge Service picks a winner head-to-head — climbing past low-tier miners is the first sign your pipeline is competitive.' },
    { day: 'day 14', target: 'Above-median latency at acceptable quality',
      note: 'Latency is a tiebreaker among similar-quality assets; tune the generator so it finishes well inside the validator window.' },
  ],

  monitoring: [
    { metric: 'Asset submission success rate', threshold: '> 95%',  where: 'pm2 logs' },
    { metric: 'CLIP alignment proxy (local)',  threshold: '> 0.25', where: 'Local render + CLIP score' },
    { metric: 'Duel win rate',                 threshold: '> 50%',  where: 'Public dashboard / miner stats' },
    { metric: 'Hotkey incentive',              threshold: 'rising or flat', where: 'btcli subnet metagraph --netuid 17' },
  ],

  knownIssues: [
    {
      symptom: 'Setup fails on A100 / H100',
      cause:   'README explicitly flags A100 and H100 as showing poor inference performance during validation and duel judging.',
      fix:     'Use RTX 4090 / 6000 Ada-class GPUs. Blackwell (5090) is supported with slight setup-script adjustments per the docs.',
    },
    {
      symptom: 'Judge service / validation port exposed to public',
      cause:   'Mis-configured validator deployment — judge / validation are meant to be internal-only.',
      fix:     'Per docs/running_validator.md: only expose `axon.port` externally; judge + validation are internal.',
    },
    {
      symptom: 'Topology / geometry check failures',
      cause:   'Generator emitting NaN normals, holes, or unreasonable poly counts.',
      fix:     'Clean the export step — Gaussian Splatting files should be valid before submission. Add a local validation pass.',
    },
    {
      symptom: 'Submissions accepted, score zero',
      cause:   'Asset rendered but CLIP alignment against the rotating prompt catalog is near zero.',
      fix:     'The catalog is built from 30 industry-knowledge categories — make sure your model handles the category mix, not just a narrow subset.',
    },
  ],

  notes: [
    'Reference validator + miner architectures and dashboards: dashboard.404.xyz/d/main/404-gen/.',
    '404-GEN ships the Unity Asset Store plugin (first blockchain-based genAI 3D plugin) and a Blender plugin — both are downstream of the subnet supply.',
    'Prompt sources: the autonomous generator + organic traffic from the public API; validators pull fresh prompt batches hourly by default.',
  ],
};
