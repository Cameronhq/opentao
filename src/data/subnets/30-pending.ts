import type { RichSubnet } from '../subnet-rich';

// Subnet 30 has gone through multiple identities:
//   - Originally WOMBO (text-to-image, by Wombo.ai)
//   - Later registered as Bettensor (sports prediction marketplace)
// As of mid-2026, the slot is shown as "Pending" on indexers — operator has
// not declared a current identity. Treat as dormant until a new owner re-registers.

export const sn30: RichSubnet = {
  slug: '30-pending',
  netuid: 30,
  name: 'Pending',
  shortPitch: 'Subnet 30 is currently in a pending / unassigned state on Bittensor.',
  overview: [
    'Subnet 30 is currently in a "Pending" state. The slot has gone through multiple identities since launch — first as WOMBO (text-to-image generation, by the consumer AI app Wombo.ai), then as Bettensor (a sports-prediction marketplace) — and is at present not actively run under a declared brand on the standard subnet indexers.',
    'Validators and miners may still be registered on the netuid, but there is no current operator-published roadmap, scoring spec, or customer product to point at. Treat anything published under SN30 as historical context rather than current product.',
    'For up-to-date status, always check taostats.io/subnets/30 directly — under dTAO and the September 2025 deregistration mechanism, a subnet identity can be re-claimed by a new operator at any time.',
    'No active customer pitch exists in this state. <a href="#customer" style="color: var(--accent);">See competitive landscape ↓</a>',
  ],
  cycle: {
    challenge: { actor: 'Validator', title: 'No active task', body: 'No active validator-issued task is currently published for subnet 30 under a declared operator.', dataK: 'payload', dataV: 'n/a' },
    compute:   { actor: 'Miner',     title: 'No active work', body: 'Miners are not currently performing a publicly-documented task on this subnet.', dataK: 'latency',  dataV: 'n/a' },
    score:     { actor: 'Validator', title: 'No live scoring', body: 'No active scoring spec is currently published; on-chain weights may still be written by registered validators.', dataK: 'scale', dataV: 'n/a' },
    settle:    { actor: 'Subtensor', title: 'Yuma → emission', body: "Every validator's weights, multiplied by their stake, aggregated by Yuma into one reward vector. TAO mints to top miners.", dataK: 'tempo', dataV: '~72 min · 24×/day' },
  },
  miner: {
    does: 'No active miner role is publicly defined while the subnet is in a pending state.',
    input: 'n/a',
    output: 'n/a',
    hardware: 'n/a',
    paidFor: 'n/a',
    paidVia: 'Per-tempo emission, score × validator stake',
  },
  validator: {
    does: 'No active validator workflow is publicly defined under the current "Pending" state.',
    requires: 'n/a',
    output: 'n/a',
    paidFor: 'Submitting weights that agree with consensus median',
    paidVia: 'Per-tempo emission, stake × consensus alignment',
  },
  scoring: {
    leadOneLine: 'No active scoring mechanism is currently published for subnet 30.',
    explanation: [
      'Under prior identities the subnet had scoring specs — WOMBO scored miners on diffusion-step similarity and per-second throughput; Bettensor scored prediction-market accuracy. Neither of those scoring specs is the current active mechanism.',
      'Until a new operator re-registers and publishes a fresh validator codebase, there is no on-record live scoring story for SN30. Anyone running on the netuid today is operating off legacy or experimental code.',
    ],
    cheatPath: 'Without an active scoring mechanism there is nothing meaningful to attack — the most relevant risk is buying an unallocated alpha token thinking there is product behind it.',
  },
  customer: {
    leadOneLine: 'No active customer-facing product is currently associated with subnet 30.',
    explanation: [
      'Under prior identities the customers were the WOMBO consumer app (~200K DAU at the time of subnet 30\'s launch) and later sports-prediction users via Bettensor. Both have since stepped away from active subnet operation.',
      'Until a new team re-registers the slot, SN30 should be evaluated as an empty netuid rather than a live product. Always confirm the current operator on taostats before treating any historical material as current.',
    ],
  },
  competitive: {
    scope: 'inactive / pending · 2026',
    rows: [
      { name: 'Pending', subtitle: 'SN30', isSelf: true, approach: 'Currently in a pending / unassigned state on Bittensor — no active operator.', access: 'n/a', accessTone: 'closed', differentiator: 'No active product to compare; historical identities (WOMBO, Bettensor) are no longer running on this slot.' },
      { name: 'WOMBO (former operator)', approach: 'Consumer text-to-image app that previously decentralized its generation pipeline on SN30.', access: 'closed · app', accessTone: 'closed', differentiator: 'Now operates independently of Bittensor.' },
      { name: 'Bettensor (former identity)', approach: 'Sports-prediction marketplace previously registered as the SN30 identity.', access: 'closed', accessTone: 'closed', differentiator: 'No longer the active operator of the netuid.' },
      { name: 'SN64 Chutes', approach: 'Serverless inference subnet that today serves the kind of image/text-gen workload SN30 originally tried to host.', access: 'open · API', accessTone: 'open', differentiator: 'Active product with real traffic; SN30 has none today.' },
      { name: 'SN39 EdgeMaxxing', approach: 'Wombo\'s newer subnet focused on optimizing on-device inference; effectively where Wombo\'s subnet work moved.', access: 'open', accessTone: 'open', differentiator: 'Where the WOMBO team\'s incentive-design energy actually went.' },
    ],
    note: 'There is no active competitive landscape to map for SN30 in its current pending state. Anyone evaluating this slot should wait for a new operator to register, publish a new scoring spec, and ship a customer-facing product before drawing comparisons.',
  },
  team: {
    intro: [
      'There is no currently-declared operator of subnet 30 in 2026; previous identities included WOMBO (Wombo.ai) and Bettensor.',
      'A new operator can register the slot at any time under the post-September-2025 deregistration mechanism; check taostats.io/subnets/30 for the latest declared identity before treating any of this file as current.',
    ],
    founders: [
      { initials: 'PE', gradient: 'g', name: '[Pending operator]', role: 'No currently-declared operator', bio: 'Subnet 30 is presently in a pending state; previous identities — WOMBO and Bettensor — are no longer publicly running this netuid.' },
    ],
    size: 'n/a', founded: '2023 (original registration)', based: 'n/a',
    backers: 'No active operator. Historical: WOMBO was a venture-backed consumer AI app.',
    placeholder: true,
  },
  milestones: [
    { date: '2023', text: 'Subnet 30 originally registered as WOMBO, by the consumer AI app Wombo.ai (~100M lifetime downloads, ~200K DAU at the time).' },
    { date: '2024', text: 'Subnet identity changes; Bettensor (sports-prediction marketplace) appears as a subsequent operator of the slot.' },
    { date: '2026', text: 'Slot currently shown as "Pending" on indexers; no actively-declared operator publishing roadmap or product.' },
  ],
  join: {
    title: 'Check taostats before treating SN30 as live',
    body: 'Subnet 30 has no currently-declared operator. Before mining, validating, or buying the alpha token, confirm the latest identity at taostats.io/subnets/30.',
    asideNote: 'New owners may re-register the slot under the post-September-2025 deregistration mechanism.',
  },
  tags: ['pending', 'inactive', 'historical'],
  external: {
    taostats: 'https://taostats.io/subnets/30/',
  },
};
