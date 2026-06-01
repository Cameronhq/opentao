import type { RichSubnet } from '../subnet-rich';

export const sn5: RichSubnet = {
  slug: '5-hone',
  netuid: 5,
  name: 'Hone',

  shortPitch: 'Open competition to crack ARC-AGI-2, the hardest reasoning benchmark in AI.',

  overview: [
    'Hone is Bittensor Subnet 5, a collaboration between Manifold Labs and Latent that took the slot in a new direction in mid-2025. The thesis is the opposite of "make LLMs bigger" — Hone is an open, decentralized competition to crack ARC-AGI-2, the reasoning benchmark designed by François Chollet to be unsolvable by memorization. The subnet positions itself explicitly as a moonshot at general reasoning rather than at next-token prediction.',
    'The mechanism is unusual: miners do not run their solver directly on validators. They point validators at a git repository containing their solution, which validators clone and execute in a secure GPU sandbox against ARC-AGI-2 problem instances. Scoring is the fraction of held-out tasks the miner\'s code solves; reasoning quality, not throughput, drives weights.',
    'Outside Bittensor, the immediate target is the $750,000 ARC Prize purse for any team that clears the 85% threshold on the public benchmark. Hone\'s stated plan is to redirect winnings into buying back the SN5 alpha token, and to route long-term monetization through Targon (SN4) for distribution and inference once an actual general solver exists.',
    'The closest competitors are the ARC Prize private teams (Greenblatt, MindsAI, etc.), academic labs, and the broader generalisation-research arm of DeepMind. Hone differs by running an open, continuously-paid leaderboard where solutions are revealed and forkable — versus closed prize teams that hoard their code. <a href="#customer" style="color: var(--accent);">See competitive landscape ↓</a>',
  ],

  cycle: {
    challenge: { actor: 'Validator', title: 'Issue ARC tasks', body: 'Validators draw a batch of ARC-AGI-2 problem instances from the held-out set and broadcast them as evaluation tasks for the current miner solutions.', dataK: 'payload', dataV: 'ARC-AGI-2 task batch' },
    compute:   { actor: 'Miner',     title: 'Solve in sandbox', body: 'Validators clone the miner\'s pinned git commit into a secure GPU sandbox and execute their solver against every task in the batch under fixed time and compute limits.', dataK: 'latency',  dataV: 'per-task time and compute budget' },
    score:     { actor: 'Validator', title: 'Score solutions', body: 'Validators count how many tasks the miner\'s code solved correctly. Scores are normalized per round and used directly as weight inputs.', dataK: 'scale',    dataV: '% ARC-AGI-2 tasks solved' },
    settle:    { actor: 'Subtensor', title: 'Yuma → emission', body: "Every validator's weights, multiplied by their stake, aggregated by Yuma into one reward vector. TAO mints to top miners.", dataK: 'tempo', dataV: '~72 min · 24×/day' },
  },

  miner: {
    does:     'Builds and maintains a code repository that attempts to solve ARC-AGI-2 reasoning tasks; commits an updated version whenever the solver improves.',
    input:    'ARC-AGI-2 task instances drawn from the held-out evaluation set.',
    output:   'A git commit hash pointing to runnable code that produces a solution per task.',
    hardware: 'GPU recommended — sandbox executes against the miner\'s actual code, so heavier neural solvers run faster on better hardware.',
    paidFor:  'Solving more ARC-AGI-2 tasks than other miners across the evaluation batch.',
    paidVia:  'Per-tempo emission, score × validator stake',
  },
  validator: {
    does:     'Issues ARC-AGI-2 task batches, clones each miner\'s pinned solver into a sandbox, executes against tasks, and posts weights based on solve rate.',
    requires: 'Standard Bittensor validator stake plus GPU capacity to run multiple miner solvers in parallel sandboxes within tempo budget.',
    output:   'A weight vector based on per-miner solve rate over the batch.',
    paidFor:  'Submitting weights that agree with consensus median',
    paidVia:  'Per-tempo emission, stake × consensus alignment',
  },

  scoring: {
    leadOneLine: 'Solve rate on held-out ARC-AGI-2 tasks executed in a secure GPU sandbox — the benchmark itself is the scoring function.',
    explanation: [
      'ARC-AGI-2 is engineered specifically to defeat memorization. Each task is a small visual puzzle with novel structure, drawn from a large held-out pool that grows over time. A solver that has memorized training examples scores essentially zero. The only way to climb the leaderboard is to write code that actually generalizes — which is what makes the benchmark a meaningful proxy for reasoning.',
      'Because Hone runs the miner\'s own code in a sandbox rather than asking for static predictions, miners can ship arbitrary algorithms — program synthesis, neural-guided search, hybrid systems, anything that compiles. The scoring rule rewards generalisation on previously unseen instances rather than any single architectural bet. Solutions become public after each round, so the leaderboard doubles as a continuous open-research log.',
    ],
    cheatPath: 'Tasks are drawn from a private held-out set, so miners cannot pre-compute answers. Sandboxes block network calls and bound per-task compute, ruling out remote-LLM relays. Code is revealed after each round, but the test set rotates, so copy-pasting yesterday\'s winner only works until the next batch of unseen tasks lands and the same approach hits its ceiling.',
  },

  customer: {
    leadOneLine: 'Researchers, the ARC Prize purse, and downstream applications that need an actual general-reasoning solver.',
    explanation: [
      'In the short term, the explicit external buyer is the ARC Prize itself — a $750,000 purse for any team that clears 85% on ARC-AGI-2. Hone has publicly committed to using winnings to buy back the SN5 alpha token, aligning miner incentives with token holders. The benchmark also generates substantial press and recruiter attention every time the leaderboard moves.',
      'In the longer term, a general reasoner is the most valuable asset in AI, period — useful for code generation, scientific discovery, planning, and any agentic workflow that today fails on out-of-distribution tasks. Hone\'s plan is to route productisation through Targon (SN4) for distribution and inference once a viable solver exists. The thesis is that scaling LLMs alone will not solve ARC-AGI-2, so building a parallel research track has independent strategic value.',
    ],
  },

  competitive: {
    scope: 'general reasoning benchmarks · 2026',
    rows: [
      { name: 'Hone', subtitle: 'SN5', isSelf: true, approach: 'Open decentralized competition with continuous TAO emissions to the standing leader on ARC-AGI-2.', access: 'open · git', accessTone: 'open', differentiator: 'Continuously paid leaderboard, solutions revealed and forkable, no prize-purse termination.' },
      { name: 'ARC Prize teams', subtitle: 'Greenblatt, MindsAI, others', approach: 'Closed private teams targeting the $750K ARC Prize purse with proprietary solvers.', access: 'closed · n/a', accessTone: 'closed', differentiator: 'One-shot prize incentive, no continuous payment, code stays private until prize is claimed.' },
      { name: 'DeepMind reasoning', subtitle: 'frontier lab', approach: 'In-house research on program synthesis, neural-guided search, and chain-of-thought systems.', access: 'closed · paper', accessTone: 'closed', differentiator: 'Massive compute and talent advantage, but closed weights and no community contribution path.' },
      { name: 'Frontier LLMs', subtitle: 'GPT / Claude / Gemini', approach: 'Train ever-larger models with reasoning RL and hope ARC falls out as an emergent capability.', access: 'closed · API', accessTone: 'closed', differentiator: 'Strong on most benchmarks but currently weak on ARC-AGI-2; orthogonal architectural bet.' },
      { name: 'Kaggle', subtitle: 'ML contests', approach: 'Fixed-prize ML competitions with leaderboards and held-out test sets.', access: 'open · web', accessTone: 'open', differentiator: 'Closes on a date, no continuous incentive, no on-chain settlement.' },
    ],
    note: 'Hone\'s differentiator versus closed ARC Prize teams is openness — solutions are public, anyone can fork, and TAO emissions flow every tempo rather than once at the finish line. Versus frontier LLMs, Hone is making an opposite bet: that scaling alone will not solve ARC-AGI-2 and that program-synthesis-flavoured research deserves a separate, continuously-funded venue.',
  },

  team: {
    intro: [
      'Hone is operated by a collaboration between Manifold Labs (engineering and Bittensor protocol) and Latent (AGI vision and open-source philosophy) formed in mid-2025. Both teams have unusually deep Bittensor protocol context — Manifold was founded by ex-Opentensor engineers and Latent is the same family of teams that operates Targon (SN4) and other infrastructure subnets.',
      'The collaboration\'s pitch is that ARC-AGI-2 is the right benchmark to organise an open-research subnet around, and that Bittensor\'s emission mechanism is the right way to fund a continuous leaderboard. The team has been public about routing future productisation through Targon for inference and distribution rather than launching a separate go-to-market.',
    ],
    founders: [
      { initials: 'RM', gradient: 'v', name: 'Robert Myers',    role: 'CEO, Manifold Labs', bio: 'Helped build Bittensor\'s core code at the Opentensor Foundation before founding Manifold Labs. Leads engineering and protocol direction for Hone.', github: 'https://github.com/sirouk' },
      { initials: 'CF', gradient: 'a', name: 'Cameron Fairchild', role: 'Technical Lead, Manifold Labs', bio: 'Ex-Opentensor; built core Bittensor infrastructure before joining Manifold. Owns the sandbox execution and validator stack on Hone.' },
    ],
    size: '~10-15 across Manifold and Latent',
    founded: 'Subnet 5 pivot to Hone in mid-2025',
    based: 'Distributed',
    backers: 'Manifold Labs and Latent are the primary backers via their own treasuries; no priced outside round disclosed.',
    placeholder: false,
  },

  milestones: [
    { date: '2025·Q3', text: 'Subnet 5 pivoted to Hone — Manifold + Latent collaboration announced.' },
    { date: '2025·Q4', text: 'First version of the Hone validator and sandbox code merged; 1% production incentive opened for live testing.' },
    { date: '2026·Q1', text: 'ARC-AGI-2 evaluation integrated as primary scoring rule.' },
  ],

  join: {
    title: 'Climb the ARC-AGI-2 leaderboard',
    body: 'Fork manifold-inc/hone, write your best ARC-AGI-2 solver, push it to a public git repo, and register a Bittensor miner on SN5 that points at your pinned commit.',
    asideNote: 'Validators need standard SN5 stake plus enough GPU to run multiple miner solvers in parallel sandboxes each tempo.',
  },

  tags: ['reasoning', 'arc-agi', 'reinforcement-learning', 'competitions'],

  external: {
    github:   'https://github.com/manifold-inc/hone',
    website:  'https://hone.computer/',
    twitter:  'https://x.com/manifoldlabs',
    taostats: 'https://taostats.io/subnets/5/',
  },
};
