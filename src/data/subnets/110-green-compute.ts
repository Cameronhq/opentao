import type { RichSubnet } from '../subnet-rich';

export const sn110: RichSubnet = {
  slug: '110-green-compute',
  netuid: 110,
  name: 'Green Compute',
  shortPitch: 'Decentralized GPU inference, only verifiably green compute gets paid.',
  overview: [
    'Green Compute is an inference marketplace on Bittensor where miners supply GPU cycles backed by verified clean energy — biogas, solar, hydro, wind, geothermal. The pitch is simple: only verifiably green compute earns TAO. Renters pay for OpenAI-compatible inference on consumer-class hardware (RTX 4090s and 5090s) at biogas-floor pricing.',
    'The first wave of miners are UK farms running 4090s and 5090s on on-farm biogas — capturing methane that would otherwise vent, then turning it into AI inference. The subnet wraps that hardware in an OpenAI-compatible API and one-click deploys for Llama, Qwen, Mistral, FLUX. Renters tap into it without touching TAO; the protocol converts fiat to TAO under the hood for alpha buybacks.',
    'Validators continuously benchmark miners on latency, throughput, model coverage, and an energy-source attestation — clean-source proof is part of the scoring surface, not just a marketing claim. Miners who fake their energy origin or lag on response time lose weight quickly. The result is a clean-power inference cloud that competes on price with hyperscalers because biogas is effectively free fuel.',
    'Green Compute sits in the consumer-GPU inference lane alongside Chutes (SN64), Lium (SN51), and Targon (SN4) — the differentiator is the sustainability angle and ESG-acceptable enterprise procurement. <a href="#customer" style="color: var(--accent);">See competitive landscape ↓</a>',
  ],
  cycle: {
    challenge: {
      actor: 'Validator',
      title: 'Send inference probe',
      body: 'Validator dispatches OpenAI-compatible chat or image-gen calls to each miner endpoint, with energy-attestation pings interleaved.',
      dataK: 'payload',
      dataV: 'chat completion + energy proof',
    },
    compute: {
      actor: 'Miner',
      title: 'Serve on green GPU',
      body: 'Miner runs the request on a 4090/5090 powered by biogas, solar, hydro, wind, or geothermal — returns tokens with provenance.',
      dataK: 'latency',
      dataV: '<2s first token target',
    },
    score: {
      actor: 'Validator',
      title: 'Verify + weight',
      body: 'Validator grades latency, throughput, output quality, uptime, and the clean-source attestation; aggregates into a weight vector.',
      dataK: 'scale',
      dataV: 'multi-axis green-weighted',
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
    does: 'Runs a 4090/5090 on verifiably renewable power and serves OpenAI-compatible inference for chat, code, and image models.',
    input: 'Inference requests from validators and end-user renters, plus periodic energy-attestation probes.',
    output: 'Token stream, image bytes, or structured completions, with signed energy-source proof attached.',
    hardware: 'RTX 4090 or 5090 GPUs, on-site renewable power (biogas / solar / hydro / wind / geothermal), reliable network.',
    paidFor: 'Latency, throughput, model coverage, uptime, and verified clean-power source',
    paidVia: 'Per-tempo emission, score × validator stake',
  },
  validator: {
    does: 'Probes miners with inference requests, audits energy-source claims, and submits a weight vector ranking the network.',
    requires: 'Beefy CPU box, fat pipe, ability to run continuous benchmarks and attestation checks against many miner endpoints.',
    output: 'Per-miner score vector covering latency, throughput, quality, uptime, and clean-source verification.',
    paidFor: 'Submitting weights that agree with consensus median',
    paidVia: 'Per-tempo emission, stake × consensus alignment',
  },
  scoring: {
    leadOneLine: 'Speed plus quality plus a clean-power receipt — fake any of the three and emission goes to zero.',
    explanation: [
      'Validators issue real OpenAI-compatible requests on a rolling cadence and grade every response on first-token latency, total throughput, and output correctness against reference completions. A miner serving a 4090 in a hyperscaler datacenter on grey grid power can still ace latency and quality — but it will fail the energy-source attestation, which is a multiplicative gate, not a bonus.',
      'Energy proofs combine on-site meter readings, utility certificates, and physical-location attestations from independent auditors visiting the farms. Repeated mismatches between claimed and observed power source drop the miner toward zero weight. The end-buyer sees a marketplace where every paid GPU-hour is provably clean — which is the entire commercial wedge.',
    ],
    cheatPath: "Plugging a 4090 into the grid and lying about biogas — the audit trail catches you and emission drops to zero.",
  },
  customer: {
    leadOneLine: 'ESG-mandated enterprises and inference-heavy AI shops that need clean-compute receipts on every token.',
    explanation: [
      'Primary buyers: regulated enterprises (banks, public-sector, EU companies under CSRD) that need to procure AI inference with an auditable sustainability story. Today they either pay a premium to hyperscaler "green" SKUs or build awkward offset spreadsheets — Green Compute hands them a per-call provenance receipt instead.',
      'Secondary buyers: indie AI shops, agent-stack builders, and image-gen apps who want OpenAI-compatible inference at biogas-floor pricing without operating a fleet. The OpenAI-compatible API means a one-line base-URL swap from existing OpenAI clients, lowering integration cost to near zero.',
    ],
  },
  competitive: {
    scope: '2026 · GPU inference · clean-power lane',
    rows: [
      { name: 'Green Compute', subtitle: 'SN110', isSelf: true, approach: 'Consumer-GPU inference (4090/5090) on verified renewable power with on-site audits', access: 'open · API', accessTone: 'open', differentiator: 'Only subnet with energy-source attestation as a scoring gate' },
      { name: 'Chutes', subtitle: 'SN64', approach: 'Permissionless serverless GPU inference with the widest model catalog on Bittensor', access: 'open · API', accessTone: 'open', differentiator: 'Largest live inference marketplace; no energy provenance' },
      { name: 'Lium', subtitle: 'SN51', approach: 'GPU machine rental marketplace from Datura, including on-demand H100s and consumer cards', access: 'open · API', accessTone: 'open', differentiator: 'Rents whole machines vs per-token inference; broader hardware' },
      { name: 'Targon', subtitle: 'SN4', approach: 'High-throughput LLM inference with verified deterministic outputs', access: 'open · API', accessTone: 'open', differentiator: 'Determinism-focused; no green-energy angle' },
      { name: 'Aethir / hyperscaler "green" SKUs', approach: 'Centralized GPU clouds with marketed-green tiers and carbon offsets', access: 'closed · enterprise', accessTone: 'closed', differentiator: 'No per-call provenance; offsets, not attestation' },
    ],
    note: 'Inside Bittensor, Green Compute is the only subnet treating clean-power as a first-class scoring axis, not metadata. Against centralized clouds, the wedge is auditable per-token receipts at a price that matches the cheapest grey-power 4090 SKUs.',
  },
  team: {
    intro: [
      'Green Compute operates the marketplace and onboards renewable-energy GPU farms (currently UK biogas-powered sites) onto the subnet. The team publishes minimal personal information on the public site — the brand and product surface ship under the "Green Compute" identity.',
      'The operator handles validator software, the OpenAI-compatible front door, fiat-to-TAO conversion for enterprise contracts, and the on-site energy attestation pipeline that underwrites the subnet\'s pricing story.',
    ],
    founders: [
      { initials: 'GC', gradient: 'g', name: '[Founder 1 name]', role: 'Operator', bio: 'Operator team behind Green Compute; identities not publicly disclosed on the marketing site as of May 2026.' },
    ],
    size: 'Not publicly disclosed.',
    founded: '2026 · testnet Feb 2026, mainnet Apr 2026',
    based: 'UK-anchored (first miners are UK biogas farms)',
    backers: 'Not publicly disclosed.',
    placeholder: true,
  },
  milestones: [
    { date: '2026·02', text: 'Testnet launch with first biogas-verified UK miners onboarded.' },
    { date: '2026·04', text: 'Mainnet production launch on Subnet 110, OpenAI-compatible API live.' },
    { date: '2026·05', text: 'Roadmap targets enterprise fiat-pay pipeline and TAO buyback flow.' },
  ],
  join: {
    title: 'Plug in a clean-power 4090 or rent green inference',
    body: 'If you operate a biogas, solar, hydro, wind, or geothermal site with consumer GPUs and pass the energy-attestation audit, you can mine SN110. If you just want cheap inference with a clean-power receipt, point your OpenAI client at the Green Compute base URL.',
    asideNote: 'Energy attestation is a hard gate, not a bonus — miners on grey power will not earn meaningful emission.',
  },
  tags: ['compute', 'inference', 'sustainability', 'gpu'],
  external: {
    website: 'https://www.green-compute.com/',
    taostats: 'https://taostats.io/subnets/110/',
  },
  tweets: [],
};
