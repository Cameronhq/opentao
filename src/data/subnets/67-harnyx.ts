import type { RichSubnet } from '../subnet-rich';

export const sn67: RichSubnet = {
  slug: '67-harnyx',
  netuid: 67,
  name: 'Harnyx',
  shortPitch: 'Deep-research API for AI agents — competitive swarm with traceable sources.',
  overview: [
    'Harnyx (SN67) is a Bittensor subnet that sells "deep research" as an API. A single curl or SDK call sends a query into a competitive swarm of miners, each of which builds its own research pipeline — model choice, retrieval strategy, reasoning loop — and returns a structured JSON report with a synthesized answer plus citations.',
    'The pitch sits between fast web search (cheap, shallow) and full-fat AI research products like ChatGPT Deep Research or Perplexity Pro (slower, expensive, opaque about sources). Harnyx claims faster + cheaper because the work is done by a competitive miner swarm, and more trustworthy because every claim is linked back to its source document.',
    'Validators evaluate miner answers against reference responses and explicitly grade traceability — a claim with no citation, or a citation that does not support the claim, is penalized. The dominant strategy for miners is to build pipelines that are good at both quality and source attribution, not just one.',
    'The subnet is live on mainnet (netuid 67) with an early-access waitlist while the public API is hardened. The team is anonymous; previous SN67 operators (the Tenex / Tenexium project) appear to have departed under controversy before the slot was occupied by Harnyx. <a href="#customer" style="color: var(--accent);">See competitive landscape ↓</a>',
  ],
  cycle: {
    challenge: { actor: 'Validator', title: 'Research query', body: 'Validator sends a real research question — market analysis, competitive intel, scientific question — to the swarm with a reference answer held back.', dataK: 'payload', dataV: 'Query + reference set' },
    compute:   { actor: 'Miner',     title: 'Build a pipeline', body: 'Miner runs its own research stack — model, retrieval, reasoning — and returns a structured answer with citations.', dataK: 'latency',  dataV: 'Seconds to minutes' },
    score:     { actor: 'Validator', title: 'Quality × traceability', body: 'Validator scores answers on factual quality vs reference and on whether each claim is supported by a real, retrievable source citation.', dataK: 'scale',    dataV: '0–1 composite' },
    settle:    { actor: 'Subtensor', title: 'Yuma → emission', body: "Every validator's weights, multiplied by their stake, aggregated by Yuma into one reward vector. TAO mints to top miners.", dataK: 'tempo', dataV: '~72 min · 24×/day' },
  },
  miner: {
    does: 'Designs and runs a deep-research pipeline that ingests queries and returns structured answers with verifiable citations.',
    input: 'Natural-language research query.',
    output: 'Structured JSON containing a synthesized answer plus claim-level citations.',
    hardware: 'GPU host able to run an LLM stack plus retrieval / browsing infrastructure.',
    paidFor: 'Producing accurate, well-cited research answers faster than peers',
    paidVia: 'Per-tempo emission, score × validator stake',
  },
  validator: {
    does: 'Issues research queries with reference answers, grades miner output on quality and citation faithfulness, and submits weights.',
    requires: 'Reference research corpus, citation-checking tooling, and ground-truth scoring.',
    output: 'Weight vector ranking miners on traceable research quality.',
    paidFor: 'Submitting weights that agree with consensus median',
    paidVia: 'Per-tempo emission, stake × consensus alignment',
  },
  scoring: {
    leadOneLine: 'A right answer with a real citation is worth far more than a confident answer with none.',
    explanation: [
      'Each miner answer is scored on two axes: how closely it matches the held-back reference (or human grading) and how well its citations actually support its claims. A confident hallucination with no source is the worst case — better to return a shorter, fully cited answer.',
      'The architecture deliberately encourages diversity of pipelines. Some miners may rely on Perplexity-style web retrieval, some on dedicated research models, some on agent-loop reasoning. Validators do not care how the answer was produced, only whether it is correct and traceable.',
    ],
    cheatPath: 'Fabricating citations that look real but do not exist — validator-side fetching catches missing or off-topic sources fast.',
  },
  customer: {
    leadOneLine: 'Developers building AI agents that need cheap, fast, citeable research as a primitive.',
    explanation: [
      'The primary buyer is the AI-agent stack: any agent that needs to gather background context (competitive intel, market research, scientific lookup, investment due diligence) before acting. Today that is solved by chaining expensive Perplexity / ChatGPT calls or building bespoke retrieval pipelines.',
      'Harnyx wants to be the deep-research API call agents reach for, with traceability built into the response so the calling agent can decide how much trust to put in each claim. Enterprise teams running market or competitive analysis are the secondary buyer.',
    ],
  },
  competitive: {
    scope: '2026 · deep-research APIs for agents',
    rows: [
      { name: 'Harnyx', subtitle: 'SN67', isSelf: true, approach: 'Open swarm of research pipelines, scored on quality + citation faithfulness; single-API access.', access: 'open · subnet (early API)', accessTone: 'open', differentiator: 'Decentralized, traceable, cheaper per query than closed deep-research products.' },
      { name: 'OpenAI Deep Research', approach: 'GPT-based deep research feature inside ChatGPT.', access: 'closed · SaaS', accessTone: 'closed', differentiator: 'Strong quality, slow and expensive, opaque sourcing.' },
      { name: 'Perplexity Pro', approach: 'Search-grounded research with citations as a consumer product.', access: 'closed · SaaS', accessTone: 'closed', differentiator: 'Best-known consumer brand for cited research; subscription-shaped, less API-shaped.' },
      { name: 'Exa / Tavily', approach: 'Developer-facing search and research APIs.', access: 'closed · API', accessTone: 'closed', differentiator: 'Closed pricing; no competitive swarm shaping quality.' },
      { name: 'In-house RAG stacks', approach: 'Custom retrieval + LLM pipelines built by individual teams.', access: 'closed · internal', accessTone: 'closed', differentiator: 'Expensive to build and maintain; no shared improvement loop.' },
    ],
    note: 'Whether Harnyx wins depends less on quality vs Perplexity in head-to-head, and more on whether the price-per-query and the citation guarantee become attractive enough that agent builders default to Harnyx as a primitive instead of stitching together their own RAG.',
  },
  team: {
    intro: [
      'Harnyx publishes the subnet under harnyx.ai with a "deep research API for AI agents" pitch. The team is anonymous: no founders or team members are publicly named, no advisors or backers disclosed, and there is no announced fundraise.',
      'The SN67 slot has a complicated history. A prior project (Tenex / Tenexium, pitching decentralized long-only spot margin) operated on netuid 67 and ended in public allegations of an exit. Harnyx is the current operator, and any due-diligence narrative on SN67 needs to separate the two clearly.',
    ],
    founders: [
      { initials: 'F1', gradient: 'v', name: '[Founder 1 name]', role: 'Founder', bio: 'Anonymous founder operating Harnyx. No public identity, advisors, or fundraise disclosed as of 2026·05.' },
    ],
    size: 'Not publicly disclosed.',
    founded: '2026',
    based: 'Not publicly disclosed.',
    backers: 'Not publicly disclosed.',
    placeholder: true,
  },
  milestones: [
    { date: '2026', text: 'Harnyx launches on Bittensor mainnet as netuid 67 (replacing prior SN67 operator).' },
    { date: '2026·Q2', text: 'Early API access opens via waitlist; mining and validation tooling active.' },
  ],
  join: {
    title: 'Mine research that AI agents will actually pay for',
    body: 'If you can build a retrieval + reasoning stack that answers research questions faster than Perplexity and cites every claim, Harnyx pays per tempo.',
    asideNote: 'LLM + retrieval / RAG background pays off fastest.',
  },
  tags: ['research', 'rag', 'agents', 'api'],
  external: {
    website: 'https://harnyx.ai/',
    taostats: 'https://taostats.io/subnets/67/',
  },
};
