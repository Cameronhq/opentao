import type { RichSubnet } from '../subnet-rich';

export const apex: RichSubnet = {
  slug: '1-apex',
  netuid: 1,
  name: 'Apex',

  shortPitch: 'Open competition platform that crowdsources algorithms across defined problem domains.',

  overview: [
    'Apex is Bittensor Subnet 1, the network\'s original subnet and historically its flagship for language-model intelligence. It is operated by Macrocosmos, a London-based team that also runs IOTA (SN9), Data Universe (SN13), and other subnets. Apex began in January 2024 as a prompting and conversational-AI incentive layer and remains the longest-running subnet on Bittensor.',
    'The subnet uses the standard Bittensor topology of up to 256 UID slots, split between roughly 64 validator slots and 192 miner slots. After the v3.0.0 "GAN" release on 8 August 2025 and a subsequent pivot, miners now submit Python algorithms or model artifacts to a set of active competitions; validators run the submissions in sandboxed evaluators and post weights based on a deterministic per-competition score.',
    'Outside Bittensor, the consumer side is two-fold. Macrocosmos offers an Apex API (chat completions and web retrieval endpoints, 100 req/hr for standard keys, 1,000 req/hr for validator keys) that exposes the network\'s LLM outputs to developers. The new competition platform targets enterprises, research labs, and product teams that want measurable algorithmic progress on quantifiable problems.',
    'The closest non-Bittensor analogues are Kaggle and DrivenData for ML competitions, and OpenAI / Anthropic for the hosted-LLM API path. Apex differs by paying continuous TAO emissions to winning submissions rather than one-off prize purses, and by routing miner output through validator-scored competitions rather than a closed model. <a href="#customer" style="color: var(--accent);">See competitive landscape ↓</a>',
  ],

  cycle: {
    challenge: { actor: 'Validator', title: 'Issue task instance', body: 'Validators pull the active competition spec (e.g. IOTA Simulator, Energy Arbitrage, RL Tron) and broadcast standardized inputs to registered miners. Each competition has a fixed function signature submissions must match.', dataK: 'payload', dataV: 'Python file ≤50KB or TorchScript ≤100MB' },
    compute:   { actor: 'Miner',     title: 'Run submission', body: 'Miner code is executed in an isolated sandbox against the task instance under per-step and total wall-clock limits. Submissions are deterministic and reproducible across validators.', dataK: 'latency',  dataV: '30s per step · 1,200s total (Energy)' },
    score:     { actor: 'Validator', title: 'Deterministic score', body: 'Each competition has a fixed scoring rule — clamped time ratios, profit vs. baseline, or tournament win-rate. Validators must beat the current leader by at least 1% to take the round.', dataK: 'scale',    dataV: '0.0 to 1.0, winner-takes-all per round' },
    settle:    { actor: 'Subtensor', title: 'Yuma → emission', body: "Every validator's weights, multiplied by their stake, aggregated by Yuma into one reward vector. TAO mints to top miners.", dataK: 'tempo', dataV: '~72 min · 24×/day' },
  },

  miner: {
    does:     'Submits Python algorithm files or TorchScript models to one of the active Apex competitions and iterates against the leaderboard.',
    input:    'Per-competition task instance (grid state for Tron, simulated dispatch problem for Energy Arbitrage, routing graph for IOTA Sim).',
    output:   'A single .py file (≤50,000 chars) or .pt TorchScript file (≤100MB) implementing the required function signature.',
    hardware: 'No fixed GPU requirement — competition-dependent. RL Tron requires PyTorch-capable hardware for training; algorithmic competitions run CPU-only with NumPy.',
    paidFor:  'Holding the top score on an active competition for the duration of a round (1-2 days).',
    paidVia:  'Per-tempo emission, score × validator stake',
  },
  validator: {
    does:     'Runs miner submissions in deterministic sandboxes, computes per-competition scores, and posts a weight vector to chain each tempo.',
    requires: 'Standard Bittensor validator stake threshold plus enough CPU/GPU to evaluate every submission within sandbox time limits.',
    output:   'A 256-dimensional weight vector reflecting per-miner relative score, signed and pushed to Subtensor.',
    paidFor:  'Submitting weights that agree with consensus median',
    paidVia:  'Per-tempo emission, stake × consensus alignment',
  },

  scoring: {
    leadOneLine: 'Deterministic, reproducible sandbox evaluation against a fixed per-competition objective, winner-takes-all per round.',
    explanation: [
      'Each Apex competition ships with its own scoring function. IOTA Simulator uses task_score = clamp(1 - total_epoch_time / max_epoch_time, 0, 1) median-aggregated over five tasks. Energy Arbitrage uses quality = (miner_profit - baseline_profit) / (baseline_profit + 1e-6) averaged across 100 grid-dispatch instances. RL Tron uses a bracketed tournament with per-game scores (1.00 clean kill, 0.80 self-destruction, down to 0.00 solo death) averaged per match.',
      'The rule rewards measurable, reproducible improvement over a baseline rather than human judgement or vibe-checks. A submission must beat the standing winner by at least 1% to take the round, which suppresses noise-driven flips and makes leaderboard movement meaningful. Code is revealed after each round, turning every win into open research that the next miner can fork.',
    ],
    cheatPath: 'Submissions run in isolated sandboxes against identical inputs with strict timeouts (e.g. 30s per Energy step, 0.1s per Tron tick), so wall-clock cheats and external API calls fail. Submissions that do not match the required function signature are rejected. Tournament scoring penalizes self-destruction and solo death, so passive or stalling strategies score near zero. The 1% improvement threshold blocks copy-paste resubmissions of the current leader.',
  },

  customer: {
    leadOneLine: 'Developers using the Apex LLM API plus enterprises and research labs that want crowdsourced solutions to defined algorithmic problems.',
    explanation: [
      'On the API side, the buyer is any developer who wants Bittensor-hosted chat completions or decentralized web retrieval — exposed through POST /v1/chat/completions and POST /web_retrieval on api.macrocosmos.ai, with 100 req/hr for standard keys and 1,000 req/hr for validator keys. On the competition side, the buyer is an organization that can specify a measurable objective (battery dispatch profit, routing latency, game win-rate) but lacks the in-house research depth to solve it.',
      'Macrocosmos positions Apex as "a routing layer for intelligence" — a sponsor posts a problem with a deterministic scorer, miners compete to deliver the best implementation, and emissions flow continuously to the standing leader. The commercial relationship is intended for enterprise R&D, research benchmarking, and product teams shipping algorithmic features. The IOTA Simulator competition was developed with Kai Morris; Macrocosmos also has a public partnership with Rowan Sci for neural network potentials.',
    ],
  },

  competitive: {
    scope: 'crowdsourced algorithmic competitions and open LLM inference · 2026',
    rows: [
      { name: 'Apex', subtitle: 'SN1', isSelf: true, approach: 'Continuous TAO emissions to standing leaders across multiple parallel competitions with deterministic scoring.', access: 'open · API', accessTone: 'open', differentiator: 'Per-tempo emissions, code revealed after each round, no prize-purse exhaustion.' },
      { name: 'Kaggle', subtitle: 'Google · competitions', approach: 'Fixed-prize ML competitions with leaderboards and held-out test sets.', access: 'open · web', accessTone: 'open', differentiator: 'One-time cash prize, competitions close on a date, no continuous incentive.' },
      { name: 'DrivenData', subtitle: 'data-science contests', approach: 'Mission-driven prize competitions for NGOs and public-sector sponsors.', access: 'open · web', accessTone: 'open', differentiator: 'Smaller community, prize-purse model, no on-chain settlement.' },
      { name: 'OpenAI API', subtitle: 'hosted LLM', approach: 'Centralized inference over proprietary frontier models with paid per-token pricing.', access: 'closed · API', accessTone: 'closed', differentiator: 'Higher capability but closed weights, no open scoring layer, no community-trained alternatives.' },
      { name: 'Together AI', subtitle: 'open LLM hosting', approach: 'Managed inference for open-source models (Llama, Mistral, etc.) on a per-token basis.', access: 'open · API', accessTone: 'open', differentiator: 'Pure inference host, no incentive mechanism for ongoing model or algorithm improvement.' },
    ],
    note: 'The incentive layer gives Apex something Kaggle and DrivenData cannot match — continuous emissions to whoever currently holds the leaderboard, paid every 72 minutes. Unlike fixed-prize contests, there is no terminal date that ends competition. Versus closed APIs like OpenAI, Apex trades raw capability for an open scoring substrate where any submitter can fork yesterday\'s winner and propose a 1%+ improvement.',
  },

  team: {
    intro: [
      'Macrocosmos is one of the largest operator teams on Bittensor, running Apex (SN1), IOTA (SN9, distributed LLM pretraining), Data Universe (SN13, data collection), and additional subnets including SN25 and SN37. The team has stated their thesis as "incentivizing intelligence that scales" and has used the Apex pivot to consolidate inference on SN64 and web retrieval on SN13.',
      'Co-founder Steffen Cruz is the former CTO of the Opentensor Foundation, the entity behind Bittensor itself, which gives Macrocosmos unusually deep protocol context. Will Squires (CEO) describes IOTA, not Apex, as the team\'s current "north star" — making Apex indistinguishable from centralized training. Apex serves as the team\'s competition and API surface while IOTA does the heavy training research.',
    ],
    founders: [
      { initials: 'WS', gradient: 'v', name: 'Will Squires', role: 'CEO & Co-founder', bio: 'Former AI accelerator lead at AtkinsRéalis, ex-Crossrail and HS2 infrastructure engineer, lecturer at UCL CASA, advisor to the Mayor of London\'s infrastructure panel.' },
      { initials: 'SC', gradient: 'a', name: 'Steffen Cruz',  role: 'CTO & Co-founder', bio: 'Former CTO of the Opentensor Foundation. PhD in subatomic physics from the University of British Columbia. Background in physics-informed machine learning and rare-event detection.' },
    ],
    size: '~24 employees',
    founded: '2024',
    based: 'London, UK',
    backers: 'Includes DSV and other institutional Bittensor-focused investors. Macrocosmos has used OTC TAO transactions for early-stage capital rather than a conventional priced round.',
    placeholder: false,
  },

  milestones: [
    { date: '2024·01', text: 'Prompting v1.0.0 released — original SN1 incentive mechanism for distributed conversational AI.' },
    { date: '2025·03', text: 'Initial GAN-style scoring experiments published, hinting at the Apex 3.0 pivot.' },
    { date: '2025·08', text: 'Apex v3.0.0 "GAN" released — generator/discriminator dual-role miners with adversarial scoring.' },
    { date: '2025·09', text: 'v3.0.6 ships with code-execution capability and refined reasoning traces.' },
    { date: '2026·Q1', text: 'Pivot to competition platform — IOTA Simulator, Energy Arbitrage, and RL Tron competitions go live.' },
  ],

  join: {
    title: 'Submit to an Apex competition',
    body: 'Clone macrocosm-os/apex, register a Bittensor wallet, pick an active competition (IOTA Simulator, Energy Arbitrage, or RL Tron), and submit a single Python file or TorchScript model that matches the baseline function signature.',
    asideNote: 'Validators need standard SN1 stake plus enough compute to run every submission inside the sandbox time limit each tempo.',
  },

  tags: ['llm', 'competitions', 'reinforcement-learning', 'inference'],

  external: {
    github:   'https://github.com/macrocosm-os/apex',
    website:  'https://apex.macrocosmos.ai/',
    twitter:  'https://x.com/MacrocosmosAI',
    taostats: 'https://taostats.io/subnets/1/',
  },
};
