import type { RichPlaybook } from '../playbook-rich';

// SN49 — Nepher Robotics
// Tournament network for sim-to-real RL policies evaluated in Isaac Lab.
// Miners train policies offline and submit checkpoints via `nepher-miner submit`.
// Validators (GPU) roll out policies in Isaac Sim; there's also a CPU-only
// validator mode for weight-setting via cheap VPS.

export const sn49: RichPlaybook = {
  slug: '49-nepher-robotics',
  netuid: 49,
  name: 'Nepher Robotics',
  category: 'robotics',
  categoryLabel: 'Robotics',

  blurb:
    'Sim-to-real RL tournament on Isaac Lab. Miners submit trained policy checkpoints; winning weights get open-sourced to SimStore.',
  whatMinersDo:
    "Train robot control policies offline against the current Isaac Lab task spec — manipulation, locomotion, navigation — then submit a serialized checkpoint (PyTorch / ONNX) via `nepher-miner submit`. The CLI uploads `best_policy/best_policy.pt` plus an inference script under `scripts/rsl_rl/play.py` to the Tournament API. Validators load each checkpoint into Isaac Sim and roll out N episodes per held-out seed; rank by average return.",

  verifiedAt: '2026-06-01',
  verifiedBy: '@editorial',

  emission: '— τ/day',
  burnCostFallback: '— τ',
  minerCountFallback: 0,
  slotCap: 192,

  hardware: [
    {
      role: 'Training GPU node',
      count: '1',
      gpu: '1× A6000 / H100 / A100 class',
      vramGb: 48,
      cpuCores: 16,
      ramGb: 64,
      diskGb: 200,
      bandwidth: 'normal',
      notes: 'Used to train your RL/IL policy offline. Spec scales with task complexity (humanoid > arm > wheeled).',
    },
    {
      role: 'Self-eval rig (optional)',
      count: '1',
      gpu: '1× consumer or datacenter NVIDIA',
      vramGb: 24,
      cpuCores: 16,
      ramGb: 32,
      diskGb: 200,
      notes: 'Local Isaac Sim install for sanity-checking your policy on similar seeds before submitting.',
    },
  ],
  hardwareNote:
    'Submission itself is lightweight (a CLI upload). The "hardware" is whatever you need to train competitive policies — typically a GPU box you control, not a network-facing miner box.',

  rentalOk: true,
  rentalUsdPerHr: { lambda: 1.99, runpod: 1.89, coreweave: 2.10 },

  repo: {
    url: 'https://github.com/nepher-ai/nepher-subnet',
    branch: 'main',
    extraRepos: [
      { name: 'docs', url: 'https://docs.nepher.ai', purpose: 'Tournament docs + EnvHub SDK reference' },
      { name: 'Tournament API', url: 'https://tournament-api.nepher.ai', purpose: 'Submission endpoint + leaderboards' },
    ],
  },

  setupShape: 'simple-binary',
  setupOverview:
    'Two-config layout: `config/common_config.yaml` ships with the repo; you create `config/miner_config.yaml` with your wallet + API key. `pip install -e .` exposes the `nepher-miner` CLI. Training happens off-network; submission is a one-shot CLI call referencing your agent directory.',

  install: [
    { step: 'Clone repo', cmd: 'git clone https://github.com/nepher-ai/nepher-subnet.git && cd nepher-subnet' },
    { step: 'Editable install', cmd: 'pip install -e .' },
    { step: 'Copy miner config', cmd: 'cp config/miner_config.example.yaml config/miner_config.yaml' },
    { step: 'Edit config', note: 'Set wallet (coldkey/hotkey) and Tournament API key in config/miner_config.yaml. The file is .gitignore-d.' },
    { step: 'Register hotkey', cmd: 'btcli subnet register --netuid 49 --wallet.name $WALLET --wallet.hotkey $HOTKEY' },
    { step: 'Prepare agent directory', note: 'Layout: my-agent/best_policy/best_policy.pt + scripts/rsl_rl/play.py + source/<task_module>/tasks/' },
  ],

  runSteps: [
    { step: 'Validate agent locally', cmd: 'nepher-miner validate --path ./my-agent' },
    { step: 'Submit checkpoint', cmd: 'nepher-miner submit --path ./my-agent --config config/miner_config.yaml' },
    { step: 'Watch leaderboard', note: 'Track your UID at https://tournament-api.nepher.ai and confirm score is computed after the next eval window.' },
  ],

  envVars: [
    { name: 'WALLET',         description: 'Coldkey name',                    required: true },
    { name: 'HOTKEY',         description: 'Hotkey name',                     required: true },
    { name: 'NEPHER_API_KEY', description: 'Tournament API key (set in miner_config.yaml)', required: true },
  ],

  scoring: {
    summary:
      'For each task, validators roll out every submitted checkpoint in Isaac Sim across a fixed set of seeds with a fixed reward function and episode budget. Score = average return across rollouts. Tournament dynamics = your rank, not your absolute number.',
    rule: 'Submit a policy that maximizes expected return on the standardized Isaac Lab harness without overfitting to public seeds.',
    cheatPath:
      "Overfitting to public seeds doesn't survive — validators rotate held-out seeds and rerun in fresh sim instances. Memorizing trajectories collapses on new conditions. Open-sourcing of winning policies to SimStore also means every cycle's bar is higher.",
  },

  profitability: {
    estimatedDailyEmissionPerUid: 0.0,
    tokenPriceUsdFallback: 284,
    capexNote:
      'Capex is your training cluster. Renting an A100 on Lambda/Runpod for the duration of a tournament (days-to-weeks) is the typical pattern.',
  },

  milestones: [
    { day: 'day 1',  target: 'Local validate passes',  note: '`nepher-miner validate --path ./my-agent` clean. Hotkey registered.' },
    { day: 'day 3',  target: 'First submission scored', note: 'Score appears on Tournament API. Compare your return vs. current leader.' },
    { day: 'day 7',  target: 'Iterating on architecture', note: 'Pull the latest open-sourced winner from SimStore as a baseline. Beat or fork it.' },
    { day: 'day 14', target: 'On the leaderboard',    note: 'Above median return on the current task. If not, you may be on the wrong task family — check task announcements.' },
  ],

  monitoring: [
    { metric: 'Latest submission status', threshold: 'SCORED',   where: 'tournament-api.nepher.ai' },
    { metric: 'Rolling rank',             threshold: 'rising',   where: 'Tournament API leaderboard' },
    { metric: 'Validator eval window',    threshold: 'within 1 tempo of submission', where: 'Discord #tournament-status' },
  ],

  knownIssues: [
    { symptom: 'Submission rejected on validate',
      cause:   'Missing best_policy/best_policy.pt or scripts/rsl_rl/play.py in agent directory.',
      fix:     'Fix the agent layout; rerun `nepher-miner validate --path ./my-agent` until clean.' },
    { symptom: 'Score is zero or NaN',
      cause:   'Policy crashes inside Isaac Sim rollout — usually action/obs schema mismatch with the task.',
      fix:     'Re-read the task spec; confirm your policy emits the expected action shape and dtype.' },
    { symptom: 'Validator never picks up submission',
      cause:   'Hotkey not registered on SN49, or Tournament API key invalid.',
      fix:     "`btcli subnet metagraph --netuid 49` to confirm UID. Rotate API key via Nepher dashboard." },
  ],

  notes: [
    'Validators have two modes: full GPU (Isaac Sim 5.1 + Isaac Lab 2.3.0 + Docker + NVIDIA Container Toolkit) for eval, and a CPU-only mode (~200 MB image) for weight-setting on a cheap VPS — useful pattern for split deployment.',
    'Winning policies are auto-published to SimStore as open-source. Treat your weights as eventually public.',
    'Task announcements drive everything — subscribe to the Nepher Discord #tournament-status channel.',
  ],
};
