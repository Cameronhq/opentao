import type { RichSubnet } from '../subnet-rich';

export const sn88: RichSubnet = {
  slug: '88-investing',
  netuid: 88,
  name: 'Investing',
  shortPitch: 'Decentralized AUM — miners submit strategies, validators score returns.',
  overview: [
    'Investing is Bittensor Subnet 88, envisioned as the world\'s first decentralized asset-management platform. The thesis is a "decentralized Wall Street" — miners contribute investment strategies across multiple asset classes (TAO staking, US equities, forex, and more), validators score those strategies under a transparent algorithm, and capital flows toward whatever consistently outperforms.',
    'The subnet launched with TAO/Alpha staking optimization in Phase I, expanded to US equities in Phase II (July 2025), and graduated to a live hedge fund in Phase III — the 88 Quant Fund, a TAO/Alpha hedge fund launched in December 2025 that is powered by miner strategies on the subnet itself.',
    'External customers are retail and institutional investors who want exposure to algorithmic strategies without trusting a single fund manager — by composing diverse miner strategies, rebalancing on schedule, and scoring on risk-adjusted return, Investing aims to position itself as a permissionless alternative to BlackRock-style AUM products in a $145T+ global asset-management market.',
    'One-line diff: a TAO-incentivized quant fund where strategy supply is permissionless and scoring is on-chain. <a href="#customer" style="color: var(--accent);">See competitive landscape ↓</a>',
  ],
  cycle: {
    challenge: { actor: 'Validator', title: 'Open a window', body: 'Validators open a scoring window for the current asset class (TAO/Alpha staking, US equities, forex) with defined benchmark, rebalance cadence, and risk constraints.', dataK: 'payload', dataV: 'asset class + window' },
    compute:   { actor: 'Miner',     title: 'Submit strategy', body: 'Miners submit allocation strategies — weights across the available assets — designed to outperform the benchmark on a risk-adjusted basis over the scoring window.', dataK: 'latency',  dataV: 'window length' },
    score:     { actor: 'Validator', title: 'Score on returns', body: 'Validators simulate (or live-track) each miner\'s strategy versus the benchmark, scoring on a risk-adjusted return metric and submitting weights proportional to performance.', dataK: 'scale',    dataV: 'Sharpe / alpha' },
    settle:    { actor: 'Subtensor', title: 'Yuma → emission', body: "Every validator's weights, multiplied by their stake, aggregated by Yuma into one reward vector. TAO mints to top miners.", dataK: 'tempo', dataV: '~72 min · 24×/day' },
  },
  miner: {
    does: 'Develops and submits investment strategies — allocation rules across the supported asset classes — that compete on risk-adjusted performance over the scoring window.',
    input: 'Asset universe + benchmark + risk constraints from validator',
    output: 'Strategy / allocation submission for the window',
    hardware: 'Modest — strategy compute is generally feasible on a single workstation; quant talent matters more than GPUs',
    paidFor: 'Risk-adjusted return of submitted strategies over the tempo',
    paidVia: 'Per-tempo emission, score × validator stake',
  },
  validator: {
    does: 'Operates the scoring algorithm — simulates or live-tracks miner strategies, computes risk-adjusted returns versus the benchmark, and submits weights each tempo.',
    requires: 'Bittensor validator stake + price-feed access for the supported asset classes',
    output: 'Weight vector across miner hotkeys per tempo',
    paidFor: 'Submitting weights that agree with consensus median',
    paidVia: 'Per-tempo emission, stake × consensus alignment',
  },
  scoring: {
    leadOneLine: 'Risk-adjusted return versus an asset-class benchmark — strategies that outperform pay miners.',
    explanation: [
      'For each scoring window, validators evaluate miner strategies against an asset-class benchmark (e.g., a passive TAO/Alpha staking baseline, an S&P 500 ETF, or an FX index). Scores combine excess return with a risk penalty so that high-volatility strategies do not dominate. The risk-adjusted score across the window maps directly to weights.',
      'Because scoring is on observable returns and the benchmark is public, miners can iterate transparently. The subnet uses the same scoring engine to allocate live capital in the 88 Quant Fund, so the validator-side simulation has direct downstream consequences in production trading.',
    ],
    cheatPath: 'Strategies that overfit to a single window or take undisclosed leverage are punished by the risk penalty and by drawdowns in the next window. Because allocations are tracked over a rolling horizon and the benchmark is fixed, miners cannot win by simply spiking a single lucky trade — sustained risk-adjusted alpha is what scores.',
  },
  customer: {
    leadOneLine: 'Retail and institutional capital that wants algorithmic exposure without trusting a single fund manager.',
    explanation: [
      'The first concrete customer is the 88 Quant Fund itself — a TAO/Alpha hedge fund launched in December 2025 whose allocations are driven by the top-scoring miner strategies on the subnet. Capital that flows into the fund is effectively buying a composite of competitively scored strategies rather than backing a single PM.',
      'Beyond TAO, the long-term target is the broader $145T+ asset-management market. By extending across asset classes (equities, FX, crypto, commodities), Investing positions itself as a permissionless alternative to closed managers like BlackRock — where supply of strategies is open, scoring is on chain, and capital allocation can be audited.',
    ],
  },
  competitive: {
    scope: 'Decentralized algorithmic asset management · 2026',
    rows: [
      { name: 'Investing', subtitle: 'SN88', isSelf: true, approach: 'Miners submit strategies, validators score risk-adjusted returns, 88 Quant Fund deploys real capital on top.', access: 'open · subnet + fund', accessTone: 'open', differentiator: 'Only Bittensor subnet with a live hedge-fund customer wired directly to its scoring layer.' },
      { name: 'Numerai', approach: 'Crowdsourced quant signals from data scientists who stake on their own predictions.', access: 'open · signals', accessTone: 'open', differentiator: 'Pioneer of crowdsourced quant; centralized fund operator, no on-chain incentive token.' },
      { name: 'BlackRock Aladdin', approach: 'Industry-standard institutional asset-management and risk platform.', access: 'closed · institutional', accessTone: 'closed', differentiator: 'Massive scale and risk tooling; entirely centralized and closed-supply.' },
      { name: 'dHedge / Enzyme', approach: 'On-chain asset-management protocols letting managers run funds with transparent NAVs.', access: 'open · on-chain', accessTone: 'open', differentiator: 'Transparent allocations, but no incentive layer for strategy supply — managers compete on marketing.' },
      { name: 'Robo-advisors (Wealthfront, Betterment)', approach: 'Algorithmic ETF portfolio management for retail.', access: 'open · web', accessTone: 'open', differentiator: 'Mass-market simplicity; passive strategies only, no active alpha competition.' },
    ],
    note: 'Investing\'s differentiator is the closed loop between strategy supply, scoring, and capital deployment. Numerai pays signals but runs a centralized fund; on-chain managers expose NAVs but don\'t incentivize supply. SN88 plugs all three into one mechanism with the 88 Quant Fund as a real customer.',
  },
  team: {
    intro: [
      'Investing is operated by the Mobius Fund team, with public material naming Jake, Glenn, and Josh as the lead operators. The team runs the SN88 subnet alongside the related HODL ETF project; the GitHub organization mobiusfund hosts both the investing and etf repos.',
      'Other named contributors on the GitHub side include "cisterciansis" (Douglas) and "A-kiriakides." The team has been actively profiled by Bittensor-focused podcasts and analytics outlets that cover SN88 specifically.',
    ],
    founders: [
      { initials: 'JK', gradient: 'v', name: 'Jake', role: 'Co-founder, Mobius Fund', bio: 'Lead operator of Subnet 88 (Investing) and the 88 Quant Fund; runs the scoring and fund-deployment side of the Mobius Fund stack.' },
      { initials: 'GL', gradient: 'a', name: 'Glenn', role: 'Co-founder, Mobius Fund', bio: 'Co-leads SN88; one of the three named operators driving the decentralized AUM thesis on Bittensor.' },
      { initials: 'JS', gradient: 'g', name: 'Josh', role: 'Co-founder, Mobius Fund', bio: 'Co-leads SN88; one of the three named operators behind Investing and the 88 Quant Fund.' },
    ],
    size: 'Small core team plus open-source contributors (cisterciansis / Douglas, A-kiriakides)',
    founded: '2025 (subnet) · December 2025 (88 Quant Fund)',
    based: 'Distributed',
    backers: 'Not publicly disclosed.',
  },
  milestones: [
    { date: '2025', text: 'Subnet 88 (Investing) launches on Bittensor with TAO/Alpha staking strategy optimization (Phase I).' },
    { date: '2025·07', text: 'Phase II — US equities — added to the subnet asset universe.' },
    { date: '2025·12', text: '88 Quant Fund launches as a TAO/Alpha hedge fund powered by SN88 strategies.' },
    { date: '2026', text: 'Subnet positioning sharpens around a "decentralized BlackRock" thesis for the $145T+ AUM market.' },
  ],
  join: {
    title: 'Submit a strategy to Investing',
    body: 'Pull mobiusfund/investing, build an allocation strategy for one of the active asset classes (TAO/Alpha staking, US equities, forex), register a hotkey on SN88, and submit your strategy to the validator-issued scoring window. Risk-adjusted return is what gets paid.',
    asideNote: '88 Quant Fund allocates real capital on top — strategy quality has direct downstream consequences.',
  },
  tags: ['finance', 'asset-management', 'quant', 'hedge-fund', 'staking'],
  external: {
    github: 'https://github.com/mobiusfund/investing',
    twitter: 'https://twitter.com/Investing88ai',
    taostats: 'https://taostats.io/subnets/88/',
  },
};
