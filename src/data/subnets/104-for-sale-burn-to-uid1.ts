import type { RichSubnet } from '../subnet-rich';

// Minimal stub: SN104 is publicly "for sale (burn to uid1)" — emissions are being
// burned to uid1 to preserve the slot's value while the owner looks for a buyer.
// No live validator/miner workload to profile.

export const sn104: RichSubnet = {
  slug: '104-for-sale-burn-to-uid1',
  netuid: 104,
  name: 'for sale (burn to uid1)',
  shortPitch: 'Subnet slot for sale — emissions burned to uid1, no live workload.',
  overview: [
    'Subnet 104 is publicly listed as "for sale", with emissions burned to uid1 to preserve the slot\'s value while the owner waits for a buyer. This is a holding pattern, not a live workload — there is no active challenge / compute / score loop to profile.',
    'In Bittensor parlance, "burn to uid1" is a defensive posture: rather than emitting TAO to a real miner/validator set that may no longer be running, the owner directs emission to a placeholder UID where it is effectively burned. This keeps the netuid alive and transferable without paying out to unproductive participants.',
    'For live state — current owner, asking price, and any planned restart — consult taostats and the owner\'s public channels rather than this page.',
    'Status: parked / for sale in opentao\'s rich-profile registry. <a href="#customer" style="color: var(--accent);">See competitive landscape ↓</a>',
  ],
  cycle: {
    challenge: { actor: 'Validator', title: 'n/a', body: 'No active challenge — emissions burning to uid1.', dataK: 'payload', dataV: 'burn' },
    compute:   { actor: 'Miner',     title: 'n/a', body: 'No active miner workload.', dataK: 'latency', dataV: 'n/a' },
    score:     { actor: 'Validator', title: 'n/a', body: 'No active scoring loop.', dataK: 'scale',   dataV: 'n/a' },
    settle:    { actor: 'Subtensor', title: 'Yuma → emission', body: "Every validator's weights, multiplied by their stake, aggregated by Yuma into one reward vector. TAO mints to top miners.", dataK: 'tempo', dataV: '~72 min · 24×/day' },
  },
  miner:     { does: 'Not active — slot is for sale.', input: 'n/a', output: 'n/a', hardware: 'n/a', paidFor: 'n/a (burn to uid1)', paidVia: 'Per-tempo emission, score × validator stake' },
  validator: { does: 'Not active — slot is for sale.', requires: 'n/a', output: 'n/a', paidFor: 'Submitting weights that agree with consensus median', paidVia: 'Per-tempo emission, stake × consensus alignment' },
  scoring:   { leadOneLine: 'No live scoring — emissions burning to uid1.', explanation: ['SN104 has paused experimentation and is parked until a buyer is found.', 'For any future restart, scoring details will be authored by the new operator.'], cheatPath: 'n/a' },
  customer:  { leadOneLine: 'Prospective buyer of the subnet slot.', explanation: ['The implied "customer" right now is a buyer interested in acquiring an active netuid without going through fresh registration economics.', 'Until a buyer takes over, there is no end-user product to evaluate.'] },
  competitive: { scope: 'for-sale subnet slots', rows: [
    { name: 'for sale (burn to uid1)', subtitle: 'SN104', isSelf: true, approach: 'Slot parked with emissions burned to uid1 while listed for sale.', access: 'for sale', accessTone: 'closed', differentiator: 'Stub entry — active workload returns when the slot is sold.' },
  ], note: 'Comparable to other parked/for-sale subnet slots on Bittensor; price discovery happens in OTC channels rather than on a public market.' },
  team: { intro: ['Operator is the current subnet owner who has elected to burn emissions to uid1 while seeking a buyer.', 'Public identity of the owner is not verified here — consult taostats and OTC channels for current state.'], founders: [{ initials: '??', gradient: 'v', name: '[Current owner]', role: 'Subnet owner (for sale)', bio: 'Owner has paused experimentation and is burning emissions to uid1 until the slot is sold.' }], size: 'n/a', founded: 'n/a', based: 'n/a', backers: 'Not publicly disclosed.', placeholder: true },
  milestones: [{ date: '2026·05', text: 'Slot publicly listed as for-sale; experimentation paused, emissions burning to uid1.' }],
  join: { title: 'Slot is for sale', body: 'There is no live workload to join. If you want to acquire SN104, find the owner via OTC channels referenced on taostats.', asideNote: 'Live state: taostats.io/subnets/104/.' },
  tags: ['for-sale', 'burn-to-uid1', 'parked'],
  external: { taostats: 'https://taostats.io/subnets/104/' },
};
