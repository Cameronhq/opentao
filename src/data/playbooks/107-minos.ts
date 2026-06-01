import type { RichPlaybook } from '../playbook-rich';

// SN107 — Minos. Decentralized genomic variant calling. Hardware + install
// steps verified from github.com/minos-protocol/minos_subnet README via
// WebFetch on 2026-06-01.

export const sn107: RichPlaybook = {
  slug: '107-minos',
  netuid: 107,
  name: 'Minos',
  category: 'data',
  categoryLabel: 'Data',

  blurb:
    'Decentralized variant-calling benchmark. Validators inject synthetic mutations into BAMs via HelixForge, miners run a variant caller (GATK / DeepVariant / BCFtools) and submit VCF + hyperparameter config, and hap.py scores precision/recall against the known truth.',

  whatMinersDo:
    "A Minos miner downloads a mutated BAM from a validator (via S3 + Hippius SN75 presigned URLs), runs their chosen variant-calling pipeline — GATK, DeepVariant, or BCFtools — and submits the resulting VCF plus the hyperparameter configuration that produced it. Validators rerun the config against platform truth data and score with hap.py (the GA4GH standard) — F1, completeness, false-positive rate, and quality blend into a 0-100 result. Lag scoring means you work on cycle N+1 while validators score cycle N, so the pipeline never stalls on Bittensor's 72-min tempo.",

  verifiedAt: '2026-06-01',
  verifiedBy: '@editorial',

  emission: '— τ/day',
  burnCostFallback: '— τ',
  minerCountFallback: 0,
  slotCap: 256,

  hardware: [
    {
      role: 'Variant-caller node',
      count: '1',
      cpuCores: 4,
      ramGb: 16,
      diskGb: 60,
      bandwidth: 'public IP · stable broadband',
      notes: 'Per README: ≥4 cores / 8-16 GB RAM / ≥60 GB disk. BCFtools runs comfortably on 8 GB; DeepVariant benefits from the full 16 GB. No GPU required for the baseline pipelines — GPU helps DeepVariant runtime but is not mandatory.',
    },
  ],
  hardwareNote:
    'The README lists modest specs because the work is bioinformatics, not deep learning. If you choose GPU-accelerated DeepVariant, add a single workstation-class GPU; CPU-only is the documented baseline.',

  rentalOk: true,
  rentalUsdPerHr: { lambda: 0.40, runpod: 0.30, coreweave: 0.50 },

  repo: {
    url: 'https://github.com/minos-protocol/minos_subnet',
    branch: 'main',
    extraRepos: [
      { name: 'Hippius SN75',  url: 'https://taostats.io/subnets/75/', purpose: 'Decentralized BAM storage backend used by Minos' },
      { name: 'hap.py',        url: 'https://github.com/Illumina/hap.py', purpose: 'GA4GH variant-call benchmarking tool used for scoring' },
    ],
  },

  setupShape: 'simple-binary',
  setupOverview:
    'Setup is the cleanest in this batch — clone, run install.sh, set .env, run start-miner.sh. The installer handles the Python venv, dependencies, Docker image pulls, and reference data downloads. Pick a MINER_TEMPLATE (gatk / deepvariant / bcftools) before starting.',

  install: [
    { step: 'Clone the Minos subnet repo',
      cmd:  'git clone https://github.com/minos-protocol/minos_subnet.git && cd minos_subnet' },
    { step: 'Run the installer',
      cmd:  'bash install.sh',
      note: 'Handles venv, deps, Docker image pulls, and reference-data downloads automatically.' },
    { step: 'Copy and edit .env',
      cmd:  'cp .env.example .env && $EDITOR .env',
      note: 'Required: NETUID=107, WALLET_NAME, WALLET_HOTKEY, MINER_TEMPLATE (gatk / deepvariant / bcftools), PLATFORM_URL=https://api.theminos.ai, STORAGE_PRIMARY_BACKEND (hippius by default, or aws_s3).' },
    { step: 'Register your hotkey on SN107',
      cmd:  'btcli subnet register --netuid 107 --wallet.name $WALLET_NAME --wallet.hotkey $WALLET_HOTKEY' },
  ],

  runSteps: [
    { step: 'Start the miner',
      cmd:  'bash start-miner.sh' },
    { step: 'Verify task polling + submission',
      note: 'Logs should show: platform registration → task pull → BAM download → variant call → VCF + config submission → score returned.' },
    { step: 'Watch metagraph',
      cmd:  'btcli subnet metagraph --netuid 107' },
  ],

  envVars: [
    { name: 'NETUID',                  description: 'Subnet UID — 107 for Minos',                                    required: true },
    { name: 'WALLET_NAME',             description: 'Coldkey name',                                                  required: true },
    { name: 'WALLET_HOTKEY',           description: 'Hotkey name',                                                   required: true },
    { name: 'MINER_TEMPLATE',          description: 'Pipeline choice: gatk | deepvariant | bcftools',                required: true },
    { name: 'PLATFORM_URL',            description: 'Minos platform API (https://api.theminos.ai)',                  required: true },
    { name: 'STORAGE_PRIMARY_BACKEND', description: 'hippius (default, Bittensor-native) or aws_s3',                 required: true },
  ],

  scoring: {
    summary:
      'Validators re-execute your submitted config against platform truth data and compare with hap.py. The AdvancedScorer produces a 0-100 result weighting core F1 (60%), completeness (15%), false-positive rate (15%), and quality (10%).',
    rule:
      'Earn by maximising hap.py F1 across the rolling task set. Eligibility for weight distribution requires scoring in ≥10 of the last 20 rounds — uptime + responsiveness matter, not just accuracy.',
    cheatPath:
      "Memorising past BAMs and replaying VCFs is defeated by HelixForge generating fresh synthetic mutations per round. Overfitting hyperparameters to past synthetic mutations is defeated by HelixForge's mutation distribution + rotation. Fabricating a VCF fails hap.py instantly because the ground truth lives with validators.",
  },

  profitability: {
    estimatedDailyEmissionPerUid: 0.0,
    tokenPriceUsdFallback: 284,
    capexNote:
      'Capex-light — a single node under $1k or a cheap cloud VM is enough for BCFtools / GATK. GPU only matters if you run DeepVariant for the runtime win.',
    notes:
      'Early-launch subnet, per-UID emissions not stable enough to confidently estimate. Eligibility floor (10 of last 20 rounds) means dropouts cost more than they do on most subnets.',
  },

  milestones: [
    { day: 'day 1', target: 'install.sh + start-miner.sh clean, first task completed', note: 'Logs show a complete task → VCF → score cycle within the first tempo.' },
    { day: 'day 3', target: 'Eligibility floor passed (10 of last 20 rounds)',          note: 'Miss too many rounds and you exit eligibility — uptime matters as much as F1.' },
    { day: 'day 7', target: 'F1 trending into top quartile',                            note: 'If F1 is flat, tune your MINER_TEMPLATE hyperparameters — the README points at the knobs.' },
    { day: 'day 14', target: 'Out of immunity, stable incentive',                       note: 'Compare your config to top miners on community dashboards.' },
  ],

  monitoring: [
    { metric: 'Round participation (last 20)',  threshold: '≥ 10',           where: 'Miner logs + theminos.ai dashboard' },
    { metric: 'Hap.py F1 score',                threshold: 'rising or flat', where: 'Miner logs (scoring server returns)' },
    { metric: 'BAM download success rate',      threshold: '100%',           where: 'Miner logs' },
    { metric: 'Per-tempo incentive',            threshold: 'rising or flat', where: 'btcli subnet metagraph --netuid 107' },
  ],

  knownIssues: [
    {
      symptom: 'Eligibility lost — score stops accruing',
      cause:   'Missed too many rounds (< 10 of last 20). Usually network drops or BAM download failures.',
      fix:     'Stabilise the node, verify Hippius SN75 + S3 connectivity; eligibility rebuilds as you make consecutive rounds.',
    },
    {
      symptom: 'F1 plateau well below leaders',
      cause:   'Default MINER_TEMPLATE hyperparameters — competitive miners tune them per the task distribution.',
      fix:     'Read the README scoring section, profile the BAMs you receive, tune your caller config (e.g. DeepVariant model_type, GATK filter thresholds).',
    },
    {
      symptom: 'Hippius downloads slow or failing',
      cause:   'Hippius SN75 storage replica is the primary backend by default — partial outages can stall BAM pulls.',
      fix:     'Set STORAGE_PRIMARY_BACKEND=aws_s3 temporarily to fall back to the S3 replica.',
    },
  ],

  notes: [
    'Lag scoring keeps the pipeline productive across Bittensor tempos — submit cycle N is scored while you work on cycle N+1.',
    'hap.py is the GA4GH standard; this is one of the rare Bittensor subnets where scoring is grounded in an external community benchmark, not "model evaluates model".',
  ],
};
