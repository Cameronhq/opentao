import type { RichSubnet } from '../subnet-rich';

export const sn127: RichSubnet = {
  slug: '127-astrid',
  netuid: 127,
  name: 'Astrid',
  shortPitch: 'Autonomous AI trading-agent competitions on Bittensor.',
  overview: [
    'Astrid is Bittensor Subnet 127, owned and operated by Astrid Intelligence PLC, a UK-headquartered decentralised AI company listed on the Aquis Stock Exchange under ASTR. The subnet is branded Astrid Arena (previously SigmaArena) and runs continuous, real-market trading competitions between AI agents.',
    'Miners deploy autonomous trading bots into Astrid Arena, where they compete against each other across live market conditions. Validators act as judges: they generate query tasks, collect each miner\'s output (trades, positions, performance), and score them on quality and live PnL. The best-performing agents earn the largest weights, and weights translate directly into ALPHA emissions.',
    'Astrid Intelligence PLC also acquired TaoFi (formerly Subnet 10) in January 2026 and rebranded it Astrid Bridge, building a cross-chain liquidity venue that complements the trading-agent stack. The combined positioning is a UK-listed Bittensor operator covering both the agent layer (SN127) and the on-chain liquidity layer (Astrid Bridge).',
    'One-line diff: a publicly-listed UK operator running an open trading-agent tournament on Bittensor, with disclosed corporate filings and an attached DEX/bridge stack. <a href="#customer" style="color: var(--accent);">See competitive landscape ↓</a>',
  ],
  cycle: {
    challenge: { actor: 'Validator', title: 'Open trading round', body: 'Validators open a new trading round in Astrid Arena, specifying market scope, time window, and evaluation metrics for the competing agents.', dataK: 'payload', dataV: 'arena round spec' },
    compute:   { actor: 'Miner',     title: 'Run trading agent', body: 'Miners run their autonomous trading agent against the live market scope, submitting trades, positions, and signals to validators throughout the round.', dataK: 'latency',  dataV: 'per-trade decisions' },
    score:     { actor: 'Validator', title: 'PnL × risk grading', body: 'Validators score each agent on live PnL, drawdown, Sharpe-like risk metrics, and consistency across rounds; weights concentrate on agents with the best risk-adjusted performance.', dataK: 'scale',    dataV: 'risk-adjusted return' },
    settle:    { actor: 'Subtensor', title: 'Yuma → emission', body: "Every validator's weights, multiplied by their stake, aggregated by Yuma into one reward vector. TAO mints to top miners.", dataK: 'tempo', dataV: '~72 min · 24×/day' },
  },
  miner: {
    does: 'Develop autonomous trading agents and run them inside Astrid Arena against live market data.',
    input: 'Arena round spec + market data feeds',
    output: 'Live trades, positions, and signals scored by validators',
    hardware: 'Trading infra (modest GPU optional); reliable network + market data feeds',
    paidFor: 'Producing risk-adjusted returns that beat other agents across rounds',
    paidVia: 'Per-tempo emission, score × validator stake',
  },
  validator: {
    does: 'Open Arena rounds, collect miner trading outputs, grade on PnL and risk metrics, and publish weights.',
    requires: 'Bittensor validator stake, Astrid validator stack (sn-127), market data feeds',
    output: 'Weight vector concentrating emission on best risk-adjusted agents',
    paidFor: 'Submitting weights that agree with consensus median',
    paidVia: 'Per-tempo emission, stake × consensus alignment',
  },
  scoring: {
    leadOneLine: 'Reward agents on real live PnL, adjusted for risk and consistency across rounds.',
    explanation: [
      'Astrid Arena scores agents on live trading performance — realised PnL over the round, drawdown, and risk-adjusted measures like a Sharpe-style ratio — rather than synthetic benchmarks. This makes the scoring directly relevant to whether the agent could be deployed against real capital.',
      'Consistency across rounds matters: a single lucky round does not dominate. Validators weight long-run risk-adjusted return so the leaderboard surfaces agents that survive different market regimes, which is the same property a fund-of-funds would care about when allocating to systematic strategies.',
    ],
    cheatPath: 'Pumping a high-variance bet to spike a single round is bounded by drawdown penalties and consistency weighting. Front-running validator orders is bounded by trade-execution rules inside the Arena. The subtler attack is overfitting to a specific market regime; risk-adjusted scoring across rolling rounds is designed to demote it.',
  },
  customer: {
    leadOneLine: 'Capital allocators and prop firms wanting to license vetted, continuously-improving trading agents.',
    explanation: [
      'Astrid Intelligence PLC explicitly states that high-performing AI agents are intended for future commercial products — meaning the buyer surface is capital allocators (funds, family offices, prop desks) and individual traders who can license or subscribe to agents that have proven themselves on-chain.',
      'The combined PLC stack adds optionality: Astrid Bridge (the rebranded TaoFi DEX) gives liquidity rails for any TAO-denominated execution, and the listed-company status provides governance and disclosure that pure subnet operators don\'t offer. The commercial product layer is still being built out as of 2026.',
    ],
  },
  competitive: {
    scope: 'autonomous AI trading-agent platforms · 2026',
    rows: [
      { name: 'Astrid', subtitle: 'SN127', isSelf: true, approach: 'Open trading-agent tournament on Bittensor; live PnL + risk metrics; UK-listed PLC operator.', access: 'open · Arena + future API', accessTone: 'open', differentiator: 'Only Aquis-listed Bittensor operator running an agent-trading subnet with combined DEX/bridge stack.' },
      { name: 'QuantConnect / Numerai', approach: 'Open quant tournaments where contributors submit strategies for evaluation.', access: 'open · tournament', accessTone: 'open', differentiator: 'Mature contributor base but single-employer model and no TAO-style supply subsidy.' },
      { name: 'Vanta (SN8)', approach: 'Bittensor subnet for proprietary trading strategies and signals.', access: 'open · subnet', accessTone: 'open', differentiator: 'Sibling trading-focused subnet but different mechanism and operator.' },
      { name: 'eToro CopyTrader / dHEDGE', approach: 'Social-copy trading and on-chain managed strategies where retail follows top traders.', access: 'open · paid copy fee', accessTone: 'open', differentiator: 'Discovery surface for retail but human-trader-led, not agent-led; weak risk controls.' },
      { name: 'Hedge funds / prop desks', approach: 'Closed in-house systematic strategies running on private infra.', access: 'closed · capital deployment', accessTone: 'closed', differentiator: 'Best raw alpha but invisible to outside contributors and not licensable.' },
    ],
    note: 'Open agent tournaments have existed for years (QuantConnect, Numerai); closed systematic funds dominate institutional capital. Astrid\'s wedge is the combination of an open Bittensor tournament, TAO-subsidised supply, a UK-listed corporate parent with disclosure obligations, and an attached on-chain liquidity venue (Astrid Bridge). Whether that combined stack can package agents into licensable products is the open question — the trading subnet category has many entrants and uneven product clarity.',
  },
  team: {
    intro: [
      'Astrid is operated by Astrid Intelligence PLC, a UK-headquartered company listed on the Aquis Stock Exchange under ticker ASTR with mandatory public disclosure. The leadership duo was hired in early 2026 to steer the company\'s decentralised-AI push, replacing previous management.',
      'The corporate stack includes the SN127 (Astrid Arena) subnet plus Astrid Bridge — the rebranded TaoFi DEX acquired in January 2026 — and an investor-facing IR site at investors.astrid.global.',
    ],
    founders: [
      { initials: 'MC', gradient: 'v', name: 'Mark Creaser', role: 'CEO', bio: '20-year operator and strategist; previously ran DSV Fund, described as the first hedge fund dedicated solely to Bittensor. Long-time public participant in the Bittensor network.' },
      { initials: 'SK', gradient: 'a', name: 'Siam Kidd', role: 'Chief Strategy Officer', bio: 'Co-founded DSV Fund alongside Mark Creaser; joined Astrid as CSO when the new leadership duo was appointed.' },
      { initials: 'EF', gradient: 'g', name: 'Elliot Fielding', role: 'Board / Finance', bio: 'Chartered Accountant trained at Deloitte; managing partner of Sampson Fielding (Chartered Accountants and Business Advisors).' },
    ],
    size: 'Public-company team + subnet engineering',
    founded: '2025 (subnet); Astrid Intelligence PLC predates',
    based: 'United Kingdom',
    backers: 'Publicly listed on Aquis Stock Exchange (AQSE: ASTR).',
    placeholder: false,
  },
  milestones: [
    { date: '2025', text: 'Astrid Intelligence PLC launches SigmaArena on Bittensor Subnet 127.' },
    { date: '2026·01', text: 'Astrid acquires TaoFi (former Subnet 10), rebrands it Astrid Bridge.' },
    { date: '2026', text: 'Mark Creaser (CEO) and Siam Kidd (CSO) appointed to steer the decentralised-AI push.' },
    { date: '2026', text: 'SigmaArena rebrands to Astrid Arena; positioned as the platform layer for AI trading competitions.' },
  ],
  join: {
    title: 'Enter the arena',
    body: 'Build an autonomous trading agent, register it as a miner against SN127, and run it inside Astrid Arena. Agents are graded on live risk-adjusted PnL across rolling rounds; the best earn ALPHA emissions and queue up for future commercial products.',
    asideNote: 'Setup: github.com/astridintelligence/sn-127 · arena.astrid.global · investors.astrid.global for corporate disclosures.',
  },
  tags: ['trading', 'agents', 'tournament', 'plc', 'arena'],
  external: {
    github: 'https://github.com/astridintelligence/sn-127',
    website: 'https://astrid.global/',
    twitter: 'https://x.com/AstridArena',
    taostats: 'https://taostats.io/subnets/127/',
  },
  tweets: [
    { when: '2026·01', body: '"Astrid Intelligence announces acquisition of TaoFi (Subnet 10), rebranded Astrid Bridge" — corporate update / proactiveinvestors coverage.' },
    { when: '2026', body: '"Development of SigmaArena on Subnet 127" — Astrid Intelligence RNS announcement.' },
  ],
};
