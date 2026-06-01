import type { RichSubnet } from '../subnet-rich';

export const sn89: RichSubnet = {
  slug: '89-infinitehash',
  netuid: 89,
  name: 'InfiniteHash',
  shortPitch: 'Bitcoin mining pool that pays in TAO and burns the BTC.',
  overview: [
    'InfiniteHash is Bittensor Subnet 89, a Bitcoin mining pool integrated into the Bittensor blockchain. SHA-256 miners contribute hashrate to mine BTC blocks the usual way, but instead of receiving BTC payouts directly they earn the subnet\'s Alpha tokens proportional to the hashpower they contributed.',
    'The unique twist is the buyback-and-burn loop: 100% of the BTC the pool earns is used to buy InfiniteHash\'s own Alpha tokens on the market and then burn them. This converts real Bitcoin cashflows into permanent supply reduction of the subnet token, creating a continuous demand-side bid while the network mines BTC.',
    'Operationally, miners point their SHA-256 hardware at the InfiniteHash stratum (e.g., stratum+tcp://btc.global.luxor.tech:700 or a regional endpoint), retain custody of their machines, and receive liquid TAO-denominated rewards instead of BTC. The subnet also includes a Lightning Network economy layer aimed at AI applications.',
    'One-line diff: a SHA-256 mining pool where the protocol token is TAO and the BTC revenue is recycled into token burns. <a href="#customer" style="color: var(--accent);">See competitive landscape ↓</a>',
  ],
  cycle: {
    challenge: { actor: 'Validator', title: 'Issue stratum work', body: 'Validators (via the pool) distribute SHA-256 stratum jobs to participating miners so that real Bitcoin proof-of-work also serves as the on-chain contribution metric for the subnet.', dataK: 'payload', dataV: 'BTC stratum job' },
    compute:   { actor: 'Miner',     title: 'Hash + submit shares', body: 'SHA-256 miners hash the stratum jobs with their ASICs and stream accepted shares back to the pool, which credits both the underlying BTC reward and the on-chain Bittensor contribution counters.', dataK: 'latency',  dataV: 'share rate · TH/s' },
    score:     { actor: 'Validator', title: 'Score by hashrate', body: 'Validators tally accepted SHA-256 shares per miner over the tempo window, convert hashrate into a weight vector, and the BTC earned is converted to buy back and burn Alpha tokens.', dataK: 'scale',    dataV: 'shares × difficulty' },
    settle:    { actor: 'Subtensor', title: 'Yuma → emission', body: "Every validator's weights, multiplied by their stake, aggregated by Yuma into one reward vector. TAO mints to top miners.", dataK: 'tempo', dataV: '~72 min · 24×/day' },
  },
  miner: {
    does: 'Operates standard Bitcoin SHA-256 ASICs and points them at the InfiniteHash stratum to contribute hashpower to the pool in exchange for TAO-denominated Alpha rewards.',
    input: 'SHA-256 stratum work from the pool',
    output: 'Accepted SHA-256 shares + valid BTC block solutions',
    hardware: 'Standard Bitcoin ASIC hardware (Antminer S19/S21-class, WhatsMiner M50/M60-class) with stable network access',
    paidFor: 'Accepted SHA-256 shares contributed to the pool over the tempo',
    paidVia: 'Per-tempo emission, score × validator stake',
  },
  validator: {
    does: 'Operates the pool-side accounting that converts SHA-256 shares into Bittensor weights, oversees the BTC→Alpha buyback-and-burn pipeline, and submits a weight vector each tempo.',
    requires: 'Bittensor validator stake + pool infrastructure access and share auditing',
    output: 'Weight vector across miner hotkeys per tempo',
    paidFor: 'Submitting weights that agree with consensus median',
    paidVia: 'Per-tempo emission, stake × consensus alignment',
  },
  scoring: {
    leadOneLine: 'Real SHA-256 hashrate is the work — accepted shares over the tempo are the score.',
    explanation: [
      'There is no synthetic ML task: scoring is based on accepted Bitcoin SHA-256 shares contributed to the pool stratum, weighted by share difficulty. Validators aggregate per-miner shares over the tempo and submit weights proportional to hashpower; pool-level BTC block rewards are accrued by the pool itself.',
      'On the value side, the pool runs a continuous BTC→Alpha buyback-and-burn loop using all BTC revenue, which is the mechanism that translates real-world hashpower into protocol-token deflation. Governance is described as decentralized via a "Pool Senate" where each miner votes with their UID.',
    ],
    cheatPath: 'A miner cannot fake SHA-256 hashpower — shares are cryptographically verifiable proof of computation, and only shares that actually meet the network difficulty count. There is no GPU shortcut; only modern ASIC hardware is competitive on power-per-share, and the pool credits only verifiable submissions.',
  },
  customer: {
    leadOneLine: 'Existing Bitcoin SHA-256 miners who want TAO-denominated payouts and exposure to a deflationary protocol token.',
    explanation: [
      'The buyer outside Bittensor is the global SHA-256 mining community. InfiniteHash gives them an alternative to BTC-denominated PPS/PPLNS pools: same hardware, same stratum workflow, but payouts come in liquid Alpha tokens and the underlying BTC cashflows are recycled into a continuous buyback-and-burn of the same token miners are earning.',
      'A secondary angle is the Lightning Network layer the project is building on top, which positions InfiniteHash as more than a pool — it aims to be the settlement and payment economy for AI applications, with BTC as the reserve and Lightning as the rails.',
    ],
  },
  competitive: {
    scope: 'Bitcoin SHA-256 mining pools · 2026',
    rows: [
      { name: 'InfiniteHash', subtitle: 'SN89', isSelf: true, approach: 'SHA-256 mining pool routing all BTC into buyback-and-burn of the subnet Alpha token; miners paid in TAO.', access: 'open · stratum', accessTone: 'open', differentiator: 'Only major pool that pays in a protocol token and burns 100% of BTC revenue.' },
      { name: 'Foundry USA', approach: 'Largest US Bitcoin pool with FPPS payouts.', access: 'open · stratum', accessTone: 'open', differentiator: 'Top global hashrate share and stable BTC payouts; standard pool fee, BTC denominated.' },
      { name: 'AntPool', approach: 'Bitmain-aligned global Bitcoin pool with broad miner coverage.', access: 'open · stratum', accessTone: 'open', differentiator: 'Deep ASIC supply chain ties; BTC payouts only, standard fee structure.' },
      { name: 'F2Pool', approach: 'Mature multi-coin pool with strong BTC presence.', access: 'open · stratum', accessTone: 'open', differentiator: 'Brand and uptime; BTC denominated, no protocol-token mechanic.' },
      { name: 'Luxor', approach: 'US-based Bitcoin pool and hashprice marketplace.', access: 'open · stratum', accessTone: 'open', differentiator: 'Strong financialization tooling for miners; BTC denominated.' },
    ],
    note: 'InfiniteHash differentiates not on mining mechanics — SHA-256 pool tech is mature — but on payout currency and tokenomics. Traditional pools pay BTC and charge a fee; InfiniteHash pays the subnet token and recycles BTC into burning it, giving miners exposure to a deflationary asset on top of their hashpower.',
  },
  team: {
    intro: [
      'InfiniteHash is operated by Backend Developers Ltd, with the GitHub organization backend-developers-ltd hosting the InfiniteHash subnet codebase. The team\'s public framing is "the last mining pool" — a pool designed around protocol-token economics rather than fee extraction.',
      'Specific founder bios are not yet broadly indexed; community coverage on X (e.g., @CryptoZPunisher) has highlighted the project\'s "Mining Bitcoin with Bittensor and Building the Lightning Economy for AI" thesis.',
    ],
    founders: [
      { initials: 'BD', gradient: 'v', name: '[Backend Developers Ltd core team]', role: 'Subnet operator', bio: 'Backend Developers Ltd operates Subnet 89 (InfiniteHash) and maintains the open-source codebase for the merged BTC + Bittensor pool.' },
    ],
    size: 'Small core team',
    founded: '2025',
    based: 'Not publicly disclosed',
    backers: 'Not publicly disclosed.',
    placeholder: true,
  },
  milestones: [
    { date: '2025', text: 'Subnet 89 registered on Bittensor as InfiniteHash; SHA-256 mining pool brought online.' },
    { date: '2025', text: 'Public buyback-and-burn pipeline activated — 100% of BTC revenue routed to burn Alpha tokens.' },
    { date: '2025–26', text: 'Lightning Network economy for AI launched alongside the pool layer.' },
  ],
  join: {
    title: 'Point your Bitcoin ASIC at InfiniteHash',
    body: 'Reconfigure your S19/S21 or M50/M60-class ASICs to the InfiniteHash stratum (stratum+tcp://btc.global.luxor.tech:700 or your nearest regional endpoint) and register a Bittensor hotkey to start receiving Alpha emissions in place of BTC.',
    asideNote: 'You give up direct BTC payouts; in exchange you get TAO-denominated rewards plus exposure to a continuously burned protocol token.',
  },
  tags: ['bitcoin', 'sha-256', 'mining-pool', 'pow', 'lightning'],
  external: {
    github: 'https://github.com/backend-developers-ltd/InfiniteHash',
    website: 'https://www.infinitehash.xyz/',
    taostats: 'https://taostats.io/subnets/89/',
  },
};
