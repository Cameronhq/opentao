import type { RichSubnet } from '../subnet-rich';

export const sn79: RichSubnet = {
  slug: '79-mvtrx',
  netuid: 79,
  name: 'MVTRX',
  shortPitch: 'Agent-based market simulation — miners submit risk-managed trading strategies.',
  overview: [
    'MVTRX is Bittensor subnet 79, operating under the TAOS banner ("Simulation of Automated Trading in Intelligent Markets"). It is a large-scale agent-based simulation of automated trading: validators construct simulation state (orderbooks, background agents, market conditions) and broadcast it to miners, who must respond with risk-managed trading instructions that get executed inside the simulation.',
    'The current simulation environment manages around 40 orderbooks, each populated with roughly 1,000 background agents that model microstructure and liquidity dynamics. The stated mid-term goal is to scale to 1,000+ simulated orderbooks for statistical significance. Strategies are scored on risk-adjusted performance — initially an intraday Kappa-3 ratio, with more risk-adjusted metrics planned.',
    'On the product roadmap, TAOS is extending from the sandbox simulation toward a real exchange surface called MVTRX, with new incentive mechanisms designed for dTAO alpha-token trading. The simulation is the upstream training and evaluation ground; the live exchange is the downstream deployment surface.',
    'One-line diff: it is an open tournament for trading strategies in a controlled microstructure simulation, not a copy-trading platform and not a hedge fund. <a href="#customer" style="color: var(--accent);">See competitive landscape ↓</a>',
  ],
  cycle: {
    challenge: { actor: 'Validator', title: 'Publish state', body: 'Validator constructs the current simulation state (orderbooks, background agents, market conditions) and publishes a request to all miners at a fixed interval.', dataK: 'payload', dataV: 'simulation state' },
    compute:   { actor: 'Miner',     title: 'Submit orders', body: 'Miner returns a set of risk-managed trading instructions within the response window; instructions get submitted to the simulation for execution.', dataK: 'latency',  dataV: 'per-tick window' },
    score:     { actor: 'Validator', title: 'Score risk-adjusted', body: 'Validators score each miner\'s realised P&L on a risk-adjusted basis — currently an intraday Kappa-3 ratio, with additional risk-adjusted performance metrics planned.', dataK: 'metric',  dataV: 'Kappa-3 ratio' },
    settle:    { actor: 'Subtensor', title: 'Yuma → emission', body: "Every validator's weights, multiplied by their stake, aggregated by Yuma into one reward vector. TAO mints to top miners.", dataK: 'tempo', dataV: '~72 min · 24×/day' },
  },
  miner: {
    does: 'Implements automated trading strategies and submits risk-managed trading instructions in response to each validator-published simulation state.',
    input: 'Validator-published simulation state: orderbook snapshots, background agent activity, market conditions.',
    output: 'Trading instructions submitted within the response window for execution inside the simulation.',
    hardware: 'CPU-class strategy engines and low-latency I/O; alpha generation matters more than raw compute. GPU optional for ML-based strategies.',
    paidFor: 'Submitting strategies that produce the best risk-adjusted P&L (currently intraday Kappa-3) inside the simulation.',
    paidVia: 'Per-tempo emission, score × validator stake',
  },
  validator: {
    does: 'Constructs simulation state, broadcasts requests to miners, executes miner instructions in the agent-based simulator, scores risk-adjusted P&L, and writes weights on-chain.',
    requires: 'Simulator infrastructure (orderbook engine + background-agent population) plus min-stake to register as a Bittensor validator.',
    output: 'Per-miner weight vector ranking risk-adjusted trading performance.',
    paidFor: 'Submitting weights that agree with consensus median',
    paidVia: 'Per-tempo emission, stake × consensus alignment',
  },
  scoring: {
    leadOneLine: 'Intraday Kappa-3 ratio — risk-adjusted P&L beats raw P&L on every cycle.',
    explanation: [
      'Scoring is deliberately risk-adjusted from day one. Kappa-3 penalises downside variance more heavily than upside variance, so strategies that achieve high P&L with blow-up risk earn less than strategies with the same P&L and smoother return distributions. The stated roadmap is to layer in additional risk-adjusted measures over time.',
      'Because all miners trade the same simulated market state in parallel, the tournament resembles a controlled academic study: identical microstructure conditions, identical background agents, identical clock. Differences across miners come from strategy, not luck of the draw.',
    ],
    cheatPath: 'Classic attacks are over-fitting to specific simulation regimes, exploiting toy assumptions in the background-agent model, or trading on knowledge of upcoming simulation state if any leaks. The intended counters are diverse simulated regimes, evolving background-agent populations, and statistical-significance requirements that the scale-up to 1,000+ orderbooks targets.',
  },
  customer: {
    leadOneLine: 'In the simulation phase, the customer is the network itself — producing labelled trading-strategy data; in the MVTRX phase, the customer becomes traders on the dTAO alpha exchange.',
    explanation: [
      'Today the buyer surface is research and data: the simulation produces labelled datasets of risk-managed trading strategies across a wide range of asset classes and market conditions, which is itself a valuable artefact for quant research and ML training.',
      'Downstream, MVTRX is positioned as a real exchange surface for dTAO alpha-token trading, with strategy incentives modelled on the upstream simulation. That makes SN79 a bridge between an open strategy-research subnet and a live trading venue inside the Bittensor ecosystem.',
    ],
  },
  competitive: {
    scope: 'algorithmic trading research / simulated markets · 2026',
    rows: [
      { name: 'MVTRX', subtitle: 'SN79', isSelf: true, approach: 'Bittensor-funded tournament where miners submit risk-managed trading strategies to a multi-orderbook agent-based simulation; Kappa-3 scoring.', access: 'open · simulation interface', accessTone: 'open', differentiator: 'Risk-adjusted scoring from day one, with a roadmap from simulation to live alpha-token exchange (MVTRX).' },
      { name: 'Numerai', approach: 'Centralized data-science tournament where contributors stake on equity-signal predictions used by Numerai\'s hedge fund.', access: 'open · staked predictions', accessTone: 'open', differentiator: 'Single hedge-fund client; predictions on equities, not order-by-order strategies in a simulator.' },
      { name: 'QuantConnect / Quantopian-style platforms', approach: 'Cloud backtesting and algorithmic trading platforms (QuantConnect, Lean) for individual quants.', access: 'open · platform subscription', accessTone: 'open', differentiator: 'Personal backtesting; no tournament reward and no shared microstructure simulation.' },
      { name: 'Jane Street / Citadel internal research', approach: 'Closed in-house market-microstructure simulation and strategy R&D at top quant trading firms.', access: 'closed · internal only', accessTone: 'closed', differentiator: 'Best-in-class internal tooling; not open to external contributors.' },
      { name: 'Other Bittensor trading subnets (e.g. SN8, SN28)', approach: 'Other Bittensor subnets that have scored predictive financial signals (e.g. proprietary trading on SN28).', access: 'open · subnet API', accessTone: 'open', differentiator: 'Adjacent entrants; MVTRX is specifically simulation-of-trading rather than signal prediction.' },
    ],
    note: 'MVTRX\'s wedge is the combination of agent-based microstructure simulation, risk-adjusted scoring, and a roadmap toward a real dTAO alpha exchange. The trade-off vs Numerai is the lack of a single capitalised hedge fund behind it; vs Jane Street the trade-off is being open at all.',
  },
  team: {
    intro: [
      'MVTRX is operated under the TAOS banner (taos.im). The team publicly describes 20+ years of combined experience in high-frequency data recording, agent-based modelling, trading, and market microstructure, with PhD-level research backing the simulation design.',
      'The thesis is that risk-managed algorithmic trading is best researched in a controlled, parallel-orderbook simulation with many independent strategy authors — and that Bittensor\'s tournament economics are a natural fit for funding that research at scale.',
    ],
    founders: [
      { initials: 'TS', gradient: 'v', name: '[TAOS team]', role: 'Operator · TAOS / MVTRX', bio: 'TAOS team includes a 20+ year veteran in agent-based modelling and market microstructure plus PhD-level research collaborators; specific founder identities are not fully disclosed in public sources at the time of writing.' },
    ],
    size: 'Small core team + research collaborators', founded: '2024', based: 'Not publicly disclosed.',
    backers: 'Not publicly disclosed.',
    placeholder: true,
  },
  milestones: [
    { date: '2024·Q4', text: 'Subnet 79 registered; TAOS simulation framework comes online with multi-orderbook agent-based design.' },
    { date: '2025·Q2', text: 'Simulation scaled to ~40 orderbooks with ~1,000 background agents per book.' },
    { date: '2025·Q4', text: 'MVTRX exchange surface announced as the downstream live-trading deployment for dTAO alpha tokens.' },
  ],
  join: {
    title: 'Submit a strategy on TAOS',
    body: 'Miners implement strategies against the TAOS interface (github.com/taos-im/sn-79) and register on netuid 79. Validators run the simulator and the scoring pipeline; the team site at taos.im documents the broader roadmap.',
    asideNote: 'Mining is strategy-heavy rather than GPU-heavy. Live network state on taostats.io/subnets/79/.',
  },
  tags: ['trading', 'simulation', 'agent-based', 'market microstructure', 'quant'],
  external: {
    github: 'https://github.com/taos-im/sn-79',
    website: 'https://taos.im/',
    taostats: 'https://taostats.io/subnets/79/',
  },
};
