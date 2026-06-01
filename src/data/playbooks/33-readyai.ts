import type { RichPlaybook } from '../playbook-rich';

// SN33 — ReadyAI (Conversation Genome Project). Operated by Afterparty AI.
// Miners annotate raw conversation/document chunks into structured JSON
// using LLM APIs (OpenAI GPT-4o default, Anthropic / OpenRouter / Chutes
// supported). Scoring is cosine-distance between miner tag-set and
// validator ground-truth tag-set.

export const sn33: RichPlaybook = {
  slug: '33-readyai',
  netuid: 33,
  name: 'ReadyAI',
  category: 'data',
  categoryLabel: 'Data Annotation',

  blurb:
    'Structured data annotation at scale — miners turn raw text/PDFs/conversations into AI-ready tagged JSON via LLM APIs. Cosine-distance scoring against validator ground truth. ~660x cheaper than MTurk per team benchmarks.',

  whatMinersDo:
    "A ReadyAI miner runs `neurons/miner.py` on a modest CPU host (no local GPU required — annotation is done by calling external LLM APIs). The validator picks a chunk of raw conversation/document data, breaks it into windows, and dispatches windows to miners with a tagging schema. The miner calls its configured LLM (GPT-4o by default — Anthropic, OpenRouter, or Chutes API also supported via `LLM_TYPE_OVERRIDE`), generates tags + annotations + embeddings for the window, and returns the structured JSON. Validators score the miner's tags against a full-conversation ground-truth tag-set using cosine distance over tag embeddings.",

  verifiedAt: '2026-06-01',
  verifiedBy: '@editorial',

  emission: '— τ/day',
  burnCostFallback: '— τ',
  minerCountFallback: 0,
  slotCap: 256,

  hardware: [
    {
      role: 'CPU host',
      count: '1',
      cpuCores: 4,
      ramGb: 8,
      diskGb: 20,
      bandwidth: 'reliable outbound to OpenAI/Anthropic API · 100 Mbps',
      notes: 'No GPU required — annotation is done via external LLM API calls. The miner is essentially a Bittensor-aware API router.',
    },
  ],
  hardwareNote:
    'Compute cost is in the LLM API bill (OpenAI GPT-4o or similar), not local hardware. The cheaper-and-still-accurate-enough provider tradeoff is the main optimization knob — many miners use Chutes (deepseek-ai/DeepSeek-V3 via chutes provider) for cost.',

  rentalOk: true,
  rentalUsdPerHr: { lambda: 0.10, runpod: 0.08, coreweave: 0.12 },

  repo: {
    url: 'https://github.com/afterpartyai/bittensor-conversation-genome-project',
    branch: 'main',
    minerEntrypoint: 'neurons/miner.py',
  },

  setupShape: 'simple-binary',
  setupOverview:
    'Clone the conversation-genome repo, install Python requirements, copy env.example to .env, fill in OpenAI API key (or override to Anthropic / OpenRouter / Chutes), add Weights-and-Biases key, register on netuid 33, and run the miner. Docker and Runpod templates are also documented in the repo.',

  install: [
    { step: 'Clone repo',
      cmd: 'git clone https://github.com/afterpartyai/bittensor-conversation-genome-project.git cgp-subnet && cd cgp-subnet' },
    { step: 'Install requirements',
      cmd: 'pip install -r requirements.txt' },
    { step: 'Copy env template',
      cmd: 'cp env.example .env' },
    { step: 'Set OPENAI_API_KEY (or alternative LLM)',
      note: "GPT-4o is the default. To override: uncomment `LLM_TYPE_OVERRIDE=anthropic` / `openrouter` / `chutes` in .env and add the corresponding API key (ANTHROPIC_API_KEY / OPENROUTER_API_KEY / CHUTES_API_KEY). For Chutes-routed DeepSeek-V3, set CHUTES_MODEL=deepseek-ai/DeepSeek-V3." },
    { step: 'Set Weights and Biases key',
      note: 'WANDB_API_KEY is required by both miners and validators (per README).' },
    { step: 'Run mock loop test to verify wiring',
      cmd: 'python3 -m venv test_venv && source test_venv/bin/activate && pip install -r requirements_test.txt && python -m pytest -s --disable-warnings tests/test_full_loop.py' },
    { step: 'Register on SN33',
      cmd: 'btcli subnet register --netuid 33 --wallet.name $WALLET --wallet.hotkey $HOTKEY' },
  ],

  runSteps: [
    { step: 'Start miner (mainnet)',
      cmd: 'python3 -m neurons.miner --netuid 33 --wallet.name $WALLET --wallet.hotkey $HOTKEY --axon.port <port>' },
    { step: '(Optional) Run under PM2 for restart-on-crash',
      cmd: 'pm2 start --name sn33-miner --interpreter python3 -m neurons.miner -- --netuid 33 --wallet.name $WALLET --wallet.hotkey $HOTKEY --axon.port <port>' },
    { step: 'Verify on metagraph',
      cmd: 'btcli subnet metagraph --netuid 33' },
  ],

  envVars: [
    { name: 'WALLET',                 description: 'Coldkey name',                                                       required: true },
    { name: 'HOTKEY',                 description: 'Hotkey name',                                                        required: true },
    { name: 'OPENAI_API_KEY',         description: 'OpenAI key — required for default GPT-4o annotation backend',         required: true },
    { name: 'WANDB_API_KEY',          description: 'Weights and Biases key — required by miner per README',                required: true },
    { name: 'LLM_TYPE_OVERRIDE',      description: 'Optional: anthropic | openrouter | chutes to switch backend',          required: false },
    { name: 'ANTHROPIC_API_KEY',      description: 'Required if LLM_TYPE_OVERRIDE=anthropic',                              required: false },
    { name: 'OPENROUTER_API_KEY',     description: 'Required if LLM_TYPE_OVERRIDE=openrouter',                             required: false },
    { name: 'CHUTES_API_KEY',         description: 'Required if LLM_TYPE_OVERRIDE=chutes (routes to e.g. DeepSeek-V3)',    required: false },
    { name: 'COMMITMENT_PRIVATE_KEY', description: 'Decrypts encrypted miner endpoint commitments. Provided securely for mainnet; testnet key included in env.example.', required: true },
  ],

  scoring: {
    summary:
      "Validator establishes ground truth by tagging the full conversation, creates windows, sends each window to miners. Miner returns tags + embeddings; validator scores via cosine distance between the miner's window tag-set and the full-conversation ground-truth tag-set. Penalty applied if no overlap with 'both' tags.",
    rule: 'Maximize cosine similarity between your generated tags and the validator ground-truth tags. Schema compliance, coverage of all required fields, and accuracy of labels all matter.',
    sourcePath: 'afterpartyai/bittensor-conversation-genome-project · neurons + evaluator.py',
    cheatPath:
      "Echoing template JSON without truly reading the chunk is caught by content-aware cosine scoring. Fabricating plausible labels is caught by ground-truth comparison. Sybil farms running one annotation LLM converge in scores and gain nothing from copies. Skipping required tag types triggers the 'No BOTH tags' penalty visible in evaluator logs.",
  },

  profitability: {
    estimatedDailyEmissionPerUid: 0.0,
    tokenPriceUsdFallback: 284,
    capexNote:
      'No GPU capex — host runs ~$10/mo on Hetzner CX22. Variable cost is the LLM API bill, which depends on validator probe rate. Many miners use Chutes for DeepSeek-V3 at a fraction of GPT-4o cost.',
    notes:
      'Switching from GPT-4o to Chutes/DeepSeek-V3 cuts variable cost dramatically but can hurt accuracy on some schemas — test on the mock loop before deploying.',
  },

  milestones: [
    { day: 'day 1',  target: 'Mock loop test passes, miner registered', note: '`pytest tests/test_full_loop.py` shows scoring > 0; metagraph shows UID with non-zero incentive within one tempo.' },
    { day: 'day 3',  target: 'Stable scoring across validators',         note: 'Multiple validators querying, cosine scores in the 0.3–0.5 range (per example logs).' },
    { day: 'day 7',  target: 'Optimized LLM backend',                    note: 'Tested at least one alternative (Chutes/DeepSeek-V3) and picked the best cost/score tradeoff for the current schema.' },
    { day: 'day 14', target: 'Out of immunity period',                   note: 'Surviving deregistration; LLM bill ≤ emission revenue.' },
    { day: 'day 30', target: 'Profitable on API cost',                   note: 'Daily LLM API spend is comfortably below daily emission revenue.' },
  ],

  monitoring: [
    { metric: 'LLM API success rate',          threshold: '> 99%',        where: 'pm2 logs · OpenAI/Chutes errors block scoring' },
    { metric: 'Cosine similarity per window',  threshold: '> 0.35',       where: 'evaluator logs · "ADJ SCORE" field' },
    { metric: 'COMMITMENT_PRIVATE_KEY set',    threshold: 'present',      where: 'env · validators need it to decrypt miner endpoints' },
    { metric: 'Per-tempo incentive',           threshold: 'rising or flat', where: 'btcli subnet metagraph --netuid 33' },
    { metric: 'Daily API spend',               threshold: '< daily emission USD', where: 'OpenAI billing dashboard · most important profitability metric' },
  ],

  knownIssues: [
    {
      symptom: 'No BOTH tags penalty in scoring logs',
      cause:   "Miner only returned single-category tags; validator expects entries in the 'BOTH' tag-set that overlap with the full-convo ground truth.",
      fix:     "Inspect MinerLib.py output to confirm tag categorization; ensure the LLM prompt asks for tags across all required categories, not just topic/sentiment.",
    },
    {
      symptom: 'Miner registered but never queried by validators',
      cause:   "Encrypted endpoint commitment is malformed because COMMITMENT_PRIVATE_KEY is missing or wrong.",
      fix:     "For testnet, copy the key from env.example. For mainnet, request the securely-distributed key from the operator and set it in .env before starting the miner.",
    },
    {
      symptom: 'OpenAI rate-limit errors during high validator probe load',
      cause:   'Free / low-tier OpenAI accounts are capped; SN33 probe rate can burst.',
      fix:     'Upgrade OpenAI plan tier, OR switch to Chutes/OpenRouter which have less restrictive rate limits at lower per-token cost.',
    },
    {
      symptom: 'Daily LLM bill exceeds daily emission',
      cause:   'Default config is GPT-4o which is the most expensive backend.',
      fix:     'Switch LLM_TYPE_OVERRIDE to chutes with CHUTES_MODEL=deepseek-ai/DeepSeek-V3 and OPENROUTER_PROVIDER_PREFERENCE=chutes. Test on the mock loop to confirm score holds.',
    },
  ],

  notes: [
    'Testnet netuid is 138; mainnet is 33. Always validate on testnet before deploying mainnet to avoid wasted registration fees.',
    'Docker images are available — see the README "Get Running Quickly with the Docker Image!" section.',
    'API exposes /metrics for Prometheus scraping (api_requests_total counter).',
  ],
};
