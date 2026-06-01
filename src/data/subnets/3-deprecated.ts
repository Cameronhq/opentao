import type { RichSubnet } from '../subnet-rich';

export const sn3: RichSubnet = {
  slug: '3-deprecated',
  netuid: 3,
  name: 'Subnet 3 (Deprecated)',

  shortPitch: 'Deprecated subnet slot — formerly Templar, no active operator.',

  overview: [
    'Subnet 3 is currently dormant. The slot was previously operated as Templar by Covenant AI, which ran a high-profile distributed LLM pretraining experiment ("Templar 1B") before publicly exiting the Bittensor network in April 2026 amid a dispute with the Opentensor Foundation. The departure triggered a roughly 20% drawdown in TAO and is one of the more visible operator exits in the network\'s history.',
    'After the Covenant exit, Subnet 3 was deprecated on chain. There is no live operator, no scoring mechanism actively running, and no buyer. The netuid remains registered but the slot is effectively a placeholder — any future activity would require a new owner to take it over and re-bootstrap a fresh incentive mechanism. Treat this entry as an inventory record, not a product profile.',
  ],

  cycle: {
    challenge: { actor: 'Validator', title: 'No active task', body: 'Subnet 3 is deprecated. No challenge mechanism is actively running.', dataK: 'status', dataV: 'deprecated' },
    compute:   { actor: 'Miner',     title: 'No active miners', body: 'Subnet 3 is deprecated. No miner workload is being assigned.', dataK: 'status', dataV: 'deprecated' },
    score:     { actor: 'Validator', title: 'No scoring', body: 'Subnet 3 is deprecated. No scoring is taking place.', dataK: 'status', dataV: 'deprecated' },
    settle:    { actor: 'Subtensor', title: 'Yuma → emission', body: "Every validator's weights, multiplied by their stake, aggregated by Yuma into one reward vector. TAO mints to top miners.", dataK: 'tempo', dataV: '~72 min · 24×/day' },
  },

  miner: {
    does:     'No active miner role — subnet deprecated.',
    input:    'n/a',
    output:   'n/a',
    hardware: 'n/a',
    paidFor:  'Subnet is currently inactive.',
    paidVia:  'Per-tempo emission, score × validator stake',
  },
  validator: {
    does:     'No active validator role — subnet deprecated.',
    requires: 'n/a',
    output:   'n/a',
    paidFor:  'Submitting weights that agree with consensus median',
    paidVia:  'Per-tempo emission, stake × consensus alignment',
  },

  scoring: {
    leadOneLine: 'No active scoring mechanism — subnet deprecated after Covenant AI exit.',
    explanation: [
      'When the subnet was live under Covenant AI, the Templar mechanism scored miners on contributions to distributed LLM pretraining — gradients and partial updates aggregated by validators. Following the April 2026 dispute, the subnet was deprecated on chain and the mechanism is no longer actively running.',
      'The slot will likely be repurposed only if a new operator registers an entirely new mechanism. Until then, anyone querying this subnet should treat it as a vestigial netuid with no production behaviour to analyze.',
    ],
    cheatPath: 'No cheat path applies — there is no active scoring mechanism to exploit.',
  },

  customer: {
    leadOneLine: 'No active customer — subnet is dormant.',
    explanation: [
      'The previous Templar customer base — researchers interested in decentralized LLM pretraining — followed Covenant AI off Bittensor when they exited. There is no current external buyer.',
      'A future operator could re-purpose the slot, but until that happens there is no commercial use to describe.',
    ],
  },

  competitive: {
    scope: 'deprecated · 2026',
    rows: [
      { name: 'Subnet 3', subtitle: 'SN3', isSelf: true, approach: 'Currently dormant after Covenant AI deprecated the slot in April 2026.', access: 'closed · n/a', accessTone: 'closed', differentiator: 'Inactive netuid with no current operator.' },
    ],
    note: 'Subnet 3 has no active competitors because it has no active mechanism. The slot is a historical artifact of the Templar / Covenant AI exit; a competitive analysis only becomes meaningful if and when a new operator takes the netuid.',
  },

  team: {
    intro: [
      'Subnet 3 has no active operator. The slot was previously run by Covenant AI under the Templar brand until they publicly exited Bittensor in April 2026.',
      'Any future operator listed here would be a new entity taking over the netuid. Treat this section as a placeholder.',
    ],
    founders: [
      { initials: '??', gradient: 'g', name: '[Operator unknown]', role: 'No active operator', bio: 'Subnet 3 is deprecated. No team is currently operating this netuid.' },
    ],
    size: 'n/a',
    founded: 'n/a',
    based: 'n/a',
    backers: 'n/a',
    placeholder: true,
  },

  milestones: [
    { date: '2026·04', text: 'Covenant AI publicly exits Bittensor; Subnet 3 (Templar) deprecated.' },
  ],

  join: {
    title: 'No active call to participate',
    body: 'Subnet 3 is currently dormant. There is no miner or validator workload to join, and no operator publishing a setup guide.',
    asideNote: 'Check the taostats subnet page for live status before assuming any of this is current.',
  },

  tags: ['deprecated', 'dormant'],

  external: {
    taostats: 'https://taostats.io/subnets/3/',
  },
};
