import type { RichSubnet } from '../subnet-rich';

// Minimal stub: SN101 (slug 101-101) is treated as unnamed / unverified in this dataset.
// Public sources show market cap and validator count but no descriptive project name,
// no website, no public roadmap, and 0 active miners at time of writing.

export const sn101: RichSubnet = {
  slug: '101-101',
  netuid: 101,
  name: '101',
  shortPitch: 'Subnet slot tracked as unnamed — rich profile not yet authored.',
  overview: [
    'Subnet 101 is registered on Bittensor but, for this dataset, is tracked as unnamed/dormant. Public sources surface a netuid, a small validator set, and on-chain market-cap figures, but no published project name, website, or roadmap that would justify a full rich profile.',
    'When a full profile is authored, this stub will be replaced with the standard challenge / compute / score / settle cycle and a full competitive landscape.',
    'For live state, consult taostats and any subnet-owner channels that surface later.',
    'Status: unnamed in opentao\'s rich-profile registry. <a href="#customer" style="color: var(--accent);">See competitive landscape ↓</a>',
  ],
  cycle: {
    challenge: { actor: 'Validator', title: 'n/a', body: 'Not profiled.', dataK: 'payload', dataV: 'n/a' },
    compute:   { actor: 'Miner',     title: 'n/a', body: 'Not profiled.', dataK: 'latency', dataV: 'n/a' },
    score:     { actor: 'Validator', title: 'n/a', body: 'Not profiled.', dataK: 'scale',   dataV: 'n/a' },
    settle:    { actor: 'Subtensor', title: 'Yuma → emission', body: "Every validator's weights, multiplied by their stake, aggregated by Yuma into one reward vector. TAO mints to top miners.", dataK: 'tempo', dataV: '~72 min · 24×/day' },
  },
  miner:     { does: 'Not profiled.', input: 'n/a', output: 'n/a', hardware: 'n/a', paidFor: 'n/a', paidVia: 'Per-tempo emission, score × validator stake' },
  validator: { does: 'Not profiled.', requires: 'n/a', output: 'n/a', paidFor: 'Submitting weights that agree with consensus median', paidVia: 'Per-tempo emission, stake × consensus alignment' },
  scoring:   { leadOneLine: 'Not profiled.', explanation: ['Scoring details not authored for this stub.', 'Check taostats and operator channels for current behaviour.'], cheatPath: 'n/a' },
  customer:  { leadOneLine: 'Not profiled.', explanation: ['Customer profile not authored.', 'Check operator channels for current go-to-market.'] },
  competitive: { scope: 'unnamed', rows: [
    { name: '101', subtitle: 'SN101', isSelf: true, approach: 'Not profiled in this dataset.', access: 'n/a', accessTone: 'closed', differentiator: 'Stub entry — see taostats for live state.' },
  ], note: 'Competitive landscape will be authored when the slot has a verified, stable operator profile.' },
  team: { intro: ['Operator not verified for this profile.', 'Will be filled in once roadmap and ownership are stable.'], founders: [{ initials: '??', gradient: 'v', name: '[Operator name]', role: 'Subnet owner', bio: 'Owner identity not verified in this dataset.' }], size: 'n/a', founded: 'n/a', based: 'n/a', backers: 'Not publicly disclosed.', placeholder: true },
  milestones: [{ date: '2026·05', text: 'Stub entry created in opentao registry.' }],
  join: { title: 'Check live state on taostats', body: 'Use taostats.io/subnets/101/ for current emissions and registration data.', asideNote: 'No operator endpoint verified for this stub.' },
  tags: ['unnamed'],
  external: { taostats: 'https://taostats.io/subnets/101/' },
};
