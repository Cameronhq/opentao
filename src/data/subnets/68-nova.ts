import type { RichSubnet } from '../subnet-rich';

export const sn68: RichSubnet = {
  slug: '68-nova',
  netuid: 68,
  name: 'NOVA',
  shortPitch: 'Decentralized AI engine for early-stage drug discovery.',
  overview: [
    'NOVA (SN68) is a Bittensor subnet built by Metanova Labs that turns early-stage drug discovery — the virtual screening step — into an open competition. Miners worldwide submit molecule candidates against protein targets, and validators rank them by binding affinity and drug-likeness. Whoever finds the best candidate per target gets paid in TAO.',
    'The chemical space being explored is genuinely large: NOVA references combinatorial reaction libraries on the order of 65 billion molecules and a conceptual screening space approaching 10^60. A single pharma company could not realistically search this exhaustively; an open subnet with hundreds of independent participants can attack many targets in parallel.',
    'Publicly reported activity has been substantial: 5.5 million molecule submissions, 8,700+ proteins explored, 16,000+ unique discovered molecules, and peak participation around 260 active miners. Metanova has also announced a joint-venture letter of intent with DiaGen AI to build a "hit picking" tool that takes NOVA outputs and feeds them into wet-lab validation.',
    'NOVA\'s pitch is explicit anti-Big-Pharma: democratize the front end of drug discovery so anyone with compute and chemistry knowledge can earn from contributing. <a href="#customer" style="color: var(--accent);">See competitive landscape ↓</a>',
  ],
  cycle: {
    challenge: { actor: 'Validator', title: 'Protein target', body: 'Validator publishes a protein target — typically a disease-relevant binding pocket — and asks miners to submit candidate molecules.', dataK: 'payload', dataV: 'Target + scoring spec' },
    compute:   { actor: 'Miner',     title: 'Generate molecules', body: 'Miner generates and screens candidate molecules using its own AI stack — generative models, docking, ADMET filters — and submits the best hits.', dataK: 'latency',  dataV: 'Per-round budget' },
    score:     { actor: 'Validator', title: 'Binding + drug-likeness', body: 'Validator evaluates submitted molecules on predicted binding affinity, drug-likeness, novelty, and synthesizability, and ranks miners accordingly.', dataK: 'scale',    dataV: 'Composite chem score' },
    settle:    { actor: 'Subtensor', title: 'Yuma → emission', body: "Every validator's weights, multiplied by their stake, aggregated by Yuma into one reward vector. TAO mints to top miners.", dataK: 'tempo', dataV: '~72 min · 24×/day' },
  },
  miner: {
    does: 'Generates and screens candidate molecules against protein targets, submitting the best hits along with structure data.',
    input: 'Protein target specification (e.g. PDB structure + binding pocket) plus scoring criteria.',
    output: 'A ranked list of candidate molecules with predicted binding scores and ADMET properties.',
    hardware: 'GPU host suited to generative chemistry models and docking; storage for compound libraries.',
    paidFor: 'Submitting molecules with strong binding, drug-likeness, and novelty per target',
    paidVia: 'Per-tempo emission, score × validator stake',
  },
  validator: {
    does: 'Publishes protein targets, evaluates miner-submitted molecules on chemistry-grounded metrics, and submits weights.',
    requires: 'Docking software, ADMET predictors, novelty checks, and target curation pipeline.',
    output: 'Weight vector ranking miners on composite hit quality per target.',
    paidFor: 'Submitting weights that agree with consensus median',
    paidVia: 'Per-tempo emission, stake × consensus alignment',
  },
  scoring: {
    leadOneLine: 'A molecule that actually binds — and is buyable, synthesizable, novel — wins.',
    explanation: [
      'Validators score candidates on a composite metric: predicted binding affinity to the target, drug-likeness (e.g. Lipinski-style filters and ADMET), novelty vs known chemistry, and synthesizability. A high-affinity but unsynthesizable molecule, or a hit that already exists in commercial catalogs, scores lower than a novel, makeable hit.',
      'Because validators use shared chemistry pipelines, miners cannot game the system by inventing scoring conventions. The competitive edge comes from better generative models, smarter filtering, and bigger compound libraries — not from gaming the rubric.',
    ],
    cheatPath: 'Resubmitting molecules from public databases — novelty checks zero them out.',
  },
  customer: {
    leadOneLine: 'Biotech and pharma teams that would otherwise pay for outsourced virtual screening.',
    explanation: [
      'The direct buyer is any team — startup biotech, academic lab, big-pharma partnership — that needs hit candidates against a target and currently pays CROs or in-house screening teams. NOVA pitches itself as faster and cheaper because the search is parallelized across many miners.',
      'Metanova has begun productizing this directly: the announced DiaGen AI joint-venture LOI is for a "hit picking" tool that converts NOVA\'s firehose of candidates into a curated shortlist ready for wet-lab validation, which is the step buyers actually want to pay for.',
    ],
  },
  competitive: {
    scope: '2026 · virtual screening & early-stage drug discovery',
    rows: [
      { name: 'NOVA', subtitle: 'SN68', isSelf: true, approach: 'Open swarm of miners screening billions of candidates against protein targets, paid in TAO for high-quality hits.', access: 'open · subnet', accessTone: 'open', differentiator: 'Massive parallel exploration of chemical space; 5.5M+ submissions logged.' },
      { name: 'Isomorphic Labs / DeepMind', approach: 'In-house AI drug discovery using AlphaFold and proprietary pipelines.', access: 'closed · in-house', accessTone: 'closed', differentiator: 'Best-in-class structure prediction; closed pipeline, closed candidates.' },
      { name: 'Schrödinger', approach: 'Commercial molecular simulation and screening software.', access: 'closed · SaaS', accessTone: 'closed', differentiator: 'Trusted by pharma; license-shaped pricing, not pay-per-hit.' },
      { name: 'Atomwise / Recursion', approach: 'AI-first biotech companies running their own pipelines.', access: 'closed · in-house', accessTone: 'closed', differentiator: 'Vertically integrated drug-discovery firms; no open marketplace.' },
      { name: 'Academic + Folding@home-style', approach: 'Volunteer or grant-funded distributed compute on biology problems.', access: 'open · volunteer', accessTone: 'open', differentiator: 'Compute-only; NOVA layers in incentives and chemistry scoring.' },
    ],
    note: 'NOVA does not have to beat Isomorphic on a flagship target. It has to be the cheapest path from "I have a target" to "here is a shortlist of buyable, novel, plausibly binding candidates" — a step every biotech needs and most cannot afford to run at scale.',
  },
  team: {
    intro: [
      'NOVA is operated by Metanova Labs, led by CEO Micaela Bazo. Bazo previously worked at Google translating ecology and climate science into design and program strategy and has been a crypto investor since 2011 — pitching NOVA as where decentralized incentives meet drug discovery.',
      'The core team also includes Pedro Penna (CSO), Amanda Casadei (CTO), and Brayden Miller on engineering. Bazo is a publicly visible operator (VivaTech speaker, interviews on Subnet Magazine and Crypto Briefing) and the team has filed METANOVA trademark documentation in the US.',
    ],
    founders: [
      { initials: 'MB', gradient: 'v', name: 'Micaela Bazo', role: 'CEO, Metanova Labs', bio: 'Ex-Google, climate / ecology program design; crypto investor since 2011. CEO of Metanova Labs and operator of NOVA (SN68).' },
      { initials: 'PP', gradient: 'a', name: 'Pedro Penna', role: 'CSO, Metanova Labs', bio: 'Chief scientific officer; leads the chemistry and target-selection side of NOVA.' },
      { initials: 'AC', gradient: 'g', name: 'Amanda Casadei', role: 'CTO, Metanova Labs', bio: 'CTO; owns the technical infrastructure behind the subnet and downstream products.' },
    ],
    size: 'Metanova Labs core team (~4-6 visible)',
    founded: '2025',
    based: 'Not publicly disclosed (Metanova Labs operates internationally).',
    backers: 'Not publicly disclosed; joint-venture LOI with DiaGen AI announced.',
  },
  milestones: [
    { date: '2025·03', text: 'NOVA launches on Bittensor as subnet 68 under Metanova Labs.' },
    { date: '2025', text: 'Crosses 5.5M molecule submissions across 8,700+ protein targets; 16,000+ unique molecules discovered.' },
    { date: '2025·Q4', text: 'DiaGen AI joint-venture LOI announced for a "hit picking" tool on top of NOVA outputs.' },
  ],
  join: {
    title: 'Mine molecules, not blocks',
    body: 'If you do generative chemistry, docking, or ADMET modeling, NOVA pays per tempo for novel, drug-like binders. Compound libraries and GPU time are the main investments.',
    asideNote: 'Computational chemistry / cheminformatics background pays off fastest.',
  },
  tags: ['biotech', 'drug-discovery', 'chemistry', 'science'],
  external: {
    website: 'https://www.metanova-labs.ai/',
    twitter: 'https://x.com/metanova_labs',
    taostats: 'https://taostats.io/subnets/68/',
  },
  tweets: [
    { when: '2025', body: 'introducing NOVA — a global, decentralized engine for drug discovery, now live on Bittensor subnet 68.' },
  ],
};
