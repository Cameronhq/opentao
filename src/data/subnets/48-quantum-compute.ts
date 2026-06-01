import type { RichSubnet } from '../subnet-rich';

export const sn48: RichSubnet = {
  slug: '48-quantum-compute',
  netuid: 48,
  name: 'Quantum Compute',
  shortPitch: 'Decentralized marketplace turning quantum circuits into on-demand jobs.',
  overview: [
    'Quantum Compute (SN48) is the execution layer of qBitTensor Labs\' quantum stack on Bittensor. Anyone — from a hobbyist running Qiskit notebooks to an enterprise pricing exotic derivatives — can publish a circuit and have it solved by a distributed network of simulators and real QPU operators competing for emissions.',
    'Sister subnet SN63 (Quantum Innovate) chases algorithmic fidelity and research benchmarks; SN48 is the service plane. Miners are rewarded for reproducibility, availability, and end-to-end result quality, not just simulator scores. The economic loop is "deliver a working answer or get displaced from a 192-UID slot."',
    'The backbone is the Quantum Rings simulator, which has demonstrated circuit fidelities on par with actual hardware on certain workloads. Miners can also tap real QPUs through qBitTensor\'s pre-secured supplier agreements when a job warrants it, smoothing over the fact that fewer than 100 quantum machines exist on Earth.',
    'Quantum computers list at $5,000–$15,000/hr and gate-keep behind queue-heavy cloud portals. SN48 pitches itself as the open alternative — free or near-free quantum access for the long tail of researchers and developers. <a href="#customer" style="color: var(--accent);">See competitive landscape ↓</a>',
  ],
  cycle: {
    challenge: { actor: 'Validator', title: 'Publish circuit', body: 'Validators broadcast a parameterized quantum circuit job — gate sequence, shot count, observable to measure — sourced from buyers, benchmarks, or synthetic generators.', dataK: 'payload', dataV: 'OpenQASM circuit + shots' },
    compute:   { actor: 'Miner',     title: 'Execute & return', body: 'Miners run the circuit on the Quantum Rings simulator, alternative simulators, or real QPU backends. They return measurement distributions plus reproducibility metadata.', dataK: 'latency',  dataV: 'sub-minute for typical jobs' },
    score:     { actor: 'Validator', title: 'Compare results', body: 'Validators compare returned distributions against ground truth (analytical, ensemble median, or held-out hardware reference) using fidelity and availability checks.', dataK: 'scale',    dataV: 'multi-qubit circuits' },
    settle:    { actor: 'Subtensor', title: 'Yuma → emission', body: "Every validator's weights, multiplied by their stake, aggregated by Yuma into one reward vector. TAO mints to top miners.", dataK: 'tempo', dataV: '~72 min · 24×/day' },
  },
  miner: {
    does: 'Solves submitted quantum circuits and returns measurement distributions with proofs of which backend ran the job.',
    input: 'Validator-issued circuit job (gates, shots, observable).',
    output: 'Bitstring counts / expectation values + backend attestation.',
    hardware: 'High-RAM CPU for simulation; optional QPU API access (IBM, IonQ, etc.) for hardware-eligible jobs.',
    paidFor: 'Fidelity vs. ground truth, availability, and reproducibility across repeated probes.',
    paidVia: 'Per-tempo emission, score × validator stake',
  },
  validator: {
    does: 'Generates or relays buyer circuits, scores miner returns against trusted references, and publishes weights.',
    requires: 'Trusted reference solvers, statistical fidelity tooling, stable RPC.',
    output: 'Per-miner weight vector reflecting fidelity + uptime.',
    paidFor: 'Submitting weights that agree with consensus median',
    paidVia: 'Per-tempo emission, stake × consensus alignment',
  },
  scoring: {
    leadOneLine: 'Did your bitstring distribution match what the circuit should actually produce?',
    explanation: [
      'Each job has a ground-truth distribution — either analytically derivable, computed by a trusted reference, or aggregated from a hardware run. Validators compare a miner\'s returned counts to that distribution using fidelity-style metrics (Hellinger, total variation, or KL divergence depending on circuit type).',
      'Availability matters as much as accuracy. Miners that drop probes or stall are penalized; consistency across thousands of small probes is rewarded over occasional perfect runs. The design favors operators who keep a real, hot quantum backend wired up.',
    ],
    cheatPath: 'Returning a textbook ideal distribution without simulating won\'t survive — validators probe with parameterized circuits whose answers depend on actual computation.',
  },
  customer: {
    leadOneLine: 'Researchers and quants who need quantum cycles without IBM\'s queue or six-figure invoices.',
    explanation: [
      'Primary buyers are academic labs, chemistry/optimization researchers, and finance teams exploring quantum algorithms — groups that today either share scarce hardware credits or simulate on their own laptops. SN48 collapses the cost curve via competition between cheap simulators and on-demand QPU access.',
      'qBitTensor disclosed pre-secured QPU supply agreements and developer demand at launch, signaling B2B routing of the cheapest qualified backend per job rather than purely retail self-serve.',
    ],
  },
  competitive: {
    scope: '2026 · global · quantum compute access',
    rows: [
      { name: 'Quantum Compute', subtitle: 'SN48', isSelf: true, approach: 'Open marketplace; miners run simulators or proxy real QPUs; validators score on fidelity + availability.', access: 'open · API', accessTone: 'open', differentiator: 'Routes between sim and hardware per job; pays in TAO; no enterprise gatekeeper.' },
      { name: 'IBM Quantum',           approach: 'Centralized cloud access to IBM\'s superconducting QPUs with tiered queues.', access: 'closed · paid', accessTone: 'closed', differentiator: 'Real hardware-only; expensive; long queues for free tier.' },
      { name: 'AWS Braket',            approach: 'Managed access to multiple QPU vendors plus simulators, billed per task.', access: 'closed · paid', accessTone: 'closed', differentiator: 'Multi-vendor but locked behind AWS account and pay-per-second.' },
      { name: 'Azure Quantum',         approach: 'Microsoft\'s portal to Quantinuum, IonQ, Rigetti backends.', access: 'closed · paid', accessTone: 'closed', differentiator: 'Enterprise focused; not a marketplace.' },
      { name: 'SN63 Quantum Innovate', approach: 'Sister Bittensor subnet, optimized for algorithm research and benchmark fidelity.', access: 'open · API', accessTone: 'open', differentiator: 'Research-grade results, not a delivery service.' },
    ],
    note: 'SN48\'s wedge is that quantum is too rare and expensive to gate behind any one cloud. By incentivizing simulator-plus-hardware miners with TAO, it can price most workloads near zero while still routing the few jobs that demand silicon to real QPUs.',
  },
  team: {
    intro: [
      'qBitTensor Labs operates SN48 and its sister subnet SN63. The team is anchored by Bob Wold, who simultaneously runs Quantum Rings — the simulator company whose engine powers SN48 — out of the Colorado Quantum Incubator in Boulder.',
      'Beyond Wold, the team has worked with the Duality Quantum Accelerator and the Chicago Quantum Exchange, and collaborates with the OpenTensor Foundation on quantum-specific subnet primitives.',
    ],
    founders: [
      { initials: 'BW', gradient: 'v', name: 'Bob Wold', role: 'Founder & CEO, qBitTensor Labs', bio: '25-year tech leader; also Co-founder & CEO of Quantum Rings, the simulator stack integrated into SN48.' },
    ],
    size: '~5-10',
    founded: '2025',
    based: 'Boulder, CO',
    backers: 'Colorado Quantum Incubator; collaborations with OpenTensor Foundation, Duality Quantum Accelerator.',
    placeholder: false,
  },
  milestones: [
    { date: '2025·07', text: 'qBitTensor Labs launches its first quantum subnet on Bittensor.' },
    { date: '2025·Q4', text: 'Quantum Compute SN48 goes live with Quantum Rings simulator integration.' },
    { date: '2026·Q1', text: 'Pre-secured QPU supply agreements onboarded for hardware-eligible jobs.' },
  ],
  join: {
    title: 'Run a circuit, mint TAO.',
    body: 'Operators with simulator infra or QPU API credits can register a miner UID and start serving jobs. Buyers can publish circuits via qBitTensor\'s API and receive results without managing any quantum stack themselves.',
    asideNote: 'Hard cap of 192 miner UIDs per subnet — bottom rank gets evicted as new miners outscore them.',
  },
  tags: ['Quantum', 'Compute', 'Marketplace', 'Simulation'],
  external: {
    github: 'https://github.com/qbittensor-labs/quantum-compute',
    website: 'https://www.qbittensorlabs.com/quantum',
    twitter: 'https://x.com/qBitTensorLabs',
    taostats: 'https://taostats.io/subnets/48/',
  },
  tweets: [
    { when: '2025·07', body: 'On Monday July 7th, qBitTensor Labs will be launching Bittensor\'s first quantum subnet.' },
  ],
};
