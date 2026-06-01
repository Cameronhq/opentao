import type { RichSubnet } from '../subnet-rich';

export const sn15: RichSubnet = {
  slug: '15-oro',
  netuid: 15,
  name: 'ORO',
  shortPitch: 'A Bittensor subnet that benchmarks AI agents on real online commerce tasks.',
  overview: [
    'ORO is the subnet operated by ORO-AI for evaluating and incentivizing AI agents in online commerce. Miners submit Python agents that browse the web, search products, compare prices, and complete purchase-style tasks. Validators score outputs against a held-out commerce benchmark. The customer outside Bittensor is the team building a real-world shopping agent.',
    'The subnet uses a standard metagraph with permissionless miner registration. Each tempo the validator issues a commerce task — a product search, a price-comparison, a checkout simulation — and grades the agents that responded. Agents that complete the task accurately and quickly score higher; the median across validators turns into emission via Yuma.',
    'The customer pitch is direct: every retailer wants an AI agent that can shop for users, and nobody has shipped one that actually works. ORO turns benchmark performance into open competition — anyone can submit an agent, the best one earns TAO, and ORO captures the eval pipeline and the dataset.',
    'Where lab-grade agent benchmarks (WebArena, VisualWebArena) freeze a static eval suite, ORO runs a live tournament with rolling tasks and 64+ miner slots. <a href="#customer" style="color: var(--accent);">See competitive landscape ↓</a>',
  ],
  cycle: {
    challenge: { actor: 'Validator', title: 'Issue commerce task', body: 'Pick a real-world shopping prompt — find a product, compare prices, complete a checkout — and broadcast it to active miners.', dataK: 'payload', dataV: 'Task spec + target site' },
    compute:   { actor: 'Miner',     title: 'Run the agent', body: 'Each miner runs its Python agent through a sandboxed browser, navigates the live web, and returns the action trace and final state.', dataK: 'latency',  dataV: '10–120 s per task' },
    score:     { actor: 'Validator', title: 'Grade the trace', body: 'Check that the agent reached the correct product, picked the cheapest valid option, and completed the requested action. Compare to held-out ground truth.', dataK: 'scale', dataV: '0.0 → 1.0 · accuracy × speed' },
    settle:    { actor: 'Subtensor', title: 'Yuma → emission', body: "Every validator's weights, multiplied by their stake, aggregated by Yuma into one reward vector. TAO mints to top miners.", dataK: 'tempo', dataV: '~72 min · 24×/day' },
  },
  miner: {
    does: 'Runs a Python shopping agent against commerce tasks each tempo.',
    input: 'Task spec — natural-language commerce prompt + target site',
    output: 'Action trace + final state (cart, price, URL)',
    hardware: 'Mid-tier GPU + headless browser stack',
    paidFor: 'Completing the task accurately and fast vs other agents',
    paidVia: 'Per-tempo emission, score × validator stake',
  },
  validator: {
    does: 'Issues commerce tasks, runs ground-truth checks against agent traces, submits weights.',
    requires: 'Top-N stake + reference validator code + task generator',
    output: 'Per-UID weight vector, signed on-chain',
    paidFor: 'Submitting weights that agree with consensus median',
    paidVia: 'Per-tempo emission, stake × consensus alignment',
  },
  scoring: {
    leadOneLine: 'An agent attempts a real shopping task. Did it work?',
    explanation: [
      'The validator issues a concrete commerce task — "find the cheapest iPhone 15 Pro 256GB in stock," "compare prices for X across three retailers," "add to cart" — and broadcasts it to active miners. Each miner runs its agent in a sandboxed browser, returning the action trace and final state. The validator then checks whether the agent reached the correct product, found a valid price, and completed the requested action.',
      'Scoring weighs accuracy first, then latency. An agent that returns the right answer in 15 seconds beats one that returns the right answer in 90 seconds. An agent that hallucinates the wrong product scores zero regardless of speed.',
    ],
    cheatPath: 'Memorizing known product URLs — the catalog of tasks rotates and includes new SKUs each week. Returning cached results — the validator injects fresh tasks the miner has not seen. Scraping prior validator scores — the trace check verifies the agent actually navigated the site.',
  },
  customer: {
    leadOneLine: 'The customer outside Bittensor is the team shipping a consumer shopping agent.',
    explanation: [
      'Anyone building a "ChatGPT for shopping" product needs (a) a high-quality agent and (b) a benchmark to know it actually works. ORO produces both — the network selects for the best agent, and the eval pipeline doubles as a customer-facing benchmark. ORO-AI can resell the best miner agent as an API, or sell access to the benchmark itself to enterprise R&D teams.',
      'Concretely: the trace dataset (real agents acting on real commerce sites) is rare and valuable. Each successful task produces a labeled action trajectory — exactly the kind of data needed to fine-tune the next generation of commerce agents.',
    ],
  },
  competitive: {
    scope: 'commerce-agent benchmark · 2026',
    rows: [
      { name: 'ORO', subtitle: 'SN15', isSelf: true, approach: 'Incentivized tournament of shopping agents, scored on real commerce tasks', access: 'open · API', accessTone: 'open', differentiator: 'Live competition · open submission · trace dataset as byproduct' },
      { name: 'WebArena', approach: 'Academic benchmark — frozen task suite on self-hosted sites', access: 'open dataset', accessTone: 'open', differentiator: 'Reproducible · static · no live competitive pressure' },
      { name: 'Adept ACT-1', approach: 'Closed agent trained in-house at a centralized lab', access: 'closed', accessTone: 'closed', differentiator: 'Single proprietary model · no transparent benchmark' },
      { name: 'OpenAI Operator', approach: 'GPT-based agent for web tasks, behind ChatGPT subscription', access: 'closed · paid', accessTone: 'closed', differentiator: 'Best-in-class general agent · no commerce specialization · expensive' },
      { name: 'Anthropic Computer Use', approach: 'Claude with screenshot + click tool use', access: 'closed · API', accessTone: 'closed', differentiator: 'General-purpose · slow · still research-grade' },
    ],
    note: 'The defensible part of ORO is the eval surface. Big labs ship one agent; ORO is selecting from sixty-plus agents in parallel, each retraining against last week\'s task distribution. If commerce agents become a real category, the team owning the benchmark owns the standard.',
  },
  team: {
    intro: [
      'ORO-AI is the team operating subnet 15. The project name carries a triple meaning: "oro" means gold in Spanish and Italian (the value layer), and "oro-" (ὄρος) means mountain in Ancient Greek — an homage to where the founders met. The team focuses on the agent-evaluation pipeline and the open dataset.',
      'The pitch they make: nobody has shipped a shopping agent that actually works, and the bottleneck is evaluation. Whoever owns the eval owns the category.',
    ],
    founders: [
      { initials: 'OR', gradient: 'v', name: '[Founder 1 name]', role: 'Co-founder', bio: 'Background in ML evaluation and agent benchmarks. Owns the validator and the task generator. Public commits under the ORO-AI GitHub org.', github: 'https://github.com/ORO-AI' },
      { initials: 'OA', gradient: 'a', name: '[Founder 2 name]', role: 'Co-founder', bio: 'Background in commerce / browser automation. Owns the reference miner agent and the trace-collection pipeline.' },
    ],
    size: '~3–5',
    founded: '2024',
    based: 'Distributed',
    backers: 'Not publicly disclosed.',
    placeholder: true,
  },
  milestones: [
    { date: '2024·Q2', text: 'Subnet 15 registered on mainnet.' },
    { date: '2025·Q1', text: 'Renamed/repositioned as ORO — AI agents for online commerce.' },
    { date: '2025·Q3', text: 'ORO-AI GitHub org seeded with reference miner and Bittensor auth library.' },
    { date: '2026·Q1', text: 'Agent benchmark goes live with rotating commerce task catalog.' },
  ],
  join: {
    title: 'Submit a shopping agent',
    body: 'Hardware spec, install commands, and the reference miner template are in the ORO-AI GitHub. Validators welcome — stake requirement and validator code via the repo.',
    asideNote: 'Validating? Requires a top-N stake position and the task generator. Reach out via the ORO Discord linked from GitHub.',
  },
  tags: ['ai-agent', 'commerce', 'benchmark', 'evaluation'],
  external: {
    github: 'https://github.com/ORO-AI/oro',
    website: 'https://oro.ai',
    twitter: 'https://twitter.com/oro_ai',
    taostats: 'https://taostats.io/subnets/15/',
  },
};
