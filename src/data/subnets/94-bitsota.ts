import type { RichSubnet } from '../subnet-rich';
export const sn94: RichSubnet = {
  slug: '94-bitsota', netuid: 94, name: 'Bitsota',
  shortPitch: 'Decentralized research network that only pays for verified state-of-the-art ML breakthroughs.',
  overview: [
    'Bitsota (SN94) is a decentralized research network for ML algorithm evolution through competitive distributed computing. Miners around the world devote CPU/GPU power to solving open machine-learning challenges, and the protocol only pays out when a miner actually produces a better model — beating the current best published score on a hidden test set.',
    'The flow is simple in framing: researchers ("problem owners") post an AI challenge — dataset, metric, baseline — and miners compete to surpass it. If a miner\'s model beats the leaderboard, the network verifies the breakthrough on a held-out test set and pays out automatically. No participation rewards, no idle-emission farming.',
    'The subnet is operated by Alveus Labs and explicitly positions itself as an alternative to mainstream ML benchmarks: by paying only for verified leaderboard breakthroughs, the network filters out noise and incentivizes genuine algorithmic progress. Onboarding is one-click via a desktop miner to lower the barrier vs. typical command-line subnets.',
    'The space competes with Kaggle, Hugging Face leaderboards, and academic competition formats — all of which lack direct token incentives. <a href="#customer" style="color: var(--accent);">See competitive landscape ↓</a>',
  ],
  cycle: {
    challenge: { actor: 'Validator', title: 'Post challenge', body: 'Validator publishes an ML challenge: dataset, metric, current best baseline, hidden test set commitment.', dataK: 'payload', dataV: 'dataset + metric' },
    compute:   { actor: 'Miner',     title: 'Train + submit', body: 'Miner trains a model on the dataset (often using genetic-programming search) and submits weights or predictions for evaluation.', dataK: 'latency',  dataV: 'hours to days per challenge' },
    score:     { actor: 'Validator', title: 'Verify SOTA', body: 'Validators evaluate the submission on the hidden test set; only models beating the current best baseline earn weight.', dataK: 'scale',    dataV: 'leaderboard delta' },
    settle:    { actor: 'Subtensor', title: 'Yuma → emission', body: "Every validator's weights, multiplied by their stake, aggregated by Yuma into one reward vector. TAO mints to top miners.", dataK: 'tempo', dataV: '~72 min · 24×/day' },
  },
  miner:     { does: 'Trains ML models (often via genetic programming) attempting to beat the current SOTA on a posted challenge.', input: 'Dataset + metric + current baseline score', output: 'Trained model weights or predictions on hidden test set', hardware: 'CPU/GPU — challenge-dependent, but one-click desktop miner lowers entry', paidFor: 'Verified state-of-the-art improvements over current best', paidVia: 'Per-tempo emission, score × validator stake' },
  validator: { does: 'Curates challenges, evaluates miner submissions on hidden test sets, verifies SOTA gains.', requires: 'Hidden test sets + evaluation pipeline', output: 'Per-miner weights tied to leaderboard-beating submissions', paidFor: 'Submitting weights that agree with consensus median', paidVia: 'Per-tempo emission, stake × consensus alignment' },
  scoring:   {
    leadOneLine: 'Beat the leaderboard or earn nothing — no participation prizes.',
    explanation: [
      'Validators hold out a hidden test set per challenge; miners can train freely on the public dataset, but only the held-out score determines weight. Models that beat the current best baseline produce nonzero weight; those that don\'t produce zero.',
      'This is harsher than typical Bittensor scoring, where partial credit accrues with relative quality. Bitsota\'s sharper "SOTA-or-zero" rule biases the network toward submitters who can actually move the frontier, not those who can grind incremental tweaks for partial emission.',
    ],
    cheatPath: 'Overfitting to a leaked public test set — Bitsota commits hidden test sets per challenge, so leaderboard gaming on public splits doesn\'t score.',
  },
  customer:  {
    leadOneLine: 'Researchers, labs, and enterprises who want bounties paid for real ML progress.',
    explanation: [
      'Problem owners — AI labs, biotech companies, research nonprofits — post challenges with TAO-funded bounties. Their value prop vs. Kaggle is direct: real-time payout for SOTA gains, no need to manage a competition manually, and a permissionless distributed pool of solvers.',
      'For solvers (the miners), the proposition is straightforward: the best ML team on a niche challenge gets paid in TAO automatically, no consulting contract needed. The flywheel only spins if challenge supply (from external buyers) keeps up with miner supply — that\'s the open question.',
    ],
  },
  competitive: { scope: '2026 · ML algorithm competitions', rows: [
    { name: 'Bitsota', subtitle: 'SN94', isSelf: true, approach: 'On-chain SOTA-or-zero bounties, hidden test verification', access: 'open · API', accessTone: 'open', differentiator: 'Pays only for verified breakthroughs, one-click desktop miner' },
    { name: 'Kaggle', approach: 'Centralized ML competition platform', access: 'open · API', accessTone: 'open', differentiator: 'Largest community, prizes USD-denominated, slow payout' },
    { name: 'Hugging Face Leaderboards', approach: 'Open community leaderboards', access: 'open · API', accessTone: 'open', differentiator: 'No payouts, status-only — pure research signaling' },
    { name: 'CrowdAI / DrivenData', approach: 'Niche bounty-based ML competitions', access: 'open · API', accessTone: 'open', differentiator: 'Domain-focused, manual ops, slow disbursement' },
    { name: 'Numerai', approach: 'Crypto-incentivized financial-modeling tournament', access: 'open · API', accessTone: 'open', differentiator: 'Single domain (finance), encrypted features, NMR token' },
  ], note: 'Bitsota\'s thesis is automation: if a permissionless protocol can serve research bounties at machine speed and pay for verified gains, it eats the slow contractual edges of Kaggle and human-mediated competitions. The bet is on bounty supply.' },
  team: {
    intro: [
      'Bitsota is operated by Alveus Labs as a third-party subnet initiative, not the core Opentensor Foundation. The team builds the protocol, the one-click miner, and the challenge-management pipeline.',
      'Specific founder identities are not prominently disclosed in publicly available materials. Source is the AlveusLabs/SN94-BitSota GitHub organization.',
    ],
    founders: [{ initials: 'AL', gradient: 'g', name: '[Alveus Labs team]', role: 'Operators', bio: 'Team behind SN94 — building decentralized ML competition infrastructure.' }],
    size: 'Not publicly disclosed', founded: '2025', based: 'Not publicly disclosed', backers: 'Not publicly disclosed.', placeholder: true,
  },
  milestones: [
    { date: '2025', text: 'Subnet 94 registered as Bitsota by Alveus Labs.' },
    { date: '2025', text: 'One-click desktop miner published to lower the entry barrier.' },
    { date: '2026', text: 'Subnet trades publicly with $BITSOTA alpha token on dTAO markets.' },
  ],
  join: { title: 'Beat the leaderboard, earn TAO', body: 'ML researchers and competitive solvers can run the desktop miner and target active challenges. Problem owners (labs, companies) can fund bounties on hidden test sets and let the network solve.', asideNote: 'The economic flywheel needs external bounty supply — track challenge volume as the leading indicator.' },
  tags: ['ml-research', 'competitions', 'genetic-programming', 'bounties'],
  external: { github: 'https://github.com/AlveusLabs/SN94-BitSota', taostats: 'https://taostats.io/subnets/94/' },
  tweets: [],
};
