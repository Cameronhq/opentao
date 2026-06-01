import type { RichSubnet } from '../subnet-rich';

// Minimal honest profile — public information for subnet 26 in mid-2026 is
// limited and the naming has been unstable (historically "Image Alchemy",
// later listed on some explorers as "Storb", currently surfaced as "Perturb"
// in some sources). No verified operator, GitHub, or scoring spec.

export const sn26: RichSubnet = {
  slug: '26-perturb',
  netuid: 26,
  name: 'Perturb',
  shortPitch: 'Subnet 26 on Bittensor — public details limited as of mid-2026.',
  overview: [
    'Subnet 26 currently surfaces as "Perturb" on some Bittensor sources, though its naming has been unstable: the netuid was previously associated with "Image Alchemy" (a community image-generation Discord bot, circa 2024) and at one point with "Storb" (object-storage themed) per third-party trackers. Operator and scoring details are not consistently published as of mid-2026.',
    'Because authoritative public information (active GitHub, website, scoring rubric, founder identity) is missing or inconsistent, this entry is deliberately minimal. The subnet exists on-chain — see taostats — but a high-confidence write-up would require either confirmation from the current operator or a working public repository.',
    'Treat this page as a placeholder. If you are the operator, or you have verified information about subnet 26\'s current state, contributions are welcome.',
    'For accurate live state, the chain itself is the source of truth. <a href="#customer" style="color: var(--accent);">See competitive landscape ↓</a>',
  ],
  cycle: {
    challenge: { actor: 'Validator', title: 'Challenge phase', body: 'Standard Bittensor challenge phase. Specific task structure for subnet 26 is not publicly documented as of mid-2026.', dataK: 'payload', dataV: 'Not publicly documented' },
    compute:   { actor: 'Miner',     title: 'Compute phase', body: 'Standard Bittensor miner-compute phase. Specific miner work for subnet 26 is not publicly documented as of mid-2026.', dataK: 'latency',  dataV: 'Not publicly documented' },
    score:     { actor: 'Validator', title: 'Score phase', body: 'Standard Bittensor validator-scoring phase. Specific scoring rubric for subnet 26 is not publicly documented as of mid-2026.', dataK: 'scale', dataV: 'Not publicly documented' },
    settle:    { actor: 'Subtensor', title: 'Yuma → emission', body: "Every validator's weights, multiplied by their stake, aggregated by Yuma into one reward vector. TAO mints to top miners.", dataK: 'tempo', dataV: '~72 min · 24×/day' },
  },
  miner: {
    does: 'Subnet 26 miner role is not publicly documented as of mid-2026.',
    input: 'Not publicly documented',
    output: 'Not publicly documented',
    hardware: 'Not publicly documented',
    paidFor: 'Not publicly documented',
    paidVia: 'Per-tempo emission, score × validator stake',
  },
  validator: {
    does: 'Standard Bittensor validator role; specific task spec not publicly documented.',
    requires: 'Top-N stake on subnet 26',
    output: 'Per-UID weight vector, signed on-chain',
    paidFor: 'Submitting weights that agree with consensus median',
    paidVia: 'Per-tempo emission, stake × consensus alignment',
  },
  scoring: {
    leadOneLine: 'Public scoring rubric for subnet 26 is not currently documented.',
    explanation: [
      'As of mid-2026 there is no consistently-published scoring specification for subnet 26. Different ecosystem trackers list different project names for this netuid, which usually indicates either a recent re-registration, an inactive operator, or a project in transition between teams.',
      'Until a current operator publishes a repository and a task spec, the only reliable source of state for subnet 26 is the on-chain metagraph on taostats. Treat third-party descriptions with skepticism.',
    ],
    cheatPath: 'No public scoring rubric means no public cheat-path analysis either.',
  },
  customer: {
    leadOneLine: 'No clear customer thesis for subnet 26 is publicly disclosed as of mid-2026.',
    explanation: [
      'Earlier name associations ("Image Alchemy", "Storb") suggest the netuid has historically been used for image generation and at one point for object storage. Neither use case has a clearly publicized live customer pipeline as of mid-2026.',
      'If the current operator (publicly surfaced as "Perturb") has a customer thesis, it is not yet captured in public sources accessible from outside Bittensor Discord.',
    ],
  },
  competitive: {
    scope: 'subnet 26 · 2026',
    rows: [
      { name: 'Perturb', subtitle: 'SN26', isSelf: true, approach: 'Not publicly documented as of mid-2026', access: 'unknown', accessTone: 'closed', differentiator: 'Operator and task spec not publicly confirmed' },
    ],
    note: 'A real competitive landscape requires a defined task. Until subnet 26\'s current operator publishes a scoring rubric and a customer pitch, comparing it to external alternatives would be guesswork. This page will be expanded when verified information is available.',
  },
  team: {
    intro: [
      'Operator and team for subnet 26 are not consistently identified across public sources as of mid-2026.',
      'Multiple project names have surfaced for this netuid in different time periods — "Image Alchemy" historically, "Storb" on some trackers, "Perturb" in some recent sources — which usually indicates a netuid in transition.',
    ],
    founders: [
      { initials: 'PB', gradient: 'v', name: '[Operator name]', role: 'Subnet operator', bio: 'Current operator for subnet 26 is not publicly identified in sources accessible from outside Bittensor Discord as of mid-2026.' },
    ],
    size: 'Not publicly disclosed.',
    founded: 'Not publicly disclosed.',
    based: 'Not publicly disclosed.',
    backers: 'Not publicly disclosed.',
    placeholder: true,
  },
  milestones: [
    { date: '2024', text: 'Subnet 26 has had multiple project associations in its history (Image Alchemy, later Storb).' },
    { date: '2026', text: 'Currently surfaced as "Perturb" in some sources; operator and scoring spec not publicly confirmed.' },
  ],
  join: {
    title: 'Need verified information',
    body: 'If you operate or contribute to subnet 26, this page is a placeholder waiting on verified details. Reach out via the OpenTAO repo to upgrade it.',
    asideNote: 'On-chain state for the netuid lives at taostats — that is the only authoritative source until the operator publishes a repository.',
  },
  tags: ['placeholder'],
  external: {
    taostats: 'https://taostats.io/subnets/26/',
  },
};
