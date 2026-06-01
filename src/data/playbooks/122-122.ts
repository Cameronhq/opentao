import type { RichPlaybook } from '../playbook-rich';

// SN122 — Bitrecs. Multi-LLM product recommendation engine for Shopify/Woo.
// Miner runs `python neurons/miner.py` under PM2, routes shopper-context
// queries through one or more LLM APIs (Grok, GPT, Claude, Gemini, OpenRouter,
// Ollama, vLLM, Chutes) and returns ranked product lists.

export const sn122: RichPlaybook = {
  slug: '122-122',
  netuid: 122,
  name: 'Bitrecs',
  category: 'llm',
  categoryLabel: 'LLM · e-commerce ranking',

  blurb:
    'Multi-LLM product-recommendation engine for Shopify and WooCommerce. Miners take shopper context + catalog, fan out across LLMs, and return ranked top-K products; scored on Recall@K / NDCG@K plus live merchant lift.',

  whatMinersDo:
    "A Bitrecs miner runs `neurons/miner.py` under PM2. It listens on an axon (default port 8091) for validator queries, each carrying a shopper context and catalog slice, and returns a ranked product list. The recommended path is multi-LLM consensus — query several models (Grok 4 Fast, GPT, Claude, Gemini, OpenRouter, Ollama, vLLM, Chutes) in parallel, fuse with a prompt-engineering strategy, and emit the top-K. The compute is LLM-API-bound rather than GPU-bound on the miner side; your main cost is API spend.",

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
      ramGb: 16,
      diskGb: 50,
      bandwidth: 'public IP · port 8091 open',
      notes: 'Stated OS: Ubuntu 24.10 LTS. Python 3.12 in a venv. Node.js + PM2 for process management. ≥8 GB /tmp. No GPU required when using hosted LLMs; local Ollama / vLLM tier needs its own GPU box.',
    },
  ],
  hardwareNote:
    "Most miners use hosted LLM APIs — keep the miner node small. If you go local (Ollama / vLLM) for cost reasons, add a separate GPU box; the Bitrecs miner itself stays on a cheap VPS.",

  rentalOk: true,
  rentalUsdPerHr: { lambda: 0.10, runpod: 0.09, coreweave: 0.12 },

  repo: {
    url: 'https://github.com/bitrecs/bitrecs-subnet',
    branch: 'main',
    minerEntrypoint: 'neurons/miner.py',
  },

  setupShape: 'simple-binary',
  setupOverview:
    "Bitrecs ships a one-line installer that provisions Ubuntu 24.10, Python 3.12 venv, Node.js + PM2, opens the firewall, and clones the repo. Fill `.env` with your LLM API keys, register on SN122, and start `neurons/miner.py` under PM2 pointing at your preferred LLM (Grok 4 Fast is the documented default).",

  install: [
    { step: 'One-line installer (recommended)',
      cmd:  'curl -sL https://raw.githubusercontent.com/bitrecs/bitrecs-subnet/refs/heads/main/scripts/install_miner.sh | bash',
      note: 'Targets Ubuntu 24.10 LTS. Installs Python 3.12, venv, Node.js, PM2, ufw rules for port 8091, clones the repo.' },
    { step: 'Manual: clone and install',
      cmd:  'git clone https://github.com/bitrecs/bitrecs-subnet && cd bitrecs-subnet && python3 -m pip install -e .' },
    { step: 'Install Node.js + PM2',
      cmd:  'npm install -g pm2',
      note: 'PM2 is the documented process manager. Required for the run command below.' },
    { step: 'Copy and fill .env from the example',
      cmd:  'cp .env.dev.example .env',
      note: 'Set at least one LLM API key. Grok / OpenRouter / Chutes are the lowest-friction options.' },
    { step: 'Open firewall port',
      cmd:  'sudo ufw allow 8091/tcp',
      note: 'Customize via --axon.port if you change ports.' },
    { step: 'Register hotkey on SN122',
      cmd:  'btcli subnet register --netuid 122 --wallet.name $WALLET --wallet.hotkey $HOTKEY',
      note: 'Re-check burn cost on taostats.io/subnets/122 immediately before this.' },
  ],

  runSteps: [
    { step: 'Start the miner under PM2',
      cmd: `pm2 start ./neurons/miner.py --name miner --interpreter python3 -- \\
  --netuid 122 --subtensor.network finney \\
  --wallet.name $WALLET --wallet.hotkey $HOTKEY \\
  --llm.model x-ai/grok-4-fast --verified.inference \\
  --axon.port 8091`,
      note: 'Documented launch command. Swap --llm.model for any supported provider/model.' },
    { step: 'Tail logs',
      cmd:  'pm2 logs miner',
      note: 'You should see DendriteForward requests landing within a tempo (~72 min).' },
    { step: 'Verify on the metagraph',
      cmd:  'btcli subnet metagraph --netuid 122',
      note: "Confirm UID assignment, axon serving, and incentive starting to climb." },
  ],

  envVars: [
    { name: 'WALLET',             description: 'Coldkey name (matches btcli wallet list)',          required: true },
    { name: 'HOTKEY',             description: 'Hotkey name on that coldkey',                       required: true },
    { name: 'OPENROUTER_API_KEY', description: 'OpenRouter key (multi-model gateway)',              required: false },
    { name: 'CHATGPT_API_KEY',    description: 'OpenAI / ChatGPT API key',                          required: false },
    { name: 'GROK_API_KEY',       description: 'xAI / Grok key (default --llm.model is grok-4-fast)', required: false },
    { name: 'GEMINI_API_KEY',     description: 'Google Gemini key',                                 required: false },
    { name: 'CHUTES_API_KEY',     description: 'Chutes (SN64) inference key',                       required: false },
    { name: 'OLLAMA_LOCAL_URL',   description: 'Local Ollama endpoint if running models on-box',    required: false },
    { name: 'VLLM_API_KEY',       description: 'vLLM endpoint key if self-hosting',                 required: false },
  ],

  scoring: {
    summary:
      "Validators issue shopper-context queries against labelled evaluation sets and shadowed live-store traffic, then grade returned rankings on Recall@K and NDCG@K. Live merchant outcomes — conversion rate, AOV, CLV — feed back into the scoring loop, tethering on-chain rewards to actual revenue lift rather than synthetic benchmarks.",
    rule: 'Return rankings that maximise Recall@K, NDCG@K, and downstream lift on live merchants.',
    cheatPath:
      "Recommending bestsellers regardless of context wins on click-through but loses on NDCG@K and downstream lift, so it drops out fast. Wrapping a single cheap LLM rarely beats a tuned multi-model consensus stack. Sybil farms across many hotkeys are bounded by registration burn and validator-side de-duplication.",
  },

  profitability: {
    estimatedDailyEmissionPerUid: 0.0,
    tokenPriceUsdFallback: 284,
    capexNote:
      'Capex is near-zero. Opex is dominated by LLM API spend — budget per-1K-tokens against expected query volume. Grok 4 Fast / OpenRouter routes are typically cheaper than direct OpenAI/Anthropic.',
    notes:
      'Top miners differentiate on prompt strategy + multi-model fusion, not GPU. A solo dev with good prompt engineering can compete against larger operators here.',
  },

  milestones: [
    { day: 'day 1',  target: 'Installer finished, axon serving',
      note: 'pm2 logs shows the miner accepting validator queries. UID assigned.' },
    { day: 'day 3',  target: 'First non-zero incentive',
      note: 'NDCG@K above the floor. If still zero, the LLM model may be timing out — check --llm.model and API quotas.' },
    { day: 'day 7',  target: 'Out of immunity, surviving',
      note: 'Incentive above the lowest non-immune miner. Switch models or add a second provider if you sit at the floor.' },
    { day: 'day 14', target: 'Live-traffic shadow scoring kicks in',
      note: 'Merchant outcomes start feeding back. Stable miners with good lift see incentive lift here.' },
    { day: 'day 30', target: 'Break-even on API spend',
      note: 'Daily emission ≥ daily LLM bill. If not, drop expensive providers or tune the consensus weights.' },
  ],

  monitoring: [
    { metric: 'Axon serving on 8091',     threshold: '100%',          where: 'curl http://<miner-ip>:8091/ from outside' },
    { metric: 'Validator query rate',     threshold: '> 0 per tempo', where: 'pm2 logs miner — count "DendriteForward"' },
    { metric: 'LLM API error rate',       threshold: '< 1%',          where: 'pm2 logs miner — search "API error"' },
    { metric: 'Per-tempo incentive',      threshold: 'rising or flat',where: 'btcli subnet metagraph --netuid 122' },
    { metric: '/tmp disk free',           threshold: '> 4 GB',        where: 'df -h /tmp' },
  ],

  knownIssues: [
    {
      symptom: 'Miner runs but incentive stays at 0',
      cause:   'LLM API key missing/invalid, or chosen model returns empty rankings.',
      fix:     'Verify env vars are loaded by PM2 (`pm2 env <id>`). Switch --llm.model to a known-good route like x-ai/grok-4-fast via OpenRouter.',
    },
    {
      symptom: 'Validator queries arrive but responses time out',
      cause:   "LLM call latency exceeds the synapse deadline (typically a few seconds).",
      fix:     'Use a faster model (grok-4-fast, gpt-4o-mini, gemini-flash). Add a timeout-and-fallback path in the multi-LLM fusion code.',
    },
    {
      symptom: 'Validator can\'t reach axon',
      cause:   "Port 8091 closed at the cloud firewall or upstream NAT.",
      fix:     'ufw allow 8091/tcp on the miner box and on any upstream security group. Test from a different network: curl http://<miner-ip>:8091/.',
    },
    {
      symptom: 'API bill outruns emission',
      cause:   "Routing every query through expensive OpenAI / Anthropic endpoints.",
      fix:     'Switch the default --llm.model to a cheaper Grok / OpenRouter / Chutes route. Reserve premium models for high-value query types.',
    },
  ],

  notes: [
    'Hardware bar is low — the differentiator is prompt engineering plus multi-LLM consensus, not GPU.',
    'Bitrecs publishes commercial metrics: ~130 paying merchants, ~$32 ARPU, ~1% AOV lift today against a 2-5%+ target. Live merchant traction is part of scoring.',
    'Default --llm.model x-ai/grok-4-fast in the README is a hint about what the team currently considers a balanced cost/quality baseline.',
    'Shopify App Store listing at apps.shopify.com/bitrecs-ai-recommendations is the buyer surface — miners power that app.',
  ],
};
