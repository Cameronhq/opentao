import type { RichSubnet } from '../subnet-rich';
export const sn95: RichSubnet = {
  slug: '95-95', netuid: 95, name: 'Actual Computer',
  shortPitch: 'Stealth-launched AI compute subnet operated by Actual Computer Inc. in Venice, California.',
  overview: [
    'Actual Computer (SN95) launched on Bittensor in October 2025 with one of the quietest rollouts in the ecosystem — no token campaign, no influencer push, just a registered subnet operated by Actual Computer Inc. out of Venice, California. The subnet\'s token price surged 110%+ in the weeks following launch, drawing community attention to the unusual stealth posture.',
    'Public materials are deliberately thin. The subnet\'s X presence (@actualputer) and the CEO\'s account (@Tom_A_Lynch) are followed by notable AI figures including Anthropic co-founder Jack Clark, which has fueled speculation about backing and partnerships. @somewheresy is publicly identified as working on the subnet.',
    'The product surface itself is not fully disclosed in public materials. The team positions Actual Computer as an AI compute / inference infrastructure play, with miners providing compute and validators measuring some quality metric — but precise scoring, target workloads, and customer pipeline have not been detailed publicly as of mid-2026.',
    'The "stealth-but-cracked-engineer" archetype has worked for prior subnets (Affine, Chutes early days) — survival depends on whether the actual product reveal matches the speculative narrative. <a href="#customer" style="color: var(--accent);">See competitive landscape ↓</a>',
  ],
  cycle: {
    challenge: { actor: 'Validator', title: 'Compute task', body: 'Validator broadcasts a compute or inference task to miners. Specific challenge format not publicly detailed.', dataK: 'payload', dataV: 'undisclosed task spec' },
    compute:   { actor: 'Miner',     title: 'Run compute', body: 'Miner executes the assigned compute / inference workload on its hardware and returns results.', dataK: 'latency',  dataV: 'workload-dependent' },
    score:     { actor: 'Validator', title: 'Measure quality', body: 'Validators score miner outputs against a quality metric — specific scoring rule not publicly disclosed.', dataK: 'scale',    dataV: 'quality vs. baseline' },
    settle:    { actor: 'Subtensor', title: 'Yuma → emission', body: "Every validator's weights, multiplied by their stake, aggregated by Yuma into one reward vector. TAO mints to top miners.", dataK: 'tempo', dataV: '~72 min · 24×/day' },
  },
  miner:     { does: 'Executes AI compute / inference workloads — specific task type not publicly detailed.', input: 'Compute tasks from validators (undisclosed format)', output: 'Workload results scored by validators', hardware: 'GPU / accelerator hardware — exact requirements not disclosed', paidFor: 'Quality and throughput on assigned compute tasks', paidVia: 'Per-tempo emission, score × validator stake' },
  validator: { does: 'Issues compute tasks, scores miner outputs against quality baseline, sets weights.', requires: 'Task generation + scoring pipeline (specifics not public)', output: 'Per-miner weights tied to compute-quality metric', paidFor: 'Submitting weights that agree with consensus median', paidVia: 'Per-tempo emission, stake × consensus alignment' },
  scoring:   {
    leadOneLine: 'Quality on compute workloads — exact scoring rule not publicly disclosed.',
    explanation: [
      'Public-facing materials are minimal. The subnet operates a compute / inference reward loop with validators measuring some quality metric, but the team has not detailed the scoring function, target workload types, or customer pipeline publicly as of mid-2026.',
      'Community signal is the primary heuristic: notable accounts like Jack Clark (Anthropic) follow the team\'s X presence, and the price action since October launch suggests insider conviction. Treat as a high-signal-but-low-transparency subnet pending an official product reveal.',
    ],
    cheatPath: 'Scoring rule not public, so cheat-paths cannot be enumerated precisely. Standard compute-subnet attacks (cached outputs, identical replies) are the obvious initial vectors.',
  },
  customer:  {
    leadOneLine: 'Target consumer not publicly disclosed — likely AI compute / inference customers via the Actual Computer Inc. corporate entity.',
    explanation: [
      'Actual Computer Inc. operates from Venice, CA, with @Tom_A_Lynch as CEO and @stevesperandeo as advisor. Beyond corporate identity, the customer pipeline — enterprise inference contracts, agent-grade compute, or something else — is not detailed in public sources.',
      'The competitive context is the broader Bittensor compute / inference category (Chutes SN64, Targon SN4, TensorClaw SN92) plus centralized providers (Together, Fireworks, OpenRouter). Specific positioning depends on the eventual product reveal.',
    ],
  },
  competitive: { scope: '2026 · AI compute / inference (positioning TBD)', rows: [
    { name: 'Actual Computer', subtitle: 'SN95', isSelf: true, approach: 'Stealth AI compute, specifics undisclosed', access: 'open · API', accessTone: 'open', differentiator: 'Stealth posture, notable AI followers, US-based corporate entity' },
    { name: 'Chutes', subtitle: 'SN64', approach: 'Serverless GPU inference + model marketplace', access: 'open · API', accessTone: 'open', differentiator: 'Largest Bittensor inference subnet by volume' },
    { name: 'Targon', subtitle: 'SN4', approach: 'Verified high-quality LLM inference', access: 'open · API', accessTone: 'open', differentiator: 'Verifier-driven quality, OpenAI-compatible' },
    { name: 'Together AI', approach: 'Centralized hosted open-model inference', access: 'closed · API', accessTone: 'closed', differentiator: 'VC-backed scale, SLA-grade reliability' },
    { name: 'Fireworks AI', approach: 'Fast serverless inference for open models', access: 'closed · API', accessTone: 'closed', differentiator: 'Enterprise inference performance' },
  ], note: 'Until Actual Computer publishes its product spec and target workload, competitive positioning is speculative. The community is pricing in insider signal more than disclosed roadmap.' },
  team: {
    intro: [
      'Actual Computer Inc. is based in Venice, California, with Tom Lynch (@Tom_A_Lynch) as CEO and Steve Sperandeo (@stevesperandeo) as advisor. Engineering contribution from @somewheresy is publicly noted.',
      'The team\'s X account (@actualputer) is followed by notable AI industry figures including Jack Clark, Anthropic co-founder — a signal that has driven significant community speculation about the subnet\'s direction.',
    ],
    founders: [{ initials: 'TL', gradient: 'v', name: 'Tom Lynch', role: 'CEO, Actual Computer Inc.', bio: 'CEO of Actual Computer Inc. operating SN95 from Venice, CA.', twitter: 'https://x.com/Tom_A_Lynch' }],
    size: 'Not publicly disclosed', founded: '2025 (Oct subnet launch)', based: 'Venice, California', backers: 'Not publicly disclosed; notable AI industry followers including Anthropic co-founder Jack Clark.',
  },
  milestones: [
    { date: '2025·10', text: 'Subnet 95 launches quietly with no public campaign.' },
    { date: '2025·10', text: 'Token price surges over 110% within weeks of launch.' },
    { date: '2026', text: 'Public product reveal still pending as of mid-2026.' },
  ],
  join: { title: 'Watch this subnet closely', body: 'Operators interested in stealth-launched compute opportunities should monitor @actualputer and the subnet\'s GitHub activity for the eventual product reveal. Public specs for mining and validating have not been published.', asideNote: 'High community-signal subnet with low public transparency — do your own diligence before committing serious capital.' },
  tags: ['compute', 'stealth', 'inference', 'us-based'],
  external: { website: 'https://backprop.finance/dtao/subnets/95-actual-computer', twitter: 'https://x.com/actualputer', taostats: 'https://taostats.io/subnets/95/' },
  tweets: [],
};
