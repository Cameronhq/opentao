import type { RichSubnet } from '../subnet-rich';

export const sn16: RichSubnet = {
  slug: '16-bitads',
  netuid: 16,
  name: 'BitAds',
  shortPitch: 'A decentralized pay-per-sale advertising network on Bittensor.',
  overview: [
    'BitAds is the subnet operating a decentralized Proof-of-Sale advertising network. Brands stake or rent the SN16 alpha token to own marketing bandwidth on the subnet. Miners drive real traffic to advertiser landing pages and earn only on verified sales — tracked via the BitAds pixel and integrated with the brand\'s Stripe or e-commerce backend.',
    'The subnet runs a standard metagraph. Brands install a pixel and connect their checkout. The pixel logs ad-driven visits and conversion events back to the validator. Each tempo, the validator aggregates verified sales per miner and submits weights. Miners that produce real sales — not just clicks — earn emission.',
    'The customer outside Bittensor is a brand running performance ads on Google or Meta and watching CAC climb. BitAds offers the same model — pay only for a sale — but with a decentralized supply side of traffic operators competing on alpha-stake instead of bidding on keywords. The pitch is: pay-per-sale advertising without the ad-network middleman.',
    'Where Google Ads and Meta sell impressions and clicks, BitAds enforces sale-level attribution on-chain via the pixel + Stripe integration. <a href="#customer" style="color: var(--accent);">See competitive landscape ↓</a>',
  ],
  cycle: {
    challenge: { actor: 'Validator', title: 'Pull conversion data', body: 'Read the BitAds pixel + Stripe webhook for each campaign. Build a per-miner attribution table from the last tempo window.', dataK: 'payload', dataV: 'Pixel events + sale receipts' },
    compute:   { actor: 'Miner',     title: 'Drive real traffic', body: 'Each miner runs traffic-generation channels — content, social, email — that route visitors through tagged BitAds links into advertiser checkouts.', dataK: 'latency',  dataV: 'Continuous · campaign-paced' },
    score:     { actor: 'Validator', title: 'Score by verified sales', body: 'Higher verified-sale count wins emission. Refunded or fraudulent sales are stripped. Clicks without conversions score zero.', dataK: 'scale', dataV: 'sales × campaign budget weight' },
    settle:    { actor: 'Subtensor', title: 'Yuma → emission', body: "Every validator's weights, multiplied by their stake, aggregated by Yuma into one reward vector. TAO mints to top miners.", dataK: 'tempo', dataV: '~72 min · 24×/day' },
  },
  miner: {
    does: 'Drives real human traffic into advertiser checkouts via the BitAds tracking link.',
    input: 'Campaign brief + tagged URL + target conversion event',
    output: 'Verified sales attributed via the BitAds pixel',
    hardware: 'No GPU requirement — traffic ops, content, social',
    paidFor: 'Generating verified conversions on advertiser checkouts',
    paidVia: 'Per-tempo emission, sales × campaign budget × validator stake',
  },
  validator: {
    does: 'Reads pixel + Stripe webhooks, attributes sales to miners, submits weights.',
    requires: 'Top-N stake + reference validator code + pixel/Stripe access',
    output: 'Per-UID weight vector, signed on-chain',
    paidFor: 'Submitting weights that agree with consensus median',
    paidVia: 'Per-tempo emission, stake × consensus alignment',
  },
  scoring: {
    leadOneLine: 'You get paid when a real customer actually buys.',
    explanation: [
      'When a brand launches a campaign on BitAds, they install the BitAds pixel on their site and connect their Stripe account. Miners receive a unique tagged link per campaign and drive traffic through it via whatever channels they own — content, social, email, communities. The pixel logs each visit and ties it back to a miner UID. When that visitor checks out, the Stripe webhook fires and the validator credits the sale to the originating miner.',
      'Scoring is volume-weighted: higher verified sale count earns more emission, with campaign budget as a multiplier so high-margin campaigns reward miners more. Refunds and disputed sales are stripped from the count on the next tempo, which keeps the system honest.',
    ],
    cheatPath: 'Fake clicks — they don\'t convert, so they score zero. Self-purchases — the Stripe-side risk system flags them and the validator strips the credit. Bot traffic — converts at near-zero rate vs human traffic, and the per-campaign conversion rate is monitored.',
  },
  customer: {
    leadOneLine: 'The customer outside Bittensor is a DTC brand running performance ads.',
    explanation: [
      'Any brand running Google Shopping, Meta Advantage+, or affiliate networks is paying for clicks or impressions and praying for conversions. CAC has roughly tripled in five years across most DTC categories. BitAds inverts that — the brand sets a per-sale payout, stakes alpha, and only pays when the sale clears Stripe.',
      'Concretely: BitAds plugs into the merchant\'s existing checkout. The brand pays a fixed cost-per-acquisition (in alpha terms) and miners absorb the risk of finding traffic. If a miner can drive sales below CAC, they keep the spread in emission.',
    ],
  },
  competitive: {
    scope: 'performance advertising · 2026',
    rows: [
      { name: 'BitAds', subtitle: 'SN16', isSelf: true, approach: 'Decentralized pay-per-sale network with on-chain attribution', access: 'open · API', accessTone: 'open', differentiator: 'Pay only on verified sale · no ad-network rake · 0% click cost' },
      { name: 'Google Ads', approach: 'Auction-based PPC across Search/Shopping/YouTube', access: 'closed · paid', accessTone: 'closed', differentiator: 'Largest intent graph · CPC pricing · rising CAC' },
      { name: 'Meta Ads', approach: 'Algorithmic placement across IG/FB with conversion bidding', access: 'closed · paid', accessTone: 'closed', differentiator: 'Best ML targeting · iOS-14 still hurting attribution' },
      { name: 'Impact / PartnerStack', approach: 'Centralized affiliate networks with manual partner curation', access: 'closed · SaaS', accessTone: 'closed', differentiator: 'Established · slow onboarding · high take-rate' },
      { name: 'Brave Ads', approach: 'Browser-native privacy-preserving ad network', access: 'open · token', accessTone: 'open', differentiator: 'Privacy-first · small inventory · awareness > performance' },
    ],
    note: 'BitAds is the only decentralized pay-per-sale network with on-chain attribution. The closest analog is traditional affiliate marketing (Impact, ShareASale), but those networks take 20-30% rake and require manual partner approval. BitAds replaces the network operator with the chain itself — anyone can become a miner, payout terms are public, and Stripe-side verification keeps the cycle honest.',
  },
  team: {
    intro: [
      'BitAds is built by FirstTensor Labs with core engineering historically led from the eseckft GitHub account. The team is small and product-focused — the surface area is the pixel, the validator, and the merchant onboarding. The subnet has been live since April 2024 and remains one of the few "real customer revenue" subnets on Bittensor.',
      'The pitch they make: advertising is a $700B industry built on impression and click bidding. Sale-level pricing is the obvious endgame — and only a decentralized supply side can scale it without the network operator capturing the value.',
    ],
    founders: [
      { initials: 'ES', gradient: 'v', name: 'Eseck', role: 'Lead engineer · subnet operator', bio: 'Core developer behind BitAds.ai and the FirstTensor codebase. Maintains the validator, the miner template, and the merchant-side pixel.', github: 'https://github.com/eseckft' },
      { initials: 'FT', gradient: 'a', name: '[FirstTensor team]', role: 'Operations · merchant onboarding', bio: 'FirstTensor Labs handles the commercial side — onboarding advertisers, integrating Stripe, running campaign QA.', github: 'https://github.com/FirstTensorLabs' },
    ],
    size: '~4–6',
    founded: '2024 · April mainnet launch',
    based: 'Distributed',
    backers: 'Not publicly disclosed.',
    placeholder: true,
  },
  milestones: [
    { date: '2024·04', text: 'BitAds subnet registered on Bittensor mainnet.' },
    { date: '2024·Q3', text: 'BitAds pixel + Stripe integration shipped — Proof-of-Sale verification goes live.' },
    { date: '2025·Q1', text: 'FirstTensor Labs codebase forks the eseckft reference for merchant-side tooling.' },
    { date: '2025·Q4', text: 'Campaign-level alpha staking model introduced — brands rent marketing bandwidth.' },
  ],
  join: {
    title: 'Run an ad campaign or mine traffic',
    body: 'Brands: install the BitAds pixel and connect Stripe to launch a campaign. Miners: clone the reference repo, plug in your traffic channel, and route through the tagged link. Validator code and stake requirements via the GitHub repo.',
    asideNote: 'Validating? Top-N stake + access to the pixel webhook stream. Reference validator in eseckft/BitAds.ai.',
  },
  tags: ['advertising', 'performance', 'commerce', 'incentive'],
  external: {
    github: 'https://github.com/eseckft/BitAds.ai',
    website: 'https://bitads.ai',
    twitter: 'https://twitter.com/bitads_ai',
    taostats: 'https://taostats.io/subnets/16/',
  },
};
