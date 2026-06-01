import type { RichPlaybook } from '../playbook-rich';

// SN51 — lium.io (Datura-ai)
// GPU rental marketplace. Miners run a "central miner server" (Docker compose)
// that brokers between Lium scheduler and one-or-more "executor" GPU machines.
// Real GPU hardware required — fingerprint checks catch spoofs in under a tempo.

export const sn51: RichPlaybook = {
  slug: '51-lium-io',
  netuid: 51,
  name: 'lium.io',
  category: 'compute',
  categoryLabel: 'GPU Rental',

  blurb:
    'Permissionless GPU rental marketplace. Miners plug bare-metal or single-tenant GPU boxes into the Lium scheduler; validators fingerprint hardware continuously.',
  whatMinersDo:
    "Run a central Docker-compose miner that registers your hotkey and advertises one or more GPU \"executors\" — real H100 / A100 / 4090-class boxes — into the Lium scheduler. The scheduler routes real renter workloads (Docker containers with SSH/Jupyter) onto your GPUs. Validators continuously fingerprint each executor's CUDA capability, memory bandwidth, and FLOPs against the advertised class and benchmark history; uptime under live rentals dominates the score.",

  verifiedAt: '2026-06-01',
  verifiedBy: '@editorial',

  emission: '~6-7% of network at peak',
  burnCostFallback: '— τ',
  minerCountFallback: 0,
  slotCap: 256,

  hardware: [
    {
      role: 'Central miner server',
      count: '1',
      cpuCores: 4,
      ramGb: 8,
      diskGb: 50,
      bandwidth: 'static public IP',
      notes: 'Ubuntu host running Docker compose; no GPU needed on this node. Brokers between validator + scheduler + executors.',
    },
    {
      role: 'GPU executor',
      count: '1-N',
      gpu: 'H100 / A100 / 4090 / similar (full list in neurons/validators/src/services/const.py)',
      vramGb: 80,
      cpuCores: 16,
      ramGb: 128,
      diskGb: 1000,
      bandwidth: 'static public IP + open ports for SSH/Jupyter pass-through',
      notes: 'Real silicon required. Fingerprint probes detect virtualized/shared GPUs and evict.',
    },
  ],
  hardwareNote:
    'Reward tiers are set in const.py — refer to the on-repo list before purchasing. H100/A100 score highest; 4090 viable for the consumer tier.',

  rentalOk: false,
  rentalNote:
    'Renting GPUs from Vast/Runpod to re-rent on Lium does not work — hardware fingerprint checks detect virtualized/shared GPUs and the validator drops your score. You also need to associate an Ethereum address with your Bittensor hotkey, which gates the executor onboarding.',

  repo: {
    url: 'https://github.com/Datura-ai/lium-io',
    branch: 'main',
    extraRepos: [
      { name: 'compute-subnet', url: 'https://github.com/Datura-ai/compute-subnet', purpose: 'Active install repo referenced from miner README (contains scripts/install_miner_on_ubuntu.sh)' },
      { name: 'lium-cli',       url: 'https://github.com/Datura-ai/lium-cli',       purpose: 'CLI used by renters to launch / SSH / manage pods' },
      { name: 'docs',           url: 'https://docs.lium.io/bittensor-subnet/overview', purpose: 'Operator docs' },
    ],
  },

  setupShape: 'docker-compose',
  setupOverview:
    'Ubuntu host + an install script that lays down Docker, btcli, and the miner stack. Configure `.env` with your wallet + EXTERNAL_IP_ADDRESS, register the hotkey, `docker compose up -d`, then onboard each GPU executor box by associating your Ethereum address with the hotkey and registering the executor via the Lium CLI.',

  install: [
    { step: 'Clone install repo', cmd: 'git clone https://github.com/Datura-ai/compute-subnet.git && cd compute-subnet' },
    { step: 'Run installer', cmd: 'chmod +x scripts/install_miner_on_ubuntu.sh && ./scripts/install_miner_on_ubuntu.sh' },
    { step: 'Verify tooling', cmd: 'btcli --version && docker --version' },
    { step: 'Copy env template', cmd: 'cp neurons/miners/.env.template neurons/miners/.env' },
    { step: 'Fill env', note: 'Set BITTENSOR_WALLET_NAME, BITTENSOR_WALLET_HOTKEY_NAME, EXTERNAL_IP_ADDRESS, HOST_WALLET_DIR. Optionally INTERNAL_PORT / EXTERNAL_PORT / RENTAL_REQUEST_HOOK.' },
    { step: 'Register hotkey', cmd: 'btcli subnet register --netuid 51 --wallet.name $WALLET --wallet.hotkey $HOTKEY' },
    { step: 'Associate Ethereum address with hotkey', note: 'Required before adding executors. See docs.lium.io for the on-chain associate flow.' },
  ],

  runSteps: [
    { step: 'Start central miner', cmd: 'cd neurons/miners && docker compose up -d' },
    { step: 'Check containers', cmd: 'docker compose ps' },
    { step: 'Add a GPU executor', note: 'Provision a separate GPU box, run the executor installer on it, and register it against your central miner per docs.lium.io.' },
    { step: 'Verify on metagraph', cmd: 'btcli subnet metagraph --netuid 51' },
  ],

  envVars: [
    { name: 'WALLET',                       description: 'Coldkey name',            required: true },
    { name: 'HOTKEY',                       description: 'Hotkey name',             required: true },
    { name: 'BITTENSOR_WALLET_NAME',        description: 'Mirrors $WALLET into .env', required: true },
    { name: 'BITTENSOR_WALLET_HOTKEY_NAME', description: 'Mirrors $HOTKEY into .env', required: true },
    { name: 'EXTERNAL_IP_ADDRESS',          description: 'Static public IP of the central miner server', required: true },
    { name: 'HOST_WALLET_DIR',              description: 'Path to ~/.bittensor/wallets on the host',     required: true },
    { name: 'INTERNAL_PORT',                description: 'Container-side port (default OK)',            required: false },
    { name: 'EXTERNAL_PORT',                description: 'Host-side port (default OK)',                  required: false },
    { name: 'RENTAL_REQUEST_HOOK',          description: 'Optional callback URL for rental events',      required: false },
  ],

  scoring: {
    summary:
      'Validators continuously probe each executor: CUDA capability, memory bandwidth, FLOPs, advertised-vs-real GPU class, and uptime under real renter sessions. Score is roughly verified-class × benchmark consistency × uptime.',
    rule: 'Honest hardware, advertised correctly, available when a renter asks, stable during multi-hour training runs.',
    sourcePath: 'Datura-ai/compute-subnet · neurons/validators/src/services/const.py',
    cheatPath:
      "Spoofing GPU class via driver tricks fails — benchmark probes use workloads whose runtime depends on real silicon characteristics, not nvidia-smi labels. Re-renting Vast/Runpod GPUs fails the fingerprint check within a tempo.",
  },

  profitability: {
    estimatedDailyEmissionPerUid: 0.0,
    tokenPriceUsdFallback: 284,
    capexNote:
      'Capex-heavy. H100 bare-metal: $4-8k/mo rental or $20k+ to own. Margin model is: emissions + renter fees > opex.',
    notes:
      'Lium publicly disclosed ~$600/hour usage revenue (~$432k/month) — the highest-revenue subnet in 2026 Q1. Distribution is skewed to top-tier GPU operators.',
  },

  milestones: [
    { day: 'day 1',  target: 'Central miner up + hotkey registered', note: '`docker compose ps` clean; UID visible on metagraph.' },
    { day: 'day 3',  target: 'First executor onboarded',             note: 'Ethereum-address association complete; validator fingerprint passes.' },
    { day: 'day 7',  target: 'First renter session served',          note: 'Lium scheduler routed a real Docker container to your executor; uptime starts counting.' },
    { day: 'day 14', target: 'Out of immunity period, surviving',    note: 'Incentive above the floor. If close to floor, expand executor count or upgrade GPU tier.' },
    { day: 'day 30', target: 'Break-even on opex',                   note: 'Capex still in the hole but daily emission + renter fees ≥ daily server cost.' },
  ],

  monitoring: [
    { metric: 'Fingerprint pass rate',       threshold: '100%',     where: 'Central miner logs — validator probe results' },
    { metric: 'Executor uptime',             threshold: '> 99%',    where: 'docker compose ps on executor host + Lium dashboard' },
    { metric: 'Benchmark consistency',       threshold: 'within tier band', where: 'Validator probe history' },
    { metric: 'Per-tempo incentive',         threshold: 'rising/flat', where: 'btcli subnet metagraph --netuid 51' },
  ],

  knownIssues: [
    { symptom: 'Executor never gets routed any rentals',
      cause:   'Ethereum-address association missing, or executor advertised on a port not reachable from the internet.',
      fix:     'Complete the address-associate step per docs.lium.io; verify executor external port from a different network.' },
    { symptom: 'Score drops to floor after a probe',
      cause:   'GPU class mismatch — advertised H100 but the silicon is virtualized or partitioned.',
      fix:     'Move to bare-metal hardware (Hetzner, Latitude, FluidStack bare-metal). Re-register the executor.' },
    { symptom: 'docker compose fails to start',
      cause:   '.env missing required keys or HOST_WALLET_DIR points at the wrong path.',
      fix:     'Re-check `.env.template` against your `.env`; ensure HOST_WALLET_DIR resolves to a directory containing your wallets.' },
    { symptom: 'Registration fails',
      cause:   'Burn-cost spike at registration time.',
      fix:     'Re-check burn-cost immediately before running `btcli subnet register`; retry when it cools.' },
  ],

  notes: [
    'Active code lives at Datura-ai/compute-subnet — the lium-io repo is the marketing surface and points there for setup.',
    'Reward tiers (GPU class → score multiplier) live in neurons/validators/src/services/const.py.',
    'Renters use lium-cli (`pip install lium-cli`) — useful to install yourself to dogfood your executor.',
  ],
};
