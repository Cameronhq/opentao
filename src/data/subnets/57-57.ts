import type { RichSubnet } from '../subnet-rich';

export const sn57: RichSubnet = {
  slug: '57-57',
  netuid: 57,
  name: 'Gaia',
  shortPitch: 'Decentralized geospatial intelligence — weather, soil, and earth observation.',
  overview: [
    'Gaia (SN57), built by Nickel5, is the first geospatial subnet on Bittensor. Miners compete to deliver high-accuracy global predictions across four pillars: earth observation, climate / weather forecasting, disaster mitigation, and agricultural optimization. The output is a continuously-improving planetary forecasting layer.',
    'The headline use case is soil moisture: NASA\'s SMAP satellite delivers gold-standard global soil moisture data but only on an 8-day polar repeat cycle with significant access latency. Gaia\'s miners fill the temporal and spatial gaps with ML models trained on ECMWF weather, Sentinel-2 imagery, SMAP L4 data, and SRTM elevation.',
    'Weather forecasting on Gaia is anchored to Microsoft\'s Aurora foundation model, with miners building on top. The subnet partnered with SN13 (Data Universe / Macrocosmos) to incorporate real-time tracking of extreme weather events, blending model-based predictions with on-the-ground signal.',
    'Validators score predictions against eventual ground truth — SMAP retrievals, ECMWF reanalysis, observed weather — with H3 hex grids ensuring spatial fairness across continents. <a href="#customer" style="color: var(--accent);">See competitive landscape ↓</a>',
  ],
  cycle: {
    challenge: { actor: 'Validator', title: 'Issue forecast task', body: 'Validators publish geospatial forecast tasks — soil moisture at H3 hex IDs, weather windows, geomagnetic storm forecasts — with horizon and grid spec.', dataK: 'payload', dataV: 'H3 grid + forecast spec' },
    compute:   { actor: 'Miner',     title: 'Predict', body: 'Miners run their geospatial ML models (built on Aurora and proprietary stacks) and return predictions for each requested location and time.', dataK: 'latency',  dataV: 'minutes per batch' },
    score:     { actor: 'Validator', title: 'Score vs. truth', body: 'After the horizon resolves, validators compare predictions against SMAP, ECMWF reanalysis, or observed weather data and rank miners by accuracy.', dataK: 'scale',    dataV: 'global H3 coverage' },
    settle:    { actor: 'Subtensor', title: 'Yuma → emission', body: "Every validator's weights, multiplied by their stake, aggregated by Yuma into one reward vector. TAO mints to top miners.", dataK: 'tempo', dataV: '~72 min · 24×/day' },
  },
  miner: {
    does: 'Trains and serves geospatial ML models predicting soil moisture, weather, geomagnetic activity, and related signals.',
    input: 'H3 hex grid task spec with horizon, plus access to global geospatial reference data.',
    output: 'Per-hex prediction values with timestamps.',
    hardware: 'GPU box for deep learning inference; cold storage for global geospatial datasets.',
    paidFor: 'Forecast accuracy vs. eventual ground truth, averaged across the H3 coverage area.',
    paidVia: 'Per-tempo emission, score × validator stake',
  },
  validator: {
    does: 'Issues geospatial tasks, ingests ground-truth feeds, scores miners on accuracy, submits weights.',
    requires: 'SMAP / ECMWF / Sentinel access, H3 tooling, ground-truth ingestion pipelines.',
    output: 'Per-miner accuracy-based weight vector.',
    paidFor: 'Submitting weights that agree with consensus median',
    paidVia: 'Per-tempo emission, stake × consensus alignment',
  },
  scoring: {
    leadOneLine: 'Was your global soil moisture / weather forecast actually closer to what happened?',
    explanation: [
      'Each task pins to specific H3 hexagons across the globe (excluding urban areas and water bodies for fairness). Miners predict; validators wait for the horizon to resolve and pull ground truth from SMAP retrievals, ECMWF reanalysis, or observed station data.',
      'Spatial fairness via H3 prevents miners from cherry-picking easy regions. A miner who only predicts well over the US Midwest and badly over the Sahel will lose to one with consistent global accuracy.',
    ],
    cheatPath: 'Returning climatological averages won\'t survive — the score discriminates between forecasts that capture the day-to-day departure from climate norms and ones that simply repeat the long-run mean.',
  },
  customer: {
    leadOneLine: 'Insurance, agriculture, energy traders, disaster responders, and anyone whose decisions depend on near-real-time global geospatial state.',
    explanation: [
      'Soil moisture matters for crop insurance underwriting, irrigation planning, and commodity trading. Weather forecasts at sub-Aurora-class accuracy matter for energy load forecasting and renewables dispatch. Geomagnetic storm forecasts matter for satellite operators and power-grid stability.',
      'Gaia\'s pitch is that none of these markets has a single open, continuously-improving global feed today — they\'re fragmented across government agencies, paid weather APIs, and in-house teams. A Bittensor-incentivized feed can undercut by aggregating the entire field\'s ML output.',
    ],
  },
  competitive: {
    scope: '2026 · global geospatial forecasting',
    rows: [
      { name: 'Gaia', subtitle: 'SN57', isSelf: true, approach: 'Decentralized geospatial subnet; miners predict on H3 grids; validators score vs. SMAP / ECMWF ground truth.', access: 'open · API', accessTone: 'open', differentiator: 'Open feed across earth observation, weather, soil, and geomagnetic — continuously trained by 192 competing miners.' },
      { name: 'ECMWF / NOAA',         approach: 'National weather agencies running large operational forecast systems.', access: 'open · API (with usage caps)', accessTone: 'open', differentiator: 'Best baseline, but slow to incorporate ML innovations.' },
      { name: 'Tomorrow.io / ClimaCell', approach: 'Commercial weather-data company with proprietary models.', access: 'closed · enterprise', accessTone: 'closed', differentiator: 'Closed model stack, subscription pricing.' },
      { name: 'Microsoft Aurora',     approach: 'Foundation model for weather forecasting; deployed via MSFT.', access: 'closed · partner', accessTone: 'closed', differentiator: 'Strong base model — Gaia miners build on top.' },
      { name: 'Google DeepMind GraphCast', approach: 'ML-based global weather forecasting model.', access: 'open · paper + weights', accessTone: 'open', differentiator: 'Static checkpoint, not a continuously-served feed.' },
    ],
    note: 'Gaia\'s wedge is making geospatial forecasting a continuously-improving open feed. Closed vendors win on absolute accuracy in narrow markets, but Gaia\'s breadth (weather + soil + geomagnetic + earth observation in one network) and openness create a different product category.',
  },
  team: {
    intro: [
      'Gaia is operated by Nickel5, a small geospatial-engineering team that describes itself as "capital engineering" — they build infrastructure for under-served quantitative niches. The Gaia codebase lives at github.com/Nickel5-Inc and has shipped soil-moisture, weather, and geomagnetic task families.',
      'Public-facing team identity is limited; the @Gaia_AI_ Twitter handle and Nickel5-Inc GitHub org carry most of the communication. The team has presented at scientific venues including EGU (European Geosciences Union) with two accepted abstracts on the soil-moisture pipeline.',
    ],
    founders: [
      { initials: 'N5', gradient: 'a', name: '[Founder 1 name]', role: 'Founder, Nickel5', bio: 'Geospatial ML + capital-markets background; leads Gaia\'s soil-moisture and weather pipelines.' },
    ],
    size: '~5-10',
    founded: '2024',
    based: 'Not publicly disclosed.',
    backers: 'Not publicly disclosed.',
    placeholder: true,
  },
  milestones: [
    { date: '2024·Q4', text: 'Gaia SN57 launches as the first geospatial subnet on Bittensor.' },
    { date: '2025·Q1', text: 'Soil moisture task family goes live using SMAP L4 + Sentinel-2 + ECMWF data.' },
    { date: '2025·Q2', text: 'Two abstracts accepted at European Geosciences Union (EGU25).' },
    { date: '2025·Q3', text: 'Partnership with SN13 (Macrocosmos) for real-time extreme weather signal.' },
  ],
  join: {
    title: 'Forecast the planet, mint TAO.',
    body: 'Miners need a geospatial ML pipeline — GPU box, access to global reference data, and a model that beats climatology. Validators need ground-truth feeds from SMAP / ECMWF / Sentinel. Customers can subscribe via API.',
    asideNote: 'H3 spatial fairness means you can\'t farm easy regions — your global accuracy is your score.',
  },
  tags: ['Geospatial', 'Weather', 'Climate', 'Earth Observation'],
  external: {
    github: 'https://github.com/Nickel5-Inc/Gaia',
    website: 'https://www.nickel5.com/',
    twitter: 'https://x.com/Gaia_AI_',
    taostats: 'https://taostats.io/subnets/57/',
  },
};
