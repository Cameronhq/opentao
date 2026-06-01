import type { RichSubnet } from '../subnet-rich';
export const sn90: RichSubnet = {
  slug: '90-90', netuid: 90, name: 'Brain',
  shortPitch: 'Decentralized truth oracle resolving prediction-market statements via miner consensus.',
  overview: [
    'Brain (SN90) is the DegenBrain-operated Bittensor subnet for automated verification of prediction-market statements. Validators broadcast claims like "Did event X happen by date Y?" and miners must return true/false plus evidence, becoming a programmable resolver layer that prediction-market UIs and DeFi protocols can plug into without trusting a single oracle.',
    'The subnet does not bundle a specific ML model. Miners are free to use LLM-based fact-checking, search APIs, scraped databases, or any verification pipeline they can defend against adversarial replays. The protocol scores accuracy and reliability over time, so reputation builds across thousands of resolutions rather than per-claim.',
    'The native $BRAIN token captures fees from degenpredict.com, with 30% of fees routed to buy $BRAIN for the DAO strategic reserve. This ties subnet emissions to actual product revenue, distinguishing it from purely emission-funded subnets and creating real demand for the alpha token.',
    'The verification surface is large — sports, elections, on-chain events, sponsored questions — and competitors like UMA Optimistic Oracle and centralized resolution panels remain the status quo. <a href="#customer" style="color: var(--accent);">See competitive landscape ↓</a>',
  ],
  cycle: {
    challenge: { actor: 'Validator', title: 'Broadcast claim', body: 'Validator publishes a statement to verify with deadline and evidence requirements (URLs, on-chain data, citations).', dataK: 'payload', dataV: 'statement + deadline' },
    compute:   { actor: 'Miner',     title: 'Verify + evidence', body: 'Miner returns true/false with confidence and supporting evidence using LLMs, search, or custom pipelines.', dataK: 'latency',  dataV: 'seconds to minutes' },
    score:     { actor: 'Validator', title: 'Cross-check accuracy', body: 'Validator scores answers against ground truth, optionally double-checking via other miners or panels.', dataK: 'scale',    dataV: 'accuracy + reliability' },
    settle:    { actor: 'Subtensor', title: 'Yuma → emission', body: "Every validator's weights, multiplied by their stake, aggregated by Yuma into one reward vector. TAO mints to top miners.", dataK: 'tempo', dataV: '~72 min · 24×/day' },
  },
  miner:     { does: 'Resolves prediction-market statements with evidence and confidence scores.', input: 'Statement, deadline, optional resolution sources', output: 'Boolean verdict + confidence + evidence URLs', hardware: 'Modest — CPU + API access (LLMs, search) sufficient', paidFor: 'Accuracy and reliability across many resolutions', paidVia: 'Per-tempo emission, score × validator stake' },
  validator: { does: 'Issues statements, scores miner answers, cross-validates with truth sources.', requires: 'Ground-truth feed (news, on-chain, sports APIs)', output: 'Per-miner accuracy weights', paidFor: 'Submitting weights that agree with consensus median', paidVia: 'Per-tempo emission, stake × consensus alignment' },
  scoring:   {
    leadOneLine: 'Accuracy across many statements, not just the next one.',
    explanation: [
      'Validators compare each miner verdict to a resolved ground truth — news API, on-chain event, sports feed — and assign weights based on rolling accuracy. Confidence is checked too: a miner that bets max confidence on a wrong answer is penalized harder than a hedged one.',
      'Because reputation accrues over thousands of claims, short-term gaming yields little. The expected reward equals long-run accuracy × volume of resolved statements × validator stake share, so miners optimize their pipelines (LLM choice, evidence retrieval) over months not minutes.',
    ],
    cheatPath: "Random guessing — over hundreds of statements, accuracy regresses to 50% and the miner's weight collapses to zero.",
  },
  customer:  {
    leadOneLine: 'Prediction markets and DeFi protocols that need oracle resolutions without a centralized panel.',
    explanation: [
      'DegenPredict (degenpredict.com) is the anchor consumer — its market UI routes statement resolution through SN90, with 30% of platform fees buying $BRAIN. Other prediction protocols and on-chain insurance products are obvious next adopters once latency and accuracy track UMA-style optimistic oracles.',
      'Resolution latency (seconds to minutes) and cost (sub-cent per claim at scale) become defensible vs. human panels. The threat is not other Bittensor subnets but established oracle networks that already settle hundreds of millions in TVL.',
    ],
  },
  competitive: { scope: '2026 · prediction-market resolution', rows: [
    { name: 'Brain', subtitle: 'SN90', isSelf: true, approach: 'Bittensor miner consensus + LLM verification', access: 'open · API', accessTone: 'open', differentiator: 'Native dTAO incentives, fee buy-back of $BRAIN' },
    { name: 'UMA Optimistic Oracle', approach: 'Optimistic propose-dispute with bonds', access: 'open · on-chain', accessTone: 'open', differentiator: 'Battle-tested, billions resolved, dispute escalation' },
    { name: 'Polymarket UMA panel', approach: 'UMA + human moderator for ambiguous markets', access: 'closed', accessTone: 'closed', differentiator: 'Tied to largest prediction-market consumer' },
    { name: 'Chainlink Functions', approach: 'Off-chain compute oracle nodes', access: 'open · API', accessTone: 'open', differentiator: 'Generalist oracle infra, not specialized for claims' },
    { name: 'Augur / Reality.eth', approach: 'Crowd-sourced human resolution', access: 'open · on-chain', accessTone: 'open', differentiator: 'Slow, manual, deep tail of small markets' },
  ], note: 'SN90\'s wedge is automation cost. If accuracy crosses UMA panel quality at a fraction of the per-resolution cost, it eats the long tail of prediction markets where human disputes don\'t pay.' },
  team: {
    intro: [
      'DegenBrain operates Subnet 90, building both the subnet protocol and DegenPredict (degenpredict.com), the consumer prediction-market product that consumes the subnet\'s resolutions.',
      'Team is operating under the DegenBrain / DegenPredict brand. Specific founder identities are not prominently disclosed in public materials as of mid-2026.',
    ],
    founders: [{ initials: 'DB', gradient: 'v', name: '[DegenBrain team]', role: 'Operators', bio: 'Team behind DegenPredict consumer product and SN90 protocol.' }],
    size: 'Not publicly disclosed', founded: '2025', based: 'Not publicly disclosed', backers: 'Not publicly disclosed.', placeholder: true,
  },
  milestones: [
    { date: '2025', text: 'Subnet 90 registered, branded as Brain by DegenBrain.' },
    { date: '2025', text: 'DegenPredict consumer UI launches with SN90 resolutions.' },
    { date: '2026', text: '$BRAIN fee buy-back mechanism live — 30% of degenpredict fees buy alpha token.' },
  ],
  join: { title: 'Verify the world\'s claims', body: 'Miners with strong LLM pipelines and evidence retrieval can compete on the long tail of prediction-market statements. Validators with reliable ground-truth feeds (news APIs, sports data, on-chain indexers) earn from consensus alignment.', asideNote: 'Subnet has been flagged as low-activity by some community observers in 2026; check current metagraph health before committing capital.' },
  tags: ['prediction-markets', 'oracle', 'verification', 'llm'],
  external: { github: 'https://github.com/degenpredict/bittensor-subnet-90-brain', website: 'https://subnet90.com', twitter: 'https://x.com/degenbrain', taostats: 'https://taostats.io/subnets/90/' },
  tweets: [],
};
