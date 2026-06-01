import type { RichSubnet } from '../subnet-rich';

export const sn77: RichSubnet = {
  slug: '77-liquidity',
  netuid: 77,
  name: 'Liquidity',
  shortPitch: 'Rewards on-chain liquidity provided to TAO and alpha pools on external DEXes.',
  overview: [
    'Liquidity is Bittensor subnet 77, built and operated by CreativeBuilds. It is an on-chain liquidity-mining system that bridges Bittensor incentives to external DeFi: TAO holders deploy capital into Uniswap V3 pools on Ethereum (and similar venues), and SN77 rewards them based on the liquidity they actually keep deployed.',
    'Architecturally it is a hybrid: an Ethereum-side smart-contract layer (a Subnet77LiquidityAuction.sol reward-pool contract plus a SeventySevenV1 helper that lets TAO holders vote on which pools should receive weight) coordinates with off-chain Bittensor validators who score miners on actual liquidity contribution and write weights into Yuma consensus.',
    'The customer is the Bittensor ecosystem itself: subnet alpha tokens and TAO need deep external liquidity to be tradable at reasonable slippage. SN77 turns that ecosystem need into a paid mining task — and lets TAO holders direct emission toward the specific pools they want bootstrapped.',
    'One-line diff: it is Curve / Convex-style gauge voting plus liquidity mining, but run by a Bittensor subnet with TAO emission as the reward currency. <a href="#customer" style="color: var(--accent);">See competitive landscape ↓</a>',
  ],
  cycle: {
    challenge: { actor: 'Validator', title: 'Vote + tally', body: 'TAO holders vote (via the helper contract) on which liquidity pools should receive reward weight. Validators tally votes and broadcast the active reward set.', dataK: 'payload', dataV: 'pool weights' },
    compute:   { actor: 'Miner',     title: 'Provide liquidity', body: 'Miner deploys capital into the selected Uniswap V3 / DEX pools and keeps it deployed across the measurement window.', dataK: 'unit',    dataV: 'liquidity (USD)' },
    score:     { actor: 'Validator', title: 'Score deployed LP', body: 'Validators read on-chain LP positions, score miners by amount × time × pool weight, and write Bittensor weights accordingly.', dataK: 'metric',  dataV: 'LP × time × weight' },
    settle:    { actor: 'Subtensor', title: 'Yuma → emission', body: "Every validator's weights, multiplied by their stake, aggregated by Yuma into one reward vector. TAO mints to top miners.", dataK: 'tempo', dataV: '~72 min · 24×/day' },
  },
  miner: {
    does: 'Provides on-chain liquidity to the pools selected by TAO-holder votes and keeps that liquidity deployed across measurement windows.',
    input: 'Active reward set (pools + weights) published by validators after each vote tally.',
    output: 'LP positions on Uniswap V3 / DEXes that are verifiable on-chain.',
    hardware: 'No GPU. The "capital" is the resource — miners need stablecoin / ETH / TAO liquidity and a Web3 stack to manage positions.',
    paidFor: 'Maintaining the largest weighted (pool × time) LP contribution across the cycle.',
    paidVia: 'Per-tempo emission, score × validator stake',
  },
  validator: {
    does: 'Reads on-chain LP positions across the active reward set, scores miners by liquidity × time × pool weight, and writes weights on-chain.',
    requires: 'Reliable Ethereum / DEX RPC access plus min-stake to register as a Bittensor validator.',
    output: 'Per-miner weight vector ranking liquidity contribution.',
    paidFor: 'Submitting weights that agree with consensus median',
    paidVia: 'Per-tempo emission, stake × consensus alignment',
  },
  scoring: {
    leadOneLine: 'Liquidity × time × pool-weight: how much you provided, where, and for how long.',
    explanation: [
      'The Ethereum-side contracts hold the canonical record of miner LP positions; validators query them and apply the active weight schedule chosen by TAO-holder votes. The longer and larger a miner\'s liquidity sits in a high-weight pool, the higher their Bittensor score in that cycle.',
      'The voting layer is what makes this a directed liquidity market rather than passive mining: TAO holders effectively decide which alpha pools (and which DEX venues) should be bootstrapped first, and the miner network responds to that signal cycle-over-cycle.',
    ],
    cheatPath: 'The standard attacks are flash-deposit LP that gets withdrawn just after the score snapshot, or wash-LP between miner-controlled accounts. The intended counter is time-weighted scoring across the full window plus on-chain position auditing; the residual surface is sophisticated MEV / JIT-liquidity patterns that maximise scored-snapshot capital without contributing useful liquidity.',
  },
  customer: {
    leadOneLine: 'The Bittensor ecosystem itself: alpha tokens and TAO need deep external liquidity to trade at reasonable slippage.',
    explanation: [
      'There is no traditional B2B buyer. Instead, SN77 is a programmable bootstrapping mechanism for ecosystem liquidity. Subnet operators who need their alpha pool to deepen can lobby TAO holders to weight their pool; TAO holders allocate emission to where they believe the marginal liquidity matters most.',
      'Downstream beneficiaries include every Bittensor user who trades subnet tokens — and TAO\'s presence on external venues like Uniswap, which gains depth without a centralized market-maker mandate.',
    ],
  },
  competitive: {
    scope: 'incentivised liquidity / gauge markets · 2026',
    rows: [
      { name: 'Liquidity', subtitle: 'SN77', isSelf: true, approach: 'TAO-holder votes weight specific DEX pools; miners earn TAO emission proportional to liquidity × time × pool weight.', access: 'open · on-chain contracts', accessTone: 'open', differentiator: 'Bittensor emission-funded liquidity mining with on-chain gauge votes from TAO holders.' },
      { name: 'Curve / Convex gauge votes', approach: 'CRV/CVX-weighted gauge voting that directs CRV emissions to chosen Curve pools.', access: 'open · on-chain contracts', accessTone: 'open', differentiator: 'Largest gauge-vote system; tied to CRV / Curve\'s ve-token economy rather than Bittensor.' },
      { name: 'Uniswap LP staking programs', approach: 'Project-funded liquidity-mining programs that emit a project token to Uniswap V3 LPs.', access: 'open · per-project', accessTone: 'open', differentiator: 'Project-funded and ad-hoc; no shared gauge layer across many tokens.' },
      { name: 'Centralized market makers (Wintermute, GSR)', approach: 'Off-chain market making services contracted by projects to provide CEX / DEX liquidity.', access: 'closed · enterprise contract', accessTone: 'closed', differentiator: 'Professional MM execution but private, paid, and not on-chain transparent.' },
      { name: 'Balancer ve8020 / Aerodrome', approach: 've-token gauge systems on Balancer and Aerodrome that direct emissions toward whitelisted pools.', access: 'open · on-chain contracts', accessTone: 'open', differentiator: 'Similar gauge UX but funded by their own protocol emissions, not Bittensor TAO.' },
    ],
    note: 'SN77\'s wedge is funding the liquidity mining out of TAO emission and letting TAO holders direct that emission via on-chain votes. The trade-off vs Curve / Aerodrome is mature DEX integration and protocol-native demand; the trade-off vs paid MMs is execution quality and CEX coverage.',
  },
  team: {
    intro: [
      'Subnet 77 is built and operated by CreativeBuilds, a single-operator project running a complete on-chain liquidity-mining system for the Bittensor ecosystem. The codebase is fully open-source under MIT (github.com/CreativeBuilds/sn77), and the operator runs a coordination server at 77.creativebuilds.io that handles vote collection, weight calculation, and validator integration.',
      'CreativeBuilds\' thesis is that subnet alpha and TAO liquidity is a coordination problem TAO holders should solve themselves, and the cleanest way to solve it is gauge voting with on-chain proof of LP and Bittensor emission as the reward currency.',
    ],
    founders: [
      { initials: 'CB', gradient: 'v', name: 'CreativeBuilds', role: 'Operator · SN77 Liquidity', bio: 'Pseudonymous developer behind subnet 77; author of the open-source CreativeBuilds/sn77 stack and operator of the coordination server at 77.creativebuilds.io.', github: 'https://github.com/CreativeBuilds' },
    ],
    size: 'Solo operator + community', founded: '2025', based: 'Not publicly disclosed.',
    backers: 'Not publicly disclosed.',
    placeholder: false,
  },
  milestones: [
    { date: '2025·Q1', text: 'Subnet 77 registered as Liquidity by CreativeBuilds.' },
    { date: '2025·Q2', text: 'On-chain reward contracts (Subnet77LiquidityAuction.sol + SeventySevenV1) deployed.' },
    { date: '2025·Q3', text: 'Gauge-voting flow live for TAO holders to direct emission toward specific pools.' },
  ],
  join: {
    title: 'Earn TAO by providing liquidity',
    body: 'TAO holders vote on pool weights via the SN77 stack; miners deploy LP into the active reward set on Uniswap V3 / supported DEXes. Code at github.com/CreativeBuilds/sn77.',
    asideNote: 'Mining is capital-based, not GPU-based. Live network state on taostats.io/subnets/77/.',
  },
  tags: ['liquidity', 'DeFi', 'gauge voting', 'Uniswap', 'on-chain'],
  external: {
    github: 'https://github.com/CreativeBuilds/sn77',
    website: 'https://77.creativebuilds.io',
    taostats: 'https://taostats.io/subnets/77/',
  },
};
