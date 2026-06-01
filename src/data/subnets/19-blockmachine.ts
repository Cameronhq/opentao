import type { RichSubnet } from '../subnet-rich';

export const sn19: RichSubnet = {
  slug: '19-blockmachine',
  netuid: 19,
  name: 'blockmachine',
  shortPitch: 'A decentralized RPC and archive-node network on Bittensor.',
  overview: [
    'blockmachine is the subnet running a decentralized, incentivized RPC and archive-node infrastructure. Miners operate full and archive nodes for multiple blockchains, serving RPC requests issued by validators. Validators issue probe queries, measure latency and correctness, and grade miners. The customer outside Bittensor is anyone paying Alchemy, Infura, or QuickNode today.',
    'The subnet uses a standard metagraph. Each tempo the validator dispatches a battery of RPC calls — block lookups, log filters, archive queries — to active miners. Miners return the response; validators check it against a trusted ground-truth node and grade by correctness and latency. The result becomes weights → Yuma → emission.',
    'The pitch is direct: RPC infrastructure is a multi-billion-dollar oligopoly, dominated by three centralized providers. A decentralized network with incentive-aligned operators competing on latency and uptime is exactly what the original "decentralize the stack" thesis demanded. blockmachine puts the chain reads themselves on a chain.',
    'Where Alchemy, Infura, and QuickNode run centralized clusters with monthly subscriptions, blockmachine runs an open competition of node operators with TAO-denominated rewards. <a href="#customer" style="color: var(--accent);">See competitive landscape ↓</a>',
  ],
  cycle: {
    challenge: { actor: 'Validator', title: 'Dispatch RPC probes', body: 'Generate a battery of RPC calls — getBlock, getLogs, archive queries — covering recent and historical state. Send to every active miner.', dataK: 'payload', dataV: 'RPC call batch' },
    compute:   { actor: 'Miner',     title: 'Serve the queries', body: 'Each miner runs full and archive nodes for the supported chains and returns the RPC response with proof of inclusion where applicable.', dataK: 'latency',  dataV: '<200ms target' },
    score:     { actor: 'Validator', title: 'Check correctness + speed', body: 'Compare miner response to trusted ground-truth node. Correctness is binary; latency is a tiebreaker. Bad data scores zero.', dataK: 'scale', dataV: 'correctness × p95 latency' },
    settle:    { actor: 'Subtensor', title: 'Yuma → emission', body: "Every validator's weights, multiplied by their stake, aggregated by Yuma into one reward vector. TAO mints to top miners.", dataK: 'tempo', dataV: '~72 min · 24×/day' },
  },
  miner: {
    does: 'Runs full and archive nodes and serves RPC requests on demand.',
    input: 'RPC call from validator (read methods)',
    output: 'RPC response + proof-of-inclusion where applicable',
    hardware: 'Archive-grade SSD storage · 32GB+ RAM · stable bandwidth',
    paidFor: 'Correct, low-latency RPC responses across the supported chains',
    paidVia: 'Per-tempo emission, score × validator stake',
  },
  validator: {
    does: 'Issues RPC probes, validates responses against a trusted node, submits weights.',
    requires: 'Top-N stake + reference validator code + trusted node for ground truth',
    output: 'Per-UID weight vector, signed on-chain',
    paidFor: 'Submitting weights that agree with consensus median',
    paidVia: 'Per-tempo emission, stake × consensus alignment',
  },
  scoring: {
    leadOneLine: 'Serve a correct RPC response. Fast. Or you score zero.',
    explanation: [
      'The validator issues a battery of RPC calls covering recent and historical state — getBlock at heights from days ago, getLogs over thousand-block ranges, archive-state queries that require pruned data. Each miner serves the request from its own node. The validator then compares the response to its trusted ground-truth node.',
      'Correctness is the dominant term: a wrong answer scores zero regardless of speed. Among correct responses, p95 latency is the tiebreaker. Archive-only queries weigh more because few operators bother running archive nodes.',
    ],
    cheatPath: 'Returning a cached / stale block — fails the freshness check on recent-height probes. Proxying to Infura — the validator detects this via TLS fingerprint and the rate-limit pattern. Skipping archive queries — they\'re weighed heavily, so a miner that only serves recent state scores poorly overall.',
  },
  customer: {
    leadOneLine: 'The customer outside Bittensor is a dapp or analytics team paying Alchemy / Infura today.',
    explanation: [
      'RPC infrastructure is a multi-billion-dollar market. Alchemy raised at $10B, Infura is owned by ConsenSys, QuickNode is the third oligopolist. A decentralized supply side of node operators — incentivized to keep p95 latency low — solves the obvious "single point of failure" problem and the obvious "rate limits" problem.',
      'Concretely: a dapp points its RPC endpoint at the blockmachine gateway and pays per-call. The chain rewards miners for serving the calls correctly. The customer never sees Bittensor under the hood — they just see a faster, cheaper, censorship-resistant Alchemy.',
    ],
  },
  competitive: {
    scope: 'decentralized RPC · 2026',
    rows: [
      { name: 'blockmachine', subtitle: 'SN19', isSelf: true, approach: 'Incentivized tournament of RPC + archive node operators', access: 'open · API', accessTone: 'open', differentiator: 'Open node-operator market · archive-weighted scoring · TAO-denominated rewards' },
      { name: 'Alchemy', approach: 'Centralized RPC infrastructure with subscription tiers', access: 'closed · paid', accessTone: 'closed', differentiator: 'Best DX · enterprise SLA · centralized · expensive at scale' },
      { name: 'Infura', approach: 'ConsenSys-owned RPC infra, default for MetaMask', access: 'closed · paid', accessTone: 'closed', differentiator: 'Default MetaMask backend · single point of failure (saw outages)' },
      { name: 'QuickNode', approach: 'Centralized multi-chain RPC + analytics', access: 'closed · paid', accessTone: 'closed', differentiator: 'Multi-chain · enterprise focus · price-tier complexity' },
      { name: 'Pocket Network', approach: 'Decentralized RPC with token-incentivized node operators', access: 'open · token', accessTone: 'open', differentiator: 'Same thesis · POKT-denominated · separate economy' },
    ],
    note: 'Pocket Network is the obvious comparable — same thesis, different token. blockmachine\'s bet is that the Bittensor validator-driven scoring loop produces a tighter latency distribution than Pocket\'s self-reported tier model, and that TAO emission attracts more serious operators than POKT today.',
  },
  team: {
    intro: [
      'blockmachine operates the subnet, with the project website at blockmachine.io. The team has not published a detailed bio page; the surface area is the node-operator stack, the validator scoring code, and the customer-facing RPC gateway.',
      'Note: subnet 19 was previously branded "Nineteen" under Rayon Labs (vision / inference) before transitioning to the blockmachine team. The current operator is blockmachine.',
    ],
    founders: [
      { initials: 'BM', gradient: 'v', name: '[Founder 1 name]', role: 'Operator · subnet lead', bio: 'Operates the validator, node-operator onboarding, and the RPC gateway. Public information limited.' },
    ],
    size: 'Not publicly disclosed.',
    founded: 'Subnet 19 registered on Bittensor mainnet in 2024 · blockmachine team took over in 2025.',
    based: 'Not publicly disclosed.',
    backers: 'Not publicly disclosed.',
    placeholder: true,
  },
  milestones: [
    { date: '2024', text: 'Subnet 19 registered on Bittensor mainnet (originally branded Nineteen under Rayon Labs).' },
    { date: '2025', text: 'Subnet transitions to the blockmachine team focused on decentralized RPC.' },
    { date: '2026·Q1', text: 'blockmachine team begins onboarding node operators across multiple chains.' },
  ],
  join: {
    title: 'Run a node, serve RPC',
    body: 'Hardware spec (archive-grade SSD, 32GB+ RAM, low-latency bandwidth) and miner setup at blockmachine.io. Validators welcome — top-N stake plus a trusted ground-truth node.',
    asideNote: 'Validating? Top-N stake + reference validator code via the project repo.',
  },
  tags: ['infrastructure', 'rpc', 'compute', 'multi-chain'],
  external: {
    website: 'https://blockmachine.io',
    taostats: 'https://taostats.io/subnets/19/',
  },
};
