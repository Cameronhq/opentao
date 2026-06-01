import type { RichSubnet } from '../subnet-rich';

export const sn115: RichSubnet = {
  slug: '115-hashichain',
  netuid: 115,
  name: 'HashiChain',
  shortPitch: 'Layer-1 for AI agent coordination and intent settlement, on Bittensor.',
  overview: [
    'HashiChain (SN115) is a sovereign Layer-1 infrastructure for AI agent coordination and intent settlement. Where smart contracts settle deterministic transactions, HashiChain settles probabilistic agent interactions — reasoning agents with distinct intents transacting with each other in ways pure arithmetic cannot verify.',
    'The core innovation is what the team calls a Probabilistic State Machine: instead of deterministic verification of code, the system runs probabilistic verification of semantic compatibility. Miners are "Solver Nodes" running distributed AI models inside Trusted Execution Environments (TEEs), simulating potential interactions in secure sandboxes.',
    'Consensus is borrowed from Bittensor — HashiChain uses Yuma not just for emission distribution but to reach network-wide agreement on whether two agents\' intents are compatible enough to settle. The privacy-preserving execution inside TEEs means the contents of intents do not leak to the network.',
    'This puts HashiChain in a category of its own — the closest comparators are agent-economy plays (Olas, Fetch.ai, Virtuals) and TEE-based confidential compute (Phala, Oasis), but no one else combines them with Yuma consensus as the validity layer for agent intents. <a href="#customer" style="color: var(--accent);">See competitive landscape ↓</a>',
  ],
  cycle: {
    challenge: {
      actor: 'Validator',
      title: 'Issue intent simulation',
      body: 'Validator submits an intent (e.g., "agent A wants X in exchange for Y") and asks solver miners to find compatible counterparts.',
      dataK: 'payload',
      dataV: 'agent intent description',
    },
    compute: {
      actor: 'Miner',
      title: 'Simulate in TEE',
      body: 'Solver Node runs distributed AI models inside a TEE to simulate the interaction and return a candidate settlement.',
      dataK: 'latency',
      dataV: 'TEE-bound simulation',
    },
    score: {
      actor: 'Validator',
      title: 'Semantic agreement',
      body: 'Validators score solvers on the probabilistic compatibility of their proposed settlement — semantic correctness, privacy, integrity.',
      dataK: 'scale',
      dataV: 'probabilistic consensus',
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
    does: 'Operates a Solver Node — runs distributed AI models inside a TEE to simulate and propose settlements for agent intents.',
    input: 'Agent intent descriptions from validators (and eventually live agent-economy participants).',
    output: 'Candidate settlement proposals with TEE attestation that the simulation ran honestly inside the enclave.',
    hardware: 'CPU with TEE support (Intel SGX / AMD SEV / equivalent), GPU for inference, attestation infrastructure.',
    paidFor: 'Producing semantically compatible settlement proposals that match consensus across other solvers',
    paidVia: 'Per-tempo emission, score × validator stake',
  },
  validator: {
    does: 'Issues intents, audits TEE attestations from solver outputs, scores semantic compatibility, submits weights.',
    requires: 'Server, ability to verify TEE attestations, scoring infrastructure for probabilistic compatibility judgments.',
    output: 'Per-miner weight vector based on settlement quality and consensus agreement among solvers.',
    paidFor: 'Submitting weights that agree with consensus median',
    paidVia: 'Per-tempo emission, stake × consensus alignment',
  },
  scoring: {
    leadOneLine: 'Probabilistic verification of semantic compatibility, not deterministic verification of code.',
    explanation: [
      'Where a smart contract checks "did this arithmetic balance," HashiChain checks "are these two agent intents actually compatible enough to settle?" Multiple solver nodes simulate independently inside TEEs and propose settlements; validators reward solvers whose proposals agree with the broader consensus on semantic compatibility.',
      'The TEE attestation is the integrity layer — it guarantees the solver actually ran the model on the intent inside a secure enclave, not on a leaked or modified payload. The combination of confidential execution and probabilistic consensus is meant to be the missing primitive for settling agent-to-agent interactions where intents are private and outcomes are subjective.',
    ],
    cheatPath: 'Running the simulation outside the TEE (no attestation), or proposing settlements that disagree with consensus — both zero out emission.',
  },
  customer: {
    leadOneLine: 'Agent-economy builders and apps that need a settlement layer for autonomous-agent intents.',
    explanation: [
      'The thesis assumes a near-future where autonomous agents transact with each other constantly — booking, trading, negotiating, coordinating — and the current smart-contract stack cannot natively verify whether two intents are compatible. HashiChain pitches itself as the primitive that fills the gap.',
      'Direct customers are agent-economy platforms (autonomous shopping agents, agent-to-agent commerce, agent-managed treasuries) that need privacy-preserving, semantically aware settlement. This is a longer-bet customer profile than most subnets, but if the agent economy materializes, having Yuma-backed semantic settlement is a defensible position.',
    ],
  },
  competitive: {
    scope: '2026 · agent settlement layers',
    rows: [
      { name: 'HashiChain', subtitle: 'SN115', isSelf: true, approach: 'Yuma-backed probabilistic state machine with TEE-confined solver nodes', access: 'open · code', accessTone: 'open', differentiator: 'Only design fusing Yuma consensus with TEE-private agent settlement' },
      { name: 'Olas (Autonolas)', approach: 'Agent network with on-chain registration and service economics', access: 'open · contracts', accessTone: 'open', differentiator: 'No probabilistic semantic verification; deterministic services' },
      { name: 'Fetch.ai', approach: 'Agent marketplace with native chain and registry for agent services', access: 'open · chain', accessTone: 'open', differentiator: 'Mature ecosystem; no Yuma-style probabilistic settlement' },
      { name: 'Phala Network', approach: 'TEE-based confidential compute cloud with phat contracts', access: 'open · chain', accessTone: 'open', differentiator: 'Confidential compute but no semantic-compatibility consensus' },
      { name: 'Virtuals Protocol', approach: 'Tokenized agent economy with revenue sharing and asset minting', access: 'open · platform', accessTone: 'open', differentiator: 'Consumer-agent focus; no privacy-preserving settlement primitive' },
    ],
    note: 'HashiChain is a long-horizon bet — the value depends on the agent economy materializing and needing this primitive. The wedge is the specific combination of Yuma + TEE that no other player offers, which would matter most when intents become both private and subjective at the same time.',
  },
  team: {
    intro: [
      'HashiChain ships through the hashi115 GitHub organization. Public information is minimal — the repository has only a handful of commits and no published team roster as of May 2026.',
      'The team operates the Layer-1 specification, the TEE-based solver node code, and the integration with Bittensor consensus for the probabilistic state machine.',
    ],
    founders: [
      { initials: 'HC', gradient: 'a', name: '[Founder 1 name]', role: 'Operator', bio: 'Operator team behind HashiChain subnet 115; identities not publicly disclosed as of May 2026.' },
    ],
    size: 'Not publicly disclosed.',
    founded: '2025',
    based: 'Distributed',
    backers: 'Not publicly disclosed.',
    placeholder: true,
  },
  milestones: [
    { date: '2025', text: 'Subnet 115 launches; HashiChain whitepaper-style spec published.' },
    { date: '2026', text: 'TEE-based solver node implementation in progress; early validator set onboarded.' },
  ],
  join: {
    title: 'Run a TEE solver or build agents on top of HashiChain',
    body: 'If you have hardware with TEE support and can run distributed AI inside enclaves, mine SN115. If you build agent-economy products, the public solver network is the settlement layer to design against.',
    asideNote: 'Without TEE attestation, solver outputs do not score — confidential execution is the security model.',
  },
  tags: ['agents', 'settlement', 'tee', 'intent'],
  external: {
    github: 'https://github.com/hashi115/hashichain',
    taostats: 'https://taostats.io/subnets/115/',
  },
  tweets: [],
};
