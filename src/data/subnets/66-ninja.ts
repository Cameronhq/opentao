import type { RichSubnet } from '../subnet-rich';

export const sn66: RichSubnet = {
  slug: '66-ninja',
  netuid: 66,
  name: 'ninja',
  shortPitch: 'King-of-the-hill tournament for open-source coding agents.',
  overview: [
    'ninja (SN66) is a small, recent Bittensor subnet built around a simple game: take a real bug from a real open-source repo, hand it to multiple AI coding agents, and pay the one that actually fixes it. The reference implementation lives at github.com/unarbos/tau and runs a staged "generate → solve → compare → eval" pipeline that any agent can plug into.',
    'The team behind ninja are two well-known Bittensor builders, unarbos and unconst. The subnet repo was created at the end of March 2026 and saw rapid early commit activity. As of the latest snapshots, the subnet is in a bootstrapping phase — 100% miner burn, near-zero active miners — while the harness is hardened.',
    'Where Ridges (SN62) is a high-volume tournament built around SWE-bench Verified, ninja focuses on the meta-question of evaluation itself: a reproducible, agent-agnostic harness where the same task can be benchmarked across Cursor CLI, Claude CLI, OpenRouter-backed Docker agents, or any other agent hosted in a GitHub repo.',
    'The bet is that the AI-coding-agent space needs a permissionless evaluator that anyone — not just the agent vendor — can run, and that the subnet incentive layer is the right way to keep that harness honest. <a href="#customer" style="color: var(--accent);">See competitive landscape ↓</a>',
  ],
  cycle: {
    challenge: { actor: 'Validator', title: 'Real-bug task', body: 'Validator generates a task by selecting a real commit/issue from an open-source repo and reproducing the pre-fix state and failing test.', dataK: 'payload', dataV: 'Repo @ commit + test' },
    compute:   { actor: 'Miner',     title: 'Solve via agent', body: 'Miner runs its coding agent of choice — Cursor, Claude, OpenRouter, custom — and submits a patch within the time budget.', dataK: 'latency',  dataV: 'Per-task budget' },
    score:     { actor: 'Validator', title: 'Compare + eval', body: 'Validator applies the patch, runs the failing test, and compares miner output against ground-truth fix and other agents in the round.', dataK: 'scale',    dataV: 'Pass / fail + ranking' },
    settle:    { actor: 'Subtensor', title: 'Yuma → emission', body: "Every validator's weights, multiplied by their stake, aggregated by Yuma into one reward vector. TAO mints to top miners.", dataK: 'tempo', dataV: '~72 min · 24×/day' },
  },
  miner: {
    does: 'Plugs an AI coding agent into the ninja harness and submits patches for real-bug tasks generated from open-source repos.',
    input: 'A repo at a specific commit plus a failing test or issue.',
    output: 'A unified-diff patch produced by the chosen agent backend.',
    hardware: 'CPU/GPU host able to run the chosen agent + Docker; modest for CLI agents, heavier for self-hosted models.',
    paidFor: 'Passing the failing test on the first try with a clean patch',
    paidVia: 'Per-tempo emission, score × validator stake',
  },
  validator: {
    does: 'Generates real-bug tasks, runs miner patches in a sandbox, scores them, and submits weights.',
    requires: 'Reproducible task-generation pipeline, Docker-based eval sandbox, and agent-backend integration.',
    output: 'Weight vector ranking miners on per-task pass rate.',
    paidFor: 'Submitting weights that agree with consensus median',
    paidVia: 'Per-tempo emission, stake × consensus alignment',
  },
  scoring: {
    leadOneLine: 'King of the hill: real bug, real test, last patch standing wins.',
    explanation: [
      'Tasks are generated from real GitHub commits, so the validator already knows the ground-truth fix. Miner patches are applied in a Docker sandbox; the failing test must go green, the rest of the suite must not break. Simple, brutal grading.',
      'Because the same task can be replayed against any agent backend, ninja produces a cross-agent leaderboard rather than a single-model leaderboard. The winning entry is the agent that consistently passes the most failing tests, regardless of which underlying model it uses.',
    ],
    cheatPath: 'Memorizing the public test set — validators draw fresh commits, so prior-art memorization runs out fast.',
  },
  customer: {
    leadOneLine: 'Teams building coding agents who need a neutral evaluator.',
    explanation: [
      'The first customer is the agent ecosystem itself: every team shipping a coding-agent CLI or API wants a benchmark it does not own and cannot tune. ninja\'s permissionless, reproducible harness is exactly that.',
      'Downstream, the leaderboard is useful to enterprise buyers comparing Cursor, Claude Code, Codex, Devin, and open-source agents against each other on identical tasks. The subnet effectively underwrites a continuously updated G2 review for AI coding agents.',
    ],
  },
  competitive: {
    scope: '2026 · evaluation of AI coding agents',
    rows: [
      { name: 'ninja', subtitle: 'SN66', isSelf: true, approach: 'Permissionless harness running real-bug tasks across any agent backend; subnet incentive layer pays for clean pass rates.', access: 'open · subnet + harness', accessTone: 'open', differentiator: 'Agent-agnostic; same task can be benchmarked across any vendor.' },
      { name: 'SWE-bench Verified', approach: 'Curated academic benchmark for autonomous SWE agents.', access: 'open · benchmark', accessTone: 'open', differentiator: 'Gold standard, but a fixed set — vulnerable to overfitting; ninja generates fresh tasks.' },
      { name: 'Ridges (SN62)', subtitle: 'SN62', approach: 'Tournament-as-product where miners submit full agents ranked on SWE-bench.', access: 'open · subnet', accessTone: 'open', differentiator: 'Bigger scale and downstream product; ninja focuses on the eval harness itself.' },
      { name: 'Vendor self-benchmarks', approach: 'Closed-lab numbers reported by Anthropic, OpenAI, Cognition on their own coding agents.', access: 'closed · marketing', accessTone: 'closed', differentiator: 'Not independent; ninja is run by neither lab nor vendor.' },
      { name: 'Agent-arena / G2 reviews', approach: 'Human voting and reviews on which agent is best.', access: 'open · community', accessTone: 'open', differentiator: 'Subjective; ninja replaces voting with deterministic test passes.' },
    ],
    note: 'ninja\'s scope is narrower than Ridges by design: not "win the tournament," but "be the harness everyone trusts." If the leaderboard becomes credible, every agent vendor has an incentive to plug in.',
  },
  team: {
    intro: [
      'ninja is the work of two well-known Bittensor builders operating under the handles unarbos and unconst. Both have prior subnet experience — unarbos as the operator behind Distil (SN97), unconst across early Bittensor protocol and reference implementations.',
      'The subnet is in a bootstrapping phase: repo created late March 2026, ~27 commits in the first four weeks across two contributors, 100% miner burn, near-zero active miners while the harness is hardened. Treat the team profile as small and code-led until the public docs catch up.',
    ],
    founders: [
      { initials: 'UA', gradient: 'v', name: 'unarbos', role: 'Co-builder', bio: 'Bittensor subnet operator; previously built Distil (SN97 — competitive model distillation). Now co-leads ninja\'s eval harness.' },
      { initials: 'UC', gradient: 'a', name: 'unconst', role: 'Co-builder', bio: 'Long-standing Bittensor builder with multiple reference subnet implementations (ImageSubnet, storage-subnet, early protocol work).' },
    ],
    size: '2 core',
    founded: '2026·03',
    based: 'Not publicly disclosed.',
    backers: 'Not publicly disclosed.',
  },
  milestones: [
    { date: '2026·03', text: 'ninja repo created; subnet 66 registered.' },
    { date: '2026·04', text: '27 commits across 2 contributors in the first four weeks; harness goes through rapid iteration.' },
    { date: '2026·Q2', text: 'Miner burn remains at 100% while the eval harness is hardened for permissionless use.' },
  ],
  join: {
    title: 'Plug your agent in, see where it ranks',
    body: 'ninja runs the same task against any agent — Cursor, Claude, OpenRouter, custom. If your agent passes real-bug tests, it earns. If not, you find out fast.',
    asideNote: 'AI coding-agent / SWE infra background pays off fastest.',
  },
  tags: ['coding', 'evaluation', 'ai-agents', 'tournament'],
  external: {
    github: 'https://github.com/unarbos/tau',
    taostats: 'https://taostats.io/subnets/66/',
  },
};
