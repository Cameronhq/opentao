import type { RichSubnet } from '../subnet-rich';

export const chutes: RichSubnet = {
  slug: '64-chutes',
  netuid: 64,
  name: 'Chutes',
  shortPitch: 'Serverless GPU inference — deploy any AI model, pay per call.',
  overview: [
    'Chutes is Bittensor Subnet 64, a decentralized serverless AI compute platform operated by Rayon Labs. It lets developers package any model as a containerized "chute" and run it on a global fleet of GPU miners through a single API. By emission share (~14.4%) Chutes is the #2 subnet on Bittensor and the first to cross $100M market cap after the dTAO launch.',
    'The network runs on Kubernetes fleets of bare-metal GPUs (H100, H200, A100, A6000, L40S class). Validators bid chutes onto miners and score them on a 7-day rolling window: compute units 55%, invocation count 25%, unique chute score 15%, bounty count 5%. GraVal — a custom C/CUDA library — attests each GPU via matrix multiplications seeded by device info.',
    'The customer outside Bittensor is any AI app developer who needs serverless inference: OpenRouter routes traffic to Chutes for open-weight LLMs, and the platform has processed over 9 trillion cumulative tokens with daily peaks exceeding 50 billion. Reported cost is ~85% lower than equivalent AWS inference.',
    'One-line diff: a TAO-incentivized Replicate where bare-metal GPU operators replace a single cloud provider. <a href="#customer" style="color: var(--accent);">See competitive landscape ↓</a>',
  ],
  cycle: {
    challenge: { actor: 'Validator', title: 'Bid a chute onto miners', body: 'Validator assigns a containerized chute (model + runtime) to candidate miners, then sends a GraVal challenge to attest the GPU is real bare-metal hardware before any invocation traffic flows.', dataK: 'payload', dataV: 'chute image + GraVal seed' },
    compute:   { actor: 'Miner',     title: 'Cold-start + serve inference', body: 'Miner pulls the container, loads weights into VRAM, passes GraVal matmul attestation, and serves invocations. Cold-start time and steady-state token/step latency directly feed the compute-unit score.', dataK: 'latency',  dataV: 'cold-start + tok/s' },
    score:     { actor: 'Validator', title: '7-day rolling weights', body: 'Validator aggregates compute_seconds, invocation_count, unique chutes hosted, and bounty_count over a 7-day window. Median-based rate normalization caps gaming; only the highest-scoring hotkey per coldkey earns.', dataK: 'scale',    dataV: '55/25/15/5 weights' },
    settle:    { actor: 'Subtensor', title: 'Yuma → emission', body: "Every validator's weights, multiplied by their stake, aggregated by Yuma into one reward vector. TAO mints to top miners.", dataK: 'tempo', dataV: '~72 min · 24×/day' },
  },
  miner: {
    does: 'Operates a Kubernetes fleet of bare-metal GPUs, pulls containerized chutes from validators, attests each GPU via GraVal, and serves inference requests with low cold-start and high throughput.',
    input: 'Containerized chute image + GraVal challenge from validator',
    output: 'Inference responses + verified GPU attestation',
    hardware: 'Bare-metal H100/H200/A100/A6000/L40S only — Runpod, Vast, shared/dynamic IPs explicitly disallowed; RAM ≥ VRAM × #GPUs',
    paidFor: '7-day sum of compute units (55%), invocations (25%), unique chutes (15%), bounties (5%)',
    paidVia: 'Per-tempo emission, score × validator stake',
  },
  validator: {
    does: 'Bids chutes onto miners, issues GraVal attestations, measures latency and throughput of every invocation, computes the 7-day rolling score and submits weights.',
    requires: 'Bittensor validator stake + ability to dispatch chute workloads and run GraVal verifications',
    output: 'Weight vector across all miners per tempo',
    paidFor: 'Submitting weights that agree with consensus median',
    paidVia: 'Per-tempo emission, stake × consensus alignment',
  },
  scoring: {
    leadOneLine: 'A 7-day rolling weighted blend of compute time, invocations, unique chutes, and bounties — gated by GraVal GPU attestation.',
    explanation: [
      'The four components: compute_units (55%) sums bounties plus normalized compute time scaled by GPU class; invocation_count (25%) counts successful jobs; unique_chute_score (15%) rewards GPU-weighted simultaneous chute coverage with a two-tier exponent normalization (1.3 above median, 2.2 below); bounty_count (5%) credits being first to serve a freshly deployed chute.',
      'Compute rates are median-normalized over a 2-day window so outliers cannot inflate scores, and only the highest-scoring hotkey per coldkey earns — multi-UID farms are pruned. The 7-day window means new miners ramp slowly and uptime compounds.',
    ],
    cheatPath: 'A miner who tries to mine on rented or virtualized GPUs (Runpod, Vast, shared cloud VMs) cannot pass GraVal attestation: the custom C/CUDA library runs matrix multiplications seeded by device fingerprints and verifies that ≥95% of advertised VRAM is actually addressable. Virtualized GPUs fail the VRAM and timing checks, and the subnet documentation explicitly states the stack "will not work on Runpod, Vast, etc." Dynamic or shared IPs are also rejected, killing the cheapest spot-arbitrage paths.',
  },
  customer: {
    leadOneLine: 'AI app developers and inference aggregators who need cheap, elastic serverless GPU without managing infrastructure.',
    explanation: [
      'The headline external customer is OpenRouter, which routes a large share of open-weight LLM traffic (DeepSeek, Qwen, Llama, Mistral, Gemma) through Chutes. End users access the platform via a web app or API key and pay for inference; the network has cleared more than 9 trillion cumulative tokens with daily peaks above 50B tokens.',
      'The pitch to developers is concrete: deploy any containerized model in seconds, scale to zero between calls, pay only for compute used, and avoid a single-vendor cloud bill — Chutes claims ~85% lower cost than AWS for comparable inference. Beyond LLMs the platform also hosts image, audio (Whisper) and embedding workloads.',
    ],
  },
  competitive: {
    scope: 'Serverless GPU inference for open-weight LLMs, image, and audio models · 2026',
    rows: [
      { name: 'Chutes', subtitle: 'SN64', isSelf: true, approach: 'Decentralized bare-metal GPU fleet, TAO-incentivized; any container becomes a serverless endpoint.', access: 'open · API + web app', accessTone: 'open', differentiator: 'Only network where GPU supply is permissionless and attested via GraVal; ~85% cheaper than AWS for equivalent inference.' },
      { name: 'Replicate', approach: 'Centralized serverless GPU host for community-published models, cog containerization.', access: 'open · API + web', accessTone: 'open', differentiator: 'Cleanest model marketplace and developer UX, but single-vendor pricing and capacity.' },
      { name: 'Together AI', approach: 'Hosted inference + fine-tuning for open-weight LLMs on owned GPU clusters.', access: 'open · API', accessTone: 'open', differentiator: 'Curated model catalog with custom inference kernels; closed supply, enterprise pricing.' },
      { name: 'Fireworks AI', approach: 'Optimized inference stack for open LLMs with FireAttention runtime.', access: 'open · API', accessTone: 'open', differentiator: 'Latency leader on popular open models; centralized capacity, premium pricing.' },
      { name: 'Modal Labs', approach: 'General serverless Python/GPU runtime — bring your own container, scale to zero.', access: 'open · SDK + API', accessTone: 'open', differentiator: 'Broader compute primitive (not just inference); pay-per-second on rented hyperscaler GPUs.' },
      { name: 'AWS Bedrock', approach: 'Managed API for foundation models inside AWS, mostly closed-weight (Anthropic, Meta, Mistral).', access: 'closed · enterprise API', accessTone: 'closed', differentiator: 'Deep AWS integration and compliance; expensive, closed catalog, no custom containers.' },
    ],
    note: 'Chutes is the only entrant whose underlying GPU supply is permissionless: anyone with attested bare-metal hardware can join the miner side, while every other competitor runs a single-vendor fleet. The trade-off is operational variance — Chutes is optimized for open-weight model traffic (OpenRouter-style) rather than enterprise-grade SLAs.',
  },
  team: {
    intro: [
      'Chutes is operated by Rayon Labs, the same group behind Subnet 19 (Nineteen, high-frequency inference) and Subnet 56 (Gradients, decentralized AutoML fine-tuning). Together the "Rayon Trio" controls roughly 23.7% of daily TAO emissions, making it the most influential development group on Bittensor.',
      'The org presents itself as a global decentralized collective under Chutes Global Corp with no CEO; contributors operate under pseudonyms and ship through collective governance. Core backend work is led by Jon Durbin alongside Cxmplex, Florian S, Kyle, and Sirouk.',
    ],
    founders: [
      { initials: 'JD', gradient: 'v', name: 'Jon Durbin', role: 'Core backend / Rayon Labs', bio: 'Backend engineer on Chutes; widely known in the open-weight LLM community for the Airoboros fine-tuning datasets and models.', twitter: 'https://twitter.com/jon_durbin', github: 'https://github.com/jondurbin' },
      { initials: 'CX', gradient: 'a', name: 'Cxmplex', role: 'Backend', bio: 'Pseudonymous core backend contributor at Rayon Labs; works across Chutes infrastructure.' },
      { initials: 'NM', gradient: 'g', name: 'Namoray', role: 'Co-founder, Rayon Labs', bio: 'Co-founder of Rayon Labs; involved across Chutes, Nineteen, and Gradients.', twitter: 'https://twitter.com/namoray_dev' },
    ],
    size: '~11 named contributors across engineering, sales, and support',
    founded: '2024',
    based: 'Distributed / remote',
    backers: 'Self-funded via TAO emissions; no disclosed external venture round.',
    placeholder: true,
  },
  milestones: [
    { date: '2024·Q4', text: 'Subnet 64 registered on Bittensor and Chutes platform brought online.' },
    { date: '2025·02', text: 'dTAO launches; Chutes becomes the first subnet to cross $100M market cap, ~9 weeks later.' },
    { date: '2025·02', text: 'OpenRouter integration drives traffic past 5B tokens/day.' },
    { date: '2025·04', text: 'Monetization rolled out for selected models; TAO-denominated payments enabled.' },
    { date: '2025·05', text: 'Daily throughput reaches ~100B tokens/day — roughly 250× growth since January.' },
    { date: '2026·05', text: '#2 subnet by emission share (~14.4%); 9T+ cumulative tokens processed.' },
  ],
  join: {
    title: 'Run a Chutes miner',
    body: 'You need bare-metal H100/H200/A100/A6000-class GPUs with static unique IPs, system RAM ≥ VRAM × #GPUs, and a K3s control node (4 cores / 32 GB minimum). Follow the rayonlabs/chutes-miner Ansible playbook, register your hotkey, and expect a 7-day ramp before scores stabilize.',
    asideNote: 'Rented GPUs (Runpod, Vast) and shared/dynamic IPs will fail GraVal attestation — do not attempt them.',
  },
  tags: ['serverless-inference', 'gpu', 'llm', 'rayon-labs', 'kubernetes', 'graval'],
  external: {
    github: 'https://github.com/rayonlabs/chutes-miner',
    website: 'https://chutes.ai',
    twitter: 'https://twitter.com/rayon_labs',
    taostats: 'https://taostats.io/subnets/64/',
  },
  tweets: [
    { when: '2025·02', body: 'Chutes is now processing over 5 Billion Tokens every single day on OpenRouter. This is a 2.5x increase from just over a week ago and is showing no signs of slowing down.' },
    { when: '2025·05', body: 'Chutes crossed ~100B tokens/day — a 250x ramp since January, powered by hundreds of H200s and A6000s live on the network.' },
  ],
};
