import type { RichSubnet } from '../subnet-rich';

export const sn63: RichSubnet = {
  slug: '63-enigma',
  netuid: 63,
  name: 'Enigma',
  shortPitch: 'Decentralized cryptographic challenge platform racing toward Q-Day.',
  overview: [
    'Enigma (SN63) is a Bittensor subnet operated by qBittensor Labs. It runs large prize-pool challenges that pay TAO to anyone who can break a cryptographic target. The first challenges focus on what Enigma calls the most urgent problem in computing — Q-Day, the moment quantum computers can break the encryption that the modern internet runs on.',
    'The design is straightforward: validators publish a target — a key, a cipher, a hash structure — with a clearly defined break condition and a prize pool. Miners attack it with whatever they have: classical compute, quantum-inspired heuristics, novel algorithms. The first valid solution wins TAO, and the technique is published open source so the next round starts from a higher floor.',
    'qBittensor Labs frames Enigma as a public signal of cryptographic progress. Most cryptographic research happens behind academic paywalls or inside intelligence agencies; Enigma argues a transparent, prize-driven leaderboard is the only way the world will actually see Q-Day coming.',
    'The subnet sits alongside qBittensor\'s other subnet (SN48, Quantum Compute) as part of a broader "quantum-on-Bittensor" thesis. <a href="#customer" style="color: var(--accent);">See competitive landscape ↓</a>',
  ],
  cycle: {
    challenge: { actor: 'Validator', title: 'Crypto target', body: 'Validator publishes a cryptographic challenge — a key, cipher, or factoring problem — with a defined break condition and a TAO prize pool.', dataK: 'payload', dataV: 'Target + break spec' },
    compute:   { actor: 'Miner',     title: 'Attack the target', body: 'Miner attempts to break the target using any combination of classical compute, novel algorithms, or quantum-inspired methods.', dataK: 'latency',  dataV: 'open · until solved' },
    score:     { actor: 'Validator', title: 'Verify the break', body: 'Validator confirms the solution against the break condition; the first valid solver claims the prize and the technique is open-sourced.', dataK: 'scale',    dataV: 'Pass / fail + prize' },
    settle:    { actor: 'Subtensor', title: 'Yuma → emission', body: "Every validator's weights, multiplied by their stake, aggregated by Yuma into one reward vector. TAO mints to top miners.", dataK: 'tempo', dataV: '~72 min · 24×/day' },
  },
  miner: {
    does: 'Attacks cryptographic challenges using whatever combination of compute, math, and algorithms is most effective.',
    input: 'Challenge specification — target key/cipher/hash plus the break condition.',
    output: 'Valid break (e.g. recovered key, collision, factoring) with reproducible proof.',
    hardware: 'Highly variable: from large GPU/CPU clusters for brute-force to small clever boxes for algorithmic breakthroughs.',
    paidFor: 'Producing the first verifiable break of an open challenge',
    paidVia: 'Per-tempo emission, score × validator stake',
  },
  validator: {
    does: 'Publishes challenges with prize pools, verifies miner solutions cryptographically, and submits weights.',
    requires: 'Cryptographic verification tooling, a curated challenge ladder, and prize-pool management.',
    output: 'Weight vector ranking miners on solved challenges and effort on unsolved ones.',
    paidFor: 'Submitting weights that agree with consensus median',
    paidVia: 'Per-tempo emission, stake × consensus alignment',
  },
  scoring: {
    leadOneLine: 'Break the cipher, take the pot. Everyone watches the leaderboard.',
    explanation: [
      'Scoring is unambiguous: did you produce a valid break against the target spec, yes or no, with reproducible proof. Validators verify cryptographically — there is no subjective grading. Difficulty escalates challenge by challenge, and prize pools compound.',
      'Because every winning solution is open-sourced, the next round of attackers inherits the entire prior toolkit. That is what makes Enigma a "public, compounding record" of cryptographic progress rather than a one-shot bug bounty.',
    ],
    cheatPath: 'Submitting an unreproducible break or fake proof — validator verification is deterministic and public.',
  },
  customer: {
    leadOneLine: 'Anyone whose security model assumes today\'s encryption holds for another decade.',
    explanation: [
      'The immediate "customer" is the security community itself: governments, banks, infrastructure operators, and cryptographers who need to know — empirically, not theoretically — how close real attackers are to breaking RSA, ECC, or lattice-based candidates.',
      'Longer term, Enigma can be paid by enterprises and standards bodies to stress-test specific cryptographic systems before deploying them at scale. It is bug bounties for crypto primitives instead of code.',
    ],
  },
  competitive: {
    scope: '2026 · cryptanalysis & quantum readiness',
    rows: [
      { name: 'Enigma', subtitle: 'SN63', isSelf: true, approach: 'Open prize-pool challenges; first valid break wins TAO; technique open-sourced.', access: 'open · subnet', accessTone: 'open', differentiator: 'Decentralized, compounding cryptanalysis leaderboard with TAO rewards.' },
      { name: 'NIST PQC competition', approach: 'Multi-year standards process for post-quantum algorithms.', access: 'open · process', accessTone: 'open', differentiator: 'Slow, formal, oriented toward selection not active breaking.' },
      { name: 'Academic cryptanalysis', approach: 'University groups publishing attacks via conferences.', access: 'open · paper', accessTone: 'open', differentiator: 'Publication-paced; no live prize pool.' },
      { name: 'Crypto-CTFs (e.g. CryptoHack)', approach: 'Capture-the-flag style challenges for learning and reputation.', access: 'open · contest', accessTone: 'open', differentiator: 'Educational scale; prizes are small or symbolic.' },
      { name: 'Intelligence agencies', approach: 'Classified internal cryptanalysis programs.', access: 'closed · gov', accessTone: 'closed', differentiator: 'Best-resourced attackers, zero public signal of progress.' },
    ],
    note: 'Enigma\'s wager is that the world does not actually know how close it is to Q-Day, because the strongest attackers (state actors) never publish and academic crypto moves at paper-cycle pace. A live, paid leaderboard is the only way to convert progress into a public number.',
  },
  team: {
    intro: [
      'Enigma is operated by qBittensor Labs, the team behind subnet 48 (Quantum Compute). qBittensor positions itself as the quantum-computing arm of the Bittensor ecosystem and has built a reputation around running operationally serious subnets focused on hard scientific problems.',
      'The team operates publicly via @qBitTensorLabs and publishes regular updates via Medium and Bittensor livestreams. Specific individual team members are not extensively profiled in public, though the org has been linked by external researchers to the Quantum Rings ecosystem.',
    ],
    founders: [
      { initials: 'QB', gradient: 'v', name: '[qBittensor Labs founder]', role: 'Founder / Lead', bio: 'Operates qBittensor Labs, the team behind SN48 (Quantum Compute) and SN63 (Enigma). Public-facing identity is the org, not the individual.' },
    ],
    size: 'Small lab team',
    founded: '2025 (Enigma); qBittensor Labs predates Enigma with SN48.',
    based: 'Not publicly disclosed.',
    backers: 'Not publicly disclosed.',
    placeholder: true,
  },
  milestones: [
    { date: '2025·07', text: 'qBittensor Labs launches its first quantum subnet (SN48).' },
    { date: '2025', text: 'SN63 / Enigma registered as a cryptographic-challenge subnet under qBittensor Labs.' },
    { date: '2025·Q4', text: 'First Q-Day-themed challenges live with TAO prize pools.' },
  ],
  join: {
    title: 'Break it, take it, open-source it',
    body: 'If you do cryptanalysis, large-scale brute force, or algorithm research, Enigma will pay you for the first valid break. Every win becomes the new baseline.',
    asideNote: 'Cryptography / mathematics background pays off fastest.',
  },
  tags: ['cryptography', 'quantum', 'cryptanalysis', 'challenges'],
  external: {
    website: 'https://www.qbittensorlabs.com/enigma',
    twitter: 'https://x.com/qBitTensorLabs',
    taostats: 'https://taostats.io/subnets/63/',
  },
  tweets: [
    { when: '2025·Q4', body: 'When Q-Day arrives, the world probably won\'t know — unless something like Enigma exists.' },
  ],
};
