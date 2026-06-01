import type { RichSubnet } from '../subnet-rich';
export const sn93: RichSubnet = {
  slug: '93-bitcast', netuid: 93, name: 'Bitcast',
  shortPitch: 'Decentralized creator economy paying YouTube creators in TAO for brand campaigns.',
  overview: [
    'Bitcast (SN93) is the first Bittensor application aimed at content marketing rather than pure AI training. Brands publish campaign "briefs" — videos to make, messages to convey, target audiences — and creators across YouTube (with X / Twitter and additional platforms on the 2026 roadmap) produce content that earns crypto rewards based on real engagement metrics like watch time.',
    'The subnet replaces traditional influencer-marketing intermediaries — agencies, opaque algorithms, marketplace platforms — with a transparent programmatic system where creators are paid directly in TAO/SN93 for the engagement they generate. No middleman cuts, no manual deal negotiation, no platform-dictated payouts.',
    'Miners in this case are creators or creator-aligned operators who submit content fulfilling briefs; validators measure engagement (views, watch time, retention) against verifiable platform data and set weights accordingly. The token emitted on SN93 functions as the creator reward currency, redeemable back through standard dTAO mechanics.',
    'Bitcast was incubated within the Bittensor ecosystem with DSV Fund participation (publicly disclosed via OTC investment), and its competition is the entire $20B+ creator-marketing industry. <a href="#customer" style="color: var(--accent);">See competitive landscape ↓</a>',
  ],
  cycle: {
    challenge: { actor: 'Validator', title: 'Publish brief', body: 'Validator posts a brand campaign brief: required content type, messaging, target platform, and engagement bounty.', dataK: 'payload', dataV: 'brief + bounty + platform' },
    compute:   { actor: 'Miner',     title: 'Produce content', body: 'Creator-miner publishes the video on YouTube (or X) meeting the brief requirements and registers the URL on-chain.', dataK: 'latency',  dataV: 'hours to days' },
    score:     { actor: 'Validator', title: 'Measure engagement', body: 'Validators query platform APIs for watch time, retention, and audience-match metrics; score creators on real engagement.', dataK: 'scale',    dataV: 'watch-time + audience' },
    settle:    { actor: 'Subtensor', title: 'Yuma → emission', body: "Every validator's weights, multiplied by their stake, aggregated by Yuma into one reward vector. TAO mints to top miners.", dataK: 'tempo', dataV: '~72 min · 24×/day' },
  },
  miner:     { does: 'Creates brand-aligned video content on YouTube / X fulfilling published briefs.', input: 'Brand brief, target audience, content guidelines', output: 'Published video URL + engagement claim', hardware: 'Creator-grade — camera, editing, channel infrastructure', paidFor: 'Real engagement (watch time, retention) on brief-aligned content', paidVia: 'Per-tempo emission, score × validator stake' },
  validator: { does: 'Curates briefs from brands, measures real engagement via platform APIs, scores creators.', requires: 'YouTube / X API access + brand brief pipeline', output: 'Per-creator weights tied to verified engagement', paidFor: 'Submitting weights that agree with consensus median', paidVia: 'Per-tempo emission, stake × consensus alignment' },
  scoring:   {
    leadOneLine: 'Real watch time on brief-aligned content beats vanity metrics every time.',
    explanation: [
      'Validators pull platform-side engagement signals — total watch time, average view duration, audience-fit estimated via channel metadata — and weight creators accordingly. Surface views are easy to fake; watch time and retention are far harder, which is why the protocol leans on them.',
      'Briefs include audience-match criteria, so a tech creator who turns out a beauty-brand video gets penalized even with high views. Over many briefs, channels stratify into "high-engagement, audience-aligned" winners and everyone else.',
    ],
    cheatPath: 'View botting — engagement spikes look anomalous in retention curves and audience demographics, validators down-weight or zero out.',
  },
  customer:  {
    leadOneLine: 'Brands wanting transparent programmatic creator marketing without agencies skimming 30%+.',
    explanation: [
      'Web3-native brands, DAOs, and AI startups are the natural early adopters — they\'re already crypto-comfortable and burned by opaque influencer agencies. Bitcast offers a programmatic alternative: post a brief, fund the bounty, get measured engagement at transparent CPM.',
      'The longer-term threat to incumbents is broader. If audience-match scoring becomes reliable, mainstream advertisers can route mid-tail creator spend through Bitcast at materially lower cost than agency-led campaigns. The challenge is brief volume — the subnet needs sustained brand demand to keep creator miners earning.',
    ],
  },
  competitive: { scope: '2026 · creator marketing + influencer economy', rows: [
    { name: 'Bitcast', subtitle: 'SN93', isSelf: true, approach: 'Bittensor-native brief marketplace, engagement-paid in crypto', access: 'open · API', accessTone: 'open', differentiator: 'Programmatic, on-chain, no agency cut, audience-match scoring' },
    { name: 'YouTube BrandConnect', approach: 'YouTube\'s in-house influencer marketplace', access: 'closed', accessTone: 'closed', differentiator: 'Massive supply but YouTube-only and gated to large channels' },
    { name: 'GRIN / Aspire', approach: 'SaaS creator-marketing platforms', access: 'closed', accessTone: 'closed', differentiator: 'Workflow tooling for brands, no token incentives' },
    { name: 'Traditional influencer agencies', approach: 'Human-brokered deals + flat fees', access: 'closed', accessTone: 'closed', differentiator: 'Status quo, 20-40% take rates' },
    { name: 'Lens / Farcaster monetization', approach: 'On-chain social token tipping', access: 'open · API', accessTone: 'open', differentiator: 'Smaller audiences, not brand-campaign focused' },
  ], note: 'Bitcast\'s long-tail wedge is the mid-tier creator (10K-1M subs) who is too small for agency representation but too big for ad-revenue only. If brand briefs scale, this is a real creator-economy product, not just a subnet.' },
  team: {
    intro: [
      'Bitcast is co-founded by Tom Blears and Will Blears (brothers), combining blockchain technical experience with content-marketing expertise.',
      'The team is lean — no long public list of team members yet — and engages the community via Twitter (@Bitcast_network) and Discord. DSV Fund has publicly disclosed OTC participation in the subnet.',
    ],
    founders: [
      { initials: 'TB', gradient: 'v', name: 'Tom Blears', role: 'Co-founder', bio: 'Co-founder of Bitcast, building the decentralized creator economy and SN93 protocol.' },
      { initials: 'WB', gradient: 'a', name: 'Will Blears', role: 'Co-founder', bio: 'Co-founder of Bitcast, content-marketing and ecosystem operator.' },
    ],
    size: 'Lean core team', founded: '2025', based: 'Not publicly disclosed', backers: 'DSV Fund (additional $50K OTC publicly disclosed).',
  },
  milestones: [
    { date: '2025', text: 'Subnet 93 launches Bitcast on Bittensor.' },
    { date: '2026', text: 'DSV Fund doubles down with additional $50K OTC investment.' },
    { date: '2026', text: 'Roadmap names X / Twitter as next platform expansion.' },
  ],
  join: { title: 'Get paid for real engagement', body: 'Creators with channels on YouTube (and soon X) can pick briefs, publish content, and earn TAO directly based on measured engagement. Brands and validators can sponsor briefs and curate the pipeline.', asideNote: 'Watch the brief volume — the subnet thrives only with sustained brand demand. Creator-side payouts depend on the brand-side flywheel.' },
  tags: ['creator-economy', 'influencer-marketing', 'youtube', 'content'],
  external: { github: 'https://github.com/bitcast-network/bitcast', website: 'https://www.bitcast.network/', twitter: 'https://x.com/Bitcast_network', taostats: 'https://taostats.io/subnets/93/' },
  tweets: [],
};
