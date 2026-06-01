import type { RichSubnet } from '../subnet-rich';

export const sn39: RichSubnet = {
  slug: '39-deprecated',
  netuid: 39,
  name: 'Subnet 39 (deprecated)',
  shortPitch: 'Deprecated slot — formerly Basilica (Covenant AI GPU compute).',
  overview: [
    'Subnet 39 is currently marked deprecated on the Bittensor network. The slot was previously operated as Basilica by Covenant AI, a decentralized GPU compute marketplace, but Covenant AI publicly exited Bittensor in 2025 amid a dispute with the core team over emissions and moderation access.',
    'After Covenant AI\'s departure, Basilica\'s on-chain status was effectively wound down, and Subnet 39 is now listed as deprecated by both taostats and tao.app.',
    'No active operator is currently producing work or scoring on this netuid; emission and incentive activity are minimal.',
    'This page is a placeholder until the slot is reused or formally re-registered.',
  ],
  cycle: {
    challenge: { actor: 'Validator', title: 'Inactive', body: 'No active challenge stream on this netuid.', dataK: 'payload', dataV: 'n/a' },
    compute:   { actor: 'Miner',     title: 'Inactive', body: 'No active miners performing work for this subnet.', dataK: 'latency',  dataV: 'n/a' },
    score:     { actor: 'Validator', title: 'Inactive', body: 'No active scoring on this netuid.', dataK: 'scale',    dataV: 'n/a' },
    settle:    { actor: 'Subtensor', title: 'Yuma → emission', body: "Every validator's weights, multiplied by their stake, aggregated by Yuma into one reward vector. TAO mints to top miners.", dataK: 'tempo', dataV: '~72 min · 24×/day' },
  },
  miner:     { does: 'No active mining role.', input: 'n/a', output: 'n/a', hardware: 'n/a', paidFor: 'n/a', paidVia: 'Per-tempo emission, score × validator stake' },
  validator: { does: 'No active validator role.', requires: 'n/a', output: 'n/a', paidFor: 'Submitting weights that agree with consensus median', paidVia: 'Per-tempo emission, stake × consensus alignment' },
  scoring:   { leadOneLine: 'No active scoring rule.', explanation: ['Subnet 39 is deprecated; no live scoring is in effect.', 'See taostats for the on-chain state.'], cheatPath: 'n/a' },
  customer:  { leadOneLine: 'No active customer.', explanation: ['Subnet 39 is deprecated.', 'Check Bittensor official channels for any re-registration plans.'] },
  competitive: { scope: 'deprecated', rows: [
    { name: 'Subnet 39', subtitle: 'SN39', isSelf: true, approach: 'Deprecated slot.', access: 'inactive', accessTone: 'closed', differentiator: 'No live work.' },
  ], note: 'Slot is deprecated; refer to taostats for the latest on-chain status.' },
  team: { intro: ['Previously operated by Covenant AI as Basilica.', 'Covenant AI exited Bittensor in 2025; the subnet was deprecated thereafter.'], founders: [{ initials: 'SD', gradient: 'g', name: 'Sam Dare (former)', role: 'Former operator (Covenant AI)', bio: 'Founder of Covenant AI, which formerly operated Basilica on SN39 before exiting Bittensor.' }], size: 'n/a', founded: 'n/a', based: 'n/a', backers: 'n/a', placeholder: true },
  milestones: [
    { date: '2025', text: 'Covenant AI exits Bittensor; SN39 (Basilica) marked deprecated.' },
  ],
  join: { title: 'Slot inactive', body: 'Subnet 39 is currently deprecated; no miner or validator activity is meaningful here.', asideNote: 'Watch taostats for any re-registration.' },
  tags: ['deprecated'],
  external: { taostats: 'https://taostats.io/subnets/39/' },
  tweets: [],
};
