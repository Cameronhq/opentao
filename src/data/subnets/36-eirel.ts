import type { RichSubnet } from '../subnet-rich';

export const sn36: RichSubnet = {
  slug: '36-eirel',
  netuid: 36,
  name: 'Eirel',
  shortPitch: 'Execution layer for multimodal AI workflows — agents that run real tasks on real software.',
  overview: [
    'Subnet 36 is currently branded as Eirel, positioned on the Bittensor.ai directory as "the execution layer for multimodal AI workflows". The slot was originally registered as "Web Agents" / Autoppia and operated as a benchmark — Infinite Web Arena (IWA) — for autonomous web agents capable of navigating arbitrary websites, filling forms, and extracting data; the Eirel positioning extends that lineage from web-only into broader multimodal task execution.',
    'Miners run agent models (typically LLM + tool-use stacks, sometimes multimodal) that accept a workflow specification and complete it end-to-end — clicking, typing, reading screenshots, calling tools. Validators issue benchmark tasks against a sandboxed environment, score whether the agent actually completed the task, and write weights on-chain. Source for the original web-agent layer is at github.com/autoppia/autoppia_web_agents_subnet.',
    'The customer is outside Bittensor: AI-agent builders, automation/RPA buyers, and SaaS teams that want a "real work executed" capability behind their products. Workflow-level outputs (a completed booking, a filled form, a structured data extraction) are the deliverable, not a chat reply.',
    'SN36 competes with browser-agent stacks (Browserbase, Anchor, Skyvern) and broader agent platforms (LangChain, Crew, AutoGen). <a href="#customer" style="color: var(--accent);">See competitive landscape ↓</a>',
  ],
  cycle: {
    challenge: { actor: 'Validator', title: 'Issue task spec', body: 'Validator constructs a workflow task (e.g., "search this site for X, extract Y, fill form Z") in a sandboxed environment and dispatches it to a sample of miners.', dataK: 'payload', dataV: 'task spec + env + success rubric' },
    compute:   { actor: 'Miner',     title: 'Execute workflow', body: 'Miner\'s agent stack — LLM + tool use + (optionally) multimodal vision — interacts with the sandbox: clicks, types, reads pages, calls tools, and returns the final result.', dataK: 'latency',  dataV: 'task-bounded, often minute-scale' },
    score:     { actor: 'Validator', title: 'Grade completion', body: 'Validator checks the produced state against the success rubric — was the right data extracted, was the form filled correctly, did the agent finish — and scores miners on completion + efficiency.', dataK: 'scale', dataV: 'completion · steps · time' },
    settle:    { actor: 'Subtensor', title: 'Yuma → emission', body: "Every validator's weights, multiplied by their stake, aggregated by Yuma into one reward vector. TAO mints to top miners.", dataK: 'tempo', dataV: '~72 min · 24×/day' },
  },
  miner: {
    does: 'Runs an autonomous agent stack (LLM + tool use + browser / multimodal vision) that executes specified workflows end-to-end.',
    input: 'Workflow task specification + access to a sandboxed environment (web page, software UI, tool set).',
    output: 'Final state or extracted result demonstrating successful task completion.',
    hardware: 'GPU host(s) for the underlying LLM + multimodal model; reliable browser-automation / tool-runtime stack.',
    paidFor: 'High task-completion rate, efficient step counts, and faithful execution measured against validator rubrics.',
    paidVia: 'Per-tempo emission, score × validator stake',
  },
  validator: {
    does: 'Builds task batches with known success rubrics in a sandboxed environment, queries miner agents, grades outcomes, and writes on-chain weights.',
    requires: 'Stake plus a benchmark harness (Infinite Web Arena-style) able to spin up sandboxed environments and verify task completion deterministically.',
    output: 'Per-miner weight vector reflecting completion rate, efficiency, and rubric compliance.',
    paidFor: 'Submitting weights that agree with consensus median',
    paidVia: 'Per-tempo emission, stake × consensus alignment',
  },
  scoring: {
    leadOneLine: 'Did the agent finish the job? — task completion in a sandbox, with efficiency tie-breakers.',
    explanation: [
      'For each task the validator knows the success rubric: which fields should be filled, which data should be extracted, which final state counts as "done". After the miner agent runs, the validator inspects the resulting environment state and produces a binary or graded completion score, plus efficiency metrics like step count, wall-clock time, and number of tool calls.',
      'Because the benchmark runs in a sandbox, validators can rotate task families (forms, search, multi-step booking, data extraction) without leaking real user data. Weights are written on-chain every tempo and Yuma consensus picks the median, so a single rogue validator cannot reward a friendly miner.',
    ],
    cheatPath: 'A miner can memorise specific tasks, return plausible-looking outputs without actually executing, or use Sybil copies. State-level grading (was the form actually filled in the sandbox?) kills outputs that were not produced by real execution; task-family rotation kills memorisation; cross-validator scoring catches copycats.',
  },
  customer: {
    leadOneLine: 'AI-agent builders, automation/RPA buyers, and SaaS teams that need "agents that complete tasks" rather than "agents that chat".',
    explanation: [
      'Direct buyers are agent platforms and RPA-replacement products that want a backend capable of executing real workflows: filling enterprise forms, navigating SaaS dashboards, performing structured data extractions across heterogeneous sites. Eirel positions itself as the execution layer — what happens after the planning LLM decides what to do.',
      'The multimodal framing means the same agent stack can target web pages, desktop applications, and image/document content, which is the direction the broader agent ecosystem is moving. The subnet\'s success metric is benchmark performance — what share of real tasks the network of miners can complete versus closed alternatives like OpenAI Operator or Anthropic computer-use.',
    ],
  },
  competitive: {
    scope: 'autonomous web + multimodal agents · 2026',
    rows: [
      { name: 'Eirel', subtitle: 'SN36', isSelf: true, approach: 'Bittensor-incentivized agent network executing multimodal workflows; validators score task completion in sandboxed environments.', access: 'open', accessTone: 'open', differentiator: 'Open tournament across the full agent stack; routes to best executor automatically; benchmark-driven.' },
      { name: 'OpenAI Operator', approach: 'OpenAI\'s browser-using agent productised inside ChatGPT; computer-use API.', access: 'closed · API', accessTone: 'closed', differentiator: 'Strong default model; single-vendor, closed weights, gated access.' },
      { name: 'Anthropic computer use', approach: 'Claude with computer-use API — screenshot-based UI control.', access: 'closed · API', accessTone: 'closed', differentiator: 'Strong reasoning + tool use; closed model behind Anthropic API.' },
      { name: 'Browserbase / Anchor / Skyvern', approach: 'Browser-automation infrastructure platforms exposing headless-browser sessions to agent builders.', access: 'closed · API', accessTone: 'closed', differentiator: 'Provide infra layer, not the agent itself; agent quality depends on caller.' },
      { name: 'LangChain / CrewAI / AutoGen', approach: 'Open-source agent frameworks letting developers compose their own multi-agent workflows.', access: 'open · libs', accessTone: 'open', differentiator: 'Toolkits not services; quality depends entirely on developer plumbing.' },
    ],
    note: 'Agents that actually finish real tasks are the current frontier of LLM productisation. Eirel\'s thesis is that the question "which agent stack works best?" should be answered by an open tournament rather than by any single vendor model — and that the same incentive layer can keep up as multimodal capability grows.',
  },
  team: {
    intro: [
      'Subnet 36 originated under Autoppia (autoppia.com) — a company focused on autonomous web automation — and operated the Infinite Web Arena (IWA) benchmark for web agents. The Eirel positioning extends that lineage; founder identities for the current Eirel iteration are not extensively documented in publicly cross-checkable sources at time of writing.',
      'The team\'s philosophy, visible in the Autoppia repo and Bittensor.ai positioning, is that benchmark-driven open competition is the right way to build agents that finish real work, and that multimodal task execution is the long-arc payoff.',
    ],
    founders: [
      { initials: 'AU', gradient: 'v', name: '[Autoppia / Eirel founders]', role: 'Operator team', bio: 'SN36 originated under Autoppia, operator of the Infinite Web Arena benchmark; the team has since positioned the subnet as Eirel for multimodal execution. Individual founder identities not extensively documented in public sources cross-checked here.', github: 'https://github.com/autoppia' },
    ],
    size: 'Small core team (Autoppia)',
    founded: '2024 (original SN36 registration as Web Agents)',
    based: 'Not publicly disclosed.',
    backers: 'Not publicly disclosed.',
    placeholder: true,
  },
  milestones: [
    { date: '2024', text: 'Subnet 36 registered as Web Agents by Autoppia; Infinite Web Arena (IWA) benchmark live.' },
    { date: '2024', text: 'autoppia_web_agents_subnet repo open-sourced on GitHub.' },
    { date: '2025·2026', text: 'Subnet positioning evolves to "Eirel — execution layer for multimodal AI workflows" on the Bittensor.ai directory.' },
  ],
  join: {
    title: 'Build an agent on Eirel',
    body: 'Stand up an agent miner that executes multimodal workflows in sandboxed environments, or hit the subnet API to delegate task execution to the network. Original web-agent code: github.com/autoppia/autoppia_web_agents_subnet.',
    asideNote: 'Subnet is mid-evolution from Web Agents (Autoppia / IWA) toward Eirel multimodal scope — confirm the current scoring spec from operator channels.',
  },
  tags: ['agents', 'automation', 'multimodal', 'execution', 'workflows'],
  external: {
    github: 'https://github.com/autoppia/autoppia_web_agents_subnet',
    website: 'https://bittensor.ai/subnets/36',
    taostats: 'https://taostats.io/subnets/36/',
  },
};
