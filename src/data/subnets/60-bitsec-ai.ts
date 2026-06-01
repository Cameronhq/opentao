import type { RichSubnet } from '../subnet-rich';

export const sn60: RichSubnet = {
  slug: '60-bitsec-ai',
  netuid: 60,
  name: 'Bitsec.ai',
  shortPitch: 'Decentralized AI auditors hunting vulnerabilities in code and smart contracts.',
  overview: [
    'Bitsec (SN60) is a Bittensor subnet that turns code auditing into an open competition. Miners build AI agents — ML classifiers, fine-tuned LLMs, agent frameworks, static analyzers — that scan source code and smart contracts for vulnerabilities. Validators grade them on ground-truth bug sets and pay the ones that find real exploits.',
    'In its early phase, Bitsec focuses on auditing other Bittensor subnets and their on-chain mechanisms, then expands outward to general smart-contract and software security. The pitch is simple: the global cybersecurity market is enormous, manual audits are expensive and slow, and a swarm of competing AI agents should be able to surface bugs that any one firm would miss.',
    'The subnet runs two product surfaces. Bitsec Scanner lets a user point miners at a GitHub repository to find exploits. Bitsec Hunter routes the swarm at live bug bounty programs, where successful findings pay out in TAO plus bounty revenue.',
    'The competition is dominated by closed audit firms and a handful of static-analysis SaaS tools. Bitsec\'s wager is that 192 miner slots full of independently optimized AI agents will out-find any single team. <a href="#customer" style="color: var(--accent);">See competitive landscape ↓</a>',
  ],
  cycle: {
    challenge: { actor: 'Validator', title: 'Code drop', body: 'Validator distributes a code artifact — a Solidity contract, a Rust subnet repo, a Python service — with known and unknown vulnerabilities seeded inside.', dataK: 'payload', dataV: 'Repo + ground truth set' },
    compute:   { actor: 'Miner',     title: 'Find + fix', body: 'Miner runs its agent (LLM, static analyzer, fine-tuned model) over the code and returns a list of vulnerabilities with severity, location, and suggested fix.', dataK: 'latency',  dataV: 'minutes per repo' },
    score:     { actor: 'Validator', title: 'Precision × recall', body: 'Validator compares miner findings against the ground-truth bug set, rewarding true positives, penalizing hallucinated bugs, and weighting by severity.', dataK: 'scale',    dataV: '0–1 weighted F1' },
    settle:    { actor: 'Subtensor', title: 'Yuma → emission', body: "Every validator's weights, multiplied by their stake, aggregated by Yuma into one reward vector. TAO mints to top miners.", dataK: 'tempo', dataV: '~72 min · 24×/day' },
  },
  miner: {
    does: 'Runs an AI vulnerability detection pipeline — ML, agents, or static analysis — against code repos and returns annotated findings.',
    input: 'Source code repo or smart contract bytecode.',
    output: 'Structured list of vulnerabilities with severity, line numbers, and suggested patches.',
    hardware: 'Strong CPU/GPU host able to run multi-agent LLM workflows; storage for code corpora.',
    paidFor: 'Finding real vulnerabilities with low false-positive rate',
    paidVia: 'Per-tempo emission, score × validator stake',
  },
  validator: {
    does: 'Issues code challenges, scores miner findings against ground-truth and live bounty results, and submits weights.',
    requires: 'A curated bug-set library, severity rubric, and bounty-program integration.',
    output: 'Weight vector ranking miners on precision-weighted recall of real bugs.',
    paidFor: 'Submitting weights that agree with consensus median',
    paidVia: 'Per-tempo emission, stake × consensus alignment',
  },
  scoring: {
    leadOneLine: 'Real bugs in real code beat any clever theory of code.',
    explanation: [
      'Validators run miner agents against repos with seeded vulnerabilities and against live bounty programs where finding a bug yields independent confirmation. True positives score high, false positives are penalized, severity scales the reward.',
      'The system explicitly rewards diverse approaches — ML models, agent frameworks, and static analysis all coexist because no single technique dominates across the bug landscape. A miner who only finds the easy reentrancy patterns loses to a miner who also catches business-logic flaws.',
    ],
    cheatPath: 'Spraying generic vulnerability templates at every repo — precision penalty drowns the score in false positives.',
  },
  customer: {
    leadOneLine: 'Anyone who would pay a security firm for a code audit.',
    explanation: [
      'Direct buyers are subnet owners, DeFi protocols, and smart-contract teams who need their code audited before launch or after major upgrades. Bitsec already reports finding vulnerabilities in production code worth hundreds of millions in collective TVL.',
      'The longer-term play is bug-bounty triage at scale: paying the swarm to constantly scan codebases as commits land, replacing the expensive cadence of one-shot audit firms with continuous AI coverage. Buyers are CTOs, security leads, and protocol DAOs.',
    ],
  },
  competitive: {
    scope: '2026 · code & smart contract audit',
    rows: [
      { name: 'Bitsec', subtitle: 'SN60', isSelf: true, approach: 'Open swarm of AI auditing agents scored on real-bug detection across repos and live bounties.', access: 'open · subnet', accessTone: 'open', differentiator: 'Decentralized, agent-based, paid per real bug — not per audit-hour.' },
      { name: 'Trail of Bits / OpenZeppelin', approach: 'Top-tier human + tool-assisted audits; multi-week engagements.', access: 'closed · service', accessTone: 'closed', differentiator: 'Highest trust ceiling, lowest scale; multi-month queues.' },
      { name: 'Certora / Halborn', approach: 'Formal verification and hybrid audit firms.', access: 'closed · service', accessTone: 'closed', differentiator: 'Strong on math-heavy contracts; expensive per-engagement.' },
      { name: 'Slither / Mythril', approach: 'Open-source static analyzers and symbolic execution tools.', access: 'open · tool', accessTone: 'open', differentiator: 'Free, but no learning loop; high false-positive rate.' },
      { name: 'Code4rena / Sherlock', approach: 'Crowdsourced human auditor contests with bounty pools.', access: 'open · contest', accessTone: 'open', differentiator: 'Human-driven; Bitsec mines the same surface with AI agents.' },
    ],
    note: 'Bitsec is not trying to replace Trail of Bits on a critical mainnet contract launch. It is trying to compress 80% of the audit surface into a continuous AI swarm so human auditors can focus on the truly novel risks.',
  },
  team: {
    intro: [
      'Bitsec is led by an experienced operator publicly described as a former blackjack pro turned engineer who scaled legal-tech company Law360 from $30M to $140M in revenue before turning to decentralized code audits.',
      'The team operates publicly via the @bitsecai handle and ships into a public GitHub. Bitsec V2 launched in late 2025 with an agent-based architecture and explicit positioning against the $200B+ software security market.',
    ],
    founders: [
      { initials: 'F1', gradient: 'v', name: '[Founder 1 name]', role: 'Founder / CEO', bio: 'Former blackjack pro turned operator; scaled Law360 from $30M to $140M before founding Bitsec.' },
    ],
    size: 'Small core team',
    founded: '2024',
    based: 'Not publicly disclosed.',
    backers: 'Not publicly disclosed.',
    placeholder: true,
  },
  milestones: [
    { date: '2024', text: 'Bitsec subnet registered on Bittensor.' },
    { date: '2025', text: 'Reports finding vulnerabilities across production code including Virtuals, Stargaze, and Lium (SN51).' },
    { date: '2025·Q4', text: 'Bitsec V2 launches with an agent-based architecture.' },
  ],
  join: {
    title: 'Mine bugs, not bullet points',
    body: 'Bring an LLM-agent stack, a fuzzer, a static analyzer, or all three. If you can find real bugs in real repos, the score is yours.',
    asideNote: 'Smart-contract or AppSec background pays off fastest.',
  },
  tags: ['security', 'audit', 'smart-contracts', 'ai-agents'],
  external: {
    github: 'https://github.com/Bitsec-AI/subnet',
    website: 'https://chaindefender.ai/',
    twitter: 'https://x.com/bitsecai',
    taostats: 'https://taostats.io/subnets/60/',
  },
  tweets: [
    { when: '2025·Q4', body: 'Introducing Bitsec V2 — agent-based AI security on Bittensor SN60.' },
  ],
};
