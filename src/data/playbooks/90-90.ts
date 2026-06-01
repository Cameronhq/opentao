import type { RichPlaybook } from '../playbook-rich';

// SN90 — Brain (DegenBrain). Decentralized truth oracle for prediction-market statements.
// Miners verify claims (true/false + evidence) using LLM-based fact-checking.

export const sn90: RichPlaybook = {
  slug: '90-90',
  netuid: 90,
  name: 'Brain',
  category: 'reason',
  categoryLabel: 'Reasoning',

  blurb:
    'Decentralized truth oracle. Miners resolve prediction-market statements with true/false verdicts plus evidence, using LLM fact-checking pipelines. Validators score multi-factor: accuracy, confidence, consistency, sources.',

  whatMinersDo:
    "A Brain miner receives statement-claims (e.g. 'Did event X happen by Y?') from validators and must return a boolean verdict, a confidence score, and supporting evidence URLs. You're free to build whatever verification pipeline you can defend — LLM-based fact-checking, search APIs, on-chain queries, scraped databases. Reputation builds over thousands of resolutions; one-shot accuracy doesn't matter, long-run calibration does.",

  verifiedAt: '2026-06-01',
  verifiedBy: '@editorial',

  emission: '— τ/day',
  burnCostFallback: '— τ',
  minerCountFallback: 0,
  slotCap: 256,

  hardware: [
    {
      role: 'CPU node',
      count: '1',
      cpuCores: 2,
      ramGb: 4,
      diskGb: 20,
      bandwidth: 'static public IP · port 8091 open',
      notes: 'No GPU needed — miner is a thin client that calls external LLM/search APIs for verification.',
    },
  ],
  hardwareNote:
    'Ubuntu 22.04 LTS recommended. Real cost is the external LLM API budget (OpenAI / Anthropic / search) rather than hardware — plan API spend per resolution carefully.',

  rentalOk: true,
  rentalUsdPerHr: { lambda: 0.10, runpod: 0.08, coreweave: 0.12 },

  repo: {
    url: 'https://github.com/degenpredict/bittensor-subnet-90-brain',
    branch: 'main',
    minerEntrypoint: 'neurons/miner.py',
  },

  setupShape: 'simple-binary',
  setupOverview:
    'Setup is a standard Bittensor Python neuron — clone, venv, install, configure .env, start under PM2. The key engineering work happens inside your verification pipeline (LLM choice, prompt design, evidence retrieval), not in the harness.',

  install: [
    { step: 'Install system dependencies',
      cmd:  'sudo apt update && sudo apt install -y python3.11 python3.11-venv git build-essential' },
    { step: 'Clone the subnet repo',
      cmd:  'git clone https://github.com/degenpredict/bittensor-subnet-90-brain && cd bittensor-subnet-90-brain' },
    { step: 'Create and activate virtualenv',
      cmd:  'python3.11 -m venv venv && source venv/bin/activate' },
    { step: 'Install Python dependencies',
      cmd:  'pip install -r requirements.txt && pip install -e .' },
    { step: 'Create coldkey + hotkey (if you don\'t already have them)',
      cmd:  'btcli wallet new_coldkey --wallet.name $WALLET && btcli wallet new_hotkey --wallet.name $WALLET --wallet.hotkey $HOTKEY' },
    { step: 'Register hotkey on SN90',
      cmd:  'btcli subnet register --netuid 90 --wallet.name $WALLET --wallet.hotkey $HOTKEY',
      note: 'Check burn-cost immediately before — registration spikes are common.' },
    { step: 'Configure .env from example',
      cmd:  'cp .env.example .env && $EDITOR .env',
      note: 'Set WALLET, HOTKEY, and your LLM provider API keys (OpenAI / Anthropic / search APIs).' },
  ],

  runSteps: [
    { step: 'Start miner under PM2',
      cmd:  'pm2 start neurons/miner.py --name sn90-miner --interpreter python3 -- --wallet.name $WALLET --wallet.hotkey $HOTKEY --netuid 90 --axon.port 8091' },
    { step: 'Tail logs',
      cmd:  'pm2 logs sn90-miner' },
    { step: 'Confirm UID on metagraph',
      cmd:  'btcli subnet metagraph --netuid 90',
      note: 'Find your hotkey, confirm UID assignment, watch incentive climb.' },
  ],

  envVars: [
    { name: 'WALLET',            description: 'Coldkey name', required: true },
    { name: 'HOTKEY',            description: 'Hotkey name',  required: true },
    { name: 'OPENAI_API_KEY',    description: 'LLM provider key for verification pipeline (or substitute)', required: false },
    { name: 'ANTHROPIC_API_KEY', description: 'Alt LLM provider key for verification', required: false },
    { name: 'SEARCH_API_KEY',    description: 'Search API for evidence retrieval (Serper, Tavily, etc.)', required: false },
  ],

  scoring: {
    summary:
      'Multi-factor scoring: Accuracy (40%) — agreement with consensus / ground truth · Confidence (20%) — appropriate confidence calibration · Consistency (30%) — agreement with peer miners · Sources (10%) — quality of evidence URLs. Random guessing regresses to 50% accuracy over hundreds of resolutions and zeros out.',
    rule: 'Build a calibrated verification pipeline. Confidence matters as much as raw verdict — over-confident wrong answers are punished harder than hedged correct ones.',
    cheatPath: "Random guessing — over hundreds of statements, accuracy regresses to 50% and miner weight collapses. Confidence-spamming max on every answer triggers the confidence-calibration penalty.",
  },

  profitability: {
    estimatedDailyEmissionPerUid: 0.0,
    tokenPriceUsdFallback: 284,
    capexNote:
      'Cheap to run on the infra side ($5-20/mo VM). Real cost is LLM API spend per resolution — model your per-claim cost carefully against expected emission.',
    notes:
      'Subnet has been flagged as low-activity by community observers in 2026 — check current metagraph health and claim volume before committing.',
  },

  milestones: [
    { day: 'day 1',  target: 'Miner registered, UID assigned',  note: 'Incentive > 0 after first tempo. Logs show statement requests arriving.' },
    { day: 'day 3',  target: 'First weight from validators',    note: 'Your verdict + confidence has been scored vs. ground truth at least once.' },
    { day: 'day 7',  target: 'Accuracy stabilizing above 60%',  note: 'Tune your verification prompt and evidence retrieval if below — refer to top miners on taostats.' },
    { day: 'day 14', target: 'Out of immunity, surviving',      note: 'Incentive above lowest non-immune. If not, your verification pipeline needs more work.' },
    { day: 'day 30', target: 'Break-even on API budget',        note: 'Daily emission ≥ daily LLM/search API spend. Watch the per-call cost ratio closely.' },
  ],

  monitoring: [
    { metric: 'Verdict accuracy',         threshold: '> 60%',         where: 'Internal pipeline metrics + cross-check on taostats' },
    { metric: 'Confidence calibration',   threshold: 'Brier < 0.25',  where: 'Internal — track confidence vs. realized correctness per resolution' },
    { metric: 'API spend per resolution', threshold: '< daily emission/calls', where: 'Provider dashboards (OpenAI / Anthropic / Serper)' },
    { metric: 'Axon reachability',        threshold: '100%',          where: 'curl http://<miner-ip>:8091/health from outside' },
    { metric: 'Per-tempo incentive',      threshold: 'rising or flat',where: 'btcli subnet metagraph --netuid 90' },
  ],

  knownIssues: [
    {
      symptom: 'Score stays low despite high accuracy',
      cause:   'Confidence miscalibrated — max confidence on every answer triggers the 20% confidence factor penalty.',
      fix:     'Output probabilistic confidence (0.5-1.0) calibrated to your actual model uncertainty. Hedge on hard claims.',
    },
    {
      symptom: 'Validators never query you',
      cause:   'Axon port 8091 closed at the firewall or wrong --axon.external_ip set.',
      fix:     '`ufw allow 8091/tcp` and confirm `btcli subnet metagraph --netuid 90` shows your axon endpoint reachable.',
    },
    {
      symptom: 'LLM API spend exceeds emission',
      cause:   'Calling premium model (GPT-4 class) on every resolution including trivial ones.',
      fix:     'Tier your pipeline: cheap model first-pass, premium only on uncertain cases. Cache common entity lookups.',
    },
  ],

  notes: [
    'Subnet flagged as low-activity by community observers in 2026 — verify claim volume on taostats before committing.',
    '$BRAIN alpha token has fee buy-back from degenpredict.com (30% of platform fees) — ties subnet economics to real product revenue.',
    'No bundled model — your verification pipeline is the entire competitive surface.',
  ],
};
