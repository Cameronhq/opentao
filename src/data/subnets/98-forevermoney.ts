import type { RichSubnet } from '../subnet-rich';
export const sn98: RichSubnet = {
  slug: '98-forevermoney', netuid: 98, name: 'ForeverMoney',
  shortPitch: 'On-chain market-making subnet where AI quant teams compete to manage Uniswap V3 / Aerodrome liquidity.',
  overview: [
    'ForeverMoney 九八 (SN98) is a Bittensor subnet that optimizes Uniswap V3 and Aerodrome liquidity provision through competitive AI strategies. Independent quant teams (the miners) propose dynamic rebalancing decisions for subnet-controlled liquidity vaults on Base L2; validators evaluate strategies via forward simulations; winning strategies get executed on-chain.',
    'The system has four layers working together: on-chain Bittensor logic (coordinating agents and rewards), off-chain strategy bots (miners) and validator nodes that simulate-and-score, plus smart-contract vaults and executor contracts on Base L2 that actually hold and rebalance the LP positions. Real capital, real PnL, real on-chain settlement — not a paper simulation.',
    'The team registered as SN98 in late 2025 and ran a gated alpha through December 2025 for early community members holding minimum SN98 token balances. Public materials are intentionally cryptic ahead of full launch — the team behind the @philism_ X handle has indicated they iterated internally for months to find a defensible use-case before going public.',
    'ForeverMoney is closely connected to the CreatorBid ecosystem and Phil\'s SONAR project around attention, reputation, and value distribution. The 2026 roadmap targets $1B TVL managed through the protocol — an ambitious anchor metric. <a href="#customer" style="color: var(--accent);">See competitive landscape ↓</a>',
  ],
  cycle: {
    challenge: { actor: 'Validator', title: 'Market state', body: 'Validator publishes current pool state, price action, and rebalancing decision required for the active LP positions.', dataK: 'payload', dataV: 'pool state + price' },
    compute:   { actor: 'Miner',     title: 'Propose rebalance', body: 'Miner runs its quant strategy and proposes a rebalancing action — tick range, liquidity amount, fee tier.', dataK: 'latency',  dataV: 'strategy decision' },
    score:     { actor: 'Validator', title: 'Forward-simulate PnL', body: 'Validators forward-simulate proposed strategies against realized price action and score by realized PnL minus gas / IL.', dataK: 'scale',    dataV: 'simulated PnL' },
    settle:    { actor: 'Subtensor', title: 'Yuma → emission', body: "Every validator's weights, multiplied by their stake, aggregated by Yuma into one reward vector. TAO mints to top miners.", dataK: 'tempo', dataV: '~72 min · 24×/day' },
  },
  miner:     { does: 'Runs quant strategies that propose Uniswap V3 / Aerodrome LP rebalancing decisions for subnet-controlled vaults.', input: 'Pool state, price feeds, position context', output: 'Rebalancing decision (tick range, size, fee tier)', hardware: 'Quant-grade compute — modest CPU sufficient, market-data feeds critical', paidFor: 'Realized PnL after gas and impermanent loss on managed vault capital', paidVia: 'Per-tempo emission, score × validator stake' },
  validator: { does: 'Publishes market state, forward-simulates miner proposals, scores by realized PnL on the executed strategy.', requires: 'Price feeds + simulation engine + on-chain executor for winning strategies', output: 'Per-miner weights tied to simulated and realized PnL', paidFor: 'Submitting weights that agree with consensus median', paidVia: 'Per-tempo emission, stake × consensus alignment' },
  scoring:   {
    leadOneLine: 'Realized PnL on real vault capital, net of gas and impermanent loss.',
    explanation: [
      'Validators forward-simulate each miner\'s proposed rebalance against realized price action, computing simulated PnL net of swap fees, gas, and impermanent loss vs. holding. Winning strategies get actually executed on-chain through the subnet\'s Base L2 vaults — so the leaderboard tracks both simulated and realized outcomes over time.',
      'This is one of the few Bittensor subnets where miner reward is tied directly to dollar-denominated PnL on real on-chain capital. Cheating becomes economically aligned: gaming the simulator hurts your real vault performance, which validators measure independently.',
    ],
    cheatPath: 'Overfitting to validator-simulator quirks — fails because winning strategies actually execute on-chain, and real PnL diverges from simulator PnL exposes the overfit.',
  },
  customer:  {
    leadOneLine: 'LPs and DeFi protocols that want algorithmic Uniswap V3 / Aerodrome liquidity management, paid for by strategy performance.',
    explanation: [
      'The direct customer is anyone allocating capital into the subnet-controlled vaults — yield-seeking LPs, treasuries, or DeFi-native funds — who get programmatic LP management without picking a single quant team. Multiple strategies compete, the protocol routes capital to winners.',
      'Direct comps are Arrakis Finance, Gamma Strategies, and Steer Protocol — existing concentrated-liquidity managers — plus the open Uniswap V4 hooks ecosystem. ForeverMoney\'s differentiator is permissionless quant supply: any strategy can enter the competition, vs. closed managed-vault models.',
    ],
  },
  competitive: { scope: '2026 · automated concentrated-liquidity management', rows: [
    { name: 'ForeverMoney', subtitle: 'SN98', isSelf: true, approach: 'Permissionless AI quant competition, on-chain execution Base L2', access: 'open · API', accessTone: 'open', differentiator: 'Real PnL scoring, $1B TVL target, CreatorBid/SONAR ecosystem ties' },
    { name: 'Arrakis Finance', approach: 'Algorithmic Uniswap V3 vault management', access: 'closed · DAO', accessTone: 'closed', differentiator: 'Established TVL, single managed strategy per vault' },
    { name: 'Gamma Strategies', approach: 'Active Uniswap V3 LP management vaults', access: 'closed · DAO', accessTone: 'closed', differentiator: 'Multi-pool, established LP partner network' },
    { name: 'Steer Protocol', approach: 'Multi-chain concentrated-liquidity strategy marketplace', access: 'open · API', accessTone: 'open', differentiator: 'Multi-strategy marketplace but no on-chain incentive layer' },
    { name: 'Uniswap V4 hooks', approach: 'Native protocol-level liquidity customization', access: 'open · on-chain', accessTone: 'open', differentiator: 'Protocol-level, not a hosted strategy network' },
  ], note: 'ForeverMoney\'s wedge is the combination of permissionless quant supply and on-chain incentive settlement — neither Arrakis nor Steer pays strategies in protocol-native tokens for verified PnL.' },
  team: {
    intro: [
      'ForeverMoney 九八 is operated by the team behind the @philism_ X handle, closely connected to the CreatorBid ecosystem and Phil\'s SONAR project around attention, reputation, and value distribution.',
      'The team iterated internally for roughly five months before public launch, going from silent build to active accelerator phase in late 2025. Specific full founder identities beyond Phil (@philism_) are not detailed in public materials.',
    ],
    founders: [{ initials: 'PH', gradient: 'v', name: 'Phil (@philism_)', role: 'Lead / co-founder', bio: 'Lead operator of ForeverMoney 九八, also associated with CreatorBid ecosystem and the SONAR project around attention and reputation.', twitter: 'https://x.com/philism_' }],
    size: 'Lean core team', founded: '2025 (registered as SN98 late 2025)', based: 'Not publicly disclosed', backers: 'Connected to CreatorBid ecosystem.',
  },
  milestones: [
    { date: '2025', text: 'Project iterated internally for ~5 months before going public.' },
    { date: '2025·Q4', text: 'Officially registered as Bittensor Subnet 98.' },
    { date: '2025·12', text: 'Gated alpha launched for community members holding minimum SN98 token balances.' },
    { date: '2026', text: 'Roadmap target: $1B TVL managed through the protocol.' },
  ],
  join: { title: 'Race quant strategies for real PnL', body: 'Quant teams can deploy LP rebalancing strategies and earn TAO emissions tied to realized on-chain PnL. Validators forward-simulate strategies and execute winners on Base L2. LPs can allocate capital into managed vaults once mainnet opens broadly.', asideNote: 'Real on-chain capital and real PnL — strategies face actual gas and impermanent loss. Backtest assumptions matter more here than in pure-AI subnets.' },
  tags: ['defi', 'liquidity-management', 'quant', 'base-l2'],
  external: { github: 'https://github.com/SN98-ForeverMoney', website: 'https://forevermoney.ai/', twitter: 'https://x.com/forevermoney_ai', taostats: 'https://taostats.io/subnets/98/' },
  tweets: [],
};
