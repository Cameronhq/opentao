import type { RichPlaybook } from '../playbook-rich';

// SN68 — NOVA. Metanova Labs drug-discovery subnet.
// Miner: `neurons/miner.py`, install via `./install_deps.sh` (Ubuntu 24.04, Python 3.10-3.12,
// CUDA 12.6). Two GPUs strongly recommended for parallel inference; one GPU yields
// delayed/missing scoring rounds. Miner submits candidate molecules + structure data
// against published protein targets.

export const sn68: RichPlaybook = {
  slug: '68-nova',
  netuid: 68,
  name: 'NOVA',
  category: 'reason',
  categoryLabel: 'Reasoning · Drug Discovery',

  blurb:
    'Decentralized AI engine for early-stage drug discovery. Miners generate + screen candidate molecules against published protein targets; validators score on predicted binding, drug-likeness, novelty and synthesizability. Operated by Metanova Labs.',
  whatMinersDo:
    "A NOVA miner runs `neurons/miner.py`. The validator publishes a protein target; the miner uses its own generative-chemistry stack — generative models, docking, ADMET filters — to produce ranked candidate molecules and submits them via a GitHub submission repo. Scoring is composite: binding affinity × drug-likeness × novelty × synthesizability. Two GPUs are strongly recommended (the README notes single-GPU systems will see delayed/missing scoring rounds).",

  verifiedAt: '2026-06-01',
  verifiedBy: '@editorial',

  emission: '— τ/day',
  burnCostFallback: '— τ',
  minerCountFallback: 0,
  slotCap: 256,

  hardware: [
    {
      role: 'GPU node',
      count: '1',
      gpu: '2× NVIDIA GPUs (CUDA 12.6) — single-GPU is supported but penalized',
      vramGb: 24,
      cpuCores: 8,
      ramGb: 64,
      diskGb: 500,
      bandwidth: 'stable broadband',
      notes: 'README: Ubuntu 24.04 LTS recommended, Python 3.10–3.12, CUDA 12.6. "Sufficient RAM for ML model operations" — sizing depends on generative model choice.',
    },
  ],
  hardwareNote:
    'Two GPUs are the practical floor. With one GPU, inference runs sequentially and you miss scoring rounds — direct quote from the README.',

  rentalOk: true,
  rentalUsdPerHr: { lambda: 1.59, runpod: 1.49, coreweave: 1.89 },

  repo: {
    url: 'https://github.com/metanova-labs/nova',
    branch: 'main',
    minerEntrypoint: 'neurons/miner.py',
  },

  setupShape: 'simple-binary',
  setupOverview:
    'Setup is a shell-script installer. Clone with submodules, run `./install_deps.sh` (optionally pinning CUDA version), activate `.venv`, set the GitHub submission repo env vars, then run `python3 neurons/miner.py --wallet.name --wallet.hotkey --logging.info`.',

  install: [
    { step: 'Clone with submodules',
      cmd:  'git clone --recurse-submodules https://github.com/metanova-labs/nova.git && cd nova' },
    { step: 'Install system + Python deps',
      cmd:  './install_deps.sh',
      note: 'Default CUDA 12.6. Pass `--cuda <version>` to override.' },
    { step: 'Activate venv',
      cmd:  'source .venv/bin/activate' },
    { step: 'Create GitHub PAT for the submission repo',
      note: 'Miners need write access to a submission repo where ranked molecules are posted. Validators are read-only.' },
    { step: 'Configure .env',
      note: 'SUBTENSOR_NETWORK, DEVICE_OVERRIDE (cpu/None), GITHUB_TOKEN, GITHUB_REPO_OWNER/NAME/BRANCH/PATH, AUTO_UPDATE=1.' },
    { step: 'Register hotkey on SN68',
      cmd:  'btcli subnet register --netuid 68 --wallet.name $WALLET --wallet.hotkey $HOTKEY' },
  ],

  runSteps: [
    { step: 'Start miner',
      cmd:  'python3 neurons/miner.py --wallet.name $WALLET --wallet.hotkey $HOTKEY --logging.info' },
    { step: 'Verify on the metagraph',
      cmd:  'btcli subnet metagraph --netuid 68' },
  ],

  envVars: [
    { name: 'WALLET',             description: 'Coldkey name (matches --wallet.name)',                            required: true },
    { name: 'HOTKEY',             description: 'Hotkey name (matches --wallet.hotkey)',                           required: true },
    { name: 'SUBTENSOR_NETWORK',  description: 'Subtensor websocket URL (e.g. ws://localhost:9944 or finney)',    required: true },
    { name: 'DEVICE_OVERRIDE',    description: 'Set "cpu" to force CPU; leave unset for GPU',                     required: false },
    { name: 'GITHUB_TOKEN',       description: 'PAT with repo access for the submission repo',                   required: true },
    { name: 'GITHUB_REPO_OWNER',  description: 'Owner of the submission repo',                                   required: true },
    { name: 'GITHUB_REPO_NAME',   description: 'Submission repo name',                                            required: true },
    { name: 'GITHUB_REPO_BRANCH', description: 'Branch where molecule submissions are committed',                 required: true },
    { name: 'GITHUB_REPO_PATH',   description: 'Path inside the repo (can be empty for root)',                    required: false },
    { name: 'AUTO_UPDATE',        description: 'Auto-pull miner code updates (1 to enable)',                      required: false },
  ],

  scoring: {
    summary:
      'Validator publishes a protein target; miner submits a ranked candidate list to the GitHub submission repo. Score is composite — predicted binding affinity + drug-likeness (Lipinski/ADMET) + novelty vs known chemistry + synthesizability. Validators use shared chemistry pipelines so rubric is consistent across the swarm.',
    rule: 'Novel, drug-like, synthesizable molecules that bind beat any single optimization axis.',
    cheatPath:
      "Resubmitting molecules from public catalogs — novelty checks zero them out. Generative-only with no synthesizability filter — high binding but unmakeable, scored low.",
  },

  profitability: {
    estimatedDailyEmissionPerUid: 0.0,
    tokenPriceUsdFallback: 284,
    notes:
      'Peak participation has been ~260 miners; 5.5M+ molecule submissions across 8,700+ proteins. Heavy-tailed: a competitive chemistry stack matters more than raw GPU count past 2 GPUs.',
  },

  milestones: [
    { day: 'day 1', target: 'Miner running, axon up, GitHub submission repo reachable', note: '`neurons/miner.py` logs steady; first molecule commit lands in submission repo.' },
    { day: 'day 3', target: 'Scoring rounds being awarded',                              note: 'If on a single GPU you may see "delayed/missing scoring rounds" — switch to 2 GPUs.' },
    { day: 'day 14', target: 'Composite score above floor',                              note: 'If novelty score is dragging, expand your compound library beyond public sets.' },
  ],

  monitoring: [
    { metric: 'GPU count detected',           threshold: '2 (recommended)',             where: 'nvidia-smi · README warns about 1-GPU degradation' },
    { metric: 'Submission repo commits/tempo', threshold: '> 0',                         where: 'GitHub submission repo' },
    { metric: 'Novelty score',                threshold: 'positive',                    where: 'validator-side composite output' },
    { metric: 'Per-tempo incentive',          threshold: 'rising',                      where: 'btcli subnet metagraph --netuid 68' },
  ],

  knownIssues: [
    {
      symptom: 'Delayed or missing scoring rounds',
      cause:   "Single-GPU host runs inference sequentially — README explicitly calls this out.",
      fix:     'Add a second GPU so inference runs in parallel.',
    },
    {
      symptom: 'GitHub PAT errors',
      cause:   "PAT scoped wrong — validators need read-only, miners need write to the submission repo.",
      fix:     'Re-issue the PAT with the correct scope for the role you are running.',
    },
    {
      symptom: 'Submissions accepted but novelty score near zero',
      cause:   'Compound library overlaps too heavily with public catalogs.',
      fix:     'Bring proprietary or generative-novel compounds; novelty bonus is multiplicative.',
    },
  ],

  notes: [
    'Operated by Metanova Labs — CEO Micaela Bazo (ex-Google), CSO Pedro Penna, CTO Amanda Casadei.',
    'DiaGen AI joint-venture LOI (2025-Q4) covers a "hit picking" tool that turns NOVA outputs into a curated wet-lab-ready shortlist.',
    'CUDA 12.6 is the tested target; older drivers may work but are unsupported.',
  ],
};
