import type { RichSubnet } from '../subnet-rich';

export const sn75: RichSubnet = {
  slug: '75-hippius',
  netuid: 75,
  name: 'Hippius',
  shortPitch: 'Decentralized S3-compatible cloud storage for Bittensor and Web2 customers.',
  overview: [
    'Hippius is Bittensor subnet 75, operated by The Nerve Lab. Genesis block went live March 19, 2025. It is the storage layer Bittensor was missing: decentralized file hosting via IPFS plus an S3-compatible object storage API, all settled on-chain so every byte stored and every payment is auditable.',
    'Architecturally, Hippius runs as its own Substrate blockchain bridged to Bittensor — it has its own ledger, consensus, and token while still participating in subnet 75 emission. Miners earn ~60% of storage fees for hosting and proving data; validators earn from the ~30% allocated to network security and consensus.',
    'The customer surface is broad: Bittensor subnets and dApps needing persistent storage, plus Web2 users priced out of (or distrustful of) Google Drive / Dropbox / AWS S3. Customers pay in TAO, Hippius alpha, or fiat via Stripe. Public traction reported includes 400+ miners and 500+ nodes across 15 countries with a Dropbox-style desktop client in production.',
    'One-line diff: an S3-compatible cloud with on-chain payment rails and a token economy, not just a research-grade decentralized file system. <a href="#customer" style="color: var(--accent);">See competitive landscape ↓</a>',
  ],
  cycle: {
    challenge: { actor: 'Validator', title: 'Storage challenge', body: 'Validator issues storage and retrieval challenges across the miner fleet — proof-of-storage checks against committed data shards.', dataK: 'payload', dataV: 'shard challenge' },
    compute:   { actor: 'Miner',     title: 'Store + serve', body: 'Miner holds the committed data shards on local storage, responds to retrieval challenges, and serves customer reads via the S3-compatible gateway.', dataK: 'latency',  dataV: 'retrieval ms' },
    score:     { actor: 'Validator', title: 'Score uptime + integrity', body: 'Validators score miners on proof-of-storage success rate, retrieval latency, durability, and bandwidth — the operational KPIs of a cloud storage SLA.', dataK: 'metric',  dataV: 'uptime × integrity' },
    settle:    { actor: 'Subtensor', title: 'Yuma → emission', body: "Every validator's weights, multiplied by their stake, aggregated by Yuma into one reward vector. TAO mints to top miners.", dataK: 'tempo', dataV: '~72 min · 24×/day' },
  },
  miner: {
    does: 'Operates a storage node — holds committed data shards, responds to validator challenges, and serves customer reads.',
    input: 'Customer uploads + validator storage challenges.',
    output: 'Durable, retrievable data shards with proof-of-storage attestations.',
    hardware: 'Storage-heavy nodes: large HDD/SSD capacity, reliable bandwidth, stable uptime. CPU/GPU not load-bearing.',
    paidFor: 'Maintaining durable, low-latency, high-uptime storage of committed customer data.',
    paidVia: 'Per-tempo emission, score × validator stake (plus ~60% share of storage fees per Hippius design)',
  },
  validator: {
    does: 'Issues storage and retrieval challenges, scores miner uptime / integrity / latency, and writes weights on-chain.',
    requires: 'Storage and bandwidth to issue challenges across the fleet plus min-stake to register as a Bittensor validator.',
    output: 'Per-miner weight vector ranking storage SLA performance.',
    paidFor: 'Submitting weights that agree with consensus median',
    paidVia: 'Per-tempo emission, stake × consensus alignment',
  },
  scoring: {
    leadOneLine: 'Uptime × proof-of-storage success × retrieval latency — the operational KPIs of a real cloud storage SLA.',
    explanation: [
      'Validators continually probe miners with retrieval challenges against data they have committed to store. A miner that fails a challenge, takes too long to respond, or loses durability is penalised; consistent fast retrieval against challenges drives weight.',
      'Because Hippius runs as its own Substrate chain bridged to Bittensor, fee flow is explicit: miners collect roughly 60% of storage fees paid by customers, validators a portion of the 30% security allocation. Emission and fees together give honest operators a stable revenue mix rather than pure speculation on alpha.',
    ],
    cheatPath: 'Classic attacks are claiming to store data without holding it (Sybil-storing the same shards across many identities), or serving cached responses while dropping cold data. The proof-of-storage challenge cadence and multi-validator consensus on uptime are the counters; the residual surface is correlated outages and validator collusion on what counts as a successful retrieval.',
  },
  customer: {
    leadOneLine: 'Anyone who wants S3-compatible cloud storage they don\'t have to trust a single hyperscaler with.',
    explanation: [
      'On the Bittensor side, Hippius is the persistent-memory layer for other subnets and dApps that need long-lived data without running their own object store. On the Web2 side, the pitch is straightforward: S3 API + Stripe billing + a Dropbox-style desktop client, with the underlying network not owned by any one provider.',
      'Pricing competes with hyperscaler S3 / Backblaze B2 / Wasabi for cold and warm storage tiers. The reported traction of 400+ miners and 500+ nodes in 15 countries suggests a real (if early) production footprint rather than testnet activity.',
    ],
  },
  competitive: {
    scope: 'decentralized cloud storage · 2026',
    rows: [
      { name: 'Hippius', subtitle: 'SN75', isSelf: true, approach: 'S3-compatible object storage on its own Substrate chain bridged to Bittensor; miners earn ~60% of fees + TAO emission.', access: 'open · S3 API + Stripe', accessTone: 'open', differentiator: 'S3 API + fiat billing + on-chain settlement bridged to Bittensor incentives.' },
      { name: 'Filecoin', approach: 'Decentralized storage market with proof-of-spacetime and storage deals settled on its own L1.', access: 'open · deal-based', accessTone: 'open', differentiator: 'Largest decentralized storage network but deal-flow UX and not S3-native.' },
      { name: 'Arweave', approach: 'Pay-once-store-forever permaweb storage with a single up-front endowment.', access: 'open · permaweb', accessTone: 'open', differentiator: 'Permanent storage primitive; not a hot-data S3 equivalent.' },
      { name: 'Storj', approach: 'Distributed S3-compatible object storage with erasure-coding across operator nodes.', access: 'open · S3 API', accessTone: 'open', differentiator: 'Most direct UX analog; centralized satellite layer coordinates the network.' },
      { name: 'AWS S3 / Backblaze B2', approach: 'Centralized hyperscaler / cloud object storage with per-GB pricing and rich SDKs.', access: 'closed · cloud provider', accessTone: 'closed', differentiator: 'Best SLAs and ecosystem but single trust anchor and provider-side data control.' },
    ],
    note: 'Hippius\' wedge is being S3-native with on-chain settlement and a Bittensor emission engine behind it. Against Filecoin / Arweave the differentiator is UX (S3 API + Stripe); against Storj the differentiator is the TAO-denominated reward layer; against hyperscalers it is the trust model.',
  },
  team: {
    intro: [
      'Hippius is built by The Nerve Lab, a team focused on decentralized infrastructure. The project was internally codenamed "The Brain" during development before the public launch in March 2025.',
      'The Nerve Lab thesis is that Bittensor cannot reach its full footprint without a credible storage primitive — and that the way to win storage is to look exactly like S3 to the developer while running on an open, token-incentivised operator fleet.',
    ],
    founders: [
      { initials: 'JS', gradient: 'v', name: 'Jonathan Sheely', role: 'CEO · The Nerve Lab / Hippius', bio: 'CEO of The Nerve Lab; leads strategy and operations for Hippius. Public face of the project across the Bittensor community.' },
      { initials: 'CH', gradient: 'a', name: 'Chris Hobel', role: 'CTO · The Nerve Lab / Hippius', bio: 'CTO and blockchain lead at The Nerve Lab; Substrate / decentralized-infrastructure background; primary architect of the Hippius chain.' },
    ],
    size: 'Not publicly disclosed.', founded: '2024 (The Nerve Lab); Hippius genesis Mar 2025', based: 'Distributed',
    backers: 'Not publicly disclosed.',
    placeholder: false,
  },
  milestones: [
    { date: '2025·03', text: 'Hippius genesis block — Subnet 75 goes live on Bittensor with its own Substrate chain.' },
    { date: '2025·Q2', text: 'S3-compatible API and Dropbox-style desktop client released.' },
    { date: '2025·Q3', text: 'Public traction reported: 400+ miners, 500+ nodes across 15 countries.' },
    { date: '2025·Q4', text: 'Stripe fiat-payment integration enables non-crypto customers to buy storage.' },
  ],
  join: {
    title: 'Store files on Hippius',
    body: 'Customers can use the S3-compatible endpoint or the desktop client at hippius.com. Miners and validators install from the Hippius repo and register on netuid 75.',
    asideNote: 'Mining is storage-heavy, not GPU-heavy. Live network state on taostats.io/subnets/75/.',
  },
  tags: ['storage', 'IPFS', 'S3-compatible', 'DePIN', 'cloud'],
  external: {
    website: 'https://community.hippius.com/',
    twitter: 'https://x.com/hippius_subnet',
    taostats: 'https://taostats.io/subnets/75/',
  },
};
