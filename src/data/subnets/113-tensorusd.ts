import type { RichSubnet } from '../subnet-rich';

export const sn113: RichSubnet = {
  slug: '113-tensorusd',
  netuid: 113,
  name: 'TensorUSD',
  shortPitch: 'Reserve-backed native USD stablecoin for the Bittensor ecosystem.',
  overview: [
    'TensorUSD (SN113) is a reserve-backed native stablecoin designed to support 1:1 USD redeemability inside the Bittensor ecosystem. The subnet operates the on-chain plumbing — collateralized vaults, a decentralized liquidation auction, and a price oracle for TAO/USD — that keeps the peg honest. Miners earn TAO by participating in liquidations and oracle submissions.',
    'Mechanism 0 is the liquidation auction. When a vault\'s collateral ratio drops below the threshold, miners monitor the contracts, compute profitability, and bid to liquidate. Whoever submits the winning bid earns the auction surplus plus subnet emission. This is the keeper market that backstops the peg under stress.',
    'Mechanism 1 is the price oracle. Miners submit TAO/USD price data sourced from CoinMarketCap and other feeds; validators listen to on-chain events, score accuracy versus consensus, and distribute rewards. A robust oracle is the precondition for safe liquidations and mint-redeem flows.',
    'The competitive context is every other stablecoin design — Maker/Sky, Liquity, Frax — adapted to a Bittensor-native context where TAO is the volatile collateral and the keeper market is incentivized through subnet emission. <a href="#customer" style="color: var(--accent);">See competitive landscape ↓</a>',
  ],
  cycle: {
    challenge: {
      actor: 'Validator',
      title: 'Watch on-chain events',
      body: 'Validators listen for vault state changes, oracle submissions, and liquidation auction events emitted by the TensorUSD contracts.',
      dataK: 'payload',
      dataV: 'vault + oracle + auction events',
    },
    compute: {
      actor: 'Miner',
      title: 'Liquidate or quote price',
      body: 'Miners monitor vaults and bid in liquidation auctions when profitable; in parallel submit TAO/USD price quotes to the oracle.',
      dataK: 'latency',
      dataV: 'per-block opportunity window',
    },
    score: {
      actor: 'Validator',
      title: 'Verify + weight',
      body: 'Validators verify auction wins and price accuracy, score miners on profitable participation and oracle agreement, and submit weights.',
      dataK: 'scale',
      dataV: 'auction PnL + oracle agreement',
    },
    settle: {
      actor: 'Subtensor',
      title: 'Yuma → emission',
      body: "Every validator's weights, multiplied by their stake, aggregated by Yuma into one reward vector. TAO mints to top miners.",
      dataK: 'tempo',
      dataV: '~72 min · 24×/day',
    },
  },
  miner: {
    does: 'Runs a keeper bot: monitors vault collateralization, bids in liquidation auctions, and submits TAO/USD oracle quotes.',
    input: 'On-chain state (vaults, oracle, auction contracts) plus external price feeds (CoinMarketCap, exchange APIs).',
    output: 'Liquidation bids on undercollateralized vaults and periodic oracle price submissions.',
    hardware: 'Server with reliable chain RPC, price-feed integrations, custody for bid capital, and Alembic-managed DB.',
    paidFor: 'Profitable liquidation participation and accurate oracle quotes that agree with consensus',
    paidVia: 'Per-tempo emission, score × validator stake',
  },
  validator: {
    does: 'Listens to TensorUSD contract events, verifies miner participation and oracle accuracy, sets reward weights.',
    requires: 'Chain RPC, event indexer, scoring binary, and ability to cross-check oracle submissions against reference feeds.',
    output: 'Per-miner weight vector based on realized auction outcomes and oracle agreement.',
    paidFor: 'Submitting weights that agree with consensus median',
    paidVia: 'Per-tempo emission, stake × consensus alignment',
  },
  scoring: {
    leadOneLine: 'Win liquidations profitably and quote prices that match consensus — both are auditable on chain.',
    explanation: [
      'Liquidation scoring is straightforward: the contract records who won which auction and at what surplus. Validators read those events, sum each miner\'s realized PnL across the epoch, and translate that into weight. Miners who bid aggressively but unprofitably get punished; miners who miss profitable liquidations get nothing.',
      'Oracle scoring rewards quotes that agree with the consensus median across all submitters, with outliers penalized. Because every submission is signed and on-chain, validators just need to read events and run the deterministic score. The oracle keeps liquidations honest, and liquidations keep the peg honest — the two mechanisms reinforce each other.',
    ],
    cheatPath: 'Submitting fake oracle prices or unprofitable phantom bids — both show up on chain and are filtered immediately.',
  },
  customer: {
    leadOneLine: 'Bittensor users, DEXs, and subnet treasuries that need a TAO-native USD-pegged unit of account.',
    explanation: [
      'TensorUSD\'s primary buyers are anyone holding or transacting in TAO who wants a stable unit of account inside the Bittensor ecosystem — paying for compute, settling subnet revenue, or just parking value without leaving the ecosystem. Subnet treasuries that earn TAO emission can mint TensorUSD against it for operational expenses.',
      'Secondary buyers are DEXs and the swap subnets that need a USD-pegged base pair to quote prices and provide liquidity. The peg only holds if mint, redemption, and liquidation all work — which is exactly what SN113\'s incentive mechanism funds. The closer Bittensor-native DeFi gets to mature, the more demand there is for a Bittensor-native stable.',
    ],
  },
  competitive: {
    scope: '2026 · TAO-native stablecoins',
    rows: [
      { name: 'TensorUSD', subtitle: 'SN113', isSelf: true, approach: 'Reserve-backed native USD stable with subnet-incentivized liquidations and oracle', access: 'open · contracts', accessTone: 'open', differentiator: 'Native to Bittensor; emission funds keepers and oracle' },
      { name: 'MakerDAO / Sky USDS', approach: 'Ethereum-native CDP stablecoin with mature oracle and keeper infrastructure', access: 'open · contracts', accessTone: 'open', differentiator: 'Ethereum-native; not embedded in Bittensor' },
      { name: 'Liquity', approach: 'ETH-collateralized stable with permissionless minimum-fee liquidations', access: 'open · contracts', accessTone: 'open', differentiator: 'No incentive layer for keepers beyond gas + liquidation profit' },
      { name: 'Frax', approach: 'Fractional-algorithmic stable with multiple collateral types', access: 'open · contracts', accessTone: 'open', differentiator: 'Hybrid design; complex governance surface' },
      { name: 'USDC / USDT bridged', approach: 'Bridged fiat-backed stables imported into Bittensor via cross-chain bridges', access: 'closed · issuer', accessTone: 'closed', differentiator: 'Centralized issuer risk; not native; bridge risk' },
    ],
    note: 'Inside Bittensor, TensorUSD\'s wedge is being native — no bridge risk, no off-chain custody, and the keeper market is funded by subnet emission rather than relying on external arb desks showing up. The hard part is bootstrapping enough collateral and DEX liquidity for the peg to be useful at scale.',
  },
  team: {
    intro: [
      'TensorUSD is operated through the TensorUSD GitHub organization. The repository is primarily Python (95.8%) with supporting shell scripts. Team identities are not published on the repo or any public site as of May 2026.',
      'The team operates the contracts (vault, oracle, auction, token), the validator/miner reference clients, and the database migrations that index on-chain state for scoring.',
    ],
    founders: [
      { initials: 'TU', gradient: 'g', name: '[Founder 1 name]', role: 'Operator', bio: 'Operator team behind TensorUSD subnet 113; identities not publicly disclosed as of May 2026.' },
    ],
    size: 'Not publicly disclosed.',
    founded: '2025',
    based: 'Distributed',
    backers: 'Not publicly disclosed.',
    placeholder: true,
  },
  milestones: [
    { date: '2025', text: 'Subnet 113 registered for TensorUSD stablecoin.' },
    { date: '2025·Q4', text: 'Liquidation auction and oracle mechanisms ship to mainnet.' },
    { date: '2026', text: 'Integrations with TAO-native DEX liquidity in progress.' },
  ],
  join: {
    title: 'Run a keeper or hold the native stable',
    body: 'If you can run a chain-aware keeper bot — monitor vaults, bid liquidations, quote oracle prices — you can mine SN113 and earn from realized auction profit plus emission. If you just need a Bittensor-native USD unit, mint or hold TensorUSD.',
    asideNote: 'Liquidations and oracle quotes are scored deterministically from on-chain events — fake bids do not score.',
  },
  tags: ['stablecoin', 'defi', 'oracle', 'liquidation'],
  external: {
    github: 'https://github.com/TensorUSD/subnet',
    taostats: 'https://taostats.io/subnets/113/',
  },
  tweets: [],
};
