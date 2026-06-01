import type { RichSubnet } from '../subnet-rich';

export const sn121: RichSubnet = {
  slug: '121-sundae-bar',
  netuid: 121,
  name: 'sundae_bar',
  shortPitch: 'Incentivised AI agent creation economy feeding a public marketplace.',
  overview: [
    'Subnet 121 (sundae_bar) is an incentivised AI agent creation economy operated by Sundae Bar PLC, a company listed on the London Stock Exchange under ticker SBAR. The subnet exists to continuously generate and curate a pipeline of high-quality AI agents that get listed on the sundae_bar consumer marketplace, where buyers can subscribe to or use agents for real-world tasks.',
    'The flow is brief-driven: anyone with a real-world problem can submit a brief, developers (miners) compete to build agents that solve it, validators evaluate the resulting agents against the brief, and winning agents are published into the sundae_bar marketplace. The subnet has evaluated more than 1,600 developer submissions and hosts over 300 agents and workflows in production as of early 2026.',
    'Customers are end-users and businesses paying via the sundae_bar app for usable agents (productivity, research, automation) — making this one of the few Bittensor subnets with an explicit B2C / B2B revenue surface and listed-company disclosure. Alpha emissions reward the miners and validators that keep the agent pipeline flowing.',
    'One-line diff: a public-company-run agent App Store on Bittensor, where TAO emissions subsidise the supply side and a London-listed PLC owns the demand surface. <a href="#customer" style="color: var(--accent);">See competitive landscape ↓</a>',
  ],
  cycle: {
    challenge: { actor: 'Validator', title: 'Issue brief', body: 'Validators broadcast active briefs — real-world problems submitted by buyers or curated by the team — that miners must solve with a working agent.', dataK: 'payload', dataV: 'agent brief / spec' },
    compute:   { actor: 'Miner',     title: 'Build agent', body: 'Miners (developers) build, deploy, and submit AI agents that fulfil the brief, packaged for the sundae_bar marketplace runtime.', dataK: 'latency',  dataV: 'per-agent eval' },
    score:     { actor: 'Validator', title: 'Evaluate vs brief', body: 'Validators test each submission against the brief and quality criteria, scoring relevance, reliability, and marketplace readiness; winning agents publish to the storefront.', dataK: 'scale',    dataV: 'brief × submission' },
    settle:    { actor: 'Subtensor', title: 'Yuma → emission', body: "Every validator's weights, multiplied by their stake, aggregated by Yuma into one reward vector. TAO mints to top miners.", dataK: 'tempo', dataV: '~72 min · 24×/day' },
  },
  miner: {
    does: 'Build AI agents that solve briefs submitted to the sundae_bar marketplace, package them for the runtime, and submit for evaluation.',
    input: 'Brief spec + sundae_bar agent runtime / SDK',
    output: 'Deployed agent on the marketplace candidate pool',
    hardware: 'Standard developer rig; inference can route through hosted LLMs',
    paidFor: 'Building agents that win briefs and get listed in the marketplace',
    paidVia: 'Per-tempo emission, score × validator stake',
  },
  validator: {
    does: 'Run incoming agent submissions against the brief, score quality and marketplace fit, and set on-chain weights for winners.',
    requires: 'Bittensor validator stake, sundae_bar evaluation stack, access to brief queue',
    output: 'Weight vector promoting marketplace-ready agents',
    paidFor: 'Submitting weights that agree with consensus median',
    paidVia: 'Per-tempo emission, stake × consensus alignment',
  },
  scoring: {
    leadOneLine: 'Win briefs by shipping agents that actually work in the marketplace.',
    explanation: [
      'Scoring is brief-conditional: validators measure each submitted agent against the explicit problem statement attached to the brief — does it perform the task, is it reliable, does it meet marketplace quality bars. There is no single global benchmark; the subnet rewards agents that pass the brief and get pulled into the live storefront.',
      'Because the marketplace is the demand surface, miners are implicitly competing for usage and revenue share once their agent is listed. The mechanism therefore mixes per-brief leaderboards with longer-tail signals from marketplace traction, which is unusual for Bittensor and gives the PLC parent company a clean audit trail for its public reporting.',
    ],
    cheatPath: 'The obvious attack is wrapper-spam — uploading thin LLM wrappers that nominally pass a brief but fail in real use. The marketplace traction signal and human curation step are designed to demote these, but rigorous, programmatic anti-gaming is still an open area as the subnet scales.',
  },
  customer: {
    leadOneLine: 'End users and small businesses subscribing to AI agents through the sundae_bar app and storefront.',
    explanation: [
      'The buyer surface is the public sundae_bar marketplace, where consumers and SMBs browse, try, and subscribe to AI agents built on the subnet. Briefs can also be commissioned by businesses that want a specific agent — they pay sundae_bar, the subnet sources the build, and the resulting agent goes live for everyone.',
      'Because Sundae Bar PLC is publicly listed (LSE: SBAR), it discloses subnet metrics, marketplace KPIs, and revenue alongside emission economics — a level of transparency rare in Bittensor. The thesis is that listed-company governance plus TAO-subsidised agent supply produces a more credible distribution channel than a typical Web3 marketplace.',
    ],
  },
  competitive: {
    scope: 'AI agent marketplaces · 2026',
    rows: [
      { name: 'sundae_bar', subtitle: 'SN121', isSelf: true, approach: 'Brief-driven agent economy on Bittensor; TAO emissions subsidise developers, PLC owns the marketplace.', access: 'open · marketplace + API', accessTone: 'open', differentiator: 'Only LSE-listed Bittensor subnet operator with a consumer agent storefront and disclosed marketplace KPIs.' },
      { name: 'OpenAI GPT Store', approach: 'Hosted GPTs published into a closed marketplace inside ChatGPT; revenue-share to top creators.', access: 'closed · ChatGPT only', accessTone: 'closed', differentiator: 'Massive distribution but locked to OpenAI runtime and opaque revenue mechanics.' },
      { name: 'Poe by Quora', approach: 'Multi-model bot marketplace with creator monetisation per-message.', access: 'closed · paid app', accessTone: 'closed', differentiator: 'Cross-model bots but creator economy is centrally priced and curated.' },
      { name: 'HuggingFace Spaces', approach: 'Free hosting for community-built agents and demos backed by Spaces hardware.', access: 'open · self-host', accessTone: 'open', differentiator: 'Open and developer-first but no built-in monetisation or curated buyer demand.' },
      { name: 'Bitagent (SN20)', approach: 'Bittensor subnet incentivising LLM agents that can use tools and call APIs.', access: 'open · subnet', accessTone: 'open', differentiator: 'Sibling agent subnet but research-leaning, no consumer marketplace front-end.' },
    ],
    note: 'Closed marketplaces (GPT Store, Poe) own distribution; open hubs (HuggingFace) own developer mindshare. sundae_bar bets that a regulated PLC plus TAO-subsidised supply can carve a middle lane: transparent governance for buyers, real emissions for builders, and a unified storefront that aggregates briefs into ongoing demand. The execution risk is everything that comes with running a consumer marketplace — discovery, trust, churn — alongside a subnet.',
  },
  team: {
    intro: [
      'Operator is Sundae Bar PLC, listed on London\'s AIM market under SBAR, with mandatory disclosure of subnet activity, marketplace KPIs and financials. The leadership backgrounds skew Web2 media / consumer rather than Web3 — a deliberate bet that the bottleneck for agent adoption is distribution, not protocol design.',
      'Engineering is led by a small in-house technical team with announced expansions tied to RNS filings, focused on the subnet validator stack, the agent runtime, and the consumer marketplace. The company files regular announcements via Investegate detailing subnet progress and team additions.',
    ],
    founders: [
      { initials: 'JK', gradient: 'v', name: 'Jill Kenny', role: 'CEO · co-founder', bio: 'Former Red Bull media network lead in Canada; co-founder of Paidia eSports, a women-led gaming/tech company, before founding Sundae Bar.' },
      { initials: 'JB', gradient: 'a', name: 'Jonathan Bixby', role: 'Non-Executive Chairman', bio: 'Serial London-listed tech entrepreneur and investor; founder/major investor in Argo Blockchain (ARB), Guild Esports (GILD), and Cel AI Plc.' },
      { initials: 'OC', gradient: 'g', name: 'Oliver Chesterman', role: 'Technical Lead', bio: 'Engineering lead overseeing the subnet validator stack and sundae_bar agent runtime.' },
    ],
    size: 'In-house team + growing engineering hires (RNS-disclosed)',
    founded: '2024 (subnet 121 plan released 2025·09)',
    based: 'London, UK',
    backers: 'Publicly listed on London Stock Exchange AIM (LSE: SBAR).',
    placeholder: false,
  },
  milestones: [
    { date: '2025·09', text: 'Sundae Bar PLC releases Subnet 121 plan on Bittensor (RNS announcement).' },
    { date: '2025·Q4', text: 'Subnet 121 launches; marketplace begins onboarding agents and developers.' },
    { date: '2026·Q1', text: '>1,600 developer submissions evaluated; 300+ agents and workflows live in the marketplace.' },
    { date: '2026·Q1', text: 'Company shifts to "revenue-generating AI marketplace" framing as Subnet 121 scales (corporate update).' },
  ],
  join: {
    title: 'Pick a brief and ship an agent',
    body: 'Pull live briefs from the sundae_bar marketplace, build an agent that solves the spec using the published runtime, and submit for validator evaluation. Winning agents get listed in the storefront and earn ongoing emissions plus marketplace traction.',
    asideNote: 'Setup: sundaebar.ai/news/meet-our-developers walks through onboarding · GitHub at sundae-bar/bittensor-subnet · corporate disclosures at corporate.sundaebar.ai.',
  },
  tags: ['agents', 'marketplace', 'consumer', 'plc', 'briefs'],
  external: {
    github: 'https://github.com/sundae-bar/bittensor-subnet',
    website: 'https://www.sundaebar.ai/',
    twitter: 'https://x.com/sundaebar_ai',
    taostats: 'https://taostats.io/subnets/121/',
  },
  tweets: [
    { when: '2025·09', body: '"Subnet 121 Plan Released on Bittensor Network" — Sundae Bar PLC RNS announcement, framing the subnet as an incentivised agent creation economy.' },
    { when: '2026·Q1', body: '"Sundae Bar shifts to revenue-generating AI marketplace as Subnet 121 scales" — Globe and Mail / TipRanks coverage of the corporate update.' },
  ],
};
