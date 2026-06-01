import type { RichSubnet } from '../subnet-rich';

// Minimal stub: SN125 ("8 Ball") is registered on Bittensor and tracked by
// taostats / subnetalpha / bittensor.ai, but the team has not published a
// public description, GitHub, or roadmap as of 2026·05. Promote to a full
// rich entry once primary sources are available.
export const sn125: RichSubnet = {
  slug: '125-8-ball',
  netuid: 125,
  name: '8 Ball',
  shortPitch: '8 Ball is registered as Subnet 125; public details are limited.',
  overview: [
    '8 Ball is Bittensor Subnet 125. It is registered and tracked by taostats, subnetalpha, and the official bittensor.ai subnet directory, but the operator has not published a public technical write-up, website, or GitHub at the time of writing.',
    'Without an authoritative source, OpenTAO does not infer a mechanism or customer for this subnet. This page will be expanded once the team publishes documentation or a community write-up that can be cited.',
    'For live emission, price, and validator data, see the taostats link below.',
    'If you operate or build on Subnet 125, reach out so the entry can be filled in with primary-source detail. <a href="#customer" style="color: var(--accent);">See competitive landscape ↓</a>',
  ],
  cycle: {
    challenge: { actor: 'Validator', title: 'Issue task', body: 'Mechanism not yet publicly documented.', dataK: 'payload', dataV: 'not disclosed' },
    compute:   { actor: 'Miner',     title: 'Compute response', body: 'Mechanism not yet publicly documented.', dataK: 'latency',  dataV: 'not disclosed' },
    score:     { actor: 'Validator', title: 'Score response', body: 'Mechanism not yet publicly documented.', dataK: 'scale',    dataV: 'not disclosed' },
    settle:    { actor: 'Subtensor', title: 'Yuma → emission', body: "Every validator's weights, multiplied by their stake, aggregated by Yuma into one reward vector. TAO mints to top miners.", dataK: 'tempo', dataV: '~72 min · 24×/day' },
  },
  miner:     { does: 'Not publicly documented.', input: 'Not publicly documented.', output: 'Not publicly documented.', hardware: 'Not publicly documented.', paidFor: 'Not publicly documented.', paidVia: 'Per-tempo emission, score × validator stake' },
  validator: { does: 'Not publicly documented.', requires: 'Bittensor validator stake.', output: 'Not publicly documented.', paidFor: 'Submitting weights that agree with consensus median', paidVia: 'Per-tempo emission, stake × consensus alignment' },
  scoring:   { leadOneLine: 'Scoring rule not publicly documented.', explanation: ['No primary-source description of the SN125 scoring mechanism is available at this time.', 'The subnet is live and emitting on Bittensor; the OpenTAO entry will be filled in once the team publishes a technical write-up.'], cheatPath: 'Unknown until the scoring rule is published.' },
  customer:  { leadOneLine: 'Customer surface not yet publicly described.', explanation: ['No team write-up or public roadmap currently identifies the customer.', 'Please check the taostats link for live activity, and watch the Bittensor subnet directory for a forthcoming announcement.'] },
  competitive: { scope: 'subnet 125 · public details limited', rows: [
    { name: '8 Ball', subtitle: 'SN125', isSelf: true, approach: 'Mechanism and product not yet publicly documented.', access: 'subnet active · docs pending', accessTone: 'open', differentiator: 'Listed in the Bittensor directory but lacks a published technical write-up.' },
  ], note: 'A competitive comparison will be added once the team or community publishes primary-source documentation describing the subnet\'s mechanism and target customer.' },
  team: {
    intro: ['Team behind Subnet 125 ("8 Ball") is not publicly disclosed.', 'No founder names, location, or backers have been published in primary sources at this time.'],
    founders: [{ initials: '8B', gradient: 'v', name: '[Founder 1 name]', role: 'Operator · SN125', bio: 'Team identity not publicly disclosed.' }],
    size: 'Not publicly disclosed',
    founded: 'Not publicly disclosed',
    based: 'Not publicly disclosed',
    backers: 'Not publicly disclosed.',
    placeholder: true,
  },
  milestones: [{ date: '2025', text: 'SN125 ("8 Ball") registered and listed in the Bittensor subnet directory.' }],
  join: { title: 'Help document SN125', body: 'If you mine, validate, or build on 8 Ball, share a primary-source write-up so this entry can be expanded.', asideNote: 'Live data: taostats.io/subnets/125/.' },
  tags: ['undocumented'],
  external: { taostats: 'https://taostats.io/subnets/125/' },
};
