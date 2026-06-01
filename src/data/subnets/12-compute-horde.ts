import type { RichSubnet } from '../subnet-rich';

export const sn12: RichSubnet = {
  slug: '12-compute-horde',
  netuid: 12,
  name: 'Compute Horde',

  shortPitch: 'Trusted decentralized GPU compute for Bittensor validators and beyond.',

  overview: [
    'Compute Horde is Bittensor Subnet 12, operated by Backend Developers Ltd. The subnet exists to solve a structural Bittensor problem: as more subnets launch, each validator needs more compute to verify miner work, but trusting random GPUs is unsafe. Compute Horde provides scalable, verified GPU capacity that validators of any subnet can purchase to run their evaluation workloads at much lower cost than centralised cloud.',
    'The subnet runs miners, validators, and "executors" together. Each miner spawns multiple executor VMs — single-use sandboxes that run a single dockerised job and are destroyed afterward. Validators issue cryptographically verifiable benchmark jobs and score miners on consistent, scaled-up executor capacity, especially during peak demand cycles. The default A6000 hardware class is supported with A100 coming next.',
    'Outside Bittensor, the buyer is any validator team that needs cheap, trustworthy GPU compute — but the design also supports general-purpose docker jobs from external users via the Compute Horde Facilitator SDK. By mid-2024 the network had already crossed 1,000 GPUs and was widely cited as decentralised compute roughly equivalent to a $50-100M traditional supercomputer.',
    'Closest competitors are io.net, Akash, Render Network, and centralised GPU clouds like CoreWeave or Lambda. Compute Horde differs by tying its trust model to Bittensor\'s consensus and slashing, making it specifically useful for validator verification workloads where untrusted GPUs are otherwise a non-starter. <a href="#customer" style="color: var(--accent);">See competitive landscape ↓</a>',
  ],

  cycle: {
    challenge: { actor: 'Validator', title: 'Issue benchmark job', body: 'Validators broadcast a dockerised benchmark or verification job (often a real workload from another subnet) with the GPU class and time limit specified.', dataK: 'payload', dataV: 'docker image · GPU class · time limit' },
    compute:   { actor: 'Miner',     title: 'Spawn executors', body: 'Miners spawn one or more executor VMs to run the assigned job. Each executor is a single-use sandbox destroyed after the job completes. Better miners scale up executor count during peak cycles.', dataK: 'latency',  dataV: 'A6000 GPU class (A100 coming)' },
    score:     { actor: 'Validator', title: 'Verify + benchmark', body: 'Validators check job output, measure throughput against the GPU class baseline, and reward miners who consistently scale executors when demand is high while minimising waste during quiet periods.', dataK: 'scale',    dataV: 'peak-cycle throughput · output correctness' },
    settle:    { actor: 'Subtensor', title: 'Yuma → emission', body: "Every validator's weights, multiplied by their stake, aggregated by Yuma into one reward vector. TAO mints to top miners.", dataK: 'tempo', dataV: '~72 min · 24×/day' },
  },

  miner: {
    does:     'Operates GPU machines and runs an executor manager that spawns one-shot VMs to handle dockerised compute jobs assigned by validators.',
    input:    'Dockerised job specs from validators, plus the required GPU class (currently A6000, A100 incoming).',
    output:   'Completed job artifacts plus throughput metrics from each executor run.',
    hardware: 'A6000-class GPUs supported; A100 in active integration. Miners with custom executor managers can scale to many parallel executors per machine.',
    paidFor:  'Consistently providing scaled-up executor capacity, especially during peak demand cycles, with verifiable job throughput.',
    paidVia:  'Per-tempo emission, score × validator stake',
  },
  validator: {
    does:     'Issues dockerised compute jobs, verifies outputs against expected results, measures executor throughput, and posts weights based on consistent peak-cycle capacity.',
    requires: 'Standard Bittensor validator stake plus enough infrastructure to issue and verify many parallel benchmark jobs each tempo.',
    output:   'A weight vector based on each miner\'s executor uptime, throughput, and peak-cycle scaling.',
    paidFor:  'Submitting weights that agree with consensus median',
    paidVia:  'Per-tempo emission, stake × consensus alignment',
  },

  scoring: {
    leadOneLine: 'Peak-cycle GPU throughput verified against dockerised benchmark and real-workload jobs.',
    explanation: [
      'Compute Horde\'s scoring is workload-driven. Validators issue real or representative dockerised compute jobs, then score miners on whether the output matches expected results and how much throughput their executor pool delivered. Crucially, the schedule weighs peak cycles more heavily — miners who scale executor count up during high-demand windows earn substantially more than those who run a constant baseline.',
      'The default executor manager runs a single executor and is explicitly described as "not intended for mainnet use" — competitive miners build custom executor managers that handle dynamic scaling, multiple GPUs per machine, and efficient teardown. This turns mining into a real systems-engineering problem rather than a one-time hardware investment, which is closer to how production compute infrastructure actually works.',
    ],
    cheatPath: 'Executors run dockerised jobs whose outputs are verifiable by validators, so returning fake results does not pass scoring. Miners cannot fake GPU capacity — throughput is measured against the benchmark baseline for the declared GPU class. Spinning up executors only during easy off-peak windows and going dark during peak demand is penalised because the scoring rule weights peak-cycle throughput.',
  },

  customer: {
    leadOneLine: 'Validator teams across Bittensor and external users who need trusted, on-demand GPU compute.',
    explanation: [
      'The most defensible internal customer is the validator team of any other Bittensor subnet. Every subnet needs compute to validate miners, and that compute either has to come from centralised cloud (expensive, no trust binding to Bittensor) or from untrusted random GPUs (unsafe). Compute Horde\'s pitch is that as Bittensor scales to 1,000+ subnets, network-internal trusted compute is the only way the verification load is solvable.',
      'External users access Compute Horde via the Facilitator SDK — a Python SDK for submitting jobs and consuming results. Outside Bittensor, the comparison is to io.net, Akash, and centralised GPU clouds: Compute Horde\'s differentiator is that its trust model is reused from Bittensor consensus and slashing, making it acceptable for workloads where untrusted execution would otherwise be a non-starter. The network has scaled to 1,000+ GPUs and is reportedly equivalent to a $50-100M traditional supercomputer.',
    ],
  },

  competitive: {
    scope: 'decentralized GPU compute · 2026',
    rows: [
      { name: 'Compute Horde', subtitle: 'SN12', isSelf: true, approach: 'Bittensor-native trusted GPU compute with executor sandboxes and peak-cycle throughput scoring.', access: 'open · SDK', accessTone: 'open', differentiator: 'Trust binds to Bittensor consensus; purpose-built for validator verification workloads.' },
      { name: 'io.net', subtitle: 'GPU network', approach: 'Independent decentralised GPU cluster aggregating spare compute across data centres.', access: 'open · API', accessTone: 'open', differentiator: 'Larger raw GPU pool but no Bittensor-native trust model or emission alignment.' },
      { name: 'Akash', subtitle: 'Cosmos compute', approach: 'Decentralised compute marketplace on Cosmos with reverse-auction pricing.', access: 'open · CLI', accessTone: 'open', differentiator: 'Mature, but general-purpose; no Bittensor scoring mechanism.' },
      { name: 'CoreWeave / Lambda', subtitle: 'centralised cloud', approach: 'Specialised GPU cloud providers for AI workloads.', access: 'closed · enterprise', accessTone: 'closed', differentiator: 'Higher reliability, much higher cost; no decentralised pricing or trust layer.' },
      { name: 'SN27 Compute', subtitle: 'Neural Internet', approach: 'Bittensor subnet (27) focused on verifiable distributed supercomputing.', access: 'open · SDK', accessTone: 'open', differentiator: 'Direct Bittensor peer; broader compute scope versus Compute Horde\'s validator-job specialisation.' },
    ],
    note: 'Compute Horde\'s defensible niche is being the trusted-compute layer for Bittensor itself. Any subnet that wants to outsource validator compute is a natural customer, and the trust binding cannot be replicated outside Bittensor. Versus io.net and Akash, Compute Horde trades a smaller raw pool for tighter trust and emissions alignment; versus centralised GPU clouds, it trades enterprise-grade SLAs for materially lower cost.',
  },

  team: {
    intro: [
      'Compute Horde is operated by Backend Developers Ltd. The lead public voice for the project is Rhef, who appeared on the Bittensor Guru podcast episode 35 to walk through the subnet\'s architecture and roadmap. The team maintains an active GitHub org with the main ComputeHorde repo plus the Compute Horde Facilitator SDK and supporting tools.',
      'The team\'s thesis is that Bittensor cannot scale to 1,000+ subnets without an internal trusted-compute layer, and that this layer is itself one of the most valuable subnets to operate. The architecture — miners spawning short-lived executor VMs per job — is closer to a modern container scheduler than to typical "rent your GPU" decentralised compute marketplaces, which the team argues is necessary for trusted workloads.',
    ],
    founders: [
      { initials: 'RH', gradient: 'v', name: 'Rhef', role: 'Lead, Compute Horde', bio: 'Public lead for Subnet 12 across podcasts and community channels. Operates Backend Developers Ltd, the entity behind the ComputeHorde codebase.' },
    ],
    size: 'Small/medium engineering team (Backend Developers Ltd)',
    founded: 'Subnet 12 launched on Bittensor mainnet in early 2024',
    based: 'Distributed (Backend Developers Ltd)',
    backers: 'Not publicly disclosed.',
    placeholder: true,
  },

  milestones: [
    { date: '2024·Q1', text: 'Subnet 12 launched on Bittensor mainnet by Backend Developers Ltd.' },
    { date: '2024·H2', text: 'Crossed 1,000 GPUs contributing to the network; widely cited as $50-100M-equivalent supercomputer.' },
    { date: '2025', text: 'Compute Horde Facilitator SDK published — external users can submit dockerised jobs.' },
    { date: '2026', text: 'A100 GPU class integration in progress; custom executor manager ecosystem maturing.' },
  ],

  join: {
    title: 'Run a Compute Horde miner',
    body: 'Fork backend-developers-ltd/ComputeHorde, register a Bittensor miner on SN12, attach A6000-class GPUs, and build (or run) a custom executor manager to scale during peak demand.',
    asideNote: 'Validators need standard SN12 stake plus enough infrastructure to issue and verify many parallel benchmark and real-workload jobs each tempo.',
  },

  tags: ['compute', 'gpu', 'infrastructure', 'docker'],

  external: {
    github:   'https://github.com/backend-developers-ltd/ComputeHorde',
    website:  'https://computehorde.io/',
    twitter:  'https://x.com/ComputeHorde',
    taostats: 'https://taostats.io/subnets/12/',
  },
};
