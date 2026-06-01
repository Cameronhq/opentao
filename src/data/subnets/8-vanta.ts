import type { RichSubnet } from '../subnet-rich';

export const sn8: RichSubnet = {
  slug: '8-vanta',
  netuid: 8,
  name: 'Vanta',

  shortPitch: 'Decentralized proprietary trading network with verifiable on-chain performance.',

  overview: [
    'Vanta is Bittensor Subnet 8, operated by Taoshi — a fintech founded by Arrash Yasavolian in 2023. The subnet was previously known as the Proprietary Trading Network (PTN) and re-branded to Vanta in late 2025 as it formalised into a decentralized prop-trading firm. Miners submit futures-based signals across forex, crypto, and equities; validators verify executions, store them on chain, and continuously track portfolio returns.',
    'The subnet runs the standard Bittensor topology of validator and miner slots, with an additional layer that records trade signals and resulting P&L on chain so performance is publicly auditable. Validators score miners on risk-adjusted metrics — Omega score, total return, and strict drawdown limits — rather than raw profit. The mechanism rewards calibrated, drawdown-aware strategies and washes out high-variance gambling.',
    'Outside Bittensor, the customer is the prop-firm trader. Taoshi launched Vanta Trading in 2026 as a decentralised evaluation platform built on top of the subnet — traders pay to take a challenge, the subnet evaluates performance, and qualifying traders earn a 100% profit split with transparent on-chain rules and quarterly account scaling. This replaces the opaque rules and arbitrary failures common in traditional prop firms.',
    'Closest competitors are FTMO, MyForexFunds, and the prop-firm category broadly, plus quant aggregators like Numerai. Vanta differs by running the evaluation on a public chain with verifiable rules, offering 100% profit split (versus FTMO\'s 80/20-style), and using Bittensor emissions to subsidise top traders. <a href="#customer" style="color: var(--accent);">See competitive landscape ↓</a>',
  ],

  cycle: {
    challenge: { actor: 'Validator', title: 'Open trading window', body: 'Validators expose live market feeds across forex, crypto, and equities. Miners submit directional position signals (long, short, flat) at any time during the window.', dataK: 'payload', dataV: 'forex / crypto / equities feed' },
    compute:   { actor: 'Miner',     title: 'Submit signals', body: 'Miners run their trading models and submit signed long/short/flat signals plus position sizes. Signals are stored on chain so each miner\'s portfolio can be reconstructed and audited.', dataK: 'latency',  dataV: 'on-chain signal · per-asset' },
    score:     { actor: 'Validator', title: 'Risk-adjusted score', body: 'Validators reconstruct each miner\'s portfolio from logged signals and score them on Omega ratio, total return, and drawdown limits. High drawdowns disqualify; smooth equity curves dominate.', dataK: 'scale',    dataV: 'Omega · return · drawdown limit' },
    settle:    { actor: 'Subtensor', title: 'Yuma → emission', body: "Every validator's weights, multiplied by their stake, aggregated by Yuma into one reward vector. TAO mints to top miners.", dataK: 'tempo', dataV: '~72 min · 24×/day' },
  },

  miner: {
    does:     'Runs a trading model that produces long / short / flat signals across forex, crypto, and equities, submitted on chain for portfolio reconstruction and scoring.',
    input:    'Live market feeds for the supported asset classes.',
    output:   'A timestamped stream of directional signals and position sizes per asset, signed and recorded on Bittensor.',
    hardware: 'Modest — most of the work is alpha research and model design. Inference for trading models typically runs on a single CPU or modest GPU.',
    paidFor:  'Generating positive, risk-adjusted returns under strict drawdown limits over the evaluation window.',
    paidVia:  'Per-tempo emission, score × validator stake',
  },
  validator: {
    does:     'Streams market data, ingests miner signals, reconstructs portfolios, scores Omega and drawdown-adjusted return, and posts weights.',
    requires: 'Standard Bittensor validator stake plus reliable market data subscriptions across the supported asset classes.',
    output:   'A weight vector based on risk-adjusted portfolio performance per miner.',
    paidFor:  'Submitting weights that agree with consensus median',
    paidVia:  'Per-tempo emission, stake × consensus alignment',
  },

  scoring: {
    leadOneLine: 'Risk-adjusted portfolio score combining Omega ratio and total return under hard drawdown limits.',
    explanation: [
      'Vanta is explicit that raw P&L is not the scoring rule. Miners are evaluated on the Omega ratio (the probability-weighted ratio of gains above a threshold to losses below it), total portfolio return, and strict drawdown limits. A trader who triples capital with a 50% drawdown can score worse than one who delivers a steady 20% with low volatility. This wash-out of high-variance gamblers is the core mechanism difference versus naive return chasing.',
      'Because every signal is recorded on chain with a timestamp, validators can reconstruct any miner\'s portfolio from first principles and independent observers can audit the same data. This is the structural advantage over traditional prop firms — there is no "rule" hidden inside a CRM that lets the firm shave payouts. Hard drawdown caps disqualify positions that would otherwise pump short-term Omega, keeping the leaderboard honest.',
    ],
    cheatPath: 'Signals are signed and time-stamped on chain, so a miner cannot retroactively edit history to show a flattering equity curve. They cannot also juice short-term P&L with reckless leverage — hard drawdown limits disqualify miners who breach them. Look-ahead bias is impossible because validators evaluate signals against subsequent market data the miner does not control.',
  },

  customer: {
    leadOneLine: 'Prop-firm traders, allocators, and any platform that wants verifiable proof of trader skill.',
    explanation: [
      'The flagship product is Vanta Trading, launched 2026 — a decentralised prop-firm evaluation platform powered by SN8. Traders pay an entry fee to take a challenge; qualifying traders earn a 100% profit split with quarterly account scaling. The on-chain rules mean traders cannot be blocked from payouts by hidden CRM logic, which has been a major source of complaints against traditional prop firms.',
      'Beyond the prop-firm product, the on-chain track record itself is the asset — allocators can verify a trader\'s historical performance without trusting a screenshot, and downstream platforms can route capital to leaderboard winners. The customer base expands from individual traders to family offices, fund-of-funds, and quant platforms looking for a verifiable signal of who actually trades well.',
    ],
  },

  competitive: {
    scope: 'prop-firm and verifiable trading · 2026',
    rows: [
      { name: 'Vanta', subtitle: 'SN8', isSelf: true, approach: 'On-chain signal recording, risk-adjusted scoring, decentralised prop-firm evaluation with 100% profit split.', access: 'open · API', accessTone: 'open', differentiator: 'Verifiable on-chain track record + TAO emissions to top traders.' },
      { name: 'FTMO', subtitle: 'prop firm', approach: 'Traditional prop firm; traders pay a fee to take a challenge, scaled accounts after passing.', access: 'closed · KYC', accessTone: 'closed', differentiator: 'Opaque rules, 80/20 profit split, traders frequently report payout disputes.' },
      { name: 'MyForexFunds', subtitle: 'prop firm', approach: 'Forex-focused prop-firm with evaluation and scaling plans.', access: 'closed · KYC', accessTone: 'closed', differentiator: 'Centralised payouts, history of regulatory and operational issues.' },
      { name: 'Numerai', subtitle: 'quant signals', approach: 'Hedge-fund-style platform that aggregates encrypted signals from data scientists against US equities.', access: 'open · staking', accessTone: 'open', differentiator: 'Equities-only, stake-and-burn incentive, no prop-firm evaluation product.' },
      { name: 'eToro', subtitle: 'copy trading', approach: 'Retail brokerage with copy-trading; users follow popular traders\' positions.', access: 'open · KYC', accessTone: 'open', differentiator: 'Centralised, reputation-driven, no on-chain proof and not a payment-for-skill model.' },
    ],
    note: 'Vanta\'s edge is verifiability. Traditional prop firms operate as opaque CRM systems that can effectively grade their own homework; Vanta puts every signal on chain so the rules are auditable by anyone. Versus Numerai, Vanta is multi-asset and runs a customer-facing prop-firm product rather than a closed quant aggregator.',
  },

  team: {
    intro: [
      'Taoshi is a fintech startup founded in 2023 by Arrash Yasavolian, with ~15 years of tech and algorithmic trading background. Prior to Taoshi, Arrash developed TARVIS, an algorithmic trading program, and has been one of the more public Bittensor operator voices — speaking at Proof of Talk and across crypto-finance media.',
      'The Taoshi team blends machine-learning research with quantitative finance veterans. The pivot from "Proprietary Trading Network" to Vanta + the consumer Vanta Trading product reflects the team\'s thesis that decentralised, verifiable prop trading is a large and underserved market — traditional prop firms have grown to multi-billion-dollar businesses despite well-known payout and rule-transparency issues.',
    ],
    founders: [
      { initials: 'AY', gradient: 'v', name: 'Arrash Yasavolian', role: 'CEO & Founder', bio: 'Founder of Taoshi (2023). 15+ years in tech and algorithmic trading. Built TARVIS, an algorithmic trading program, before launching Vanta on Bittensor. Public face at Proof of Talk and across crypto-finance media.', twitter: 'https://x.com/arrash_t' },
    ],
    size: 'Small team (machine learning, data science, quant finance)',
    founded: '2023',
    based: 'United States (Taoshi, Inc.)',
    backers: 'Not publicly disclosed.',
    placeholder: false,
  },

  milestones: [
    { date: '2024', text: 'Subnet 8 launched as the Proprietary Trading Network (PTN).' },
    { date: '2025·Q4', text: 'Re-branded to Vanta; expanded to forex, crypto, and equities with formal risk-adjusted scoring.' },
    { date: '2026·02', text: 'Vanta Trading launched — decentralised prop-firm evaluation platform built on SN8.' },
  ],

  join: {
    title: 'Trade Vanta',
    body: 'Take the Vanta Trading challenge to earn a funded account, or fork taoshidev/vanta-network and submit signals directly as a Bittensor miner on SN8.',
    asideNote: 'Validators need standard SN8 stake plus reliable market data subscriptions for forex, crypto, and equities feeds.',
  },

  tags: ['trading', 'finance', 'prop-firm', 'risk-adjusted'],

  external: {
    github:   'https://github.com/taoshidev/vanta-network',
    website:  'https://www.vanta.trade/',
    twitter:  'https://x.com/taoshiio',
    taostats: 'https://taostats.io/subnets/8/',
  },
};
