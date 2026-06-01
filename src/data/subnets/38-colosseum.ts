import type { RichSubnet } from '../subnet-rich';

export const sn38: RichSubnet = {
  slug: '38-colosseum',
  netuid: 38,
  name: 'TAO Colosseum',
  shortPitch: 'P2P Red-vs-Blue betting game on Bittensor EVM with underdog payouts.',
  overview: [
    'TAO Colosseum is a Bittensor subnet that incentivizes participation in a decentralized P2P betting protocol deployed on Bittensor EVM. The network is operated as a smart-contract-driven game where every miner is also a bettor: miners place native TAO bets directly on the Colosseum contract, and the subnet rewards betting activity rather than off-chain inference.',
    'Validators query the Colosseum smart contract for each miner\'s betting volume over a rolling 7-day window, apply a time-decay function, and set weights accordingly. Subtensor then aggregates those weights via Yuma so emission flows toward the most active and consistent bettors.',
    'The customer is a degen — the same audience that already plays Polymarket, sports books, and on-chain prediction games — plus liquidity providers who want exposure to a high-velocity onchain casino settled in TAO. The flagship game is "Underdog": every ~100 blocks (~20 minutes) the minority side (Red or Blue, whichever attracted less stake) wins and splits the pool, with a 1.5% platform fee.',
    'Differentiator: a casino whose house edge is paid in Bittensor emission, not user fees, plus the underdog mechanic that rewards contrarian flow. <a href="#customer" style="color: var(--accent);">See competitive landscape ↓</a>',
  ],
  cycle: {
    challenge: { actor: 'Validator', title: 'Open round', body: 'A new ~100-block round opens on the Colosseum contract; validators index the open Red/Blue pools.', dataK: 'payload', dataV: 'round id + sides' },
    compute:   { actor: 'Miner',     title: 'Place bet', body: 'Miners stake native TAO on Red or Blue via the smart contract on Bittensor EVM.', dataK: 'latency',  dataV: '~20 min/round' },
    score:     { actor: 'Validator', title: 'Tally volume', body: 'Validators read each miner\'s 7-day time-decayed betting volume from the contract and commit weights.', dataK: 'scale',    dataV: '7-day decay window' },
    settle:    { actor: 'Subtensor', title: 'Yuma → emission', body: "Every validator's weights, multiplied by their stake, aggregated by Yuma into one reward vector. TAO mints to top miners.", dataK: 'tempo', dataV: '~72 min · 24×/day' },
  },
  miner:     { does: 'Bets native TAO on Red or Blue in the Colosseum game contract.', input: 'On-chain round state from the Colosseum smart contract.', output: 'Verifiable bets recorded on Bittensor EVM.', hardware: 'Any host that can sign EVM transactions; no GPU.', paidFor: 'Time-decayed betting volume over the trailing 7 days.', paidVia: 'Per-tempo emission, score × validator stake' },
  validator: { does: 'Reads betting volume from the Colosseum contract and assigns miner weights.', requires: 'Subtensor + Bittensor EVM RPC access.', output: 'Per-miner weight vector based on decayed volume.', paidFor: 'Submitting weights that agree with consensus median', paidVia: 'Per-tempo emission, stake × consensus alignment' },
  scoring:   { leadOneLine: 'Score = time-decayed TAO bet volume in the rolling 7-day window.', explanation: [
    'Every bet placed on the smart contract counts toward a miner\'s score, weighted by an exponential decay so recent activity dominates and stale activity fades out. There is no off-chain inference to verify — the truth is the contract.',
    'Because the contract publishes a 1.5% platform fee and an underdog payout rule, miners must actually risk capital. Bettors lose stake on the majority side, so the metagame is a real prediction-market problem, not free farming.',
  ], cheatPath: 'Sybil wash-trading is bounded by the platform fee and underdog losses — round-trip volume burns real TAO every cycle.' },
  customer:  { leadOneLine: 'Crypto-native bettors, prediction-market traders, and TAO holders looking for on-chain entertainment.', explanation: [
    'TAO Colosseum sits in the same neighborhood as Polymarket and on-chain casinos but with two differences: bets are native-TAO and resolved on Bittensor EVM, and the platform is partially subsidized by subnet emission, which lets it run thin user fees.',
    'For TAO holders specifically, it is a way to circulate the asset inside the ecosystem instead of bridging out — the underdog mechanic also keeps single-block whale dominance in check, giving small bettors a reason to show up.',
  ] },
  competitive: { scope: '2026 · onchain betting', rows: [
    { name: 'TAO Colosseum', subtitle: 'SN38', isSelf: true, approach: 'TAO-native P2P betting game with underdog payouts on Bittensor EVM.', access: 'open · contract', accessTone: 'open', differentiator: 'Subnet emission subsidizes miner volume; underdog rule blunts whales.' },
    { name: 'Polymarket', approach: 'USDC prediction markets on Polygon.', access: 'open · web', accessTone: 'open', differentiator: 'Deep liquidity and real-world events, but no token incentives for bettors.' },
    { name: 'Azuro / Overtime', approach: 'On-chain sportsbook protocols with shared liquidity pools.', access: 'open', accessTone: 'open', differentiator: 'Sports-specific; not native to TAO.' },
    { name: 'Rollbit / on-chain casinos', approach: 'Centralized or semi-on-chain casino UX.', access: 'open · custodial', accessTone: 'closed', differentiator: 'House-takes-all model, no subsidy from token issuance.' },
    { name: 'Bettensor (SN30)', approach: 'Bittensor sports prediction oracle.', access: 'open', accessTone: 'open', differentiator: 'Different subnet; prediction signal vs P2P betting game.' },
  ], note: 'TAO Colosseum is unusual: the "miner" is the bettor, and the subnet emission acts as a marketing budget. The competitive question is whether sustained TAO emission can outpay the underdog losses that volume miners absorb.' },
  team: { intro: [
    'The subnet is run by the TAO-Colosseum GitHub organization, which maintains both the miner/validator code and the Solidity contracts under taocolosseum.com and casinotao.com. Public founder identities are limited.',
    'The project ships a Solidity smart contract on Bittensor EVM, an indexer, and a web frontend at taocolosseum.com — making it one of the more EVM-forward subnets on Bittensor.',
  ], founders: [
    { initials: 'TC', gradient: 'a', name: '[Founder 1 name]', role: 'Project lead', bio: 'TAO Colosseum maintainer; identity not publicly disclosed.' },
  ], size: 'Small core team', founded: '2024', based: 'Not publicly disclosed.', backers: 'Not publicly disclosed.', placeholder: true },
  milestones: [
    { date: '2024', text: 'TAO Colosseum subnet launched on Bittensor EVM with Red-vs-Blue betting contract.' },
  ],
  join: { title: 'Bet to mine', body: 'Connect a wallet with native TAO, register as a miner, and place bets each round. Validators only need an EVM RPC endpoint and the subnet node.', asideNote: 'Underdog losses are real — model the EV before scaling volume.' },
  tags: ['gaming', 'evm', 'betting', 'prediction-markets'],
  external: { github: 'https://github.com/TAO-Colosseum/tao-colosseum-subnet', website: 'https://www.taocolosseum.com/', taostats: 'https://taostats.io/subnets/38/' },
  tweets: [],
};
