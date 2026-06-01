import type { RichSubnet } from '../subnet-rich';

export const sn71: RichSubnet = {
  slug: '71-leadpoet',
  netuid: 71,
  name: 'Leadpoet',
  shortPitch: 'Decentralized B2B lead generation — miners source, validators verify.',
  overview: [
    'Leadpoet is Bittensor subnet 71, a decentralized sales intelligence network operated by co-founders Gavin Zaentz and Pranav Ramesh. Miners run automated pipelines (web scraping, AI extraction, enrichment) to find B2B prospects that match a buyer\'s Ideal Customer Profile, while validators independently confirm each lead is real, reachable, and relevant before it lands in the pool.',
    'The customer-facing product is a feed of qualified, deduplicated B2B leads keyed to an ICP. Every consumed lead burns a unit of the SN71 alpha token, which makes adoption directly deflationary against the subnet currency. By late 2025 the project reported roughly 218 active miners competing on coverage.',
    'The buyer profile is B2B revenue teams — outbound SDR orgs, founder-led sales, growth shops — who today pay ZoomInfo or Apollo seat fees for static databases and still spend hours scrubbing duplicates and bad emails.',
    'One-line diff: a parallel sourcing market with consensus quality checks, instead of a single static data vendor. <a href="#customer" style="color: var(--accent);">See competitive landscape ↓</a>',
  ],
  cycle: {
    challenge: { actor: 'Validator', title: 'Publish ICP', body: 'Validator publishes an ICP specification: firmographics, role / title filters, geography, intent signals, and freshness requirements.', dataK: 'payload', dataV: 'ICP spec + filters' },
    compute:   { actor: 'Miner',     title: 'Source + submit', body: 'Miners run scraping + AI extraction pipelines, enrich contacts with email / phone / role, and submit batches against the ICP request.', dataK: 'unit',    dataV: 'leads per batch' },
    score:     { actor: 'Validator', title: 'Verify + dedupe', body: 'Validators check email deliverability, role accuracy, freshness, and dedupe across miners; only validated unique leads count.', dataK: 'scale',   dataV: 'verified leads' },
    settle:    { actor: 'Subtensor', title: 'Yuma → emission', body: "Every validator's weights, multiplied by their stake, aggregated by Yuma into one reward vector. TAO mints to top miners.", dataK: 'tempo', dataV: '~72 min · 24×/day' },
  },
  miner: {
    does: 'Operates automated sourcing pipelines (scraping, AI extraction, enrichment) and submits ICP-matched B2B leads.',
    input: 'Validator-published ICP spec: firmographics, role filters, geo, freshness.',
    output: 'Batches of enriched, deduplicated leads with verified contact data.',
    hardware: 'Lightweight compute + proxies and enrichment API budget; bandwidth and integration breadth matter more than raw GPU.',
    paidFor: 'Submitting the most unique, validator-verified, ICP-matched leads.',
    paidVia: 'Per-tempo emission, score × validator stake',
  },
  validator: {
    does: 'Publishes ICP specs, verifies each submitted lead (deliverability, role accuracy, freshness), dedupes across miners, and writes weights on-chain.',
    requires: 'Verification stack (email deliverability checks, role validation), plus min-stake to register as a Bittensor validator.',
    output: 'Per-miner weight vector ranking lead yield and quality.',
    paidFor: 'Submitting weights that agree with consensus median',
    paidVia: 'Per-tempo emission, stake × consensus alignment',
  },
  scoring: {
    leadOneLine: 'Unique, verified, ICP-matched leads only — duplicates, bouncing emails, and stale roles earn zero.',
    explanation: [
      'Scoring is a multi-validator consensus check on three properties of each submitted contact: deliverability (does the email resolve and accept mail), accuracy (is the role / company / seniority correct against current data), and uniqueness (no other miner submitted the same person in this or recent batches).',
      'Because every consumed lead burns SN71 alpha, the incentive structure ties miner reward directly to buyer demand: the more leads paying customers actually pull, the tighter the supply of alpha and the stronger the emission signal back to high-quality sourcing.',
    ],
    cheatPath: 'Classic attacks are AI-fabricated contacts (plausible names + role + email pattern), recycled stale data, and miner collusion on the same source. The counters are deliverability checks, dedupe across miners, and multi-validator agreement; the residual surface is well-enriched but stale data that passes verification.',
  },
  customer: {
    leadOneLine: 'B2B revenue teams who today pay $10k+/year per seat for ZoomInfo / Apollo and still spend hours cleaning bad data.',
    explanation: [
      'The unlock is paying for outcomes — verified, ICP-matched, fresh leads — rather than for database access. A founder running outbound can post their ICP, pull a batch of consensus-verified leads, and only burn alpha against contacts that actually pass deliverability.',
      'The global lead generation TAM is well above $10B annually. Leadpoet\'s wedge is the combination of broad parallel coverage (every active miner sourcing the same ICP from a different angle) and consensus quality (no single vendor has unilateral control over what counts as "verified").',
    ],
  },
  competitive: {
    scope: 'B2B sales intelligence · 2026',
    rows: [
      { name: 'Leadpoet', subtitle: 'SN71', isSelf: true, approach: 'Open sourcing tournament — miners scrape + enrich, validators consensus-verify each lead, buyers burn alpha per pulled contact.', access: 'open · API + dashboard', accessTone: 'open', differentiator: 'Parallel sourcing with multi-validator quality consensus, pay-per-verified-lead rather than seat license.' },
      { name: 'ZoomInfo', approach: 'Centralized B2B contact database with proprietary enrichment and intent data.', access: 'closed · seat license', accessTone: 'closed', differentiator: 'Largest curated B2B database; expensive per-seat pricing and single-vendor quality model.' },
      { name: 'Apollo.io', approach: 'B2B contact database plus outbound execution (email sequencing, dialer) on a SaaS subscription.', access: 'closed · SaaS subscription', accessTone: 'closed', differentiator: 'All-in-one outbound stack; static database with provider-controlled quality.' },
      { name: 'Clay', approach: 'Workflow tool that orchestrates many third-party enrichment APIs into custom lead-scoring pipelines.', access: 'closed · SaaS subscription', accessTone: 'closed', differentiator: 'Customer brings the data sources; powerful for ops teams but you still pay each underlying API.' },
      { name: 'LinkedIn Sales Navigator', approach: 'LinkedIn\'s own filtered prospect search with lead lists and account tracking.', access: 'closed · seat license', accessTone: 'closed', differentiator: 'Best-in-class current employment signal; no email / phone enrichment and gated to LinkedIn graph.' },
    ],
    note: 'Leadpoet\'s wedge is the combination of pay-per-verified-lead pricing and consensus quality. The trade-off vs ZoomInfo / Apollo is brand trust and SLA; the trade-off vs Clay is that buyers don\'t bring their own data sources — the miner network does.',
  },
  team: {
    intro: [
      'Leadpoet is operated by co-founders Gavin Zaentz and Pranav Ramesh, with a team drawing on backgrounds across Columbia, Tulane, AWS, and Nasdaq. The project has been backed by DSV Fund and discussed publicly on Bittensor podcast circuits in late 2025.',
      'The team\'s thesis is that B2B contact data is a market where centralized vendors\' moats (database scale) are now arbitrageable by a sourcing tournament — and that pay-per-verified-lead is a closer fit to how revenue teams actually budget than seat licenses.',
    ],
    founders: [
      { initials: 'GZ', gradient: 'v', name: 'Gavin Zaentz', role: 'Co-founder · Leadpoet', bio: 'Co-founder of Leadpoet; public-facing on Bittensor podcast circuit through 2025. Background spans tech and finance per team disclosures.' },
      { initials: 'PR', gradient: 'a', name: 'Pranav Ramesh', role: 'Co-founder · Leadpoet', bio: 'Co-founder of Leadpoet; co-host on the Episode 79 founder interview that introduced Leadpoet to the broader Bittensor community.' },
    ],
    size: 'Not publicly disclosed.', founded: '2024', based: 'United States',
    backers: 'DSV Fund (disclosed via subnet expansion announcement).',
    placeholder: false,
  },
  milestones: [
    { date: '2024·Q4', text: 'Subnet 71 registered as Leadpoet.' },
    { date: '2025·Q3', text: 'Public founder interview (Ep. 79) introduces Leadpoet thesis: intent-driven decentralized sales automation.' },
    { date: '2025·Q4', text: 'DSV Fund announces expansion of position in SN71.' },
    { date: '2025·Q4', text: 'Active miner count reported around 218; live dashboard goes up at subnet71.com.' },
  ],
  join: {
    title: 'Pull verified B2B leads on Leadpoet',
    body: 'Buyers can request ICP-matched leads via the Leadpoet interface (subnet71.com / leadpoet.com). Miners and validators install from github.com/leadpoet/leadpoet and register on netuid 71.',
    asideNote: 'Each consumed lead burns SN71 alpha. Live network state on taostats.io/subnets/71/.',
  },
  tags: ['B2B', 'sales intelligence', 'lead generation', 'data marketplace'],
  external: {
    github: 'https://github.com/leadpoet/leadpoet',
    website: 'https://www.subnet71.com/',
    taostats: 'https://taostats.io/subnets/71/',
  },
};
