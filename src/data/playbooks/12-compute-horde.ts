import type { RichPlaybook } from '../playbook-rich';

// SN12 — Compute Horde (Backend Developers Ltd). Trusted GPU compute.
// Miner runs the miner-runner Docker image installed via install_miner.sh.
// Each miner spawns one-shot executor VMs. Default hw class: A6000.

export const sn12: RichPlaybook = {
  slug: '12-compute-horde',
  netuid: 12,
  name: 'Compute Horde',
  category: 'compute',
  categoryLabel: 'Compute (GPU)',

  blurb:
    "Run the miner-runner Docker stack on an A6000-class GPU box installed via the upstream install_miner.sh. Miner spawns one-shot executor VMs for validator-issued docker jobs; scoring is peak-cycle throughput.",

  whatMinersDo:
    "A Compute Horde miner runs three services on a GPU host (Runner orchestrator + PostgreSQL + Redis), deployed via the upstream install_miner.sh script which provisions everything over SSH. Validators issue dockerised compute jobs (often real workloads from other subnets) and the miner spawns one-shot executor VMs that run each job in a fresh sandbox and tear it down. Scoring rewards consistent peak-cycle throughput — miners that scale executor count up during high-demand windows beat those that run a flat baseline. The default executor manager is explicitly 'not intended for mainnet use'; competitive miners build custom executor managers.",

  verifiedAt: '2026-06-01',
  verifiedBy: '@editorial',

  emission: '— τ/day',
  burnCostFallback: '— τ',
  minerCountFallback: 0,
  slotCap: 256,

  hardware: [
    {
      role: 'GPU node (miner + executors)',
      count: '1+',
      gpu: 'A6000 48GB (default supported class; A100 in integration)',
      vramGb: 48,
      cpuCores: 16,
      ramGb: 64,
      diskGb: 500,
      bandwidth: 'public IP · SSH access for installer · open ports for trusted miner endpoint',
      notes: 'A6000 is the default supported hardware class. A100 integration is in progress. Multiple executors can run per machine via custom executor managers; default executor manager only runs one and is not competitive.',
    },
  ],
  hardwareNote:
    "Compute scaling is via custom executor managers, not just hardware. Doubling GPUs only helps if your executor manager can spin up parallel executors and tear them down quickly. The README is explicit: 'The competitive edge lies in optimising executor provisioning.'",

  rentalOk: true,
  rentalNote: 'Bare-metal A6000s on Hetzner / Latitude / FluidStack are best. Standard rented A6000 from RunPod/Lambda also works; no GPU attestation like Chutes.',
  rentalUsdPerHr: { lambda: 0.79, runpod: 0.69, coreweave: 0.85 },

  repo: {
    url: 'https://github.com/backend-developers-ltd/ComputeHorde',
    branch: 'master',
    minerEntrypoint: 'miner-runner Docker image (provisioned by install_miner.sh)',
  },

  setupShape: 'fleet-k8s',
  setupOverview:
    'Single-command install via the upstream install_miner.sh, which provisions PostgreSQL, Redis, and the Runner service on your remote GPU host over SSH. After install, day-to-day work is operating (and ideally writing) a custom executor manager to spawn parallel one-shot executor VMs efficiently. Auto-update is built in via the miner-runner image.',

  install: [
    { step: 'Create + register hotkey on SN12', cmd: 'btcli subnet register --netuid 12 --wallet.name $WALLET --wallet.hotkey $HOTKEY' },
    { step: 'Provision an A6000-class GPU node', note: 'Public IP required, SSH access from your local machine, ports open per docs. Bare-metal preferred for stability.' },
    {
      step: 'Run the upstream installer from your local machine',
      cmd: 'curl -sSfL https://github.com/backend-developers-ltd/ComputeHorde/raw/master/install_miner.sh | bash -s - production $SSH_DESTINATION $HOTKEY_PATH',
      note: 'Replace $SSH_DESTINATION (e.g. username@1.2.3.4) and $HOTKEY_PATH (e.g. ~/.bittensor/wallets/$WALLET/hotkeys/$HOTKEY). Set TRUSTED_MINER_ADDRESS and TRUSTED_MINER_PORT locally before running.',
    },
    { step: 'Tune .env on the remote box if needed', note: 'Edit .env post-install to override defaults (HOST_VENDOR_DIR, EXECUTOR_MANAGER_CLASS_PATH, DYNAMIC_PRELOAD_DOCKER_JOB_IMAGES, etc.).' },
  ],

  runSteps: [
    { step: 'Verify containers are healthy', cmd: 'docker ps', note: 'Expect Runner, Postgres, Redis containers plus any executor stack. Use `docker compose logs -f` for tail.' },
    { step: 'Bounce the stack after .env changes', cmd: 'docker compose down --remove-orphans && docker compose up -d' },
    { step: 'Verify on the metagraph', cmd: 'btcli subnet metagraph --netuid 12' },
    { step: 'OPTIONAL: implement / point at a custom executor manager', note: 'Set EXECUTOR_MANAGER_CLASS_PATH to your implementation. Default manager runs single executor and is uncompetitive on mainnet.' },
  ],

  envVars: [
    { name: 'WALLET', description: 'Coldkey name', required: true },
    { name: 'HOTKEY', description: 'Hotkey name', required: true },
    { name: 'TRUSTED_MINER_ADDRESS', description: 'Address the trusted miner endpoint binds to (set locally before install)', required: true },
    { name: 'TRUSTED_MINER_PORT', description: 'Port for the trusted miner endpoint', required: true },
    { name: 'EXECUTOR_MANAGER_CLASS_PATH', description: 'Python path to your executor manager class (override default for mainnet)', required: false },
    { name: 'DYNAMIC_PRELOAD_DOCKER_JOB_IMAGES', description: 'Optional: pre-pull common job images to reduce executor cold-start latency', required: false },
    { name: 'HOST_VENDOR_DIR', description: 'Optional: vendor directory mounted into executors', required: false },
    { name: 'DOCKER_EXECUTORS_CONFIG_PATH', description: 'Optional: path to docker-side executor config', required: false },
  ],

  scoring: {
    summary:
      'Workload-driven. Validators issue dockerised compute jobs (often real workloads from other subnets), score output correctness, and measure executor throughput against the declared GPU class baseline. Peak demand cycles are weighted more heavily.',
    rule: 'Scale executor count up during high-demand windows; minimise waste during quiet periods. Output correctness is binary (right or wrong); throughput tie-breaks among correct miners.',
    cheatPath:
      'Returning fake outputs fails verification — validators check against expected results. Fake GPU capacity does not pass throughput baselines for the declared class. Going dark during peak cycles is explicitly penalised by the weighted-schedule scoring.',
  },

  profitability: {
    estimatedDailyEmissionPerUid: 0.0,
    tokenPriceUsdFallback: 284,
    capexNote:
      'Capex per A6000 box runs ~$1,500–$2,500/mo rented or ~$8k–$10k to own. ROI hinges entirely on your executor manager — top miners run dozens of parallel one-shot executors per box; default manager runs one and earns floor.',
    notes:
      "Modifying the miner code itself is discouraged — the README says 'the competitive edge lies in optimising executor provisioning.' Build a better executor manager, not a fork.",
  },

  milestones: [
    { day: 'day 1', target: 'Stack healthy, UID assigned, first executor spawn', note: 'docker ps clean, install_miner.sh finished cleanly, btcli metagraph shows UID. First validator job lands within a tempo.' },
    { day: 'day 3', target: 'Consistent executor throughput on benchmark', note: 'Throughput at or above A6000 baseline. If below, debug docker / nvidia runtime, kernel, NVMe I/O.' },
    { day: 'day 7', target: 'Custom executor manager live', note: 'Default manager → floor emission. Even a basic concurrent manager (2–4 parallel executors per GPU) materially improves score.' },
    { day: 'day 14', target: 'Out of immunity, surviving peak windows', note: 'Monitor peak-cycle response — emissions concentrate there.' },
  ],

  monitoring: [
    { metric: 'Executor success rate (correct outputs)', threshold: '100%', where: 'Runner logs · failed verifications are score-killers' },
    { metric: 'Peak-cycle executor count', threshold: 'matches demand', where: 'Custom executor manager metrics + docker ps · low peak count = lost emission' },
    { metric: 'GPU utilisation', threshold: '> 70% during peak cycles', where: 'nvidia-smi · idle GPUs during peak = wasted opex' },
    { metric: 'Per-tempo incentive', threshold: 'rising or flat', where: 'btcli subnet metagraph --netuid 12' },
  ],

  knownIssues: [
    { symptom: 'Score stuck at floor despite healthy stack', cause: 'Running default executor manager (single-executor) on mainnet.', fix: 'Implement or adopt a custom executor manager that spins up parallel executors. Read backend-developers-ltd code + community implementations.' },
    { symptom: 'Executor cold-start too slow, missing peak windows', cause: 'Image pulls happening per job.', fix: 'Set DYNAMIC_PRELOAD_DOCKER_JOB_IMAGES to pre-pull common images. Use local image cache + fast NVMe.' },
    { symptom: 'install_miner.sh hangs over SSH', cause: 'SSH key not configured for passwordless login on the target box.', fix: "Set up ssh-agent + ssh-copy-id before running; or `ssh username@host` first to accept fingerprint." },
    { symptom: 'Containers restart loop after upgrade', cause: 'Runner auto-update raced with executor jobs.', fix: '`docker compose down --remove-orphans && docker compose up -d` to clean restart. Check MINER_IMAGE_TAG in .env.' },
  ],

  notes: [
    'Lead voice is Rhef (operator Backend Developers Ltd).',
    "Compute Horde Facilitator SDK lets external (non-Bittensor) users submit jobs — extra demand surface for miners.",
    'Network was widely cited as ~$50–100M-equivalent supercomputer by mid-2024 with 1,000+ GPUs.',
  ],
};
