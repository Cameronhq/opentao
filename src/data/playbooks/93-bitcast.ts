import type { RichPlaybook } from '../playbook-rich';

// SN93 — Bitcast. Decentralized creator-economy subnet paying YouTube creators in TAO
// for brief-aligned content. Miners are creators (or creator agencies) running an axon
// that links their YouTube account(s) via OAuth and tracks engagement-based rewards.

export const sn93: RichPlaybook = {
  slug: '93-bitcast',
  netuid: 93,
  name: 'Bitcast',
  category: 'data',
  categoryLabel: 'Creator Economy',

  blurb:
    'Creator-economy subnet — miners are YouTubers (or creator agencies running up to 5 channels per miner) who publish brand-brief videos and earn TAO for measured engagement (watch time, retention, audience match).',

  whatMinersDo:
    "A Bitcast miner ties one or more YouTube channels to a Bittensor hotkey via Google OAuth. Brands publish briefs via validators (target audience, messaging, platform); creator-miners publish brief-aligned videos and register the URLs. Validators query the YouTube Data API + Analytics API for watch time and retention and weight you on real engagement. The harness itself is tiny — the moat is your channel quality and your brief-execution discipline. One miner can run up to 5 YouTube accounts to operate as a content agency.",

  verifiedAt: '2026-06-01',
  verifiedBy: '@editorial',

  emission: '— τ/day',
  burnCostFallback: '— τ',
  minerCountFallback: 0,
  slotCap: 256,

  hardware: [
    {
      role: 'CPU node (axon host)',
      count: '1',
      cpuCores: 1,
      ramGb: 2,
      diskGb: 20,
      bandwidth: 'static public IP · port 8091 open',
      notes: 'Linux required. No GPU — this is a creator-economy harness, not a compute miner. Real "hardware" is your YouTube channel + production setup.',
    },
  ],
  hardwareNote:
    "Linux is required (per README). The miner is essentially an OAuth + axon harness that surfaces your channel's videos and engagement to validators. Costs are dominated by content production, not infra.",

  rentalOk: true,
  rentalUsdPerHr: { lambda: 0.05, runpod: 0.04, coreweave: 0.06 },

  repo: {
    url: 'https://github.com/bitcast-network/bitcast',
    branch: 'main',
    minerEntrypoint: 'bitcast/miner/',
  },

  setupShape: 'simple-binary',
  setupOverview:
    'Two-track setup: (1) Linux miner harness — clone repo, run setup_env.sh, configure .env, start with PM2; (2) Google Cloud OAuth — create a project, enable YouTube Data API v3 and Analytics API, configure OAuth consent + credentials, drop client_secret.json into the secrets folder, and run the auth script to link your YouTube account.',

  install: [
    { step: 'Clone the miner repo',
      cmd:  'git clone git@github.com:bitcast-network/bitcast.git && cd bitcast' },
    { step: 'Run the environment setup script',
      cmd:  'chmod +x scripts/setup_env.sh && ./scripts/setup_env.sh',
      note: 'Creates venv at ../venv_bitcast/ and installs Python deps.' },
    { step: 'Copy the miner .env example',
      cmd:  'cp bitcast/miner/.env.example bitcast/miner/.env && $EDITOR bitcast/miner/.env',
      note: 'Set WALLET_NAME and HOTKEY_NAME.' },
    { step: 'Google Cloud — create project named bitcast-miner',
      note: 'console.cloud.google.com → New project → "bitcast-miner".' },
    { step: 'Enable YouTube Data API v3 + YouTube Analytics API',
      note: 'APIs & Services → Library → enable both APIs.' },
    { step: 'Configure OAuth consent screen',
      note: 'APIs & Services → OAuth consent screen → app name "bitcast-miner" + your email.' },
    { step: 'Create OAuth credentials (Web application)',
      note: 'Add redirect URI: https://dashboard.bitcast.network/echo · download JSON as bitcast/miner/secrets/client_secret.json' },
    { step: 'Authenticate your YouTube account',
      cmd:  'bash scripts/run_auth.sh',
      note: 'Walks through the browser OAuth flow — repeat per linked channel (up to 5 per miner).' },
    { step: 'Register hotkey on SN93',
      cmd:  'btcli subnet register --netuid 93 --wallet.name $WALLET_NAME --wallet.hotkey $HOTKEY_NAME' },
    { step: 'Open port 8091 for axon traffic',
      cmd:  'sudo ufw allow 8091/tcp' },
  ],

  runSteps: [
    { step: 'Activate venv and start miner',
      cmd:  'source ../venv_bitcast/bin/activate && bash scripts/run_miner.sh' },
    { step: 'Monitor with PM2',
      cmd:  'pm2 list && pm2 logs bitcast_miner' },
    { step: 'Confirm registration on metagraph',
      cmd:  'btcli subnet metagraph --netuid 93' },
  ],

  envVars: [
    { name: 'WALLET_NAME', description: 'Coldkey name', required: true },
    { name: 'HOTKEY_NAME', description: 'Hotkey name',  required: true },
  ],

  scoring: {
    summary:
      'Validators pull engagement from YouTube Data API + Analytics API: total watch time, average view duration, audience match per brief audience criteria. Surface views are easy to fake; watch time and retention are not, and validators down-weight anomalous retention curves and audience demographics.',
    rule: 'Publish brief-aligned content on channels with real engagement. Pick briefs that match your audience — a mismatched audience zeros the brief even with high views.',
    cheatPath: "View botting — anomalous retention curves and audience demographic patterns get down-weighted or zeroed. Fake channels with no organic history don't pass validator audience-match heuristics.",
  },

  profitability: {
    estimatedDailyEmissionPerUid: 0.0,
    tokenPriceUsdFallback: 284,
    capexNote:
      'Infra is trivial (~$5/mo VM). Real "capex" is your channel — sub count, retention history, niche fit. Mid-tier creators (10K-1M subs) are the sweet spot per Bitcast positioning.',
    notes:
      "Earning is bounded by brief volume from brands — track brand-side flywheel as the leading indicator. Agency mode (5 channels) multiplies your slot, but each channel still has to perform.",
  },

  milestones: [
    { day: 'day 1',  target: 'OAuth linked, axon up, UID assigned',  note: 'pm2 logs show YouTube auth success. Incentive > 0 after first tempo.' },
    { day: 'day 3',  target: 'First brief picked + video published', note: 'Brief acceptance + URL registration logged.' },
    { day: 'day 7',  target: 'First engagement weights',              note: 'Validators have queried YouTube Analytics and weighted you on watch time.' },
    { day: 'day 14', target: 'Out of immunity, brief flow stable',    note: 'Survive past immunity with active brief acceptance and engagement scores.' },
    { day: 'day 30', target: 'Break-even on production cost',         note: 'Daily emission ≥ daily content-production opex.' },
  ],

  monitoring: [
    { metric: 'YouTube OAuth token validity', threshold: 'valid',          where: 'pm2 logs bitcast_miner · watch for token-refresh errors' },
    { metric: 'Axon reachability',            threshold: '100%',           where: 'curl http://<miner-ip>:8091/health from outside' },
    { metric: 'Brief acceptance rate',        threshold: 'as targeted',    where: 'dashboard.bitcast.network' },
    { metric: 'Average view duration',        threshold: '> 50% of length',where: 'YouTube Studio Analytics' },
    { metric: 'Per-tempo incentive',          threshold: 'rising or flat', where: 'btcli subnet metagraph --netuid 93' },
  ],

  knownIssues: [
    {
      symptom: 'OAuth fails / token revoked',
      cause:   'client_secret.json missing, wrong redirect URI, or YouTube account changed permissions.',
      fix:     'Re-run bash scripts/run_auth.sh and confirm redirect URI matches https://dashboard.bitcast.network/echo exactly in Google Cloud Console.',
    },
    {
      symptom: 'Engagement scores low despite high views',
      cause:   'Audience-match penalty — the brief had audience-fit criteria your channel does not satisfy.',
      fix:     'Only accept briefs that match your channel niche / demographic. Surface views without retention or audience fit are penalized.',
    },
    {
      symptom: 'Axon unreachable warnings',
      cause:   'Port 8091 closed at cloud firewall or external IP misconfigured.',
      fix:     '`ufw allow 8091/tcp` and verify external IP from another network: curl http://<your-ip>:8091/health',
    },
  ],

  notes: [
    'X / Twitter platform support is on the 2026 roadmap per the team — YouTube is the current canonical surface.',
    'DSV Fund publicly disclosed OTC participation — track brand-side brief volume as the dominant economic lever.',
    'Run up to 5 YouTube accounts under one miner via agency mode — sub-linear capex scaling if you can produce briefs across channels.',
  ],
};
