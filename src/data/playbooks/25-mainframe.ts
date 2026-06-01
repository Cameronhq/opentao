import type { RichPlaybook } from '../playbook-rich';

// SN25 — Mainframe (formerly Protein-Folding). Source: github.com/macrocosm-os/mainframe README (2026-06).
// Core repos: macrocosm-os/mainframe (current subnet code) and macrocosm-os/folding (predecessor).
// Mainframe runs OpenMM molecular dynamics + DiffDock protein-ligand docking via a Global Job Pool;
// top-K (K=5) miners earn per challenge (80% to top, 20% across the remaining 4); identical results → zero.

export const sn25: RichPlaybook = {
  slug: '25-mainframe',
  netuid: 25,
  name: 'Mainframe',
  category: 'compute',
  categoryLabel: 'Decentralized science · molecular dynamics',

  blurb:
    'Decentralized scientific compute. Miners fold proteins via OpenMM molecular dynamics + dock ligands via DiffDock; validators rank by lowest free energy. Top-K=5 ranked, 80% reward to #1 and 20% spread across the other 4 — everyone else gets zero.',

  whatMinersDo:
    "A miner pulls challenges from the Global Job Pool (GJP), runs OpenMM molecular-dynamics simulations on local GPUs to find the lowest free energy configuration of the target protein (or runs DiffDock for protein-ligand docking), and posts the solution to S3 for the validator to score. Each miner uses a separate random seed to ensure parallel exploration of folding space; identical results submitted by multiple miners get zero reward. Validators verify the physics (energy conservation, geometry, convergence) against the OpenMM ground truth.",

  verifiedAt: '2026-06-01',
  verifiedBy: '@editorial',

  emission: '— τ/day',
  burnCostFallback: '— τ',
  minerCountFallback: 0,
  slotCap: 256,

  hardware: [
    {
      role: 'GPU miner',
      count: '1+',
      gpu: 'A100 / H100 strongly preferred (RTX 4090 viable for smaller jobs)',
      vramGb: 40,
      cpuCores: 16,
      ramGb: 64,
      diskGb: 500,
      bandwidth: 'standard + S3 upload bandwidth',
      notes: 'README quotes ~132,000 nsec/day across the subnet at ~17 petaflops — competitive throughput per miner requires datacenter GPUs. Miners are oversubscribed to jobs by design, so more GPUs → more parallel challenges → more chances at top-K.',
    },
  ],
  hardwareNote:
    'README explicitly notes "oversubscribed to jobs by design — effectively unbounded opportunity for those who can handle the computational workload." More GPU throughput per miner directly translates to more top-K finishes.',

  rentalOk: true,
  rentalUsdPerHr: { lambda: 1.10, runpod: 0.99, coreweave: 1.25 },

  repo: {
    url: 'https://github.com/macrocosm-os/mainframe',
    branch: 'main',
    minerEntrypoint: 'Per docs.macrocosmos.ai/subnets/subnet-25-mainframe',
    extraRepos: [
      { name: 'folding (predecessor)', url: 'https://github.com/macrocosm-os/folding', purpose: 'Original protein-folding subnet codebase (pre-rename)' },
      { name: 'Docs',                  url: 'https://docs.macrocosmos.ai/subnets/subnet-25-mainframe', purpose: 'Authoritative Mainframe miner / validator docs' },
      { name: 'Mainframe API',         url: 'https://docs.macrocosmos.ai/developers/api-documentation/sn25-mainframe', purpose: 'API consumer docs (customer side)' },
      { name: 'macrocosmos-py SDK',    url: 'https://github.com/macrocosm-os/macrocosmos-py', purpose: 'Public SDK for Macrocosmos APIs' },
      { name: 'Mainframe App',         url: 'https://app.macrocosmos.ai/mainframe', purpose: 'Web app surface for the subnet' },
      { name: 'Folding Dashboard',     url: 'https://www.macrocosmos.ai/sn25/dashboard', purpose: 'Validator–miner weights, throughput, energy efficiency' },
    ],
  },

  setupShape: 'simple-binary',
  setupOverview:
    'Miners clone the mainframe repo, set up a Python env (`.env.example` is included at repo root), provision GPU + OpenMM (and DiffDock for the docking task), then run the miner process which pulls jobs from the Global Job Pool and posts results to S3. Authoritative install steps live at docs.macrocosmos.ai/subnets/subnet-25-mainframe — the README points there as the canonical reference.',

  install: [
    { step: 'Clone the repo',
      cmd:  'git clone https://github.com/macrocosm-os/mainframe.git && cd mainframe' },
    { step: 'Copy and fill .env',
      cmd:  'cp .env.example .env',
      note: '.env.example ships at the repo root (332 bytes). Fill in wallet + network parameters per the docs.' },
    { step: 'Install Python deps + OpenMM + DiffDock',
      note: 'Follow docs.macrocosmos.ai/subnets/subnet-25-mainframe — concrete pinned versions live there.' },
    { step: 'Register hotkey on SN25',
      cmd:  'btcli subnet register --netuid 25 --wallet.name $WALLET --wallet.hotkey $HOTKEY' },
  ],

  runSteps: [
    { step: 'Start the miner',
      note: 'Concrete command per docs.macrocosmos.ai/subnets/subnet-25-mainframe — typically `python neurons/miner.py` patterned on Bittensor standards.' },
    { step: 'Confirm GJP pickup + S3 uploads',
      note: 'Watch logs for job-pull from the Global Job Pool, simulation start, and S3 upload of the trajectory.' },
    { step: 'Verify on dashboard',
      cmd:  'open https://www.macrocosmos.ai/sn25/dashboard',
      note: 'Interactive validator–miner weights, throughput, cost-per-fold metrics.' },
  ],

  envVars: [
    { name: 'WALLET',  description: 'Coldkey name (matches btcli wallet list)', required: true },
    { name: 'HOTKEY',  description: 'Hotkey name on that coldkey',               required: true },
    { name: 'S3_*',    description: 'S3 credentials for trajectory upload (per docs)',                   required: true },
  ],

  scoring: {
    summary:
      'Per the README: physical systems minimize energy, so the validator scores by lowest free energy on the returned configuration. Top-K (K=5) miners are ranked per challenge — 80% of the reward goes to #1, 20% spread across the other 4. Everyone outside the top-K earns zero on that challenge. Identical results submitted by multiple miners are zeroed out to incentivize unique exploration. Validators verify energy conservation, geometry constraints, and convergence vs known structures (RMSD where applicable).',
    rule: 'Find the lowest-free-energy configuration per challenge — be in the top-5 on energy with a UNIQUE solution.',
    sourcePath: 'macrocosm-os/mainframe + macrocosm-os/folding · validator scoring + Macrocosmos weight-transparency methodology',
    cheatPath:
      "Low-res interpolation of known structures → fails the trajectory-detail check. Skipping simulation timesteps → energy curves go non-physical and the validator catches it. Random-noise fake trajectories → fail geometry and convergence checks immediately. Identical results across miners → all of you get zero (uniqueness enforcement).",
  },

  profitability: {
    estimatedDailyEmissionPerUid: 0.0,
    tokenPriceUsdFallback: 284,
    capexNote:
      'GPU capex is the entire cost structure. Subnet hit 162,200 proteins folded since launch with ~17 petaflops effective — competitive throughput requires bare-metal A100 / H100 or 4090 fleets. The 80/20 split inside top-K and zero below means scaling GPU count is a more reliable path than tuning the simulator.',
    notes:
      'README emphasizes "miners are oversubscribed to jobs by design" — more GPU → more parallel challenges → more top-K opportunities. Distribution is heavy-tailed: top-1 per challenge gets 80%, next four split 20%, rest get nothing.',
  },

  milestones: [
    { day: 'day 1',  target: 'OpenMM + DiffDock environments built locally',
      note: 'Both stacks need to be installed and tested before pulling real GJP jobs.' },
    { day: 'day 3',  target: 'First job pulled from GJP + result uploaded to S3',
      note: 'Validator picks up the trajectory and scores it; even a non-top-K result confirms the pipeline.' },
    { day: 'day 7',  target: 'First top-5 finish',
      note: 'Top-5 on energy = real emission (4% if rank 5, scaling to 80% if rank 1).' },
    { day: 'day 14', target: 'Consistent top-K presence across challenges',
      note: 'Once the simulator + seed strategy are tuned, top-K starts to compound. Use unique seeds per challenge to avoid the identical-result penalty.' },
  ],

  monitoring: [
    { metric: 'Top-K finish rate (% of challenges)', threshold: '≥ 20%',        where: 'Mainframe dashboard / S3 result history' },
    { metric: 'GPU utilization',                       threshold: '> 80%',      where: 'nvidia-smi · idle GPUs cost opex with zero return' },
    { metric: 'S3 upload success',                     threshold: '100%',       where: 'Miner logs / S3 access logs' },
    { metric: 'Hotkey incentive',                       threshold: 'rising or flat', where: 'btcli subnet metagraph --netuid 25' },
  ],

  knownIssues: [
    {
      symptom: 'Top-K finish but reward zero',
      cause:   'Identical result to another miner — uniqueness enforcement zeros both.',
      fix:     'Use a different random seed per challenge. The README explicitly requires unique seeds so multiple miners explore different folding-space trajectories.',
    },
    {
      symptom: 'Trajectory rejected for non-physical energy',
      cause:   'Skipped timesteps or numerical instability in the simulation.',
      fix:     'Run OpenMM with the recommended integrator + timestep per the official docs; do not aggressively trim integration steps.',
    },
    {
      symptom: 'GJP returns no jobs',
      cause:   'Either you are not yet registered on the metagraph, or the pool is paused / rate-limited for your UID.',
      fix:     'Verify with `btcli subnet metagraph --netuid 25` that your hotkey is visible; check the Macrocosmos Discord / dashboard for pool status.',
    },
    {
      symptom: 'Slow simulation throughput',
      cause:   'Sub-optimal GPU choice (e.g. consumer GPU on a docking task that needs FP64 or large memory).',
      fix:     'A100 / H100 are strongly preferred. Mainframe is one of the most GPU-bound subnets — capex shows up directly in emissions.',
    },
  ],

  notes: [
    '162,200 proteins folded since launch — more in one year than Folding@Home folded in a decade per the README.',
    'Macrocosmos partners with Rowan Scientific on next-gen neural-network potentials (DFT data generation on Mainframe). Forbes coverage 2025-05-14.',
    'Subnet renamed from Protein-Folding → Mainframe in Q1 2025 as it expanded beyond protein folding to general life-sciences compute (DFT, etc.).',
    'Core team: Will Squires (CEO), Steffen Cruz (CTO, ex-OpenTensor Foundation CTO, architect of SN1 Apex), Brian McCrindle (Subnet Lead, ex-OpenTensor ML researcher), Szymon Fonau (Senior ML Engineer).',
    'Mainframe SDK + API are public via macrocosm-os/macrocosmos-py and docs.macrocosmos.ai/developers/api-documentation/sn25-mainframe — the customer-facing surface.',
  ],
};
