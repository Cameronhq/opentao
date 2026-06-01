import type { RichSubnet } from '../subnet-rich';

export const sn81: RichSubnet = {
  slug: '81-deprecated',
  netuid: 81,
  name: 'Subnet 81 (Deprecated)',
  shortPitch: 'Deprecated subnet slot — formerly Grail under Covenant AI.',
  overview: [
    'Subnet 81 is currently dormant. The slot was previously operated as "Grail" by Covenant AI — the same team behind Subnets 3 (Templar) and 39 (Basilica) — which used Bittensor to run a permissionless distributed pretraining experiment that produced Covenant-72B, a 72-billion-parameter LLM trained across 70+ contributors on commodity hardware.',
    'In April 2026 Covenant AI publicly exited Bittensor after a dispute with the Opentensor Foundation; the founder alleged that leadership unilaterally deprecated Covenant\'s subnet infrastructure, suspended emissions, and overrode the team\'s moderation authority. Subnet 81 (Grail) was deprecated along with the other Covenant slots.',
    'Today the netuid is a placeholder. There is no active operator, no live mechanism, and no buyer. Some community members have discussed organizing to keep work going on subnets 3, 39, and 81, but no production operator has formally taken over the slot. Treat this entry as an inventory record, not a product profile.',
    'One-line diff: dormant netuid awaiting a new operator. <a href="#customer" style="color: var(--accent);">See competitive landscape ↓</a>',
  ],
  cycle: {
    challenge: { actor: 'Validator', title: 'No active task', body: 'Subnet 81 is deprecated; no challenge mechanism is actively running.', dataK: 'status', dataV: 'deprecated' },
    compute:   { actor: 'Miner',     title: 'No active miners', body: 'Subnet 81 is deprecated; no miner workload is being assigned.', dataK: 'status', dataV: 'deprecated' },
    score:     { actor: 'Validator', title: 'No scoring', body: 'Subnet 81 is deprecated; no scoring is taking place.', dataK: 'status', dataV: 'deprecated' },
    settle:    { actor: 'Subtensor', title: 'Yuma → emission', body: "Every validator's weights, multiplied by their stake, aggregated by Yuma into one reward vector. TAO mints to top miners.", dataK: 'tempo', dataV: '~72 min · 24×/day' },
  },
  miner: {
    does: 'No active miner role — subnet deprecated.',
    input: 'n/a',
    output: 'n/a',
    hardware: 'n/a',
    paidFor: 'Subnet is currently inactive.',
    paidVia: 'Per-tempo emission, score × validator stake',
  },
  validator: {
    does: 'No active validator role — subnet deprecated.',
    requires: 'n/a',
    output: 'n/a',
    paidFor: 'Submitting weights that agree with consensus median',
    paidVia: 'Per-tempo emission, stake × consensus alignment',
  },
  scoring: {
    leadOneLine: 'No active scoring mechanism — subnet deprecated after Covenant AI exit.',
    explanation: [
      'Under Covenant AI, Grail scored contributors on partial gradients and updates feeding the Covenant-72B pretraining run, with validators aggregating contributions into a single global model. After the April 2026 dispute and exit, the subnet was deprecated on chain and that mechanism is no longer running.',
      'The slot will only become meaningful if a new operator registers a fresh mechanism on the same netuid. Until then, queries against this subnet should treat it as vestigial.',
    ],
    cheatPath: 'No cheat path applies — there is no active scoring mechanism to exploit.',
  },
  customer: {
    leadOneLine: 'No active customer — subnet is dormant.',
    explanation: [
      'The previous customer base — researchers and partners interested in decentralized LLM pretraining — followed Covenant AI off Bittensor when the team exited. There is no current external buyer.',
      'A future operator could re-purpose the slot, but until that happens there is no commercial use to describe.',
    ],
  },
  competitive: {
    scope: 'deprecated · 2026',
    rows: [
      { name: 'Subnet 81', subtitle: 'SN81', isSelf: true, approach: 'Currently dormant after Covenant AI deprecation in April 2026.', access: 'closed · n/a', accessTone: 'closed', differentiator: 'Inactive netuid with no current operator.' },
    ],
    note: 'Subnet 81 has no active competitors because it has no active mechanism. The slot is a historical artifact of the Covenant AI exit alongside subnets 3 and 39.',
  },
  team: {
    intro: [
      'Subnet 81 has no active operator. The slot was previously run by Covenant AI under the Grail brand until they publicly exited Bittensor in April 2026.',
      'Any future operator listed here would be a new entity taking over the netuid. Treat this section as a placeholder.',
    ],
    founders: [
      { initials: '??', gradient: 'g', name: '[Operator unknown]', role: 'No active operator', bio: 'Subnet 81 is deprecated. No team is currently operating this netuid.' },
    ],
    size: 'n/a',
    founded: 'n/a',
    based: 'n/a',
    backers: 'n/a',
    placeholder: true,
  },
  milestones: [
    { date: '2026·04', text: 'Covenant AI publicly exits Bittensor; Subnet 81 (Grail) deprecated alongside SN3 and SN39.' },
  ],
  join: {
    title: 'No active call to participate',
    body: 'Subnet 81 is currently dormant. There is no miner or validator workload to join, and no operator publishing a setup guide.',
    asideNote: 'Check the taostats subnet page for live status before assuming any of this is current.',
  },
  tags: ['deprecated', 'dormant'],
  external: {
    taostats: 'https://taostats.io/subnets/81/',
  },
};
