import type { RichPlaybook } from '../playbook-rich';

// SN45 — Talisman AI. Perception layer for crypto signals. Miners classify
// tweet batches across sentiment + content-type + impact dimensions using an
// LLM; validators re-analyze a sampled subset and require exact matches.

export const sn45: RichPlaybook = {
  slug: '45-talisman-ai',
  netuid: 45,
  name: 'Talisman AI',
  category: 'llm',
  categoryLabel: 'Social Signal / LLM',

  blurb:
    'Perception layer for crypto signals on Bittensor. Miners classify X/Twitter tweet batches across six dimensions (subnet_id, sentiment, content_type, technical_quality, market_analysis, impact_potential) using an LLM; validators re-analyze sampled subsets and demand exact matches.',

  whatMinersDo:
    "A miner runs neurons/miner.py and receives batches of tweets from validators. For each tweet, the miner queries its chosen LLM (DeepSeek-V3 default) and returns a structured classification: which Bittensor subnet the tweet is about, sentiment polarity, content type, technical quality, market-analysis tag, and impact potential. The validator independently re-analyzes a random sample of the batch using the same rubric; if your labels match exactly on the sampled tweets, the entire batch is accepted (+1 per accepted tweet); if not, the batch is rejected and the miner is penalized for that epoch.",

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
      diskGb: 30,
      bandwidth: '100 Mbps',
      notes: 'No GPU needed — inference is outsourced to a remote LLM API (DeepSeek / OpenAI-compatible). The miner box is essentially an LLM-API proxy with Bittensor wiring.',
    },
  ],
  hardwareNote:
    'V3 miners outsource inference to a managed LLM endpoint. Your cost center is API spend, not GPU rental. No X/Twitter API credentials are required for V3 miners — validators supply the tweet batches.',

  rentalOk: true,
  rentalUsdPerHr: { lambda: 0.10, runpod: 0.08, coreweave: 0.12 },

  repo: {
    url: 'https://github.com/Team-Rizzo/talisman-ai',
    branch: 'main',
  },

  setupShape: 'simple-binary',
  setupOverview:
    'Clone, pip install -r requirements.txt and pip install -e ., copy .miner_env_tmpl to .miner_env and fill in MODEL, API_KEY, LLM_BASE. Then run neurons.miner with the standard Bittensor flags. The whole stack is a thin LLM-proxy around the Bittensor axon.',

  install: [
    { step: 'Clone the repo',
      cmd:  'git clone https://github.com/Team-Rizzo/talisman-ai && cd talisman-ai' },
    { step: 'Install requirements',
      cmd:  'pip install -r requirements.txt && pip install -e .' },
    { step: 'Copy miner env template',
      cmd:  'cp .miner_env_tmpl .miner_env',
      note: 'Edit .miner_env with MODEL (e.g. deepseek-ai/DeepSeek-V3-0324), API_KEY, LLM_BASE.' },
    { step: 'Register your hotkey on SN45',
      cmd:  'btcli subnet register --netuid 45 --wallet.name $WALLET --wallet.hotkey $HOTKEY' },
  ],

  runSteps: [
    { step: 'Start the miner',
      cmd:  `.venv/bin/python -m neurons.miner \\
  --netuid 45 \\
  --wallet.name $WALLET \\
  --wallet.hotkey $HOTKEY \\
  --logging.info`,
      note: 'Optional: --axon.external_port and --axon.external_ip if behind NAT.' },
    { step: 'Verify',
      cmd:  'btcli subnet metagraph --netuid 45' },
  ],

  envVars: [
    { name: 'WALLET',   description: 'Bittensor coldkey name',                                    required: true },
    { name: 'HOTKEY',   description: 'Bittensor hotkey name',                                     required: true },
    { name: 'MODEL',    description: 'LLM model identifier (e.g. deepseek-ai/DeepSeek-V3-0324)',  required: true },
    { name: 'API_KEY',  description: 'LLM API key',                                               required: true },
    { name: 'LLM_BASE', description: 'OpenAI-compatible base URL of the LLM API',                 required: true },
  ],

  scoring: {
    summary:
      'Per-batch validation. The validator picks a random sample from your returned batch, re-classifies those tweets independently using the same rubric, and demands EXACT matches on all six fields: subnet_id, sentiment, content_type, technical_quality, market_analysis, impact_potential. Batch passes → +1 per accepted tweet. Batch fails → epoch penalty.',
    rule: 'Use a model strong enough on multi-dimensional classification (DeepSeek-V3 is the documented default). Prompt-engineer for consistency on the six dimensions — borderline cases must match the validator\'s reading. Throughput matters: more accepted batches per epoch = more score.',
    cheatPath:
      "Don't pick a cheap weak model — exact-match validation punishes inconsistent labelers. Don't hand-craft labels on a subset and call the rest random — the sample is random across the whole batch and one mismatch sinks the batch. Don't bake stale prompts — rubric drift between versions = silent batch rejection.",
  },

  profitability: {
    estimatedDailyEmissionPerUid: 0.0,
    tokenPriceUsdFallback: 284,
    capexNote: 'Low hardware capex. Real cost is LLM API spend — model your $/1k-tokens against expected daily batch volume before scaling.',
  },

  milestones: [
    { day: 'day 1', target: 'Miner registered, .miner_env wired, batches arriving',
      note: 'Tail logs to confirm validators are dispatching to your axon.' },
    { day: 'day 3', target: 'Acceptance rate > 80%',
      note: 'If below, tighten the system prompt on the six dimensions — particularly market_analysis and impact_potential, which are the most subjective.' },
    { day: 'day 7', target: 'Weight rising consistently',
      note: 'Top miners likely run DeepSeek-V3 or stronger with a tuned prompt template.' },
  ],

  monitoring: [
    { metric: 'Batch acceptance rate',  threshold: '> 80%',    where: 'miner logs / W&B' },
    { metric: 'LLM API cost per epoch', threshold: '< emission value', where: 'API provider dashboard · keep this in profit' },
    { metric: 'Hash mismatch on install', threshold: '0',      where: 'pip / .venv build logs' },
    { metric: 'Per-tempo incentive',    threshold: 'rising',   where: 'btcli subnet metagraph --netuid 45' },
  ],

  knownIssues: [
    {
      symptom: 'pip install hash mismatch errors',
      cause:   'Stale wheel cache from a previous environment.',
      fix:     '`.venv/bin/python -m pip cache purge` and retry the install.',
    },
    {
      symptom: 'Acceptance rate stuck near zero',
      cause:   'Weak LLM or poorly-tuned prompt — borderline tweets disagree with the validator\'s rubric.',
      fix:     'Upgrade to the documented default model (DeepSeek-V3 family). Anchor the prompt with explicit category definitions and 2-3 few-shot examples per dimension.',
    },
    {
      symptom: 'Earnings flat despite passing batches',
      cause:   'Low batch volume — validators only send so many per epoch per miner.',
      fix:     'Ensure axon reachability (open inbound port) and high uptime — the more validators that can reach you, the more batches you receive.',
    },
  ],

  notes: [
    'V3 miners do NOT need X/Twitter API credentials. The validators supply tweets.',
    'Multi-dimensional exact-match validation makes prompt engineering a real differentiator. Reuse a fixed system prompt across all batches.',
  ],
};
