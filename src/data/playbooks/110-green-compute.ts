import type { RichPlaybook } from '../playbook-rich';

// SN110 — Green Compute. Operated under the "Green Compute" brand.
// Decentralized GPU inference marketplace where only renewable-powered miners earn.
// Green-verified nodes get a 1.5× emission multiplier; energy attestation is a
// hard gate, not a bonus. Public GitHub repo for miner code not publicly indexed
// as of June 2026 — operators onboard through the green-compute.com onboarding flow.

export const sn110: RichPlaybook = {
  slug: '110-green-compute',
  netuid: 110,
  name: 'Green Compute',
  category: 'compute',
  categoryLabel: 'Compute',

  blurb:
    'Renewable-only GPU inference marketplace. RTX 4090/5090 miners on biogas/solar/hydro/wind/geothermal serve OpenAI-compatible inference; green-verified nodes earn a 1.5× emission multiplier.',

  whatMinersDo:
    "Run RTX 4090 (24GB) or 5090 (32GB) GPUs on verifiably renewable power and serve OpenAI-compatible chat, code, and image-gen inference. The validator probes you with realistic API calls and grades latency, throughput, model coverage, and uptime. The hard gate is the energy attestation — carbon-registry certificates plus hardware-location proofs. No proof, no payout; lying about source drops your weight to zero.",

  verifiedAt: '2026-06-01',
  verifiedBy: '@editorial',

  emission: '— τ/day',
  burnCostFallback: '— τ',
  minerCountFallback: 0,
  slotCap: 256,

  hardware: [
    {
      role: 'GPU node',
      count: '1+ per UID',
      gpu: 'RTX 4090 24GB or RTX 5090 32GB',
      vramGb: 32,
      cpuCores: 16,
      ramGb: 64,
      diskGb: 500,
      bandwidth: 'static public IP · 1 Gbps · low-latency uplink',
      notes: 'Hardware must be physically located at a renewable-power site (biogas farm / solar array / hydro / wind / geothermal) and pass carbon-registry attestation plus on-site or location-proof verification.',
    },
  ],
  hardwareNote:
    'Posted rental floor on the marketplace is $0.40/GPU-hr for 4090 and $0.70/GPU-hr for 5090. UK biogas farms are the launch cohort; other renewable sources accepted with attestation.',

  rentalOk: false,
  rentalNote:
    'Hyperscaler rentals fail the energy-attestation step — the audit pipeline includes carbon-registry certificates and hardware-location proofs that grey-grid GPUs cannot produce. You must operate at a verified renewable-power site.',

  repo: {
    url: 'https://www.green-compute.com/',
    branch: 'main',
    minerEntrypoint: 'onboarding via operator (no public miner repo as of June 2026)',
  },

  setupShape: 'simple-binary',
  setupOverview:
    "Onboarding goes through the Green Compute operator. You submit your site (energy source, hardware roster, location proofs), pass the audit, then receive the miner stack to install on your 4090/5090 fleet. The runtime exposes OpenAI-compatible endpoints; the operator handles the protocol-level integration with validator probes.",

  install: [
    { step: 'Apply for miner onboarding at green-compute.com',
      note: 'Provide site details: energy source, GPU inventory, network setup, expected uptime.' },
    { step: 'Submit energy attestation evidence',
      note: 'Carbon-registry certificates, utility bills or on-site meter readings, and a physical-location proof (operator may dispatch an auditor).' },
    { step: 'Receive miner stack from operator + register hotkey',
      cmd:  'btcli subnet register --netuid 110 --wallet.name $WALLET --wallet.hotkey $HOTKEY',
      note: 'Check current burn-cost on taostats.io/subnets/110 before registering.' },
    { step: 'Install GPU drivers + CUDA + model serving runtime',
      note: 'CUDA 12.x and the operator-provided serving stack (likely vLLM/SGLang-based for LLM SKUs and a ComfyUI/diffusers stack for image models).' },
  ],

  runSteps: [
    { step: 'Start the miner endpoint',
      note: 'Follow the operator-provided runbook to launch the OpenAI-compatible inference server on each GPU node and register it with the validator stack.' },
    { step: 'Verify on metagraph',
      cmd:  'btcli subnet metagraph --netuid 110',
      note: 'Find your hotkey, confirm UID assignment, watch for incentive > 0 within the first few tempos.' },
  ],

  envVars: [
    { name: 'WALLET',  description: 'Coldkey name (matches btcli wallet list)', required: true },
    { name: 'HOTKEY',  description: 'Hotkey name on that coldkey',              required: true },
  ],

  scoring: {
    summary:
      'Validators dispatch OpenAI-compatible chat / image-gen calls and grade first-token latency, total throughput, output quality, uptime, and model coverage. Energy attestation is a multiplicative gate — fail it and emission drops to zero; pass it and verified-green nodes earn a 1.5× emission multiplier.',
    rule: 'Be fast, accurate, broadly stocked across models, and provably running on renewable power.',
    cheatPath:
      "Don't try to plug 4090s into the grey grid and lie about biogas — on-site or location-proof audits catch it and the attestation gate zeroes your weight. Don't run rented hyperscaler 4090s either; you can't produce the location proof.",
  },

  profitability: {
    estimatedDailyEmissionPerUid: 0.0,
    tokenPriceUsdFallback: 284,
    capexNote:
      'A new 4090 runs ~$1.6k–$2.0k, a 5090 ~$2.0k–$2.5k. Biggest variable cost is electricity — biogas farms with on-site generation have effectively free fuel, which is the wedge. Standard grid power makes the unit economics much tighter.',
  },

  milestones: [
    { day: 'day 1',  target: 'Site audited, hotkey registered, miner online',
      note: 'Energy attestation cleared; UID assigned; first probes landing on the inference endpoint.' },
    { day: 'day 7',  target: 'Steady incentive in the live cohort',
      note: 'Green multiplier applied; latency and throughput stable; output quality grading consistent.' },
    { day: 'day 30', target: 'Break-even on opex',
      note: 'With biogas-floor power, daily TAO emission should exceed daily server + maintenance cost. Grid-powered miners will struggle here.' },
  ],

  monitoring: [
    { metric: 'GPU utilization under load',  threshold: '> 60%',           where: 'nvidia-smi · low util means idle GPUs burning capex' },
    { metric: 'First-token latency',         threshold: '< 2 s',           where: 'inference server logs · validator scoring axis' },
    { metric: 'Inference endpoint uptime',   threshold: '> 99.5%',         where: 'pm2 / systemd + operator dashboard' },
    { metric: 'Per-tempo incentive',         threshold: 'rising or flat',  where: 'btcli subnet metagraph --netuid 110 every ~72 min' },
    { metric: 'Energy attestation status',   threshold: 'verified',        where: 'Green Compute operator dashboard — re-audit cadence varies' },
  ],

  knownIssues: [
    {
      symptom: 'Energy attestation fails → emission stays at 0',
      cause:   'Site cannot produce the carbon-registry certificates and/or location proofs the operator requires.',
      fix:     'Engage with the operator early; biogas/solar/hydro/wind/geothermal need different evidence packs. Without attestation there is no scoring path on SN110.',
    },
    {
      symptom: 'Latency grading bad despite local GPU being idle',
      cause:   'Network path between your site and validators is high-latency — common for rural biogas farms.',
      fix:     'Add a CDN-style edge proxy or move the inference endpoint behind a low-latency uplink. First-token latency is graded directly.',
    },
    {
      symptom: 'Quality grading low across image-gen calls',
      cause:   'Model SKUs out of date or default sampler settings off-spec.',
      fix:     "Pin model versions to the operator's recommended set (Llama 3.x / Qwen / Mistral / FLUX.1) and match sampler defaults.",
    },
  ],

  notes: [
    'Mainnet production launched April 2026 after a February 2026 testnet phase. First miner cohort is UK biogas farms.',
    'Customers pay in fiat; the operator converts to TAO on the open market and announces buyback transactions publicly.',
    'No public miner GitHub repo is indexed as of June 2026 — onboarding runs through the operator at green-compute.com.',
  ],
};
