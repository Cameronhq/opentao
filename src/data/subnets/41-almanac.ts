import type { RichSubnet } from '../subnet-rich';

export const sn41: RichSubnet = {
  slug: '41-almanac',
  netuid: 41,
  name: 'Sportstensor (Almanac)',
  shortPitch: 'Decentralized sports prediction market intelligence feeding Polymarket.',
  overview: [
    'Subnet 41 is operated by Sportstensor, with Almanac as the consumer-facing product layer. The network is a decentralized AI prediction engine for sports markets: miners build models that forecast probabilities for upcoming games, validators grade those models against real outcomes, and the highest-skill miners earn TAO emission.',
    'Validators continuously query active prediction markets — most prominently Polymarket — for the live state of each game and resolve scores as soon as outcomes settle. Yuma aggregates validator weights every tempo, so emission flows to miners whose forecasts are most accurate against ground-truth results, not just against the consensus.',
    'The customer is two-sided: prediction-market traders who want a real edge against Polymarket\'s vig, and Almanac itself, which packages the subnet\'s probability signal into a trader-friendly app. Sportstensor has also partnered with esports data provider GRID to extend coverage beyond traditional sports.',
    'Differentiator: a continuously-graded prediction model marketplace whose ground truth is real money on real markets. <a href="#customer" style="color: var(--accent);">See competitive landscape ↓</a>',
  ],
  cycle: {
    challenge: { actor: 'Validator', title: 'Issue match', body: 'Validators broadcast upcoming games and the markets they map to (e.g., Polymarket question id).', dataK: 'payload', dataV: 'match + market' },
    compute:   { actor: 'Miner',     title: 'Predict', body: 'Miners run their model and submit a probability distribution over outcomes before the match starts.', dataK: 'latency',  dataV: 'pre-kickoff' },
    score:     { actor: 'Validator', title: 'Grade vs outcome', body: 'After the game settles, validators score predictions against true outcomes using a proper scoring rule.', dataK: 'scale',    dataV: 'log/Brier loss' },
    settle:    { actor: 'Subtensor', title: 'Yuma → emission', body: "Every validator's weights, multiplied by their stake, aggregated by Yuma into one reward vector. TAO mints to top miners.", dataK: 'tempo', dataV: '~72 min · 24×/day' },
  },
  miner:     { does: 'Predicts probabilities for upcoming sports and esports outcomes.', input: 'Match metadata, market mapping, validator query window.', output: 'Calibrated probability distribution over outcomes.', hardware: 'GPU for serious model training; CPU OK for ensemble or stats-only miners.', paidFor: 'Calibrated, reproducible predictions that beat baselines.', paidVia: 'Per-tempo emission, score × validator stake' },
  validator: { does: 'Issues match queries, ingests real outcomes, scores miner predictions.', requires: 'Live sports data feed + Polymarket / GRID integrations.', output: 'Per-miner weight vector based on proper scoring rule.', paidFor: 'Submitting weights that agree with consensus median', paidVia: 'Per-tempo emission, stake × consensus alignment' },
  scoring:   { leadOneLine: 'Score = proper scoring rule (Brier/log loss) over realized outcomes.', explanation: [
    'Validators take each miner\'s probability distribution and apply a strictly proper scoring rule once the true outcome is known. Calibration matters: stating 90% for events that occur 60% of the time is punished even if the favorite wins.',
    'Because the ground truth comes from actual completed matches and live markets, miners cannot win by mimicking each other — they have to actually predict the world. The subnet plus Almanac frontend close the loop into Polymarket flow.',
  ], cheatPath: 'Copying public closing odds, stuffing extreme probabilities, or stalling submissions — all degrade calibrated score and lose to skill.' },
  customer:  { leadOneLine: 'Prediction-market traders, sports analytics buyers, and Sportstensor\'s own Almanac frontend.', explanation: [
    'Polymarket and similar markets are large but inefficient — informed flow earns the spread. Sportstensor sells subnet-aggregated probability signals to anyone who wants that edge without training their own model, and powers Almanac, the team\'s own consumer trading app.',
    'Beyond markets, sportsbooks, fantasy products, and esports analytics all need calibrated probability feeds; the GRID partnership specifically extends coverage into esports data where edges remain wider than traditional sports.',
  ] },
  competitive: { scope: '2026 · sports prediction', rows: [
    { name: 'Sportstensor / Almanac', subtitle: 'SN41', isSelf: true, approach: 'Open model marketplace graded against live market outcomes.', access: 'open · API + app', accessTone: 'open', differentiator: 'Decentralized model competition; ground truth from real markets.' },
    { name: 'Polymarket / Kalshi', approach: 'Prediction markets themselves.', access: 'open · web', accessTone: 'open', differentiator: 'Venue, not signal — they price what bettors think, not what models predict.' },
    { name: 'Opta / Stats Perform', approach: 'Centralized sports data and modeling enterprise.', access: 'closed · enterprise', accessTone: 'closed', differentiator: 'Deep historical data, but expensive and not retail-accessible.' },
    { name: 'Bettensor (SN30)', approach: 'Bittensor sports prediction subnet (different design).', access: 'open', accessTone: 'open', differentiator: 'Same domain, different incentive structure; direct neighbor.' },
    { name: 'Independent quant bettors', approach: 'In-house models against sportsbooks.', access: 'closed · private', accessTone: 'closed', differentiator: 'Strong models but no shared infra — every team builds from scratch.' },
  ], note: 'The thesis is that decentralized model competition beats any single in-house quant desk when the ground truth is public — and the Almanac frontend monetizes the resulting probability stream into Polymarket flow.' },
  team: { intro: [
    'Sportstensor was founded by Leo Lucian and includes Stephen ("Neuromancer"). The team operates both the subnet incentive layer and the Almanac consumer product, plus partnerships such as GRID for esports data.',
    'They publicly publish AMAs and roadmap updates, and have raised the subnet\'s profile via Polymarket integration and weekly rewards pools advertised at up to ~$100k.',
  ], founders: [
    { initials: 'LL', gradient: 'v', name: 'Leo Lucian', role: 'Founder', bio: 'Founder of Sportstensor; leads the subnet and the Almanac product layer.' },
    { initials: 'SN', gradient: 'a', name: 'Stephen ("Neuromancer")', role: 'Core team', bio: 'Core team member at Sportstensor; works on the model and validator stack.' },
  ], size: 'Small core team', founded: '2024', based: 'Not publicly disclosed.', backers: 'Not publicly disclosed.', placeholder: false },
  milestones: [
    { date: '2024', text: 'Sportstensor launches on Subnet 41 with sports prediction model marketplace.' },
    { date: '2025', text: 'Almanac consumer app launched; Polymarket integration goes live.' },
    { date: '2026', text: 'GRID esports data partnership announced via subnet AMA.' },
  ],
  join: { title: 'Predict the market', body: 'Run a miner if you have a sports or esports model that calibrates well against real markets. Validators need live data feeds and Polymarket integration.', asideNote: 'Almanac\'s frontend is the easiest way to evaluate the signal as a trader.' },
  tags: ['sports', 'prediction-markets', 'esports', 'polymarket'],
  external: { website: 'https://sportstensor.com/', twitter: 'https://x.com/sportstensor', taostats: 'https://taostats.io/subnets/41/' },
  tweets: [],
};
