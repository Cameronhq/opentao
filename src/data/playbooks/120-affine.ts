import type { RichPlaybook } from '../playbook-rich';

// SN120 — Affine (founded by Jacob Steeves / Const). Winner-takes-all RL
// reasoning tournament. Miners commit a HuggingFace repo on-chain; the
// current champion is challenged across every eval env, all-or-nothing.
// Validator (Targon-hosted B300 fleet) handles inference.

export const sn120: RichPlaybook = {
  slug: '120-affine',
  netuid: 120,
  name: 'Affine',
  category: 'reason',
  categoryLabel: 'RL reasoning tournament',

  blurb:
    'Commit a HuggingFace model on-chain; validators (running on an operator-managed Targon B300 fleet) face it off against the current champion across every eval env. Strict win across all envs = new champion. Anything else = permanent termination.',

  whatMinersDo:
    "An Affine miner pulls the current champion from the network, improves it (typically via RL), uploads to a public HuggingFace repo whose name ends with the miner's hotkey, and commits the revision SHA on-chain via the `af` CLI. The validator (running on an operator-managed Targon B300 inference fleet) faces the challenger against the defending champion across every evaluation environment in a single back-to-back contest. The challenger must win strictly across all envs by a per-env margin to dethrone the champion; otherwise it is permanently terminated. Every ~24 hours the task-id pool refreshes and the champion resets.",

  verifiedAt: '2026-06-01',
  verifiedBy: '@editorial',

  emission: '— τ/day',
  burnCostFallback: '— τ',
  minerCountFallback: 0,
  slotCap: 256,

  hardware: [
    {
      role: 'Local training / RL node (offline)',
      count: '1',
      gpu: '1× H100 80GB (recommended for Qwen3-32B-class RL fine-tunes)',
      vramGb: 80,
      cpuCores: 24,
      ramGb: 128,
      diskGb: 1000,
      bandwidth: '1 Gbps',
      notes: 'You only need GPUs for training. Validator-side inference is hosted by an operator-managed Targon B300 fleet — you do NOT host your model online.',
    },
  ],
  hardwareNote:
    "You do not run a long-lived neuron — submission is `af commit` or `af miner-deploy`. The hardware question is really 'what do you need to train a Qwen3-32B-class model with RL'.",

  rentalOk: true,
  rentalUsdPerHr: { lambda: 2.99, runpod: 2.49, coreweave: 3.10 },

  repo: {
    url: 'https://github.com/AffineFoundation/affine',
    branch: 'main',
    minerEntrypoint: 'af CLI (no neuron — commit via `af miner-deploy` or `af commit`)',
    extraRepos: [
      { name: 'affine-cortex', url: 'https://github.com/AffineFoundation/affine-cortex', purpose: 'Higher-level miner tooling and helper scripts.' },
    ],
  },

  setupShape: 'simple-binary',
  setupOverview:
    "Install uv, clone the affine repo, set up a venv, install the `af` CLI, set wallet + HuggingFace token in env, train your improved model, push to a public HF repo ending in your hotkey, then `af commit` once. Exactly one commit per hotkey — get it right.",

  install: [
    { step: 'Install uv (Python package manager)',
      cmd:  'curl -LsSf https://astral.sh/uv/install.sh | sh' },
    { step: 'Clone the affine repo',
      cmd:  'git clone https://github.com/AffineFoundation/affine.git && cd affine' },
    { step: 'Create venv and install the CLI',
      cmd:  'uv venv && source .venv/bin/activate && uv pip install -e .' },
    { step: 'Verify the CLI',
      cmd:  'af --help' },
    { step: 'Set environment',
      note: 'Export BT_WALLET_COLD, BT_WALLET_HOT, SUBTENSOR_ENDPOINT="finney", HF_TOKEN (write-scope hf_…).' },
    { step: 'Register on SN120',
      cmd:  'btcli subnet register --netuid 120 --wallet.name $BT_WALLET_COLD --wallet.hotkey $BT_WALLET_HOT' },
  ],

  runSteps: [
    { step: 'Train your improved Qwen3-32B-class model offline',
      note: 'Pull the current champion, run RL improvements, save to a local directory.' },
    { step: 'Deploy: push to HuggingFace + commit on-chain (one shot)',
      cmd:  'af miner-deploy --repo $HF_USER/affine-model-$BT_WALLET_HOT -p ./model_path',
      note: "Repo MUST be public and MUST end with your hotkey (case-insensitive). The `miner-deploy` flow uploads to HF and writes the on-chain commit in one step." },
    { step: 'Alternative: commit a pre-uploaded HF revision',
      cmd:  'af commit --repo $HF_USER/affine-model-$BT_WALLET_HOT --revision <SHA>',
      note: 'Use this only if you already uploaded; same single-commit rule applies.' },
    { step: 'Check your rank',
      cmd:  'af get-rank' },
  ],

  envVars: [
    { name: 'BT_WALLET_COLD',     description: 'Coldkey name',                                              required: true },
    { name: 'BT_WALLET_HOT',      description: 'Hotkey name registered on netuid 120',                      required: true },
    { name: 'SUBTENSOR_ENDPOINT', description: '"finney" (mainnet) or other chain endpoint',                required: true },
    { name: 'HF_TOKEN',           description: 'Hugging Face token, Write scope (starts with hf_…)',        required: true },
  ],

  scoring: {
    summary:
      "Affine is winner-takes-all. The challenger model faces the current champion across every evaluation environment in one back-to-back contest. To take the title, the challenger must win strictly across all environments by a per-env margin; otherwise it is permanently terminated and the hotkey is burned. Every ~24h the task-id pool refreshes and the champion resets — so even a lost challenge isn't infinitely valuable.",
    rule: 'Strict win across every eval environment by per-env margin = new champion. Anything else = permanent termination.',
    sourcePath: 'AffineFoundation/affine · docs/MINER.md',
    cheatPath:
      "Once a hotkey commits a revision, that hotkey cannot commit again — multiple commits permanently invalidate. Repo must be public when you commit (private = invalid). Repo name must END with your hotkey, case-insensitive. Model class must align with Qwen3-32B-class — submitting something incompatible just wastes the commit.",
  },

  profitability: {
    estimatedDailyEmissionPerUid: 0,
    tokenPriceUsdFallback: 284,
    capexNote:
      "Capex is whatever you need to RL-finetune a Qwen3-32B-class model: 1× H100 + storage at minimum, multi-H100 if you want fast iteration. Subnet reportedly hit ~$66M market cap in 2026·04 — emission concentration is real.",
    notes:
      "Single-commit-per-hotkey is the operational reality — register many hotkeys if you want to experiment with multiple model variants.",
  },

  milestones: [
    { day: 'day 1', target: 'af CLI installed and wallet linked', note: '`af get-rank` returns without error.' },
    { day: 'day 3', target: 'Local RL pipeline working on the published champion', note: 'You can pull, train an iteration, and evaluate locally before committing.' },
    { day: 'day 7', target: 'First commit lands on-chain', note: 'HF repo public + ends with hotkey, single af commit, revision visible on-chain. Wait the ~24h pool window for evaluation.' },
    { day: 'day 14', target: 'At least one strict-win across all envs', note: 'If not, register a new hotkey and improve the recipe — old hotkey is burned.' },
  ],

  monitoring: [
    { metric: 'Hotkey state',                threshold: 'not terminated', where: 'af get-rank' },
    { metric: 'HF repo visibility',          threshold: 'public',         where: 'huggingface.co/<repo>' },
    { metric: 'On-chain commit',             threshold: '1',              where: 'btcli subnet metagraph --netuid 120 + chain explorer' },
    { metric: 'Champion rotation window',    threshold: '~24h tracked',   where: 'Affine dashboard / community channels' },
    { metric: 'Incentive per tempo',         threshold: 'rising or flat', where: 'btcli subnet metagraph --netuid 120' },
  ],

  knownIssues: [
    {
      symptom: 'Commit accepted but hotkey instantly invalidated',
      cause:   'HF repo is private, or repo name does not end with the hotkey.',
      fix:     "Make the repo public BEFORE commit; rename so it ends with the hotkey (case-insensitive); register a fresh hotkey and try again — the burned one is dead.",
    },
    {
      symptom: 'Attempted a second commit to fix a typo / wrong revision',
      cause:   "One-commit-per-hotkey rule — second commit permanently invalidates.",
      fix:     'Never re-commit. Register a fresh hotkey and submit cleanly.',
    },
    {
      symptom: 'Challenger lost a round and hotkey terminated',
      cause:   "Did not strictly win across all envs by the per-env margin.",
      fix:     "Train harder offline. Verify your model class aligns with Qwen3-32B. Register a fresh hotkey and retry against the next champion reset (every ~24h).",
    },
    {
      symptom: 'af commit rejected (revision not found)',
      cause:   'SHA not pushed to HF yet, or repo permission missing.',
      fix:     'Confirm the SHA shows on the HF repo page, HF_TOKEN has write scope, and you used the FULL 40-char SHA (not a branch name).',
    },
  ],

  notes: [
    'Repo: https://github.com/AffineFoundation/affine. Helper repo: https://github.com/AffineFoundation/affine-cortex.',
    "Validator-side inference is hosted on an operator-managed Targon B300 fleet — you don't pay to serve, only to train.",
    'Founded by Jacob Steeves ("Const"), Bittensor co-founder.',
    'Winner-takes-all dynamics are extreme — assume one good hotkey out of many tries before you become champion.',
  ],
};
