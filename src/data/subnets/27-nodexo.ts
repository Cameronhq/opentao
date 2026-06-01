import type { RichSubnet } from '../subnet-rich';

export const sn27: RichSubnet = {
  slug: '27-nodexo',
  netuid: 27,
  name: 'Nodexo',
  shortPitch: 'Decentralized GPU compute marketplace — rent miner GPUs through Bittensor.',
  overview: [
    'Nodexo is subnet 27 on Bittensor, operated by Neural Internet. It runs a decentralized GPU compute marketplace where miners contribute physical GPU capacity (consumer cards, datacenter GPUs, and idle workstations) and renters consume that capacity through a hosted cloud platform at nodexo.ai. The subnet was previously branded as "NI Compute" before the rebrand.',
    'Validators continuously run a Proof-of-GPU benchmark against each miner — measuring CUDA capability, VRAM, throughput, and live availability — and write weights on-chain that reflect verified hardware quality and uptime. Miners are scored on hardware specs plus the share of their machines actually rented and used; idle compute earns less than productive compute.',
    'The buyer is outside Bittensor: AI startups, research teams, and individual developers who want cheaper GPU rentals than AWS / Lambda / RunPod without signing up to a centralized vendor. Nodexo packages the underlying subnet behind a familiar cloud console — provisioning, SSH, billing — so customers do not need to touch TAO directly.',
    'Unlike SN12 ComputeHorde (which serves other Bittensor validators) or SN64 Chutes (serverless inference), Nodexo is positioned as a raw GPU IaaS layer competing with centralized GPU clouds. <a href="#customer" style="color: var(--accent);">See competitive landscape ↓</a>',
  ],
  cycle: {
    challenge: { actor: 'Validator', title: 'Issue PoGPU benchmark', body: 'Validator sends a Proof-of-GPU challenge to each registered miner — CUDA workload, memory probe, throughput tests — and demands signed performance results within a tight window.', dataK: 'payload', dataV: 'PoGPU benchmark + allocation check' },
    compute:   { actor: 'Miner',     title: 'Run GPU workload', body: 'Miner runs the benchmark on its GPU fleet and either returns scores or, if rented, proves the customer workload is live; idle GPUs return synthetic benchmarks, busy GPUs report through the allocation API.', dataK: 'latency',  dataV: 'seconds-scale per probe' },
    score:     { actor: 'Validator', title: 'Score hardware + use', body: 'Validator combines benchmark scores, GPU class, VRAM, and actual rental utilization into a single weight per miner; verified renters add a usage multiplier on top of raw hardware quality.', dataK: 'scale', dataV: 'specs × utilization × uptime' },
    settle:    { actor: 'Subtensor', title: 'Yuma → emission', body: "Every validator's weights, multiplied by their stake, aggregated by Yuma into one reward vector. TAO mints to top miners.", dataK: 'tempo', dataV: '~72 min · 24×/day' },
  },
  miner: {
    does: 'Runs GPU host(s) registered with the subnet; serves PoGPU benchmarks and (when allocated) rented customer workloads.',
    input: 'PoGPU benchmark requests + allocation/SSH provisioning requests from the Nodexo platform.',
    output: 'Signed benchmark results, live GPU availability, and access to rented containers/VMs.',
    hardware: 'NVIDIA GPUs (RTX 3090/4090 up to H100 / H200 / B200); meaningful VRAM, fast NVMe, decent bandwidth; Linux host.',
    paidFor: 'High verified GPU score + high paid-rental utilization over the scoring window.',
    paidVia: 'Per-tempo emission, score × validator stake',
  },
  validator: {
    does: 'Issues PoGPU benchmarks, observes rental allocations, scores miners on hardware quality and real usage, and writes weights every tempo.',
    requires: 'Stake, a validator host able to run benchmark dispatch + result verification, and connection to the Nodexo allocation registry.',
    output: 'Per-miner weight vector reflecting hardware × utilization × uptime.',
    paidFor: 'Submitting weights that agree with consensus median',
    paidVia: 'Per-tempo emission, stake × consensus alignment',
  },
  scoring: {
    leadOneLine: 'Proof-of-GPU benchmark plus real rental utilization — raw silicon alone is not enough.',
    explanation: [
      'Each validator regularly dispatches CUDA-based benchmarks measuring memory throughput, compute throughput, and driver responsiveness. The miner returns signed results, which the validator cross-checks against expected ranges for the declared GPU model. This produces a baseline hardware score per miner that reflects what the GPUs can actually do, not just what the miner claims.',
      'On top of the hardware score, the Nodexo allocation registry tells validators which miners are currently rented by paying customers. Rented capacity gets a meaningful multiplier so that GPUs which produce real revenue earn more emission than identical idle GPUs. Weights are written on-chain every tempo and aggregated by Yuma consensus.',
    ],
    cheatPath: 'A miner can spoof GPU specs in identity strings, time-share one strong GPU across many UIDs, or use stolen credentials. Benchmark signatures, ongoing memory/throughput probes, and the allocation registry catch fake hardware and overloaded shared GPUs. Sybil farms reusing one GPU across many UIDs collapse once concurrent probes saturate the underlying card.',
  },
  customer: {
    leadOneLine: 'AI startups and individual developers renting GPUs through nodexo.ai instead of AWS / Lambda / RunPod.',
    explanation: [
      'Buyers are external developers and small AI teams who want H100/H200-class GPUs by the hour with a credit card and an SSH key. Nodexo wraps the subnet in a familiar cloud experience — image selection, container/VM provisioning, billing — so users do not need to hold or stake TAO to consume compute. Payment from customers is routed back through the platform into miner emission economics.',
      'The pitch versus centralized GPU clouds is cost and supply: a long tail of independent operators competes on price and uptime, and the Bittensor incentive layer pushes them to maintain hardware that actually wins paying rentals. The pitch versus other Bittensor compute subnets is that Nodexo is renting to outside developers rather than internal subnet validators.',
    ],
  },
  competitive: {
    scope: 'decentralized + centralized GPU IaaS · 2026',
    rows: [
      { name: 'Nodexo', subtitle: 'SN27', isSelf: true, approach: 'Bittensor-incentivized GPU marketplace; PoGPU benchmark + rental utilization decide emission, customers consume via nodexo.ai cloud.', access: 'open · API + console', accessTone: 'open', differentiator: 'Bittensor incentive layer rewards actually-used GPUs; long-tail supply of operators.' },
      { name: 'ComputeHorde', subtitle: 'SN12', approach: 'Bittensor compute subnet aimed at validators of other subnets needing trusted compute, not external renters.', access: 'open', accessTone: 'open', differentiator: 'Internal Bittensor customer base, not a general GPU cloud.' },
      { name: 'io.net', approach: 'Solana-based DePIN GPU marketplace aggregating consumer + datacenter GPUs for AI workloads.', access: 'closed · API', accessTone: 'closed', differentiator: 'Larger marketing reach + Solana DePIN stack, but no Bittensor-style incentive layer for hardware quality.' },
      { name: 'Akash Network', approach: 'Cosmos-based decentralized compute marketplace; bid-based GPU and CPU rentals.', access: 'open · CLI', accessTone: 'open', differentiator: 'General compute focus, mature deploy tooling; less AI-specific tuning.' },
      { name: 'RunPod / Vast.ai', approach: 'Centralized GPU clouds aggregating community + datacenter operators; pay by the hour.', access: 'closed · console', accessTone: 'closed', differentiator: 'Strong UX and supply today but vendor-controlled; no token incentive layer.' },
    ],
    note: 'Nodexo competes with both DePIN GPU networks (io.net, Akash) and centralized aggregators (RunPod, Vast.ai, Lambda). Its wedge is the Bittensor incentive layer that punishes idle or fraudulent capacity, plus the cloud-style console at nodexo.ai aimed at developers who do not want to touch crypto.',
  },
  team: {
    intro: [
      'Subnet 27 is operated by Neural Internet, a tech-focused team that has been on Bittensor since the early subnet days; the same team open-sourced the original compute-subnet repo under neuralinternet/SN27.',
      'The stated philosophy is that decentralized GPU markets only matter if a real customer experience sits on top — hence the Nodexo cloud console, the proof-of-GPU work, and the focus on routing actual rental revenue into emission.',
    ],
    founders: [
      { initials: 'HM', gradient: 'v', name: 'Hansel Melo', role: 'Founder & CEO, Neural Internet / Nodexo', bio: 'Conceived the Nodexo vision of a decentralized cloud built on Bittensor SN27; leads Neural Internet, the operator team.', twitter: 'https://x.com/neural_internet' },
      { initials: 'DM', gradient: 'a', name: 'Donald J. Milligan', role: 'Co-Founder & CTO', bio: 'Cloud architect who led the Nodexo platform build; joined Neural Internet as fractional CTO in late 2024 and became co-founder in April 2025.' },
    ],
    size: '~10-20', founded: '2023 (subnet 27 registration)', based: 'Distributed',
    backers: 'No public funding round disclosed.',
    placeholder: false,
  },
  milestones: [
    { date: '2023·10', text: 'Subnet 27 registered as NI Compute (Neural Internet); compute-subnet repo open-sourced under neuralinternet/SN27.' },
    { date: '2024', text: 'Proof-of-GPU benchmarking and allocation API matured; multiple GPU classes onboarded via miner network.' },
    { date: '2025·04', text: 'Don Milligan named co-founder; Nodexo cloud product brand consolidated around nodexo.ai.' },
    { date: '2025', text: 'Rebrand from NI Compute to Nodexo, repositioning the subnet as a developer-facing GPU cloud.' },
  ],
  join: {
    title: 'Rent or supply GPU on Nodexo',
    body: 'Spin up an H100 / H200 via the Nodexo console at nodexo.ai/docs.nodexo.ai, or onboard your own GPU fleet as a miner on subnet 27. Repo: github.com/neuralinternet/compute-subnet.',
    asideNote: 'Miner registration requires GPU hosts and a Bittensor coldkey; renters pay via standard cloud billing.',
  },
  tags: ['compute', 'gpu', 'cloud', 'depin', 'infrastructure'],
  external: {
    github: 'https://github.com/neuralinternet/compute-subnet',
    website: 'https://nodexo.ai',
    twitter: 'https://x.com/neural_internet',
    taostats: 'https://taostats.io/subnets/27/',
  },
};
