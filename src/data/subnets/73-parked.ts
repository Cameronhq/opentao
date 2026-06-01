import type { RichSubnet } from '../subnet-rich';

// Minimal stub: SN73 (slug 73-parked) is treated as parked/unverified in this dataset.
// The netuid 73 slot has at times been associated with MetaHash, but its operating
// status and roadmap are not stable enough to author a full rich profile here.

export const sn73: RichSubnet = {
  slug: '73-parked',
  netuid: 73,
  name: 'Parked',
  shortPitch: 'Subnet slot tracked as parked — rich profile not yet authored.',
  overview: [
    'Subnet 73 is registered on Bittensor but, for this dataset, is tracked as parked. The netuid has historically been associated with MetaHash, an OTC-style treasury and alpha-token swap layer, but operating status, team, and roadmap are not stable enough to confirm as a rich profile here.',
    'When a full profile is authored, this stub will be replaced with the standard challenge / compute / score / settle cycle and a full competitive landscape.',
    'For live state, consult taostats and the subnet operator\'s own channels rather than this page.',
    'Status: parked in opentao\'s rich-profile registry. <a href="#customer" style="color: var(--accent);">See competitive landscape ↓</a>',
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
  competitive: { scope: 'parked', rows: [
    { name: 'Parked', subtitle: 'SN73', isSelf: true, approach: 'Not profiled in this dataset.', access: 'n/a', accessTone: 'closed', differentiator: 'Stub entry — see taostats for live state.' },
  ], note: 'Competitive landscape will be authored when the slot has a verified, stable operator profile.' },
  team: { intro: ['Operator not verified for this profile.', 'Will be filled in once roadmap and ownership are stable.'], founders: [{ initials: '??', gradient: 'v', name: '[Operator name]', role: 'Subnet owner', bio: 'Owner identity not verified in this dataset.' }], size: 'n/a', founded: 'n/a', based: 'n/a', backers: 'Not publicly disclosed.', placeholder: true },
  milestones: [{ date: '2026·05', text: 'Stub entry created in opentao registry.' }],
  join: { title: 'Check live state on taostats', body: 'Use taostats.io/subnets/73/ for current emissions and registration data.', asideNote: 'No operator endpoint verified for this stub.' },
  tags: ['parked'],
  external: { taostats: 'https://taostats.io/subnets/73/' },
};
