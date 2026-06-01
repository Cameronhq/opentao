import type { RichSubnet } from '../subnet-rich';

export const sn53: RichSubnet = {
  slug: '53-efficientfrontier',
  netuid: 53,
  name: 'EfficientFrontier',
  shortPitch: 'Live PnL-graded competition for crypto trading strategies via SignalPlus.',
  overview: [
    'EfficientFrontier (SN53) is a joint project between SignalPlus and the Bittensor ecosystem that turns proprietary trading into a public scoring problem. Miners are real traders running actual strategies on the SignalPlus platform; the subnet reads their live account metrics and rewards risk-weighted performance.',
    'Instead of asking miners to backtest or simulate, the subnet evaluates them on their realized account state — balance, equity, PnL, drawdown — pulled directly from SignalPlus\'s integrations with major venues. SignalPlus acts as the trusted bridge that proves the trades are real, executed, and untampered with.',
    'Asymmetric encryption protects the data in transit between miner, SignalPlus, and validator. The result is a network where the alpha is the work product, not the model: a miner\'s score is their realized Sharpe-adjusted performance, not their prediction of a benchmark.',
    'Bittensor\'s 192-UID cap turns the network into a quant tournament — survive by trading well, lose your slot by drawing down too hard. SignalPlus, the operator, monetizes by routing flow and selling institutional-grade tools downstream from the same dataset. <a href="#customer" style="color: var(--accent);">See competitive landscape ↓</a>',
  ],
  cycle: {
    challenge: { actor: 'Validator', title: 'Query account', body: 'Validators call the SignalPlus public API to fetch each miner\'s real account metadata — balance, equity, PnL, drawdown — over a defined window.', dataK: 'payload', dataV: 'signed account metrics' },
    compute:   { actor: 'Miner',     title: 'Trade live', body: 'Miners run their strategy on the SignalPlus platform with real capital; trades execute on connected exchanges and produce verified account state.', dataK: 'latency',  dataV: 'continuous live trading' },
    score:     { actor: 'Validator', title: 'Risk-weighted PnL', body: 'Validators rank miners on risk-adjusted return (PnL, drawdown, equity stability), using SignalPlus\'s signed data as ground truth.', dataK: 'scale',    dataV: 'multi-account leaderboard' },
    settle:    { actor: 'Subtensor', title: 'Yuma → emission', body: "Every validator's weights, multiplied by their stake, aggregated by Yuma into one reward vector. TAO mints to top miners.", dataK: 'tempo', dataV: '~72 min · 24×/day' },
  },
  miner: {
    does: 'Runs a real crypto trading strategy on the SignalPlus platform with real capital.',
    input: 'Market data + SignalPlus execution venue access.',
    output: 'Verified account metrics streamed to validators via SignalPlus API.',
    hardware: 'Light compute; the bar is a working strategy and risk discipline, not GPUs.',
    paidFor: 'Risk-weighted realized PnL across the scoring window.',
    paidVia: 'Per-tempo emission, score × validator stake',
  },
  validator: {
    does: 'Pulls signed account metrics from SignalPlus, computes risk-adjusted rankings, submits weights.',
    requires: 'SignalPlus API access, asymmetric key material for signed-payload verification, ranking logic.',
    output: 'Per-miner weight vector reflecting risk-adjusted PnL.',
    paidFor: 'Submitting weights that agree with consensus median',
    paidVia: 'Per-tempo emission, stake × consensus alignment',
  },
  scoring: {
    leadOneLine: 'Your realized risk-adjusted PnL is your weight. Drawdown punishes you the same way it would your LP.',
    explanation: [
      'EfficientFrontier doesn\'t ask "what do you predict?" — it asks "what did you do?" Validators read account-level performance metrics from SignalPlus and rank by the same things a fund-of-funds would care about: equity curve, Sharpe-style risk-adjusted return, drawdown, consistency.',
      'Because SignalPlus is the trusted bridge to the exchanges, miners can\'t paper-trade their way to the top. The data they\'re scored on came from real fills on real venues, attested by a third-party platform that has commercial reputation to lose if they fake it.',
    ],
    cheatPath: 'Wash trading to fake PnL doesn\'t work — SignalPlus\'s exchange integrations see actual fills, fees, and counter-parties. Self-trading collapses when execution costs and risk metrics are computed honestly.',
  },
  customer: {
    leadOneLine: 'Allocators looking for proven crypto strategies, and traders looking for emissions on top of their PnL.',
    explanation: [
      'For traders, the subnet is "get paid twice": you earn your trading PnL plus emissions on top if your strategy ranks. For SignalPlus, the subnet is a continuous discovery engine for top quant talent who self-select onto the platform.',
      'Downstream allocators and prop desks get an open, verifiable leaderboard of strategies with real fills behind them — a thing that does not exist anywhere else in crypto, where most "top trader" lists are unverifiable Twitter screenshots.',
    ],
  },
  competitive: {
    scope: '2026 · verified crypto trading performance',
    rows: [
      { name: 'EfficientFrontier', subtitle: 'SN53', isSelf: true, approach: 'Miners trade live on SignalPlus; validators score on signed account metrics; emissions on top of PnL.', access: 'open · platform-gated', accessTone: 'open', differentiator: 'Realized PnL as the score, not predictions; verified by exchange-integrated platform.' },
      { name: 'Numerai',           approach: 'Equity tournament where miners submit signal predictions, scored on simulated returns.', access: 'closed · stake', accessTone: 'closed', differentiator: 'Stocks only; signal predictions, not live trading.' },
      { name: 'eToro / Bybit copy-trading', approach: 'Centralized platforms ranking traders for retail copying.', access: 'closed · platform', accessTone: 'closed', differentiator: 'Closed leaderboards; platform decides ranking criteria.' },
      { name: 'Hummingbot Foundation',     approach: 'Open-source market-making bot framework; no built-in scoring/incentives.', access: 'open · framework', accessTone: 'open', differentiator: 'No incentive layer, no verified PnL leaderboard.' },
      { name: 'TopstepFX / FTMO',          approach: 'Prop firm evaluations that fund passing traders.', access: 'closed · evaluation', accessTone: 'closed', differentiator: 'TradFi/FX focus; one-off evaluations not continuous emissions.' },
    ],
    note: 'EfficientFrontier\'s wedge is the SignalPlus dependency — SignalPlus brings verified exchange integrations and Wall Street-grade tooling, Bittensor brings the incentive layer. Together they produce a thing no closed copy-trading platform can: an open, on-chain, continuously-scored quant leaderboard.',
  },
  team: {
    intro: [
      'EfficientFrontier is operated by SignalPlus, a Hong Kong-based crypto options infrastructure company founded in 2021. SignalPlus builds professional-grade options trading tooling and has raised $40M to expand its trading stack.',
      'The team is staffed with Wall Street veterans from Goldman Sachs and Morgan Stanley plus engineers from Alibaba and ByteDance. EfficientFrontier extends SignalPlus\'s tooling into a Bittensor-native discovery layer for quant talent.',
    ],
    founders: [
      { initials: 'CY', gradient: 'v', name: 'Chris Yu', role: 'CEO, SignalPlus', bio: 'Macro trading background in FX and FX options at Goldman Sachs and Morgan Stanley.' },
      { initials: 'JS', gradient: 'a', name: 'James Shan', role: 'COO, SignalPlus', bio: 'Serial entrepreneur with background in mobile internet and enterprise SaaS.' },
    ],
    size: '~50+ (SignalPlus-wide)',
    founded: '2021',
    based: 'Hong Kong',
    backers: 'Cherubic Ventures, AppWorks; $40M raised across rounds.',
    placeholder: false,
  },
  milestones: [
    { date: '2021', text: 'SignalPlus founded as crypto options infrastructure company.' },
    { date: '2024', text: 'SignalPlus raises $40M to expand crypto trading tools.' },
    { date: '2025·Q3', text: 'EfficientFrontier SN53 launches on Bittensor.' },
    { date: '2026·Q1', text: 'Risk-weighted scoring and signed-account-metric pipeline live.' },
  ],
  join: {
    title: 'Trade real money. Earn TAO on top.',
    body: 'Miners need a SignalPlus account, exchange connectivity, and a strategy that survives risk-adjusted scoring. Validators integrate the SignalPlus API + verification keys.',
    asideNote: 'No paper trades — the score reads from real fills.',
  },
  tags: ['Finance', 'Trading', 'Quant', 'Verified'],
  external: {
    github: 'https://github.com/EfficientFrontier-SignalPlus/EfficientFrontier',
    website: 'https://www.signalplus.com/',
    twitter: 'https://x.com/SignalPlus_Web3',
    taostats: 'https://taostats.io/subnets/53/',
  },
};
