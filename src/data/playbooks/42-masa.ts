import type { RichPlaybook } from '../playbook-rich';

// SN42 — Masa / Gopher AI. Real-time social + web data via Intel SGX TEE
// workers. Two containers per miner: the neuron + the tee-worker, both via
// docker-compose. Hardware requires SGX 2.0+ (11th-gen+ Intel Core or
// modern Xeon, e.g. Azure DCsv2/DCsv3).

export const sn42: RichPlaybook = {
  slug: '42-masa',
  netuid: 42,
  name: 'Masa',
  category: 'data',
  categoryLabel: 'TEE social scraping',

  blurb:
    'Scrape X (and adjacent social/web) inside an Intel SGX TEE enclave. Two-container docker-compose stack: neuron + tee-worker. Rewards scale with auth reliability, latency, completeness, and rate-limit avoidance.',

  whatMinersDo:
    "A Masa SN42 miner runs two containers per UID: the neuron (Bittensor miner) and the tee-worker (TEE-attested scraper for X, Reddit, web, TikTok). The worker proves it is running inside an Intel SGX enclave; validators send scrape jobs, score on response time, completeness, authentication reliability (clean Twitter credentials beat exhausted ones), and rate-limit avoidance. Configuration is via `.env` and `docker-compose --profile miner up -d`.",

  verifiedAt: '2026-06-01',
  verifiedBy: '@editorial',

  emission: '— τ/day',
  burnCostFallback: '— τ',
  minerCountFallback: 0,
  slotCap: 256,

  hardware: [
    {
      role: 'SGX-enabled CPU node',
      count: '1',
      cpuCores: 4,
      ramGb: 16,
      diskGb: 200,
      bandwidth: '1 Gbps',
      notes: 'Intel SGX 2.0+ required. 11th-Gen Intel Core or modern Xeon. SGX must be enabled in BIOS. Azure Standard DC4s v2 (4 vCPU, 16 GiB, SGX) is the documented reference instance.',
    },
  ],
  hardwareNote:
    'Maximum 4 TEE miners per Azure DC4s_v2 instance — exceeding that gets you auto-terminated. No GPU required.',

  rentalOk: true,
  rentalNote:
    'Allowed in principle but the rental must expose real SGX. Azure DCsv2/DCsv3 confidential VMs are the documented path. Most general-purpose Runpod/Vast nodes do NOT expose SGX and will not attest.',
  rentalUsdPerHr: { coreweave: 0.5 },

  repo: {
    url: 'https://github.com/gopher-lab/subnet-42',
    branch: 'main',
    minerEntrypoint: 'docker compose --profile miner up -d',
    extraRepos: [
      { name: 'tee-worker', url: 'https://github.com/gopher-lab/tee-worker', purpose: 'SGX worker container — scrapers + attestation (run by docker compose).' },
    ],
  },

  setupShape: 'docker-compose',
  setupOverview:
    "Provision an SGX-capable Linux host (Azure DC4s_v2 is the documented baseline), install Docker, clone subnet-42, copy `.env.example` to `.env`, fill wallet + Twitter + Apify creds, then `docker compose --profile miner up -d`. The compose file pulls both the neuron and tee-worker containers.",

  install: [
    { step: 'Provision an SGX-enabled host',
      note: 'Azure DC4s_v2 (4 vCPU, 16 GiB) is the reference. Verify SGX with `ls /dev/sgx_enclave /dev/sgx_provision`.' },
    { step: 'Install Docker',
      cmd:  'sudo snap install docker && sudo usermod -aG docker $USER',
      note: 'Log out and back in so the docker group takes effect.' },
    { step: 'Clone subnet-42',
      cmd:  'git clone https://github.com/gopher-lab/subnet-42.git && cd subnet-42' },
    { step: 'Copy the env template',
      cmd:  'cp .env.example .env',
      note: 'Fill wallet mnemonics or wallet path, NETUID=42, SUBTENSOR_NETWORK=finney, OVERRIDE_EXTERNAL_IP, MINER_PORT, MINER_TEE_ADDRESS, TWITTER_ACCOUNTS, TWITTER_API_KEYS, APIFY_API_KEY, CLAUDE_API_KEY.' },
    { step: 'Install btcli + create / register a hotkey',
      cmd:  'btcli wallet new_coldkey --wallet.name miner\nbtcli wallet new_hotkey --wallet.name miner --wallet.hotkey default\nbtcli subnet register --netuid 42' },
  ],

  runSteps: [
    { step: 'Bring up the miner profile (neuron + tee-worker)',
      cmd:  'docker compose --profile miner up -d' },
    { step: 'Tail container logs',
      cmd:  'docker logs <container-name> -f',
      note: 'You should see SGX attestation followed by job pickup.' },
    { step: 'Verify the TEE worker endpoint',
      cmd:  'curl -k https://<your-ip>:8080',
      note: 'Self-signed certificate warnings are expected.' },
  ],

  envVars: [
    { name: 'ROLE',                description: '"miner"',                                                       required: true },
    { name: 'NETUID',              description: '42 (or 165 for testnet)',                                       required: true },
    { name: 'SUBTENSOR_NETWORK',   description: '"finney" or "test"',                                            required: true },
    { name: 'COLDKEY_MNEMONIC',    description: 'Coldkey seed phrase (use WALLET_PATH instead to load from disk)',required: false },
    { name: 'HOTKEY_MNEMONIC',     description: 'Hotkey seed phrase (or use WALLET_NAME/HOTKEY_NAME with WALLET_PATH)', required: false },
    { name: 'WALLET_NAME',         description: 'Coldkey name (if loading from disk)',                           required: false },
    { name: 'HOTKEY_NAME',         description: 'Hotkey name (if loading from disk)',                            required: false },
    { name: 'WALLET_PATH',         description: 'Path to ~/.bittensor/wallets (if loading from disk)',           required: false },
    { name: 'OVERRIDE_EXTERNAL_IP',description: 'Public IP of the miner host',                                   required: true },
    { name: 'MINER_PORT',          description: 'Public TCP port the neuron listens on',                         required: true },
    { name: 'MINER_TEE_ADDRESS',   description: 'host:port for the TEE worker (typically <ip>:8080)',            required: true },
    { name: 'TWITTER_ACCOUNTS',    description: 'Comma-separated username:password pairs for credential scraping', required: false },
    { name: 'TWITTER_API_KEYS',    description: 'Comma-separated Twitter bearer tokens for API scraping',         required: false },
    { name: 'APIFY_API_KEY',       description: 'Used for follower / following enrichment',                       required: false },
    { name: 'CLAUDE_API_KEY',      description: 'Optional — used by downstream enrichment steps',                  required: false },
  ],

  scoring: {
    summary:
      "Validators send scrape jobs to the TEE worker. Scoring factors documented by the project: authentication reliability (how often credentials stay valid), response time, data completeness, rate-limit avoidance, and overall API quota management. Consistent high-quality Twitter/X data retrieval is the dominant signal.",
    rule: 'Fast, complete, rate-limit-clean scrape results delivered through an attested SGX enclave.',
    sourcePath: 'gopher-lab/subnet-42 + gopher-lab/tee-worker',
    cheatPath:
      "STANDALONE=true / OE_SIMULATION=1 skip the TEE and are for local dev only — they will not earn on mainnet. Burning Twitter accounts (hitting too many checkpoints) shows up as auth-reliability drop. Running > 4 miners on one DC4s_v2 instance gets you auto-terminated.",
  },

  profitability: {
    estimatedDailyEmissionPerUid: 0,
    tokenPriceUsdFallback: 284,
    capexNote:
      'No GPU. Real costs: SGX-capable VM (Azure DC4s_v2 ~$0.50/hr), Twitter account farm, Apify credits, plus optional Claude API. Running 4 miners per host is the sweet spot.',
    notes:
      "Masa Finance rebranded to Gopher AI in Sep 2025; the repo lives at gopher-lab/subnet-42 but the netuid and ticker are still '42 / MASA'.",
  },

  milestones: [
    { day: 'day 1', target: 'Both containers up, SGX attestation passing', note: 'docker logs shows attestation success and the TEE endpoint answers on :8080.' },
    { day: 'day 3', target: 'Job throughput stable', note: 'Validator-issued scrape jobs come back without rate-limit errors.' },
    { day: 'day 7', target: 'Auth reliability > 95%', note: 'If credentials keep dying, rotate accounts and ensure residential IPs are clean.' },
    { day: 'day 14', target: 'Above the floor, holding rank', note: 'Tune the mix of credential-based vs API-based scraping based on which gives better completeness.' },
  ],

  monitoring: [
    { metric: 'SGX attestation success',       threshold: '100%',           where: 'docker logs · search "attest"' },
    { metric: 'Twitter auth-reliability',      threshold: '> 95%',          where: 'tee-worker logs · auth error counter' },
    { metric: 'Average scrape latency',        threshold: '< 5 s',          where: 'tee-worker metrics' },
    { metric: 'TEE endpoint reachability',     threshold: '100%',           where: 'curl -k https://<ip>:8080 from outside' },
    { metric: 'Incentive per tempo',           threshold: 'rising or flat', where: 'btcli subnet metagraph --netuid 42' },
  ],

  knownIssues: [
    {
      symptom: 'Attestation fails / TEE container exits',
      cause:   "SGX not exposed at the kernel level — /dev/sgx_enclave missing or BIOS hasn't enabled SGX.",
      fix:     'Boot a real SGX host (Azure DCsv2/DCsv3). Verify `ls /dev/sgx_enclave /dev/sgx_provision`. Reboot after BIOS change.',
    },
    {
      symptom: 'Twitter authentication keeps failing',
      cause:   'Accounts are getting checkpointed because of IP reuse or aggressive query patterns.',
      fix:     'Use residential proxies, rotate accounts more slowly, and prefer TWITTER_API_KEYS for high-volume basic queries (bearer tokens are stabler than passwords).',
    },
    {
      symptom: 'All 4 miners on the Azure host crash at once',
      cause:   'Resource exhaustion — the documented cap is 4 per DC4s_v2.',
      fix:     'Drop to 4 (or fewer) miners per instance; or move to DC8s_v2 with proportional headroom.',
    },
    {
      symptom: 'Validators cannot reach the TEE worker on :8080',
      cause:   'OVERRIDE_EXTERNAL_IP wrong, or :8080 closed at the firewall.',
      fix:     'Open :8080 inbound. Set OVERRIDE_EXTERNAL_IP to the actual public IP. Re-test with `curl -k https://<ip>:8080` from another network.',
    },
  ],

  notes: [
    'Repo: https://github.com/gopher-lab/subnet-42. Worker: https://github.com/gopher-lab/tee-worker.',
    'Authoritative docs: https://developers.gopher-ai.com/docs/subnet/intro — "If something in this repository differs from the docs, treat the docs as authoritative."',
    'Local dev escape hatches: STANDALONE=true bypasses TEE, OE_SIMULATION=1 uses the SGX simulator. Mainnet earns nothing in those modes.',
    'For Macs / non-SGX dev boxes, use Colima with `--arch x86_64 --vm-type qemu` to emulate.',
  ],
};
