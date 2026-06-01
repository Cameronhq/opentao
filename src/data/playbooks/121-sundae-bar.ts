import type { RichPlaybook } from '../playbook-rich';

// SN121 — Sundae Bar. Operated by Sundae Bar PLC (LSE: SBAR).
// Brief-driven AI agent creation economy. Miners are developers who submit
// open-source generalist agents that get evaluated by the AETS (Agent Eval
// Test Suite) and listed on the sundae_bar consumer marketplace.

export const sn121: RichPlaybook = {
  slug: '121-sundae-bar',
  netuid: 121,
  name: 'sundae_bar',
  category: 'reason',
  categoryLabel: 'Agents · marketplace',

  blurb:
    'Brief-driven AI agent economy run by a London-listed PLC. Miners (developers) submit open-source generalist agents; winning agents get listed in the sundae_bar marketplace and earn alpha emission.',

  whatMinersDo:
    "A SN121 miner is a developer who builds an open-source generalist agent (Letta is the priority framework, with LangChain / AutoGen / CrewAI / LangGraph planned) and submits it for evaluation against the AETS (Agent Eval Test Suite). Validators run the agent across multiple seeds and rubric dimensions — task completion, reasoning, retrieval, tool-use — and the winning agents are listed in the sundae_bar consumer marketplace. Mining is intermittent submission work, not a long-running inference daemon: build, package, submit, iterate.",

  verifiedAt: '2026-06-01',
  verifiedBy: '@editorial',

  emission: '— τ/day',
  burnCostFallback: '— τ',
  minerCountFallback: 0,
  slotCap: 256,

  hardware: [
    {
      role: 'Developer workstation',
      count: '1',
      cpuCores: 8,
      ramGb: 32,
      diskGb: 200,
      bandwidth: 'standard broadband',
      notes: 'No GPU required for development — agent inference can route through hosted LLM APIs. The miner machine builds and packages the agent; validators run it on their side.',
    },
  ],
  hardwareNote:
    "SN121 is not a continuous-inference subnet — miners ship agents, validators run them. Standard developer rig is sufficient. Budget for LLM API calls during testing rather than local GPU.",

  rentalOk: true,
  rentalUsdPerHr: { lambda: 0.45, runpod: 0.39, coreweave: 0.50 },

  repo: {
    url: 'https://github.com/sundae-bar/bittensor-subnet',
    branch: 'main',
  },

  setupShape: 'simple-binary',
  setupOverview:
    "Build an open-source generalist agent in Letta (or another supported framework), package it according to the sundae_bar runtime contract, and submit for AETS evaluation. The public repo currently ships a spec-heavy README — primary onboarding is via sundaebar.ai/news/meet-our-developers and the corporate site.",

  install: [
    { step: 'Read the SN121 spec README',
      cmd:  'git clone https://github.com/sundae-bar/bittensor-subnet && cd bittensor-subnet',
      note: 'README describes the brief-driven flow, AETS evaluation, and Letta-first framework strategy. Detailed miner scaffolding is published via the dev-onboarding channel.' },
    { step: 'Install Letta (priority framework)',
      cmd:  'pip install letta',
      note: 'Other frameworks (LangChain, AutoGen, CrewAI, LangGraph) are on the roadmap. Letta is the priority because it aligns with the AETS evaluation infrastructure.' },
    { step: 'Install Bittensor + register on SN121',
      cmd:  'pip install bittensor && btcli subnet register --netuid 121 --wallet.name $WALLET --wallet.hotkey $HOTKEY',
      note: 'Re-check burn cost on taostats.io/subnets/121 immediately before registration.' },
    { step: 'Pull live briefs from the marketplace',
      note: 'Active briefs come through the sundae_bar marketplace. Pick a brief, build an agent that solves it, and prepare the submission package.' },
  ],

  runSteps: [
    { step: 'Build your agent against an active brief',
      note: 'Implement the agent against the brief spec using Letta. Agent must be fully open-source — closed-source submissions are not eligible.' },
    { step: 'Submit the agent for AETS evaluation',
      note: 'Submission path is via the sundae_bar developer console (see sundaebar.ai/news/meet-our-developers). Validators run the AETS suite against multiple seeds and scenarios.' },
    { step: 'Monitor your UID on the metagraph',
      cmd:  'btcli subnet metagraph --netuid 121',
      note: 'Winning agents see emission concentrate on their UID and get listed in the storefront. Iterate on the same hotkey or burn the UID and resubmit.' },
  ],

  envVars: [
    { name: 'WALLET',  description: 'Coldkey name (matches btcli wallet list)', required: true },
    { name: 'HOTKEY',  description: 'Hotkey name on that coldkey',              required: true },
  ],

  scoring: {
    summary:
      'Scoring is brief-conditional and rubric-based. Validators run each submitted agent through the AETS across multiple seeds, scoring on task completion, reasoning quality, retrieval accuracy, and tool-use. Winner-takes-all economics — top-performing agent on each brief captures the bulk of the emission for that round, and the agent gets listed in the consumer marketplace.',
    rule: 'Submit open-source agents that win briefs against the AETS rubric and earn marketplace listings.',
    cheatPath:
      'Thin LLM wrappers that nominally pass a brief but fail in real marketplace use are the obvious attack. The marketplace traction signal and a human curation step are designed to demote them, but rigorous programmatic anti-gaming is still an open area as the subnet scales. Submitting closed-source code disqualifies the agent.',
  },

  profitability: {
    estimatedDailyEmissionPerUid: 0.0,
    tokenPriceUsdFallback: 284,
    capexNote:
      'Effectively zero capex — a developer workstation plus LLM API budget. Mining is submission-based, not always-on.',
    notes:
      'Winner-takes-all per brief means emission distribution is heavily skewed. Treat SN121 as a development bet, not a passive yield play: shipping an agent that wins a brief and lands in the marketplace is the unit of value.',
  },

  milestones: [
    { day: 'day 1',  target: 'Spec absorbed, first brief picked',
      note: 'Read the README + AETS framing; pick one active brief from the marketplace and scope the agent.' },
    { day: 'day 7',  target: 'First Letta agent submitted',
      note: 'Working agent against your chosen brief. Expect to lose the first round — AETS rubrics are stricter than typical demos.' },
    { day: 'day 14', target: 'AETS feedback incorporated',
      note: 'Iterate on the failure modes. Tool-use and retrieval are the typical weak spots.' },
    { day: 'day 30', target: 'Agent listed in marketplace OR pivot to new brief',
      note: 'If you have not landed a listing, switch briefs — different problem domains reward different agent architectures.' },
  ],

  monitoring: [
    { metric: 'UID incentive',                threshold: '> 0',     where: 'btcli subnet metagraph --netuid 121' },
    { metric: 'AETS rubric scores',           threshold: 'rising',  where: 'sundae_bar developer console' },
    { metric: 'Marketplace listing status',   threshold: 'listed',  where: 'sundaebar.ai consumer storefront' },
  ],

  knownIssues: [
    {
      symptom: 'Agent submission rejected as "not fully open-source"',
      cause:   "SN121 requires open-source agents — any closed dependency, hidden prompt, or proprietary tool path fails the eligibility check.",
      fix:     'Move all agent logic into the public repo. LLM API keys can stay private but the agent code and prompts must be open.',
    },
    {
      symptom: 'Agent passes simple briefs, fails complex ones',
      cause:   'AETS scores reasoning and tool-use separately. A single-turn LLM wrapper will pass trivial briefs and lose on anything multi-step.',
      fix:     'Use Letta primitives — memory, tools, multi-step planning — rather than a thin LLM call. Test against AETS-style rubrics before submitting.',
    },
    {
      symptom: 'Documentation feels thin compared to other subnets',
      cause:   "SN121 onboarding is happening through the corporate dev-relations channel (sundaebar.ai), not the GitHub README.",
      fix:     'Hit sundaebar.ai/news/meet-our-developers, the Investegate filings, and the @sundaebar_ai X account for the up-to-date miner playbook.',
    },
  ],

  notes: [
    'Operator is Sundae Bar PLC (LSE: SBAR) — public-company filings on Investegate are the most reliable channel for roadmap and KPI updates.',
    'Letta is the priority framework. LangChain / AutoGen / CrewAI / LangGraph are on the published roadmap.',
    'The marketplace ships agents to real consumers — a listed agent generates ongoing usage signal in addition to per-tempo emission.',
    'Mining here is closer to a development competition than a continuous inference pipeline.',
  ],
};
