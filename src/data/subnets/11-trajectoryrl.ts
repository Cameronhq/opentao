import type { RichSubnet } from '../subnet-rich';

export const sn11: RichSubnet = {
  slug: '11-trajectoryrl',
  netuid: 11,
  name: 'TrajectoryRL',

  shortPitch: 'Decentralized tournament for cost-efficient AI agent policies.',

  overview: [
    'TrajectoryRL is Bittensor Subnet 11, the third life of one of the network\'s oldest slots — originally launched as a roleplay-LLM subnet ("Dippy Roleplay"), then re-architected and re-branded around agent-trajectory optimisation. The thesis is simple: as AI agents proliferate, prompt and policy design directly determines the cost of running them, and a decentralised competition is the right way to find policies that are cheaper, faster, and more reliable than what any single team can write.',
    'The subnet runs the standard Bittensor topology of validator and miner slots. Miners author "policy packs" — small bundles of AGENTS.md, SOUL.md, and tool_policy files — and upload them to any HTTP endpoint while committing the SHA256 hash on chain. Validators pull the committed packs, run them through a suite of five ClawBench scenarios under identical conditions, and reward only those that pass all safety/correctness gates, ranked by total cost (tokens spent).',
    'Outside Bittensor, the buyer is any team running production AI agents — agent platforms, customer-support automation, vertical SaaS — where token cost is the dominant unit economic. Reported optimisation gains are 50-70% cost reduction from compression and 90%+ in some workflows from reducing redundant tool calls. The team integrates ClawBench into the broader OpenClaw stack for trajectory-centric reinforcement learning.',
    'Closest non-Bittensor analogues are LangSmith / LangChain agent evaluation, DSPy (prompt-program optimisation), and prompt-engineering consultancies. TrajectoryRL differs by paying TAO continuously to the most cost-efficient passing policy, with deterministic scenario gates and on-chain commitment. <a href="#customer" style="color: var(--accent);">See competitive landscape ↓</a>',
  ],

  cycle: {
    challenge: { actor: 'Validator', title: 'Pull policy packs', body: 'Validators read each miner\'s on-chain SHA256 commitment, fetch the corresponding policy pack from the miner\'s HTTP endpoint, and verify the hash matches.', dataK: 'payload', dataV: 'AGENTS.md · SOUL.md · tool_policy' },
    compute:   { actor: 'Miner',     title: 'Run ClawBench', body: 'Each pack is executed through five ClawBench scenarios — workplace tasks, model routing, self-evolution, and security checks — under identical conditions for every miner.', dataK: 'latency',  dataV: '5 scenarios · deterministic execution' },
    score:     { actor: 'Validator', title: 'Cost rank passing packs', body: 'Validators apply regex-based safety/correctness rubrics. Packs that fail any gate score zero. Among packs that pass, the lowest total token cost wins the round.', dataK: 'scale',    dataV: 'pass-all → rank by token cost' },
    settle:    { actor: 'Subtensor', title: 'Yuma → emission', body: "Every validator's weights, multiplied by their stake, aggregated by Yuma into one reward vector. TAO mints to top miners.", dataK: 'tempo', dataV: '~72 min · 24×/day' },
  },

  miner: {
    does:     'Authors and iterates on policy packs — instruction files, persona files, and tool-policy files — that make AI agents cheaper, faster, and more reliable.',
    input:    'The ClawBench scenario specs published by validators, plus offline simulation tooling for local iteration.',
    output:   'A policy pack uploaded to an HTTP endpoint, with its SHA256 hash committed on chain.',
    hardware: 'Light — most miner work is iterative prompt engineering, offline testing, and committing hashes. No GPU required.',
    paidFor:  'Producing the lowest-cost policy pack that passes every ClawBench safety and correctness gate.',
    paidVia:  'Per-tempo emission, score × validator stake',
  },
  validator: {
    does:     'Pulls policy packs, runs them through ClawBench scenarios, applies regex-based rubrics, measures total token cost, and posts weights based on cost rank.',
    requires: 'Standard Bittensor validator stake plus LLM API access (or local LLM hosting) to execute every miner\'s pack across the ClawBench scenarios.',
    output:   'A weight vector based on which policy packs passed all gates and at what total token cost.',
    paidFor:  'Submitting weights that agree with consensus median',
    paidVia:  'Per-tempo emission, stake × consensus alignment',
  },

  scoring: {
    leadOneLine: 'Pass all ClawBench safety/correctness gates first, then rank passing packs by lowest total token cost.',
    explanation: [
      'TrajectoryRL\'s scoring is two-stage. Stage one is a hard gate — each of the five ClawBench scenarios applies deterministic regex-based rubric checks for safety and correctness. A pack that fails any rubric scores zero, no matter how cheap it ran. This rules out the obvious failure mode of "win by being so terse the agent stops working."',
      'Stage two is pure cost competition. Among the packs that pass all gates, the lowest total token cost wins the round. Reported wins in the wild include 50-70% cost reduction from compressing instructions and adding clear stop rules, and up to 93% reduction in some workflows from cutting unnecessary tool calls and tightening multi-step flows. Code is open so the next miner can fork and propose an improvement.',
    ],
    cheatPath: 'Skimping on quality fails the safety/correctness rubrics, which sit before cost ranking — so cheap-but-broken packs score zero. Hash commitment prevents miners from swapping in different packs after seeing the test data. The five-scenario suite covers workplace tasks, model routing, self-evolution, and security, so a pack that only works on one scenario will fail the others and never reach the cost stage.',
  },

  customer: {
    leadOneLine: 'Any team paying for production AI agents at scale, where prompt cost dominates unit economics.',
    explanation: [
      'The buyer is a platform or product team running production AI agents. Token cost is one of the largest variable cost lines in agent products — small policy improvements compound quickly across millions of requests. A 50% reduction in tokens per task at scale can be the difference between negative and positive gross margin on an agent SaaS.',
      'TrajectoryRL\'s output is policy packs that have been independently shown to pass safety and correctness gates while running cheaply. The broader OpenClaw stack provides a trajectory-centric RL environment for integrating these packs into agent products. The customer profile is the AI engineering team that ships agents (or the consultancy that ships agents) rather than the end consumer.',
    ],
  },

  competitive: {
    scope: 'agent policy optimisation · 2026',
    rows: [
      { name: 'TrajectoryRL', subtitle: 'SN11', isSelf: true, approach: 'On-chain policy-pack tournament with deterministic safety gates and lowest-cost-wins scoring.', access: 'open · git', accessTone: 'open', differentiator: 'Continuous TAO emissions to the cheapest passing policy; open and forkable leaderboard.' },
      { name: 'DSPy', subtitle: 'Stanford', approach: 'Framework for programming prompts as compilable modules with automatic optimisation routines.', access: 'open · OSS', accessTone: 'open', differentiator: 'Library, not a network; no continuous incentive or shared leaderboard.' },
      { name: 'LangSmith', subtitle: 'LangChain', approach: 'Hosted evaluation and observability for agent runs, with manual prompt iteration tooling.', access: 'closed · SaaS', accessTone: 'closed', differentiator: 'Observability product; relies on team\'s own engineers to find improvements.' },
      { name: 'Prompt consultancies', subtitle: 'AI agencies', approach: 'Bespoke prompt-engineering teams that hand-tune agent stacks for specific clients.', access: 'closed · enterprise', accessTone: 'closed', differentiator: 'High cost per engagement; quality bound by a single firm\'s talent and time.' },
      { name: 'OpenAI Evals', subtitle: 'OpenAI', approach: 'Open-source evaluation framework for LLM behaviours with community contributions.', access: 'open · OSS', accessTone: 'open', differentiator: 'Evaluation, not optimisation; no payment loop for improving submissions.' },
    ],
    note: 'TrajectoryRL\'s edge versus DSPy and LangSmith is the payment loop — anyone can author a policy pack and get paid in TAO when it wins the cost ranking. Versus consultancies, it scales the search across a global pool of miners. The deterministic ClawBench gates also force a measurable definition of "good enough" that consultancies usually negotiate ad-hoc.',
  },

  team: {
    intro: [
      'TrajectoryRL is the latest re-architecture of Subnet 11. The slot was previously "Dippy Roleplay" before being reoriented around cost-efficient agent policies. The team maintains the trajectoryRL/trajectoryRL repository and the trajectoryRL/clawbench evaluation framework, and is publicly aligned with the broader OpenClaw token-optimisation research stack.',
      'The team\'s explicit thesis is that prompt and policy design is now a measurable engineering surface, not an art — the right competition mechanism plus the right test scenarios produce policies that beat any in-house team. The economic argument is that even modest token-cost reductions, applied at the scale of production agent products, dwarf the cost of the TAO emissions being paid out.',
    ],
    founders: [
      { initials: 'TR', gradient: 'v', name: '[TrajectoryRL team]', role: 'Subnet operator', bio: 'Operates the trajectoryRL/trajectoryRL repo and ClawBench evaluation framework. Specific founder identities are not publicly listed on the project site.' },
    ],
    size: 'Small (not publicly disclosed)',
    founded: 'Subnet 11 originally registered early 2024; TrajectoryRL pivot in 2025',
    based: 'Distributed (not publicly disclosed)',
    backers: 'Not publicly disclosed.',
    placeholder: true,
  },

  milestones: [
    { date: '2024·Q1', text: 'Subnet 11 launched as Dippy Roleplay — original roleplay LLM incentive mechanism.' },
    { date: '2025', text: 'Pivot to TrajectoryRL — re-architected around agent-policy cost optimisation.' },
    { date: '2026', text: 'ClawBench evaluation framework formalised; OpenClaw token-optimisation integration published.' },
  ],

  join: {
    title: 'Author a policy pack',
    body: 'Fork trajectoryRL/trajectoryRL, write your best AGENTS.md / SOUL.md / tool_policy bundle, upload to any HTTP endpoint, commit the SHA256 on chain, and register a Bittensor miner on SN11.',
    asideNote: 'Validators need standard SN11 stake plus LLM API access to execute every miner\'s policy pack across the ClawBench scenarios each tempo.',
  },

  tags: ['agents', 'prompt-engineering', 'reinforcement-learning', 'cost-optimisation'],

  external: {
    github:   'https://github.com/trajectoryRL/trajectoryRL',
    website:  'https://trajrl.com/',
    taostats: 'https://taostats.io/subnets/11/',
  },
};
