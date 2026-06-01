import type { RichSubnet } from '../subnet-rich';

export const iota: RichSubnet = {
  slug: '9-iota',
  netuid: 9,
  name: 'IOTA',
  shortPitch: 'Pipeline-parallel pretraining swarm splitting LLMs across permissionless GPUs.',
  overview: [
    'IOTA (Incentivised Orchestrated Training Architecture) is Bittensor subnet 9, operated by London-based Macrocosmos. It is a decentralized large-language-model pre-training subnet where heterogeneous, permissionless GPUs cooperatively train a single shared model. SN9 originally ran a winner-takes-all pretraining tournament; IOTA, released June 2025, replaced that with a cooperative swarm that splits the model across miners.',
    'The metagraph holds ~246 miners and ~10 validators. Miners are each assigned a slice of a 1.5B-parameter Llama-style model (currently 3 pipeline stages), running forward and backward passes on FineWeb shards and exchanging compressed activations between layers. Validators sample miner pathways and score them with CLASP, which assigns credit proportional to a miner\'s marginal loss reduction across the sampled paths.',
    'Outside Bittensor, the customer is anyone who needs to pre-train a frontier LLM without renting an H100 cluster: research labs, sovereign-AI projects, and open-source collectives priced out of centralized compute. IOTA lets contributors join with a single 16 GB consumer GPU, and the resulting checkpoints are public and openly licensed.',
    'Closest non-Bittensor analogue is Prime Intellect\'s INTELLECT runs; IOTA differs in being a continuously-running incentivized swarm rather than discrete training campaigns. <a href="#customer" style="color: var(--accent);">See competitive landscape ↓</a>',
  ],
  cycle: {
    challenge: { actor: 'Validator', title: 'Assign layer + batch', body: 'The orchestrator allocates each miner a pipeline stage (a contiguous slice of the 1.5B Llama variant) and streams a FineWeb mini-batch into stage-0 miners. Validators register which miners hold which shard for the current synchronization window.', dataK: 'payload', dataV: 'layer slice + FineWeb batch' },
    compute:   { actor: 'Miner', title: 'Forward + backward on slice', body: 'Miners run the forward pass on their layer, ship compressed activations (up to 128x compression via bottleneck blocks) to the next stage, then propagate gradients back. Periodically, miners merge full weights with peers via a Butterfly All-Reduce.', dataK: 'latency', dataV: 'sync windows < 1 hour' },
    score:     { actor: 'Validator', title: 'CLASP path sampling', body: 'Validators silently reproduce a sample of each miner\'s computations using identical activations, verify outputs via cosine similarity, and run CLASP — a Shapley-style attribution that credits miners by their average loss reduction across the paths they touched. Statistical outliers are flagged as cheaters.', dataK: 'scale', dataV: '1.5B params · 3 layers' },
    settle:    { actor: 'Subtensor', title: 'Yuma → emission', body: "Every validator's weights, multiplied by their stake, aggregated by Yuma into one reward vector. TAO mints to top miners.", dataK: 'tempo', dataV: '~72 min · 24×/day' },
  },
  miner: {
    does: 'Hosts one pipeline stage of the shared model; runs forward/backward passes on assigned batches and participates in Butterfly All-Reduce merges.',
    input: 'Activations from the previous stage (or FineWeb tokens for stage-0) and current weight shard.',
    output: 'Compressed activations, gradients, and periodically full-precision merged weights.',
    hardware: 'CUDA GPU ≥16 GB VRAM (RTX 4090 reference), Ubuntu 22.04, stable bandwidth for activation streaming.',
    paidFor: 'Throughput plus marginal loss reduction contributed across sampled training paths (CLASP score).',
    paidVia: 'Per-tempo emission, score × validator stake',
  },
  validator: {
    does: 'Samples miner pathways, re-executes their forward/backward steps from logged activations, verifies via cosine similarity, and computes CLASP attribution scores for the metagraph.',
    requires: 'GPU capable of replaying sampled layers, full orchestrator state, and validator stake registered on netuid 9.',
    output: 'Per-miner weight vector reflecting consensus on contribution quality and absence of free-riding or collusion.',
    paidFor: 'Submitting weights that agree with consensus median',
    paidVia: 'Per-tempo emission, stake × consensus alignment',
  },
  scoring: {
    leadOneLine: 'CLASP attributes loss reduction to miners; Butterfly All-Reduce makes cheating mutually detectable.',
    explanation: [
      'CLASP (Contribution Loss Assessment via Sampling of Pathways) logs the pathway π and loss ℓ for each training sample, then for each miner computes the average loss across paths they participated in. This Shapley-style estimate yields credit proportional to a miner\'s marginal utility even though contributions are interdependent across the pipeline.',
      'Weight merging uses a Butterfly All-Reduce: every miner shards their weights into N segments, and each pair of miners shares at least one segment. Disagreements across the overlap matrix expose miners whose weights diverged from consensus, giving validators trivial detection of malicious updates without a central authority.',
    ],
    cheatPath: 'Free-riding (uploading zero-effort activations) fails because rewards are tied to processed activation volume that validators replay. Collusion is bounded because miners cannot see global shard assignments, so coordinating an attack across the right subset is hard. Submitting fabricated weights is caught by All-Reduce overlap mismatches, and outlier loss contributions are statistically flagged by CLASP.',
  },
  customer: {
    leadOneLine: 'Research labs, sovereign-AI projects and open-weight collectives that need pre-training compute without renting a centralized GPU cluster.',
    explanation: [
      'Pre-training a multi-billion-parameter LLM is the most capital-intensive step in modern AI: a single H100 cluster run costs millions and is gated by hyperscaler waitlists. IOTA pools globally distributed consumer and prosumer GPUs into a swarm that can host a model no single contributor could fit, paid for in TAO emissions rather than upfront cash.',
      'The output is an openly licensed checkpoint plus the operational know-how to run heterogeneous swarms. Macrocosmos\'s own roadmap targets a "Training at Home" macOS client that lets ordinary users contribute spare cycles, mirroring SETI@home / Folding@home — the buyer is whoever wants an open foundation model trained without depending on AWS, Azure or GCP capacity.',
    ],
  },
  competitive: {
    scope: 'open, permissionless pre-training of frontier LLMs · 2026',
    rows: [
      { name: 'IOTA', subtitle: 'SN9', isSelf: true, approach: 'Always-on incentivized swarm; pipeline + data parallel across heterogeneous consumer/prosumer GPUs; CLASP attribution.', access: 'open · public model checkpoints', accessTone: 'open', differentiator: 'Continuously running, incentive-native; miners get paid in TAO every tempo rather than per-campaign grant.' },
      { name: 'Prime Intellect', approach: 'Decentralized training campaigns (INTELLECT-1, INTELLECT-2 32B RL); PRIME-RL framework with TOPLOC verification and SHARDCAST weight broadcast.', access: 'open · checkpoints on HuggingFace', accessTone: 'open', differentiator: 'Discrete training runs with curated contributor pools; strong on RL, less focused on continuous permissionless pre-training.' },
      { name: 'Petals (BigScience)', approach: 'BitTorrent-style swarm hosting BLOOM-176B; primarily collaborative inference and parameter-efficient fine-tuning, not full pre-training.', access: 'open · MIT-licensed swarm', accessTone: 'open', differentiator: 'Inference and adapter fine-tuning only — no from-scratch pre-training, no token incentive.' },
      { name: 'Flower Labs (FlowerLLM / Photon)', approach: 'Federated-learning pre-training across geo-distributed clusters; Photon has pre-trained up to 7B-parameter models in FL settings.', access: 'open · Flower framework Apache-2.0', accessTone: 'open', differentiator: 'Academic-led FL stack; participants are usually known institutions, not a permissionless market.' },
      { name: 'NVIDIA NeMo / Megatron-LM', approach: 'Reference framework for centralized large-scale pre-training (tensor + pipeline + sequence parallel) on tightly coupled NVLink/InfiniBand clusters.', access: 'closed · requires owned cluster', accessTone: 'closed', differentiator: 'Industry-standard centralized stack; assumes a single operator with capex for a multi-hundred-GPU pod.' },
    ],
    note: 'IOTA\'s defensible position is the combination of always-on token incentives plus pipeline-parallel sharding that lifts the 16 GB-VRAM floor. Petals and NeMo bracket the design space (decentralized inference vs centralized training); Prime Intellect and Flower are the closest peers, both running discrete or institutional campaigns rather than a permanent permissionless market.',
  },
  team: {
    intro: [
      'Macrocosmos Ltd is a London-incorporated AI-first startup founded in 2024 to build and operate Bittensor subnets. The team also runs SN1 (Apex), SN13 (Data Universe), SN25 (Folding) and SN37 (Finetuning), positioning Macrocosmos as one of the largest subnet operators in the network.',
      'Their philosophy is "incentive mechanisms for world-class compute": rather than centralize training and inference, design markets where heterogeneous contributors compete and cooperate. IOTA is the most technically ambitious expression of that thesis to date.',
    ],
    founders: [
      { initials: 'WS', gradient: 'v', name: 'Will Squires', role: 'CEO, Co-founder', bio: 'Previously built large-scale infrastructure programs (Crossrail, HS2) and an AI accelerator at AtkinsRéalis; sat on the Mayor of London\'s infrastructure advisory panel before turning to decentralized AI.', twitter: 'https://x.com/WSquiresI' },
      { initials: 'SC', gradient: 'a', name: 'Steffen Cruz', role: 'CTO, Co-founder', bio: 'Former CTO of the Opentensor Foundation and core developer of Bittensor Subnet 1. PhD in subatomic physics from the University of British Columbia.' },
    ],
    size: '~30', founded: '2024', based: 'London, UK',
    backers: 'Strategic OTC raises with institutional investors including DSV; no publicly announced priced round.',
    placeholder: false,
  },
  milestones: [
    { date: '2024·08', text: 'Original SN9 (winner-takes-all pre-training) demonstrates permissionless training of 0.7B–14B models beating baselines.' },
    { date: '2025·06', text: 'IOTA mainnet launch (June 2 livestream); SN9 transitions from competitive to cooperative pipeline-parallel swarm.' },
    { date: '2025·07', text: 'IOTA technical primer (arXiv 2507.17766) published describing CLASP and Butterfly All-Reduce.' },
    { date: '2026·03', text: 'IOTA v3.0.0 ships P2P activation transfer with Iroh-Cosmos.' },
    { date: '2026·Q1', text: '"Training at Home" macOS client announced — waitlist for consumer-grade contributors.' },
  ],
  join: {
    title: 'Run a miner on SN9',
    body: 'Spin up an Ubuntu 22.04 box with ≥16 GB CUDA VRAM, clone macrocosm-os/IOTA, and start the miner under PM2. Expect a stable connection — pipeline-parallel activation streaming punishes flaky bandwidth more than slow GPUs.',
    asideNote: 'Validators are stake-gated and small in number (~10); building a useful contribution as a researcher is easiest by running miners or contributing to the open IOTA repo.',
  },
  tags: ['pretraining', 'distributed-training', 'pipeline-parallel', 'macrocosmos', 'llm'],
  external: {
    github: 'https://github.com/macrocosm-os/IOTA',
    website: 'https://www.macrocosmos.ai',
    twitter: 'https://x.com/MacrocosmosAI',
    taostats: 'https://taostats.io/subnets/9/',
  },
  tweets: [
    { when: '2025·05', body: 'Subnet 9 proved decentralized LLM pretraining is viable. We are proud to release the technical primer for IOTA in advance of mainnet launch on June 2nd. IOTA comprises a series of key innovations: Data- and Pipeline-parallel SWARM execution across heterogeneous and unreliable nodes…' },
  ],
};
