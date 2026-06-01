import type { RichSubnet } from '../subnet-rich';
export const sn96: RichSubnet = {
  slug: '96-verathos', netuid: 96, name: 'Verathos',
  shortPitch: 'Cryptographically verified LLM inference and training via sumcheck proofs over Merkle-committed weights.',
  overview: [
    'Verathos (SN96) is a decentralized compute network on Bittensor where any tensor operation — inference or training — can be cryptographically proven via ZK-inspired sumcheck-based verification over Merkle-committed weights, anchored on-chain. The pitch line: "trust the math, not the server."',
    'Validators verify proofs on CPU in milliseconds, which keeps the network permissionless and cheap to police. The proof plugin integrates directly into production vLLM serving and generates sumcheck proofs for GEMM operations in parallel during CUDA graph execution, with only single-digit percent overhead — production-deployable, not a research toy.',
    'The proof system extends beyond inference. The training prover verifies forward pass, backward pass (gradient GEMM), and optimizer step (AdamW, SGD, Muon) for full fine-tuning and LoRA — so verifiable training, not just inference, becomes accessible. The subnet exposes an OpenAI-compatible API with score-weighted routing across all miners, and every response includes cryptographic proof metadata.',
    'Payments accepted in TAO, USDC on Base, or x402 pay-per-request — multi-rail commercial monetization rather than emission-only economics. <a href="#customer" style="color: var(--accent);">See competitive landscape ↓</a>',
  ],
  cycle: {
    challenge: { actor: 'Validator', title: 'Forward request', body: 'Validator routes an OpenAI-compatible inference (or training) request to selected miners.', dataK: 'payload', dataV: 'prompt + proof request' },
    compute:   { actor: 'Miner',     title: 'Compute + prove', body: 'Miner executes the tensor operation on GPU and generates a sumcheck proof in parallel with single-digit % overhead.', dataK: 'latency',  dataV: 'vLLM-grade, +small proof tax' },
    score:     { actor: 'Validator', title: 'CPU-verify proof', body: 'Validator verifies the sumcheck proof against Merkle-committed weights in milliseconds on CPU and sets weights.', dataK: 'scale',    dataV: 'ms verification' },
    settle:    { actor: 'Subtensor', title: 'Yuma → emission', body: "Every validator's weights, multiplied by their stake, aggregated by Yuma into one reward vector. TAO mints to top miners.", dataK: 'tempo', dataV: '~72 min · 24×/day' },
  },
  miner:     { does: 'Serves verified LLM inference and training with sumcheck proofs over Merkle-committed weights.', input: 'OpenAI-compatible prompts or training jobs with weight commitments', output: 'Completions / gradients + cryptographic proof metadata', hardware: 'GPU running vLLM with the Verathos proof plugin (CUDA graph integration)', paidFor: 'Producing correct, verifiable tensor computations at scale', paidVia: 'Per-tempo emission, score × validator stake' },
  validator: { does: 'Routes requests, CPU-verifies sumcheck proofs in milliseconds, weights miners by verified compute volume.', requires: 'Proof verifier + Merkle commitment registry', output: 'Per-miner weights tied to verified-correct computations', paidFor: 'Submitting weights that agree with consensus median', paidVia: 'Per-tempo emission, stake × consensus alignment' },
  scoring:   {
    leadOneLine: 'Proofs verify correctness; reward scales with verified-correct compute volume.',
    explanation: [
      'Every miner output carries a sumcheck proof over the GEMM operations executed against committed weights. Validators reject any output whose proof fails verification, so correctness is binary rather than estimated. Among correctly-proven outputs, validators reward by throughput, latency, and demand share.',
      'Because verification is CPU-millisecond cheap, the network can police itself permissionlessly — no need for expensive verifier-side hardware or trust assumptions on miner self-attestation. The economic asymmetry (proving costs a few percent, verifying is millisecond-cheap) is the protocol\'s defining property.',
    ],
    cheatPath: 'Returning a different model\'s output — Merkle weight commitments + sumcheck proofs make any deviation from the committed weights mathematically detectable.',
  },
  customer:  {
    leadOneLine: 'Builders who need provably honest LLM inference and verifiable training — agents, regulated AI, on-chain AI products.',
    explanation: [
      'The target is anyone for whom "the server said so" isn\'t good enough: AI agents that route financial decisions on LLM output, on-chain protocols that consume model results, regulated industries that need audit trails on model versioning, and customers paying with crypto rails (TAO, USDC, x402) who want verifiable correctness per request.',
      'Verathos competes head-on with verified-inference subnets (Targon SN4, inference-labs SN2) and centralized hosted inference (OpenAI, Anthropic) on a different axis — mathematical proof rather than reputation. The bet is that an OpenAI-compatible API with proof metadata becomes the default for autonomous AI agents.',
    ],
  },
  competitive: { scope: '2026 · verified AI compute', rows: [
    { name: 'Verathos', subtitle: 'SN96', isSelf: true, approach: 'Sumcheck proofs over Merkle-committed weights, ms CPU verification', access: 'open · API', accessTone: 'open', differentiator: 'Production-grade proofs with single-digit % overhead, verified training' },
    { name: 'Targon', subtitle: 'SN4', approach: 'Verifier-driven quality scoring on LLM outputs', access: 'open · API', accessTone: 'open', differentiator: 'Proven OpenAI-compatible inference at scale, no cryptographic proofs' },
    { name: 'Omron / Subnet 2', approach: 'ZK proofs for ML inference on Bittensor', access: 'open · API', accessTone: 'open', differentiator: 'Pure ZK approach, heavier proving overhead' },
    { name: 'EZKL', approach: 'ZK-SNARK toolkit for ML inference', access: 'open · API', accessTone: 'open', differentiator: 'Toolkit only, not a hosted network' },
    { name: 'OpenAI / Anthropic', approach: 'Centralized hosted LLM inference', access: 'closed · API', accessTone: 'closed', differentiator: 'Trust-the-provider model, no proofs' },
  ], note: 'Verathos\'s practical wedge over ZK-SNARK approaches is overhead: sumcheck with Merkle commitments runs at single-digit percent overhead vs. orders-of-magnitude blowup for full SNARKs. That gap is what makes it production-deployable.' },
  team: {
    intro: [
      'Verathos is operated by the team at verathos-ai (GitHub). Specific founder identities are not prominently disclosed in publicly available materials as of mid-2026.',
      'The team\'s focus is on production-grade verifiable inference and training — the vLLM-integrated proof plugin is the headline engineering achievement.',
    ],
    founders: [{ initials: 'VT', gradient: 'v', name: '[Verathos team]', role: 'Operators', bio: 'Team behind SN96, building verifiable LLM inference and training infrastructure.' }],
    size: 'Not publicly disclosed', founded: '2025', based: 'Not publicly disclosed', backers: 'Not publicly disclosed.', placeholder: true,
  },
  milestones: [
    { date: '2025', text: 'Subnet 96 registered as Verathos.' },
    { date: '2025', text: 'vLLM-integrated proof plugin with sumcheck GEMM proofs ships.' },
    { date: '2026', text: 'Training prover extends to forward/backward/optimizer for full FT + LoRA.' },
  ],
  join: { title: 'Run verifiable inference', body: 'Operators with GPU capacity can install the Verathos proof plugin in their vLLM stack and mine with single-digit percent overhead. Validators run lightweight CPU verification — minimal hardware required.', asideNote: 'Cryptographic-proof subnets are a small but growing category; differentiation against pure ZK-SNARK approaches and quality-scoring subnets matters.' },
  tags: ['verifiable-inference', 'zk-inspired', 'sumcheck', 'vllm'],
  external: { github: 'https://github.com/verathos-ai/verathos', website: 'https://verathos.ai/', taostats: 'https://taostats.io/subnets/96/' },
  tweets: [],
};
