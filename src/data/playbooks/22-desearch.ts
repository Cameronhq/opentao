import type { RichPlaybook } from '../playbook-rich';

// SN22 — Desearch (Datura Labs). Real-time search across X, web, Reddit,
// arXiv. Miners run a single Bittensor axon (`neurons/miners/miner.py`)
// behind PM2 and answer IsAlive + search synapses; concurrency is set in
// a manifest.json file.

export const sn22: RichPlaybook = {
  slug: '22-desearch',
  netuid: 22,
  name: 'Desearch',
  category: 'data',
  categoryLabel: 'Search / retrieval',

  blurb:
    'Answer X, web, Reddit, and arXiv search synapses behind a single Bittensor axon. Concurrency is declared in `manifest.json`; validators score against independent providers.',

  whatMinersDo:
    "A Desearch miner runs a single Bittensor axon (`neurons/miners/miner.py`) that answers IsAlive pings and search synapses across X, web, Reddit, and arXiv. You declare your concurrency limits in `neurons/miners/manifest.json` (e.g. `web_search: 20` means with 12 active validators you might see up to 240 concurrent requests). Validators send both synthetic and organic queries, verify results with independent providers, store rolling scoring windows, and write weights on-chain.",

  verifiedAt: '2026-06-01',
  verifiedBy: '@editorial',

  emission: '— τ/day',
  burnCostFallback: '— τ',
  minerCountFallback: 0,
  slotCap: 256,

  hardware: [
    {
      role: 'Miner box (CPU)',
      count: '1',
      cpuCores: 8,
      ramGb: 16,
      diskGb: 100,
      bandwidth: '1 Gbps + reliable outbound to search APIs',
      notes: 'Python ≥ 3.10. No GPU required. PM2 for process supervision.',
    },
  ],
  hardwareNote:
    'Real cost is API credits — SerpAPI, OpenAI, Apify, and (optional) Twitter Bearer. The manifest concurrency setting directly controls your monthly API bill.',

  rentalOk: true,
  rentalUsdPerHr: { lambda: 0.1, runpod: 0.08 },

  repo: {
    url: 'https://github.com/Datura-ai/desearch',
    branch: 'main',
    minerEntrypoint: 'neurons/miners/miner.py',
  },

  setupShape: 'simple-binary',
  setupOverview:
    "Clone the desearch repo, pip-install, copy `.env.template` and fill API keys, write a `manifest.json` declaring per-synapse concurrency, then run the miner under PM2.",

  install: [
    { step: 'Clone the desearch repo',
      cmd:  'git clone https://github.com/Datura-ai/desearch.git && cd desearch' },
    { step: 'Install requirements + the package',
      cmd:  'python3 -m pip install -r requirements.txt && python3 -m pip install -e .' },
    { step: 'Configure the miner .env from the template',
      cmd:  'cp neurons/miners/.env.template neurons/miners/.env',
      note: 'Fill OPENAI_API_KEY, APIFY_API_KEY, SERPAPI_API_KEY, optional TWITTER_BEARER_TOKEN. Full reference in env_variables.md.' },
    { step: 'Create your concurrency manifest',
      cmd:  'cp neurons/miners/manifest.template.json neurons/miners/manifest.json',
      note: 'Per-synapse limits (e.g. web_search, twitter_search). With ~12 active validators, multiply by 12 to estimate peak load.' },
    { step: 'Install PM2 (Node-based process manager)',
      cmd:  'npm install -g pm2' },
    { step: 'Register on SN22 (mainnet) or SN41 (testnet)',
      cmd:  'btcli subnet register --netuid 22 --wallet.name $WALLET --wallet.hotkey $HOTKEY' },
  ],

  runSteps: [
    { step: 'Start the miner (option A — env-file driven)',
      cmd:  'pm2 start neurons/miners/miner.py \\\n  --interpreter /usr/bin/python3 \\\n  --name desearch_miner' },
    { step: 'Or with explicit CLI flags',
      cmd:  'pm2 start neurons/miners/miner.py \\\n  --interpreter /usr/bin/python3 \\\n  --name desearch_miner \\\n  -- \\\n  --wallet.name miner \\\n  --wallet.hotkey default \\\n  --subtensor.network finney \\\n  --netuid 22 \\\n  --axon.port 14000' },
    { step: 'Watch logs',
      cmd:  'pm2 logs desearch_miner' },
  ],

  envVars: [
    { name: 'WALLET',              description: 'Coldkey name',                                             required: true },
    { name: 'HOTKEY',              description: 'Hotkey name registered on netuid 22',                      required: true },
    { name: 'OPENAI_API_KEY',      description: 'Used for reranking / synthesis steps',                     required: true },
    { name: 'APIFY_API_KEY',       description: 'Used for X / Reddit scraping via Apify actors',            required: true },
    { name: 'SERPAPI_API_KEY',     description: 'Used for general web search',                              required: true },
    { name: 'TWITTER_BEARER_TOKEN',description: 'Optional — improves X search quality if available',        required: false },
  ],

  scoring: {
    summary:
      "Validators send a mix of synthetic and organic search queries to miners across X, web, Reddit, and arXiv, then verify the returned results with independent providers (re-running the same queries themselves). Scores accumulate over a rolling window in `neurons/validators/scoring/` and weights are written on-chain.",
    rule: 'Authentic, fresh, and relevant search results that match independent re-fetches by the validator.',
    sourcePath: 'Datura-ai/desearch · neurons/validators/scoring/',
    cheatPath:
      "Fabricating results is detected on independent re-fetch. Stale-caching kills freshness. Returning empty for under-spec queries is fine; over-promising concurrency in manifest.json but timing out is worse than declaring a low limit.",
  },

  profitability: {
    estimatedDailyEmissionPerUid: 0,
    tokenPriceUsdFallback: 284,
    capexNote:
      'No GPU. Real cost is SerpAPI + Apify + OpenAI credits — typically $100–$500/mo depending on concurrency. Tune manifest.json to balance throughput with monthly burn.',
    notes:
      "Desearch also serves a public API at console.desearch.ai — buyer demand on that side influences emission share.",
  },

  milestones: [
    { day: 'day 1', target: 'Axon answering IsAlive + search synapses', note: '`pm2 logs desearch_miner` shows incoming synapses being answered with non-empty results.' },
    { day: 'day 3', target: 'Stable response p50 < 2 s', note: 'Validator scoring punishes long tails — keep the slowest 10% of responses bounded.' },
    { day: 'day 7', target: 'Match independent verification', note: 'If validators are flagging discrepancies, the scraper outputs are drifting from the live source.' },
    { day: 'day 14', target: 'Out of immunity, stable rank', note: 'Use the concurrency knob — bigger manifest concurrency = bigger upside but bigger bill.' },
  ],

  monitoring: [
    { metric: 'PM2 status',                    threshold: 'online',         where: 'pm2 status' },
    { metric: 'Search synapse error rate',     threshold: '< 5%',           where: 'pm2 logs desearch_miner' },
    { metric: 'API credit balance (SerpAPI/Apify)', threshold: '> 7-day buffer', where: 'Provider dashboards' },
    { metric: 'Axon port reachability',        threshold: '100%',           where: 'curl http://<ip>:14000/ from outside' },
    { metric: 'Incentive per tempo',           threshold: 'rising or flat', where: 'btcli subnet metagraph --netuid 22' },
  ],

  knownIssues: [
    {
      symptom: 'Validators time-out talking to your miner',
      cause:   'manifest.json concurrency too high — your machine is saturated and slow.',
      fix:     'Halve the per-synapse concurrency, monitor p50/p99, then climb back up.',
    },
    {
      symptom: 'SerpAPI or Apify rate-limit errors',
      cause:   'Single API key handling all traffic.',
      fix:     'Split traffic across multiple keys or rotate providers (SerpAPI ↔ Bing ↔ alternatives if supported).',
    },
    {
      symptom: 'Independent verification reports mismatch',
      cause:   'Stale local cache or scraper returning a different result set than a fresh call would.',
      fix:     'Disable any in-process result caching beyond a few seconds. Verify by running the same query yourself and comparing.',
    },
    {
      symptom: 'Axon binds but validators never call',
      cause:   'Port closed at cloud firewall or BLACKLIST gating excluding live validators.',
      fix:     "Open --axon.port externally and confirm with `curl`. Re-check any custom blacklist in `neurons/miners/config.py`.",
    },
  ],

  notes: [
    'Repo: https://github.com/Datura-ai/desearch (MIT). Miner walkthrough: docs/running_a_miner.md.',
    'Public Desearch API console: https://console.desearch.ai — useful to compare your miner output against the official endpoint.',
    'Testnet is netuid 41. Use it to validate the manifest before paying mainnet registration burn.',
    'Subnet release cadence is fast — last referenced runtime in v0.0.188 (2025·07).',
  ],
};
