import type { RichSubnet } from '../subnet-rich';

export const sn46: RichSubnet = {
  slug: '46-zipcode',
  netuid: 46,
  name: 'RESI',
  shortPitch: 'Decentralized real-estate price prediction models, zipcode by zipcode.',
  overview: [
    'Subnet 46 is operated by Resi Labs as RESI — Real Estate Super Intelligence. The slot was originally NeuralAI (a 3D-asset generation project) but was acquired via a charity auction in late 2024 and repurposed for US residential real estate. Miners are organized around zipcode coverage: each miner trains an ONNX model to predict residential prices for a target set of zipcodes, commits a cryptographic fingerprint on-chain, and uploads the model to HuggingFace.',
    'Validators download each model daily, run inference against properties listed and sold in the last 30 days, score predictions using Mean Absolute Percentage Error against the actual sale price, and commit weights. Yuma then aggregates emission so it flows to miners with the lowest MAPE per zipcode and the best national coverage.',
    'The customer is the $45T US real estate industry — mortgage underwriters, iBuyers, investors, appraisal management companies, and PropTech apps that today pay Zillow, CoreLogic, and HouseCanary for AVM (automated valuation model) data. RESI offers the same product as an open, on-chain feed.',
    'Differentiator: cryptographically-verifiable models with publicly auditable accuracy by zipcode, vs closed AVM black boxes. <a href="#customer" style="color: var(--accent);">See competitive landscape ↓</a>',
  ],
  cycle: {
    challenge: { actor: 'Validator', title: 'Daily property set', body: 'Validators pull the 30-day list of newly listed and recently sold properties and broadcast inference tasks.', dataK: 'payload', dataV: '30-day listings + sales' },
    compute:   { actor: 'Miner',     title: 'Predict prices', body: 'Miners run their committed ONNX model against the property set and submit predictions.', dataK: 'latency',  dataV: 'daily' },
    score:     { actor: 'Validator', title: 'MAPE vs sales', body: 'Validators compare predictions to realized sale prices and score by Mean Absolute Percentage Error.', dataK: 'scale',    dataV: 'lower MAPE wins' },
    settle:    { actor: 'Subtensor', title: 'Yuma → emission', body: "Every validator's weights, multiplied by their stake, aggregated by Yuma into one reward vector. TAO mints to top miners.", dataK: 'tempo', dataV: '~72 min · 24×/day' },
  },
  miner:     { does: 'Trains ONNX models to predict US residential prices by zipcode.', input: 'Recent listings + sold-price ground truth + property features.', output: 'ONNX model committed on-chain + per-property predictions.', hardware: 'GPU for model training; CPU OK for inference at scale.', paidFor: 'Low MAPE on realized 30-day sales across covered zipcodes.', paidVia: 'Per-tempo emission, score × validator stake' },
  validator: { does: 'Downloads committed models, runs them against held-out sales, scores MAPE.', requires: 'Subnet validator stack + real-estate sales feed + ONNX runtime.', output: 'Per-miner weight vector based on MAPE.', paidFor: 'Submitting weights that agree with consensus median', paidVia: 'Per-tempo emission, stake × consensus alignment' },
  scoring:   { leadOneLine: 'Score = inverse of Mean Absolute Percentage Error vs realized sale prices in the last 30 days.', explanation: [
    'Miners commit a cryptographic fingerprint of their ONNX model on-chain, then validators download the exact model and re-run inference on the 30-day sales set. This makes the benchmark fully reproducible and prevents miners from secretly swapping models after the fact.',
    'Because MAPE is computed against actual sale prices, model accuracy is measured directly in dollars. There\'s no proxy reward — better predictions, more emission.',
  ], cheatPath: 'Predicting Zillow Zestimates verbatim or memorizing list prices fails because the score is against sold prices, not list. Model swaps fail because the on-chain commit is fixed.' },
  customer:  { leadOneLine: 'Mortgage, iBuyer, appraisal, and PropTech buyers who need accurate AVMs.', explanation: [
    'Zillow, CoreLogic, and HouseCanary sell AVM data into mortgage, insurance, and proptech workflows at premium prices and with opaque accuracy. RESI offers a competing feed where every miner\'s MAPE is publicly verifiable by zipcode — a level of transparency the incumbents don\'t provide.',
    'The zipcode-level organization also means buyers can subscribe just to the geographies they operate in, instead of paying for nationwide bundles, which fits the iBuyer and regional lender workflow more cleanly.',
  ] },
  competitive: { scope: '2026 · US residential AVM', rows: [
    { name: 'RESI', subtitle: 'SN46', isSelf: true, approach: 'Open ONNX model marketplace graded by sold-price MAPE per zipcode.', access: 'open · API', accessTone: 'open', differentiator: 'Cryptographic model commits + public accuracy by zipcode.' },
    { name: 'Zillow Zestimate', approach: 'Centralized AVM published on Zillow listings.', access: 'closed · platform', accessTone: 'closed', differentiator: 'Massive distribution; black-box accuracy and platform lock.' },
    { name: 'CoreLogic / HouseCanary', approach: 'Enterprise AVM data vendors for mortgage and insurance.', access: 'closed · enterprise', accessTone: 'closed', differentiator: 'Deep industry trust, expensive licenses.' },
    { name: 'Redfin Estimate', approach: 'Centralized AVM tied to brokerage product.', access: 'open · web', accessTone: 'open', differentiator: 'Free for consumers; not API-first for B2B.' },
    { name: 'Open-source AVM research', approach: 'Academic / open-source AVM models.', access: 'open · research', accessTone: 'open', differentiator: 'Strong methodology, weak commercial path.' },
  ], note: 'RESI\'s pitch is essentially "Zestimate, but every model has a public MAPE." That kind of transparency is the lever buyers in mortgage and insurance care about more than consumers do.' },
  team: { intro: [
    'RESI is led by Seby Rubino (Principal and project lead), a crypto-incentives and real-estate specialist, with Caleb Gates as technical lead and AI developer who oversees the data pipeline, consensus mechanisms, APIs, and model stack.',
    'Resi Labs publishes documentation at docs.resilabs.ai and maintains an active GitHub organization (resi-labs-ai). The team is hiring additional core developers with Bittensor and decentralized AI experience.',
  ], founders: [
    { initials: 'SR', gradient: 'v', name: 'Seby Rubino', role: 'Principal / Project Lead', bio: 'Leads RESI strategy at the intersection of decentralized crypto incentives and real-estate data systems.' },
    { initials: 'CG', gradient: 'a', name: 'Caleb Gates', role: 'Technical Lead (AI)', bio: 'Technical lead at Resi Labs; background in national real estate data systems. Owns the data pipeline, consensus, APIs, and AI models.' },
  ], size: 'Small core team, hiring', founded: '2024 (post-acquisition of SN46)', based: 'Not publicly disclosed.', backers: 'Not publicly disclosed.', placeholder: false },
  milestones: [
    { date: '2024·Q4', text: 'Resi Labs acquires SN46 (previously NeuralAI) via charity auction and repurposes for real estate.' },
    { date: '2025', text: 'RESI launches ONNX model marketplace with zipcode-level evaluation and on-chain model commits.' },
  ],
  join: { title: 'Train the AVM', body: 'If you have an edge in real-estate price modeling — feature engineering, MLS data, or learned models — register as a miner and commit your ONNX on-chain. Validators handle the MAPE scoring.', asideNote: 'Read docs.resilabs.ai for the model commit + evaluation contract before mining.' },
  tags: ['real-estate', 'avm', 'tabular-ml', 'onnx'],
  external: { github: 'https://github.com/resi-labs-ai/resi', website: 'https://docs.resilabs.ai/', taostats: 'https://taostats.io/subnets/46/' },
  tweets: [],
};
