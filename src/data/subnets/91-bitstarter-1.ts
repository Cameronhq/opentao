import type { RichSubnet } from '../subnet-rich';
export const sn91: RichSubnet = {
  slug: '91-bitstarter-1', netuid: 91, name: 'Bitstarter #1',
  shortPitch: 'Kickstarter-style crowdfunding and accelerator for decentralized AI startups on Bittensor.',
  overview: [
    'Bitstarter (SN91) is the first crowdfunding platform, incubator, and accelerator purpose-built for decentralized AI startups building on Bittensor. Pre-vetted teams pitch their subnet ideas to the community via livestream-style investment rounds, with capital, mentorship, and compute access bundled together to lower the activation energy for new subnet launches.',
    'The platform addresses three core friction points that prevent decentralized AI startups from getting on-protocol: funding (raising before a token exists), assurance (community vetting against vapor pitches), and access (compute resources and a path to subnet registration). Founder Chris Zacharia and the London-based team kicked off the first livestream investment round in 2025.',
    'Jacob Steeves, Bittensor\'s founder, sits on an advisory panel alongside other ecosystem experts, lending technical credibility to the vetting process. Bitstarter positions itself as the "Y Combinator of Bittensor subnets" — a directed funnel from idea to live subnet rather than a passive listing site.',
    'Crowdfunding for crypto projects is crowded, but a Bittensor-native accelerator with subnet-pipeline expertise is a defensible niche. <a href="#customer" style="color: var(--accent);">See competitive landscape ↓</a>',
  ],
  cycle: {
    challenge: { actor: 'Validator', title: 'Pitch validation', body: 'Validator broadcasts startup pitch material and community signals for miners to evaluate and forecast.', dataK: 'payload', dataV: 'pitch deck + traction' },
    compute:   { actor: 'Miner',     title: 'Score & forecast', body: 'Miners assess startup viability, founder track record, and likely subnet success, returning structured scores.', dataK: 'latency',  dataV: 'per-pitch evaluation' },
    score:     { actor: 'Validator', title: 'Calibrate vs outcome', body: 'Validators reward miners whose forecasts align with eventual fundraise success and subnet launch metrics.', dataK: 'scale',    dataV: 'forecast accuracy' },
    settle:    { actor: 'Subtensor', title: 'Yuma → emission', body: "Every validator's weights, multiplied by their stake, aggregated by Yuma into one reward vector. TAO mints to top miners.", dataK: 'tempo', dataV: '~72 min · 24×/day' },
  },
  miner:     { does: 'Evaluates startup pitches and forecasts which decentralized AI startups will succeed.', input: 'Pitch decks, founder history, traction signals', output: 'Structured viability scores and forecasts', hardware: 'Modest CPU + research tooling', paidFor: 'Forecast accuracy against realized startup outcomes', paidVia: 'Per-tempo emission, score × validator stake' },
  validator: { does: 'Curates pitch flow, hosts livestream rounds, scores miner forecasts vs. realized outcomes.', requires: 'Vetting workflow + outcome data feeds', output: 'Per-miner weights tied to forecast accuracy', paidFor: 'Submitting weights that agree with consensus median', paidVia: 'Per-tempo emission, stake × consensus alignment' },
  scoring:   {
    leadOneLine: 'Forecasts that match real fundraise and launch outcomes win.',
    explanation: [
      'Miners are not just rating pitches subjectively — they\'re forecasting whether a startup will hit milestones: closing a round, deploying a subnet, achieving registration. Validators settle scores after outcomes resolve, so miners optimize for calibration not popularity.',
      'Over many cohorts, calibration becomes the moat. A miner who consistently picks winners earns weight share regardless of personal connections, and the platform itself gains signal quality for the gated investment rounds.',
    ],
    cheatPath: 'Inflated scoring of every pitch — fails immediately because validators score against realized outcomes, not raw enthusiasm.',
  },
  customer:  {
    leadOneLine: 'Early-stage Bittensor subnet teams and the TAO-holding capital that backs them.',
    explanation: [
      'Two-sided market: subnet founders raising pre-launch capital and assurance, plus TAO holders/funds seeking deal flow with vetting and structured exposure. Bitstarter\'s livestream investment rounds compress the discovery + diligence + commit cycle into a single event.',
      'Direct comps are accelerators (Outlier Ventures, Alliance), launchpads (CoinList, DAOMaker), and the informal "TAO insider" deal flow on Twitter. Bitstarter wins if its vetting + advisory loop materially raises subnet survival rates vs. the unfiltered registration funnel.',
    ],
  },
  competitive: { scope: '2026 · decentralized AI startup funding', rows: [
    { name: 'Bitstarter #1', subtitle: 'SN91', isSelf: true, approach: 'Native Bittensor accelerator + livestream crowdfunds', access: 'open · API', accessTone: 'open', differentiator: 'Subnet-pipeline expertise, Steeves on advisory panel' },
    { name: 'CoinList', approach: 'Curated token launchpad with KYC', access: 'closed', accessTone: 'closed', differentiator: 'Established reach but generalist, not Bittensor-native' },
    { name: 'Outlier Ventures', approach: 'Web3 startup accelerator with equity + token deals', access: 'closed', accessTone: 'closed', differentiator: 'Generalist crypto, not subnet-specialized' },
    { name: 'Alliance DAO', approach: 'Founder-led crypto accelerator', access: 'closed', accessTone: 'closed', differentiator: 'Strong network, multi-chain focus' },
    { name: 'Direct TAO OTC deals', approach: 'Informal pre-launch SAFTs via Twitter / Discord', access: 'closed', accessTone: 'closed', differentiator: 'Status quo, no vetting or community signal' },
  ], note: 'Bitstarter\'s defensibility comes from being the only structured on-ramp to Bittensor — if subnet launches keep accelerating, owning the funnel matters more than per-deal economics.' },
  team: {
    intro: [
      'Bitstarter was founded in 2025 by Chris Zacharia and is based in London. The platform launched as the first crowdfunding venue purpose-built for Bittensor.',
      'Jacob Steeves (Bittensor founder, @const_reborn) sits on an advisory panel alongside other ecosystem experts, lending vetting credibility.',
    ],
    founders: [{ initials: 'CZ', gradient: 'v', name: 'Chris Zacharia', role: 'Founder', bio: 'Founder of Bitstarter, building the first crowdfunding + accelerator platform for Bittensor subnet startups.' }],
    size: 'Not publicly disclosed', founded: '2025', based: 'London, UK', backers: 'Not publicly disclosed.',
  },
  milestones: [
    { date: '2025', text: 'Founded by Chris Zacharia in London.' },
    { date: '2025', text: 'First livestream investment round launches the platform.' },
    { date: '2025', text: 'Bitstarter registered as Subnet 91 on Bittensor.' },
  ],
  join: { title: 'Back the next wave of subnets', body: 'Founders building decentralized AI startups can apply for funding, mentorship, and compute via Bitstarter\'s pre-vetted intake. Miners with strong forecasting models compete to predict which startups land funding and launch subnets.', asideNote: 'Hiring CTO / Technical Lead per a 2025 listing on Cryptocurrencyjobs — watch the platform for further roles.' },
  tags: ['accelerator', 'crowdfunding', 'subnet-launch', 'incubator'],
  external: { website: 'https://www.bitstarter.ai/', twitter: 'https://x.com/bitstarter_ai', taostats: 'https://taostats.io/subnets/91/' },
  tweets: [],
};
