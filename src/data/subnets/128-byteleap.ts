import type { RichSubnet } from '../subnet-rich';

export const sn128: RichSubnet = {
  slug: '128-byteleap',
  netuid: 128,
  name: 'ByteLeap',
  shortPitch: 'Decentralized GPU cloud for AI training and inference on Bittensor.',
  overview: [
    'ByteLeap is Bittensor Subnet 128, a distributed compute platform that aggregates third-party GPU providers into a single decentralized public cloud for AI training and inference. Miners contribute worker resources (workstations and data-centre nodes) and earn rewards through active compute leases and validator-issued computational challenges.',
    'The architecture is three-layered: a worker layer hosting raw GPU resources, an orchestration layer (the VM Gateway) handling mTLS authentication, dynamic VM creation with GPU passthrough, certificate lifecycle, and real-time resource monitoring, and a consumer layer where AI researchers, developers, and enterprises lease compute against TAO-denominated pricing.',
    'GPU coverage spans consumer cards (RTX 3090 / 4090 / 5090) and enterprise hardware (A100, H100, H200, B200), with 1,216 GPUs reported deployed and actively serving real AI workloads as of late 2025. ByteLeap positions itself as a blockchain-enhanced alternative to traditional cloud GPU vendors and other decentralized compute marketplaces.',
    'One-line diff: a fully-decentralized GPU cloud with VM-level orchestration, mTLS-secured workers, and TAO-paid contributors — sized for serious AI training, not just inference. <a href="#customer" style="color: var(--accent);">See competitive landscape ↓</a>',
  ],
  cycle: {
    challenge: { actor: 'Validator', title: 'Issue compute challenge', body: 'Validators issue computational challenges (benchmarks, verification tasks) and forward live compute-lease requests from buyers to available miners.', dataK: 'payload', dataV: 'compute challenge / lease' },
    compute:   { actor: 'Miner',     title: 'Run workload', body: 'Miners execute the challenge or buyer workload on their GPU workers — single-node or multi-node — via the VM Gateway with GPU passthrough.', dataK: 'latency',  dataV: 'training / inference run' },
    score:     { actor: 'Validator', title: 'Verify + measure', body: 'Validators verify task outputs, measure performance (throughput, reliability, uptime, lease completion), and weight miners by quality of compute delivered.', dataK: 'scale',    dataV: 'throughput × reliability' },
    settle:    { actor: 'Subtensor', title: 'Yuma → emission', body: "Every validator's weights, multiplied by their stake, aggregated by Yuma into one reward vector. TAO mints to top miners.", dataK: 'tempo', dataV: '~72 min · 24×/day' },
  },
  miner: {
    does: 'Aggregate GPU worker resources (consumer + enterprise cards) and serve compute leases / validator challenges through the VM Gateway.',
    input: 'Compute challenges, VM creation requests, buyer workloads',
    output: 'Completed training / inference runs with verifiable outputs',
    hardware: 'GPUs ranging from RTX 3090/4090/5090 to A100/H100/H200/B200',
    paidFor: 'Delivering reliable, high-throughput compute against challenges and leases',
    paidVia: 'Per-tempo emission, score × validator stake (plus active lease revenue)',
  },
  validator: {
    does: 'Issue computational challenges, verify outputs, measure miner uptime/throughput/reliability, and route buyer compute leases.',
    requires: 'Bittensor validator stake, ByteLeap validator stack, network capacity for lease orchestration',
    output: 'Weight vector concentrating emission on best-performing GPU miners',
    paidFor: 'Submitting weights that agree with consensus median',
    paidVia: 'Per-tempo emission, stake × consensus alignment',
  },
  scoring: {
    leadOneLine: 'Pay miners for verified compute delivered to real workloads — not for raw GPU count.',
    explanation: [
      'Validators score miners on a composite of computational challenge results (benchmarks the validator can verify), active lease completion (workloads from real buyers, run to completion), and reliability metrics like uptime, GPU passthrough success, and mTLS handshake health. This mixes verifiable benchmarks with live demand signals.',
      'Because the VM Gateway handles certificate lifecycle and dynamic VM creation, validators can verify that the right hardware is doing the right work — making it harder to fake capacity than in simpler GPU-marketplace designs. Real-time resource monitoring feeds back into the weights so miners that drop leases lose emission quickly.',
    ],
    cheatPath: 'Claiming hardware you don\'t have fails the GPU-passthrough verification step. Sub-leasing through a centralised cloud may pass benchmarks but typically loses on latency, cost, or reliability metrics. The harder attack is targeting only easy challenges and refusing real workloads — validators bias scoring toward lease completion to demote that.',
  },
  customer: {
    leadOneLine: 'AI researchers, model developers, and enterprises buying GPU time against TAO-denominated leases.',
    explanation: [
      'The buyer surface is anyone training or serving models who currently pays AWS, GCP, or specialised vendors for GPU capacity. ByteLeap\'s pitch is lower effective cost (no centralised cloud margin), elastic access to a wide range of GPUs (consumer through B200), and a trust model based on mTLS plus verifiable validator measurements rather than a single vendor SLA.',
      'Workloads include both AI training and high-throughput inference, with the platform pitched as suitable for serious training runs, not just short bursts. The 1,216-GPU fleet number is the strongest external signal that real workloads are running rather than synthetic benchmark farming.',
    ],
  },
  competitive: {
    scope: 'decentralized GPU cloud platforms · 2026',
    rows: [
      { name: 'ByteLeap', subtitle: 'SN128', isSelf: true, approach: 'Three-layer Bittensor subnet: workers + VM Gateway + buyer layer; mTLS-secured GPU passthrough.', access: 'open · subnet + VM API', accessTone: 'open', differentiator: 'Only Bittensor GPU subnet with VM-level orchestration (mTLS, GPU passthrough, dynamic VM creation).' },
      { name: 'Chutes (SN64)', approach: 'Bittensor inference marketplace serving models via on-demand "chutes".', access: 'open · subnet + API', accessTone: 'open', differentiator: 'Sibling Bittensor compute subnet but focused on serving models, not generic VM/training compute.' },
      { name: 'NI Compute (SN27)', approach: 'Bittensor verifiable distributed supercomputing subnet.', access: 'open · subnet', accessTone: 'open', differentiator: 'Earlier compute subnet focused on verifiable training; smaller commercial buyer surface.' },
      { name: 'io.net / Akash / Render', approach: 'Other decentralized GPU networks aggregating consumer/enterprise GPUs.', access: 'open · paid', accessTone: 'open', differentiator: 'Larger marketing reach but no Bittensor-style emission subsidy and different orchestration models.' },
      { name: 'AWS / GCP / CoreWeave', approach: 'Closed centralised cloud GPU vendors with vertically-integrated SLAs.', access: 'closed · paid', accessTone: 'closed', differentiator: 'Enterprise-grade SLAs and tooling but premium pricing and capacity gating for top-tier GPUs.' },
    ],
    note: 'Decentralized GPU marketplaces are crowded (io.net, Akash, Render) and the centralised incumbents (AWS, CoreWeave) own the enterprise wallet. ByteLeap\'s wedge inside Bittensor is the VM Gateway architecture — VM-level orchestration with mTLS and GPU passthrough is more serious than most decentralized compute subnets — combined with TAO emissions subsidising worker supply. The execution risk is the same one every decentralized compute network faces: convincing buyers to trust the network with production training jobs.',
  },
  team: {
    intro: [
      'ByteLeap is operated under the ByteLeap brand at byteleap.ai with engineering code at github.com/byteleapai. The team publishes a detailed Medium write-up of the architecture and platform metrics, but named founders are not publicly disclosed at the time of writing.',
      'The strongest external signal is operational: 1,216 GPUs deployed across consumer and enterprise hardware, with VM-Gateway orchestration in production. The team is active in the Bittensor compute conversation alongside SN27 and SN64.',
    ],
    founders: [
      { initials: 'F1', gradient: 'v', name: '[Founder 1 name]', role: 'Co-founder · Platform engineering', bio: 'Lead engineer for the VM Gateway, mTLS, and GPU-passthrough stack; identity not publicly disclosed.' },
      { initials: 'F2', gradient: 'a', name: '[Founder 2 name]', role: 'Co-founder · GPU networks', bio: 'Decentralized-compute and GPU-network specialist responsible for worker onboarding and lease orchestration.' },
    ],
    size: 'Small core team + GPU operator partners',
    founded: '2025',
    based: 'Distributed / not publicly disclosed',
    backers: 'Not publicly disclosed.',
    placeholder: true,
  },
  milestones: [
    { date: '2025', text: 'ByteLeap launches as Subnet 128 with the three-layer architecture (workers + VM Gateway + buyers).' },
    { date: '2025·12', text: 'Medium write-up "Revolutionary Practice in Building the Decentralized GPU Network" published with platform metrics.' },
    { date: '2025·Q4', text: '1,216 GPUs reported deployed across consumer (3090/4090/5090) and enterprise (A100/H100/H200/B200) hardware.' },
  ],
  join: {
    title: 'Lend your GPUs',
    body: 'Connect your GPU workers to the ByteLeap subnet via the VM Gateway, accept compute challenges and buyer leases, and earn TAO for verified compute delivered. Better throughput, uptime, and lease completion concentrate emission on your hotkey.',
    asideNote: 'Setup: github.com/byteleapai/byteleap-Miner · byteleap.ai for platform docs · Medium write-up for architecture overview.',
  },
  tags: ['compute', 'gpu-cloud', 'training', 'inference', 'vm-orchestration'],
  external: {
    github: 'https://github.com/byteleapai/byteleap-Miner',
    website: 'https://byteleap.ai/',
    twitter: 'https://x.com/byteleapai',
    taostats: 'https://taostats.io/subnets/128/',
  },
  tweets: [
    { when: '2025·12', body: '"ByteLeap: Revolutionary Practice in Building the Decentralized GPU Network" — Medium write-up describing the VM Gateway architecture and 1,216-GPU fleet.' },
  ],
};
