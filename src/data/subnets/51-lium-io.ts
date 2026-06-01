import type { RichSubnet } from '../subnet-rich';

export const sn51: RichSubnet = {
  slug: '51-lium-io',
  netuid: 51,
  name: 'lium.io',
  shortPitch: 'Permissionless GPU rental marketplace — the AWS of Bittensor.',
  overview: [
    'lium.io (SN51), operated by Datura, is a decentralized GPU rental marketplace. Miners contribute idle high-performance GPUs into a global pool; renters spin up boxes for ML training, inference, batch jobs, and data work — no KYC, no enterprise procurement loop, pay-as-you-go in TAO or fiat.',
    'The pricing wedge is severe: GPU rentals on Lium are advertised at up to 90% cheaper than the hyperscalers. That gap exists because Lium is matching renters against owners who already paid for the hardware (often crypto miners pivoting into AI compute), not against Amazon\'s capital stack and margin.',
    'The subnet has become one of the highest-emitting on Bittensor (roughly 6–7% of network emissions at peak), and Lium publicly disclosed ~$600/hour in usage revenue, ~$432k/month — the highest revenue among Bittensor subnets. The marketplace is real, with paying renters, not just emission farming.',
    'Validators continuously fingerprint miner hardware (real H100 vs. spoofed driver), benchmark performance, and check uptime. The Lium CLI lets renters launch and manage GPU containers from terminal in seconds. <a href="#customer" style="color: var(--accent);">See competitive landscape ↓</a>',
  ],
  cycle: {
    challenge: { actor: 'Validator', title: 'Hardware probe', body: 'Validators send hardware-identification challenges and benchmark workloads to verify the GPU class, VRAM, driver, and live availability the miner advertised.', dataK: 'payload', dataV: 'hw fingerprint + benchmark' },
    compute:   { actor: 'Miner',     title: 'Serve rentals', body: 'Miners pass validator probes and run real renter workloads through the Lium scheduler — Docker containers with SSH/Jupyter on demand.', dataK: 'latency',  dataV: 'seconds-to-spin-up' },
    score:     { actor: 'Validator', title: 'Score uptime + perf', body: 'Validators score miners on actual benchmark output, advertised-vs-real accuracy, and stable uptime under real renter sessions.', dataK: 'scale',    dataV: 'multi-GPU pool' },
    settle:    { actor: 'Subtensor', title: 'Yuma → emission', body: "Every validator's weights, multiplied by their stake, aggregated by Yuma into one reward vector. TAO mints to top miners.", dataK: 'tempo', dataV: '~72 min · 24×/day' },
  },
  miner: {
    does: 'Operates GPU servers and serves renter workloads through the Lium platform.',
    input: 'Validator probes + real renter container requests.',
    output: 'Running container with verified GPU access; uptime + benchmark proofs.',
    hardware: 'Real H100 / A100 / 4090 / similar; sufficient bandwidth + cooling; collateral required on testnet/mainnet.',
    paidFor: 'Honest hardware advertisement, benchmark performance, and uptime under real rentals.',
    paidVia: 'Per-tempo emission, score × validator stake',
  },
  validator: {
    does: 'Continuously probes miners, measures performance, and submits weights reflecting verified compute.',
    requires: 'Probe + benchmark harness, low-latency RPC, hardware fingerprinting tools.',
    output: 'Per-miner weight vector reflecting verified GPU class + uptime.',
    paidFor: 'Submitting weights that agree with consensus median',
    paidVia: 'Per-tempo emission, stake × consensus alignment',
  },
  scoring: {
    leadOneLine: 'Real hardware, honestly advertised, with uptime under load — anything less gets evicted.',
    explanation: [
      'Validators fingerprint GPUs through hardware-specific tests (CUDA capability, memory bandwidth, FLOPs) that are hard to fake without actually owning the silicon. A miner who lists an H100 has to repeatedly clear H100-class benchmarks under probe pressure.',
      'On top of hardware verification, validators care about renter-facing reality: does the box come up when a renter asks, does it stay up during a multi-hour training job, does it deliver the advertised throughput. Score is uptime × verified-class × benchmark consistency.',
    ],
    cheatPath: 'Spoofing GPU class with driver tricks doesn\'t survive — benchmark probes use workloads whose runtime depends on real silicon characteristics, not nvidia-smi labels.',
  },
  customer: {
    leadOneLine: 'Developers and AI teams who need cheap GPU access without a hyperscaler contract.',
    explanation: [
      'Lium\'s renters are ML researchers, indie AI builders, agentic-AI startups, and other Bittensor subnets that need raw compute. The pitch is a Vast.ai-style experience but with cryptoeconomic guarantees on hardware honesty and pricing that undercuts even Vast in many configurations.',
      'On the miner side, Lium absorbs ex-Bitcoin GPU operators, idle gaming rigs, and data centers with spare capacity. The economic logic is "your hardware is already a sunk cost — let Lium\'s scheduler keep it busy."',
    ],
  },
  competitive: {
    scope: '2026 · global · decentralized GPU rental',
    rows: [
      { name: 'lium.io', subtitle: 'SN51', isSelf: true, approach: 'Permissionless GPU marketplace on Bittensor; validators verify hardware; pay in TAO or fiat.', access: 'open · API + CLI', accessTone: 'open', differentiator: 'Cryptoeconomic hardware verification + no KYC + advertised 90% cheaper than hyperscalers.' },
      { name: 'AWS / GCP / Azure', approach: 'Hyperscaler GPU instances behind enterprise procurement.', access: 'closed · enterprise', accessTone: 'closed', differentiator: 'Reliable but expensive, KYC + capacity quotas.' },
      { name: 'Vast.ai',           approach: 'Centralized GPU marketplace matching hosts and renters.', access: 'open · API', accessTone: 'open', differentiator: 'Closed company, no on-chain verification, no token incentives.' },
      { name: 'RunPod',            approach: 'Managed GPU cloud aimed at AI developers.', access: 'open · API', accessTone: 'open', differentiator: 'More managed, less peer-to-peer, no token.' },
      { name: 'io.net',            approach: 'Solana-based decentralized GPU network.', access: 'open · API', accessTone: 'open', differentiator: 'Separate ecosystem, different verification stack.' },
    ],
    note: 'Lium\'s wedge is Bittensor\'s 192-UID competition plus on-chain hardware verification. The economics force miners to keep prices low or get evicted, and validators to keep probing or lose their weights — that flywheel is hard to replicate on a single-company marketplace like Vast.',
  },
  team: {
    intro: [
      'Lium is built and operated by Datura, the same group that runs SN22 Desearch and has been a major player in the Bittensor ecosystem since the early subnet era. Datura was originally known for running large miner operations across multiple subnets before pivoting to subnet ownership.',
      'The CLI, scheduler, and Lium subnet code all live under the Datura-ai GitHub org. The team has shipped a polished docs site, CLI on PyPI, and a validator harness with collateral mechanics.',
    ],
    founders: [
      { initials: 'PF', gradient: 'a', name: 'Pierre "Fish" (Datura)', role: 'Founder, Datura / lium.io', bio: 'Previously a major miner across multiple Bittensor subnets; pivoted Datura into subnet ownership with Desearch and Lium.' },
    ],
    size: '~10-20',
    founded: '2024',
    based: 'Distributed (Datura)',
    backers: 'Not publicly disclosed; significant historical TAO holdings from Datura\'s miner-era operations.',
    placeholder: false,
  },
  milestones: [
    { date: '2024·Q4', text: 'Lium (originally Celium) launches as Bittensor SN51.' },
    { date: '2025·Q2', text: 'Lium CLI and docs site released; rentals open to public.' },
    { date: '2025·Q4', text: 'Subnet reaches ~6-7% of total Bittensor emissions; ~$600/hour usage revenue.' },
    { date: '2026·Q1', text: '$432k+/month run-rate; highest revenue among Bittensor subnets.' },
  ],
  join: {
    title: 'Plug in a GPU, get paid in TAO.',
    body: 'Operators with H100s, A100s, 4090s — or even datacenter capacity sitting half-idle — can register a miner UID, post collateral, and start serving real renter workloads. Renters can spin up containers via the Lium CLI in seconds.',
    asideNote: 'Hardware probes are continuous — fake hardware gets evicted in under a tempo.',
  },
  tags: ['Compute', 'GPU', 'Marketplace', 'Infrastructure'],
  external: {
    github: 'https://github.com/Datura-ai/lium-io',
    website: 'https://lium.io/',
    twitter: 'https://x.com/datura_ai',
    taostats: 'https://taostats.io/subnets/51/',
  },
};
