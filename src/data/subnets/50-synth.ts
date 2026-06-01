import type { RichSubnet } from '../subnet-rich';

export const sn50: RichSubnet = {
  slug: '50-synth',
  netuid: 50,
  name: 'Synth',
  shortPitch: 'Probabilistic price-path simulator for crypto, equities, and commodities.',
  overview: [
    'Synth (SN50), built by Mode Network, produces probabilistic synthetic price paths for crypto and tokenized-equity assets. Instead of a single point forecast, miners submit thousands of simulated future paths so downstream consumers can sample the full distribution — tail risk, volatility regime, drift, the works.',
    'Forecasts are scored with the Continuous Ranked Probability Score (CRPS), which penalizes both miscalibration and over-confidence. Miners are forced to capture realistic features — volatility clustering, fat tails, correlation — or they lose emissions to teams whose distributions match the unfolding tape more closely.',
    'Coverage has expanded aggressively: BTC, ETH, SOL and XAU at 24-hour horizon since late 2025; tokenized equities (SPYX, NVDAX, TSLAX, AAPLX, GOOGLX) added January 2026; XRP, HYPE, and WTI oil added March 2026. The forecast surface is becoming a cross-asset substrate, not just a BTC tool.',
    'Downstream use cases are concrete: a $2k Polymarket account using Synth signals reportedly traded ~$500k volume and returned ~110% over four weeks, and the subnet has paid out >$2M to miners since February 2025. Buyers include prediction-market bots, perp risk engines, Uniswap v3 LP-range tools, and on-chain agents. <a href="#customer" style="color: var(--accent);">See competitive landscape ↓</a>',
  ],
  cycle: {
    challenge: { actor: 'Validator', title: 'Issue price task', body: 'Validators specify the asset, horizon (24h), number of simulated paths (1000), and time grid. Tasks fan out to all registered miners.', dataK: 'payload', dataV: 'asset + 1000-path request' },
    compute:   { actor: 'Miner',     title: 'Simulate paths', body: 'Miners run their forecasting model and return 1000 simulated price trajectories per asset, sampled on the validator\'s time grid.', dataK: 'latency',  dataV: 'minutes per asset' },
    score:     { actor: 'Validator', title: 'CRPS scoring', body: 'After the horizon resolves, validators compare each miner\'s empirical distribution against the realized price path using CRPS, then rank.', dataK: 'scale',    dataV: 'multi-asset CRPS' },
    settle:    { actor: 'Subtensor', title: 'Yuma → emission', body: "Every validator's weights, multiplied by their stake, aggregated by Yuma into one reward vector. TAO mints to top miners.", dataK: 'tempo', dataV: '~72 min · 24×/day' },
  },
  miner: {
    does: 'Builds probabilistic price models and submits 1000-path Monte Carlo simulations for each requested asset.',
    input: 'Asset list, horizon, grid, request timestamp.',
    output: 'Array of 1000 price paths over the next 24 hours.',
    hardware: 'Modest — CPU or single GPU; the difficulty is statistical, not compute.',
    paidFor: 'CRPS-based ranking once the actual price resolves.',
    paidVia: 'Per-tempo emission, score × validator stake',
  },
  validator: {
    does: 'Issues tasks, observes realized prices, computes CRPS, submits weights.',
    requires: 'Reliable price oracle feed, CRPS scoring code, stable RPC.',
    output: 'Per-miner CRPS-based weight vector.',
    paidFor: 'Submitting weights that agree with consensus median',
    paidVia: 'Per-tempo emission, stake × consensus alignment',
  },
  scoring: {
    leadOneLine: 'Continuous Ranked Probability Score — calibrated distributions beat sharp wrong ones.',
    explanation: [
      'CRPS treats forecasting as a distribution match, not a point match. A miner who says "BTC will be 100k ±5k with these specific tail probabilities" gets credit if reality falls anywhere within plausible regions of their distribution, weighted by how close it lands.',
      'This punishes both over-confidence (narrow predictions that miss) and lazy hedging (wide-uniform priors that capture everything). Top miners model realistic price dynamics — volatility clustering, fat tails, intraday regimes — rather than fitting Gaussians to historical returns.',
    ],
    cheatPath: 'Submitting paths drawn from a smooth Gaussian fit to recent returns won\'t survive — crypto returns are fat-tailed and skewed, so naive fits get hammered on the days that matter.',
  },
  customer: {
    leadOneLine: 'Anyone whose P&L depends on a forecast distribution, not a single number.',
    explanation: [
      'Real users so far: Polymarket-style prediction-market bots needing implied-distribution priors; perp DEX risk engines avoiding liquidation cascades; Uniswap v3 LPs sizing concentrated ranges; on-chain trading agents needing volatility forecasts to size positions.',
      'The cross-asset expansion (BTC, ETH, SOL, XAU, tokenized equities, XRP, HYPE, WTI) reflects Mode\'s thesis that "DeFAI" — DeFi-native AI agents — will need a unified probabilistic substrate across every asset they touch.',
    ],
  },
  competitive: {
    scope: '2026 · probabilistic crypto price forecasting',
    rows: [
      { name: 'Synth', subtitle: 'SN50', isSelf: true, approach: 'Open subnet; miners submit 1000-path distributions; CRPS scoring; outputs free to API consumers.', access: 'open · API', accessTone: 'open', differentiator: 'Probabilistic, multi-asset, on-chain accessible, paid via emissions not subscription.' },
      { name: 'Numerai',                    approach: 'Equity-only stock-market signals tournament; encrypted submissions.', access: 'closed · stake', accessTone: 'closed', differentiator: 'Stocks only; single point estimate; not crypto-native.' },
      { name: 'Pyth network forecasts',     approach: 'Oracle prices; some probabilistic add-ons.', access: 'open · oracle', accessTone: 'open', differentiator: 'Spot prices, not forward distributions.' },
      { name: 'Goldsky / Allium analytics', approach: 'On-chain analytics and risk feeds for institutional desks.', access: 'closed · enterprise', accessTone: 'closed', differentiator: 'Descriptive analytics, not predictive distributions.' },
      { name: 'Two Sigma / Citadel internal', approach: 'Proprietary in-house quant models, not for external consumption.', access: 'closed · internal', accessTone: 'closed', differentiator: 'Better models, zero access.' },
    ],
    note: 'Synth\'s wedge is being the only open, probabilistic, multi-asset forecast feed that on-chain agents can consume directly. Closed quants have better models but won\'t sell them; oracles deliver spot prices but not distributions. Synth fills the gap.',
  },
  team: {
    intro: [
      'Synth is operated by Mode Network, a modular DeFi L2 built on the OP Stack. Mode\'s thesis is that on-chain AI agents need DeFi-native infrastructure — including forecast feeds — and Synth is the substrate they built for it.',
      'Mode is led by James Ross, who founded Mode after stints as co-CEO of Hype and founder of agency0x. Synth was introduced via Mode\'s mainline channels in early 2025 and reached >$2M in cumulative miner payouts within the first year.',
    ],
    founders: [
      { initials: 'JR', gradient: 'v', name: 'James Ross', role: 'Founder, Mode Network / Synth', bio: 'Previously co-CEO of Hype and founder of agency0x; University of Sussex; based in the UK.', twitter: 'https://x.com/jrosstreacher' },
    ],
    size: '~15-25 (Mode-wide)',
    founded: '2024',
    based: 'United Kingdom',
    backers: 'Mode Network ecosystem; OP Stack alignment with Optimism.',
    placeholder: false,
  },
  milestones: [
    { date: '2025·02', text: 'Synth SN50 mainnet launch; first miner emissions distributed.' },
    { date: '2025·11', text: 'Coverage expanded to BTC, ETH, SOL, XAU at 24-hour horizon.' },
    { date: '2026·01', text: '5 tokenized equity assets (SPYX, NVDAX, TSLAX, AAPLX, GOOGLX) added.' },
    { date: '2026·03', text: 'XRP, HYPE, and WTI oil added; >$2M cumulative miner payouts.' },
  ],
  join: {
    title: 'Forecast distributions, earn TAO.',
    body: 'Miners need a probabilistic forecasting model — anything from a copula-stitched GARCH to a deep generative path model. Validators need a price oracle and CRPS scoring code. Buyers can pull paths via the public API.',
    asideNote: 'CRPS makes laziness expensive — wide uninformed distributions and narrow over-confident ones both lose.',
  },
  tags: ['Forecasting', 'Finance', 'DeFi', 'Probabilistic'],
  external: {
    github: 'https://github.com/mode-network/synth-subnet',
    website: 'https://synth.mode.network',
    twitter: 'https://x.com/modenetwork',
    taostats: 'https://taostats.io/subnets/50/',
  },
  tweets: [
    { when: '2025·01', body: 'Introducing the Synth Bittensor Subnet (SN50) Whitepaper. Synth incentivizes the price models and data that will power DeFAI.' },
  ],
};
