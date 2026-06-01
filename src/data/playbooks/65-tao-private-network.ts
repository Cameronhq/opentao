import type { RichPlaybook } from '../playbook-rich';

// SN65 — TAO Private Network (TPN). Decentralized VPN.
// Miners run a Bittensor neuron (`neurons/miner.py`) + a Wireguard / Docker exit node
// container on a VPS in their target geography. README at github.com/taofu-labs/tpn-subnet
// documents pm2-managed neuron, the federated-container scoring code, and required keys
// (IP2Location, MaxMind).

export const sn65: RichPlaybook = {
  slug: '65-tao-private-network',
  netuid: 65,
  name: 'TAO Private Network',
  category: 'compute',
  categoryLabel: 'Compute · Network',

  blurb:
    'Decentralized VPN. Miners run Wireguard exit nodes in geographically diverse jurisdictions; validators probe them and pay for location uniqueness, uptime and throughput. Operated by Taofu Labs.',
  whatMinersDo:
    "A TPN miner runs the `neurons/miner.py` Bittensor neuron alongside a Docker-managed Wireguard exit node (handled by `scripts/update_node.sh`) on a VPS in a target geography. The validator probes the node from multiple vantage points, verifies the claimed location, and scores you on geographic uniqueness × pool size × response speed. Rare jurisdictions (Iran, NK, etc.) pay more per node than mainstream regions.",

  verifiedAt: '2026-06-01',
  verifiedBy: '@editorial',

  emission: '— τ/day',
  burnCostFallback: '— τ',
  minerCountFallback: 0,
  slotCap: 256,

  hardware: [
    {
      role: 'Exit node (VPS)',
      count: '1+ per geography',
      cpuCores: 2,
      ramGb: 8,
      diskGb: 50,
      bandwidth: 'publicly-routable IP · symmetric uplink',
      notes: 'README floor: 2 cores, 4–8 GB RAM, 50 GB disk for a mining pool. A static public IP is required. The rarer the country the better the geo-uniqueness score.',
    },
  ],
  hardwareNote:
    'Geographic uniqueness dominates the score. A $5/mo VPS in Tehran or Pyongyang beats a $200/mo box in Frankfurt. Pick your geography carefully.',

  rentalOk: true,
  rentalNote: 'Datacenter IPs in mainstream regions score badly. Residential IPs and rare-jurisdiction VPS are favored.',
  rentalUsdPerHr: { lambda: 0.05, runpod: 0.04, coreweave: 0.10 },

  repo: {
    url: 'https://github.com/taofu-labs/tpn-subnet',
    branch: 'main',
    minerEntrypoint: 'neurons/miner.py',
  },

  setupShape: 'simple-binary',
  setupOverview:
    'Setup is system-package + Docker + a Python venv. Install Wireguard + Docker, clone the repo, set up an `.env` with your IP2Location and MaxMind keys, then run `neurons/miner.py` under pm2 alongside the federated container started by `scripts/update_node.sh`.',

  install: [
    { step: 'Install system deps + Wireguard + Docker',
      cmd:  'sudo apt update && sudo apt install -y git jq netcat-openbsd wireguard wireguard-tools nodejs npm python3 python3-venv python3-pip && curl -fsSL https://get.docker.com -o get-docker.sh && sudo sh get-docker.sh && sudo modprobe wireguard' },
    { step: 'Clone the repo',
      cmd:  'cd ~ && git clone https://github.com/taofu-labs/tpn-subnet.git' },
    { step: 'Python venv + dependencies',
      cmd:  'cd ~/tpn-subnet && python3 -m venv venv && source venv/bin/activate && pip3 install -r requirements.txt' },
    { step: 'Install pm2 process manager',
      cmd:  'npm install -g pm2' },
    { step: 'Set required keys in .env (IP2Location + MaxMind + admin)',
      note: 'IP2LOCATION_DOWNLOAD_TOKEN (lite.ip2location.com), MAXMIND_LICENSE_KEY (maxmind.com), ADMIN_API_KEY, MINING_POOL_REWARDS, MINING_POOL_WEBSITE_URL.' },
    { step: 'Register hotkey on SN65',
      cmd:  'btcli subnet register --netuid 65 --wallet.name $WALLET --wallet.hotkey $HOTKEY' },
  ],

  runSteps: [
    { step: 'Start the federated exit-node container',
      cmd:  'bash ~/tpn-subnet/scripts/update_node.sh' },
    { step: 'Start the miner neuron under pm2',
      cmd:  'cd ~/tpn-subnet && export PYTHONPATH=. && source venv/bin/activate && pm2 start "python3 ~/tpn-subnet/neurons/miner.py --netuid 65 --subtensor.network finney --wallet.name tpn_coldkey --wallet.hotkey tpn_hotkey --logging.info --axon.port 8091 --blacklist.force_validator_permit" --name tpn_miner' },
    { step: 'Verify on the metagraph',
      cmd:  'btcli subnet metagraph --netuid 65' },
  ],

  envVars: [
    { name: 'WALLET',                    description: 'Coldkey name (README uses `tpn_coldkey`)',                  required: true },
    { name: 'HOTKEY',                    description: 'Hotkey name (README uses `tpn_hotkey`)',                    required: true },
    { name: 'IP2LOCATION_DOWNLOAD_TOKEN',description: 'Free token from lite.ip2location.com for geo verification', required: true },
    { name: 'MAXMIND_LICENSE_KEY',       description: 'Free MaxMind GeoLite2 license for IP intelligence',         required: true },
    { name: 'ADMIN_API_KEY',             description: 'Admin key for worker performance queries',                  required: true },
    { name: 'MINING_POOL_REWARDS',       description: 'Human-readable payment description string',                 required: true },
    { name: 'MINING_POOL_WEBSITE_URL',   description: 'URL to your pool documentation',                            required: true },
  ],

  scoring: {
    summary:
      'Validator continuously probes miner exit nodes from many vantage points, verifies the claimed geo against IP2Location + MaxMind, and scores: workers × geographic diversity × slowness penalty. Spoofing the location is heavily penalized.',
    rule: 'Cover geographies no other miner covers, with high uptime and decent throughput.',
    sourcePath: 'taofu-labs/tpn-subnet · federated-container/modules/scoring/score_mining_pools.js#L162',
    cheatPath:
      "Claiming Tehran while routing through AWS — multi-vantage-point geo probes catch the mismatch. Running many mining pools in the same region for no extra geo coverage — does not stack score.",
  },

  profitability: {
    estimatedDailyEmissionPerUid: 0.0,
    tokenPriceUsdFallback: 284,
    notes:
      'Registration immunity lasts ~16 hours (5000 blocks). Workers in your pool must be paid out of your share — payment scheme is operator-discretionary.',
  },

  milestones: [
    { day: 'day 1', target: 'Neuron registered + Docker container green', note: 'pm2 status shows tpn_miner online; metagraph shows UID with non-zero trust.' },
    { day: 'day 2', target: 'Out of immunity — incentive depends entirely on geo + uptime now', note: 'Immunity is only ~16 hours; your real performance starts day 1.' },
    { day: 'day 7', target: 'Geographic uniqueness bonus visible',         note: 'If you picked a mainstream country, expect low score; consider migrating to a rarer geo.' },
  ],

  monitoring: [
    { metric: 'Wireguard container health',    threshold: 'running',         where: 'docker ps' },
    { metric: 'pm2 neuron uptime',             threshold: '> 99%',           where: 'pm2 list' },
    { metric: 'Geographic uniqueness score',   threshold: 'positive',        where: 'TPN dashboard / validator logs' },
    { metric: 'Per-tempo incentive',           threshold: 'rising',          where: 'btcli subnet metagraph --netuid 65' },
  ],

  knownIssues: [
    {
      symptom: 'Validator reports geo mismatch',
      cause:   'VPS provider routes through a datacenter in a different country than its marketed location.',
      fix:     'Test with a third-party geo lookup before registering; switch VPS provider if mismatch persists.',
    },
    {
      symptom: 'Wireguard module not loading',
      cause:   '`modprobe wireguard` failed or kernel missing module.',
      fix:     'Use Ubuntu 22.04 LTS+ kernel; rebuild VPS image if kernel module is missing.',
    },
    {
      symptom: 'Running multiple pools but no extra emission',
      cause:   'All pools sit in the same region — geographic diversity bonus does not stack.',
      fix:     'Spread pools across distinct geos, or consolidate workers into a single pool in a rare geo.',
    },
  ],

  notes: [
    'Operated by Taofu Labs (Mitch + Mikel) with one team member who previously built OnionDAO.',
    'iOS + Android consumer clients are in public preview; the API-shaped audience (agents needing residential / rare IPs) is the bigger long-term buyer.',
  ],
};
