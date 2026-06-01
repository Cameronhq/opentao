import type { RichPlaybook } from '../playbook-rich';

// SN128 — ByteLeap. Decentralized GPU cloud with VM-level orchestration.
// Miner = controller node connected to one or more GPU workers via WebSocket
// (1:N topology, max 100 workers per miner). Scoring is 100% lease revenue
// times an availability multiplier (169-hour online window).

export const sn128: RichPlaybook = {
  slug: '128-byteleap',
  netuid: 128,
  name: 'ByteLeap',
  category: 'compute',
  categoryLabel: 'Compute · GPU cloud',

  blurb:
    'Decentralized GPU cloud with VM-level orchestration (mTLS + GPU passthrough). Miner = controller connected to N workers via WebSocket (max 100 workers per miner). Scored 100% by active lease revenue × a 169-hour availability multiplier.',

  whatMinersDo:
    "A ByteLeap miner runs `scripts/run_miner.py` as the controller and accepts WebSocket connections from one or more GPU workers (separate `byteleap-Worker` repo). The controller registers on SN128, listens to validator challenges and lease requests, and routes workloads down to the workers via the VM Gateway (mTLS-authenticated, dynamic VM creation with GPU passthrough). Earnings = active lease revenue (real buyers paying for GPU time) plus per-tempo emission, weighted by a 169-hour uptime multiplier. Idle workers score zero.",

  verifiedAt: '2026-06-01',
  verifiedBy: '@editorial',

  emission: '— τ/day',
  burnCostFallback: '— τ',
  minerCountFallback: 0,
  slotCap: 256,

  hardware: [
    {
      role: 'Controller (miner) node',
      count: '1',
      cpuCores: 4,
      ramGb: 16,
      diskGb: 100,
      bandwidth: 'public IP · port 7799 (WebSocket) open',
      notes: 'Python 3.8+. Runs scripts/run_miner.py with config/miner_config.yaml. No GPU on the controller; just network + state for the worker fleet.',
    },
    {
      role: 'GPU worker node',
      count: '1–100 per miner',
      gpu: 'RTX 3090 / 4090 / 5090 (consumer) or A100 / H100 / H200 / B200 (enterprise)',
      vramGb: 80,
      cpuCores: 16,
      ramGb: 128,
      diskGb: 1000,
      bandwidth: 'public IP · GPU passthrough capable',
      notes: 'Workers run the separate byteleap-Worker repo and connect to the controller via WebSocket. VM Gateway expects real PCIe GPUs — virtualised/shared GPUs will likely fail mTLS / passthrough.',
    },
  ],
  hardwareNote:
    "1:N controller-to-worker topology with a 100-worker cap per miner. Consumer GPUs (3090/4090/5090) are eligible; enterprise (A100/H100/H200/B200) get higher-value leases. Bare-metal preferred for GPU passthrough reliability.",

  rentalOk: true,
  rentalNote: 'Rentals from bare-metal providers work; virtualised GPUs may fail the passthrough check. Prefer dedicated hardware.',
  rentalUsdPerHr: { lambda: 1.99, runpod: 1.89, coreweave: 2.10 },

  repo: {
    url: 'https://github.com/byteleapai/byteleap-Miner',
    branch: 'main',
    minerEntrypoint: 'scripts/run_miner.py',
    extraRepos: [
      { name: 'byteleap-Worker', url: 'https://github.com/byteleapai', purpose: 'GPU worker daemon (separate repo) — required on every GPU box that connects back to the controller' },
    ],
  },

  setupShape: 'docker-compose',
  setupOverview:
    "Stand up a small controller VM, install the Python deps, edit `config/miner_config.yaml` (netuid 128, finney, validator whitelist, WebSocket host/port 7799), register on SN128, and start `scripts/run_miner.py` under PM2. Bring up byteleap-Worker on each GPU box pointing at the controller's WebSocket endpoint.",

  install: [
    { step: 'Clone the miner repo',
      cmd:  'git clone https://github.com/byteleapai/byteleap-Miner && cd byteleap-Miner' },
    { step: 'Create venv and install',
      cmd:  'python3 -m venv venv && source ./venv/bin/activate && pip install -r requirements.txt' },
    { step: 'Edit miner_config.yaml',
      cmd:  'vi config/miner_config.yaml',
      note: 'Defaults: netuid=128, network=finney, sync_interval=60. Wallet name=miner / hotkey=default. Worker WebSocket host=0.0.0.0 port=7799. Three whitelisted validator addresses are pre-set; validator_min_stake_tao=10000 for non-whitelisted.' },
    { step: 'Register hotkey on SN128',
      cmd:  'btcli subnet register --netuid 128 --wallet.name $WALLET --wallet.hotkey $HOTKEY',
      note: 'Re-check burn cost on taostats.io/subnets/128 immediately before this.' },
    { step: 'Install PM2 for production',
      cmd:  'npm install -g pm2',
      note: 'Documented production process manager.' },
    { step: 'Deploy byteleap-Worker on each GPU box',
      note: 'Separate repo (byteleap-Worker). Each worker connects back to the controller via WebSocket. Max 100 workers per miner.' },
  ],

  runSteps: [
    { step: 'Run miner (development)',
      cmd:  'python scripts/run_miner.py --config config/miner_config.yaml' },
    { step: 'Run miner (production via PM2)',
      cmd:  'pm2 start ecosystem.config.js',
      note: 'Documented production launch — auto-restart, log rotation.' },
    { step: 'Connect each worker',
      note: 'Start byteleap-Worker on every GPU box. Each connects to ws://<controller-ip>:7799 and reports GPU inventory.' },
    { step: 'Verify on the metagraph',
      cmd:  'btcli subnet metagraph --netuid 128',
      note: "Confirm UID, and watch incentive accrue as workers come online and accept leases." },
  ],

  envVars: [
    { name: 'WALLET',  description: 'Coldkey name (matches btcli wallet list; default in config = "miner")', required: true },
    { name: 'HOTKEY',  description: 'Hotkey name (default in config = "default")',                            required: true },
  ],

  scoring: {
    summary:
      "Scoring is 100% lease revenue (real buyers paying for compute through the VM Gateway), multiplied by an availability multiplier based on a 169-hour online window. Idle workers score zero. Max 100 workers per miner; final score caps at 100. Validators verify outputs via computational challenges, but the bulk of the score comes from completed buyer leases.",
    rule: 'Get GPUs online, keep them up, accept and complete real buyer leases through the VM Gateway.',
    sourcePath: 'byteleapai/byteleap-Miner · neurons/miner/ + neurons/shared/',
    cheatPath:
      "Claiming hardware you don't have fails the GPU-passthrough verification step inside the VM Gateway. Sub-leasing through a centralised cloud often fails latency / cost / reliability checks. Targeting only easy challenges and refusing real workloads is demoted because lease completion dominates scoring.",
  },

  profitability: {
    estimatedDailyEmissionPerUid: 0.0,
    tokenPriceUsdFallback: 284,
    capexNote:
      'Heavy capex if you own hardware (especially H100/H200/B200 boxes). Consumer GPUs (3090/4090/5090) lower the bar substantially but earn smaller leases. 100-worker cap means a well-run operator can scale to a meaningful fleet on one UID.',
    notes:
      'Lease revenue dominates scoring — operators who can attract and retain buyers (uptime, latency, capacity) win. The 1,216-GPU platform metric reported in 2025·Q4 suggests live workloads are real, not just benchmark farming.',
  },

  milestones: [
    { day: 'day 1',  target: 'Controller up, first worker connected',
      note: 'config/miner_config.yaml validated, scripts/run_miner.py running, one byteleap-Worker reporting in via WebSocket.' },
    { day: 'day 3',  target: 'First validator challenge served',
      note: 'Heartbeat + task_poll both green. Computational challenges arriving on the 60s / 30s schedule from config.' },
    { day: 'day 7',  target: 'First lease completed',
      note: 'A real buyer leases your worker. Lease revenue starts feeding into score.' },
    { day: 'day 14', target: 'Multiple workers, stable uptime',
      note: 'Approaching the 169-hour availability window. Multiplier starts to compound.' },
    { day: 'day 30', target: 'Break-even on opex',
      note: 'Lease + emission revenue ≥ daily hardware cost. Top-quartile miners with H100-class workers reach this faster.' },
  ],

  monitoring: [
    { metric: 'WebSocket port 7799 open',     threshold: '100%',         where: 'curl test from a worker box' },
    { metric: 'Worker heartbeats',            threshold: 'every 30s',    where: 'controller logs · config sets worker heartbeat interval/timeout' },
    { metric: 'Lease completion rate',        threshold: '100%',         where: 'controller logs + Bittensor weights' },
    { metric: 'GPU passthrough health',       threshold: 'all workers',  where: 'nvidia-smi on each worker · VM Gateway logs' },
    { metric: 'Per-tempo incentive',          threshold: 'rising or flat',where: 'btcli subnet metagraph --netuid 128' },
  ],

  knownIssues: [
    {
      symptom: 'Workers connect but never receive leases',
      cause:   "Validator whitelist or stake threshold rejecting your axon, or GPU passthrough check failing.",
      fix:     'Confirm validator_min_stake_tao = 10000 still matches active validators in config. Verify each worker passes a manual GPU passthrough test before joining.',
    },
    {
      symptom: 'Heartbeat timeouts evict workers from the fleet',
      cause:   "Network instability or worker_heartbeat_timeout (default 90s) too tight for your link.",
      fix:     'Stabilise the link (dedicated public IP, not behind double-NAT). Tune heartbeat interval/timeout in config if your topology demands it.',
    },
    {
      symptom: '169-hour availability multiplier never matures',
      cause:   "Workers churning off and on — uptime resets the window.",
      fix:     'Treat the worker fleet like prod infrastructure: monitoring, alerting, restart-on-failure. The multiplier compounds with continuous uptime.',
    },
    {
      symptom: 'Final score caps below expectation',
      cause:   "Score caps at 100 across all workers; max 100 workers per miner. Adding worker #101 buys nothing on the same UID.",
      fix:     'Run a second hotkey only after the first is saturated. Self-cannibalisation is a real risk — verify per-UID math before splitting fleet.',
    },
    {
      symptom: 'PM2 process dies under load',
      cause:   "ecosystem.config.js defaults may not handle 100-worker fan-out.",
      fix:     "Tune PM2 max_memory_restart and worker concurrency; consider running scripts/run_miner.py under systemd for higher reliability.",
    },
  ],

  notes: [
    'Three layers: workers (raw GPUs) + VM Gateway (mTLS, GPU passthrough, dynamic VM creation) + buyer/lease layer.',
    'Worker repo is separate (byteleap-Worker). Read its README before sizing GPU hardware.',
    'Scoring is 100% lease revenue × 169h availability multiplier — uptime is structural, not optional.',
    'Hardware lineup spans consumer (3090/4090/5090) through enterprise (A100/H100/H200/B200); pick GPUs that match the lease demand you expect to see.',
  ],
};
