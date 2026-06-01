import type { RichSubnet } from '../subnet-rich';

export const sn7: RichSubnet = {
  slug: '7-allways',
  netuid: 7,
  name: 'Allways',

  shortPitch: 'Trustless native cross-asset swaps with collateral-backed validator verification.',

  overview: [
    'Allways is Bittensor Subnet 7, operated by the Entrius team. The subnet acts as a verification layer that lets independent blockchains exchange native assets without wrapped tokens or custodial bridges. Miners take both sides of a swap, post collateral, and execute the legs on-chain; validators monitor and verify each transaction; a smart contract enforces the outcome by paying out completed swaps or slashing collateral on failure.',
    'The subnet uses the standard Bittensor topology of validator and miner slots, plus an external smart-contract layer that holds collateral and arbitrates swap outcomes. Miners post exchange rates and stake collateral; validators independently observe both source and destination chains and vote on whether the swap completed correctly. The scoring rule weighs successful completion, quoted-rate competitiveness, and validator consensus on each outcome.',
    'Outside Bittensor, the buyer is anyone who needs to move value between sovereign chains without trusting a bridge operator — Bittensor users moving between BTC and TAO is the live launch case, with a stated roadmap to "any verifiable asset". Allways positions itself against the well-documented failure mode of custodial bridges (multibillion-dollar hacks over the past five years) by replacing the bridge with collateral and consensus.',
    'Closest competitors are THORChain (native cross-chain swaps), Atomic Swap protocols, and centralised bridges. Allways differs by combining slashing-backed economic security with a Bittensor-native incentive layer that emits TAO to honest miners and validators on every tempo. <a href="#customer" style="color: var(--accent);">See competitive landscape ↓</a>',
  ],

  cycle: {
    challenge: { actor: 'Validator', title: 'Post swap request', body: 'A user submits a cross-asset swap request (e.g. BTC → TAO). Validators publish it to the miner pool; miners with sufficient collateral can claim it by posting an exchange rate.', dataK: 'payload', dataV: 'cross-asset swap order' },
    compute:   { actor: 'Miner',     title: 'Execute swap', body: 'The winning miner sends the destination asset to the user on chain A and receives the source asset on chain B, all bound by smart-contract collateral that slashes on default.', dataK: 'latency',  dataV: 'on-chain settlement on both legs' },
    score:     { actor: 'Validator', title: 'Verify completion', body: 'Validators independently observe both chains, confirm the swap completed against the quoted rate, and vote on the outcome. Successful completions pay the miner; defaults slash collateral.', dataK: 'scale',    dataV: 'verify · pay-or-slash on validator consensus' },
    settle:    { actor: 'Subtensor', title: 'Yuma → emission', body: "Every validator's weights, multiplied by their stake, aggregated by Yuma into one reward vector. TAO mints to top miners.", dataK: 'tempo', dataV: '~72 min · 24×/day' },
  },

  miner: {
    does:     'Acts as cross-chain market-maker — posts collateral, quotes exchange rates, and executes the two legs of a native asset swap on independent chains.',
    input:    'A swap request specifying source asset, destination asset, amount, and user address.',
    output:   'Two on-chain transactions completing the swap, plus collateral posted to the Allways smart contract.',
    hardware: 'Modest — running nodes for the supported chains (currently BTC and Bittensor) and enough liquidity to cover open swap commitments.',
    paidFor:  'Successfully completing swaps at competitive rates without forfeiting collateral.',
    paidVia:  'Per-tempo emission, score × validator stake',
  },
  validator: {
    does:     'Monitors both source and destination chains, verifies that miner swaps completed against the quoted rate, and votes on payout-or-slash outcomes.',
    requires: 'Standard Bittensor validator stake plus reliable RPC access to every supported chain to independently observe swap legs.',
    output:   'A weight vector reflecting per-miner swap success rate and rate competitiveness, plus on-chain votes on swap outcomes.',
    paidFor:  'Submitting weights that agree with consensus median',
    paidVia:  'Per-tempo emission, stake × consensus alignment',
  },

  scoring: {
    leadOneLine: 'Successful native-asset swap completion verified by validator consensus, with miner collateral slashed on default.',
    explanation: [
      'Scoring is anchored in observable on-chain events. Validators independently see both legs of a swap on the source and destination chains. Either the swap completed against the quoted rate by the deadline, or it did not. Miners earn emissions for successful, competitively-priced swaps and forfeit their collateral on failure — a clean, economic incentive structure that does not rely on subjective scoring.',
      'Within the set of successful swaps, the weight given to each miner is shaped by competitive pricing (better rates win more flow), collateral depth (deeper books take more orders), and consistent uptime over the round. The architecture is designed to extend to any verifiable asset pair — BTC ↔ TAO is the launch market, with stated plans to add additional chains.',
    ],
    cheatPath: 'A miner cannot quote a swap and skip out — failure to deliver the destination asset triggers slashing of the collateral posted to the smart contract. They cannot fabricate completion either — validators independently observe both chains via their own RPC, and consensus is required for payout. Quoting a deceptively bad rate is allowed but uncompetitive miners simply do not win flow and earn nothing.',
  },

  customer: {
    leadOneLine: 'Users and protocols that need to move native value between independent chains without trusting a bridge.',
    explanation: [
      'The launch customer is the Bittensor user who wants to move between BTC and TAO without sending funds through a custodial bridge or a wrapped-token pipeline. Cross-chain bridges have been one of crypto\'s most lucrative attack surfaces — multibillion-dollar hacks over the past five years (Ronin, Wormhole, Nomad, etc.) — so a slashing-secured, validator-verified alternative is a clear value proposition.',
      'Longer-term, the architecture extends to any pair of chains with deterministic finality. Protocols and aggregators can route swap flow through Allways instead of integrating bridges directly; market-makers can earn emissions on top of swap fees. The stated roadmap is to expand from BTC ↔ TAO to "any verifiable asset", positioning Allways as native cross-chain plumbing rather than a bridge replacement.',
    ],
  },

  competitive: {
    scope: 'native cross-chain asset swaps · 2026',
    rows: [
      { name: 'Allways', subtitle: 'SN7', isSelf: true, approach: 'Collateral-backed miners execute native swaps, validators verify on-chain, smart contract enforces payout-or-slash.', access: 'open · permissionless', accessTone: 'open', differentiator: 'TAO emission layer on top of slashing-secured swaps; no wrapped tokens.' },
      { name: 'THORChain', subtitle: 'native swaps', approach: 'Liquidity-pool-based native cross-chain swaps secured by bonded node operators on its own chain.', access: 'open · web', accessTone: 'open', differentiator: 'Mature liquidity but pool-based pricing exposes LPs to impermanent loss; standalone L1.' },
      { name: 'Custodial bridges', subtitle: 'Wormhole, Stargate, Across', approach: 'Locked-and-minted wrapped tokens secured by validator or guardian sets.', access: 'open · API', accessTone: 'open', differentiator: 'Wrapped tokens, not native assets; large historical attack surface; centralised guardians.' },
      { name: 'Atomic swaps', subtitle: 'HTLC protocols', approach: 'Hash time-locked contracts enabling trustless peer-to-peer swaps without intermediaries.', access: 'open · CLI', accessTone: 'open', differentiator: 'No payment layer for market-makers; poor UX; limited liquidity in practice.' },
      { name: 'Centralised exchanges', subtitle: 'CEX swap rails', approach: 'Custodial exchanges that handle deposit and withdrawal of native assets across chains.', access: 'closed · KYC', accessTone: 'closed', differentiator: 'KYC and custody required; opaque and frequently rug-prone for smaller assets.' },
    ],
    note: 'Allways\' differentiator is layering TAO emissions on top of slashing-secured, observable swaps. THORChain is the closest architectural analogue but runs on its own L1 and uses AMM pricing; bridges are the dominant incumbent but have a track record of catastrophic failures. The Bittensor incentive layer pays miners to compete on rate and reliability every tempo, which over time should produce tighter spreads on supported pairs.',
  },

  team: {
    intro: [
      'Allways is operated by the Entrius team, a small group focused on cross-chain primitives. The project is permissionless and open-source — the codebase lives at github.com/entrius/allways and the contributors do not custody or intermediate user funds at any point in the flow.',
      'The team\'s philosophy is explicitly minimalist: replace as much of the bridge stack as possible with collateral, smart contracts, and validator consensus, and lean on Bittensor\'s native incentive mechanism rather than building a separate token and chain. Public team details beyond the operator handle are limited.',
    ],
    founders: [
      { initials: 'EN', gradient: 'v', name: '[Entrius team]', role: 'Subnet operator', bio: 'Public operator handle for SN7 maintains the Allways protocol and the entrius/allways repository. Detailed founder identities are not publicly disclosed.' },
    ],
    size: 'Small (not publicly disclosed)',
    founded: '2024',
    based: 'Distributed (not publicly disclosed)',
    backers: 'Not publicly disclosed.',
    placeholder: true,
  },

  milestones: [
    { date: '2024', text: 'Subnet 7 registered; Allways protocol design published.' },
    { date: '2025', text: 'Beta launch of BTC ↔ TAO native swaps; smart-contract collateral and slashing live on mainnet.' },
    { date: '2026', text: 'Continued expansion of supported asset pairs and validator tooling.' },
  ],

  join: {
    title: 'Run an Allways swap miner',
    body: 'Fork entrius/allways, register a Bittensor miner on SN7, stand up nodes for the supported chains, post collateral to the smart contract, and start quoting swaps.',
    asideNote: 'Validators need standard SN7 stake plus reliable RPC access to every supported chain so they can independently confirm swap legs.',
  },

  tags: ['cross-chain', 'swaps', 'bridges', 'defi'],

  external: {
    github:   'https://github.com/entrius/allways',
    website:  'https://allways.io/',
    taostats: 'https://taostats.io/subnets/7/',
  },
};
