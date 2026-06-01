import type { RichPlaybook } from '../playbook-rich';

// SN102 — ConnitoAI. Distributed Mixture-of-Experts training for 100B+ models.
// Codebase footprint on GitHub at time of writing is dashboards/leaderboards
// (Icebitz/connito-dashboard, DanielDerefaka/connito-sn102-dashboard) — no
// canonical public miner repo was located in 3-5 searches. Architecture
// reflects the public Connito Story / X coverage.

export const sn102: RichPlaybook = {
  slug: '102-connitoai',
  netuid: 102,
  name: 'ConnitoAI',
  category: 'llm',
  categoryLabel: 'LLM',

  blurb:
    'Distributed MoE training subnet. Miners train one or a few experts of a 100B+ Mixture-of-Experts model instead of the full thing — Proof-of-Loss verifies each step, top-N expert updates are merged into the shared model.',

  whatMinersDo:
    "A ConnitoAI miner runs a training step on the expert(s) assigned to their slot against batches issued by the validator. After each step they submit updated expert weights plus Proof-of-Loss artefacts (loss values + the commitments needed to verify the step). Validators check the proof, rank miners by loss reduction, and merge the top-N expert updates into the shared MoE — so multiple miners can be productively right at once. Hardware floor is one node per expert, not one node per model.",

  verifiedAt: '2026-06-01',
  verifiedBy: '@editorial',

  emission: '— τ/day',
  burnCostFallback: '— τ',
  minerCountFallback: 0,
  slotCap: 256,

  hardware: [
    {
      role: 'GPU node',
      count: '1 per expert slot',
      gpu: '1×A100 80GB or 1×H100 80GB (sized for one MoE expert, not the full 100B+ model)',
      vramGb: 80,
      cpuCores: 16,
      ramGb: 128,
      diskGb: 1000,
      bandwidth: 'public IP · 1 Gbps · low-latency to validator preferred',
      notes: 'The whole design point is "low per-miner hardware requirements via expert parallelism" — you do not need to hold the full 100B+ model in VRAM, only your assigned expert(s).',
    },
  ],
  hardwareNote:
    'Definitive per-expert hardware bound is set by ConnitoAI when the public miner repo lands; the figures above reflect the natural floor for training a single MoE expert at the scale the team has publicly described.',

  rentalOk: true,
  rentalUsdPerHr: { lambda: 1.99, runpod: 1.89, coreweave: 2.10 },

  repo: {
    url: 'https://github.com/ConnitoAI',
    branch: 'main',
    extraRepos: [
      { name: 'connito-dashboard',         url: 'https://github.com/Icebitz/connito-dashboard',         purpose: 'Community Subnet 102 dashboard — useful for live state' },
      { name: 'connito-sn102-dashboard',   url: 'https://github.com/DanielDerefaka/connito-sn102-dashboard', purpose: 'Minimalist live leaderboard for SN102' },
    ],
  },

  setupShape: 'simple-binary',
  setupOverview:
    "Setup is the classic Bittensor template — clone the miner, install Python deps, set wallet env vars, register your hotkey on SN102, then start training your assigned expert. The interesting part is your training loop, not the bootstrap.",

  install: [
    { step: 'Clone the ConnitoAI miner repo',
      cmd:  'git clone https://github.com/ConnitoAI/<miner-repo> && cd <miner-repo>',
      note: 'Repo name will be confirmed when ConnitoAI publishes its canonical miner code; the org link is canonical.' },
    { step: 'Create a venv and install dependencies',
      cmd:  'python -m venv .venv && source .venv/bin/activate && pip install -e .' },
    { step: 'Copy and edit the .env',
      cmd:  'cp .env.example .env && $EDITOR .env',
      note: 'Set WALLET / HOTKEY / NETUID=102 and any model-state coordination endpoints ConnitoAI publishes.' },
    { step: 'Register your hotkey on SN102',
      cmd:  'btcli subnet register --netuid 102 --wallet.name $WALLET --wallet.hotkey $HOTKEY',
      note: 'Re-check burn cost on taostats just before this command — it can spike.' },
  ],

  runSteps: [
    { step: 'Start the miner',
      cmd:  'python -m neurons.miner --netuid 102 --wallet.name $WALLET --wallet.hotkey $HOTKEY' },
    { step: 'Verify expert updates land',
      note: 'Logs should show: validator batch received → expert step computed → Proof-of-Loss submitted → top-N merge result.' },
    { step: 'Watch metagraph',
      cmd:  'btcli subnet metagraph --netuid 102' },
  ],

  envVars: [
    { name: 'WALLET',         description: 'Coldkey name',                                         required: true },
    { name: 'HOTKEY',         description: 'Hotkey name',                                          required: true },
    { name: 'NETUID',         description: 'Subnet UID — 102 for ConnitoAI',                       required: true },
    { name: 'EXPERT_SLOT',    description: "Which MoE expert(s) this miner is assigned to",        required: false },
  ],

  scoring: {
    summary:
      "Proof-of-Loss per step plus top-N expert merging. Each step's loss is measurable on a validation distribution that is aligned with the training distribution by design; validators verify the claimed loss reduction is real and merge the top-N expert updates rather than promoting one winner.",
    rule:
      'Earn by producing low-loss, verifiable expert updates that survive the top-N merge. Multiple miners can be productively right at once — this is explicitly not winner-takes-all.',
    cheatPath:
      "Two classic attacks. (1) Replay or copy an earlier high-quality update — defeated by tying the proof to the specific batch and validator-issued seed. (2) Overfit to the validation set — defeated by the aligned-but-resampled validation distribution. Subtler: producing low-magnitude 'safe' updates that always merge — penalised by the top-N selection ranking on loss reduction.",
  },

  profitability: {
    estimatedDailyEmissionPerUid: 0.0,
    tokenPriceUsdFallback: 284,
    capexNote:
      'Single H100/A100 box runs ~$1.5-2/hr rental or ~$25k+ to own. Sized for one expert — the math gets bad fast if you try to run multiple expert slots from rented hardware.',
    notes:
      'Subnet is in early launch (alpha code drop, ~973 holders reported in Q4 2025). Per-UID emission is not stable enough to estimate confidently; treat capex as speculative until at least 30 days of live data exist.',
  },

  milestones: [
    { day: 'day 1', target: 'Hotkey registered, first Proof-of-Loss submitted', note: 'Logs show a complete batch → step → proof → merge cycle.' },
    { day: 'day 3', target: 'Expert update lands in top-N at least once', note: 'If you are never in the top-N, either your training config or expert assignment is mis-tuned.' },
    { day: 'day 7', target: 'Out of immunity, incentive non-zero', note: 'btcli subnet metagraph --netuid 102 should show a rising incentive.' },
    { day: 'day 14', target: 'Stable in top-N for your assigned expert', note: 'Look at top miners on taostats — what training config patterns are they running?' },
  ],

  monitoring: [
    { metric: 'Proof-of-Loss submission success', threshold: '100%',          where: 'Miner logs' },
    { metric: 'Top-N merge inclusion rate',       threshold: '> 30% of steps',where: 'Miner logs / community dashboards' },
    { metric: 'GPU utilisation under training',   threshold: '> 70%',         where: 'nvidia-smi' },
    { metric: 'Per-tempo incentive',              threshold: 'rising or flat',where: 'btcli subnet metagraph --netuid 102' },
  ],

  knownIssues: [
    {
      symptom: 'Proof-of-Loss submissions rejected',
      cause:   'Loss commitment does not match the validator-issued seed/batch — usually a stale cache or wrong expert assignment.',
      fix:     'Clear any cached batches, confirm your expert slot assignment in logs, restart the miner cleanly.',
    },
    {
      symptom: 'Updates always merged but incentive flat',
      cause:   "Producing low-magnitude 'safe' updates that pass top-N but bring little loss reduction.",
      fix:     'Tune training config for real loss reduction on your expert — learning rate, batch size, and expert specialisation are the typical knobs.',
    },
  ],

  notes: [
    'Public canonical miner repo not yet located in opentao research as of June 2026 — re-check the ConnitoAI GitHub org for the official miner code before committing capex.',
    'Per-expert hardware sizing is the architectural wedge — do not try to host the whole 100B+ model on one node; it defeats the design.',
  ],
};
