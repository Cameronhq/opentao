import type { RichPlaybook } from '../playbook-rich';

// SN105 — Beam. Yuma Group's decentralized bandwidth coordination layer.
// Public miner repo was not located via opentao search at time of writing
// ("beam bittensor subnet 105" returns 0 results on GitHub). Architecture
// below reflects the public Yuma Group / Beam Network announcement and
// LinkedIn launch post.

export const sn105: RichPlaybook = {
  slug: '105-beam',
  netuid: 105,
  name: 'Beam',
  category: 'data',
  categoryLabel: 'Data',

  blurb:
    'Decentralized bandwidth coordination. Miners (workers) accept data-transfer jobs from validators (orchestrators), move bytes across cloud storage / APIs, and earn TAO for Proof-of-Bandwidth–verified delivery.',

  whatMinersDo:
    "A Beam miner runs a bandwidth worker that accepts transfer tasks — source URL/store, destination, and route constraints — from validator orchestrators. The worker pulls from source, pushes to destination across the requested route, and returns delivery receipts plus byte/latency telemetry. Proof-of-Bandwidth is the scoring signal: bytes moved, latency, and route correctness, all anchored to audit markers the orchestrator placed into the transfer. Network quality matters far more than GPU class — this is a bandwidth subnet, not a compute subnet.",

  verifiedAt: '2026-06-01',
  verifiedBy: '@editorial',

  emission: '— τ/day',
  burnCostFallback: '— τ',
  minerCountFallback: 0,
  slotCap: 256,

  hardware: [
    {
      role: 'Bandwidth worker',
      count: '1',
      cpuCores: 4,
      ramGb: 8,
      diskGb: 500,
      bandwidth: 'symmetric 1 Gbps+, unmetered uplink strongly preferred',
      notes: 'No GPU. Uplink, peering, and unmetered bandwidth dominate scoring. A home-fiber line with symmetric gigabit will out-earn a Hetzner box on a tight egress budget.',
    },
  ],
  hardwareNote:
    "Disk is for transient buffering, not storage. The binding cost item for miners is the bandwidth contract — pick a host or ISP with a generous (ideally unmetered) egress allowance before going live.",

  rentalOk: true,
  rentalUsdPerHr: { lambda: 0.20, runpod: 0.15, coreweave: 0.25 },
  rentalNote:
    'Rental is fine for the compute, but the binding spend is bandwidth — get a clear quote on monthly egress from whichever provider you pick. Home fiber with unmetered gigabit usually beats cloud egress economics.',

  repo: {
    url: 'https://yumaai.com/subnets',
    branch: 'main',
    extraRepos: [
      { name: 'Beam Network (LinkedIn)', url: 'https://www.linkedin.com/company/beam-network', purpose: 'Official Beam Network entity that announced SN105 launch' },
      { name: 'Beam landing',            url: 'https://b1m.ai/',                                purpose: 'Beam product page (subnet 105)' },
    ],
  },

  setupShape: 'simple-binary',
  setupOverview:
    "Setup is the standard Bittensor template — clone the worker, install deps, set wallet env vars, register your hotkey on SN105, then point the worker at the orchestrator. The operational discipline is bandwidth: cleanly measure your uplink ceiling before sizing how much traffic you sign up for.",

  install: [
    { step: 'Provision a high-uplink node',
      note: 'Symmetric 1 Gbps+ uplink with unmetered bandwidth is the practical floor — anything less starves the worker.' },
    { step: 'Clone the Beam worker repo (when published)',
      cmd:  'git clone https://github.com/yuma-group/beam-worker && cd beam-worker',
      note: 'Canonical repo URL will be confirmed when Yuma Group publishes the public miner code; the Yuma Group subnet portfolio page is the canonical pointer.' },
    { step: 'Install Python deps in a venv',
      cmd:  'python -m venv .venv && source .venv/bin/activate && pip install -e .' },
    { step: 'Copy and edit .env',
      cmd:  'cp .env.example .env && $EDITOR .env',
      note: 'Set WALLET / HOTKEY / NETUID=105 plus the orchestrator endpoint URL Beam publishes.' },
    { step: 'Register your hotkey on SN105',
      cmd:  'btcli subnet register --netuid 105 --wallet.name $WALLET --wallet.hotkey $HOTKEY' },
  ],

  runSteps: [
    { step: 'Start the bandwidth worker',
      cmd:  'python -m neurons.miner --netuid 105 --wallet.name $WALLET --wallet.hotkey $HOTKEY' },
    { step: 'Confirm first transfers + Proof-of-Bandwidth telemetry',
      note: 'Logs should show: orchestrator task received → bytes pulled from source → pushed to destination → receipts + telemetry returned → score.' },
    { step: 'Watch metagraph',
      cmd:  'btcli subnet metagraph --netuid 105' },
  ],

  envVars: [
    { name: 'WALLET',           description: 'Coldkey name',                                       required: true },
    { name: 'HOTKEY',           description: 'Hotkey name',                                        required: true },
    { name: 'NETUID',           description: 'Subnet UID — 105 for Beam',                          required: true },
    { name: 'ORCHESTRATOR_URL', description: 'Validator orchestrator endpoint (Beam-published)',   required: true },
  ],

  scoring: {
    summary:
      "Proof-of-Bandwidth — validators score miners on measurable delivery (throughput, latency, route correctness) against audit markers placed into each transfer by the orchestrator. 'I moved bytes' is never self-reported; the marker has to come back from the destination side.",
    rule:
      'Earn by delivering real, verifiable bandwidth across the requested routes. Concentrated, persistent uplink with low latency is the operational profile that wins.',
    cheatPath:
      "Three classic attacks. (1) Report fake delivery — defeated by destination-side audit markers. (2) Take the cheap/slow route instead of the requested one — defeated by latency and route telemetry. (3) Sybil identities each claiming a slice of the same transfer — defeated by validator-issued task assignment. Subtler: collusion between orchestrators and friendly workers, bounded by Yuma's consensus median.",
  },

  profitability: {
    estimatedDailyEmissionPerUid: 0.0,
    tokenPriceUsdFallback: 284,
    capexNote:
      'Capex-light on hardware ($20-60/mo for a small box); the real recurring cost is bandwidth — budget egress carefully.',
    notes:
      'Early-launch subnet — per-UID emission not stable enough to estimate. The unit economics get interesting only once enough cloud workloads are routing through Beam to keep workers near uplink saturation.',
  },

  milestones: [
    { day: 'day 1', target: 'Worker connected, first transfer task accepted', note: 'Logs show a complete task → transfer → receipt → score cycle.' },
    { day: 'day 3', target: 'Proof-of-Bandwidth acceptance > 95%',           note: 'If rejections are common, check destination-side audit-marker delivery and route compliance.' },
    { day: 'day 7', target: 'Out of immunity, incentive non-zero',           note: 'btcli subnet metagraph --netuid 105 shows a rising incentive.' },
    { day: 'day 14', target: 'Sustained throughput near your uplink ceiling',note: 'If you are far from your link ceiling, the orchestrator may be under-allocating — confirm health metrics and worker capacity reporting.' },
  ],

  monitoring: [
    { metric: 'Uplink utilisation under load',     threshold: '> 50% of ceiling',where: 'iftop / cloud provider dashboards' },
    { metric: 'Proof-of-Bandwidth acceptance rate', threshold: '> 95%',          where: 'Worker logs' },
    { metric: 'Route compliance score',            threshold: '100%',            where: 'Worker logs' },
    { metric: 'Per-tempo incentive',               threshold: 'rising or flat',  where: 'btcli subnet metagraph --netuid 105' },
  ],

  knownIssues: [
    {
      symptom: 'Worker accepts tasks but throughput stays low',
      cause:   'ISP traffic shaping or asymmetric uplink — common on residential connections.',
      fix:     'Run a clean iperf3 to a public server in the orchestrator region; if shaped, switch host or contract a business-class line.',
    },
    {
      symptom: 'Route compliance score drops below 100%',
      cause:   "Worker is taking a cheaper / different route than the one specified — usually a misconfigured proxy or VPN in the network path.",
      fix:     'Audit the outbound route (mtr / traceroute), remove any proxy/VPN layers the worker is unintentionally inheriting.',
    },
  ],

  notes: [
    'Operated under the Yuma Group; canonical public miner repo URL pending. Re-check yumaai.com/subnets and the Beam Network LinkedIn / b1m.ai page for the latest pointer before any capex.',
    'The competition here is "build your own multi-cloud egress arbitrage" — your reference benchmark is AWS/GCP egress pricing, not other subnets.',
  ],
};
