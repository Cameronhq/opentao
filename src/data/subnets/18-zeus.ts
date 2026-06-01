import type { RichSubnet } from '../subnet-rich';

export const zeus: RichSubnet = {
  slug: '18-zeus',
  netuid: 18,
  name: 'Zeus',
  shortPitch: 'A Bittensor subnet for global weather forecasting.',
  overview: [
    'Zeus is the subnet operated by Orpheus AI for global weather forecasting. Miners run their own atmospheric models against ERA5 reanalysis; validators score outputs with anomaly-correlation-coefficient at 6h, 24h, 72h, and 120h horizons. The customer outside Bittensor is the energy-trading desk.',
    'The subnet uses a standard Bittensor metagraph (~25 miners and ~11 validators reported in early 2026). Each tempo the validator picks a withheld initial atmospheric state from public ERA5, broadcasts it, then grades miner forecasts against held-out ground truth. Higher ACC than the validator-side median wins emission; climatology and stale snapshots score near zero.',
    'The pitch Orpheus AI makes is direct: "weather is the last great unmonetized scientific instrument — Zeus puts an incentive layer on top of it." Orpheus AI claims the subnet beats ECMWF HRES by roughly 4.5 hours of effective skill at the 120h horizon. If that holds across seasons, it is millions of dollars in trade signal per year.',
    'Where ECMWF, GraphCast, and Pangu-Weather are all single static checkpoints, Zeus is a live competition — twenty-five teams retraining in parallel. <a href="#customer" style="color: var(--accent);">See competitive landscape ↓</a>',
  ],
  cycle: {
    challenge: { actor: 'Validator', title: 'Sample a problem', body: 'Pick a region and a recent time slice the miners haven\'t seen, broadcast the initial atmospheric state to every active miner.', dataK: 'payload', dataV: 'ERA5 init tensor · ~4 MB' },
    compute:   { actor: 'Miner',     title: 'Run the model', body: 'Each miner runs its own forecast model and returns gridded predictions at +6h, +24h, +72h, +120h horizons.', dataK: 'latency',  dataV: '20–90 s on H100' },
    score:     { actor: 'Validator', title: 'Grade with ACC', body: 'Compute anomaly-correlation-coefficient against the held-out ERA5 truth window. Weighted sum across variables and horizons.', dataK: 'scale', dataV: '0.0 → 1.0 · higher = better' },
    settle:    { actor: 'Subtensor', title: 'Yuma → emission', body: "Every validator's weights, multiplied by their stake, aggregated by Yuma into one reward vector. TAO mints to top miners.", dataK: 'tempo', dataV: '~72 min · 24×/day' },
  },
  miner: {
    does: 'Runs an atmospheric model and returns gridded predictions every tempo.',
    input: 'Withheld ERA5 init state, ~4 MB tensor',
    output: 'Gridded fields · 4 horizons × 4 variables',
    hardware: '1×H100 80GB · A100 minimum',
    paidFor: 'High ACC vs held-out truth · heavy-tailed',
    paidVia: 'Per-tempo emission, score × validator stake',
  },
  validator: {
    does: 'Pulls ERA5 ground truth, runs ACC against every miner, submits weights.',
    requires: 'Top-N stake + ERA5 mirror + reference validator code',
    output: 'Per-UID weight vector, signed on-chain',
    paidFor: 'Submitting weights that agree with consensus median',
    paidVia: 'Per-tempo emission, stake × consensus alignment',
  },
  scoring: {
    leadOneLine: 'A weather forecast is graded against reality. That\'s it.',
    explanation: [
      'The validator picks an initial atmospheric state from the public ERA5 reanalysis — a recent slice the miners have not seen — and broadcasts it. Each miner returns gridded predictions of temperature, wind, geopotential, and humidity at four horizons (+6h, +24h, +72h, +120h). The validator then holds out the ground truth from a slightly later ERA5 window and computes Anomaly Correlation Coefficient (ACC) for each variable / horizon combination. Higher ACC than the median wins emission.',
      'The math rewards skill — beating the long-term climatological mean — not just memorization. A miner that returns climatology will score near zero. A miner that perfectly predicts the future scores 1.0.',
    ],
    cheatPath: 'Returning ERA5 reanalysis verbatim — validators inject the held-out window randomly and a cheating miner will be caught the first time the window slides into the future. Predicting climatology — ACC against the true field will be near zero. Running a stale model snapshot — the catalog of evaluation regions moves seasonally, top miners retrain on rolling windows.',
  },
  customer: {
    leadOneLine: 'The customer outside Bittensor is the energy-trading desk.',
    explanation: [
      'Wind farms, battery dispatch, gas demand — all hinge on 24- to 120-hour forecast accuracy. ECMWF\'s HRES is the public benchmark. Orpheus AI claims SN18 beats it by roughly 4.5 hours of effective skill at the 120h horizon. If that gap holds across seasons, it\'s millions of dollars in trade signal per year — easily covering the subnet\'s emission cost.',
      'Concretely: Zeus sells an API to power-trading desks (some named, some anonymous). The chain rewards miners for accuracy. The customer doesn\'t see — or care about — Bittensor under the hood.',
    ],
  },
  competitive: {
    scope: '120h skill · global · 2026',
    rows: [
      { name: 'Zeus', subtitle: 'SN18', isSelf: true, approach: 'Incentivized swarm of competing atmospheric models, scored against ERA5', access: 'open · API', accessTone: 'open', differentiator: 'Claims +4.5h skill vs ECMWF · price-per-API-call' },
      { name: 'ECMWF HRES', approach: 'Single deterministic NWP run, govt-funded', access: 'public', accessTone: 'open', differentiator: 'Gold standard · slow release cadence · no API SLA' },
      { name: 'GraphCast', subtitle: 'DeepMind', approach: 'Single transformer trained on ERA5, deterministic', access: 'open weights', accessTone: 'open', differentiator: 'Best single-model · static checkpoint · no continuous re-train pressure' },
      { name: 'Pangu-Weather', subtitle: 'Huawei', approach: '3D transformer ensemble', access: 'open weights', accessTone: 'open', differentiator: 'Strong tropical-cyclone tracks · no commercial channel' },
      { name: 'Tomorrow.io', approach: 'Proprietary ensemble of NWP + ML', access: 'closed · paid', accessTone: 'closed', differentiator: 'Enterprise SLA · ag/insurance verticals · expensive' },
    ],
    note: 'Most weather AI players ship a static checkpoint and call it a day. Zeus\'s claim to be different is the incentive layer: 25 miners are all retraining against last week\'s ERA5 to keep their ACC above the prune threshold. If that mechanism works, Zeus stays ahead of any single-checkpoint competitor by construction.',
  },
  team: {
    intro: [
      'Orpheus AI is the applied-AI lab that designed and operates Zeus. They wrote the validator, run the reference miner, and own the customer relationship with the energy-trading desks. The lab is small — roughly 6–8 people — but the relevant team has deep numerical-weather-prediction (NWP) background.',
      'The pitch they make to potential miners and customers: "weather is the last great unmonetized scientific instrument. We built an incentive layer on top of it."',
    ],
    founders: [
      { initials: 'RC', gradient: 'v', name: '[Founder 1 name]', role: 'Co-founder · CEO', bio: 'Ex-NCAR atmospheric scientist. Worked on the GraphCast follow-on at a major AI lab before starting Orpheus. Drives the customer side — the energy-trader API.' },
      { initials: 'MK', gradient: 'a', name: '[Founder 2 name]', role: 'Co-founder · CTO', bio: 'Background in ML systems and distributed training. Built the validator scoring pipeline and the on-chain settlement glue. Owns the protocol-level engineering.' },
      { initials: 'JL', gradient: 'g', name: '[Person 3 name]', role: 'Head of validators · ops', bio: 'Runs the reference validator and the community Discord. Onboards new miners, mediates catalog updates, runs the weekly office hours.' },
    ],
    size: '~6–8',
    founded: '2024',
    based: 'Distributed · core in EU + US',
    backers: 'Not publicly disclosed. Bootstrapped + subnet emission until a round is announced.',
    placeholder: true,
  },
  milestones: [
    { date: '2024·08', text: 'Subnet registered by Orpheus AI on mainnet.' },
    { date: '2025·Q1', text: 'First public benchmark: claims +4.5h of skill vs ECMWF HRES at 120h horizon.' },
    { date: '2025·Q3', text: 'Energy-trader API live. Subnet revenue ramps from emission-only to emission + customer.' },
    { date: '2025·12', text: 'Last meaningful repo commit (Orpheus-AI/Zeus). Catalog stable.' },
    { date: '2026·Q1', text: 'Ocean / hydro forecast variables added. ERA5 reanalysis window expanded.' },
  ],
  join: {
    title: 'Run your own forecast model',
    body: 'Hardware spec, install commands, monitoring, and the day-by-day playbook for SN18 are in the dedicated mining playbook. Validators welcome too — stake threshold and reference code via the GitHub repo.',
    asideNote: 'Validating? Requires a top-N stake position and an ERA5 mirror. Reach out via the Orpheus Discord.',
  },
  tags: ['prediction', 'ai-model', 'environmental-data', 'energy', 'incentive'],
  external: {
    github: 'https://github.com/Orpheus-AI/Zeus',
    website: 'https://zeussubnet.com',
    twitter: 'https://twitter.com/zeussubnet',
    taostats: 'https://taostats.io/subnets/18/',
  },
  tweets: [
    { when: '3 days ago', body: 'New benchmark: SN18 vs HRES on European wind cluster — +5.1h skill at 120h.' },
    { when: '1 week ago', body: 'Catalog change: adding ocean SST predictions to score function.' },
    { when: '2 weeks ago', body: 'Hiring an atmospheric modeler. DM if interested.' },
  ],
};
