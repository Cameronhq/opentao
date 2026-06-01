import type { RichSubnet } from '../subnet-rich';

export const sn122: RichSubnet = {
  slug: '122-122',
  netuid: 122,
  name: 'Bitrecs',
  shortPitch: 'Decentralized AI product recommendations for Shopify and WooCommerce stores.',
  overview: [
    'Bitrecs is Bittensor Subnet 122, a decentralized AI recommendation engine purpose-built for e-commerce. It gives small and mid-sized online merchants the kind of "customers also bought" personalization that large retailers like Amazon spend nine-figures engineering, packaged as a one-click Shopify or WooCommerce plugin.',
    'The architecture splits cleanly: a storefront plugin captures real-time shopper behavior, basket context, and inventory state; that context is forwarded to the subnet, where miners produce ranked recommendations using a fleet of LLMs (ChatGPT, Claude, Grok, and others) and a Consensus Engine arbitrates. Recommendations stream back to the storefront in milliseconds.',
    'Miners compete on recommendation quality measured by Recall@K and NDCG@K on labelled evaluation sets, while live merchants observe lift on conversion rate, average order value, and customer lifetime value. The subnet has roughly 130 paying merchants, ~$32/month ARPU, and an explicit goal of 1,000+ stores and 2-5%+ AOV lift.',
    'One-line diff: a TAO-subsidised, multi-model recommendation engine that ships as a normal Shopify/Woo plugin — so the merchant never sees Bittensor. <a href="#customer" style="color: var(--accent);">See competitive landscape ↓</a>',
  ],
  cycle: {
    challenge: { actor: 'Validator', title: 'Issue eval set', body: 'Validators send labelled query/context pairs (and shadow live-store traffic) to miners, asking for ranked product recommendations for each shopper context.', dataK: 'payload', dataV: 'shopper context + catalog' },
    compute:   { actor: 'Miner',     title: 'Rank products', body: 'Miners query multiple LLMs in parallel, generate candidate recommendations, and use prompt strategies + Consensus Engine to return a ranked product list per query.', dataK: 'latency',  dataV: 'sub-second per query' },
    score:     { actor: 'Validator', title: 'Recall@K · NDCG@K', body: 'Validators score returned rankings against held-out labels using Recall@K and NDCG@K, weight miners by quality, and feed live merchant outcomes back into the scoring loop.', dataK: 'scale',    dataV: 'ranking accuracy' },
    settle:    { actor: 'Subtensor', title: 'Yuma → emission', body: "Every validator's weights, multiplied by their stake, aggregated by Yuma into one reward vector. TAO mints to top miners.", dataK: 'tempo', dataV: '~72 min · 24×/day' },
  },
  miner: {
    does: 'Take a shopper context + product catalog and return a ranked list of recommended products using one or many LLMs and prompt strategies.',
    input: 'Shopper context, basket, catalog snapshot, query',
    output: 'Top-K ranked product recommendations with reasoning',
    hardware: 'Modest compute; mostly LLM API budget + lightweight ranking infra',
    paidFor: 'Returning rankings that maximise Recall@K, NDCG@K, and downstream merchant lift',
    paidVia: 'Per-tempo emission, score × validator stake',
  },
  validator: {
    does: 'Maintain labelled eval sets, issue queries, score miner rankings on Recall@K / NDCG@K, and incorporate live merchant outcomes.',
    requires: 'Bittensor validator stake, Bitrecs evaluation stack, access to anonymized merchant traffic',
    output: 'Weight vector concentrating emission on highest-ranking miners',
    paidFor: 'Submitting weights that agree with consensus median',
    paidVia: 'Per-tempo emission, stake × consensus alignment',
  },
  scoring: {
    leadOneLine: 'Reward miners whose rankings actually lift conversion, AOV, and CLV on real stores.',
    explanation: [
      'On the protocol side, miners are graded on standard information-retrieval metrics — Recall@K and NDCG@K — over labelled evaluation sets, so the scoring is objective and reproducible. The challenge is constructed so that wrapping a single LLM is rarely enough; multi-model consensus and good prompt engineering measurably outperform a naive baseline.',
      'On the business side, Bitrecs feeds back live merchant metrics — conversion rate, AOV, CLV — into the scoring loop, which keeps the on-chain leaderboard tethered to actual revenue lift rather than synthetic benchmarks. Stated targets are 2-5%+ AOV lift across the merchant base.',
    ],
    cheatPath: 'Naive cheat is recommending bestsellers regardless of context — wins on click but loses on diversity and downstream lift. NDCG@K with held-out positives plus live merchant signals demote that strategy. Sybil farming many miner identities against the same prompt stack is bounded by stake economics and validator-side de-duplication.',
  },
  customer: {
    leadOneLine: 'Shopify and WooCommerce merchants paying ~$32/month for personalised recommendations.',
    explanation: [
      'The customer is the merchant. They install the Bitrecs app from the Shopify App Store (or WooCommerce plugin), connect their catalog, and immediately get a personalised recommendation widget on product, cart, and checkout pages — no knowledge of Bittensor required. Pricing is subscription, with current ARPU around $32/month and CAC around $75.',
      'The downstream beneficiary is the shopper, who sees more relevant suggestions, and the broader e-commerce stack, since Bitrecs publishes diagnostics on which recommendations win. The growth plan is to deploy a six-figure marketing budget and push to roughly 1,000 stores under management.',
    ],
  },
  competitive: {
    scope: 'e-commerce recommendation engines · 2026',
    rows: [
      { name: 'Bitrecs', subtitle: 'SN122', isSelf: true, approach: 'Multi-LLM consensus recommendations via Shopify/Woo plugin, miners compete on Recall@K/NDCG@K and live lift.', access: 'open · Shopify + Woo plugin', accessTone: 'open', differentiator: 'Only TAO-subsidised recommender that ships as a one-click merchant plugin with disclosed unit economics.' },
      { name: 'Klaviyo / Nosto', approach: 'Established personalisation suites: behavioural data + ML models + email/onsite delivery.', access: 'closed · paid SaaS', accessTone: 'closed', differentiator: 'Deep CRM integrations and brand trust but expensive for SMB merchants.' },
      { name: 'Rebuy Engine', approach: 'Shopify-native AI recommendations with merchant-facing tuning UI.', access: 'closed · Shopify paid app', accessTone: 'closed', differentiator: 'Tight Shopify integration but single-vendor model and locked algorithms.' },
      { name: 'Amazon Personalize', approach: 'AWS-hosted recommendation models for retailers willing to integrate at the API level.', access: 'closed · AWS API', accessTone: 'closed', differentiator: 'Enterprise-scale and battle-tested but requires engineering work and AWS lock-in.' },
      { name: 'Algolia Recommend', approach: 'Search + recommend layer on top of indexed product catalogs.', access: 'closed · paid SaaS', accessTone: 'closed', differentiator: 'Strong search heritage but separate from the merchant\'s native storefront UX.' },
    ],
    note: 'The recommender market is mature and crowded with closed-source SaaS. Bitrecs\' wedge is unit economics on the supply side — TAO emissions subsidise miner compute so the merchant price can sit well below incumbents — combined with multi-model consensus, which is hard to replicate in a single-vendor stack. The execution risk is sales/distribution, not technology: convincing SMB merchants to install a recommendation widget tied to a subnet rather than an established SaaS brand.',
  },
  team: {
    intro: [
      'Bitrecs is built and operated by a small, mostly-anonymous team of AI and e-commerce engineers shipping under the Bitrecs brand. The product surface — Shopify App Store listing, GitBook docs, and the Bitrecs.ai site — is well-developed; named founder identities have intentionally stayed low-profile while the merchant base grows.',
      'The team has been transparent on the commercial side: ~130 paying merchants, ~$32/month ARPU, ~$75 CAC, ~1% AOV lift today with a 2-5%+ target, and a public goal of 1,000 stores under management.',
    ],
    founders: [
      { initials: 'F1', gradient: 'v', name: '[Founder 1 name]', role: 'Co-founder · Lead engineer', bio: 'AI/NLP engineer leading the recommendation stack and consensus engine; identity not publicly disclosed.' },
      { initials: 'F2', gradient: 'a', name: '[Founder 2 name]', role: 'Co-founder · Commerce', bio: 'E-commerce / merchant-growth lead responsible for Shopify and WooCommerce integrations and merchant onboarding.' },
    ],
    size: 'Small team (AI + e-commerce engineering)',
    founded: '2024',
    based: 'Distributed / not publicly disclosed',
    backers: 'Not publicly disclosed.',
    placeholder: true,
  },
  milestones: [
    { date: '2024', text: 'Bitrecs founded; Shopify and WooCommerce plugins shipped against the v1 subnet stack.' },
    { date: '2025', text: 'Subnet 122 active on Bittensor with multi-LLM Consensus Engine in production.' },
    { date: '2026·Q1', text: '~130 paying merchants, ~$32 ARPU, plans to deploy six-figure marketing budget and push toward 1,000 stores.' },
  ],
  join: {
    title: 'Mine the storefront',
    body: 'Connect to the Bitrecs subnet, route shopper-context queries through your chosen LLMs and prompt strategies, and return ranked product recommendations. Better Recall@K and NDCG@K plus live AOV lift on shadowed traffic earn higher weights.',
    asideNote: 'Setup: github.com/bitrecs/bitrecs-subnet · bitrecs.gitbook.io/bitrecs-docs · Shopify listing at apps.shopify.com/bitrecs-ai-recommendations.',
  },
  tags: ['ecommerce', 'recommendations', 'shopify', 'llm-consensus', 'smb'],
  external: {
    github: 'https://github.com/bitrecs/bitrecs-subnet',
    website: 'https://www.bitrecs.ai/',
    twitter: 'https://x.com/bitrecs_ai',
    taostats: 'https://taostats.io/subnets/122/',
  },
  tweets: [
    { when: '2026·Q1', body: 'Bitrecs reports ~130 paying merchants and a target of 2-5%+ AOV lift, framing the subnet as production e-commerce infrastructure rather than a research benchmark.' },
  ],
};
