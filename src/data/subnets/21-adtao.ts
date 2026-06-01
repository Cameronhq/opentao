import type { RichSubnet } from '../subnet-rich';

export const sn21: RichSubnet = {
  slug: '21-adtao',
  netuid: 21,
  name: 'AdTAO',
  shortPitch: 'A Bittensor subnet that optimizes Google Ads campaigns 24/7.',
  overview: [
    'AdTAO is the subnet operated by PPC Rebel — Rob Warner\'s team — for AI-driven Google Ads campaign optimization. Miners submit optimization agents that monitor live PPC campaigns and propose changes — keyword bids, ad copy, negative keywords, budget reallocation. Validators score the changes against actual campaign outcomes. The customer outside Bittensor is a brand spending on Google Ads.',
    'The subnet uses a standard metagraph. Each tempo the validator pulls campaign performance data from connected Google Ads accounts, dispatches the campaign state to active miners, and grades the optimization recommendations against subsequent campaign performance. Better-performing recommendations earn higher weight.',
    'The pitch is industry-experience-led: Rob Warner built and sold five-to-six advertising businesses, including scaling Invisible PPC to 600+ clients before exiting in 2021. AdTAO turns 13 years of Google Ads operating expertise into Bittensor-native intelligence — the founder ran the agency, knows where the waste is, and built the eval rubric.',
    'Where lab-grade ad agents and SaaS PPC tools ship one closed model, AdTAO runs a tournament of optimization agents trained against real campaign data. <a href="#customer" style="color: var(--accent);">See competitive landscape ↓</a>',
  ],
  cycle: {
    challenge: { actor: 'Validator', title: 'Send campaign state', body: 'Pull the latest campaign performance — impressions, clicks, conversions, spend, search-term reports — from a connected Google Ads account and broadcast to active miners.', dataK: 'payload', dataV: 'Campaign state · 7d window' },
    compute:   { actor: 'Miner',     title: 'Recommend changes', body: 'Each miner runs its optimization model and returns a list of proposed changes — bid adjustments, ad copy edits, negative keywords, budget reallocation.', dataK: 'latency',  dataV: '5–60 s per campaign' },
    score:     { actor: 'Validator', title: 'Score by outcome', body: 'Apply (or shadow-apply) the recommendation, measure the change in cost-per-conversion / ROAS over the next window. Better outcomes win.', dataK: 'scale', dataV: 'ROAS Δ · CPA Δ · revenue Δ' },
    settle:    { actor: 'Subtensor', title: 'Yuma → emission', body: "Every validator's weights, multiplied by their stake, aggregated by Yuma into one reward vector. TAO mints to top miners.", dataK: 'tempo', dataV: '~72 min · 24×/day' },
  },
  miner: {
    does: 'Runs a PPC optimization agent against live Google Ads campaigns each tempo.',
    input: 'Campaign state (performance + search-term report)',
    output: 'Structured optimization recommendations',
    hardware: 'Mid-tier GPU + Google Ads API access',
    paidFor: 'Recommendations that improve ROAS / CPA on the next window',
    paidVia: 'Per-tempo emission, score × validator stake',
  },
  validator: {
    does: 'Pulls campaign data, dispatches state, scores recommendations by realized outcomes, submits weights.',
    requires: 'Top-N stake + Google Ads API access + reference validator code',
    output: 'Per-UID weight vector, signed on-chain',
    paidFor: 'Submitting weights that agree with consensus median',
    paidVia: 'Per-tempo emission, stake × consensus alignment',
  },
  scoring: {
    leadOneLine: 'Did the recommendation actually make the campaign better?',
    explanation: [
      'The validator pulls the last 7 days of campaign performance — impressions, clicks, conversions, spend, search-term reports — from a connected Google Ads account and dispatches the state to every active miner. Each miner returns a structured set of recommendations: which keywords to bid up or down, which to mark as negative, which ad copy to test, how to reallocate budget across ad groups.',
      'Scoring is outcome-based. Recommendations are either shadow-applied (counterfactual estimate) or live-applied (where the advertiser opts in), and the resulting change in ROAS, CPA, and revenue over the next tempo window determines the score. The math is essentially: did this change make money or lose money?',
    ],
    cheatPath: 'Returning trivially-safe recommendations (no change) — scores near zero because there\'s no upside. Hallucinating high-volume keywords — fails the search-term-report sanity check. Copying the previous best miner\'s output — the campaign state rotates and the same recommendation often hurts in a different campaign.',
  },
  customer: {
    leadOneLine: 'The customer outside Bittensor is any brand spending on Google Ads.',
    explanation: [
      'Google Ads is a $290B+/year market growing ~16% annually. Most accounts are managed either by an agency taking 15–20% of spend, or by Google\'s own "Smart Campaigns" auto-pilot that famously over-spends on broad match. Every advertiser knows there\'s waste in their account; nobody has a clean way to surface it 24/7.',
      'Concretely: AdTAO connects to a brand\'s Google Ads account via the API, runs the optimization loop continuously, and applies the best recommendations from the network. The customer pays per-improvement or as a flat SaaS — the chain pays miners for the optimization work itself.',
    ],
  },
  competitive: {
    scope: 'PPC optimization · 2026',
    rows: [
      { name: 'AdTAO', subtitle: 'SN21', isSelf: true, approach: 'Incentivized tournament of PPC optimization agents, scored on real ROAS / CPA outcomes', access: 'closed · paid', accessTone: 'closed', differentiator: 'Industry operator at the helm · outcome-graded · agency-grade rubric' },
      { name: 'Google Smart Campaigns', approach: 'Google\'s own auto-pilot — black box bidding, broad match heavy', access: 'closed · default', accessTone: 'closed', differentiator: 'Free · misaligned (Google\'s incentive is to spend more) · opaque' },
      { name: 'Optmyzr', approach: 'Centralized PPC optimization SaaS — rule-based + ML', access: 'closed · SaaS', accessTone: 'closed', differentiator: 'Agency-grade · single model · subscription pricing' },
      { name: 'Adalysis', approach: 'PPC audit and recommendation SaaS', access: 'closed · SaaS', accessTone: 'closed', differentiator: 'Strong audit tooling · weaker on auto-execution' },
      { name: 'Traditional PPC agencies', approach: 'Human strategists managing campaigns manually', access: 'closed · service', accessTone: 'closed', differentiator: 'Personalized · 15-20% of spend · slow iteration cycles' },
    ],
    note: 'Most PPC tooling is either Google\'s own auto-pilot (free, misaligned) or one closed SaaS model. AdTAO\'s claim is that an incentivized tournament of optimization agents, judged on real ROAS outcomes, beats both. The founder\'s 13-year operator track record at Invisible PPC is the credibility wedge — he knows the failure modes of every existing approach.',
  },
  team: {
    intro: [
      'AdTAO is operated by PPC Rebel, led by Rob Warner. Warner has 13+ years in performance advertising, built and sold five-to-six ad businesses, and most famously scaled Invisible PPC to 600+ clients before exiting in 2021. The subnet launched on Bittensor via Bitstarter (Bittensor\'s crowdfunding platform).',
      'The pitch they make: most subnets are run by AI researchers who think advertising is a "solved" problem. AdTAO is run by the operator who has watched advertisers waste hundreds of millions on bad bids — and knows exactly where the win is.',
    ],
    founders: [
      { initials: 'RW', gradient: 'v', name: 'Rob Warner', role: 'Founder · CEO', bio: '13+ years in performance advertising. Built and exited five-to-six ad businesses including Invisible PPC (600+ clients, sold 2021). Now operates AdTAO / PPC Rebel.', twitter: 'https://twitter.com/adtao_ppcrebel' },
    ],
    size: 'Small core team (not publicly disclosed)',
    founded: '2025 · launched on Bitstarter',
    based: 'Distributed',
    backers: 'Bitstarter crowdfunding raise; otherwise not publicly disclosed.',
    placeholder: true,
  },
  milestones: [
    { date: '2025', text: 'AdTAO launches on Bitstarter — Bittensor\'s subnet crowdfunding platform.' },
    { date: '2026·Q1', text: 'Subnet 21 active on mainnet with PPC optimization miners.' },
    { date: '2026·Q2', text: 'PPC Rebel positions AdTAO as a 24/7 AI Google Ads manager.' },
  ],
  join: {
    title: 'Submit a PPC optimization agent',
    body: 'Miners need Google Ads API access plus the reference miner template. Brands can connect a Google Ads account at ppcrebel.com to plug into the optimization loop.',
    asideNote: 'Validating? Top-N stake + Google Ads API access for ground-truth pulls.',
  },
  tags: ['advertising', 'ppc', 'ai-agent', 'commerce'],
  external: {
    website: 'https://www.ppcrebel.com',
    twitter: 'https://twitter.com/adtao_ppcrebel',
    taostats: 'https://taostats.io/subnets/21/',
  },
};
