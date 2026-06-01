import type { RichSubnet } from '../subnet-rich';

export const sn58: RichSubnet = {
  slug: '58-pending',
  netuid: 58,
  name: 'Handshake58',
  shortPitch: 'Micropayments + provider scoring for autonomous AI agents.',
  overview: [
    'Handshake58 (SN58) is an agent-first payments and inference marketplace. Autonomous AI agents discover providers, pay per request via the DRAIN payment-channel protocol (USDC on Polygon), and providers are scored trustlessly through Bittensor SN58 — which acts as the cryptoeconomic validation layer.',
    'The payment architecture is the headline: opening a channel costs a one-time ~$0.02 Polygon transaction; after that, settlements happen off-chain through EIP-712 signed vouchers with zero per-transaction gas. An agent making 10,000 API calls/day pays two cents plus the per-request fee — useful when the per-request fee is $0.0001.',
    'Scoring breaks down as 60% DRAIN Claims (real USDC actually claimed by providers from payment channels in a 7-day rolling window) and 40% Availability (provider responds to validator health checks with valid wallet proof). Emissions track real economic usage, not just uptime probes.',
    'The integration story is MCP-first: users install drain-mcp, set DRAIN_PRIVATE_KEY for a Polygon wallet holding USDC, and the MCP server handles provider discovery, channel management, voucher signing, and request routing automatically. <a href="#customer" style="color: var(--accent);">See competitive landscape ↓</a>',
  ],
  cycle: {
    challenge: { actor: 'Validator', title: 'Health check', body: 'Validators query providers via DRAIN with valid signed wallet proofs and measure response, latency, and protocol compliance.', dataK: 'payload', dataV: 'signed health probe' },
    compute:   { actor: 'Miner',     title: 'Serve agents', body: 'Provider nodes (miners) serve real agent requests over MCP, accept DRAIN vouchers, and claim accumulated USDC at channel-close time.', dataK: 'latency',  dataV: 'per-request, sub-second' },
    score:     { actor: 'Validator', title: '60% claims + 40% uptime', body: 'Validators score 60% on actual USDC claimed via DRAIN over a 7-day window plus 40% on health-check availability.', dataK: 'scale',    dataV: '7-day claim rolling' },
    settle:    { actor: 'Subtensor', title: 'Yuma → emission', body: "Every validator's weights, multiplied by their stake, aggregated by Yuma into one reward vector. TAO mints to top miners.", dataK: 'tempo', dataV: '~72 min · 24×/day' },
  },
  miner: {
    does: 'Operates an AI provider node that serves agent requests via MCP and settles payments through DRAIN channels.',
    input: 'Agent requests routed through the MCP / DRAIN stack; validator health checks.',
    output: 'Inference responses + on-channel voucher acceptance + claimed USDC.',
    hardware: 'Whatever the offered model class requires (LLM inference, retrieval, tool-use, etc.); Polygon wallet for claims.',
    paidFor: '60% real USDC claimed via DRAIN + 40% health-check availability.',
    paidVia: 'Per-tempo emission, score × validator stake',
  },
  validator: {
    does: 'Probes providers, validates DRAIN claim records, computes the 60/40 score, submits weights.',
    requires: 'DRAIN protocol observer, Polygon RPC, health-check harness, signed-voucher verification.',
    output: 'Per-miner weight vector reflecting paid usage + uptime.',
    paidFor: 'Submitting weights that agree with consensus median',
    paidVia: 'Per-tempo emission, stake × consensus alignment',
  },
  scoring: {
    leadOneLine: 'Real USDC claimed by your node over the last 7 days is 60% of your weight — show me the money.',
    explanation: [
      'Most subnets score on synthetic probes. SN58 scores primarily on whether real agents paid your node real USDC through DRAIN channels in the past week. That makes the incentive layer track economic demand directly — emissions go to providers actually serving paying agents, not to operators who just pass health checks.',
      'The 40% availability portion keeps providers honest about uptime during slower periods, and it keeps new entrants competitive while they build claim history.',
    ],
    cheatPath: 'Self-paying your own node to inflate claims doesn\'t survive — DRAIN claims are on-chain attributable, and any pattern of self-routed traffic shows up in the claim graph that validators inspect.',
  },
  customer: {
    leadOneLine: 'Autonomous AI agents that need to pay third-party services per-request without burning gas.',
    explanation: [
      'The target customer is any agent doing many small paid actions — search, inference, tool calls, image generation, data lookups — where Stripe-style web payments add unacceptable overhead and L1 transactions are far too expensive per call.',
      'Handshake58\'s pitch to providers is the same pitch CDNs make to publishers: plug in once, get paid by everyone using the standard. The Bittensor incentive layer compensates providers for being early adopters before agent traffic alone justifies the integration.',
    ],
  },
  competitive: {
    scope: '2026 · per-request payments for AI agents',
    rows: [
      { name: 'Handshake58', subtitle: 'SN58', isSelf: true, approach: 'MCP-first provider marketplace + DRAIN payment channels + Bittensor scoring on real USDC claims.', access: 'open · API + MCP', accessTone: 'open', differentiator: 'Score is real paid usage (60%), not just probes. Sub-cent micropayments without per-tx gas.' },
      { name: 'Stripe / classical payment rails', approach: 'Card / ACH rails wrapped in APIs for SaaS billing.', access: 'closed · KYC', accessTone: 'closed', differentiator: 'Too expensive and slow for sub-cent agent transactions.' },
      { name: 'x402 (Coinbase agent payments)',   approach: 'HTTP 402-based on-chain agent payment standard.', access: 'open · standard', accessTone: 'open', differentiator: 'Standard only; no provider marketplace or scoring layer.' },
      { name: 'Lightning Network',                approach: 'Bitcoin L2 payment channels.', access: 'open · protocol', accessTone: 'open', differentiator: 'BTC-denominated; smaller agent ecosystem.' },
      { name: 'Cloudflare AI Gateway',            approach: 'Centralized AI gateway with billing aggregation.', access: 'closed · platform', accessTone: 'closed', differentiator: 'One company, one stack, no provider marketplace incentives.' },
    ],
    note: 'Handshake58\'s wedge is bundling three things that don\'t exist together elsewhere: a real micropayment rail (DRAIN), a provider marketplace, and a cryptoeconomic scoring layer that pays providers based on actual paid usage. The bet is that agent traffic at scale will need exactly this combination.',
  },
  team: {
    intro: [
      'Handshake58 launched in February 2026 as Bittensor Subnet 58 along with the DRAIN Protocol. The team publishes under the Handshake58 GitHub org and operates handshake58.com as the public surface.',
      'Public team identity is currently light — the project communicates through technical docs, GitHub, and protocol launch materials rather than named founder profiles. Names below are placeholders pending a public bio.',
    ],
    founders: [
      { initials: 'HS', gradient: 'a', name: '[Founder 1 name]', role: 'Founder, Handshake58', bio: 'Payment protocols + agentic-AI background; led DRAIN protocol design and SN58 integration.' },
    ],
    size: '~4-8',
    founded: '2026',
    based: 'Not publicly disclosed.',
    backers: 'Not publicly disclosed.',
    placeholder: true,
  },
  milestones: [
    { date: '2026·02', text: 'Handshake58 launches as Bittensor SN58 with DRAIN payment-channel protocol.' },
    { date: '2026·Q1', text: 'MCP server + drain-mcp client released for agent integration.' },
    { date: '2026·Q1', text: 'Scoring formula formalized as 60% real USDC claims + 40% availability.' },
  ],
  join: {
    title: 'Serve agents, claim USDC, mint TAO.',
    body: 'Providers register a node, integrate DRAIN claims, and start accepting MCP-routed agent requests. Validators run a DRAIN claim observer plus health-check harness. Agent builders install drain-mcp and route through the marketplace.',
    asideNote: '60% of the score is paid usage — emission tracks economic reality, not just uptime.',
  },
  tags: ['Payments', 'Agents', 'Marketplace', 'MCP'],
  external: {
    github: 'https://github.com/Handshake58',
    website: 'https://handshake58.com/',
    taostats: 'https://taostats.io/subnets/58/',
  },
};
