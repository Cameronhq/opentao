import type { RichSubnet } from '../subnet-rich';

export const sn74: RichSubnet = {
  slug: '74-gittensor',
  netuid: 74,
  name: 'Gittensor',
  shortPitch: 'Pays open-source developers in TAO for merged pull requests to whitelisted repos.',
  overview: [
    'Gittensor is Bittensor subnet 74, operated by Entrius. The subnet rewards open-source developers directly in TAO for meaningful code contributions: miners register a fine-grained GitHub personal access token, contribute to whitelisted repositories, and earn emission when their pull requests are merged.',
    'Validators authenticate account ownership via the PAT, verify merged contributions on-chain against GitHub, and score them based on a quantitative reward function over code quality, repository weight, and programming language. The scoring code is open-sourced in the project repo.',
    'The customer here is the open-source ecosystem itself — Gittensor is a public-goods subsidy mechanism for projects that today rely entirely on unpaid volunteer labour or single-vendor sponsorship. There is no traditional B2B buyer; instead, the subnet creates a market between Bittensor token holders (who allocate stake) and open-source maintainers (who write code).',
    'One-line diff: it is a code-contribution bounty mechanism running continuously on-chain, not a one-off grant program. <a href="#customer" style="color: var(--accent);">See competitive landscape ↓</a>',
  ],
  cycle: {
    challenge: { actor: 'Validator', title: 'Whitelist + PAT', body: 'Validator maintains the whitelist of eligible repositories and verifies miner-registered GitHub PATs for account ownership.', dataK: 'payload', dataV: 'whitelisted repo + PAT' },
    compute:   { actor: 'Miner',     title: 'Merge a PR', body: 'Miner authors a real pull request against a whitelisted open-source repository. Reward only triggers if the PR is merged upstream.', dataK: 'unit',    dataV: 'merged PR' },
    score:     { actor: 'Validator', title: 'Score the PR', body: 'Validator scores merged PRs by code quality, repo weight, and language factors. Bigger / harder PRs in higher-weighted repos earn more.', dataK: 'metric',  dataV: 'PR weight score' },
    settle:    { actor: 'Subtensor', title: 'Yuma → emission', body: "Every validator's weights, multiplied by their stake, aggregated by Yuma into one reward vector. TAO mints to top miners.", dataK: 'tempo', dataV: '~72 min · 24×/day' },
  },
  miner: {
    does: 'Writes and gets merged real pull requests against whitelisted open-source repositories.',
    input: 'Whitelist of eligible repos plus the miner\'s own development time and skill.',
    output: 'Merged PRs upstream, with the merge event surfaced via GitHub API to validators.',
    hardware: 'Whatever the developer needs to build software — laptop-class. No GPU requirement.',
    paidFor: 'Producing merged PRs that score highly on code quality and repo weight.',
    paidVia: 'Per-tempo emission, score × validator stake',
  },
  validator: {
    does: 'Maintains the whitelist, verifies PAT ownership, scores merged PRs, and writes weights on-chain.',
    requires: 'GitHub API access and the Gittensor scoring stack, plus min-stake to register as a Bittensor validator.',
    output: 'Per-miner weight vector ranking contribution quality and impact.',
    paidFor: 'Submitting weights that agree with consensus median',
    paidVia: 'Per-tempo emission, stake × consensus alignment',
  },
  scoring: {
    leadOneLine: 'Only merged PRs count, scored by code quality × repo weight × language factor.',
    explanation: [
      'A PR earns nothing until it is merged by the upstream repository maintainer — that single gate eliminates the bulk of low-effort or AI-spam contributions. Once merged, validators apply the published scoring function: code-quality heuristics, the repository\'s assigned weight in the whitelist, and a language factor that adjusts for ecosystem importance.',
      'The whitelist itself is the central design lever. By choosing which repositories carry weight and how much, validators effectively steer emission toward the open-source projects the Bittensor stakeholder base wants to fund — making the subnet a programmable continuous OSS grant program.',
    ],
    cheatPath: 'The obvious attack is finding a friendly maintainer who will merge low-quality PRs from a Gittensor account. The intended counters are PAT-based identity binding, code-quality scoring, and whitelist curation — but the residual surface is collusion between miners and maintainers, especially on small repos where merge approval is single-handed.',
  },
  customer: {
    leadOneLine: 'The open-source ecosystem itself — Gittensor is a continuous on-chain subsidy for merged PRs.',
    explanation: [
      'There is no traditional B2B buyer. Instead, Gittensor creates a market between Bittensor token holders who delegate stake to the subnet and OSS maintainers whose repos carry weight in the whitelist. Maintainers do not pay; they choose to be listed and benefit from a steady inflow of contributor labour.',
      'The downstream beneficiaries are the broader software ecosystems whose libraries get more maintenance — and Bittensor itself, which benefits from a credible public-goods narrative tied to a measurable on-chain mechanism.',
    ],
  },
  competitive: {
    scope: 'OSS contributor funding · 2026',
    rows: [
      { name: 'Gittensor', subtitle: 'SN74', isSelf: true, approach: 'On-chain emission to miners whose PRs are merged into whitelisted OSS repos; scored on quality and repo weight.', access: 'open · PAT registration', accessTone: 'open', differentiator: 'Continuous emission tied to merge events, not periodic grants or hackathons.' },
      { name: 'GitHub Sponsors', approach: 'Direct sponsorship from individuals and companies to maintainers via GitHub.', access: 'open · maintainer profile', accessTone: 'open', differentiator: 'Recurring subscriptions to people, not pay-per-PR; depends on individual sponsor reach.' },
      { name: 'Gitcoin Grants', approach: 'Quadratic-funding grant rounds with community matching for OSS projects.', access: 'open · grant rounds', accessTone: 'open', differentiator: 'Periodic round-based grants; rewards projects, not individual merged PRs.' },
      { name: 'Open Collective', approach: 'Fiscal-host platform for OSS projects to receive and spend transparent donations.', access: 'open · project page', accessTone: 'open', differentiator: 'Project-level treasury; doesn\'t score or reward individual contributions automatically.' },
      { name: 'Tea / Stacklok-style protocols', approach: 'Token-curated OSS reward layers that score package dependency impact.', access: 'open · package registration', accessTone: 'open', differentiator: 'Rewards on package-graph impact rather than PR-level work.' },
    ],
    note: 'Gittensor\'s wedge is the granularity (per-merged-PR) and continuity (every tempo) of payout. The trade-off vs Sponsors and Gitcoin is that the whitelist and scoring function are validator-governed rather than donor-directed — which is what makes continuous emission possible at all.',
  },
  team: {
    intro: [
      'Gittensor is operated by Entrius, a small team whose public GitHub presence shows two primary contributors: Ander (GitHub user anderdc) and Landyn (LandynDev). The team has been active on the Bittensor podcast circuit through late 2025.',
      'Entrius\' thesis is that the cleanest possible signal for "valuable code contribution" is the upstream merge event itself — and that pairing that signal with Bittensor\'s continuous emission produces a more durable OSS funding primitive than periodic grants.',
    ],
    founders: [
      { initials: 'AN', gradient: 'v', name: 'Ander', role: 'Co-founder · Entrius / Gittensor', bio: 'Co-founder of Entrius and core developer of Gittensor; GitHub user anderdc, primary contributor on github.com/entrius/gittensor.' },
      { initials: 'LD', gradient: 'a', name: 'Landyn', role: 'Co-founder · Entrius / Gittensor', bio: 'Co-founder of Entrius and core developer of Gittensor; GitHub user LandynDev.' },
    ],
    size: '~2-3 core contributors', founded: '2025', based: 'Not publicly disclosed.',
    backers: 'Not publicly disclosed.',
    placeholder: false,
  },
  milestones: [
    { date: '2025·Q3', text: 'Subnet 74 registered as Gittensor by Entrius.' },
    { date: '2025·11', text: 'Gittensor Twitter (@gittensor_io) launched; public outreach begins.' },
  ],
  join: {
    title: 'Get paid in TAO for merged PRs',
    body: 'Miners register a fine-grained GitHub PAT, get added to the whitelist via the Gittensor stack at github.com/entrius/gittensor, and start contributing to whitelisted open-source repos.',
    asideNote: 'Reward only triggers on merge upstream. Live network state on taostats.io/subnets/74/.',
  },
  tags: ['open source', 'developer rewards', 'GitHub', 'public goods'],
  external: {
    github: 'https://github.com/entrius/gittensor',
    twitter: 'https://x.com/gittensor_io',
    taostats: 'https://taostats.io/subnets/74/',
  },
};
