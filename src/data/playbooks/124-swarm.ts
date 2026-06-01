import type { RichPlaybook } from '../playbook-rich';

// SN124 — Swarm. First robotics subnet on Bittensor.
// Miner trains a DroneFlightController, packages it into Submission/submission.zip,
// benchmarks locally, and commits the GitHub URL on-chain. One-shot per hotkey —
// each hotkey can commit exactly one model, lifetime.

export const sn124: RichPlaybook = {
  slug: '124-swarm',
  netuid: 124,
  name: 'Swarm',
  category: 'robotics',
  categoryLabel: 'Robotics · drone autopilot',

  blurb:
    'Decentralized drone autopilot tournament. Miners train an RL DroneFlightController, package it into a submission zip (≤50 MiB), benchmark locally, and commit one model per hotkey — lifetime. Scored 0.45 success + 0.45 time + 0.10 safety across 1,000 procedurally generated seeds in PyBullet.',

  whatMinersDo:
    "A Swarm miner is a one-shot research effort: train a DroneFlightController (act(observation) → [dir_x, dir_y, dir_z, speed, yaw]) on PyBullet-style flight tasks, package the model with the swarm CLI, validate locally against the benchmark suite, and commit the GitHub URL on-chain via `neurons/miner.py --github_url ...`. Each hotkey can commit exactly one model, lifetime. Validators pull the submission, run it across procedurally generated maps in a Docker sandbox, and score on 0.45 × success + 0.45 × time + 0.10 × safety.",

  verifiedAt: '2026-06-01',
  verifiedBy: '@editorial',

  emission: '— τ/day',
  burnCostFallback: '— τ',
  minerCountFallback: 0,
  slotCap: 256,

  hardware: [
    {
      role: 'Training node',
      count: '1',
      gpu: '1× consumer GPU (RTX 3090 / 4090 class)',
      vramGb: 24,
      cpuCores: 8,
      ramGb: 32,
      diskGb: 100,
      bandwidth: 'standard broadband',
      notes: 'Stated minimum: Python 3.11+. No GPU strictly required to submit, but RL training (SB3 / PyTorch) benefits from at least one consumer GPU. Inference (act()) is light.',
    },
  ],
  hardwareNote:
    "Submission is one-shot per hotkey — you train as long as you want offline on whatever rig you have, then commit one zip. Heavy training rigs are useful during R&D, not during the live miner lifecycle.",

  rentalOk: true,
  rentalUsdPerHr: { lambda: 0.79, runpod: 0.69, coreweave: 0.85 },

  repo: {
    url: 'https://github.com/swarm-subnet/swarm',
    branch: 'main',
    minerEntrypoint: 'neurons/miner.py',
  },

  setupShape: 'simple-binary',
  setupOverview:
    "Clone the swarm repo, run the install scripts, train a DroneFlightController inside a `my_agent/` directory, validate with the `swarm` CLI (test → package → verify → benchmark), then commit your GitHub URL on-chain. The CLI auto-injects main.py / agent.capnp / agent_server.py; you only write drone_agent.py plus model files.",

  install: [
    { step: 'Clone the repo',
      cmd:  'git clone https://github.com/swarm-subnet/swarm && cd swarm' },
    { step: 'Run install_dependencies + setup',
      cmd:  'chmod +x scripts/miner/install_dependencies.sh scripts/miner/setup.sh && ./scripts/miner/install_dependencies.sh && ./scripts/miner/setup.sh' },
    { step: 'Activate the venv',
      cmd:  'source miner_env/bin/activate' },
    { step: 'Install in editable mode',
      cmd:  'pip install -e .',
      note: 'Also installs the `swarm` CLI used for all submission steps.' },
    { step: 'Doctor check',
      cmd:  'swarm doctor',
      note: 'Validates environment: Python version, deps, PyBullet readiness.' },
  ],

  runSteps: [
    { step: 'Implement DroneFlightController',
      note: 'Create my_agent/drone_agent.py with __init__(load model), act(observation) → 5-d action, and reset(). Observation = depth map (128×128×1, normalised 0.5–20m) + state vector (position, velocity, orientation, altitude, direction to goal). Action ∈ [-1,1] direction/yaw and [0,1] speed; max velocity 3.0 m/s, yaw rate 180°/s.' },
    { step: 'Test the model locally',
      cmd:  'swarm model test --source my_agent/',
      note: 'Catches interface bugs before packaging.' },
    { step: 'Package into submission.zip',
      cmd:  'swarm model package --source my_agent/',
      note: 'Produces Submission/submission.zip. Size limit 50 MiB compressed. README must be byte-identical to swarm/templates/README.md.' },
    { step: 'Verify submission compliance',
      cmd:  'swarm model verify',
      note: "Checks whitelist (torch, onnx, stable-baselines3, gymnasium, numpy, scipy, opencv-python, pillow, …). Non-whitelisted packages cause validator rejection." },
    { step: 'Benchmark locally',
      cmd:  'swarm benchmark --model Submission/submission.zip',
      note: 'Aim for champion score + 0.015 before pushing to the network. Below that threshold, do not commit.' },
    { step: 'Register on SN124',
      cmd:  'btcli subnet register --netuid 124 --wallet.name $WALLET --wallet.hotkey $HOTKEY',
      note: 'Re-check burn cost on taostats.io/subnets/124 immediately before this.' },
    { step: 'Commit the GitHub URL on-chain (one-shot!)',
      cmd: `python neurons/miner.py \\
  --netuid 124 --subtensor.network finney \\
  --wallet.name $WALLET --wallet.hotkey $HOTKEY \\
  --github_url "https://github.com/<YOUR_USER>/<YOUR_REPO>"`,
      note: 'ONE-SHOT. Each hotkey can commit one model, lifetime. Be sure your benchmark beats the champion + 0.015 before running this.' },
  ],

  envVars: [
    { name: 'WALLET',  description: 'Coldkey name (matches btcli wallet list)', required: true },
    { name: 'HOTKEY',  description: 'Hotkey name on that coldkey',              required: true },
  ],

  scoring: {
    summary:
      "Validators replay each submitted controller across 1,000 procedurally generated map seeds inside PyBullet + Docker. Score = 0.45 × success + 0.45 × time + 0.10 × safety. Success requires stable landing: vertical velocity ≤0.5 m/s, horizontal ≤0.6 m/s, tilt ≤15° for 0.5s. Procedural map generation prevents pre-computed solutions.",
    rule: 'Fly safely, fast, and consistently across an unpredictable distribution of synthetic maps.',
    cheatPath:
      "Hard-coding solutions for a fixed map set fails because validators procedurally generate new maps. Brute-force motor-command search at validator time is bounded by Docker time limits. Whitelist enforcement (torch, onnx, SB3, etc.) blocks any non-listed packages — including binary blobs masquerading as model weights.",
  },

  profitability: {
    estimatedDailyEmissionPerUid: 0.0,
    tokenPriceUsdFallback: 284,
    capexNote:
      'Capex is whatever you choose to train on. Most miners use a single consumer GPU (3090/4090) or cloud rentals for the training run, then commit once.',
    notes:
      'One-shot-per-hotkey economics: if your submission scores poorly, your only path back is to burn a new hotkey (re-register, re-commit). Champion score + 0.015 is the published threshold to even attempt.',
  },

  milestones: [
    { day: 'day 1',  target: 'Environment doctor passes',
      note: 'swarm doctor returns no errors. PyBullet runs in your venv.' },
    { day: 'day 3',  target: 'First trained baseline (SB3 PPO)',
      note: 'Out-of-the-box SB3 PPO on the provided env runs to convergence. Use this as your floor.' },
    { day: 'day 7',  target: 'Beating champion + 0.015 on local benchmark',
      note: 'If you cannot clear this bar, do NOT commit. Iterate on reward shaping / curriculum / observation preprocessing first.' },
    { day: 'day 14', target: 'Submission committed',
      note: 'One-shot commit done. From here, score is fixed unless you burn a new hotkey.' },
    { day: 'day 30', target: 'Above the de-reg floor',
      note: 'Validator scores stabilise. If you sit at the floor, burn and resubmit a better controller on a new hotkey.' },
  ],

  monitoring: [
    { metric: 'Local benchmark score',     threshold: '> champion + 0.015',  where: 'swarm benchmark output' },
    { metric: 'Submission zip size',       threshold: '< 50 MiB',            where: 'Submission/submission.zip' },
    { metric: 'Package whitelist',         threshold: '100% whitelisted',    where: 'swarm model verify' },
    { metric: 'Per-tempo incentive',       threshold: 'rising or flat',      where: 'btcli subnet metagraph --netuid 124' },
  ],

  knownIssues: [
    {
      symptom: 'swarm model verify fails on a non-whitelisted import',
      cause:   'Your agent imports a package outside the whitelist (torch, onnx, SB3, gymnasium, numpy, scipy, opencv-python, pillow, plus a small list of others).',
      fix:     'Remove or replace the import. The whitelist is enforced strictly — validators will reject the submission silently otherwise.',
    },
    {
      symptom: 'README byte-mismatch error during package',
      cause:   "Your repo README is not byte-identical to swarm/templates/README.md.",
      fix:     'Copy swarm/templates/README.md verbatim. Add your notes in a separate file if you need to document anything.',
    },
    {
      symptom: 'Submission zip too large',
      cause:   'Model weights or bundled data exceed the 50 MiB cap.',
      fix:     'Quantise to int8/onnx, prune the model, or trim bundled assets. Most successful submissions stay well under the limit.',
    },
    {
      symptom: 'I committed a weak model — can I update?',
      cause:   "One-shot-per-hotkey rule. Each hotkey commits exactly one model, lifetime.",
      fix:     'Register a new hotkey (burn cost applies) and commit the improved model on the new UID. The old hotkey is effectively burned.',
    },
    {
      symptom: 'Landing fails the success criteria',
      cause:   "Vertical velocity > 0.5 m/s or horizontal > 0.6 m/s or tilt > 15° for the 0.5s stability window.",
      fix:     'Add a terminal-phase controller that explicitly decelerates and stabilises before declaring landing complete.',
    },
  ],

  notes: [
    'One-shot-per-hotkey is the most important rule on this subnet. Treat the on-chain commit as a final exam, not a test run.',
    'Reward formula 0.45 × success + 0.45 × time + 0.10 × safety means a controller that crashes fast still loses badly — success is the binary gate.',
    'Observation includes a depth map plus state vector — many naive RL policies underuse the depth channel. Tuning on depth-conditioned policies tends to outperform pure state-vector baselines.',
    "SN124 selected into Enlaira (Andorra's national startup acceleration program) as 1 of 5 — the subnet has some external commercial validation beyond Bittensor.",
  ],
};
