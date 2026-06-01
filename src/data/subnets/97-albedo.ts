import type { RichSubnet } from '../subnet-rich';
export const sn97: RichSubnet = {
  slug: '97-albedo', netuid: 97, name: 'Albedo',
  shortPitch: 'Bittensor subnet 97, currently labeled Albedo on taostats — product details are evolving.',
  overview: [
    'Albedo (SN97) is the current taostats label for Bittensor subnet 97 as of mid-2026. The slot has seen multiple identities — earlier in its life it operated as "Distil" (competitive model distillation of Qwen3.5-35B-A3B) and at one point as "FlameWire" (decentralized RPC infrastructure) — reflecting how subnet ownership and branding can shift between cohorts.',
    'As Albedo, the public-facing product surface is thin in mid-2026 search results, and the prior occupants (Distil, FlameWire) have either been deregistered or rebranded. The taostats explorer shows the current name as Albedo with market data but no detailed mission statement, suggesting either a stealth phase, an active rebrand in progress, or a recently re-registered slot.',
    'This is a feature, not a bug, of how Bittensor subnet slots work: the netuid persists, but the team operating it can change via the deregistration cycle. Subnet 97 has been flagged by community observers in late 2025 for deregistration risk, and what now operates as "Albedo" may be a fresh team that re-registered the slot.',
    'Until the Albedo team publishes a clear product spec and consumer pipeline, this entry should be treated as transitional. <a href="#customer" style="color: var(--accent);">See competitive landscape ↓</a>',
  ],
  cycle: {
    challenge: { actor: 'Validator', title: 'Task issued', body: 'Validator issues a task to miners — exact protocol not publicly detailed under the current Albedo branding.', dataK: 'payload', dataV: 'undisclosed' },
    compute:   { actor: 'Miner',     title: 'Compute response', body: 'Miner executes its assigned work and returns the response for validator scoring.', dataK: 'latency',  dataV: 'workload-dependent' },
    score:     { actor: 'Validator', title: 'Score output', body: 'Validators score miner outputs against a quality metric — current scoring spec not publicly disclosed.', dataK: 'scale',    dataV: 'quality vs. baseline' },
    settle:    { actor: 'Subtensor', title: 'Yuma → emission', body: "Every validator's weights, multiplied by their stake, aggregated by Yuma into one reward vector. TAO mints to top miners.", dataK: 'tempo', dataV: '~72 min · 24×/day' },
  },
  miner:     { does: 'Executes assigned work — specific task type not publicly detailed under the Albedo branding.', input: 'Validator-issued tasks (undisclosed format)', output: 'Workload results scored by validators', hardware: 'Not publicly disclosed', paidFor: 'Quality on assigned tasks — current scoring rule undisclosed', paidVia: 'Per-tempo emission, score × validator stake' },
  validator: { does: 'Issues tasks and scores miner outputs — current scoring methodology not publicly detailed.', requires: 'Task generation + scoring pipeline (specifics not public)', output: 'Per-miner weights tied to current scoring rule', paidFor: 'Submitting weights that agree with consensus median', paidVia: 'Per-tempo emission, stake × consensus alignment' },
  scoring:   {
    leadOneLine: 'Current scoring rule not publicly disclosed under the Albedo branding.',
    explanation: [
      'SN97 has historically operated under multiple identities (Distil, FlameWire). Under the prior Distil branding, validators scored miner outputs on KL divergence against a teacher LLM across the full 248k-token vocabulary, plus a 17-axis composite covering math, code, reasoning, robustness, and other capability metrics.',
      'Whether the Albedo branding inherits any of that scoring stack or operates an entirely different protocol is not clearly documented in publicly available sources as of mid-2026. Check the current taostats page and the current operator\'s repo for authoritative scoring details.',
    ],
    cheatPath: 'Cannot enumerate cheat paths without a confirmed current scoring rule. Verify the current spec directly with the operator.',
  },
  customer:  {
    leadOneLine: 'Customer pipeline not publicly disclosed under the current Albedo branding.',
    explanation: [
      'The prior Distil incarnation targeted developers needing efficient distilled open-source LLMs; the prior FlameWire incarnation targeted blockchain developers needing decentralized RPC infrastructure. The current Albedo operator\'s consumer surface is not publicly detailed.',
      'For now, treat SN97 as an in-transition slot. Watch the current operator\'s public materials before mining or validating, and verify directly that the netuid you\'re engaging with matches the product you expect.',
    ],
  },
  competitive: { scope: '2026 · subnet in transition', rows: [
    { name: 'Albedo', subtitle: 'SN97', isSelf: true, approach: 'Current product surface not publicly detailed', access: 'open · API', accessTone: 'open', differentiator: 'Subnet slot currently labeled Albedo on taostats; positioning evolving' },
    { name: 'Distil (prior SN97 occupant)', approach: 'Competitive model distillation of Qwen3.5-35B-A3B', access: 'open · API', accessTone: 'open', differentiator: 'Earlier branding of SN97; distillation use-case' },
    { name: 'FlameWire (prior SN97 occupant)', approach: 'Decentralized RPC / API services for blockchains', access: 'open · API', accessTone: 'open', differentiator: 'Earlier branding of SN97; blockchain RPC use-case' },
    { name: 'Chutes', subtitle: 'SN64', approach: 'Serverless inference and hosted models', access: 'open · API', accessTone: 'open', differentiator: 'Established inference subnet, large miner pool' },
    { name: 'Targon', subtitle: 'SN4', approach: 'Verified LLM inference', access: 'open · API', accessTone: 'open', differentiator: 'OpenAI-compatible inference at scale' },
  ], note: 'SN97 is one of several Bittensor slots that have rotated branding through 2025-2026. The current Albedo label should be cross-checked against the live operator\'s materials before assuming continuity with prior incarnations.' },
  team: {
    intro: [
      'The current Albedo team operating SN97 is not prominently identified in publicly available materials as of mid-2026. Prior incarnations of the slot were operated by unarbos (Distil) and UnitOne Labs (FlameWire).',
      'Check the current taostats subnet 97 page for the live owner coldkey and any linked external resources.',
    ],
    founders: [{ initials: 'AL', gradient: 'g', name: '[Albedo team]', role: 'Current operators', bio: 'Current operators of SN97 under the Albedo branding — public details limited.' }],
    size: 'Not publicly disclosed', founded: 'Rebrand date not publicly disclosed', based: 'Not publicly disclosed', backers: 'Not publicly disclosed.', placeholder: true,
  },
  milestones: [
    { date: '2025', text: 'Subnet 97 launches initially under the Distil branding (competitive model distillation).' },
    { date: '2025·Q4', text: 'Slot reportedly operates under FlameWire branding (decentralized RPC) per community reporting.' },
    { date: '2026', text: 'Taostats now lists subnet 97 as Albedo — current branding and operator transition.' },
  ],
  join: { title: 'Verify before engaging', body: 'Treat SN97 as a slot in transition. Confirm the current operator coldkey, repo, and scoring spec on taostats before mining or validating against the Albedo branding.', asideNote: 'Subnet slot identity can change via the deregistration cycle — always verify continuity with the current operator before committing capital.' },
  tags: ['in-transition', 'evolving', 'unknown'],
  external: { taostats: 'https://taostats.io/subnets/97/' },
  tweets: [],
};
