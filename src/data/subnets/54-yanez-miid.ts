import type { RichSubnet } from '../subnet-rich';

export const sn54: RichSubnet = {
  slug: '54-yanez-miid',
  netuid: 54,
  name: 'Yanez MIID',
  shortPitch: 'Synthetic adversarial identities to harden KYC, AML, and sanctions screening.',
  overview: [
    'Yanez MIID (SN54) generates inorganic — that is, artificially synthesized but realistic — identity records to stress-test the financial-crime prevention systems that banks, fintechs, and crypto venues actually run in production. Think of it as a continuously-improving adversarial test set for KYC, AML, sanctions screening, and biometric verification.',
    'The current focus is name-variation challenges: how does a sanctions list catch "Volodymyr" vs. "Vladimir" vs. transliteration drift? Miners are rewarded for generating variation patterns that exploit gaps in existing screening logic — and validators score on how often those patterns slip through reference compliance engines.',
    'The roadmap expands into deepfake-resistant biometrics, document synthesis, and multi-modal KYC adversarial attacks. The thesis is that compliance teams are losing the deepfake arms race and need a continuously-generative red team — exactly the kind of work decentralized incentive networks can sustain better than a contractor.',
    'Yanez Compliance, the operator, is a real B2B compliance company with paying clients. They\'ve committed to feed a portion of commercial revenue back into the subnet, tying miner/validator rewards to real-world enterprise usage of MIID data — a rare "subnet has a real customer pipeline" story. <a href="#customer" style="color: var(--accent);">See competitive landscape ↓</a>',
  ],
  cycle: {
    challenge: { actor: 'Validator', title: 'Issue identity task', body: 'Validators publish an adversarial identity task — e.g., "generate 20 name variants for this sanctioned individual that defeat a target screening configuration."', dataK: 'payload', dataV: 'identity attack spec' },
    compute:   { actor: 'Miner',     title: 'Generate variants', body: 'Miners run their generative models to produce candidate adversarial identities meeting the task spec.', dataK: 'latency',  dataV: 'seconds-to-minutes' },
    score:     { actor: 'Validator', title: 'Test against engines', body: 'Validators run candidates against reference compliance engines and score on bypass rate, realism, and uniqueness.', dataK: 'scale',    dataV: 'bypass-rate ranking' },
    settle:    { actor: 'Subtensor', title: 'Yuma → emission', body: "Every validator's weights, multiplied by their stake, aggregated by Yuma into one reward vector. TAO mints to top miners.", dataK: 'tempo', dataV: '~72 min · 24×/day' },
  },
  miner: {
    does: 'Generates synthetic adversarial identities (names, documents, biometric attributes) designed to expose gaps in screening systems.',
    input: 'Task spec from validators: identity type, attack surface, target evasion class.',
    output: 'Structured set of synthetic identity records ready for screening tests.',
    hardware: 'Modest GPU for generative models; primarily ML inference rather than training.',
    paidFor: 'Bypass rate against reference compliance engines + realism + uniqueness.',
    paidVia: 'Per-tempo emission, score × validator stake',
  },
  validator: {
    does: 'Issues tasks, runs candidates through reference screening engines, evaluates effectiveness and realism.',
    requires: 'Reference compliance engine access, realism graders, anti-duplication tooling.',
    output: 'Per-miner weight vector reflecting attack effectiveness.',
    paidFor: 'Submitting weights that agree with consensus median',
    paidVia: 'Per-tempo emission, stake × consensus alignment',
  },
  scoring: {
    leadOneLine: 'How often did your synthetic identity slip past a real screening engine while still looking real?',
    explanation: [
      'Each generated identity is run through reference KYC/AML/sanctions engines. A bypass — the engine fails to flag a synthetic version of a sanctioned name — counts. But validators also score realism: garbage strings that bypass naive filters don\'t generalize to real adversarial value.',
      'Uniqueness matters too. Submitting the same successful pattern hundreds of times doesn\'t scale; the system rewards miners who explore new evasion classes (transliteration, homoglyph attack, structural variation, biometric perturbation) over time.',
    ],
    cheatPath: 'Submitting random gibberish that fuzzes filters won\'t survive — realism graders catch outputs that no human would actually use, and unique-pattern scoring kills mass-produced near-duplicates.',
  },
  customer: {
    leadOneLine: 'Banks, fintechs, crypto exchanges, and AML vendors who need continuous red-teaming of their screening stack.',
    explanation: [
      'Yanez Compliance already sells into financial-crime-prevention teams; MIID data plugs into their commercial product line for ongoing validation. The B2B story is "your screening system is only as good as the adversarial pressure you put on it, and we have a global decentralized red team running 24/7."',
      'The deepfake roadmap targets the fastest-growing class of compliance failures: synthetic IDs and AI-generated biometrics that defeat 2023-era KYC. Regulators in the US, UK, and EU are explicitly pushing continuous validation, which is exactly the surface MIID lives on.',
    ],
  },
  competitive: {
    scope: '2026 · adversarial compliance & KYC red-teaming',
    rows: [
      { name: 'Yanez MIID', subtitle: 'SN54', isSelf: true, approach: 'Decentralized generation of adversarial identities; validators score on real screening-engine bypass.', access: 'open · API', accessTone: 'open', differentiator: 'Continuous, decentralized red team tied to a B2B compliance product with paying clients.' },
      { name: 'ComplyAdvantage',  approach: 'Sanctions screening and adverse-media monitoring at scale.', access: 'closed · enterprise', accessTone: 'closed', differentiator: 'The screening engine, not the red team that breaks it.' },
      { name: 'Sumsub',           approach: 'KYC/AML verification platform with managed compliance flows.', access: 'closed · enterprise', accessTone: 'closed', differentiator: 'Defender, not attacker; uses cases like MIID would be a customer.' },
      { name: 'Refinitiv World-Check', approach: 'Reference sanctions/PEP database used by global banks.', access: 'closed · enterprise', accessTone: 'closed', differentiator: 'List provider; doesn\'t test how well the list is matched.' },
      { name: 'In-house bank red teams',    approach: 'Internal compliance teams generate variant test cases manually.', access: 'closed · internal', accessTone: 'closed', differentiator: 'Doesn\'t scale, doesn\'t learn across institutions.' },
    ],
    note: 'MIID\'s wedge is being the open, continuous, learning red team for an industry whose defenders are mostly closed. Compliance vendors benefit from MIID rather than competing with it — Yanez sells the synthetic-attack dataset back to the same firms whose engines miners are bypassing.',
  },
  team: {
    intro: [
      'Yanez Compliance is led by Jose Caldera, CEO and co-founder. The team previously pioneered the first no-code KYC capability — now an industry-standard pattern — and has been in compliance tech for over a decade.',
      'The company raised a $900K oversubscribed Seed Part A specifically to operate the Bittensor subnet. Asem Othman serves as Chief AI Officer and co-founder; Mark Quesenberry leads Sales.',
    ],
    founders: [
      { initials: 'JC', gradient: 'v', name: 'Jose Caldera', role: 'CEO & Co-founder, Yanez Compliance', bio: 'Pioneered the first no-code KYC capability on the market; decade-plus in compliance tech.' },
      { initials: 'AO', gradient: 'a', name: 'Asem Othman', role: 'Co-founder & Chief AI Officer', bio: 'AI lead behind MIID\'s adversarial identity generation stack.' },
    ],
    size: '~10-15',
    founded: '2024',
    based: 'United States',
    backers: '$900K Seed Part A (oversubscribed) earmarked for SN54 operations.',
    placeholder: false,
  },
  milestones: [
    { date: '2025·Q3', text: 'Yanez MIID SN54 launches on Bittensor.' },
    { date: '2025·Q4', text: '$900K oversubscribed Seed Part A round closes.' },
    { date: '2026·Q1', text: 'Name-variation challenges live with reference compliance engines integrated.' },
  ],
  join: {
    title: 'Break the screening engine, earn the emission.',
    body: 'Miners need a generative model tuned for adversarial identity data. Validators need reference compliance engines + realism graders. Compliance teams can subscribe to the MIID data feed through Yanez.',
    asideNote: 'Yanez has committed to recycling a portion of commercial revenue back into the subnet — emissions track real demand.',
  },
  tags: ['Compliance', 'Synthetic Data', 'Adversarial', 'Identity'],
  external: {
    github: 'https://github.com/yanez-compliance/MIID-subnet',
    website: 'https://www.yanezcompliance.com/',
    twitter: 'https://x.com/yanezcompliance',
    taostats: 'https://taostats.io/subnets/54/',
  },
};
