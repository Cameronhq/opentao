import type { RichSubnet } from '../subnet-rich';

export const sn20: RichSubnet = {
  slug: '20-groundlayer',
  netuid: 20,
  name: 'GroundLayer',
  shortPitch: 'A capital layer for Bittensor — structured OTC deals for subnet tokens.',
  overview: [
    'GroundLayer positions itself as the capital layer for Bittensor. It facilitates structured over-the-counter (OTC) deals for subnet tokens: subnets define deal terms upfront (quantity, discount, lockup schedule), fund managers deploy capital into deals, and investors gain discounted access to subnet alpha. The customer outside Bittensor is a fund or family office that wants Bittensor exposure with structure.',
    'The subnet provides on-chain enforcement of the deal terms — lockup schedules and vesting are enforced by code, not by trust. The pitch is "0% price impact on raise" for the subnet owner: instead of selling spot and crashing the alpha pair, the subnet raises off-market in a structured deal with terms that match the buyer\'s horizon.',
    'The customer pitch is direct: every subnet on Bittensor needs working capital to scale, but selling spot alpha into a thin pool is the worst possible way to get it. Family offices and crypto funds want subnet exposure but cannot deploy meaningful size in the spot market without moving price. GroundLayer is the OTC desk for that flow.',
    'Where Bittensor today has only the spot AMM pair as the way to acquire alpha, GroundLayer is the structured private-market complement. <a href="#customer" style="color: var(--accent);">See competitive landscape ↓</a>',
  ],
  cycle: {
    challenge: { actor: 'Validator', title: 'Deal-data probe', body: 'Issue queries about active and historical deals — terms, lockup schedules, fill rates, fund-manager performance — to active miners.', dataK: 'payload', dataV: 'Deal-state query' },
    compute:   { actor: 'Miner',     title: 'Return deal data', body: 'Miners index on-chain deal state and return correct, timely answers about deal terms, fill rates, fund-manager track records.', dataK: 'latency',  dataV: 'Sub-second responses' },
    score:     { actor: 'Validator', title: 'Score correctness', body: 'Compare miner responses to validated on-chain state. Correctness is the dominant term, latency is the tiebreaker.', dataK: 'scale', dataV: 'correctness × freshness' },
    settle:    { actor: 'Subtensor', title: 'Yuma → emission', body: "Every validator's weights, multiplied by their stake, aggregated by Yuma into one reward vector. TAO mints to top miners.", dataK: 'tempo', dataV: '~72 min · 24×/day' },
  },
  miner: {
    does: 'Indexes on-chain deal state and serves queries about deal terms and fund-manager performance.',
    input: 'Deal-state query from validator',
    output: 'Structured response with deal data',
    hardware: 'Lightweight — indexer + database',
    paidFor: 'Correct, fresh deal-state responses',
    paidVia: 'Per-tempo emission, score × validator stake',
  },
  validator: {
    does: 'Issues deal-state probes, validates responses, submits weights.',
    requires: 'Top-N stake + reference validator code',
    output: 'Per-UID weight vector, signed on-chain',
    paidFor: 'Submitting weights that agree with consensus median',
    paidVia: 'Per-tempo emission, stake × consensus alignment',
  },
  scoring: {
    leadOneLine: 'Surface the truth about every deal on the chain.',
    explanation: [
      'GroundLayer is pre-launch as of mid-2026, so the exact scoring rubric is still being finalized. The published architecture is a three-party marketplace — subnets, fund managers, investors — with on-chain enforcement of deal terms. The subnet\'s mining role is expected to be deal-state indexing and query-serving: miners index every active and historical deal, then serve correct, low-latency responses to validator probes.',
      'Scoring weighs correctness first (a wrong answer about a vested-token unlock is a real problem) and latency second. Fund-manager performance metrics flow through the same surface, which means miners that maintain a richer view of historical deal performance earn more.',
    ],
    cheatPath: 'Returning stale data on a recently-amended deal — caught by the freshness check. Fabricating fund-manager performance — validators cross-check on-chain history. Skipping rare deal types — the validator probe distribution covers the long tail by design.',
  },
  customer: {
    leadOneLine: 'The customer outside Bittensor is a fund or family office that wants structured Bittensor exposure.',
    explanation: [
      'Spot alpha on Bittensor is thin. Even a $1M order moves the price of most subnet pairs by double digits. A serious allocator cannot deploy size that way. GroundLayer is the OTC desk that lets a subnet sell a lockup-vested chunk of alpha to a fund at a negotiated discount, with the lockup and vesting enforced by the chain rather than by a Telegram handshake.',
      'Concretely: the platform offers "100% onchain enforcement," "0% price impact on raise," and a 3-party aligned incentive model where fund managers earn based on AUM locked and deal performance. The customer never sees Bittensor under the hood — they see a structured product.',
    ],
  },
  competitive: {
    scope: 'subnet-token capital markets · 2026',
    rows: [
      { name: 'GroundLayer', subtitle: 'SN20', isSelf: true, approach: 'On-chain OTC marketplace for subnet tokens with structured deal terms', access: 'invite · onboarding', accessTone: 'closed', differentiator: 'Native to Bittensor · on-chain lockups · 3-party aligned' },
      { name: 'Spot AMM (alpha pair)', approach: 'The default — buy / sell alpha at AMM price', access: 'open · DEX', accessTone: 'open', differentiator: 'Permissionless · brutal slippage at size · no lockup discount' },
      { name: 'Bitstarter', approach: 'Crowdfunding for new subnets — early-supporter access', access: 'open · platform', accessTone: 'open', differentiator: 'New-subnet bootstrapping · not for established subnets · small ticket sizes' },
      { name: 'Off-chain OTC desks (general crypto)', approach: 'Telegram-driven block trades intermediated by FalconX / Cumberland', access: 'closed · institutional', accessTone: 'closed', differentiator: 'Liquid majors only · no Bittensor-specific deals · counterparty risk' },
      { name: 'General TAO Ventures · Project Rubicon', approach: 'TAO-side bridge / liquidity infrastructure', access: 'closed', accessTone: 'closed', differentiator: 'Adjacent · different layer of the stack' },
    ],
    note: 'GroundLayer\'s wedge is the structure. The spot AMM is permissionless but unusable at size. Off-chain OTC desks ignore Bittensor. GroundLayer is the first attempt to offer programmatic, structured, on-chain enforcement specifically for subnet-token raises — and it sits at the exact pinch point where the next wave of institutional capital will need to enter.',
  },
  team: {
    intro: [
      'GroundLayer is currently pre-launch. The website (groundlayer.xyz) is accepting registrations across three categories — investors, fund managers, and sellers (subnet owners). The team has not published a founder page; commercial details are surfaced through application-gated access.',
      'Note: subnet 20 historically hosted other projects (BitAgent / Rizzo Network, Bounty Hunter). The current operator is GroundLayer.',
    ],
    founders: [
      { initials: 'GL', gradient: 'v', name: '[Founder 1 name]', role: 'Founder · operator', bio: 'Operates the GroundLayer marketplace. Public bio not yet disclosed. Background appears to bridge crypto capital markets and the Bittensor ecosystem.' },
    ],
    size: 'Not publicly disclosed.',
    founded: '2026 (pre-launch)',
    based: 'Not publicly disclosed.',
    backers: 'Not publicly disclosed.',
    placeholder: true,
  },
  milestones: [
    { date: '2024', text: 'Subnet 20 originally registered (previously branded BitAgent / Rizzo, then Bounty Hunter).' },
    { date: '2026·Q1', text: 'GroundLayer rebrand — repositions subnet 20 as the capital layer for Bittensor.' },
    { date: '2026·Q2', text: 'Pre-launch registration opens for investors, fund managers, and subnet owners.' },
  ],
  join: {
    title: 'Apply for early access',
    body: 'Three lanes on the GroundLayer site — investor, fund manager, or subnet owner. Registration is gated by application as of mid-2026.',
    asideNote: 'Validating? Subnet mining mechanics will be published with the public launch.',
  },
  tags: ['capital', 'otc', 'finance', 'infrastructure'],
  external: {
    website: 'https://www.groundlayer.xyz',
    taostats: 'https://taostats.io/subnets/20/',
  },
};
