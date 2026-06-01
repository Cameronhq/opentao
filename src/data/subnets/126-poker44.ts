import type { RichSubnet } from '../subnet-rich';

export const sn126: RichSubnet = {
  slug: '126-poker44',
  netuid: 126,
  name: 'Poker44',
  shortPitch: 'Decentralized bot detection benchmark for online poker.',
  overview: [
    'Poker44 is Bittensor Subnet 126, focused on a single, sharply-scoped problem: detecting bots in online poker with objective, reproducible evaluation. The subnet ingests live and labelled hand-history data, asks miners to score "bot risk" per hand chunk, and pays the miners whose predictions generalise best as bot behaviour evolves.',
    'The architecture splits Poker44 into two layers. Arena is the gameplay layer — live tables where humans and bots play side by side, generating labelled benchmark data. Subnet 126 is the evaluation loop — validators build labelled evaluation windows, query miners, score predictions against the ground truth, and publish weights on-chain.',
    'Outputs are open-source bot-detection models that improve continuously as the subnet ingests more dynamic gameplay. The buyer surface is operators of online poker rooms, anti-cheat vendors, and any platform that suffers from automated play (poker, but the same shape generalises to other competitive games).',
    'One-line diff: Poker44 is security infrastructure, not a poker room — the live tables exist to generate ground-truth labels, and TAO emissions pay for the bot-detection model that operators ultimately want. <a href="#customer" style="color: var(--accent);">See competitive landscape ↓</a>',
  ],
  cycle: {
    challenge: { actor: 'Validator', title: 'Build eval window', body: 'Validators construct labelled evaluation windows — hand chunks from live gameplay where the human-vs-bot labels are known — and dispatch them to miners.', dataK: 'payload', dataV: 'labelled hand chunks' },
    compute:   { actor: 'Miner',     title: 'Score bot risk', body: 'Miners run their bot-detection models over each hand chunk and return a per-chunk risk score (probability the actor was a bot).', dataK: 'latency',  dataV: 'risk score per chunk' },
    score:     { actor: 'Validator', title: 'Grade vs. labels', body: 'Validators grade predictions against the held-out labels, measure accuracy and generalisation, and weight miners by classification quality across diverse playstyles.', dataK: 'scale',    dataV: 'AUC / precision-recall' },
    settle:    { actor: 'Subtensor', title: 'Yuma → emission', body: "Every validator's weights, multiplied by their stake, aggregated by Yuma into one reward vector. TAO mints to top miners.", dataK: 'tempo', dataV: '~72 min · 24×/day' },
  },
  miner: {
    does: 'Train bot-detection models on hand-history sequences and serve per-chunk bot-risk scores to validators.',
    input: 'Labelled hand chunks from Arena and synthetic eval windows',
    output: 'Per-chunk bot-risk scores (probabilities)',
    hardware: 'Modest GPU or CPU node for sequence-model inference',
    paidFor: 'Returning bot-risk scores that match ground-truth labels across evolving playstyles',
    paidVia: 'Per-tempo emission, score × validator stake',
  },
  validator: {
    does: 'Build labelled evaluation windows from Arena and historical data, query miners, score on accuracy/generalisation, and publish weights.',
    requires: 'Bittensor validator stake, Poker44 validator stack, access to Arena gameplay data',
    output: 'Weight vector concentrating emission on best detectors',
    paidFor: 'Submitting weights that agree with consensus median',
    paidVia: 'Per-tempo emission, stake × consensus alignment',
  },
  scoring: {
    leadOneLine: 'Reward miners whose bot-risk scores match ground-truth labels — across evolving bot behaviour.',
    explanation: [
      'Each evaluation window is constructed so that the true label (human or bot) is known to the validator but hidden from the miner. Miners return per-chunk probabilities, and validators score using standard classification metrics — AUC, precision-recall, calibration — weighted to penalise miners that only catch obvious bots and miss adaptive ones.',
      'Because Arena keeps generating fresh gameplay, the evaluation distribution drifts continuously as bots evolve their strategies. Models that overfit to last month\'s bot signatures lose weight quickly; models that generalise to new playstyles climb. The whole loop is positioned as continuous-improvement infrastructure rather than a frozen benchmark.',
    ],
    cheatPath: 'Hard-coding "always bot" or "always human" loses on AUC immediately. Memorising labelled chunks fails because validators rotate fresh windows. The harder attack is fitting to a single bot vendor\'s signature and missing the rest — Poker44 mitigates this by sourcing Arena windows from diverse bot operators and human pools.',
  },
  customer: {
    leadOneLine: 'Online poker operators, anti-cheat vendors, and competitive-gaming platforms with a bot problem.',
    explanation: [
      'The primary buyer is a poker room operator: every major site loses real money and player trust to bot rings, and detection has historically been a closed in-house arms race. Poker44 offers an open, continuously-trained detection model that operators can license or integrate, with TAO emissions subsidising the underlying R&D.',
      'The same shape — labelled gameplay, sequence classification, continuous evaluation — generalises to broader anti-cheat: chess platforms, esports operators, and any environment where automated play harms the legitimate player base. Arena gives Poker44 a structural data advantage versus operators trying to build detection in-house.',
    ],
  },
  competitive: {
    scope: 'online-poker bot detection · 2026',
    rows: [
      { name: 'Poker44', subtitle: 'SN126', isSelf: true, approach: 'Open evaluation loop on Arena gameplay; miners compete on bot-risk classification accuracy.', access: 'open · subnet + Arena', accessTone: 'open', differentiator: 'Only Bittensor subnet with a dedicated live-gameplay data pipeline feeding the detection benchmark.' },
      { name: 'GameSense / iovation', approach: 'Closed enterprise anti-fraud / anti-cheat platforms used by online gambling operators.', access: 'closed · enterprise contract', accessTone: 'closed', differentiator: 'Broad fraud coverage but generic; not poker-specific and not continuously retrained on live hands.' },
      { name: 'Operator in-house detection (PokerStars, GG)', approach: 'Closed detection teams running proprietary models on internal hand histories.', access: 'closed · internal', accessTone: 'closed', differentiator: 'Deep data per-operator but isolated; bots tuned per-site, no cross-operator generalisation.' },
      { name: 'Chess.com Fair Play', approach: 'Centralised cheat-detection system using engine-correlation and behavioural signals.', access: 'closed · internal', accessTone: 'closed', differentiator: 'Adjacent domain (chess) with mature methodology; private models, no contributor incentive layer.' },
      { name: 'GamSafe / Pi-rate Bay community lists', approach: 'Community-maintained bot-account lists shared across poker forums.', access: 'open · community', accessTone: 'open', differentiator: 'Crowd-sourced and lagging; lists known bot accounts but does not score behaviour in real time.' },
    ],
    note: 'Bot detection in online poker has historically been a closed arms race between site operators and bot vendors. Poker44 reframes it: keep the data flowing through Arena, keep the model on-chain and continuously retrained, and let any operator plug in via API. The hard part is selling to an industry that has every reason to keep detection proprietary — but the same logic that broke open recommendation systems and search ranking applies here.',
  },
  team: {
    intro: [
      'Poker44 is operated by an anonymous team under the @poker44subnet brand. The team has been deliberate about positioning the project as "security infrastructure, not a poker room" — meaning the live tables exist to generate labelled data, not to compete with poker operators for player liquidity.',
      'Public footprint is the GitHub repo (Poker44/Poker44-subnet) and the X account. Founder identities are not disclosed at the time of writing; community write-ups identify the project by handle rather than name.',
    ],
    founders: [
      { initials: 'F1', gradient: 'v', name: '[Founder 1 name]', role: 'Co-founder · ML lead', bio: 'Anti-cheat / sequence-modelling engineer leading the bot-detection model architecture; identity not publicly disclosed.' },
      { initials: 'F2', gradient: 'a', name: '[Founder 2 name]', role: 'Co-founder · Poker domain', bio: 'Online-poker domain operator running the Arena gameplay layer and label pipeline.' },
    ],
    size: 'Small team (ML + poker domain)',
    founded: '2025',
    based: 'Distributed / not publicly disclosed',
    backers: 'Not publicly disclosed.',
    placeholder: true,
  },
  milestones: [
    { date: '2025', text: 'Poker44 launches as Subnet 126 with the Arena + evaluation-loop split.' },
    { date: '2025·Q4', text: 'Subnet stabilises with continuous Arena gameplay feeding labelled evaluation windows.' },
    { date: '2026', text: 'Open-source bot-detection models published and refined against drifting bot strategies.' },
  ],
  join: {
    title: 'Catch the bots',
    body: 'Train sequence models on hand chunks, register a miner against Poker44, and serve per-chunk bot-risk scores to validators. Better generalisation across evolving bot strategies earns higher weights and more emission.',
    asideNote: 'Setup: github.com/Poker44/Poker44-subnet · @poker44subnet on X for updates.',
  },
  tags: ['anti-cheat', 'poker', 'classification', 'sequence-models', 'security'],
  external: {
    github: 'https://github.com/Poker44/Poker44-subnet',
    twitter: 'https://x.com/poker44subnet',
    taostats: 'https://taostats.io/subnets/126/',
  },
  tweets: [
    { when: '2025', body: 'Poker44 framed as "security infrastructure, not a poker room" — the live tables exist to generate labelled data for the detection model.' },
  ],
};
