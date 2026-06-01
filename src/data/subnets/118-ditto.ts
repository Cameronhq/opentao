import type { RichSubnet } from '../subnet-rich';

export const sn118: RichSubnet = {
  slug: '118-ditto',
  netuid: 118,
  name: 'Ditto',
  shortPitch: 'Open-source Claude Cowork — collaborative agent workflows on Bittensor.',
  overview: [
    'Ditto (SN118) bills itself as an "Open-Source Claude Cowork" — a Bittensor subnet for collaborative agent workflows that mirror the way teams use Claude for actual work. The pitch is to take the multi-agent, multi-step Cowork pattern out of a single-vendor environment and run it on a decentralized network of miners.',
    'The subnet name and tagline come from its taostats and bittensor.ai registry listing ("DittoSN118 — Open-Source Claude Cowork"). The architecture and scoring details have not been heavily publicized as of May 2026 — most public signal is the subnet listing plus a small set of validators (~9) with no live miner cohort yet on the registry snapshot.',
    'In practice the design points toward orchestrating Claude-style agent teams: one agent plans, another executes, others critique. Miners run the agent stack and compete on output quality; validators benchmark them on representative cowork tasks.',
    'Closest comparators are agent-runtime subnets and cowork product surfaces — Affine (SN120), agent stacks built on Chutes, Anthropic\'s own multi-agent demos, and centralized agent platforms like Lindy or Cursor. <a href="#customer" style="color: var(--accent);">See competitive landscape ↓</a>',
  ],
  cycle: {
    challenge: {
      actor: 'Validator',
      title: 'Issue cowork task',
      body: 'Validator dispatches a multi-step collaborative task — research, write, critique, revise — to each miner\'s agent stack.',
      dataK: 'payload',
      dataV: 'multi-step task spec',
    },
    compute: {
      actor: 'Miner',
      title: 'Run agent team',
      body: 'Miner orchestrates a Claude-style cowork — planner, executor, critic — and returns the completed artifact.',
      dataK: 'latency',
      dataV: 'multi-turn execution',
    },
    score: {
      actor: 'Validator',
      title: 'Grade artifact',
      body: 'Validator scores the returned artifact for completeness, correctness, and adherence to the task specification.',
      dataK: 'scale',
      dataV: 'artifact quality',
    },
    settle: {
      actor: 'Subtensor',
      title: 'Yuma → emission',
      body: "Every validator's weights, multiplied by their stake, aggregated by Yuma into one reward vector. TAO mints to top miners.",
      dataK: 'tempo',
      dataV: '~72 min · 24×/day',
    },
  },
  miner: {
    does: 'Runs an open-source Claude-style cowork agent team to complete multi-step tasks issued by validators.',
    input: 'Multi-step task specifications (research, code, write, analyze) from validators or live consumers.',
    output: 'Completed artifacts — documents, code, analyses, plans — produced by the orchestrated agent team.',
    hardware: 'Server with API access to Claude (or compatible) models, plus orchestration code for the cowork loop.',
    paidFor: 'Artifact quality on representative cowork tasks — completeness, correctness, adherence to spec',
    paidVia: 'Per-tempo emission, score × validator stake',
  },
  validator: {
    does: 'Issues cowork tasks, grades the returned artifacts, sets weights based on quality across the task set.',
    requires: 'Server, task corpus, reference solutions or rubric-based grading, ability to evaluate long-form outputs.',
    output: 'Per-miner weight vector based on completed-artifact quality.',
    paidFor: 'Submitting weights that agree with consensus median',
    paidVia: 'Per-tempo emission, stake × consensus alignment',
  },
  scoring: {
    leadOneLine: 'Run a real cowork team and submit work product good enough to survive grading.',
    explanation: [
      'The subnet name "Claude Cowork" implies a workflow where multiple agents collaborate on a single artifact — planner, executor, critic, reviser — much like a human team using Claude does. Validators issue tasks that exercise this loop end-to-end, then grade the final artifact rather than any single step.',
      'Grading happens against either a reference solution or a rubric tailored to the task type. Miners who hard-code single-shot model calls will lose to those operating real multi-agent loops, because the task design rewards the structural cowork pattern, not raw inference quality.',
    ],
    cheatPath: 'One-shot prompting without the cowork loop — single-pass outputs miss the critique/revision quality bar.',
  },
  customer: {
    leadOneLine: 'Teams and developers who want open-source, decentralized agent cowork instead of a single-vendor platform.',
    explanation: [
      'The customer target is anyone who has used Claude\'s cowork or research patterns at work — analysts, developers, writers, ops teams — and wants the same workflow available as an open, decentralized service. Ditto\'s pitch is that you should not have to pay one vendor for the cowork pattern itself.',
      'Secondary customers are developers building agent products who want a TAO-funded cowork runtime as a backend — a place to send multi-step tasks and get high-quality artifacts back without operating the agent stack themselves.',
    ],
  },
  competitive: {
    scope: '2026 · agent cowork runtimes',
    rows: [
      { name: 'Ditto', subtitle: 'SN118', isSelf: true, approach: 'Open-source Claude-style cowork on Bittensor with miners running multi-agent loops', access: 'open · code', accessTone: 'open', differentiator: 'Decentralized cowork runtime; TAO-incentivized agent teams' },
      { name: 'Affine', subtitle: 'SN120', approach: 'Bittensor subnet focused on agent-stack infrastructure and tooling', access: 'open · API', accessTone: 'open', differentiator: 'Different agent-stack philosophy; not cowork-specific' },
      { name: 'Anthropic Claude (direct)', approach: 'Use Claude directly via API or claude.ai with multi-step prompts', access: 'closed · API', accessTone: 'closed', differentiator: 'Centralized; no incentive layer; you operate the loop' },
      { name: 'Lindy / Cognition / Devin', approach: 'Vertical agent SaaS platforms — assistants, software engineers, ops bots', access: 'closed · SaaS', accessTone: 'closed', differentiator: 'Vendor-locked; opinionated UIs; no open weights' },
      { name: 'CrewAI / AutoGen', approach: 'Open-source multi-agent frameworks you self-host', access: 'open · code', accessTone: 'open', differentiator: 'You operate everything; no decentralized backend or incentive layer' },
    ],
    note: 'Ditto\'s wedge depends on the cowork-as-a-service category materializing. The subnet is early — 9 validators and a small footprint on the registry — but the framing is sharp: open-source the pattern, run it on a market, let buyers shop on quality rather than vendor.',
  },
  team: {
    intro: [
      'Ditto ships under the DittoSN118 identity on the Bittensor registry. As of May 2026, no public GitHub organization or team roster is centrally surfaced for the subnet — the operator has been quiet about identity.',
      'The operator handles the cowork orchestration code, the validator scoring stack, and the task corpus used to grade miners.',
    ],
    founders: [
      { initials: 'DT', gradient: 'v', name: '[Founder 1 name]', role: 'Operator', bio: 'Operator team behind Ditto subnet 118; identities not publicly disclosed as of May 2026.' },
    ],
    size: 'Not publicly disclosed.',
    founded: '2025',
    based: 'Distributed',
    backers: 'Not publicly disclosed.',
    placeholder: true,
  },
  milestones: [
    { date: '2025', text: 'Subnet 118 launches as DittoSN118 — Open-Source Claude Cowork.' },
    { date: '2026·05', text: '~9 validators registered; small footprint on the metagraph snapshot.' },
  ],
  join: {
    title: 'Build a cowork team or task the network',
    body: 'If you can orchestrate a Claude-style multi-agent loop — planner, executor, critic — and ship quality artifacts, register a hotkey and mine SN118. If you need cowork work done, point your client at Ditto instead of operating the loop yourself.',
    asideNote: 'Single-shot prompting loses against real multi-agent cowork in the scoring rubric.',
  },
  tags: ['agents', 'cowork', 'claude', 'multi-agent'],
  external: {
    taostats: 'https://taostats.io/subnets/118/',
  },
  tweets: [],
};
