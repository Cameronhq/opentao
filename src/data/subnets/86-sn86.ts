import type { RichSubnet } from '../subnet-rich';

export const sn86: RichSubnet = {
  slug: '86-sn86',
  netuid: 86,
  name: 'Subnet 86',
  shortPitch: 'Active subnet with limited public branding under the ⚒ identity.',
  overview: [
    'Subnet 86 is an active Bittensor subnet whose taostats identity is the hammer-and-pickaxe symbol "⚒" rather than a full brand name. As of mid-2026 the slot is registered and emitting, but public-facing materials (website, documentation, official blog) are minimal, which is why discovery tools surface it under the bare "SN86" label.',
    'What is visible from secondary sources is operational rather than product-facing: a small core team has onboarded a senior data scientist and a fourth team member, and the operator has been described as taking a "methodical" approach with a "strong foundation." Beyond that, the specific mechanism — what miners produce and how validators score — is not yet widely documented.',
    'Until the operator publishes more, Subnet 86 is best treated as a placeholder profile. The slot is live and registered, but neither a customer-facing product nor a public technical spec is broadly available, so the cycle, scoring, and customer sections here are intentionally generic.',
    'One-line diff: a live but under-documented subnet — operator details and product surface are pending public disclosure. <a href="#customer" style="color: var(--accent);">See competitive landscape ↓</a>',
  ],
  cycle: {
    challenge: { actor: 'Validator', title: 'Issue task (TBD)', body: 'Validators on SN86 dispatch task payloads to miners; the specific task format is not yet publicly documented by the operator.', dataK: 'payload', dataV: 'undisclosed' },
    compute:   { actor: 'Miner',     title: 'Compute response', body: 'Miners produce responses to validator-issued challenges; the underlying compute is presumably standard subnet workload but is not yet publicly specified.', dataK: 'latency',  dataV: 'undisclosed' },
    score:     { actor: 'Validator', title: 'Score + weights', body: 'Validators score miner responses according to the subnet\'s reward function and submit a weight vector each tempo.', dataK: 'scale',    dataV: 'undisclosed' },
    settle:    { actor: 'Subtensor', title: 'Yuma → emission', body: "Every validator's weights, multiplied by their stake, aggregated by Yuma into one reward vector. TAO mints to top miners.", dataK: 'tempo', dataV: '~72 min · 24×/day' },
  },
  miner: {
    does: 'Operates a miner on SN86; the specific workload is not yet publicly documented by the operator.',
    input: 'Validator-issued challenge (format undisclosed)',
    output: 'Miner response (format undisclosed)',
    hardware: 'Not publicly documented',
    paidFor: 'Score under the subnet\'s reward function',
    paidVia: 'Per-tempo emission, score × validator stake',
  },
  validator: {
    does: 'Issues challenges and scores miner responses on SN86 under the subnet\'s reward function.',
    requires: 'Bittensor validator stake + subnet validator client',
    output: 'Weight vector across miner hotkeys per tempo',
    paidFor: 'Submitting weights that agree with consensus median',
    paidVia: 'Per-tempo emission, stake × consensus alignment',
  },
  scoring: {
    leadOneLine: 'Scoring details are not yet publicly documented by the operator.',
    explanation: [
      'The reward function and scoring mechanism for SN86 are not publicly described in detail. Until the operator publishes documentation, third-party observers can only confirm that the subnet is registered and emitting on chain.',
      'Once a public spec lands, this section will be updated with the actual scoring surface. In the meantime, prospective miners and integrators should expect to work directly with the operator to understand the mechanism.',
    ],
    cheatPath: 'Cannot be characterized without public scoring documentation. Any analysis of attack surface depends on knowing the validator reward function, which has not yet been disclosed.',
  },
  customer: {
    leadOneLine: 'Customer-facing product surface is not yet publicly described.',
    explanation: [
      'Because the operator has not published a public product page or whitepaper, the external customer profile is unclear. The subnet may be in an early build phase, or the operator may simply prefer minimal public disclosure during early development.',
      'Watchers should keep an eye on the operator\'s identity field on taostats and any forthcoming announcements to understand who SN86 ultimately serves.',
    ],
  },
  competitive: {
    scope: 'Active but under-documented subnet · 2026',
    rows: [
      { name: 'Subnet 86', subtitle: 'SN86', isSelf: true, approach: 'Registered and emitting under the "⚒" identity; specific mechanism not yet publicly documented.', access: 'open · subnet', accessTone: 'open', differentiator: 'Live netuid awaiting public product disclosure from the operator.' },
      { name: '[Unknown peer A]', approach: 'Comparison requires SN86\'s public spec; pending operator disclosure.', access: 'n/a', accessTone: 'open', differentiator: 'Cannot be characterized without a public product surface.' },
      { name: '[Unknown peer B]', approach: 'Comparison requires SN86\'s public spec; pending operator disclosure.', access: 'n/a', accessTone: 'open', differentiator: 'Cannot be characterized without a public product surface.' },
      { name: '[Unknown peer C]', approach: 'Comparison requires SN86\'s public spec; pending operator disclosure.', access: 'n/a', accessTone: 'open', differentiator: 'Cannot be characterized without a public product surface.' },
      { name: '[Unknown peer D]', approach: 'Comparison requires SN86\'s public spec; pending operator disclosure.', access: 'n/a', accessTone: 'open', differentiator: 'Cannot be characterized without a public product surface.' },
    ],
    note: 'Without a published product spec, a meaningful competitive landscape for SN86 cannot yet be drawn. This row set is a placeholder pending operator disclosure.',
  },
  team: {
    intro: [
      'Subnet 86 is operated by a small core team that uses the hammer-and-pickaxe ("⚒") glyph rather than a full brand name. Secondary sources have noted a "methodical approach" and the onboarding of a senior data scientist plus a fourth team member.',
      'Public bios are not extensively available; this section will be updated once the operator publishes a website, GitHub organization, or formal team page.',
    ],
    founders: [
      { initials: '??', gradient: 'a', name: '[Founder name]', role: 'Subnet owner / SN86', bio: 'Operator of SN86; identity is publicly minimal beyond the "⚒" subnet glyph.' },
    ],
    size: 'Small core team (~4 reported)',
    founded: 'Not publicly disclosed',
    based: 'Not publicly disclosed',
    backers: 'Not publicly disclosed.',
    placeholder: true,
  },
  milestones: [
    { date: '2025–26', text: 'Subnet 86 registered and emitting on Bittensor under the "⚒" identity.' },
    { date: '2026', text: 'Operator reportedly onboarded a senior data scientist and fourth team member.' },
  ],
  join: {
    title: 'Watch SN86 for an official announcement',
    body: 'There is no published miner / validator onboarding guide for Subnet 86 yet. Prospective participants should monitor the taostats subnet page and any operator social channels for the public release of documentation.',
    asideNote: 'Treat this profile as a placeholder until the operator publishes product material.',
  },
  tags: ['unannounced', 'early-stage'],
  external: {
    taostats: 'https://taostats.io/subnets/86/',
  },
};
