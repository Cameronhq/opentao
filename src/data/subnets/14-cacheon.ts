import type { RichSubnet } from '../subnet-rich';

export const sn14: RichSubnet = {
  slug: '14-cacheon',
  netuid: 14,
  name: 'Cacheon',

  shortPitch: 'Decentralized inference competition for faster, cheaper LLM serving.',

  overview: [
    'Cacheon is Bittensor Subnet 14, a competitive arena for LLM inference optimisation. The slot has had a turbulent history — it was earlier branded TAOHash (BTC mining hashrate) and then KDN-1 (Tiger Alpha\'s knowledge-delivery network, which was deregistered after the operator realized value back to TAO) before relaunching under the Cacheon thesis: incentivise miners to ship the fastest, cheapest inference servers for an open baseline model.',
    'The mechanism is concrete: miners submit Docker containers running optimised inference servers — written in Python, Rust, or sglang — and validators benchmark them against a baseline model (Qwen at launch) on time-to-first-token and tokens-per-second throughput. Containers that fail correctness checks are dropped; surviving containers are ranked by latency and throughput, with the leaders capturing the bulk of TAO emissions.',
    'Outside Bittensor, the customer is anyone running production LLM workloads — agent platforms, AI products with chat surfaces, RAG-heavy applications — where serving cost and latency dominate unit economics. By collapsing inference-optimisation R&D into a continuously-paid leaderboard, Cacheon aims to produce serving stacks that beat anything any single team would build in-house.',
    'Closest competitors are vLLM (open-source serving), Together AI / Fireworks / Anyscale (managed inference), and other Bittensor inference subnets (Targon SN4, Chutes SN64). Cacheon differs by paying continuously for measurable serving-stack improvements rather than for hosting capacity, and by exposing the resulting wins as open Docker images. <a href="#customer" style="color: var(--accent);">See competitive landscape ↓</a>',
  ],

  cycle: {
    challenge: { actor: 'Validator', title: 'Pull serving container', body: 'Validators pull each miner\'s submitted Docker container and the baseline model spec (Qwen at launch). All containers are tested against an identical set of prompts under identical compute conditions.', dataK: 'payload', dataV: 'docker image · baseline LLM (Qwen)' },
    compute:   { actor: 'Miner',     title: 'Serve inference', body: 'Containers run optimized serving stacks — Python/Rust/sglang — and respond to validator prompts. Miners differentiate on quantisation, kernel choice, batching, KV-cache strategy, and prompt-prefix caching.', dataK: 'latency',  dataV: 'TTFT + tokens/sec on identical prompts' },
    score:     { actor: 'Validator', title: 'Rank by TTFT + TPS', body: 'Validators verify correctness against the baseline, then rank passing containers by time-to-first-token and tokens-per-second throughput. The fastest verified servers take the lion\'s share of emissions.', dataK: 'scale',    dataV: 'verify correctness → rank TTFT + TPS' },
    settle:    { actor: 'Subtensor', title: 'Yuma → emission', body: "Every validator's weights, multiplied by their stake, aggregated by Yuma into one reward vector. TAO mints to top miners.", dataK: 'tempo', dataV: '~72 min · 24×/day' },
  },

  miner: {
    does:     'Builds and ships a Docker container running an optimized inference server for the baseline LLM, iterating to drive down latency and drive up throughput.',
    input:    'The baseline model spec (Qwen at launch) plus benchmark prompt sets used by validators.',
    output:   'A versioned Docker image exposing an inference endpoint that responds to validator probe traffic.',
    hardware: 'GPU required — A6000 / A100 / H100-class hardware is typical for competitive LLM serving. The whole point of the competition is making each unit of GPU produce more tokens per second.',
    paidFor:  'Holding the top throughput / latency position on the baseline model leaderboard while serving correct outputs.',
    paidVia:  'Per-tempo emission, score × validator stake',
  },
  validator: {
    does:     'Pulls miner containers, verifies output correctness against the baseline model, benchmarks TTFT and tokens-per-second, and posts weights based on rank.',
    requires: 'Standard Bittensor validator stake plus consistent GPU hardware to run every miner\'s container under identical compute conditions.',
    output:   'A weight vector based on per-miner serving latency and throughput across the benchmark prompt set.',
    paidFor:  'Submitting weights that agree with consensus median',
    paidVia:  'Per-tempo emission, stake × consensus alignment',
  },

  scoring: {
    leadOneLine: 'Correctness gate, then rank by time-to-first-token and tokens-per-second on identical benchmark prompts.',
    explanation: [
      'Scoring is two-stage. First, validators check correctness — outputs that diverge from the baseline model beyond an acceptable tolerance (numerical noise from kernel choice is fine; substantively different generations are not) fail the gate and score zero. This rules out the obvious cheat of returning random fast text.',
      'Second, surviving containers compete on serving metrics: time-to-first-token (latency to start streaming) and tokens-per-second throughput across the benchmark prompt set. The fastest verified server takes the lion\'s share of the round. This rewards real engineering wins — better attention kernels, smarter batching, prompt-prefix caching, well-tuned quantisation — rather than any single architectural bet. Reported leaderboard wins compound week to week as miners fork each other\'s open Docker images.',
    ],
    cheatPath: 'Containers that return wrong outputs fail the correctness gate and earn nothing — speed without quality is worthless. Miners cannot skip prompts because validators select the prompt set on the fly and run every container under identical compute. Quantising to a much smaller model would speed up tokens-per-second but break correctness for many prompts; the trade-off is bounded by the correctness tolerance.',
  },

  customer: {
    leadOneLine: 'Any product or platform running production LLM inference where latency and tokens-per-dollar dominate.',
    explanation: [
      'On the developer side, the customer is anyone running production LLM inference at scale — agent platforms, AI products with chat or RAG, search and code tools — where every millisecond of latency and every cent per million tokens shows up in unit economics. Cacheon\'s winners become an open library of high-performance serving containers that any team can pull and run.',
      'On the infrastructure side, the customer is the inference-host or aggregator that wants a curated supply of high-throughput serving stacks. Because containers are versioned and the leaderboard is public, Cacheon also produces ongoing benchmark data on which inference techniques actually move the needle on real LLMs, which is itself a research output that broader stacks like vLLM and sglang can absorb.',
    ],
  },

  competitive: {
    scope: 'LLM serving optimisation · 2026',
    rows: [
      { name: 'Cacheon', subtitle: 'SN14', isSelf: true, approach: 'Continuous TAO emissions to whoever ships the fastest verified inference container against the baseline model.', access: 'open · docker', accessTone: 'open', differentiator: 'Open Docker images, public leaderboard, continuous payment for measurable serving wins.' },
      { name: 'vLLM', subtitle: 'open-source serving', approach: 'Industry-standard open-source LLM inference engine with paged attention and continuous batching.', access: 'open · OSS', accessTone: 'open', differentiator: 'Library, not a network; no incentive layer for ongoing optimisation.' },
      { name: 'Together AI', subtitle: 'managed inference', approach: 'Hosted inference for open models with proprietary serving stack and per-token pricing.', access: 'open · API', accessTone: 'open', differentiator: 'Centralised host, closed serving optimisations, no shared leaderboard.' },
      { name: 'Fireworks AI', subtitle: 'managed inference', approach: 'High-performance hosted inference focused on low latency at scale.', access: 'open · API', accessTone: 'open', differentiator: 'Closed serving stack; no community-contributed optimisations published.' },
      { name: 'Targon / Chutes', subtitle: 'SN4 / SN64', approach: 'Bittensor inference subnets focused on hosting capacity rather than serving-stack optimisation.', access: 'open · API', accessTone: 'open', differentiator: 'Sister subnets; complement Cacheon by providing distribution while it provides optimised servers.' },
    ],
    note: 'Cacheon is differentiated by being an optimisation tournament rather than a hosting service. Versus vLLM or sglang, it pays for ongoing improvement rather than relying on volunteer maintenance. Versus Together / Fireworks, the wins are public and forkable. It does not directly compete with Bittensor inference subnets like Targon and Chutes — those subnets become natural distribution channels for the serving stacks Cacheon\'s tournament produces.',
  },

  team: {
    intro: [
      'Cacheon\'s public team identity beyond the operator handle is limited. The subnet launched following two previous identities on the slot — TAOHash (acquired by Latent Holdings for BTC hashrate) and KDN-1 (Tiger Alpha\'s knowledge-delivery network, which was later deregistered after value realisation back to TAO). The current operator relaunched the slot in May 2026 around the Cacheon inference-optimisation thesis.',
      'The thesis is sharp: inference cost is the single largest line item in AI products at scale, and an open Docker-container tournament against a fixed baseline model is the most direct way to drive that cost down. Treat this team profile as a stub — public founder identities are not currently disclosed at the level of detail other operator subnets publish.',
    ],
    founders: [
      { initials: 'CC', gradient: 'v', name: '[Cacheon team]', role: 'Subnet operator', bio: 'Launched the current Cacheon mechanism on SN14 in May 2026. Detailed founder identities are not publicly listed at this time.' },
    ],
    size: 'Small (not publicly disclosed)',
    founded: 'Cacheon launch May 2026; subnet 14 itself originally registered earlier',
    based: 'Distributed (not publicly disclosed)',
    backers: 'Not publicly disclosed.',
    placeholder: true,
  },

  milestones: [
    { date: '2025·05', text: 'TAOHash brand acquired by Latent Holdings for BTC hashrate (later moved off this slot).' },
    { date: '2025·06', text: 'Tiger Alpha acquired the subnet slot for 200 TAO (~$86K) for the KDN-1 project.' },
    { date: '2026·Q1', text: 'Tiger Alpha deregistered KDN-1, realising ~900 TAO from the original 200 TAO investment.' },
    { date: '2026·05', text: 'Cacheon launches on SN14 — Docker-based inference optimisation competition.' },
  ],

  join: {
    title: 'Submit a Cacheon container',
    body: 'Build a Docker container running an optimized inference server for the baseline model, register a Bittensor miner on SN14, and push your image for validators to benchmark.',
    asideNote: 'Validators need standard SN14 stake plus consistent GPU hardware so they can run every miner\'s container under identical compute conditions.',
  },

  tags: ['inference', 'llm', 'optimization', 'serving'],

  external: {
    website:  'https://cacheon.ai/',
    taostats: 'https://taostats.io/subnets/14/',
  },
};
