import type { RichSubnet } from '../subnet-rich';

export const sn2: RichSubnet = {
  slug: '2-dsperse',
  netuid: 2,
  name: 'DSperse',

  shortPitch: 'Decentralized zero-knowledge proving cluster that makes AI inference verifiable.',

  overview: [
    'DSperse is Bittensor Subnet 2, operated by Inference Labs out of Hamilton, Ontario. The subnet was originally branded as Omron and pivoted to its current name as the team consolidated around the DSperse framework — a model-slicing approach that splits a neural network into shards and lets a distributed cluster of miners prove each shard with zero-knowledge cryptography. It is the network\'s flagship verifiable-inference subnet.',
    'The subnet runs the standard Bittensor topology of validator and miner slots. Validators broadcast inference jobs and partitioned model circuits; miners generate zkML proofs (or, more recently, TEE-backed attestations) that a specific model produced a specific output, and post them back to validators who verify in milliseconds. Scoring rewards low proof latency, correct outputs, and successful cryptographic verification.',
    'Outside Bittensor, the buyer is any application that needs a "receipt" for an AI inference — DeFi protocols that need verifiable price oracles, regulated industries that need audit trails on AI decisions, and on-chain agents that need to prove they ran a specific model rather than a cheaper substitute. Inference Labs has shipped integrations with EigenLayer and EZKL and reports over 160 million proofs generated to date.',
    'The closest competitors are EZKL (zkML library), Modulus Labs, Giza, and Lagrange (proof networks). DSperse differs by combining model-sharding, a continuous TAO-incentivised proving cluster, and on-chain settlement — versus libraries that ship code without a network, or proof networks that do not specialise in ML circuits. <a href="#customer" style="color: var(--accent);">See competitive landscape ↓</a>',
  ],

  cycle: {
    challenge: { actor: 'Validator', title: 'Issue inference job', body: 'Validators broadcast a verifiable inference request with the target model, input data, and the model-sliced circuits each miner is responsible for proving. Requests can come from external Inference Labs API consumers or internal benchmarks.', dataK: 'payload', dataV: 'Model + input + circuit shard' },
    compute:   { actor: 'Miner',     title: 'Run + prove', body: 'Miners execute the assigned slice of the model and generate a zero-knowledge proof (or TEE attestation) that the computation matches the committed circuit. Parallel proving across the cluster compresses end-to-end latency.', dataK: 'latency',  dataV: '< 2s for sub-300M models · 160M+ proofs to date' },
    score:     { actor: 'Validator', title: 'Verify proof', body: 'Validators run the verifier circuit on every submission. A proof either verifies or it does not, so scoring is largely binary — bonus weight goes to miners with consistently lower proof generation latency across the round.', dataK: 'scale',    dataV: 'binary verify · latency tie-break' },
    settle:    { actor: 'Subtensor', title: 'Yuma → emission', body: "Every validator's weights, multiplied by their stake, aggregated by Yuma into one reward vector. TAO mints to top miners.", dataK: 'tempo', dataV: '~72 min · 24×/day' },
  },

  miner: {
    does:     'Generates zero-knowledge proofs (or TEE attestations) that a specific AI model produced a specific output, for the model shard assigned by validators.',
    input:    'A model circuit shard plus the input tensor for a specific inference request.',
    output:   'A succinct cryptographic proof bound to the model hash, input, and output.',
    hardware: 'GPU recommended for circuit proving; for TEE mode, an Intel SGX or AMD SEV machine. Proving load scales with model size and circuit complexity.',
    paidFor:  'Producing verifiable proofs that pass the validator verifier, weighted by proof latency.',
    paidVia:  'Per-tempo emission, score × validator stake',
  },
  validator: {
    does:     'Issues inference jobs, partitions models into circuit shards, verifies submitted proofs, and posts weights based on proof correctness and latency.',
    requires: 'Standard Bittensor validator stake plus CPU/GPU sufficient to run verifier circuits at network throughput.',
    output:   'A weight vector reflecting per-miner proof success and timing across the round.',
    paidFor:  'Submitting weights that agree with consensus median',
    paidVia:  'Per-tempo emission, stake × consensus alignment',
  },

  scoring: {
    leadOneLine: 'Cryptographic verification with latency tie-break — a proof either verifies or it does not.',
    explanation: [
      'DSperse uses zero-knowledge proofs as the primary scoring signal. Either the validator\'s verifier accepts the proof — confirming that the miner ran the exact committed model on the exact input and produced the claimed output — or the submission is dropped. There is no partial credit and no room for "looks plausible". Cheating is mathematically impossible without forging the proof itself.',
      'Within the set of verified proofs, validators rank miners by proof generation latency, batch throughput, and successful coverage of their assigned circuit shards. The subnet has processed over 160 million proofs and reports a 76% latency improvement over the industry zkML baseline. The model-sharding architecture means a 1B-parameter model can be proven across a cluster of miners faster than any single prover.',
    ],
    cheatPath: 'Forging a zk proof would require breaking the underlying cryptographic assumptions of the proving system — generally accepted as computationally infeasible. Miners cannot return arbitrary outputs because the proof is bound to a specific model commitment, input, and output. Miners who repeatedly time out or fail to verify drop out of the active set; running a different (cheaper) model produces a proof that fails verification.',
  },

  customer: {
    leadOneLine: 'Applications that need cryptographic receipts for AI inference — DeFi oracles, regulated AI, on-chain agents.',
    explanation: [
      'The primary external buyer is any system that needs to prove an AI output was generated by a specific model — DeFi protocols using ML-derived oracle feeds, healthcare and financial firms that need audit trails, and on-chain AI agents that need to prove model integrity to a verifying smart contract. Inference Labs sells access through a hosted API and via direct integrations.',
      'Notable integrations include EigenLayer for restaking-secured verifiable AI, EZKL for proof tooling, and earlier ports of the Omron stack to mobile zk proving. The thesis is that as AI gets baked deeper into financial infrastructure, the cost of an unverifiable inference rises sharply — a single hallucinated oracle reading can liquidate a lending market, so proofs become a non-optional production requirement, not a research curiosity.',
    ],
  },

  competitive: {
    scope: 'verifiable AI inference · 2026',
    rows: [
      { name: 'DSperse', subtitle: 'SN2', isSelf: true, approach: 'Distributed model-slicing across a TAO-incentivised proving cluster; ZK and TEE both supported.', access: 'open · API', accessTone: 'open', differentiator: 'Largest live zkML proving cluster, continuous emissions, model sharding for big models.' },
      { name: 'EZKL', subtitle: 'zkML library', approach: 'Open-source library for compiling PyTorch / ONNX models into zk circuits for any prover.', access: 'open · OSS', accessTone: 'open', differentiator: 'Tooling, not a network — partners with DSperse rather than competing on emissions.' },
      { name: 'Modulus Labs', subtitle: 'AI proving', approach: 'Hosted zkML proving for on-chain games and DeFi, focused on small inference circuits.', access: 'closed · API', accessTone: 'closed', differentiator: 'Centralised service, narrower model size ceiling, no decentralised incentive layer.' },
      { name: 'Giza', subtitle: 'verifiable ML', approach: 'Cairo-native ML proving on Starknet with managed agent infrastructure.', access: 'open · SDK', accessTone: 'open', differentiator: 'Tied to Starknet stack; not a general-purpose proving market.' },
      { name: 'Lagrange', subtitle: 'proof network', approach: 'ZK coprocessor and general-purpose proving network for any computation.', access: 'open · API', accessTone: 'open', differentiator: 'General-purpose rather than ML-specialised; no model-sharding primitive.' },
    ],
    note: 'DSperse\'s edge is operating an actual network at scale rather than shipping a library or a managed service. The model-sharding primitive is rare — most zkML stacks plateau around a few hundred million parameters, while sharded proving across hundreds of miners can reach larger circuits without melting any single prover. Versus general proof networks like Lagrange, DSperse pays an emissions stream specifically for ML circuits.',
  },

  team: {
    intro: [
      'Inference Labs is a Web3 AI infrastructure company founded in 2023 and based in Hamilton, Ontario, Canada. The team has built across the zkML stack — from circuit tooling to mobile zk proving with EZKL — and operates DSperse as the production proving cluster. Their stated thesis is that AI integrated into financial systems requires cryptographic guarantees, not vendor promises.',
      'The team has shipped a partnership with EigenLayer (restaking-secured verifiable AI), open-sourced the DSperse code in 2025, and consolidated branding from "Omron" to "DSperse" to centre the model-sharding architecture. CEO Colin Gagich has been the public face on the Bittensor Guru podcast and across Inference Labs\' developer outreach.',
    ],
    founders: [
      { initials: 'CG', gradient: 'v', name: 'Colin Gagich', role: 'CEO & Co-founder', bio: 'Co-founded Inference Labs in 2023; leads strategy and operations for the DSperse proving cluster. Public host for Subnet 2 across podcasts and developer outreach.', twitter: 'https://x.com/colinpoint' },
      { initials: 'RC', gradient: 'a', name: 'Ron Chan',     role: 'Co-founder', bio: 'Co-founded Inference Labs; oversaw product development including the open-sourcing of DSperse code and integrations with EZKL and EigenLayer.' },
    ],
    size: '~10-15',
    founded: '2023',
    based: 'Hamilton, Ontario, Canada',
    backers: 'Digital Asset Capital Management, Delphi Ventures, Mechanism Capital, plus Bittensor-native participants.',
    placeholder: false,
  },

  milestones: [
    { date: '2024·02', text: 'Subnet 2 registered as Omron — verifiable inference on Bittensor.' },
    { date: '2025·Q1', text: 'EigenLayer integration announced for restaking-secured verifiable AI.' },
    { date: '2025·Q3', text: 'DSperse code open-sourced; model-slicing architecture published.' },
    { date: '2026·02', text: 'Brand consolidation to DSperse; 160M+ proofs generated milestone.' },
  ],

  join: {
    title: 'Run a DSperse prover',
    body: 'Clone inference-labs-inc/dsperse, register a Bittensor wallet on SN2, and stand up a GPU or TEE-equipped node to start producing proofs for assigned circuit shards.',
    asideNote: 'Validators need standard SN2 stake plus enough compute to run verifier circuits at network throughput each tempo.',
  },

  tags: ['zkml', 'verifiable-inference', 'cryptography', 'infrastructure'],

  external: {
    github:   'https://github.com/inference-labs-inc/dsperse',
    website:  'https://inferencelabs.com/',
    twitter:  'https://x.com/inference_labs',
    taostats: 'https://taostats.io/subnets/2/',
  },
};
