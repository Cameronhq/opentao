import type { RichSubnet } from '../subnet-rich';

// Subnet 69 is currently unnamed / undocumented in public Bittensor subnet
// registries (taostats subnets-infos lists it as "Unknown" with no description
// or GitHub). Treating as a placeholder pending an operator landing the slot.
export const sn69: RichSubnet = {
  slug: '69-69',
  netuid: 69,
  name: '69',
  shortPitch: 'Subnet 69 — no public operator profile or product yet.',
  overview: [
    'Subnet 69 currently has no public name, no documented product, no team profile, and no GitHub repository linked in the canonical Bittensor subnets registry. The taostats subnets-infos data lists the slot as "Unknown" with no description.',
    'Treat this page as a placeholder until an operator publishes a website, repo, or substantive on-chain identity.',
    'Check taostats for the most recent on-chain owner key, emission, and validator/miner participation before treating this slot as active.',
    'No competitive landscape can be drawn while the subnet has no announced product surface.',
  ],
  cycle: {
    challenge: { actor: 'Validator', title: 'Not documented', body: 'No public challenge spec for subnet 69 at time of writing.', dataK: 'payload', dataV: 'n/a' },
    compute:   { actor: 'Miner',     title: 'Not documented', body: 'No public miner role for subnet 69 at time of writing.', dataK: 'latency',  dataV: 'n/a' },
    score:     { actor: 'Validator', title: 'Not documented', body: 'No public scoring rubric for subnet 69 at time of writing.', dataK: 'scale',    dataV: 'n/a' },
    settle:    { actor: 'Subtensor', title: 'Yuma → emission', body: "Every validator's weights, multiplied by their stake, aggregated by Yuma into one reward vector. TAO mints to top miners.", dataK: 'tempo', dataV: '~72 min · 24×/day' },
  },
  miner:     { does: 'Not documented.', input: 'Not documented.', output: 'Not documented.', hardware: 'Not documented.', paidFor: 'Not documented.', paidVia: 'Per-tempo emission, score × validator stake' },
  validator: { does: 'Not documented.', requires: 'Not documented.', output: 'Not documented.', paidFor: 'Submitting weights that agree with consensus median', paidVia: 'Per-tempo emission, stake × consensus alignment' },
  scoring:   { leadOneLine: 'Not documented.', explanation: ['No public scoring documentation exists for subnet 69 at the time of writing.', 'Check taostats for current owner key and any subsequent operator announcements.'], cheatPath: 'n/a — no scoring spec to game.' },
  customer:  { leadOneLine: 'Not documented.', explanation: ['No product surface or customer thesis has been published for subnet 69.', 'Until an operator lands the slot, there is no buyer to characterize.'] },
  competitive: { scope: '2026 · n/a', rows: [
    { name: '69', subtitle: 'SN69', isSelf: true, approach: 'No public product.', access: 'unknown', accessTone: 'open', differentiator: 'No documented differentiator.' },
  ], note: 'No competitive landscape can be drawn while subnet 69 has no announced product or operator.' },
  team: { intro: ['No public team has claimed subnet 69 in the canonical Bittensor subnet registry.', 'On-chain owner key is visible on taostats but no website, GitHub, or social presence is attached.'], founders: [{ initials: 'NA', gradient: 'v', name: '[Founder 1 name]', role: 'Operator', bio: 'No public identity attached to subnet 69 at time of writing.' }], size: 'Unknown', founded: 'Unknown', based: 'Unknown', backers: 'Unknown', placeholder: true },
  milestones: [{ date: '2026·05', text: 'Subnet 69 slot exists on chain with owner key visible but no public product or team profile.' }],
  join: { title: 'Slot is open — watch this space', body: 'No live product to mine or validate yet. Track taostats for owner-key activity and any subsequent operator announcement.', asideNote: 'Check taostats and Bittensor Discord for the latest.' },
  tags: ['unannounced'],
  external: { taostats: 'https://taostats.io/subnets/69/' },
};
