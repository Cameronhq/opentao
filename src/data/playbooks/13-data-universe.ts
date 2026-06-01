import type { RichPlaybook } from '../playbook-rich';

// SN13 — Data Universe (Macrocosmos). Miners scrape X, Reddit, YouTube
// transcripts, store entries in DataEntityBuckets, upload anonymised copies
// to S3, and report a MinerIndex. Validators sample + re-fetch + score
// freshness × desirability × uniqueness × credibility^2.5.

export const sn13: RichPlaybook = {
  slug: '13-data-universe',
  netuid: 13,
  name: 'Data Universe',
  category: 'data',
  categoryLabel: 'Social / web scraping',

  blurb:
    'Scrape X, Reddit, and YouTube transcripts against a validator-issued desirability list. Store, S3-upload, report; emission scales by freshness × desirability × uniqueness × credibility².⁵.',

  whatMinersDo:
    "A Data Universe miner reads the validators' current desirability list (which labels they want collected), runs the scraper clients for X, Reddit, and YouTube, stores DataEntities in time- and label-keyed DataEntityBuckets, uploads anonymised copies to S3-compatible storage via presigned URLs, and reports a MinerIndex back to validators. Validators sample your entries, re-fetch them from source to verify authenticity, and score on freshness (30-day cutoff), desirability, uniqueness, and an exponential-moving-average credibility (raised to the 2.5 power in the final formula).",

  verifiedAt: '2026-06-01',
  verifiedBy: '@editorial',

  emission: '— τ/day',
  burnCostFallback: '— τ',
  minerCountFallback: 0,
  slotCap: 256,

  hardware: [
    {
      role: 'Scraper / miner box (CPU)',
      count: '1',
      cpuCores: 8,
      ramGb: 16,
      diskGb: 1000,
      bandwidth: '1 Gbps + residential / rotating proxy pool',
      notes: 'No GPU required. Python ≥ 3.10. Disk size scales with how much data you store; 1 TB is a comfortable starting point.',
    },
  ],
  hardwareNote:
    'Real cost is API keys + proxies, not silicon. Apify, SerpAPI, and Reddit auth all consume credits per request.',

  rentalOk: true,
  rentalUsdPerHr: { lambda: 0.1, runpod: 0.08 },

  repo: {
    url: 'https://github.com/macrocosm-os/data-universe',
    branch: 'main',
    minerEntrypoint: 'neurons/miner.py',
    extraRepos: [
      { name: 'data-universe-api', url: 'https://github.com/macrocosm-os/data-universe-api', purpose: 'S3 storage + blockchain auth for miner uploads' },
    ],
  },

  setupShape: 'simple-binary',
  setupOverview:
    "Clone the repo, `pip install -e .`, configure scraper credentials (Apify, Reddit, YouTube) in .env, then run `neurons/miner.py` under PM2. Online mode reports the MinerIndex to validators; offline mode just scrapes locally.",

  install: [
    { step: 'Clone the Data Universe repo',
      cmd:  'git clone https://github.com/macrocosm-os/data-universe.git && cd data-universe' },
    { step: 'Install the Python package',
      cmd:  'python -m pip install -e .' },
    { step: 'Configure .env with scraper credentials',
      note: 'APIFY_API_TOKEN for X/Reddit scrapers, plus personal Reddit credentials for the reddit.custom client. YouTube uses official API keys.' },
    { step: 'Register the hotkey on SN13',
      cmd:  'btcli subnet register --netuid 13 --wallet.name $WALLET --wallet.hotkey $HOTKEY' },
  ],

  runSteps: [
    { step: 'Start the miner online (default — reports MinerIndex)',
      cmd:  'pm2 start python -- ./neurons/miner.py --wallet.name $WALLET --wallet.hotkey $HOTKEY' },
    { step: 'Or start in offline mode (scrape only, no on-chain reporting)',
      cmd:  'pm2 start python -- ./neurons/miner.py --offline' },
    { step: 'Watch your row on the dashboard',
      cmd:  'open https://sn13-dashboard.api.macrocosmos.ai/',
      note: 'Shows your data volume, uniqueness, and credibility per source.' },
  ],

  envVars: [
    { name: 'WALLET',           description: 'Coldkey name',                                                                       required: true },
    { name: 'HOTKEY',           description: 'Hotkey name registered on netuid 13',                                                required: true },
    { name: 'APIFY_API_TOKEN',  description: 'Apify token used by X.apidojo / X.microworlds / Reddit.lite scrapers',               required: true },
    { name: 'REDDIT_USERNAME',  description: 'Personal Reddit account for the reddit.custom scraper',                              required: false },
    { name: 'REDDIT_PASSWORD',  description: 'Reddit account password',                                                            required: false },
    { name: 'YOUTUBE_API_KEY',  description: 'Google API key for the YouTube transcript scraper',                                  required: false },
    { name: 'S3_AUTH_URL',      description: 'Endpoint used to request presigned upload URLs (defaults to the data-universe-api)', required: false },
  ],

  scoring: {
    summary:
      "Validators sample entries from your MinerIndex and re-fetch them from source. Final score multiplies raw data score by credibility^2.5 — consistent validation performance is worth far more than raw volume. Each entry is weighted by freshness (≤30 days old), desirability (validator-set labels; unlisted labels get a 0.3× multiplier), and uniqueness (duplicates across miners decay the value).",
    rule: 'score = (freshness × desirability × uniqueness × volume) × credibility^2.5',
    sourcePath: 'macrocosm-os/data-universe · scoring + rewards modules',
    cheatPath:
      "Re-uploading other miners' data tanks uniqueness. Submitting entries older than 30 days adds nothing — they score zero. Fake/fabricated entries are caught when validators re-fetch from source, dropping credibility and (because of the ^2.5 exponent) collapsing your overall score.",
  },

  profitability: {
    estimatedDailyEmissionPerUid: 0,
    tokenPriceUsdFallback: 284,
    capexNote:
      'No GPU. Real costs: Apify credits (~$50–$300/mo depending on volume), residential proxy pool (~$50–$200/mo), S3 egress, and YouTube/SerpAPI keys if enabled.',
    notes:
      "Buyers can pull the same data from the Hugging Face mirror or the Gravity SaaS layer; emission share tracks how desirable the labels you cover are.",
  },

  milestones: [
    { day: 'day 1', target: 'MinerIndex visible on dashboard', note: 'https://sn13-dashboard.api.macrocosmos.ai/ shows your hotkey with at least one source ingesting.' },
    { day: 'day 3', target: 'Credibility climbing', note: 'Validator re-fetches must succeed; if credibility is stalled, scrapers are returning stale or malformed entries.' },
    { day: 'day 7', target: 'Coverage across X + Reddit + YouTube', note: 'Diversifying sources improves uniqueness and resilience to per-source rate limiting.' },
    { day: 'day 14', target: 'Above-median emission', note: 'Tune which desirability labels you chase based on the current validator list.' },
  ],

  monitoring: [
    { metric: 'Dashboard credibility',     threshold: '> 0.5',          where: 'sn13-dashboard.api.macrocosmos.ai' },
    { metric: 'Freshness median age',      threshold: '< 7 days',       where: 'Dashboard freshness distribution' },
    { metric: 'S3 upload success rate',    threshold: '> 99%',          where: 'miner.py logs · search "S3"' },
    { metric: 'Scraper error rate',        threshold: '< 5%',           where: 'miner.py logs · per-source errors' },
    { metric: 'Incentive per tempo',       threshold: 'rising or flat', where: 'btcli subnet metagraph --netuid 13' },
  ],

  knownIssues: [
    {
      symptom: 'Credibility decays even though entries are uploading',
      cause:   "Validator re-fetch fails — scraper is returning data that doesn't match the live source (stale snapshot, missing fields).",
      fix:     'Refresh the Apify actor version, rotate proxies, and run a manual sample fetch against the same URL to confirm parity.',
    },
    {
      symptom: 'Apify credit burned quickly with low yield',
      cause:   'Targeting low-desirability labels (0.3× multiplier) or oversampled labels (uniqueness → 0).',
      fix:     "Inspect the current validator desirability list; chase high-multiplier labels first. Diversify across X / Reddit / YouTube.",
    },
    {
      symptom: 'S3 uploads fail with 403',
      cause:   "Hotkey not yet authenticated against data-universe-api, or wallet signing isn't lined up.",
      fix:     'Confirm the hotkey is registered on netuid 13 and your local wallet path is readable by the miner process.',
    },
    {
      symptom: 'Reddit scraper rate-limits within minutes',
      cause:   "Using a single account from a static IP — Reddit's anti-bot trips.",
      fix:     'Use residential proxies and rotate, or switch to reddit.lite via Apify which handles rotation for you.',
    },
  ],

  notes: [
    'Repo: https://github.com/macrocosm-os/data-universe.',
    'Live dashboard: https://sn13-dashboard.api.macrocosmos.ai/.',
    'Dynamic desirability list is the operator manual — read it weekly; labels rotate.',
    "Credibility is exponential-moving-average and raised to ^2.5 in the score — be conservative early, don't spam unverifiable entries.",
  ],
};
