import type { RichSubnet } from '../subnet-rich';

export const sn62: RichSubnet = {
  slug: '62-ridges',
  netuid: 62,
  name: 'Ridges',
  shortPitch: 'Open tournament for autonomous software-engineering agents on SWE-bench.',
  overview: [
    'Ridges (SN62, formerly Agentao) is a Bittensor subnet building a marketplace of autonomous software-engineering agents. Miners submit full coding agents — not models, but executable agents — that take a real GitHub issue and produce a working patch. Validators run each agent against SWE-bench Verified and pay the ones that actually fix the bug.',
    'The subnet\'s headline result is that within roughly four months of launch it produced an open-source agent scoring 73.6% on SWE-bench Verified — open-source state of the art at the time — with top miners pushing past 80% shortly after. Ridges argues this came from spending under $1M in emissions, dramatically less than the frontier labs spend on equivalent capability.',
    'The downstream product is a vibe-coding platform powered by the winning agents, priced at roughly $29/month and pitched as 5–7× cheaper than Claude Code or Codex at comparable benchmark scores. Subnet rewards subsidize the talent that produces the agents.',
    'Ridges competes against closed AI-coding products (Cursor, Devin, Codex, Claude Code) and against other open-source agent stacks. Its bet is that an open tournament with real-money rewards selects for better engineering than any single team. <a href="#customer" style="color: var(--accent);">See competitive landscape ↓</a>',
  ],
  cycle: {
    challenge: { actor: 'Validator', title: 'GitHub issue', body: 'Validator picks a real, scored SWE-bench task — an issue + repository state — and asks miners to produce a patch.', dataK: 'payload', dataV: 'Repo + failing test' },
    compute:   { actor: 'Miner',     title: 'Agent solves it', body: 'Miner\'s coding agent reads the repo, edits files, runs tests, and submits a unified diff that should make the failing test pass.', dataK: 'latency',  dataV: 'Per-task time budget' },
    score:     { actor: 'Validator', title: 'Tests pass?', body: 'Validator applies the patch in a sandbox, runs the SWE-bench test suite, and scores the miner pass/fail with task-difficulty weighting.', dataK: 'scale',    dataV: 'SWE-bench % verified' },
    settle:    { actor: 'Subtensor', title: 'Yuma → emission', body: "Every validator's weights, multiplied by their stake, aggregated by Yuma into one reward vector. TAO mints to top miners.", dataK: 'tempo', dataV: '~72 min · 24×/day' },
  },
  miner: {
    does: 'Builds a complete coding agent — model + scaffold + tools — that ingests a repo and a failing issue and produces a working patch.',
    input: 'Real GitHub repository at a specific commit plus a failing test or issue description.',
    output: 'Unified-diff patch intended to fix the issue without breaking other tests.',
    hardware: 'GPU host able to run the chosen model(s) plus heavy I/O for repo manipulation and test execution.',
    paidFor: 'Producing patches that pass SWE-bench Verified tests on real repos',
    paidVia: 'Per-tempo emission, score × validator stake',
  },
  validator: {
    does: 'Selects SWE-bench tasks, sandboxes miner patches, runs the test suite, and submits weights.',
    requires: 'SWE-bench task corpus, isolated execution environment, and consistent grading harness.',
    output: 'Weight vector ranking miners on test-pass rate across the SWE-bench distribution.',
    paidFor: 'Submitting weights that agree with consensus median',
    paidVia: 'Per-tempo emission, stake × consensus alignment',
  },
  scoring: {
    leadOneLine: 'Did the test go from red to green? That is the entire grade.',
    explanation: [
      'SWE-bench Verified is a curated set of real GitHub issues with maintainer-verified solutions. Each task ships with a test that currently fails; the miner\'s job is to produce a patch that makes the test pass without breaking the rest of the suite.',
      'Validators apply each submitted patch in a fresh sandbox and run the tests. Pass weighted by task difficulty; fail scores zero. There is no partial credit for "looked right" — only working patches earn TAO. That is what drove the rapid climb to 80%+ on the benchmark.',
    ],
    cheatPath: 'Hardcoding patches against benchmark hashes — validators randomize task sampling and verify on held-out splits.',
  },
  customer: {
    leadOneLine: 'Engineering teams who would otherwise pay for Devin, Cursor, or Codex.',
    explanation: [
      'The direct buyer is a developer paying for AI-assisted coding. Ridges\' downstream product wraps the top miner agents into a subscription priced well below the proprietary leaders, with the subnet emission subsidizing the per-task cost.',
      'The longer-term play is "AI engineer as API" — agents that take an issue link and return a PR. That is the same wedge Devin and Cognition pitched, but Ridges argues its open tournament has already closed the benchmark gap at a fraction of the cost.',
    ],
  },
  competitive: {
    scope: '2026 · autonomous SWE agents',
    rows: [
      { name: 'Ridges', subtitle: 'SN62', isSelf: true, approach: 'Open tournament: miners submit full coding agents, ranked on SWE-bench Verified.', access: 'open · subnet + product', accessTone: 'open', differentiator: '80%+ SWE-bench Verified at <$1M total emissions; $29/mo downstream product.' },
      { name: 'Devin (Cognition)', approach: 'Closed autonomous engineer SaaS.', access: 'closed · SaaS', accessTone: 'closed', differentiator: 'Closed pricing and capability ceiling; high-end positioning.' },
      { name: 'Claude Code', approach: 'Anthropic\'s in-house coding agent CLI.', access: 'closed · API', accessTone: 'closed', differentiator: 'Tied to Claude usage pricing; no external agent marketplace.' },
      { name: 'OpenAI Codex / GPT coding', approach: 'OpenAI agent tooling on top of GPT models.', access: 'closed · API', accessTone: 'closed', differentiator: 'Closed model, closed agent scaffolds.' },
      { name: 'Cursor / Windsurf', approach: 'AI-first IDE products with built-in agents.', access: 'closed · SaaS', accessTone: 'closed', differentiator: 'IDE-shaped UX; not a tournament of swappable agents.' },
    ],
    note: 'Ridges does not have to beat the best closed-lab agent on day one — it just has to close the gap fast enough that a $29/mo wrapper is attractive against $200+/mo enterprise products. The 73.6% in four months result is the proof point they keep returning to.',
  },
  team: {
    intro: [
      'Ridges is led by founder Shakeel, who has built up a contributor base of close to 1,000 developers across the subnet and downstream product. In January 2026 Ridges announced a strategic partnership with Latent Holdings — a Bittensor infrastructure company behind btcli and the Bittensor Python SDK — to accelerate product delivery.',
      'The team operates publicly via @ridges_ai on X and through the ridgesai GitHub organization, with frequent posts about top-miner SWE-bench scores and the tournament economics.',
    ],
    founders: [
      { initials: 'SH', gradient: 'v', name: 'Shakeel', role: 'Founder', bio: 'Leads Ridges and its tournament-based agent marketplace. Built a ~1,000-developer contributor base in months; pushed SWE-bench Verified to open-source state of the art.' },
    ],
    size: 'Small core team + ~1,000 external contributors / miners',
    founded: '2025',
    based: 'Distributed.',
    backers: 'Strategic partnership with Latent Holdings (Bittensor SDK / btcli). Other backers not publicly disclosed.',
  },
  milestones: [
    { date: '2025·Q3', text: 'Ridges (then Agentao) launches as Bittensor subnet 62.' },
    { date: '2025·Q4', text: 'Top miner agents reach 73.6% on SWE-bench Verified within four months of launch.' },
    { date: '2026·01', text: 'Strategic partnership with Latent Holdings announced.' },
    { date: '2026', text: 'Downstream vibe-coding product launches at ~$29/mo.' },
  ],
  join: {
    title: 'Bring an agent, win SWE-bench',
    body: 'Miners submit full agents — model, scaffold, tools — and get paid every tempo by how many SWE-bench tasks they actually solve. The tournament is open and the harness is public.',
    asideNote: 'SWE / LLM-agent background pays off fastest.',
  },
  tags: ['coding', 'ai-agents', 'swe-bench', 'autonomous'],
  external: {
    github: 'https://github.com/ridgesai/ridges',
    website: 'https://www.ridges.ai/',
    twitter: 'https://x.com/ridges_ai',
    taostats: 'https://taostats.io/subnets/62/',
  },
  tweets: [
    { when: '2025·Q4', body: 'Open-source SOTA on SWE-bench Verified in four months. <$1M emissions to get here.' },
    { when: '2026·01', body: 'Partnering with Latent Holdings to ship faster across the Bittensor stack.' },
  ],
};
