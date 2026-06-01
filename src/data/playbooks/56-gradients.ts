import type { RichPlaybook } from '../playbook-rich';

// SN56 — Gradients (Rayon Labs). Fine-tuning tournament. Miners submit
// AutoML training scripts that the validator runs head-to-head via
// OpenSpiel-style PvP — 3 pts win, 1 pt draw, 0 pts loss.

export const sn56: RichPlaybook = {
  slug: '56-gradients',
  netuid: 56,
  name: 'Gradients',
  category: 'llm',
  categoryLabel: 'Fine-tuning tournament',

  blurb:
    'Submit fine-tuning / image-training scripts to head-to-head tournaments. Models play PvP via OpenSpiel scoring (3-1-0); boss-round survivor takes the round.',

  whatMinersDo:
    "A Gradients miner contributes a fine-tuning recipe (text or image) that gets executed inside the G.O.D. tournament runner. Your container receives BASELINE_STATS_PATH + dataset directories + (for env tasks) an OpenSpiel environment server, and produces a trained model checkpoint. Models play head-to-head: 3 points for a win, 1 for a draw, 0 for a loss. To take the round, a challenger must strictly beat the defending champion across all 3 tasks. Tournaments last 4-7 days; a new one starts ~72 hours after the prior closes.",

  verifiedAt: '2026-06-01',
  verifiedBy: '@editorial',

  emission: '— τ/day',
  burnCostFallback: '— τ',
  minerCountFallback: 0,
  slotCap: 256,

  hardware: [
    {
      role: 'GPU training node (text tasks)',
      count: '1',
      gpu: '1× to 8× H100 (scales with model size; 1× for ≤4B, 8× for 40B+; DPO adds ×3, GRPO adds ×2 multipliers)',
      vramGb: 80,
      cpuCores: 24,
      ramGb: 135,
      diskGb: 1000,
      bandwidth: '10 Gbps (multi-node fine-tunes benefit from NVLink / IB)',
      notes: 'Resource limits per GPU: 135 GB memory, 24 cores (dynamically allocated). Scripts that hardcode different paths or VRAM assumptions get killed.',
    },
    {
      role: 'GPU training node (image tasks)',
      count: '1',
      gpu: '1× A100',
      vramGb: 80,
      cpuCores: 24,
      ramGb: 135,
      diskGb: 500,
      notes: 'All image models run on a single A100 in the published spec.',
    },
  ],
  hardwareNote:
    'Bring your own H100s for serious text competitions — DPO/GRPO multipliers can balloon required compute. Hourly cost dominates profitability.',

  rentalOk: true,
  rentalUsdPerHr: { lambda: 2.99, runpod: 2.49, coreweave: 3.10 },

  repo: {
    url: 'https://github.com/rayonlabs/G.O.D',
    branch: 'main',
    minerEntrypoint: 'entrypoint script that runs /workspace/scripts/text_trainer.py or image_trainer.py with passed args',
  },

  setupShape: 'docker-compose',
  setupOverview:
    "Clone the G.O.D repo, run the config generator (`python core/create_config.py --miner`), build the published Dockerfiles, then start the miner with `task miner`. Test your trainer locally via the provided `examples/run_*.sh` scripts before paying tournament fees.",

  install: [
    { step: 'Clone the G.O.D repo',
      cmd:  'git clone https://github.com/rayonlabs/G.O.D && cd G.O.D' },
    { step: 'Generate miner config',
      cmd:  'python core/create_config.py --miner' },
    { step: 'Build the training Docker images',
      note: 'Use the provided Dockerfiles for text + image trainers. They must build before `task miner` starts.' },
    { step: 'Dry-run with the example task scripts',
      cmd:  './examples/run_instruct_task.sh\n./examples/run_dpo_task.sh\n./examples/run_grpo_task.sh\n./examples/run_image_task.sh',
      note: 'These exercise the trainer end-to-end against synthetic baseline stats.' },
    { step: 'Register on SN56',
      cmd:  'btcli s register     # mainnet\nbtcli s register --network test  # testnet' },
  ],

  runSteps: [
    { step: 'Launch the miner service',
      cmd:  'task miner',
      note: '`task` (taskfile.dev) is the project runner; pulls Dockerised trainers and starts the miner.' },
    { step: 'Validate against a real task',
      cmd:  'python -m utils.run_evaluation --task_id <task_id>' },
    { step: 'Compare alternative models',
      cmd:  'python -m utils.run_evaluation --task_id <task_id> --models <model_name>' },
  ],

  envVars: [
    { name: 'WALLET',                description: 'Coldkey name',                                                                       required: true },
    { name: 'HOTKEY',                description: 'Hotkey name registered on netuid 56',                                                required: true },
    { name: 'BASELINE_STATS_PATH',   description: 'Set by the runner — JSON with pre-training baseline stats your script must beat',    required: true },
    { name: 'MINER_DATASETS_DIR',    description: 'Set by the runner — parent dir for requested datasets',                              required: true },
    { name: 'MINER_DATASETS',        description: 'Set by the runner — comma-separated dataset directory names',                        required: true },
    { name: 'ENVIRONMENT_SERVER_URLS',description: 'Set by the runner — comma-separated env server URLs (env tournament tasks only)',   required: false },
    { name: 'HF_TOKEN',              description: 'Hugging Face token for pulling base models',                                          required: true },
    { name: 'WANDB_API_KEY',         description: 'Optional — Gradients integrates Weights & Biases for tracking',                       required: false },
  ],

  scoring: {
    summary:
      "Tournaments are PvP — your trained model plays head-to-head against the defending champion across the tournament's tasks via OpenSpiel-style scoring (3 pts win, 1 draw, 0 loss). To win a boss round and take the title, a challenger must score strictly higher PvP tournament points across all 3 tasks. Tournament length is 4–7 days; new tournaments start ~72 h after the prior finishes. Top performers get exponentially higher emission weight; winning AutoML scripts are published.",
    rule: 'Strict head-to-head wins on every task in the boss round, scored PvP.',
    sourcePath: 'rayonlabs/G.O.D · docs/tourn_miner.md',
    cheatPath:
      "Hardcoded paths (instead of MINER_DATASETS_DIR / BASELINE_STATS_PATH) are auto-rejected. Obfuscated code (.bin, .pyc, .dll) is rejected. Branch names instead of a full 40-char commit SHA in your submission are rejected. Ignoring the hours-to-complete time limit zeros your round. Missing or non-verbatim LICENSE/NOTICE files (character-for-character match) is rejected.",
  },

  profitability: {
    estimatedDailyEmissionPerUid: 0,
    tokenPriceUsdFallback: 284,
    capexNote:
      'H100 rentals at $2-3/hr × multi-day tournaments adds up. Allocate at least one tournament cycle of training budget before expecting to recoup.',
    notes:
      "Rayon Labs paper (Subia-Waud 2025) reports Gradients winning 100% vs Together AI / Databricks / Google Cloud and 82.8% vs HuggingFace AutoTrain across 180 tasks — the upside is real but concentrated in top-decile recipes.",
  },

  milestones: [
    { day: 'day 1', target: 'All four `examples/run_*` scripts complete locally', note: 'Means your Dockerfiles build and the runner hooks are wired correctly.' },
    { day: 'day 3', target: 'First tournament entry accepted', note: 'No license / hardcoded-path rejections.' },
    { day: 'day 7', target: 'Beat baseline on at least one task', note: 'You will not be champion but you should clear baseline before round close.' },
    { day: 'day 14', target: 'PvP draws against the champion on ≥ 1 task', note: 'Bridge from baseline-beater to championship contender.' },
  ],

  monitoring: [
    { metric: 'Dockerfile build success',       threshold: '100%',           where: 'task miner logs' },
    { metric: 'Trainer wall-clock per task',    threshold: '< time limit',   where: 'training container logs' },
    { metric: 'GPU memory utilization',         threshold: '< 135 GB / GPU', where: 'nvidia-smi' },
    { metric: 'PvP points vs champion',         threshold: '> 0',            where: 'tournament dashboard' },
    { metric: 'Incentive per tempo',            threshold: 'rising or flat', where: 'btcli subnet metagraph --netuid 56' },
  ],

  knownIssues: [
    {
      symptom: 'Submission auto-rejected before scoring',
      cause:   'Hardcoded dataset / baseline paths instead of using MINER_DATASETS_DIR / BASELINE_STATS_PATH; missing or non-verbatim LICENSE/NOTICE; obfuscated code; branch name in place of full SHA.',
      fix:     "Read tournament rules in docs/tourn_miner.md carefully — each rejection reason is enumerated. Match LICENSE/NOTICE character-for-character.",
    },
    {
      symptom: 'OOM on H100 even at 1× config',
      cause:   '135 GB / GPU cap exceeded — usually due to gradient checkpointing being off or DPO/GRPO multiplier not applied.',
      fix:     'Enable gradient checkpointing, lower per-device batch size, ensure DPO=×3 / GRPO=×2 multipliers are reflected in your compute request.',
    },
    {
      symptom: 'Trainer runs past the wall-clock time limit',
      cause:   'Task time budget exceeded — leads to disqualification.',
      fix:     "Profile locally with `examples/run_*.sh` and dial back epochs or model size. Use the smallest model that still beats baseline.",
    },
    {
      symptom: 'Cannot register — burn too high',
      cause:   'SN56 is a high-emission subnet with volatile burn cost.',
      fix:     'Check burn immediately before registering; consider testnet practice first via `btcli s register --network test`.',
    },
  ],

  notes: [
    'Repo: https://github.com/rayonlabs/G.O.D. Tournament miner doc: docs/tourn_miner.md. Compute spec: docs/compute.md.',
    'Customers sign up at https://gradients.io and pay for runs; demand on that side helps justify the subnet emission.',
    'Winning AutoML scripts get published — fork the latest winner as the head-start for the next tournament.',
    'DPO ×3 and GRPO ×2 GPU multipliers are documented — factor them into rented-hardware budgets.',
  ],
};
