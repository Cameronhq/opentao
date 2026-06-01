import type { RichPlaybook } from '../playbook-rich';

// SN29 — Coldint (COLaborative Distributed INcentivized Training).
// Forked from SN9 Pretraining with explicit Pareto (accuracy × params × FLOPs)
// scoring. Miners train small specialized models offline, upload to
// HuggingFace, and commit the metadata pointer on-chain. Initial competition
// targets HuggingFaceFW/fineweb-edu-score-2 dataset.

export const sn29: RichPlaybook = {
  slug: '29-coldint',
  netuid: 29,
  name: 'Coldint',
  category: 'llm',
  categoryLabel: 'Pretraining',

  blurb:
    'Decentralized incentivized training of small, efficient specialized models. Pareto scoring on accuracy × parameters × FLOPs — tiny strong models beat blind scale.',

  whatMinersDo:
    "Coldint miners train models locally and offline on their own GPUs, then upload the best checkpoint to a public HuggingFace repo and use `scripts/upload_model.py` to commit the metadata pointer on-chain. The communication is asynchronous — miners do not need to be running continuously, they just need to keep iterating models. Validators pull the latest miner-committed model from HuggingFace, reset its weights as needed, evaluate on the active competition's held-out dataset (the initial competition uses HuggingFaceFW/fineweb-edu-score-2), and score on a Pareto frontier across accuracy, parameter count, and FLOPs. Only one model per hotkey at a time.",

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
      gpu: '1×H100 80GB (single) OR multiple 48GB (A6000) / 24GB (3090/4090)',
      vramGb: 80,
      cpuCores: 16,
      ramGb: 64,
      diskGb: 100,
      bandwidth: 'stable upload to HuggingFace · 100 Mbps',
      notes: 'Current competitions target ~7B parameter models. Max model size defined in constants/__init__.py (typically 15 GB). Recommend ≥ 100 GB disk for checkpoints.',
    },
  ],
  hardwareNote:
    'Training is bursty, not always-on — you can rent GPU only during training runs and shut it down between iterations. The on-chain commit + HuggingFace upload are the only required online steps.',

  rentalOk: true,
  rentalUsdPerHr: { lambda: 2.49, runpod: 2.79, coreweave: 2.99 },

  repo: {
    url: 'https://github.com/coldint/coldint_validator',
    branch: 'main',
    minerEntrypoint: 'scripts/upload_model.py',
    extraRepos: [
      { name: 'coldint/sn29',     url: 'https://github.com/coldint/sn29',     purpose: 'Dynamic on-chain config — competition definitions, Hall of Fame weights' },
    ],
  },

  setupShape: 'simple-binary',
  setupOverview:
    'Train your model locally on your own GPUs, save checkpoints, upload to a public HuggingFace repo with `scripts/upload_model.py`. Validators pull from HF and evaluate — no axon endpoint, no always-on miner process required. Iterate by uploading better checkpoints over time.',

  install: [
    { step: 'Create HuggingFace account + access token',
      note: 'Token must be read/write. Repo for uploads MUST be public so validators can download.' },
    { step: 'Clone the validator repo (contains miner upload script)',
      cmd: 'git clone https://github.com/coldint/coldint_validator.git && cd coldint_validator' },
    { step: 'Setup venv',
      cmd: 'python -m venv coldint_venv && source coldint_venv/bin/activate' },
    { step: 'Pre-install troublesome packages',
      cmd: 'pip install packaging wheel torch' },
    { step: 'Install the rest as editable',
      cmd: 'pip install -e .' },
    { step: 'Set HF_ACCESS_TOKEN',
      cmd: 'echo "HF_ACCESS_TOKEN=YOUR_HF_ACCESS_TOKEN" > .env' },
    { step: 'Train your model locally',
      note: 'No prescribed framework — top miners use HF Trainer / custom PyTorch loops. Read constants/__init__.py for the current allowed model types + size cap.' },
    { step: 'Register on SN29',
      cmd: 'btcli subnet register --netuid 29 --wallet.name $WALLET --wallet.hotkey $HOTKEY' },
  ],

  runSteps: [
    { step: 'Upload trained model to HuggingFace + commit pointer on-chain',
      cmd: 'python scripts/upload_model.py --wallet.name $WALLET --wallet.hotkey $HOTKEY --hf_repo_id $HF_USER/$HF_REPO --model_dir ./my_trained_model',
      note: 'Replace the model_dir path with your local checkpoint. The script will push to HF, then commit the HF repo URL + commit hash to the chain so validators know which checkpoint to evaluate.' },
    { step: 'Verify validators are pulling your model',
      note: 'Watch validator logs in Discord #coldint, or check taostats.io/subnets/netuid-29/ for your UID incentive number — should rise after first eval cycle.' },
    { step: 'Iterate',
      note: 'Train an improved model, upload again. The new commit supersedes the previous one — validators evaluate the latest pointer.' },
  ],

  envVars: [
    { name: 'WALLET',          description: 'Coldkey name',                                                       required: true },
    { name: 'HOTKEY',          description: 'Hotkey name',                                                        required: true },
    { name: 'HF_ACCESS_TOKEN', description: 'HuggingFace token with write access (in .env or shell env)',         required: true },
    { name: 'HF_USER',         description: 'Your HuggingFace username/org for the public repo',                  required: true },
    { name: 'HF_REPO',         description: 'Public HuggingFace repo name where checkpoints upload',              required: true },
  ],

  scoring: {
    summary:
      'Pareto frontier across accuracy on the current competition dataset, parameter count, and FLOPs at inference. Models that cannot be strictly beaten on all three axes receive meaningful weight. Hall of Fame entries (code/bug-fix contributors) also receive a configurable slice of emission via dynamic on-chain config.',
    rule: 'Be on the Pareto frontier (no other model beats yours on all of accuracy, params, FLOPs) — tiny strong models can win alongside bigger ones.',
    sourcePath: 'coldint/coldint_validator · constants/__init__.py + validator code',
    cheatPath:
      "Copying another miner's HuggingFace weights gives identical eval scores but loses on the novelty / Pareto-improvement criteria. Overfitting to a leaked eval split is countered by deterministic-but-unseen eval data + weight reset before evaluation. Uploading enormous models that win raw accuracy but blow up params/FLOPs falls off the Pareto frontier and earns nothing.",
  },

  profitability: {
    estimatedDailyEmissionPerUid: 0.0,
    tokenPriceUsdFallback: 284,
    capexNote:
      'Real cost is training compute, not always-on infra. A single 7B-param model run on rented H100 is typically 4–12 hours of $2.5/hr — call it $10–$30 per iteration. Top miners iterate many times per competition.',
    notes:
      "Two-person Coldint team explicitly designed this to favour clever architecture / data-curation insights over blind scale — small operators can compete.",
  },

  milestones: [
    { day: 'day 1',  target: 'First model uploaded and committed', note: 'HF repo public, on-chain commit visible. Even the base/template upload should produce a non-zero incentive after one eval cycle.' },
    { day: 'day 3',  target: 'First custom model iteration',       note: 'Your own training run uploaded; validators evaluating; UID climbing.' },
    { day: 'day 7',  target: 'On Pareto frontier',                 note: 'You beat at least one peer model on at least one axis. Check taostats for your relative incentive.' },
    { day: 'day 14', target: 'Out of immunity period',             note: 'Surviving deregistration; if borderline, target smaller-but-stronger model rather than scaling up.' },
    { day: 'day 30', target: 'Stable mid-pack emission',           note: 'Multiple model iterations shipped, consistent Pareto-frontier presence, opex covered by emission.' },
  ],

  monitoring: [
    { metric: 'HuggingFace repo public + accessible', threshold: '100%',                where: 'huggingface.co/<user>/<repo> · validators 404 = no score' },
    { metric: 'On-chain commit pointer matches HF',   threshold: 'always current',      where: 'btcli with subnet command + bittensor commitments query' },
    { metric: 'UID incentive trend',                  threshold: 'rising or flat',      where: 'taostats.io/subnets/netuid-29/ · check after each upload' },
    { metric: 'Model size ≤ subnet cap',              threshold: '≤ 15 GB (per constants)', where: 'constants/__init__.py · check current limit before uploading' },
  ],

  knownIssues: [
    {
      symptom: 'Model uploaded but validators score zero',
      cause:   'HuggingFace repo is private — token-gated repos cannot be pulled by validators.',
      fix:     'Set repo visibility to public in HF settings. Confirm with an incognito-window curl of the model file URL.',
    },
    {
      symptom: 'Upload script fails with "model too large"',
      cause:   'Model exceeds the current per-competition size cap defined in constants/__init__.py.',
      fix:     'Re-check the limit in the current main branch. Pareto scoring strongly favors smaller models anyway — distill or prune.',
    },
    {
      symptom: 'Two validators give wildly different scores',
      cause:   'One validator is on an older codebase / outdated competition definition. Yuma median is what matters.',
      fix:     'Ignore single-validator outliers; the on-chain weight is the consensus median. File a Discord report if a specific validator looks broken.',
    },
    {
      symptom: 'Score drops after a competition rotation',
      cause:   'Dynamic on-chain config rotated the active competition or task; your model was optimized for the previous one.',
      fix:     'Check coldint/sn29 repo (competitions.json) for the new active competition. Retrain accordingly.',
    },
  ],

  notes: [
    'Subnet pivot in 2025 toward "AI-ASSeSS" (AI Agent Safety & Security) — competition definitions may rotate toward safety-eval tasks. Always check the live competition spec.',
    'No always-on miner process required — this is a "train + upload" flow, not a "serve axon" flow.',
    'Hall of Fame slice of emission rewards code contributors, bug-fixes, and key insights — open-source contributions to the validator codebase pay too.',
  ],
};
