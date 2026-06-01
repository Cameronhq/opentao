import type { RichSubnet } from '../subnet-rich';

export const sn28: RichSubnet = {
  slug: '28-gm',
  netuid: 28,
  name: 'gm (S&P 500 Oracle)',
  shortPitch: 'Decentralized short-term S&P 500 price forecasting oracle.',
  overview: [
    'Subnet 28 — originally launched as the Foundry S&P 500 Oracle — is a financial prediction subnet that incentivizes accurate short-term forecasts of the S&P 500 index during US market trading hours. The subnet was launched by Foundry (a DCG subsidiary) and is incubated alongside Yuma; the public codebase lives at github.com/foundryservices/snpOracle.',
    'Validators send miners a future timestamp; miners reply with predicted close prices for the next six 5-minute S&P 500 intervals via a commit-reveal scheme. As predictions mature, validators compare them against the true index print, accumulate per-miner error, and write weights on-chain. All miner models and training data must be open-sourced on HuggingFace to qualify for emission.',
    'The buyer is the global financial system itself — wealth managers, professional traders, quant desks, and downstream trading products that want a decentralized, model-diverse oracle for short-horizon equity moves. The S&P 500 is the chosen anchor because it has both massive name recognition and an unambiguous external source of truth.',
    'Unlike centralized forecasting APIs or single-model vendors, SN28 produces a continuously-tournamented ensemble whose membership turns over as miners improve their nets. <a href="#customer" style="color: var(--accent);">See competitive landscape ↓</a>',
  ],
  cycle: {
    challenge: { actor: 'Validator', title: 'Send target timestamp', body: 'During US market hours, validator dispatches a future timestamp to miners and asks for predictions of S&P 500 close prices over the next six 5-minute intervals, using commit-reveal.', dataK: 'payload', dataV: 'timestamp + six 5m horizons' },
    compute:   { actor: 'Miner',     title: 'Forecast S&P', body: 'Miner runs its neural-net forecasting model (open-sourced on HuggingFace) over the latest market data and returns committed price predictions before reveal.', dataK: 'latency',  dataV: 'seconds-scale per query' },
    score:     { actor: 'Validator', title: 'Compare to truth', body: 'Validator waits for real S&P 500 prints, compares each revealed prediction against ground truth, accumulates error metrics per miner, and writes weights on-chain.', dataK: 'scale', dataV: 'MAE / directional accuracy' },
    settle:    { actor: 'Subtensor', title: 'Yuma → emission', body: "Every validator's weights, multiplied by their stake, aggregated by Yuma into one reward vector. TAO mints to top miners.", dataK: 'tempo', dataV: '~72 min · 24×/day' },
  },
  miner: {
    does: 'Trains and serves a time-series neural network that predicts six 5-minute S&P 500 close prices given a target timestamp.',
    input: 'Future timestamp from validator + access to recent market data feeds.',
    output: 'Committed and revealed price predictions for six 5-minute horizons.',
    hardware: 'GPU host (any modern NVIDIA card) plus reliable market-data ingestion; model + training data must be public on HuggingFace.',
    paidFor: 'Lowest realised error vs ground truth across the rolling scoring window.',
    paidVia: 'Per-tempo emission, score × validator stake',
  },
  validator: {
    does: 'Sends timestamps during market hours, runs commit-reveal, fetches ground-truth S&P 500 prints, computes per-miner error, and submits weights every tempo.',
    requires: 'Stake plus a reliable S&P 500 market-data source for ground truth and a validator host capable of running the commit-reveal protocol.',
    output: 'Per-miner weight vector reflecting forecasting accuracy and directional correctness.',
    paidFor: 'Submitting weights that agree with consensus median',
    paidVia: 'Per-tempo emission, stake × consensus alignment',
  },
  scoring: {
    leadOneLine: 'Commit-reveal price forecasts, scored against real S&P 500 prints over six 5-minute horizons.',
    explanation: [
      'Each validator session pushes a target timestamp to miners, who commit (hash) their predictions before reveal so they cannot fit to the future print. Once the predicted intervals close, the validator pulls the actual S&P 500 close prices, computes per-horizon error (mean absolute error and directional correctness), and aggregates across many sessions into a per-miner score.',
      'Because all winning models must be open-sourced on HuggingFace, the subnet effectively forces an arms race in publicly auditable time-series modelling. Weights are written on-chain every tempo and Yuma consensus picks the median, so a single rogue validator cannot reward a friendly miner.',
    ],
    cheatPath: 'A miner can refuse to reveal after a bad commit, copy another miner\'s public HuggingFace model, or try to game training data. Commit-reveal kills any "see-the-future" cheat; weight-resetting at evaluation prevents stealing trained weights; the open-source requirement means the only durable edge is a genuinely better architecture or feature set.',
  },
  customer: {
    leadOneLine: 'Trading desks, wealth managers, and downstream financial products needing a decentralized short-horizon S&P 500 oracle.',
    explanation: [
      'The customer pitch is integration into financial workflows: wealth managers running automated rebalancing, quant funds wanting an extra forecasting ensemble, and product builders who want a verifiable price-prediction feed without depending on a single vendor model. Open-source weights and a commit-reveal log make every prediction reproducible and auditable.',
      'Critics correctly note that 5-minute S&P forecasts are noisy and rarely actionable on their own, but as a piece of a broader factor stack — or as Bittensor\'s flagship demonstration that the network can host real financial-grade primitives — SN28 is a useful template the team plans to extend to other instruments.',
    ],
  },
  competitive: {
    scope: 'short-horizon financial price prediction · 2026',
    rows: [
      { name: 'gm / S&P 500 Oracle', subtitle: 'SN28', isSelf: true, approach: 'Bittensor-incentivized ensemble of open-source time-series models predicting next six 5-min S&P closes.', access: 'open · model + code public', accessTone: 'open', differentiator: 'All miner models must be open-sourced; ensemble emerges from on-chain incentives.' },
      { name: 'SN8 Proprietary Trading Network (Taoshi)', approach: 'Bittensor subnet rewarding miners for live trading signals across crypto / FX with PnL-based scoring.', access: 'open · signals', accessTone: 'open', differentiator: 'PnL-driven across many instruments; closed-source strategies allowed.' },
      { name: 'SN50 Synth (Mode)', approach: 'Bittensor subnet generating synthetic price-distribution forecasts (BTC, etc.) over multi-horizon windows.', access: 'open · API', accessTone: 'open', differentiator: 'Distribution-style probabilistic forecasts, crypto focus.' },
      { name: 'Numerai', approach: 'Tournament-style hedge fund where data scientists submit obfuscated stock predictions for a meta-model.', access: 'open · tournament', accessTone: 'open', differentiator: 'Closed obfuscated data, centralized fund using submissions as one signal.' },
      { name: 'Kaiko / S&P Indices feeds', approach: 'Centralized institutional market-data and forecasting vendors selling index data and risk signals.', access: 'closed · enterprise', accessTone: 'closed', differentiator: 'Authoritative data but no open ensemble; high vendor lock-in.' },
    ],
    note: 'SN28 sits between Bittensor financial subnets (SN8 Taoshi, SN50 Synth) and traditional quant tournaments like Numerai. Its niche is being the open, transparent, commit-reveal short-horizon equity-index oracle — limited utility alone, but a building block other Bittensor subnets and DCG/Yuma products can compose with.',
  },
  team: {
    intro: [
      'Subnet 28 is run by Foundry — the Digital Currency Group subsidiary best known for Bitcoin mining and staking infrastructure — in collaboration with Yuma, DCG\'s decentralized-intelligence vehicle launched in late 2024.',
      'The team\'s philosophy is to bring real-world financial primitives onto Bittensor: open-source models, hard external truth, and commit-reveal honesty over hand-wavy "AI predictions". S&P 500 is the wedge; further instruments are signposted on the roadmap.',
    ],
    founders: [
      { initials: 'FD', gradient: 'v', name: 'Foundry Digital', role: 'Operating team', bio: 'Foundry is a subsidiary of DCG focused on Bitcoin mining, staking, and decentralized infrastructure; the SN28 codebase lives under github.com/foundryservices.', twitter: 'https://x.com/FoundryServices', github: 'https://github.com/foundryservices' },
      { initials: 'BS', gradient: 'a', name: 'Barry Silbert', role: 'Backer (CEO, Yuma / DCG)', bio: 'Founder & CEO of DCG; CEO of Yuma, the DCG vehicle that invests in and incubates Bittensor subnets including SN28.', twitter: 'https://x.com/BarrySilbert' },
    ],
    size: 'Foundry team (DCG subsidiary)',
    founded: '2024·02 (subnet 28 v1.0 release)',
    based: 'United States (Foundry / DCG)',
    backers: 'Backed and incubated by Yuma (DCG\'s decentralized AI vehicle).',
    placeholder: false,
  },
  milestones: [
    { date: '2024·02', text: 'Foundry S&P 500 Oracle (SN28) v1.0.0 released; commit-reveal forecast loop live during US market hours.' },
    { date: '2024·11', text: 'DCG launches Yuma as the vehicle for backing Bittensor subnets, with SN28 among the flagship reference projects.' },
    { date: '2025', text: 'Open-source HuggingFace requirement strictly enforced; miner ecosystem builds increasingly larger time-series models.' },
  ],
  join: {
    title: 'Mine the S&P 500 Oracle',
    body: 'Train a time-series forecaster, push it to HuggingFace, and register a miner on SN28 to compete on real next-bar S&P predictions. Repo: github.com/foundryservices/snpOracle.',
    asideNote: 'Miners must open-source their model and training data to receive emissions.',
  },
  tags: ['finance', 'forecasting', 'oracle', 'time-series', 'sp500'],
  external: {
    github: 'https://github.com/foundryservices/snpOracle',
    website: 'https://foundrydigital.com',
    twitter: 'https://x.com/FoundryServices',
    taostats: 'https://taostats.io/subnets/28/',
  },
};
