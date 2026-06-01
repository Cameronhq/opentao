import type { RichSubnet } from '../subnet-rich';

export const sn24: RichSubnet = {
  slug: '24-quasar',
  netuid: 24,
  name: 'Quasar',
  shortPitch: 'A Bittensor subnet for ultra-long-context AI — up to 2M tokens.',
  overview: [
    'Quasar is the subnet operated by SILX AI for long-context language modeling. Miners run long-context models — including Quasar-3B and the team\'s research line — and serve inference over contexts ranging from 100K to 2M tokens. Validators dispatch long-document tasks (legal, codebase, financial, academic) and score by accuracy across the extended sequence.',
    'The subnet uses a standard metagraph. Each tempo the validator broadcasts a long-context evaluation task — needle-in-a-haystack retrieval, document QA, codebase reasoning — and grades miner outputs against held-out ground truth. Models that maintain coherence and accuracy across the longest contexts earn the most emission.',
    'The pitch is architectural: the team behind Quasar replaces quadratic attention with linear-complexity memory mechanisms (Quasar-V4 uses Liquid Neural Networks rather than transformers). The result: context lengths that scale without the usual O(n²) compute blow-up. The customer outside Bittensor is anyone whose use case needs full-document understanding — legal, security audit, financial analysis, healthcare records.',
    'Where OpenAI / Anthropic ship long-context windows behind a paid API, Quasar runs an open competition with multiple architectures racing to extend the frontier. <a href="#customer" style="color: var(--accent);">See competitive landscape ↓</a>',
  ],
  cycle: {
    challenge: { actor: 'Validator', title: 'Send long-context task', body: 'Pick a long-document evaluation — needle-in-haystack, full-document QA, multi-file codebase reasoning — and broadcast to active miners.', dataK: 'payload', dataV: 'Document(s) · 100K–2M tokens' },
    compute:   { actor: 'Miner',     title: 'Process the document', body: 'Each miner runs its long-context model over the full input and returns the structured answer or generation.', dataK: 'latency',  dataV: '5–120 s on H100' },
    score:     { actor: 'Validator', title: 'Grade by accuracy', body: 'Compare miner answer to held-out ground truth across multiple needle positions and reasoning hops. Position-aware accuracy.', dataK: 'scale', dataV: '0.0 → 1.0 · accuracy × depth' },
    settle:    { actor: 'Subtensor', title: 'Yuma → emission', body: "Every validator's weights, multiplied by their stake, aggregated by Yuma into one reward vector. TAO mints to top miners.", dataK: 'tempo', dataV: '~72 min · 24×/day' },
  },
  miner: {
    does: 'Runs a long-context language model and answers tasks over 100K–2M-token inputs.',
    input: 'Long document(s) + structured task',
    output: 'Answer / generation with provenance to source positions',
    hardware: 'H100 80GB · multi-GPU for the largest contexts',
    paidFor: 'Accurate answers across the full input context, including late-position needles',
    paidVia: 'Per-tempo emission, score × validator stake',
  },
  validator: {
    does: 'Issues long-context evaluations, grades by position-aware accuracy, submits weights.',
    requires: 'Top-N stake + reference validator code + held-out eval set',
    output: 'Per-UID weight vector, signed on-chain',
    paidFor: 'Submitting weights that agree with consensus median',
    paidVia: 'Per-tempo emission, stake × consensus alignment',
  },
  scoring: {
    leadOneLine: 'Read the entire document. Now answer this — accurately, from anywhere in it.',
    explanation: [
      'The validator dispatches a long-document task to every active miner: a needle-in-a-haystack retrieval where the answer is buried at an unknown depth, a full-document QA task that requires reasoning across multiple sections, or a multi-file codebase reasoning task that demands true long-context understanding. Each miner runs its model over the full input — context lengths range from 100K to 2M tokens — and returns the answer.',
      'Scoring is position-aware accuracy: the validator places multiple needles throughout the document and grades whether the model finds all of them. Models that work only on the first or last chunk of the input score near zero. Models that maintain coherence and accuracy across the entire sequence earn the most.',
    ],
    cheatPath: 'Returning answers based only on the first / last few thousand tokens — fails the multi-position eval. Hallucinating plausible-sounding answers without grounding — needle-position evals catch this immediately. Re-using a single attention head over a sliding window — the validator includes cross-document reasoning tasks that require global state.',
  },
  customer: {
    leadOneLine: 'The customer outside Bittensor is anyone reasoning over long documents.',
    explanation: [
      'Use cases include legal-document analysis across entire case files, software-security audit across whole codebases, financial analysis incorporating decades of market data, healthcare analysis across complete patient histories, and academic-research synthesis across entire bodies of literature. All of these break at standard 128K context windows and require the 1M+ regime where Quasar lives.',
      'Concretely: customers query the Quasar gateway with their document(s) and structured task. The chain selects from the network of long-context miners and routes to the best-scoring model for the workload. Customers pay per-call in TAO or a fiat-bridged equivalent.',
    ],
  },
  competitive: {
    scope: 'long-context LLM · 2026',
    rows: [
      { name: 'Quasar', subtitle: 'SN24', isSelf: true, approach: 'Incentivized tournament of long-context architectures up to 2M tokens', access: 'open · API', accessTone: 'open', differentiator: 'Non-transformer architectures · multi-arch competition · open weights' },
      { name: 'Gemini 1.5 / 2.0', approach: 'Google\'s long-context transformer family', access: 'closed · paid', accessTone: 'closed', differentiator: 'First to 1M+ at scale · proprietary · expensive' },
      { name: 'Claude 200K', approach: 'Anthropic\'s 200K-token context Claude models', access: 'closed · paid', accessTone: 'closed', differentiator: 'Strong reasoning quality · capped at 200K' },
      { name: 'GPT-4.1 long context', approach: 'OpenAI long-context variant', access: 'closed · paid', accessTone: 'closed', differentiator: 'Quality leader · still bounded · pricey' },
      { name: 'Together / Fireworks long-context hosting', approach: 'Hosted inference for open-weights long-context models', access: 'closed · paid', accessTone: 'closed', differentiator: 'Centralized supply · no novel architecture · pass-through pricing' },
    ],
    note: 'Long context is one of the hardest scaling problems in LLMs — quadratic attention breaks at 1M+ tokens, and most "long-context" claims are sliding-window tricks that fail position-aware evals. Quasar\'s thesis is architectural: replace attention with linear-complexity memory (LNN, state-space, etc.) and run a tournament among the candidates. If any of those architectures wins the long-context regime, Quasar captures the supply side.',
  },
  team: {
    intro: [
      'Quasar is operated by SILX AI / SILX Labs, an AI research startup focused on next-generation foundation models and the future of synthetic intelligence. The lead is Eyad Gomaa (CEO & co-founder, GitHub handle troy12x), an AI researcher who is the architect behind Quasar\'s transition from quadratic attention to linear complexity.',
      'The pitch they make: "memory is the next frontier — context, not parameter count, is what determines what a model can actually understand." The team has shipped Quasar-3B (a looped continuous-time transformer) and is working toward Quasar-V4, a 400B-parameter non-transformer model using Liquid Neural Networks.',
    ],
    founders: [
      { initials: 'EG', gradient: 'v', name: 'Eyad Gomaa', role: 'CEO · Co-founder', bio: 'AI researcher; CEO and co-founder of SILX AI. Architect behind Quasar\'s linear-complexity memory mechanisms. Active publicly under the handle TroyQuasar / troy12x.', twitter: 'https://twitter.com/TroyQuasar', github: 'https://github.com/troy12x' },
      { initials: 'YF', gradient: 'a', name: 'Youssef Farahat', role: 'Co-founder', bio: 'SILX co-founder; visible on the public launch comms for Quasar on Bitstarter and the SN24 launch.', twitter: 'https://twitter.com/Farahatyoussef0' },
    ],
    size: 'Small core team',
    founded: '2025 · SN24 launched via Bitstarter Dec 2025',
    based: 'Distributed',
    backers: 'Bitstarter crowdfunding raise: 400 TAO from 66 contributors in 2 weeks.',
    placeholder: false,
  },
  milestones: [
    { date: '2025·12', text: 'Quasar launches subnet 24 via Bitstarter — 400 TAO raised in 2 weeks from 66 contributors.' },
    { date: '2026·04', text: 'Quasar-3B launched — looped continuous-time transformer for long-context.' },
    { date: '2026·Q2', text: 'Roadmap to Quasar-V4 — 400B-parameter Liquid Neural Network, non-transformer architecture.' },
  ],
  join: {
    title: 'Run a long-context model',
    body: 'Hardware spec (H100 80GB recommended, multi-GPU for the longest contexts) and reference miner code are in SILX-LABS/QUASAR-SUBNET. Validators welcome — top-N stake + eval set.',
    asideNote: 'Validating? Top-N stake + held-out long-context eval set. Reference validator in the SILX-LABS GitHub org.',
  },
  tags: ['ai-model', 'inference', 'long-context', 'foundation-model'],
  external: {
    github: 'https://github.com/SILX-LABS/QUASAR-SUBNET',
    twitter: 'https://twitter.com/QuasarModels',
    taostats: 'https://taostats.io/subnets/24/',
  },
};
