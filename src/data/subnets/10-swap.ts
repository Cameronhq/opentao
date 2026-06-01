import type { RichSubnet } from '../subnet-rich';

export const sn10: RichSubnet = {
  slug: '10-swap',
  netuid: 10,
  name: 'Swap',

  shortPitch: 'Cross-chain liquidity for Bittensor — bring USDC and ETH into subnet tokens.',

  overview: [
    'Swap is Bittensor Subnet 10, operated by the TaoFi team (with contributors from Sturdy Protocol). The subnet pivoted from its earlier identity in mid-2025 and re-launched as the liquidity layer for the TaoFi DEX — a cross-chain venue that lets users on Base, Solana, and other major chains swap USDC, ETH, or stables directly into Bittensor subnet alpha tokens in a single transaction.',
    'The subnet runs the standard Bittensor topology, but the "miners" are liquidity providers contributing to the TAO/USDC pool on TaoFi. Scoring is unusually direct: a miner\'s score is the share of trading fees their liquidity position earned over the past 24 hours, measured on chain. This collapses the usual incentive-mechanism design into pure usage-based attribution.',
    'Outside Bittensor, the buyer is anyone who wants exposure to Bittensor alpha tokens without learning Bittensor — Base or Solana users with USDC can buy SN tokens directly through taofi.com. Cross-chain messaging is done via Hyperlane Warp Routes and Interchain Accounts. The 0.3% swap fee on the TAO/USDC pool flows entirely to LPs, and SN10 rewards are reported at very high APRs while liquidity remains light.',
    'Closest competitors are Uniswap-style AMMs, native bridges, and any subnet-token CEX listing. Swap differs by combining cross-chain UX (one transaction from USDC on Base to any subnet token) with a Bittensor-native incentive layer paying TAO emissions to LPs for genuine fee-generating activity. <a href="#customer" style="color: var(--accent);">See competitive landscape ↓</a>',
  ],

  cycle: {
    challenge: { actor: 'Validator', title: 'Index pool fees', body: 'Validators index 24-hour fee earnings per LP position on the TAO/USDC pool and any other Swap-incentivised pools, plus relevant cross-chain swap activity routed through Hyperlane.', dataK: 'payload', dataV: '24h trailing fee earnings per LP' },
    compute:   { actor: 'Miner',     title: 'Provide liquidity', body: 'Miners (liquidity providers) post and rebalance positions on the TaoFi pool. They earn protocol-level swap fees and qualify for SN10 emission rewards proportional to fees captured.', dataK: 'latency',  dataV: 'rolling 24h fee share' },
    score:     { actor: 'Validator', title: 'Score by fees', body: 'Validators rank LPs by the fees their positions earned over the trailing 24h. Higher fee share = higher score. Scoring is usage-based rather than capital-based, so dead capital does not earn.', dataK: 'scale',    dataV: 'share of 24h fees · linear' },
    settle:    { actor: 'Subtensor', title: 'Yuma → emission', body: "Every validator's weights, multiplied by their stake, aggregated by Yuma into one reward vector. TAO mints to top miners.", dataK: 'tempo', dataV: '~72 min · 24×/day' },
  },

  miner: {
    does:     'Provides concentrated liquidity to the TaoFi TAO/USDC pool (and other Swap-incentivised pools) and rebalances positions to capture trading fees.',
    input:    'Live order flow on the TaoFi DEX plus market prices for TAO and supported subnet tokens.',
    output:   'LP positions on the TaoFi pool generating actual trading-fee revenue over the round.',
    hardware: 'Light — running a price feed and rebalancing scripts. No GPU required.',
    paidFor:  'Capturing trading fees through actively rebalanced LP positions.',
    paidVia:  'Per-tempo emission, score × validator stake',
  },
  validator: {
    does:     'Indexes pool activity, computes per-LP 24h fee earnings, ranks miners by fee share, and posts weights.',
    requires: 'Standard Bittensor validator stake plus reliable indexing of the TaoFi pool and any cross-chain swap activity routed through Hyperlane.',
    output:   'A weight vector based on per-LP fee earnings over the trailing 24h.',
    paidFor:  'Submitting weights that agree with consensus median',
    paidVia:  'Per-tempo emission, stake × consensus alignment',
  },

  scoring: {
    leadOneLine: 'A miner\'s score is the share of trading fees their LP position captured over the trailing 24 hours — usage, not capital.',
    explanation: [
      'Most LP incentive programs reward total value locked, which sets up a "deposit and forget" failure mode where dead capital sits on dead price ranges and still earns rewards. Swap inverts this — only fee-generating capital scores. A small concentrated position around the active price can outscore a much larger but lazy position, which is the right incentive for an actually-functioning market.',
      'Because the scoring rule is "what fees did your position earn", it cannot be gamed by parking liquidity in irrelevant ranges or wash-trading without real flow. Real swap volume from real users is the input to the scoring function, so emissions only flow to LPs who help actual trades happen. The 0.3% pool fee flows to LPs as base income; SN10 emissions stack on top.',
    ],
    cheatPath: 'Wash trading would generate fees, but it costs the same fees to pay — a miner trading against their own LP position pays 0.3% on each round trip, which is exactly what they earn back, netting zero before gas costs. Capital parked far from the active price earns no fees and therefore no emissions. Cross-chain manipulation is bounded by Hyperlane\'s message verification and the underlying chains\' settlement.',
  },

  customer: {
    leadOneLine: 'Anyone outside Bittensor who wants to buy subnet alpha tokens with USDC, ETH, or stables in a single transaction.',
    explanation: [
      'The headline UX is buying Bittensor subnet tokens from Base or Solana without leaving the chain you started on. Connect a wallet on Base, choose a subnet token at taofi.com, and the swap routes via Hyperlane into Bittensor and back. This collapses what used to be a multi-step ordeal — bridge to Bittensor, set up a Bittensor wallet, manually swap on chain — into one transaction.',
      'The secondary customer is the broader Bittensor DeFi stack. As more subnet tokens become tradeable from outside, the supply side of capital expands meaningfully. TaoFi has shipped taoUSD (a stable for Bittensor-native DeFi) and integrations to bring Base and Solana liquidity into the Bittensor ecosystem. Liquidity provision becomes a productive yield strategy for outside capital that wants Bittensor exposure with daily fees and TAO emissions on top.',
    ],
  },

  competitive: {
    scope: 'Bittensor token liquidity · 2026',
    rows: [
      { name: 'Swap', subtitle: 'SN10', isSelf: true, approach: 'Liquidity-incentivized DEX with usage-based emission scoring on the TAO/USDC and subnet-token pools.', access: 'open · web', accessTone: 'open', differentiator: 'TAO emissions stack on top of pool fees; usage-based scoring rewards real flow, not deposits.' },
      { name: 'Uniswap', subtitle: 'L1/L2 DEX', approach: 'Industry-standard AMM with concentrated liquidity across many chains.', access: 'open · web', accessTone: 'open', differentiator: 'No native Bittensor support; no cross-chain UX to subnet tokens.' },
      { name: 'Native subnet listings', subtitle: 'in-Bittensor DEX', approach: 'Trading subnet alpha tokens via in-protocol DEX inside Bittensor itself.', access: 'open · CLI', accessTone: 'open', differentiator: 'Requires a Bittensor wallet and ecosystem onboarding; not friendly for outside capital.' },
      { name: 'CEX listings', subtitle: 'Binance, Coinbase, etc.', approach: 'Centralised exchanges that list TAO and a small number of subnet tokens.', access: 'closed · KYC', accessTone: 'closed', differentiator: 'KYC required, small subset of subnet tokens listed, custody risk.' },
      { name: 'Hyperlane', subtitle: 'cross-chain messaging', approach: 'General-purpose interoperability stack used by TaoFi to bridge Base and Solana into Bittensor.', access: 'open · SDK', accessTone: 'open', differentiator: 'Infrastructure layer that TaoFi builds on, not a competing user product.' },
    ],
    note: 'Swap\'s wedge is the UX of buying subnet tokens from outside Bittensor combined with emissions that pay LPs for actual fee generation. Versus CEX listings, the long tail of subnet tokens becomes tradeable; versus in-Bittensor DEXes, the experience is one-click for non-Bittensor users; versus Uniswap and similar generic AMMs, the Bittensor-native emission layer subsidises liquidity in a way no L2 DEX can match.',
  },

  team: {
    intro: [
      'Swap is operated by the TaoFi team, with engineering contributions from veterans of Sturdy Protocol and the broader Bittensor liquidity stack. The pivot from the slot\'s previous identity to "Swap" was announced by Sam Forman in mid-2025, aligning the subnet identity around the DEX and liquidity mission.',
      'The team\'s thesis is that Bittensor\'s biggest constraint is liquidity access — alpha tokens are the most interesting new asset class in crypto, but onboarding into Bittensor remains painful for outsiders. TaoFi closes that gap by bringing Base and Solana liquidity into Bittensor via Hyperlane, and Swap is the emission engine that pays LPs to sit on the right side of the resulting flow.',
    ],
    founders: [
      { initials: 'SF', gradient: 'v', name: 'Sam Forman', role: 'Lead, TaoFi / Swap', bio: 'Publicly announced the rebrand of Subnet 10 to Swap in mid-2025; leads the TaoFi DEX and the Hyperlane-powered cross-chain stack.', twitter: 'https://x.com/sforman2010' },
    ],
    size: 'Small team plus Sturdy Protocol contributors',
    founded: 'Subnet 10 pivot to Swap in mid-2025',
    based: 'Distributed',
    backers: 'Not publicly disclosed beyond ecosystem partnerships with Hyperlane and Sturdy Protocol.',
    placeholder: true,
  },

  milestones: [
    { date: '2024', text: 'Subnet 10 registered under earlier identity.' },
    { date: '2025·H2', text: 'Rebrand to Swap announced; TaoFi DEX goes live with TAO/USDC pool.' },
    { date: '2026', text: 'Cross-chain swaps from Base and Solana into subnet tokens via Hyperlane Warp Routes; taoUSD stable launched.' },
  ],

  join: {
    title: 'Provide liquidity on TaoFi',
    body: 'Connect a wallet on Base, deposit into the TaoFi TAO/USDC pool, register a Bittensor miner on SN10 to claim emission alongside trading fees.',
    asideNote: 'Validators need standard SN10 stake plus reliable indexing of TaoFi pool activity and cross-chain message flow.',
  },

  tags: ['defi', 'liquidity', 'cross-chain', 'dex'],

  external: {
    github:   'https://github.com/Swap-Subnet/swap-subnet',
    website:  'https://taofi.com/',
    twitter:  'https://x.com/_taofi_',
    taostats: 'https://taostats.io/subnets/10/',
  },
};
