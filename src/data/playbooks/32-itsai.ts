import type { RichPlaybook } from '../playbook-rich';

// SN32 — It's AI (AI-text detector). Operated by ITSAI Technologies - FZCO
// (Dubai). Miners train classifier models that distinguish human vs LLM text;
// validators query with mixed labelled batches and score AUC / F1 / MCC.
// Powers hosted product at its-ai.org + Chrome extension + API.

export const sn32: RichPlaybook = {
  slug: '32-itsai',
  netuid: 32,
  name: "It's AI",
  category: 'llm',
  categoryLabel: 'Text Detection',

  blurb:
    'Decentralized AI-text detection — distinguishes human from LLM writing at 92%+ accuracy. Miners train text classifiers; validators score with AUC/F1/MCC against rotating frontier-LLM labelled batches.',

  whatMinersDo:
    "An It's AI miner runs `neurons/miner.py` on a GPU host and serves text-classification predictions. Validators continuously query with batches mixing human-written and AI-generated text (covering 30+ open-source LLMs from the top of LLM-arena, with augmentations and adversarial attacks). The miner returns a per-sample probability that the text is machine-generated. The reference miner ships pre-trained DeBERTa weights (deberta-large-ls03-ctx1024 + deberta-v3-large) which you download from huggingface.co/sergak0/sn32 before launching.",

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
      gpu: '1× NVIDIA (min RTX A4000 per docs)',
      vramGb: 16,
      cpuCores: 8,
      ramGb: 32,
      diskGb: 100,
      bandwidth: 'static public IP · open axon port · 100 Mbps',
      notes: 'DeBERTa-large classifier is small — 16 GB VRAM is the documented minimum. Bigger models or ensembles benefit from more VRAM.',
    },
  ],
  hardwareNote:
    'Classifier inference is light by ML standards — A4000/A5000 is fine. Compute is not the moat; fresh training data covering newly-released LLMs is.',

  rentalOk: true,
  rentalUsdPerHr: { lambda: 0.79, runpod: 0.59, coreweave: 0.89 },

  repo: {
    url: 'https://github.com/It-s-AI/llm-detection',
    branch: 'main',
    minerEntrypoint: 'neurons/miner.py',
  },

  setupShape: 'simple-binary',
  setupOverview:
    'Clone the repo, set up a Python venv, install the package, download the pre-trained DeBERTa weights from HuggingFace, register on netuid 32, and launch the miner under PM2. Running a local subtensor is strongly recommended because the public RPC is under heavy load.',

  install: [
    { step: 'Update + clone',
      cmd: 'apt update && apt upgrade -y && git clone https://github.com/It-s-AI/llm-detection && cd llm-detection' },
    { step: 'Setup Python venv', cmd: 'python3 -m venv .venv && source .venv/bin/activate' },
    { step: 'Install package', cmd: 'python -m pip install -e .' },
    { step: 'Download DeBERTa classifier weights',
      cmd: 'wget https://huggingface.co/sergak0/sn32/resolve/main/deberta-large-ls03-ctx1024.pth -O models/deberta-large-ls03-ctx1024.pth' },
    { step: 'Download DeBERTa-v3 base weights + extract',
      cmd: 'wget https://huggingface.co/sergak0/sn32/resolve/main/deberta-v3-large-hf-weights.zip -O models/deberta-v3-large-hf-weights.zip && apt install -y zip unzip && unzip models/deberta-v3-large-hf-weights.zip -d models/deberta-v3-large-hf-weights' },
    { step: 'Create wallet + hotkey',
      cmd: 'btcli w new_coldkey && btcli w new_hotkey' },
    { step: 'Register on SN32',
      cmd: 'btcli s register --netuid 32 --wallet.name $WALLET --wallet.hotkey $HOTKEY' },
    { step: '(Recommended) Run local subtensor',
      cmd: 'git clone https://github.com/opentensor/subtensor.git && cd subtensor && docker compose up --detach' },
    { step: 'Install PM2 + jq',
      cmd: 'sudo apt update && sudo apt install -y jq npm && sudo npm install pm2 -g && pm2 update' },
  ],

  runSteps: [
    { step: 'Start miner (mainnet)',
      cmd: `pm2 start --name net32-miner --interpreter python3 ./neurons/miner.py -- \\
  --wallet.name $WALLET \\
  --wallet.hotkey $HOTKEY \\
  --neuron.device cuda:0 \\
  --axon.port 70000` },
    { step: 'Verify on metagraph',
      cmd: 'btcli subnet metagraph --netuid 32' },
  ],

  envVars: [
    { name: 'WALLET', description: 'Coldkey name', required: true },
    { name: 'HOTKEY', description: 'Hotkey name', required: true },
  ],

  scoring: {
    summary:
      'Validators continuously assemble labelled batches of human-written + AI-generated text covering 30+ frontier LLMs from LLM-arena top, plus augmentations + adversarial attacks. Miner predictions are scored on AUC (ranking quality), F1 (thresholded classification), and Matthews Correlation Coefficient (balanced accuracy under class imbalance).',
    rule: 'Highest classification accuracy across the rotating fresh-LLM eval set wins. Models that nailed last-quarter detectors but never updated training data lose weight rapidly as new model families show up in the probe stream.',
    sourcePath: 'It-s-AI/llm-detection · docs/incentive.md',
    cheatPath:
      "Always-AI or always-human strategies fail MCC (one of TN/TP is zero so MCC ≈ 0). Overfitting to one validator's probe distribution is killed by multi-validator rotation. Copying another miner's detector model converges in score across the cluster — gives the copycat no advantage and can land below the floor.",
  },

  profitability: {
    estimatedDailyEmissionPerUid: 0.0,
    tokenPriceUsdFallback: 284,
    capexNote:
      'Very light infra — A4000/A5000 box at ~$0.6–$0.8/hr is enough. Real cost is engineer time refreshing training data against new LLMs.',
    notes:
      'Top miners ship fresh training data continuously — the moat is dataset curation, not compute.',
  },

  milestones: [
    { day: 'day 1',  target: 'Miner serving, UID registered',  note: 'PM2 process up, weights loaded, validators successfully querying. Incentive > 0 within one tempo (~72 min).' },
    { day: 'day 3',  target: 'Stable baseline score',          note: 'Default DeBERTa weights should put you in the lower-mid pack; survival depends on fresh data.' },
    { day: 'day 7',  target: 'First custom-trained iteration', note: 'You have fine-tuned on text from new LLMs not in the base training set. AUC noticeably above the baseline.' },
    { day: 'day 14', target: 'Out of immunity period',         note: 'Surviving deregistration; if borderline, expand LLM coverage in your training set.' },
    { day: 'day 30', target: 'Top-quartile MCC',               note: 'Consistent presence in top 25% — opex covered, R&D ROI positive.' },
  ],

  monitoring: [
    { metric: 'Axon reachability',         threshold: '> 99.5%',        where: 'curl http://<miner-ip>:70000/ from outside' },
    { metric: 'GPU memory usage',          threshold: '< 90% of VRAM',  where: 'nvidia-smi · DeBERTa-large + batched probes can spike memory' },
    { metric: 'Per-tempo incentive',       threshold: 'rising or flat', where: 'btcli subnet metagraph --netuid 32' },
    { metric: 'Subtensor RPC latency',     threshold: '< 200 ms',       where: 'pm2 logs · public RPC degrades during high load — local node helps' },
  ],

  knownIssues: [
    {
      symptom: 'Miner times out on validator probes',
      cause:   'Public Subtensor RPC under high load; chain calls add hundreds of ms per probe and inference window expires.',
      fix:     'Run a local subtensor node (docker compose) and add `--subtensor.network local` to the miner command. Documented in the mining FAQ.',
    },
    {
      symptom: 'Score collapses overnight after a new GPT/Claude release',
      cause:   'Validator added the new model family to the eval probe stream; your detector was never trained on it.',
      fix:     'Generate a few thousand samples from the new model (via API or self-hosted), label them, fine-tune the DeBERTa classifier head, redeploy. Top miners automate this pipeline.',
    },
    {
      symptom: 'OOM on the GPU after first batch',
      cause:   'Validator can send long-context probes (up to 1024 tokens) — small VRAM cards thrash.',
      fix:     'Switch to a card with ≥ 16 GB VRAM (RTX A4000+), or lower the max-sequence-length config in the miner.',
    },
    {
      symptom: "Testnet validator (UID 52) blacklists you on netuid 87",
      cause:   "Default blacklist requires minimum stake; the official testnet validator has zero stake.",
      fix:     "Add `--blacklist.minimum_stake_requirement 0` when running on testnet (netuid 87). Do NOT use this flag on mainnet.",
    },
  ],

  notes: [
    "It's AI claims SOTA on RAID (98.3%), GRiD, CUDRT, and ASAP 2.0 benchmarks per the README.",
    'Hosted product (its-ai.org, Chrome extension, X bot) is powered by the SN32 miner network — real customer traffic shapes the eval distribution.',
    'Testnet is netuid 87; official testnet validator hotkey is 5Eo4PQvU4fhGLhk91UKpAaaEH59aHsVsw2jZ6ZhRT12s6JRA (uid 52).',
  ],
};
