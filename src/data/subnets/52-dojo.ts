import type { RichSubnet } from '../subnet-rich';

export const sn52: RichSubnet = {
  slug: '52-dojo',
  netuid: 52,
  name: 'Dojo',
  shortPitch: 'Crowdsourced human-preference labels for training aligned AI models.',
  overview: [
    'Tensorplex Dojo (SN52) is the human-data layer of Bittensor. Miners — many of them running their own teams of human labelers — submit preference rankings, quality ratings, and taste-based judgments across modalities (text, code, UI design, 3D assets). The output is a real-time pipeline of labeled human preference data that AI labs can train against.',
    'The bet is that aligned AI still needs humans in the loop, and that competitively-scored crowdsourcing beats centralized contractor stacks like Scale AI or Surge AI on both cost and signal. Bittensor\'s emission economy turns labelers into independent operators incentivized to be accurate, not to maximize hours billed.',
    'Quality is enforced through synthetic task generation (LLMs propose tasks with known correct preferences), synthetic ground-truth validation against held-out signals, and obfuscation that makes Sybil attacks and bot labeling detectable. As of 2026 the network has collected 3M+ human-generated data points across modalities.',
    'Dojo is the workhorse behind Tensorplex\'s broader product surface (including the Backprop trading terminal and Tensorplex\'s validator infra). Yzi Labs led a strategic investment in Tensorplex Labs that reportedly drove the alpha 500% in a day. <a href="#customer" style="color: var(--accent);">See competitive landscape ↓</a>',
  ],
  cycle: {
    challenge: { actor: 'Validator', title: 'Issue task', body: 'Validators generate or relay preference tasks — e.g., "rank these four model responses" or "rate this UI screenshot" — with a hidden synthetic ground-truth signal embedded.', dataK: 'payload', dataV: 'preference / rating prompt' },
    compute:   { actor: 'Miner',     title: 'Collect labels', body: 'Miners route the task to their human labelers (or labeling team) and return structured preference rankings or ratings within the task window.', dataK: 'latency',  dataV: 'human-paced (minutes)' },
    score:     { actor: 'Validator', title: 'Quality check', body: 'Validators compare submitted labels against synthetic ground truth and cross-miner agreement, scoring for accuracy and resistance to Sybil/bot patterns.', dataK: 'scale',    dataV: 'multi-modal preferences' },
    settle:    { actor: 'Subtensor', title: 'Yuma → emission', body: "Every validator's weights, multiplied by their stake, aggregated by Yuma into one reward vector. TAO mints to top miners.", dataK: 'tempo', dataV: '~72 min · 24×/day' },
  },
  miner: {
    does: 'Recruits, manages, and submits labels from a team of human labelers (or a single skilled labeler).',
    input: 'Preference tasks issued by validators across text, image, UI, code, or 3D modalities.',
    output: 'Structured preference rankings or quality ratings tied to the task ID.',
    hardware: 'Light — primarily a labeler interface; the real "hardware" is a team of trained humans.',
    paidFor: 'Label accuracy vs. synthetic ground truth + cross-validator agreement.',
    paidVia: 'Per-tempo emission, score × validator stake',
  },
  validator: {
    does: 'Generates / relays tasks, embeds quality controls, evaluates submissions, submits weights.',
    requires: 'LLM access for synthetic task generation, ground-truth oracle store, anti-Sybil infrastructure.',
    output: 'Per-miner weights scoring label accuracy and authenticity.',
    paidFor: 'Submitting weights that agree with consensus median',
    paidVia: 'Per-tempo emission, stake × consensus alignment',
  },
  scoring: {
    leadOneLine: 'Did your humans agree with the hidden ground truth on tasks they didn\'t know were being graded?',
    explanation: [
      'Validators slip synthetic-ground-truth tasks into the stream — tasks where the "right" preference is known to the validator but invisible to the miner. A miner whose labelers consistently match those hidden answers proves they have real, attentive humans on the other end.',
      'On top of that, Dojo runs anti-Sybil techniques (obfuscation, behavior fingerprinting) that make bot labeling, copy-paste farms, and duplicate-team manipulation detectable. The score combines accuracy with authenticity-of-source.',
    ],
    cheatPath: 'Pasting LLM-generated preferences instead of human ones doesn\'t survive — synthetic ground truth catches the systematic biases of any single LLM grader.',
  },
  customer: {
    leadOneLine: 'AI labs and product teams who need RLHF-grade preference data without owning a labeling vendor.',
    explanation: [
      'Buyers want preference data for RLHF, DPO, evaluator training, model A/B comparisons, and product-quality grading. Dojo competes on cost (no Scale/Surge markup), modality breadth (UI + 3D + text + code), and real-time delivery rather than batch contracts.',
      'For Tensorplex itself, Dojo also feeds the team\'s own downstream products — preference data is the raw material for almost every alignment-related model Tensorplex ships.',
    ],
  },
  competitive: {
    scope: '2026 · human preference data for AI training',
    rows: [
      { name: 'Dojo', subtitle: 'SN52', isSelf: true, approach: 'Open subnet; miners run human labeler teams; validators enforce quality via synthetic ground truth.', access: 'open · API', accessTone: 'open', differentiator: 'Cryptoeconomic quality control + multi-modal + no procurement contract.' },
      { name: 'Scale AI',                 approach: 'Enterprise human-labeling contractor; large managed workforce.', access: 'closed · enterprise', accessTone: 'closed', differentiator: 'Premium pricing; long sales cycles; vendor lock-in.' },
      { name: 'Surge AI',                 approach: 'Higher-end labeler service for RLHF and alignment work.', access: 'closed · enterprise', accessTone: 'closed', differentiator: 'High quality but small scale, expensive.' },
      { name: 'Mechanical Turk',          approach: 'Amazon\'s open crowdsourcing marketplace.', access: 'open · API', accessTone: 'open', differentiator: 'No quality enforcement layer; race to bottom.' },
      { name: 'Anthropic / OpenAI internal labelers', approach: 'In-house contractor pools for proprietary RLHF.', access: 'closed · internal', accessTone: 'closed', differentiator: 'Best quality but unavailable externally.' },
    ],
    note: 'Dojo\'s wedge is that the cryptoeconomic quality control loop replaces the contracting overhead of Scale/Surge while delivering better-than-Turk signal. The 3M+ datapoints already collected give it the scale to bid on real RLHF contracts.',
  },
  team: {
    intro: [
      'Tensorplex Labs is a Singapore-based company founded in 2022. It runs a multi-product stack: Dojo (SN52), the Backprop trading terminal, and a Bittensor validator. Yzi Labs led a strategic investment in 2025 that put the company on the map publicly.',
      'Tensorplex is one of the few Bittensor teams with a clear "ecosystem operator" identity — they ship subnets, validators, and consumer products, not just one subnet. Dojo is the human-data spine of that stack.',
    ],
    founders: [
      { initials: 'CK', gradient: 'v', name: 'CK Cheung', role: 'Co-founder, Tensorplex Labs', bio: 'Previously at Brevan Howard Digital, DeFiance Capital, Goldman Sachs. Cornell + HKUST.' },
      { initials: 'DL', gradient: 'a', name: 'Darwin Liew', role: 'Co-founder, Tensorplex Labs', bio: 'Previously founding partner at PetRock Capital. Nanyang Technological University.' },
    ],
    size: '~15-25',
    founded: '2022',
    based: 'Singapore',
    backers: 'Yzi Labs (formerly Binance Labs); $3M seed in 2023.',
    placeholder: false,
  },
  milestones: [
    { date: '2023', text: 'Tensorplex Labs raises $3M seed.' },
    { date: '2024·Q3', text: 'Dojo SN52 launches with multi-modal preference labeling.' },
    { date: '2025·Q3', text: 'Yzi Labs strategic investment; Tensorplex alpha rallies 500% in a day.' },
    { date: '2026·Q1', text: '3M+ human-generated data points collected across modalities.' },
  ],
  join: {
    title: 'Label the truth, earn the emission.',
    body: 'Miners can register with a team of vetted human labelers and start receiving preference tasks within a tempo. Validators need synthetic-task tooling and an anti-Sybil harness. Customers can pull labeled data via the Tensorplex API.',
    asideNote: 'Synthetic ground truth probes are constant — bot-labeling pipelines have a measured half-life of about one tempo.',
  },
  tags: ['Human Data', 'RLHF', 'Alignment', 'Crowdsourcing'],
  external: {
    github: 'https://github.com/tensorplex-labs/dojo',
    website: 'https://dojo.tensorplex.ai/',
    twitter: 'https://x.com/TensorplexLabs',
    taostats: 'https://taostats.io/subnets/52/',
  },
};
