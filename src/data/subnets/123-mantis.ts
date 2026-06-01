import type { RichSubnet } from '../subnet-rich';

export const sn123: RichSubnet = {
  slug: '123-mantis',
  netuid: 123,
  name: 'MANTIS',
  shortPitch: 'Information-theoretic market forecasting via miner embeddings.',
  overview: [
    'MANTIS is Bittensor Subnet 123, a decentralized financial-forecasting subnet that rewards miners for embeddings whose information improves an ensemble price model. Rather than asking miners to predict a number, MANTIS asks them to submit a vector — and pays them in proportion to how much that vector reduces the validator\'s forecast loss across a basket of assets.',
    'Nine markets are live in production: BTCUSD, ETHUSD, EURUSD, GBPUSD, CADUSD, NZDUSD, CHFUSD, DXY, XAUUSD, and XAG. For each, validators specify a ticker, embedding dimension, forecast horizon (in blocks ahead), and a loss/scoring function, and miners commit their embeddings on-chain.',
    'The output is a stream of decentralized "alpha" — short-horizon market signals — that can be packaged and sold to trading firms, hedge funds, and prop desks. The subnet is positioned explicitly as an open competitor to legacy quant-fund signal pipelines, with the embedding-as-input mechanism making strategies harder to copy than a raw forecast.',
    'One-line diff: a permissionless, embedding-based signal market where the protocol pays whatever miner most reduces ensemble forecast loss across nine live assets. <a href="#customer" style="color: var(--accent);">See competitive landscape ↓</a>',
  ],
  cycle: {
    challenge: { actor: 'Validator', title: 'Issue forecast spec', body: 'Validator publishes the active config: ticker, embedding dimension, blocks-ahead horizon, and loss function for each of the nine live markets.', dataK: 'payload', dataV: 'asset × horizon × dim' },
    compute:   { actor: 'Miner',     title: 'Submit embedding', body: 'Miner runs their proprietary model — anything from microstructure features to LLMs over news — and commits a fixed-dimension embedding on-chain for each asset.', dataK: 'latency',  dataV: 'per-block embedding' },
    score:     { actor: 'Validator', title: 'Marginal-information score', body: 'Validator trains an ensemble forecast model and measures how much each miner\'s embedding reduces the loss versus the ensemble without it; weights scale with marginal information value.', dataK: 'scale',    dataV: 'info value vs. ensemble' },
    settle:    { actor: 'Subtensor', title: 'Yuma → emission', body: "Every validator's weights, multiplied by their stake, aggregated by Yuma into one reward vector. TAO mints to top miners.", dataK: 'tempo', dataV: '~72 min · 24×/day' },
  },
  miner: {
    does: 'Build any predictive pipeline (microstructure, alternative data, ML, LLM-on-news) and emit a fixed-dim embedding per asset per block.',
    input: 'Any public + private data sources the miner can access',
    output: 'Time-stamped embeddings committed on-chain',
    hardware: 'Whatever the miner\'s model requires — from a laptop to a GPU box',
    paidFor: 'Embeddings whose marginal information value lifts ensemble forecast accuracy',
    paidVia: 'Per-tempo emission, score × validator stake',
  },
  validator: {
    does: 'Maintain the live ensemble forecast model, ingest miner embeddings, compute marginal information gain per miner, and set weights.',
    requires: 'Bittensor validator stake, MANTIS validator stack, market-data feeds for all nine assets',
    output: 'Weight vector concentrating emission on highest-marginal-information miners',
    paidFor: 'Submitting weights that agree with consensus median',
    paidVia: 'Per-tempo emission, stake × consensus alignment',
  },
  scoring: {
    leadOneLine: 'Pay miners for the information their embedding adds to the ensemble — not for their raw forecast.',
    explanation: [
      'The MANTIS scoring rule is information-theoretic: for each asset, the validator runs an ensemble forecast over all submitted embeddings, then measures the marginal reduction in loss attributable to each miner\'s vector. Higher reduction → higher weight. This sidesteps the classic problem of paying for a forecast that merely copied the ensemble, and rewards genuinely orthogonal signal.',
      'Because miners submit embeddings rather than directions, they can pack rich, non-linear features without revealing their strategy to other miners — and the validator can re-use the same embeddings across multiple horizons and loss functions. Atlas has publicly described next-step plans to run a "mini Bittensor within MANTIS" — an internal search over asset sets, loss functions, models, and embedding dimensions.',
    ],
    cheatPath: 'Submitting random noise: useless, contributes zero marginal information. Copying another miner\'s public output: contributes no new information once the validator de-duplicates. The harder attack is collusion among large miners to bias the ensemble, but Yuma\'s stake-weighted consensus median and validator diversity bound that risk.',
  },
  customer: {
    leadOneLine: 'Trading firms, hedge funds, and prop desks buying decentralized "alpha" feeds.',
    explanation: [
      'MANTIS produces a continuous stream of short-horizon forecasts across nine live markets. The buyer surface is exactly the buyer surface of any quant signal vendor: hedge funds, prop traders, OTC desks, and high-frequency shops that pay for incremental edge. The pitch is decentralization (no single-vendor dependence) plus a transparent, on-chain quality bar.',
      'Distribution is still being built — the subnet emphasises producing high-quality signal first, then packaging it for sale. A growing TAO-native audience and bittensor-aligned trading firms make up the early demand, with broader institutional integrations as the longer-term play.',
    ],
  },
  competitive: {
    scope: 'short-horizon market forecasting · 2026',
    rows: [
      { name: 'MANTIS', subtitle: 'SN123', isSelf: true, approach: 'Open embedding-based signal market across 9 assets; pays miners by marginal information value.', access: 'open · subnet API', accessTone: 'open', differentiator: 'Only Bittensor subnet paying for embeddings (not forecasts) with an info-theoretic reward.' },
      { name: 'Two Sigma / Renaissance', approach: 'Closed quant funds with proprietary signal pipelines built over decades.', access: 'closed · in-house', accessTone: 'closed', differentiator: 'State-of-the-art alpha but fully internal; capital-allocators rather than signal vendors.' },
      { name: 'Numerai', approach: 'Tournament where data scientists submit predictions on obfuscated features for a single hedge fund.', access: 'open · tournament', accessTone: 'open', differentiator: 'Open contributor base but single-employer model; obfuscation hides what is being predicted.' },
      { name: 'Nous Research / Subnet 41 forecasting', approach: 'Other decentralized forecasting efforts using more conventional prediction submissions.', access: 'open · subnet', accessTone: 'open', differentiator: 'Forecast-based rather than embedding-based; less robust to copy-strategies.' },
      { name: 'WSB / Reddit signal vendors', approach: 'Crowd-sourced sentiment and signal feeds packaged for retail and small funds.', access: 'open · paid feeds', accessTone: 'open', differentiator: 'Easy to access, weak signal quality, no on-chain reward mechanism.' },
    ],
    note: 'Quant funds keep their pipelines closed; tournaments like Numerai open the contributor side but route all alpha to a single buyer. MANTIS sits in a third lane: open contributors paid in TAO, signal packaged on top, with the embedding-as-input mechanism making the protocol robust to forecast-copying. The hardest question is the same one every signal vendor faces — does the alpha survive once it scales.',
  },
  team: {
    intro: [
      'MANTIS is led by a developer publicly known as Atlas (also "Barbarian"), operating under the X handle @Barbarian7676. Multiple interviews and community posts identify Atlas as a young builder — first mining Ethereum as a teenager, now running one of the most distinctive forecasting subnets on Bittensor.',
      'The subnet is closely associated with Atlas\' work and has been featured on the Revenue Search podcast (Subnet Session 22) and across community write-ups. Beyond Atlas, contributors are not publicly listed by name; the code lives at github.com/Barbariandev/MANTIS.',
    ],
    founders: [
      { initials: 'AT', gradient: 'v', name: 'Atlas ("Barbarian")', role: 'Founder · Lead architect', bio: 'Pseudonymous founder of MANTIS. Background mining Ethereum as a teenager; built MANTIS to turn information-theoretic scoring into a decentralized signal market.', twitter: 'https://x.com/Barbarian7676', github: 'https://github.com/Barbariandev/MANTIS' },
    ],
    size: 'Small (Atlas + contributors)',
    founded: '2025',
    based: 'Distributed / not publicly disclosed',
    backers: 'Not publicly disclosed.',
    placeholder: true,
  },
  milestones: [
    { date: '2025', text: 'MANTIS launches as Subnet 123 with the embedding-based scoring mechanism and initial asset set.' },
    { date: '2025·Q4', text: 'Subnet expands to nine live markets (BTC, ETH, EUR, GBP, CAD, NZD, CHF, DXY, XAU, XAG).' },
    { date: '2026·Q1', text: 'Featured on Revenue Search podcast (Subnet Session 22); community coverage as a top signal subnet alongside SN62 and SN120.' },
  ],
  join: {
    title: 'Ship an embedding, earn information rent',
    body: 'Build any forecasting pipeline you want — microstructure, alt-data, LLM-on-news — and emit a fixed-dimension embedding per asset per block. If your embedding adds marginal information to the ensemble forecast, validators concentrate emission on you.',
    asideNote: 'Setup: github.com/Barbariandev/MANTIS · config.py defines active assets and horizons · @Barbarian7676 on X for updates.',
  },
  tags: ['forecasting', 'embeddings', 'signals', 'trading', 'information-theory'],
  external: {
    github: 'https://github.com/Barbariandev/MANTIS',
    website: 'https://subnetalpha.ai/subnet/mantis/',
    twitter: 'https://x.com/Barbarian7676',
    taostats: 'https://taostats.io/subnets/123/',
  },
  tweets: [
    { when: '2025', body: '"MANTIS #sn123, central to the prediction landscape of Bittensor subnets" — @Barbarian7676.' },
    { when: '2025', body: '"MANTIS: The Ultimate Signal Machine of Bittensor" — community framing of the subnet\'s positioning.' },
  ],
};
