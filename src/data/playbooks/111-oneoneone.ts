import type { RichPlaybook } from '../playbook-rich';

// SN111 — oneoneone. UGC scraping subnet (Google Maps reviews, X posts, etc.).
// README at oneoneone-io/subnet-111 is the canonical source for setup.

export const sn111: RichPlaybook = {
  slug: '111-oneoneone',
  netuid: 111,
  name: 'oneoneone',
  category: 'data',
  categoryLabel: 'Data',

  blurb:
    'UGC scraping subnet — Google Maps reviews, X posts, forums — graded on volume (50%), speed (30%), recency (20%). Modest hardware, Apify + Gravity API tokens required.',

  whatMinersDo:
    "Run a Node.js + Python stack that scrapes user-generated content (Google Maps reviews, X posts, etc.) on demand. Every ~20 minutes a validator issues a synthetic query and gives the miner 120 seconds to return fresh, cleaned, structured UGC. Validators grade volume (50%), speed (30%), and recency (20%); cross-validator authenticity checks catch fake or stale data.",

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
      cpuCores: 2,
      ramGb: 8,
      diskGb: 32,
      bandwidth: 'stable broadband · good latency',
      notes: 'No GPU needed. CPU + RAM + small SSD only; bandwidth and proxy quality matter more than compute.',
    },
  ],

  rentalOk: true,
  rentalUsdPerHr: { lambda: 0.05, runpod: 0.04, coreweave: 0.06 },

  repo: {
    url: 'https://github.com/oneoneone-io/subnet-111',
    branch: 'main',
    minerEntrypoint: 'neurons/miner.py + node/ (Node.js stack)',
  },

  setupShape: 'simple-binary',
  setupOverview:
    "Setup is a standard Python neuron plus a Node.js stack that handles the scraping pipeline. Both must run together — pm2 supervises both. The auto-updater script is the recommended path; it polls for updates every 20 minutes and restarts only when code changes.",

  install: [
    { step: 'Install NVM + Node 21 + pm2',
      cmd:  'curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash && source ~/.bashrc && nvm i 21 && npm i pm2 -g' },
    { step: 'Clone repo',
      cmd:  'git clone https://github.com/oneoneone-io/subnet-111.git && cd subnet-111' },
    { step: 'Install Miniconda + create env',
      cmd:  'wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh && bash Miniconda3-latest-Linux-x86_64.sh -b && ~/miniconda3/bin/conda init && source ~/.bashrc' },
    { step: 'Create + activate Python 3.12 env',
      cmd:  'conda create -n subnet-111 python=3.12 -y && conda activate subnet-111' },
    { step: 'Install Python deps',
      cmd:  'pip install -r requirements.txt && pip install -e .' },
    { step: 'Install Node deps',
      cmd:  'cd node && npm install && cd ..' },
    { step: 'Copy + fill env files',
      cmd:  'cp .env.example .env && cp node/.env.miner.example node/.env',
      note: 'In node/.env set APIFY_TOKEN, GRAVITY_API_TOKEN, GRAVITY_TWEET_LIMIT=100.' },
    { step: 'Get Apify token',
      note: 'Register at apify.com → Starter plan → Settings → API & Integrations → generate token.' },
    { step: 'Get Gravity (Macrocosmos) API key',
      note: 'macrocosmos.ai → Account Settings → API Keys → new key.' },
    { step: 'Register hotkey on SN111',
      cmd:  'pip install bittensor-cli && btcli subnet register --no_prompt --wallet.name miner --wallet.hotkey default --netuid 111' },
  ],

  runSteps: [
    { step: 'Start with auto-updater (recommended)',
      cmd:  'chmod +x auto-updater.sh && pm2 start ./auto-updater.sh --name "autoupdater-miner-prod" -- miner 111 miner default 9001',
      note: 'Polls for updates every 20 min; restarts only on code changes.' },
    { step: 'Or: start Node stack + miner manually',
      cmd:  'pm2 start npm --name node-miner --cwd ./node -- run miner:start && pm2 start "python neurons/miner.py --netuid 111 --wallet.name <wallet> --wallet.hotkey <hotkey> --logging.debug --axon.port 9001" --name miner' },
    { step: 'Persist + enable boot',
      cmd:  'pm2 save && pm2 startup' },
    { step: 'Watch logs',
      cmd:  'pm2 logs autoupdater-miner-prod' },
  ],

  envVars: [
    { name: 'WALLET',              description: 'Coldkey name',                                       required: true },
    { name: 'HOTKEY',              description: 'Hotkey name',                                        required: true },
    { name: 'APIFY_TOKEN',         description: 'Apify API token (Starter plan minimum)',             required: true },
    { name: 'GRAVITY_API_TOKEN',   description: 'Macrocosmos Gravity API key',                        required: true },
    { name: 'GRAVITY_TWEET_LIMIT', description: 'Max tweets per Gravity call (100 recommended)',      required: true },
  ],

  scoring: {
    summary:
      'Every ~20 minutes the validator sends a synthetic UGC query (e.g. fetch reviews for X place, posts mentioning Y). The miner has 120 seconds to respond. Volume (count of valid items) is 50%, speed (fastest_response_time / your_response_time) is 30%, recency (freshness vs ground truth) is 20%.',
    rule: 'Return more valid, fresh items, faster than the median miner inside the 120-second window.',
    cheatPath:
      "Don't serve AI-generated reviews or recycled cached scrapes — validators cross-pull and re-validate against the live platform; failed spot checks zero your score. Don't go over the 120s timeout — it disqualifies the whole response.",
  },

  profitability: {
    estimatedDailyEmissionPerUid: 0.0,
    tokenPriceUsdFallback: 284,
    capexNote: 'Trivial capex — any small VPS works. Opex dominated by Apify subscription and residential proxy spend.',
  },

  milestones: [
    { day: 'day 1',  target: 'Registered + both stacks running',  note: 'pm2 shows miner + node-miner both online; first 20-min challenges landing.' },
    { day: 'day 3',  target: 'Survive timeout floor',             note: 'Most responses well under 120s; volume above the cohort median for at least one platform.' },
    { day: 'day 7',  target: 'Out of the speed-tail',             note: 'Speed component (30%) measurably better than the worst quartile; recency consistently fresh.' },
    { day: 'day 14', target: 'Break-even on opex',                note: 'Daily emission ≥ Apify + proxy spend. Top miners scale Apify usage and proxy pools to push volume.' },
  ],

  monitoring: [
    { metric: 'Response under 120s',        threshold: '> 99%',          where: 'pm2 logs miner · timeout = full disqualification' },
    { metric: 'Apify quota remaining',      threshold: '> 20%',          where: 'apify.com console · running out kills volume mid-tempo' },
    { metric: 'Spot-check pass rate',       threshold: '100%',           where: 'validator-side, watch incentive trajectory after suspicious tempos' },
    { metric: 'Per-tempo incentive',        threshold: 'rising or flat', where: 'btcli subnet metagraph --netuid 111' },
  ],

  knownIssues: [
    {
      symptom: 'Responses timing out at 120s',
      cause:   'Apify runs queued too long, or scraper unable to handle peak query batch size.',
      fix:     'Bump Apify plan, parallelize the scrape inside the 120s window, cache common ground-truth queries.',
    },
    {
      symptom: 'Validator marks responses invalid → score drops sharply',
      cause:   'Spot-check failed — content returned does not match the live platform (stale cache, malformed JSON, AI-paraphrased).',
      fix:     'Disable any AI rewriting in your pipeline. Pull fresh from the live source for every request inside the 120s budget.',
    },
    {
      symptom: 'Auto-updater restarts every cycle even when no changes',
      cause:   'Local git state diverged from main.',
      fix:     'git reset --hard origin/main on the miner repo. The updater checks for new commits, not for local edits.',
    },
    {
      symptom: 'Node stack and Python neuron lose sync',
      cause:   'pm2 restarted one but not the other — neuron talks to a dead socket.',
      fix:     'pm2 restart miner node-miner (restart both together). pm2 save afterwards.',
    },
  ],

  notes: [
    'Mainnet is netuid 111; testnet is netuid 427 with --subtensor.network test.',
    'v1.6.0 shipped in November 2025; Macrocosmos Gravity integration deepened authenticity verification through 2026.',
    'Validators independently re-pull a sample to cross-reference — authenticity is consensus-checked, not single-validator.',
  ],
};
