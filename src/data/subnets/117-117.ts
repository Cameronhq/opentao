import type { RichSubnet } from '../subnet-rich';

// SN117 is currently unnamed / dormant on the registry. No public site,
// GitHub repo, or operator identity was discoverable as of May 2026.
// This is a minimal placeholder entry — update once the subnet ships content.

export const sn117: RichSubnet = {
  slug: '117-117',
  netuid: 117,
  name: 'Subnet 117',
  shortPitch: 'Bittensor subnet 117 — no public identity or specification yet.',
  overview: [
    'Subnet 117 is registered on the Bittensor metagraph but has no public name, website, GitHub repository, or operator identity discoverable as of May 2026. The slot exists in the registry; the content does not.',
    'Subnets in this state are typically newly minted slots awaiting team buildout, dormant projects between iterations, or stealth-mode efforts that have not yet revealed themselves to the ecosystem.',
    'No documented mining or validation specification, no scoring rules, no commercial pitch.',
    'Check back once the operator publishes a website, GitHub repo, or X account. <a href="#customer" style="color: var(--accent);">See competitive landscape ↓</a>',
  ],
  cycle: {
    challenge: { actor: 'Validator', title: 'TBD', body: 'No challenge specification published yet.', dataK: 'payload', dataV: 'unspecified' },
    compute: { actor: 'Miner', title: 'TBD', body: 'No mining specification published yet.', dataK: 'latency', dataV: 'unspecified' },
    score: { actor: 'Validator', title: 'TBD', body: 'No scoring specification published yet.', dataK: 'scale', dataV: 'unspecified' },
    settle: { actor: 'Subtensor', title: 'Yuma → emission', body: "Every validator's weights, multiplied by their stake, aggregated by Yuma into one reward vector. TAO mints to top miners.", dataK: 'tempo', dataV: '~72 min · 24×/day' },
  },
  miner: { does: 'No public specification.', input: 'Unknown.', output: 'Unknown.', hardware: 'Unknown.', paidFor: 'Unknown', paidVia: 'Per-tempo emission, score × validator stake' },
  validator: { does: 'No public specification.', requires: 'Unknown.', output: 'Unknown.', paidFor: 'Submitting weights that agree with consensus median', paidVia: 'Per-tempo emission, stake × consensus alignment' },
  scoring: { leadOneLine: 'No scoring rules published.', explanation: ['Subnet 117 has not published a scoring specification, a reference miner client, or a validator client as of May 2026.', 'The slot exists on the metagraph; the operator has not yet identified themselves publicly.'], cheatPath: 'Not applicable — no live workload to grade.' },
  customer: { leadOneLine: 'No published customer or use case.', explanation: ['No commercial pitch, marketing site, or product surface exists for subnet 117 as of May 2026.', 'Without a published specification, there is no buyer persona to describe.'] },
  competitive: { scope: '2026 · undefined', rows: [
    { name: 'Subnet 117', subtitle: 'SN117', isSelf: true, approach: 'No published approach', access: 'unknown', accessTone: 'closed', differentiator: 'No published differentiator' },
  ], note: 'No competitive positioning is possible until the operator publishes a specification.' },
  team: { intro: ['No public team information available for subnet 117 as of May 2026.', 'The slot is registered but no operator identity has been disclosed.'], founders: [{ initials: '117', gradient: 'a', name: '[Founder 1 name]', role: 'Operator', bio: 'Operator identity not publicly disclosed.' }], size: 'Not publicly disclosed.', founded: 'Unknown', based: 'Unknown', backers: 'Not publicly disclosed.', placeholder: true },
  milestones: [{ date: '2026·05', text: 'No public milestones — subnet 117 has no published identity yet.' }],
  join: { title: 'Wait for the operator to surface', body: 'No public mining or validation specification has been released for subnet 117. Watch the taostats page for updates.', asideNote: 'Last checked May 2026.' },
  tags: [],
  external: { taostats: 'https://taostats.io/subnets/117/' },
};
