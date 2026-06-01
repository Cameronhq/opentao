import type { RichPlaybook } from '../playbook-rich';

// SN76 — current taostats label ByzantiumSN76; historically operated as Safe Scan
// (cancer-detection vision). The cancer-ai codebase is the most public miner
// stack tied to the slot. Use with caveat: operator identity may have shifted.

export const sn76: RichPlaybook = {
  slug: '76-byzantium',
  netuid: 76,
  name: 'Byzantium',
  category: 'vision',
  categoryLabel: 'Vision',

  blurb:
    'Bittensor SN76. Historically operated as Safe Scan for cancer-detection vision (skin/melanoma, planned expansion to breast and lung). Public miner stack is the cancer-ai repo; the current Byzantium label may indicate a re-positioning — verify operator identity before deploying.',

  whatMinersDo:
    'Under the Safe Scan stack, miners train classification models (ONNX) on labelled medical-imaging tasks and submit them to a public Hugging Face repo. The on-host `neurons/miner.py` exposes three actions: `evaluate` (local self-test against a competition dataset), `self-check` (validator-style dry-run for your hotkey), and `submit` (publish the model + code under a competition id). Validators evaluate ONNX models on held-out splits and rank on accuracy (precision/recall/F1) plus an efficiency score that favours models ≤50 MB.',

  verifiedAt: '2026-06-01',
  verifiedBy: '@editorial',

  emission: '— τ/day',
  burnCostFallback: '— τ',
  minerCountFallback: 0,
  slotCap: 256,

  hardware: [
    {
      role: 'Miner node',
      count: '1',
      cpuCores: 4,
      ramGb: 8,
      diskGb: 50,
      bandwidth: 'Standard upstream to Hugging Face',
      notes: '8 GB RAM minimum for local model evaluation. 1–5 GB disk per competition dataset. GPU optional — CPU evaluation supported. Python 3.12+.',
    },
  ],
  hardwareNote: 'Training is up to you; the miner host itself only needs enough resources to package and self-check an ONNX model.',

  rentalOk: true,
  rentalUsdPerHr: { lambda: 0.10, runpod: 0.08, coreweave: 0.15 },

  repo: {
    url: 'https://github.com/safe-scan-ai/cancer-ai',
    branch: 'main',
    minerEntrypoint: 'neurons/miner.py',
  },

  setupShape: 'simple-binary',
  setupOverview:
    'Clone the cancer-ai repo, create a Python 3.12 venv, install requirements, register on netuid 76, then iterate: train an ONNX model offline → `evaluate` locally → `self-check` against your hotkey → `submit` to the competition with your Hugging Face repo id. Validators pull from your public HF repo and score on held-out medical-image splits.',

  install: [
    { step: 'Clone repo',
      cmd: 'git clone git@github.com:safe-scan-ai/cancer-ai.git && cd cancer-ai' },
    { step: 'Create Python 3.12 venv',
      cmd: 'virtualenv venv --python=3.12 && source venv/bin/activate' },
    { step: 'Install requirements',
      cmd: 'pip install -r requirements.txt' },
    { step: 'Export PYTHONPATH',
      cmd: 'export PYTHONPATH="${PYTHONPATH}:./"' },
    { step: 'Register on subnet',
      cmd: 'btcli subnet register --netuid 76 --wallet.name $WALLET --wallet.hotkey $HOTKEY' },
  ],

  runSteps: [
    { step: 'Local evaluation of your ONNX model',
      cmd: 'python neurons/miner.py --action evaluate --competition_id <ID> --model_path <ONNX>' },
    { step: 'Self-check against your hotkey',
      cmd: 'python neurons/miner.py --action self-check --hotkey <ADDRESS> --competition_id <ID>' },
    { step: 'Submit',
      cmd: 'python neurons/miner.py --action submit --competition_id <ID> --hf_repo_id <REPO>',
      note: 'Hugging Face repo MUST stay public so validators can pull. Model and code filenames must share a base name.' },
  ],

  envVars: [
    { name: 'WALLET',     description: 'Coldkey name',                                              required: true },
    { name: 'HOTKEY',     description: 'Hotkey name',                                               required: true },
    { name: 'PYTHONPATH', description: 'Must include "./" before running miner commands',           required: true },
  ],

  scoring: {
    summary:
      'Validators score each submitted ONNX model on held-out labelled medical-imaging data: precision, recall, F1 (and AUC where relevant). Layered on top is an efficiency score — models ≤50 MB get full efficiency points, 50–150 MB are linearly interpolated, ≥150 MB get zero efficiency. Reward distribution is heavily concentrated at the top: 1st place takes 50% of the pool; positions 2–10 share 17%→1%; below top-10 receives only minimal participation rewards.',
    rule: 'accuracy × efficiency_score × rank_payout_curve. Top-10 monopolises emission.',
    sourcePath: 'safe-scan-ai/cancer-ai · DOCS/miner.md (scoring + reward distribution)',
    cheatPath:
      'Overfitting to public dermatology datasets (ISIC, etc.) or scraping the validator test set fails on private held-out splits. Pushing model size above 150 MB to chase accuracy zeros out the efficiency component.',
  },

  profitability: {
    estimatedDailyEmissionPerUid: 0.0,
    tokenPriceUsdFallback: 284,
    notes: 'Steep payout curve — being top-3 is materially different from being top-30. Capex-light: you can train on a single rented GPU and submit a sub-50 MB ONNX.',
  },

  milestones: [
    { day: 'day 1',  target: 'Registered + local evaluate succeeds', note: 'Local `evaluate` action returns metrics against a competition dataset.' },
    { day: 'day 3',  target: 'self-check + submit clean',            note: 'Model submitted to your public HF repo with matching code/model filenames; validators can pull it.' },
    { day: 'day 14', target: 'Inside top-10 on at least one competition', note: 'Reward curve concentrates around the top — outside top-10 returns are marginal.' },
    { day: 'day 30', target: 'Stable top-10 across recurring evals', note: 'Iterate on architecture + augmentation; sub-50 MB models maximise the efficiency multiplier.' },
  ],

  monitoring: [
    { metric: 'Model size',                threshold: '≤ 50 MB',          where: '`ls -lh <model>.onnx` — > 150 MB zeroes efficiency' },
    { metric: 'HF repo visibility',        threshold: 'public',           where: 'huggingface.co/<repo>' },
    { metric: 'self-check success',        threshold: 'pass',             where: '`python neurons/miner.py --action self-check`' },
    { metric: 'Competition rank',          threshold: 'top-10',           where: 'Project dashboard / Discord results channel' },
    { metric: 'Per-tempo incentive',       threshold: 'rising or flat',   where: 'btcli subnet metagraph --netuid 76' },
  ],

  knownIssues: [
    {
      symptom: 'Validator cannot fetch model',
      cause:   'Hugging Face repo is private or filenames do not share a base name.',
      fix:     'Make the repo public; rename so the code file and model file share the same base name (e.g. `melanoma_v3.py` + `melanoma_v3.onnx`).',
    },
    {
      symptom: 'Module not found errors when running miner.py',
      cause:   'PYTHONPATH not set.',
      fix:     'export PYTHONPATH="${PYTHONPATH}:./" before any miner.py command.',
    },
    {
      symptom: 'High accuracy but low total score',
      cause:   'Model > 50 MB triggers the linear efficiency penalty; > 150 MB zeroes it.',
      fix:     'Quantise / prune to fit under 50 MB. The efficiency multiplier matters more than marginal accuracy.',
    },
    {
      symptom: 'Earning near zero',
      cause:   'Outside top-10 on the competition.',
      fix:     'Reward curve is heavily front-loaded — improve materially or rotate to a competition where you can break into the top tier.',
    },
  ],

  notes: [
    'Current taostats ticker is ByzantiumSN76 but the public miner stack remains the cancer-ai repo. Confirm with operator channels before committing real capex.',
    'Founders publicly associated with the Safe Scan codebase: Mateusz Woźniak and Wojciech Jurkowlaniec.',
    'Reward distribution: 1st=50%, 2nd–10th=17%→1%, below=minimal participation. Plan accordingly.',
  ],
};
