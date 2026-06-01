import type { RichPlaybook } from '../playbook-rich';

// SN48 — Quantum Compute (qBitTensor Labs / Open Quantum)
// Atypical subnet: miners must own/operate (or formally partner with) a real
// quantum computer. Software install is light; access to the QPU is the
// expensive prerequisite. Reach out to support@openquantum.com to onboard.

export const sn48: RichPlaybook = {
  slug: '48-quantum-compute',
  netuid: 48,
  name: 'Quantum Compute',
  category: 'compute',
  categoryLabel: 'Compute',

  blurb:
    'Marketplace turning quantum circuits into on-demand jobs. Mining requires real QPU access (owned or formally partnered).',
  whatMinersDo:
    "Receive validator-issued OpenQASM 2.0/3.0 circuits, execute them on a real quantum backend you own or are formally partnered with (no pure simulator-only mining), and return measurement distributions plus backend attestation. The miner repo is a thin Python harness — the real work is wiring a `ProviderAdapter` to your QPU's API.",

  verifiedAt: '2026-06-01',
  verifiedBy: '@editorial',

  emission: '— τ/day',
  burnCostFallback: '— τ',
  minerCountFallback: 0,
  slotCap: 192,

  hardware: [
    {
      role: 'Miner host (control)',
      count: '1',
      cpuCores: 2,
      ramGb: 8,
      diskGb: 100,
      bandwidth: 'reliable egress to your QPU provider',
      notes: 'No GPU. The host just brokers between the validator and the QPU API.',
    },
    {
      role: 'Quantum backend (QPU)',
      count: '1+ (owned or partnered)',
      cpuCores: 0,
      ramGb: 0,
      diskGb: 0,
      notes: 'Gate-based QPU executing OpenQASM 2.0/3.0. Onboarding gated by support@openquantum.com — no QPU, no mining.',
    },
  ],
  hardwareNote:
    'This is a credentialed-access subnet, not a hardware-spend subnet. The 2-vCPU host is trivial; QPU access is what gates entry.',

  rentalOk: true,
  rentalNote:
    'The control box can be any cheap VM. What you cannot rent is the QPU — qBitTensor explicitly requires that miners own/operate a quantum computer or have a documented formal partnership.',
  rentalUsdPerHr: { lambda: 0.10, runpod: 0.08, coreweave: 0.12 },

  repo: {
    url: 'https://github.com/qbittensor-labs/quantum-compute',
    branch: 'main',
    extraRepos: [
      { name: 'miner.md', url: 'https://github.com/qbittensor-labs/quantum-compute/blob/main/qbittensor/miner/miner.md', purpose: 'Official miner setup doc' },
    ],
  },

  setupShape: 'simple-binary',
  setupOverview:
    'Standard Bittensor neuron pattern: clone, venv, pip install, register, pm2 start. The non-standard piece is implementing a ProviderAdapter under qbittensor/miner/providers/ that bridges to your QPU vendor (IBM Quantum, IonQ, Rigetti, Quantinuum, or your own hardware). Without that adapter the miner has nothing to execute.',

  install: [
    { step: 'Check Python 3.11+', cmd: 'python3 --version' },
    { step: 'Create venv', cmd: 'python3 -m venv venv && source venv/bin/activate' },
    { step: 'Install Bittensor', cmd: 'pip install --upgrade bittensor bittensor-cli' },
    { step: 'Clone repo', cmd: 'git clone https://github.com/qbittensor-labs/quantum-compute.git && cd quantum-compute' },
    { step: 'Editable install', cmd: 'pip install -e .' },
    { step: 'Register hotkey', cmd: 'btcli subnet register --wallet.name $WALLET --wallet.hotkey $HOTKEY --netuid 48' },
    { step: 'Implement provider adapter', note: 'Add a file under qbittensor/miner/providers/ implementing the ProviderAdapter protocol for your QPU vendor.' },
    { step: 'Install pm2 (optional)', cmd: 'npm install -g pm2' },
  ],

  runSteps: [
    { step: 'Start miner under pm2',
      cmd: 'pm2 start --name sn48-miner python -- neurons/miner.py --wallet.name $WALLET --wallet.hotkey $HOTKEY --netuid 48 --subtensor.network finney --logging.trace' },
    { step: 'Tail logs', cmd: 'pm2 logs sn48-miner' },
    { step: 'Verify on metagraph', cmd: 'btcli subnet metagraph --netuid 48' },
  ],

  envVars: [
    { name: 'WALLET',   description: 'Coldkey name', required: true },
    { name: 'HOTKEY',   description: 'Hotkey name',  required: true },
    { name: 'PROVIDER', description: 'Adapter key selecting which entry in qbittensor/miner/providers/ to use', required: true },
  ],

  scoring: {
    summary:
      'Miners are judged on fidelity vs. ground-truth distribution + reproducibility + availability. The early-phase incentive structure is 90% burn / 10% to QPU operators; emissions scale up as Open Quantum onboards more paying users.',
    rule: 'Run real circuits on a real QPU, return faithful distributions, stay online. Score is fidelity × availability.',
    cheatPath:
      'Returning textbook ideal distributions without simulating will fail — validators probe with parameterized circuits whose answers depend on actual computation. Trying to pass off a classical simulator as a QPU will fail the partnership/operator vetting before you ever register.',
  },

  profitability: {
    estimatedDailyEmissionPerUid: 0.0,
    tokenPriceUsdFallback: 284,
    capexNote:
      'Capex is QPU-side, not miner-side. If you do not already have QPU access (own a machine or have a contract with IBM / IonQ / Rigetti / Quantinuum / D-Wave), this subnet is not for you.',
    notes:
      'Emissions start with 90% burn; rewards forwarded to a key controlled by Open Quantum operators and sold in USD to pay QPU providers. Treat any "τ/day" estimate as speculative until network demand picks up.',
  },

  milestones: [
    { day: 'day 0',   target: 'Email support@openquantum.com', note: 'You will not be onboarded without this step. Have your QPU paperwork ready.' },
    { day: 'day 1',   target: 'Adapter implemented + miner running', note: 'Logs show jobs flowing from validator → adapter → QPU → back.' },
    { day: 'day 7',   target: 'First emissions visible', note: 'Burn share is high early; expect modest absolute numbers until catalog demand picks up.' },
    { day: 'day 30',  target: 'Steady availability + low error rate', note: 'Validators care about reproducibility across thousands of small probes more than occasional perfect runs.' },
  ],

  monitoring: [
    { metric: 'Job success rate',      threshold: '> 98%',  where: 'Miner logs — adapter error counter' },
    { metric: 'Median job latency',    threshold: '< 60s typical', where: 'Miner logs' },
    { metric: 'QPU queue depth',       threshold: 'manageable', where: 'Your QPU vendor portal' },
    { metric: 'Per-tempo incentive',   threshold: 'rising or flat', where: 'btcli subnet metagraph --netuid 48' },
  ],

  knownIssues: [
    { symptom: 'Cannot register / no onboarding response',
      cause:   'You have not contacted support@openquantum.com or have not produced documentation of QPU access.',
      fix:     'Mining is gated. Email them, complete onboarding, then run the install.' },
    { symptom: 'Jobs time out',
      cause:   'QPU queue at your provider is saturated.',
      fix:     'Negotiate priority lane with vendor, or partner with a second QPU operator for redundancy.' },
    { symptom: 'Adapter import error at miner start',
      cause:   '$PROVIDER not set or adapter module not present at qbittensor/miner/providers/.',
      fix:     'Add your adapter file, ensure it implements ProviderAdapter, then `export PROVIDER=<key>`.' },
  ],

  notes: [
    'Early phase emits 90% burn, 10% to quantum compute providers; the share to providers grows as Open Quantum revenue grows.',
    'Sister subnet SN63 (Quantum Innovate) is research-focused; SN48 is the delivery service.',
    'OpenQuantum.com is the customer-facing surface and transacts in USD; the TAO layer is invisible to end users.',
  ],
};
