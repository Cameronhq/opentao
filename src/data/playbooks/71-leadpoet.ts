import type { RichPlaybook } from '../playbook-rich';

// SN71 — Leadpoet. Operated by Gavin Zaentz + Pranav Ramesh.
// Decentralized B2B lead generation. Miners can submit either trained models
// (compete against a daily reference baseline) or fulfill ICP requests directly.

export const sn71: RichPlaybook = {
  slug: '71-leadpoet',
  netuid: 71,
  name: 'Leadpoet',
  category: 'data',
  categoryLabel: 'Data',

  blurb:
    'Decentralized B2B lead generation. Miners run scraping/AI pipelines against ICPs (or submit lead-scoring models) and earn TAO per validator-verified, deduplicated lead.',

  whatMinersDo:
    "A Leadpoet miner runs `python neurons/miner.py` against netuid 71. Two reward tracks: a model-competition track (a packaged ≤200KB tarball that must beat max(today's reference baseline + 10, 20.0) on 20 ICPs within 320s and $10 of API spend) and a fulfillment track (return verified ICP-matched lead batches with strict schema; each winning lead earns 0.05% of emission per epoch for 100 epochs). Validators score deliverability, ICP fit, role accuracy, required attributes, and dedupe across miners.",

  verifiedAt: '2026-06-01',
  verifiedBy: '@editorial',

  emission: '— τ/day',
  burnCostFallback: '— τ',
  minerCountFallback: 218,
  slotCap: 256,

  hardware: [
    {
      role: 'Miner node',
      count: '1',
      cpuCores: 4,
      ramGb: 8,
      diskGb: 50,
      bandwidth: 'Stable outbound; proxy budget per ICP run',
      notes: 'No GPU. Variable per model; validators are heavier (64GB RAM, 8-core, 100GB SSD, AWS Nitro Enclaves) — miners can run light.',
    },
  ],
  hardwareNote:
    'Miner hardware scales with strategy. Pipeline cost matters more than compute: each 20-ICP evaluation has a $10 API spend cap and 320s per-ICP timeout.',

  rentalOk: true,
  rentalUsdPerHr: { lambda: 0.10, runpod: 0.08, coreweave: 0.12 },

  repo: {
    url: 'https://github.com/leadpoet/leadpoet',
    branch: 'main',
    minerEntrypoint: 'neurons/miner.py',
  },

  setupShape: 'simple-binary',
  setupOverview:
    'Clone the repo, create a venv, `pip install -e .`, copy `env.example` to `.env`, register on netuid 71, then start `python neurons/miner.py`. Optional: subscribe to Truelist (email validation), ScrapingDog (LinkedIn), and Companies House for reputation enrichment.',

  install: [
    { step: 'Clone repo',
      cmd: 'git clone https://github.com/leadpoet/leadpoet.git && cd leadpoet' },
    { step: 'Create venv',
      cmd: 'python3 -m venv venv && source venv/bin/activate' },
    { step: 'Install dependencies',
      cmd: 'pip install --upgrade pip && pip install -e .' },
    { step: 'Copy env file',
      cmd: 'cp env.example .env',
      note: 'Fill Truelist API key, ScrapingDog key, Companies House key (optional), wallet info.' },
    { step: 'Register on subnet',
      cmd: 'btcli subnet register --netuid 71 --subtensor.network finney --wallet.name $WALLET --wallet.hotkey $HOTKEY' },
  ],

  runSteps: [
    { step: 'Start miner',
      cmd: `python neurons/miner.py \\
  --wallet_name $WALLET \\
  --wallet_hotkey $HOTKEY \\
  --wallet_path <your_wallet_path> \\
  --netuid 71 \\
  --subtensor_network finney` },
  ],

  envVars: [
    { name: 'WALLET',             description: 'Coldkey name (--wallet_name)',                                     required: true },
    { name: 'HOTKEY',             description: 'Hotkey name (--wallet_hotkey)',                                    required: true },
    { name: 'TRUELIST_API_KEY',   description: 'Email deliverability validation (used by validators; useful for miners to self-check)', required: false },
    { name: 'SCRAPINGDOG_API_KEY',description: 'LinkedIn / SERP enrichment',                                       required: false },
    { name: 'COMPANIES_HOUSE_API_KEY', description: 'Optional UK firmographic enrichment',                          required: false },
  ],

  scoring: {
    summary:
      "Model track: each model evaluated on 20 ICPs, scored on quantity × quality of valid companies returned (up to 5 per ICP). To win, output must exceed max(today's reference-baseline + 10, 20.0). Fulfillment track: leads verified for ICP fit, data accuracy, required attributes, intent signals; each winning lead earns 0.05% of emission per epoch for 100 epochs (~5 days).",
    rule: 'Beat the daily reference baseline (model track) or submit unique, verified, ICP-matched leads with exact schema (fulfillment track).',
    sourcePath: 'leadpoet/leadpoet · README.md / docs/',
    cheatPath:
      'Hardcoded data, API-key manipulation, or obfuscation patterns trigger runtime termination and hotkey blacklisting. Fulfillment leads with extra fields are auto-rejected. Burning SN71 alpha on consumed leads ties miner reward to buyer pull-through, so fabricated leads that pass validation but never get consumed earn nothing downstream.',
  },

  profitability: {
    estimatedDailyEmissionPerUid: 0.0,
    tokenPriceUsdFallback: 284,
    notes:
      'Each consumed lead also burns SN71 alpha, which is the deflationary driver of miner reward beyond raw emission. ~218 active miners reported late 2025.',
  },

  milestones: [
    { day: 'day 1',  target: 'Registered + miner running',   note: 'btcli metagraph shows your UID; logs show ICP requests received.' },
    { day: 'day 3',  target: 'First validated lead / model win', note: 'Model track: beat reference baseline at least once. Fulfillment: ≥1 lead passes validator verification.' },
    { day: 'day 7',  target: 'Out of immunity, incentive rising', note: 'Tune scraping pipelines, fix recurring schema rejects, add enrichment APIs.' },
    { day: 'day 14', target: 'Steady-state earnings',        note: 'Median miner should be earning per tempo. Top decile come from broader source coverage and cleaner enrichment.' },
  ],

  monitoring: [
    { metric: 'ICP evaluation cost',     threshold: '< $10/run',  where: 'Miner logs — hard cost cap is $10 per 20-ICP eval' },
    { metric: 'Per-ICP eval time',       threshold: '< 320s',     where: 'Miner logs — hard timeout per ICP' },
    { metric: 'Schema validation rate',  threshold: '100%',       where: 'Validator response logs (rejections list)' },
    { metric: 'Per-tempo incentive',     threshold: 'rising or flat', where: 'btcli subnet metagraph --netuid 71' },
  ],

  knownIssues: [
    {
      symptom: 'Model tarball rejected',
      cause:   'Tarball exceeds 200KB hard cap.',
      fix:     'Strip vendored deps and dead code; reuse runtime-installed libraries instead of bundling them.',
    },
    {
      symptom: 'Hotkey blacklisted',
      cause:   'Prohibited pattern detected: hardcoded company data, API-key manipulation, or obfuscation.',
      fix:     'Rewrite the model to use the standard ICP→search→verify pipeline. Blacklist is hotkey-level — re-registration required.',
    },
    {
      symptom: 'Fulfillment leads auto-rejected with no failure code',
      cause:   'Extra fields in the lead schema. Validator requires exact match.',
      fix:     'Strip non-spec keys before submitting. Validate against the schema in the repo before sending.',
    },
    {
      symptom: 'Per-ICP timeout',
      cause:   '320s cap exceeded — typically slow LinkedIn scraping or large LLM calls.',
      fix:     'Parallelise enrichment, cache firmographic lookups, downgrade LLM step to lighter model.',
    },
  ],

  notes: [
    "Each consumed lead burns SN71 alpha — long-term incentive ties miner reward to actual buyer pull-through.",
    'Fulfillment payout is 0.05% × 100 epochs ≈ 5 days of trailing reward per winning lead, so volume + consistent quality compounds.',
    'Validators run on AWS Nitro Enclaves for trustless evaluation — miners do not need this; only ICP-evaluation budget matters.',
  ],
};
