import type { RichSubnet } from '../subnet-rich';

export const sn55: RichSubnet = {
  slug: '55-niome',
  netuid: 55,
  name: 'NIOME',
  shortPitch: 'Privacy-safe synthetic genomic data for drug discovery and precision medicine.',
  overview: [
    'NIOME (SN55) generates high-fidelity synthetic human genomes — statistically indistinguishable from real DNA but with zero linkage to any real person. The goal is to break the data bottleneck in pharma and precision medicine, where access to large, diverse genomic datasets is blocked by privacy regulation, consent friction, and breach risk.',
    'Operated by GenomesDAO / Genomes.io and incubated through Yuma Group\'s accelerator, NIOME is positioned as "the 23andMe of Bittensor" — except instead of selling real customer DNA, it manufactures privacy-preserving substitutes that researchers can train models against without ever touching protected health information.',
    'The subnet runs a continuous challenge-response loop: a backend issues synthetic-genome simulation tasks; validators broadcast them; miners run generative models to produce synthetic genomes or drug-response predictions; validators score outputs against held-out benchmarks using statistical-fidelity and biological-plausibility metrics.',
    'The team has spent five years building privacy-preserving genomics infrastructure (AMD SEV-based confidential compute, on-chain consent layers) and is plugging that into Bittensor\'s incentive plane. Mainnet emissions are live and recent milestones include winning MIT\'s Entrepreneurial Development Prize and gaining MIT Sloan course access. <a href="#customer" style="color: var(--accent);">See competitive landscape ↓</a>',
  ],
  cycle: {
    challenge: { actor: 'Validator', title: 'Issue genome task', body: 'Validators broadcast a synthetic-genome or drug-response simulation task — population spec, variant distribution requirements, downstream test panel.', dataK: 'payload', dataV: 'genome simulation spec' },
    compute:   { actor: 'Miner',     title: 'Generate genomes', body: 'Miners run generative models to produce synthetic genomes or drug-response predictions matching the task constraints.', dataK: 'latency',  dataV: 'minutes per batch' },
    score:     { actor: 'Validator', title: 'Fidelity check', body: 'Validators evaluate outputs against held-out reference panels using statistical-fidelity metrics and biological-plausibility tests.', dataK: 'scale',    dataV: 'whole-genome scale' },
    settle:    { actor: 'Subtensor', title: 'Yuma → emission', body: "Every validator's weights, multiplied by their stake, aggregated by Yuma into one reward vector. TAO mints to top miners.", dataK: 'tempo', dataV: '~72 min · 24×/day' },
  },
  miner: {
    does: 'Generates synthetic genomic data and drug-response predictions matching task-specified distributions.',
    input: 'Synthetic genome / pharmacogenomic task spec from validators.',
    output: 'Synthetic genome batches or drug-response prediction sets with metadata.',
    hardware: 'GPU for generative model inference; some tasks demand larger memory for whole-genome batches.',
    paidFor: 'Statistical fidelity vs. reference panels + biological plausibility scoring.',
    paidVia: 'Per-tempo emission, score × validator stake',
  },
  validator: {
    does: 'Issues tasks, evaluates synthetic-genome outputs against held-out benchmarks, submits weights.',
    requires: 'Held-out reference genomic panels, fidelity metric tooling, biological-plausibility tests.',
    output: 'Per-miner weights based on fidelity + plausibility.',
    paidFor: 'Submitting weights that agree with consensus median',
    paidVia: 'Per-tempo emission, stake × consensus alignment',
  },
  scoring: {
    leadOneLine: 'Does your synthetic genome look real to a population geneticist and a drug-response model?',
    explanation: [
      'Validators run synthetic outputs through two filters. Statistical fidelity: variant frequencies, linkage disequilibrium patterns, ancestry-stratified distributions all need to match held-out real reference panels. Biological plausibility: the synthetic genome shouldn\'t encode impossible variant combinations or violate basic Mendelian constraints.',
      'The held-out part matters. Validators never expose the reference panels miners are scored against, so a miner can\'t simply memorize public genomic datasets. The score rewards models that learn the underlying distribution.',
    ],
    cheatPath: 'Pasting random SNP arrays from public sources won\'t survive — held-out fidelity metrics catch outputs that don\'t match the population structure of the task spec.',
  },
  customer: {
    leadOneLine: 'Pharma, biotech, and digital-health teams that can\'t access real patient DNA without compliance overhead.',
    explanation: [
      'The pharma R&D pipeline is gated by genomic data access — most projects spend more time on data-sharing agreements than on modeling. NIOME\'s value proposition is "skip the DTA, get statistically equivalent data, ship the model six months earlier."',
      'Downstream applications include drug-response prediction, polygenic risk scoring, rare-disease modeling, and clinical-trial-cohort simulation. Each of these is a real B2B contract in a $44B precision-medicine market, not a speculative DeFi use case.',
    ],
  },
  competitive: {
    scope: '2026 · synthetic genomic data for precision medicine',
    rows: [
      { name: 'NIOME', subtitle: 'SN55', isSelf: true, approach: 'Decentralized generation + fidelity scoring of synthetic genomes; emissions tied to held-out benchmarks.', access: 'open · API', accessTone: 'open', differentiator: 'Privacy-safe by construction; continuously improving via Bittensor incentives.' },
      { name: 'Replica Analytics (Aetion)', approach: 'Synthetic-data vendor for healthcare records; clinical, not genomic.', access: 'closed · enterprise', accessTone: 'closed', differentiator: 'Records, not whole genomes; closed methodology.' },
      { name: 'Syntegra / MDClone',         approach: 'Synthetic-EHR vendors for hospital research.', access: 'closed · enterprise', accessTone: 'closed', differentiator: 'EHR-only; no whole-genome synthesis.' },
      { name: 'UK Biobank / All of Us',     approach: 'Government-run real genomic biobanks under strict access controls.', access: 'closed · controlled access', accessTone: 'closed', differentiator: 'Real data, but DTA-gated and slow.' },
      { name: 'GAN-based academic genomic models', approach: 'Lab-published generative models for synthetic genomes.', access: 'open · papers', accessTone: 'open', differentiator: 'Static papers, no continuous improvement or production API.' },
    ],
    note: 'NIOME\'s wedge is putting whole-genome synthesis on a decentralized incentive loop while building on a real precision-medicine company that has spent five years on the underlying privacy infra. The big closed-data biobanks remain better in absolute terms, but they\'re slow and gated; NIOME plays for the long tail of researchers and pharma teams who can\'t wait.',
  },
  team: {
    intro: [
      'NIOME is built by Genomes.io / GenomesDAO, co-founded in 2018 by Dr. Mark Hahnel and Aldo de Pape. The team has spent five-plus years building privacy-preserving genomic infrastructure (AMD SEV confidential compute, on-chain consent, audit trails) before turning that infra into a Bittensor subnet.',
      'Yuma Group accelerated NIOME publicly in 2026; the project also won MIT\'s Entrepreneurial Development Prize in January 2026 and gained MIT Sloan course access plus mentorship. Pantera Capital and Modular Capital previously backed Genomes.io directly.',
    ],
    founders: [
      { initials: 'MH', gradient: 'v', name: 'Dr. Mark Hahnel', role: 'Co-founder, Genomes.io', bio: 'PhD genomics; long-time advocate for privacy-preserving genomic infrastructure.' },
      { initials: 'AP', gradient: 'a', name: 'Aldo de Pape', role: 'Co-founder, Genomes.io', bio: 'Co-founder of GenomesDAO; led the project\'s shift toward decentralized incentive structures.' },
    ],
    size: '~10-15',
    founded: '2018 (Genomes.io); 2026 (NIOME subnet)',
    based: 'London, United Kingdom',
    backers: 'Pantera Capital, Modular Capital, Yuma Group accelerator.',
    placeholder: false,
  },
  milestones: [
    { date: '2018', text: 'Genomes.io / GenomesDAO founded.' },
    { date: '2024', text: 'Pantera Capital and Modular Capital back Genomes.io.' },
    { date: '2026·Q1', text: 'NIOME testnet live; mainnet staking and alpha emissions activated.' },
    { date: '2026·01', text: 'NIOME wins MIT Entrepreneurial Development Prize; MIT Sloan engagement.' },
  ],
  join: {
    title: 'Generate genomes. Earn TAO.',
    body: 'Miners need a generative genomics stack (and ideally training data they own legally). Validators need held-out reference panels and fidelity-metric tooling. Pharma buyers can subscribe via the Genomes.io API.',
    asideNote: 'Held-out scoring means you can\'t game the reference panels — fidelity must be real.',
  },
  tags: ['Healthcare', 'Genomics', 'Synthetic Data', 'Privacy'],
  external: {
    github: 'https://github.com/genomesio/subnet-niome',
    website: 'https://niome.genomes.io/',
    twitter: 'https://x.com/GenomesDAO',
    taostats: 'https://taostats.io/subnets/55/',
  },
  tweets: [
    { when: '2026·Q1', body: 'Welcome Yuma\'s newest accelerated subnet: NIOME (SN55). The 23andMe of Bittensor. Synthetic genetic data to power new AI models for drug discovery and personalized medicine, without sacrificing privacy.' },
  ],
};
