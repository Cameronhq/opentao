import type { RichSubnet } from '../subnet-rich';

export const sn6: RichSubnet = {
  slug: '6-numinous',
  netuid: 6,
  name: 'Numinous',

  shortPitch: 'Decentralized forecasting agents competing to predict real-world events.',

  overview: [
    'Numinous is Bittensor Subnet 6, operated by Numinous Labs — the same team that previously ran "Infinite Games" on this slot. The stated goal is a "World Forecasting Model": aggregate many competing AI forecasting agents, score them on real-world prediction accuracy, and emit TAO to whoever consistently beats the field. Founder Marc Graczyk (Cambridge Pure Maths) leads the team, and Const (Opentensor founder) reportedly holds a meaningful stake.',
    'Miners submit Python-based forecasting agents to a network gateway. Validators run those agents inside Docker sandboxes against batches of real-world questions — geopolitics, sports outcomes, commodity prices, crypto markets — and score them using a Brier-Score-derived "winner-takes-all" metric over the agent\'s last 100 events. The scoring rule explicitly rewards the underlying reasoning architecture, not single predictions.',
    'Outside Bittensor, the buyer is anyone who needs structured forecasts at scale — hedge funds and prediction-market makers via Polymarket-style integrations, news and intelligence firms via Crunch (an 11,000-engineer ML community now integrated), and any agent platform that wants on-demand probability estimates. Numinous exposes agents through a gateway with paid third-party tooling (Chutes for compute, Desearch for live data, OpenAI, LunarCrush, OpenRouter).',
    'Closest non-Bittensor competitors are Metaculus (community forecasting), Good Judgment Project (superforecaster cohorts), and Manifold Markets (prediction markets). Numinous differs by paying continuous TAO emissions to AI agents whose models reliably outperform — versus reputation-based human forecasting communities or market-priced prediction markets. <a href="#customer" style="color: var(--accent);">See competitive landscape ↓</a>',
  ],

  cycle: {
    challenge: { actor: 'Validator', title: 'Issue forecast events', body: 'Validators broadcast a batch of resolvable real-world questions — geopolitics, sports, crypto, commodities — pulled from prediction-market sources and partner data feeds.', dataK: 'payload', dataV: 'event batch with resolution dates' },
    compute:   { actor: 'Miner',     title: 'Run forecast agent', body: 'Each miner\'s agent runs inside a Docker sandbox with gateway access to compute (Chutes), search (Desearch), LLMs (OpenAI / OpenRouter), and signal feeds. Agents return probability distributions per event.', dataK: 'latency',  dataV: 'sandboxed agent run · gated tool access' },
    score:     { actor: 'Validator', title: 'Brier-score rolling', body: 'Validators evaluate predictions against actual outcomes using Brier-Score-derived metrics rolled over each miner\'s last 100 resolved events. Winner-takes-all over the rolling window.', dataK: 'scale',    dataV: 'Brier rolling-100 · winner-takes-all' },
    settle:    { actor: 'Subtensor', title: 'Yuma → emission', body: "Every validator's weights, multiplied by their stake, aggregated by Yuma into one reward vector. TAO mints to top miners.", dataK: 'tempo', dataV: '~72 min · 24×/day' },
  },

  miner: {
    does:     'Submits and maintains a Python-based forecasting agent that produces calibrated probability distributions for real-world events.',
    input:    'A batch of resolvable forecasting questions plus the gateway endpoints (Chutes, Desearch, OpenAI, OpenRouter, LunarCrush, Vericore, Numinous Signals).',
    output:   'A probability distribution per event, returned to validators for later scoring against resolved outcomes.',
    hardware: 'Modest — agents run inside Docker on validator infra. Miner-side resources are mostly for development and offline backtesting.',
    paidFor:  'Holding the top Brier score over the rolling window of the last 100 resolved events.',
    paidVia:  'Per-tempo emission, score × validator stake',
  },
  validator: {
    does:     'Issues forecast event batches, runs each miner\'s containerised agent through the gateway, resolves events against ground truth, and posts Brier-score-based weights.',
    requires: 'Standard Bittensor validator stake plus compute to run many sandboxed agents and reliable data feeds for event resolution.',
    output:   'A weight vector based on each miner\'s rolling Brier score over their last 100 resolved events.',
    paidFor:  'Submitting weights that agree with consensus median',
    paidVia:  'Per-tempo emission, stake × consensus alignment',
  },

  scoring: {
    leadOneLine: 'Brier-score-style accuracy over each miner\'s last 100 resolved real-world events, with the leader taking the bulk of emissions.',
    explanation: [
      'Numinous explicitly scores the underlying agent architecture rather than any single prediction. A rolling window of the most recent 100 events smooths out variance — one lucky call cannot dominate the leaderboard, and one bad week cannot tank a previously strong agent. The Brier-style metric also penalises confident wrong predictions more than uncertain ones, so well-calibrated agents that produce honest probabilities outperform overconfident ones.',
      'The "winner-takes-all" structure over the rolling window means a small accuracy edge translates into a large emission share. This encourages aggressive iteration on agent design — better reasoning chains, better data sources, better fusion of LLM and quantitative signals — rather than copying whatever is already on the leaderboard. Crunch integration in late 2025 routed 11,000 ML engineers into the agent-building flow.',
    ],
    cheatPath: 'Agents run inside Docker sandboxes through a controlled gateway, so they cannot call outside data sources that would let them pre-resolve events. Events are pulled from public prediction-market and partner feeds with known resolution dates, so miners cannot fabricate ground truth. Confidently-wrong predictions are penalised heavily under Brier scoring, making it costly to game by always predicting the most popular outcome.',
  },

  customer: {
    leadOneLine: 'Funds, prediction markets, news and intelligence firms, and any platform that needs probability estimates at scale.',
    explanation: [
      'On the institutional side, the buyer is any organisation that runs on probability — hedge funds with event-driven strategies, prediction-market makers and arbitrageurs, news desks pricing geopolitical risk, and corporate strategy teams. Numinous integrates with Polymarket-style markets so its top agents can effectively price real-world events at scale.',
      'On the developer side, the buyer is any product that needs forecast outputs — agent platforms, research tools, automated trading systems. The Crunch integration in late 2025 brought 11,000 ML engineers into the agent-building loop, and the gateway architecture means agents can themselves consume Chutes (SN64) compute and Desearch (SN22) data, turning Numinous into a Bittensor-native composition rather than a standalone product.',
    ],
  },

  competitive: {
    scope: 'AI-driven probabilistic forecasting · 2026',
    rows: [
      { name: 'Numinous', subtitle: 'SN6', isSelf: true, approach: 'Containerized agents competing on Brier accuracy over the last 100 resolved events; continuous TAO emissions.', access: 'open · API', accessTone: 'open', differentiator: 'Pays for sustained calibration, not single calls; aggregates across many independent agents.' },
      { name: 'Metaculus', subtitle: 'community forecasting', approach: 'Reputation-based platform where human forecasters submit probability estimates on long-horizon questions.', access: 'open · web', accessTone: 'open', differentiator: 'Human-only, reputation rather than payment, slower resolution velocity.' },
      { name: 'Good Judgment', subtitle: 'superforecasters', approach: 'Curated cohorts of high-performing human forecasters selling forecasts to enterprise clients.', access: 'closed · enterprise', accessTone: 'closed', differentiator: 'Human cohort with hand-picked talent; expensive and hard to scale to thousands of events.' },
      { name: 'Polymarket', subtitle: 'prediction market', approach: 'On-chain prediction markets where prices are aggregated forecasts from traders backing them with capital.', access: 'open · web', accessTone: 'open', differentiator: 'Price discovery via betting, no underlying agents — a complement, not a substitute.' },
      { name: 'Kalshi', subtitle: 'event contracts', approach: 'CFTC-regulated event contracts on macro and political outcomes.', access: 'open · web', accessTone: 'open', differentiator: 'Regulated event-contract venue; relies on traders, not AI forecasters.' },
    ],
    note: 'Numinous\' edge is paying continuously for calibration over a 100-event rolling window rather than rewarding single correct calls. Versus Metaculus and Good Judgment, the agents do not sleep, do not unionise, and scale across thousands of questions. Versus prediction markets, Numinous is the supply side — agents that can take any market\'s odds and price them more accurately than the consensus.',
  },

  team: {
    intro: [
      'Numinous Labs is a small forecasting-AI team led by Marc Graczyk (CEO, Cambridge Pure Maths) and Bruno Camargo (CTO). The team previously operated this slot as "Infinite Games" before re-architecting around the World Forecasting Model thesis and re-branding to Numinous. Const, the founder of Opentensor / Bittensor itself, reportedly holds around 16% of the team or token allocation.',
      'The team\'s thesis is that aggregate AI forecasting beats any single model and that paying TAO emissions for sustained calibration is the right structural incentive. Recent moves include the Crunch integration (11,000 ML engineers brought into the agent pipeline) and gateway integrations that let agents consume Chutes (SN64) and Desearch (SN22) directly.',
    ],
    founders: [
      { initials: 'MG', gradient: 'v', name: 'Marc Graczyk',  role: 'CEO & Co-founder',  bio: 'Pure Mathematics, University of Cambridge. Previously led Infinite Games. Public face of Numinous across podcasts and ecosystem partnerships including Crunch and Polymarket integrations.' },
      { initials: 'BC', gradient: 'a', name: 'Bruno Camargo', role: 'CTO & Co-founder',  bio: 'Leads technical architecture for the World Forecasting Model — gateway, sandbox, agent execution stack, and scoring infrastructure.' },
    ],
    size: '~5-8',
    founded: 'Subnet 6 originally registered early 2024; Numinous branding 2025',
    based: 'Distributed',
    backers: 'Const (Opentensor founder) reportedly holds ~16% stake. No conventional priced round publicly disclosed.',
    placeholder: false,
  },

  milestones: [
    { date: '2024·Q1', text: 'Subnet 6 launched as Infinite Games — first forecasting incentive mechanism on Bittensor.' },
    { date: '2025·Q3', text: 'Pivot to Numinous; World Forecasting Model thesis published.' },
    { date: '2025·Q4', text: 'Crunch integration goes live — 11,000 ML engineers routed into the agent pipeline.' },
    { date: '2026·Q1', text: 'Gateway expanded with Chutes / Desearch / OpenAI / OpenRouter / LunarCrush / Vericore tool access.' },
  ],

  join: {
    title: 'Build a forecasting agent',
    body: 'Fork numinouslabs/numinous, write a Python forecasting agent that returns probabilities for incoming events, and register a Bittensor miner on SN6 with your agent endpoint.',
    asideNote: 'Validators need standard SN6 stake plus reliable data feeds for event resolution and compute for running many sandboxed agents.',
  },

  tags: ['forecasting', 'agents', 'prediction-markets', 'reasoning'],

  external: {
    github:   'https://github.com/numinouslabs/numinous',
    website:  'https://www.numinous.gg/',
    twitter:  'https://x.com/numinous_ai',
    taostats: 'https://taostats.io/subnets/6/',
  },
};
