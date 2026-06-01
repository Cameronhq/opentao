import type { RichSubnet } from '../subnet-rich';

export const targon: RichSubnet = {
  slug: '4-targon',
  netuid: 4,
  name: 'Targon',
  shortPitch: 'Confidential GPU inference market on Bittensor — verifiable, OpenAI-compatible, runs inside hardware TEEs.',
  overview: [
    'Targon is Bittensor Subnet 4, operated by Manifold Labs (Austin, TX), and functions as the network\'s industrial inference and confidential-compute marketplace. Miners run OpenAI-compatible LLM endpoints inside hardware-attested Trusted Execution Environments (Intel TDX CPUs paired with NVIDIA Hopper/Blackwell GPUs), so neither the host nor the operator can inspect prompts, weights, or outputs while serving traffic.',
    'The subnet uses the standard 64-validator / 192-miner Bittensor metagraph. Validators dispatch synthetic and organic queries, then verify miner responses through deterministic single-token logprob comparison against a reference model; correct miners are then ranked by throughput (TPS) and latency. Weights flow through Yuma Consensus every ~72-minute tempo, and jobs re-attest their TEE state on the same cadence.',
    'Customers consume Targon as a regular OpenAI-compatible inference API at targon.com and through OpenRouter listings. Reported usage in 2025 included roughly 20B paid inference tokens per day, ~$10.4M ARR, and named buyers Dippy AI (which routes ~50% of its text inference through SN4), Ridges, and Score.',
    'Against Together AI, Fireworks, and other centralized inference clouds, Targon\'s wedge is verifiable confidential compute — every token is provably produced inside an attested TEE, not just behind a vendor TOS. <a href="#customer" style="color: var(--accent);">See competitive landscape ↓</a>',
  ],
  cycle: {
    challenge: { actor: 'Validator', title: 'Issue OpenAI-compatible query', body: 'Validator sends a synthetic or organic chat/completion request with a fixed sampling seed to a miner endpoint, plus periodic TEE attestation challenges.', dataK: 'payload', dataV: 'seeded prompt + model id' },
    compute:   { actor: 'Miner',     title: 'Serve inside TEE', body: 'Miner runs the request on its TDX/Hopper TEE-backed inference server (vLLM-class stack) and streams tokens back with logprobs.', dataK: 'latency',  dataV: 'TPS + TTFT measured' },
    score:     { actor: 'Validator', title: 'Verify + rank', body: 'Validator recomputes a single-token logprob against the reference model; matching miners are ranked on throughput and latency, mismatches and failed attestations score zero.', dataK: 'scale',    dataV: 'logprob match · TPS' },
    settle:    { actor: 'Subtensor', title: 'Yuma → emission', body: "Every validator's weights, multiplied by their stake, aggregated by Yuma into one reward vector. TAO mints to top miners.", dataK: 'tempo', dataV: '~72 min · 24×/day' },
  },
  miner:     { does: 'Hosts an OpenAI-compatible LLM endpoint inside a hardware-attested confidential VM and serves validator + organic traffic.', input: 'Seeded chat/completion request and TEE attestation challenge', output: 'Streamed tokens with logprobs + remote attestation report', hardware: 'NVIDIA Hopper/Blackwell GPU (H100/H200/B200) + Intel TDX (or AMD SEV-SNP) host', paidFor: 'Logprob-correct responses with high TPS and low latency, plus passing attestation', paidVia: 'Per-tempo emission, score × validator stake' },
  validator: { does: 'Sends queries, recomputes a single reference token, verifies attestation, and ranks miners by TPS/latency.', requires: 'Bittensor stake + reference-model GPU sufficient for single-token verification (much lower than full-model serving since v3)', output: 'Weight vector over miners', paidFor: 'Submitting weights that agree with consensus median', paidVia: 'Per-tempo emission, stake × consensus alignment' },
  scoring: {
    leadOneLine: 'Deterministic single-token logprob check gates rewards; verified miners are then sorted by speed.',
    explanation: [
      'For each query the validator fixes a sampling seed and a reference model. After a miner returns its response, the validator runs the reference model for a single token and compares logprobs against the miner\'s claim. A close enough match means the miner is running the declared weights on real hardware; anything else scores zero. This replaced v2\'s full-model verification and cut validator compute cost dramatically.',
      'Among verified miners, weights are assigned on measured throughput (tokens per second) and time-to-first-token, with attestation freshness as a hard gate. Miners that drop out of attestation, return mismatched logprobs, or stall on streaming are zeroed before the speed ranking runs.',
    ],
    cheatPath: 'Running a smaller/quantized model fails the logprob check on the very first verified token. Replaying cached outputs fails because seeds and prompts vary per query. Spoofing a TEE without hardware attestation fails the periodic re-attestation handshake. Coordinating with a validator does not help because median consensus across 64 validators discards outlier weight vectors.',
  },
  customer: {
    leadOneLine: 'Production AI teams that need OpenAI-compatible inference plus a hard privacy guarantee buy Targon capacity directly.',
    explanation: [
      'Targon sells inference like any cloud — REST/streaming endpoints, OpenAI schema, priced per million tokens — but every request runs inside an attested TEE, so prompts and outputs are invisible to Manifold, the GPU host, and the data center. Publicly named customers include Dippy AI (~50% of its text inference, multi-million user companion app), Ridges, and Score; capacity at targon.com reportedly sells out on listing as of mid-2026.',
      'Reported scale through 2025 was ~20B paid inference tokens/day and ~$10.4M ARR, with ~$60M/year in compute incentives flowing to miners on the supply side. The thesis is that any workload touching regulated data (health, finance, gov) or proprietary prompts (agent infra) needs hardware-level confidentiality, not just a vendor NDA.',
    ],
  },
  competitive: {
    scope: 'Hosted LLM inference for production apps (OpenAI-compatible APIs)',
    rows: [
      { name: 'Targon', subtitle: 'SN4', isSelf: true, approach: 'Decentralized GPU market, every job inside Intel TDX + NVIDIA CC TEE, deterministic logprob verification', access: 'open · API', accessTone: 'open', differentiator: 'Hardware-attested confidential inference; host cannot see prompts or outputs' },
      { name: 'Together AI', approach: 'Centralized inference cloud on owned/leased GPU clusters, OpenAI-compatible API', access: 'closed · API', accessTone: 'closed', differentiator: 'Wide model catalog and fine-tuning, but standard cloud trust model — no TEE attestation' },
      { name: 'Fireworks AI', approach: 'Centralized inference cloud optimized for ultra-low TTFT and high TPS on popular OSS models', access: 'closed · API', accessTone: 'closed', differentiator: 'Best-in-class latency and per-token price, but no hardware confidentiality guarantee' },
      { name: 'Replicate', approach: 'Serverless model hosting with per-second GPU billing and a large community model library', access: 'closed · API', accessTone: 'closed', differentiator: 'Easiest long-tail model deployment; cold starts and shared infra, not TEE-backed' },
      { name: 'Cloudflare Workers AI', approach: 'Serverless inference on Cloudflare\'s global GPU edge with built-in Workers integration', access: 'closed · API', accessTone: 'closed', differentiator: 'Lowest-friction edge deployment, fixed model menu; no confidential-compute story for LLMs' },
    ],
    note: 'The centralized inference clouds compete on price, latency, and model coverage — all assuming the customer trusts the operator with prompts and weights. Targon\'s bet is that a growing slice of inference demand (regulated industries, agent infra, proprietary prompts) is unwilling to make that assumption and will pay a premium for cryptographic proof that no one inspected the workload, which only a hardware-attested decentralized supply chain can credibly provide.',
  },
  team: {
    intro: [
      'Manifold Labs Inc. is the Austin, Texas team operating Targon since its 2024 launch. The founders came directly out of the Opentensor / Bittensor Foundation — giving the subnet unusually deep protocol context — and have positioned Manifold as the infrastructure arm of the Bittensor ecosystem rather than a single-application team.',
      'The product philosophy is to make decentralized GPU compute indistinguishable from a regular cloud at the API surface (OpenAI schema, targon.com console, OpenRouter listings) while using TEEs and on-chain verification to deliver a guarantee no centralized cloud offers. Intel and NVIDIA co-author technical papers with the team on confidential compute.',
    ],
    founders: [
      { initials: 'RM', gradient: 'v', name: 'Robert Myers',  role: 'Founder & CEO',       bio: 'Former Senior Software Engineer at the Opentensor Foundation. Leads Targon\'s protocol and verification stack.' },
      { initials: 'JW', gradient: 'a', name: 'James Woodman', role: 'Co-founder & President', bio: 'Previously COO of the Bittensor Foundation. Runs go-to-market and enterprise compute deals.' },
      { initials: 'JB', gradient: 'g', name: 'Joshua Brown',  role: 'CTO',                bio: 'Leads engineering on the Targon Virtual Machine, TDX/NVIDIA CC integration, and the inference engine.' },
    ],
    size: '~15–25', founded: '2024', based: 'Austin, TX',
    backers: 'OSS Capital (lead), Digital Currency Group, Tobi Lütke, Ram Shriram, Zachary Smith, Jacob Steeves, Ala Shaabana, Logan Kilpatrick — $10.5M Series A, July 2025',
    placeholder: false,
  },
  milestones: [
    { date: '2024·01', text: 'Repository and license established under manifold-inc/targon' },
    { date: '2025·03', text: 'Targon v6 announced, introducing the Targon Virtual Machine architecture' },
    { date: '2025·07', text: '$10.5M Series A led by OSS Capital; ~639B tokens served in the month' },
    { date: '2025·10', text: 'Secure Targon Compute product launches at targon.com' },
    { date: '2026·03', text: 'Manifold + Intel co-publish whitepaper on decentralized compute via Intel TDX and encrypted CVMs' },
    { date: '2026·Q2', text: 'Targon v3 verification ships: single-token logprob check, full OpenAI compliance, TPS metrics restored' },
  ],
  join: { title: 'Run a TEE miner or buy attested inference', body: 'Operators with NVIDIA Hopper/Blackwell GPUs and Intel TDX (or AMD SEV-SNP on the roadmap) can register as miners. Buyers can hit OpenAI-compatible endpoints at targon.com or via OpenRouter listings, paying per million tokens — optionally with SN4 alpha discounts.', asideNote: 'Subnet supports 192 miner slots and 64 validator slots in the standard metagraph.' },
  tags: ['inference', 'confidential-compute', 'TEE', 'GPU', 'LLM', 'OpenAI-compatible'],
  external: { github: 'https://github.com/manifold-inc/targon', website: 'https://targon.com', twitter: 'https://x.com/TargonCompute', taostats: 'https://taostats.io/subnets/4/' },
  tweets: [
    { when: '2025·07', body: 'Dippy AI: "Bittensor\'s @manifoldlabs Targon SN4 is now processing ~50% of Dippy\'s text inference."' },
    { when: '2026·03', body: 'Manifold + Intel publish "Decentralized Compute on Untrusted Hardware Using Intel TDX and Encrypted CVMs."' },
    { when: '2026·Q2', body: 'Confidential Compute demand surges — capacity on targon.com selling out on listing.' },
  ],
};
