import type { RichSubnet } from '../subnet-rich';

export const sn114: RichSubnet = {
  slug: '114-soma',
  netuid: 114,
  name: 'SOMA',
  shortPitch: 'MCP servers on Bittensor — a bridge for AI models to external tools.',
  overview: [
    'SOMA (SN114) is a "Bridge for Intelligence" — it brings Model Context Protocol (MCP) servers into Bittensor, letting AI models securely interact with external tools, data sources, and execution environments. Anthropic\'s MCP is the standard interface; SOMA turns the hosting-and-serving layer into an incentivized, competitive market.',
    'Miners run MCP servers — file systems, databases, web APIs, code execution sandboxes — exposed to AI agents through the protocol. Validators continuously probe miners for availability, latency, response quality, and protocol-correctness, scoring them on the same axes any production MCP host would care about. The best-performing servers earn TAO.',
    'The thesis: every serious agent stack will plug into many MCP servers, and the bottleneck is going to be reliable, low-latency hosting. SOMA proposes a decentralized cloud of MCP endpoints where pricing and quality are settled by an open market rather than a per-vendor contract.',
    'Inside Bittensor, this sits next to Chutes (general inference) and the agent-stack subnets. Outside Bittensor, the competition is Anthropic\'s own MCP hosting examples, Cloudflare\'s MCP server runtime, and bespoke per-tool hosting. <a href="#customer" style="color: var(--accent);">See competitive landscape ↓</a>',
  ],
  cycle: {
    challenge: {
      actor: 'Validator',
      title: 'Send MCP request',
      body: 'Validator issues realistic MCP tool calls — read a file, query a DB, run a function — against each miner\'s registered MCP server.',
      dataK: 'payload',
      dataV: 'MCP tool invocation',
    },
    compute: {
      actor: 'Miner',
      title: 'Serve MCP tool',
      body: 'Miner\'s MCP server executes the requested tool, returns the structured result, and emits any usage metadata.',
      dataK: 'latency',
      dataV: 'low-latency per tool',
    },
    score: {
      actor: 'Validator',
      title: 'Availability + quality',
      body: 'Validator grades miners on uptime, response latency, output quality, and protocol-correctness across diverse MCP calls.',
      dataK: 'scale',
      dataV: 'uptime × latency × quality',
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
    does: 'Operates one or more MCP servers — tools, data sources, execution sandboxes — exposed to AI agents via the protocol.',
    input: 'MCP tool invocation requests from validators and live consumers (agents, apps using MCP).',
    output: 'Structured MCP responses — tool results, data payloads, execution outputs — conforming to the protocol spec.',
    hardware: 'Reliable server, depends on which MCP server type; sandboxed exec needs more compute; data tools need persistent storage.',
    paidFor: 'Uptime, latency, response quality, and MCP protocol-correctness across diverse tool calls',
    paidVia: 'Per-tempo emission, score × validator stake',
  },
  validator: {
    does: 'Probes registered MCP servers with realistic tool calls, scores response quality and availability, sets weights.',
    requires: 'Server with MCP client tooling, reference test suites for diverse tool types, ability to grade response quality.',
    output: 'Per-miner weight vector covering uptime, latency, output quality, and protocol compliance.',
    paidFor: 'Submitting weights that agree with consensus median',
    paidVia: 'Per-tempo emission, stake × consensus alignment',
  },
  scoring: {
    leadOneLine: 'Run an MCP server that answers correctly, fast, and never goes down — three axes, all multiplicative.',
    explanation: [
      'Validators issue tool calls modeled after real agent workloads — file reads, DB queries, code execution requests, web fetches. Each response is graded on latency, correctness against expected output, and protocol-correctness (well-formed MCP message structure). Uptime is sampled continuously, not just at challenge time.',
      'Because the MCP standard is well-defined, scoring can be largely deterministic — the validator knows what a correct response looks like. The harder axis is quality on open-ended tool outputs (e.g., code execution): SOMA inherits Dendrite\'s broader Bittensor mining and validation infrastructure to handle those nuanced cases.',
    ],
    cheatPath: 'Returning stubbed or stale MCP responses — the validator\'s reference test suite catches mismatches and zeroes weight.',
  },
  customer: {
    leadOneLine: 'Agent stack builders, AI app developers, and enterprises wiring tools into LLMs through MCP.',
    explanation: [
      'MCP is becoming the default protocol for plugging tools into LLMs — Anthropic released it, OpenAI adopted it, and most agent frameworks now speak it. Every agent application needs reliable MCP servers behind the scenes: file systems, databases, code execution, web search, vertical APIs.',
      'SOMA\'s customer is the AI engineer or platform team that wants to consume MCP without operating a fleet of servers. They get a decentralized cloud where the network competes on uptime and latency, instead of locking into one MCP host\'s pricing and SLA. For Dendrite-aligned product teams, SOMA is also the connective tissue between specialized Bittensor subnets.',
    ],
  },
  competitive: {
    scope: '2026 · MCP hosting',
    rows: [
      { name: 'SOMA', subtitle: 'SN114', isSelf: true, approach: 'Decentralized MCP server marketplace with incentive-driven uptime and latency', access: 'open · API', accessTone: 'open', differentiator: 'Only TAO-incentivized MCP hosting layer; Dendrite-operated' },
      { name: 'Chutes', subtitle: 'SN64', approach: 'General serverless GPU + workload runtime on Bittensor; can host MCP servers too', access: 'open · API', accessTone: 'open', differentiator: 'Broader workload scope; not MCP-specialized' },
      { name: 'Cloudflare MCP Runtime', approach: 'Edge-deployed MCP server runtime via Workers and Durable Objects', access: 'closed · cloud', accessTone: 'closed', differentiator: 'Centralized; pay-per-use Cloudflare pricing' },
      { name: 'Anthropic MCP examples', approach: 'Reference servers from Anthropic; self-host or run locally', access: 'open · code', accessTone: 'open', differentiator: 'You operate the server; no hosting marketplace' },
      { name: 'Smithery / mcp.run', approach: 'Centralized MCP server registries and managed hosting', access: 'closed · SaaS', accessTone: 'closed', differentiator: 'Vendor-managed; no incentive layer for quality' },
    ],
    note: 'SOMA\'s wedge is being the only incentivized MCP hosting marketplace — competition over uptime/latency is built into the consensus instead of an SLA contract. As MCP becomes the default tool-use protocol, having a decentralized cloud of MCP endpoints maps cleanly onto Bittensor\'s incentive model.',
  },
  team: {
    intro: [
      'SOMA is built and operated by Dendrite — a technology company founded in 2022 that entered the Bittensor ecosystem early and has grown into a major infrastructure operator. Dendrite describes itself as a team of 50+ engineers and mathematicians operating across mining infrastructure, proprietary subnets, and end-user products.',
      'For SN114, Dendrite handles the subnet code, the MCP-server reference implementations, validator scoring, and the commercial layer connecting agent stacks to the network.',
    ],
    founders: [
      { initials: 'DH', gradient: 'v', name: 'Dendrite', role: 'Subnet operator', bio: 'Tech company founded 2022, operates SN114 plus other Bittensor infrastructure. Individual founder names not centrally published.' },
    ],
    size: '50+ engineers and mathematicians (Dendrite team).',
    founded: '2022 (Dendrite); SN114 launched in 2025',
    based: 'Distributed',
    backers: 'Not publicly disclosed.',
    placeholder: true,
  },
  milestones: [
    { date: '2022', text: 'Dendrite founded; enters Bittensor ecosystem early.' },
    { date: '2025', text: 'SOMA launches as subnet 114, bringing MCP servers into Bittensor.' },
    { date: '2026', text: 'MCP adoption accelerates across agent frameworks; SOMA expands tool-type coverage.' },
  ],
  join: {
    title: 'Host MCP tools or wire SOMA into your agent stack',
    body: 'If you can operate a reliable MCP server — files, DB, code exec, vertical APIs — register a hotkey and serve into the network. If you build agents, point your MCP client at SOMA\'s endpoints instead of self-hosting.',
    asideNote: 'Protocol correctness is checked against a reference suite; non-compliant servers do not score.',
  },
  tags: ['mcp', 'tools', 'agents', 'infrastructure'],
  external: {
    github: 'https://github.com/DendriteHQ/SOMA',
    website: 'https://thesoma.ai',
    taostats: 'https://taostats.io/subnets/114/',
  },
  tweets: [],
};
