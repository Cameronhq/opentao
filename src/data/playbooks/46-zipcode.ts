import type { RichPlaybook } from '../playbook-rich';

// SN46 — RESI (Real Estate Super Intelligence / Real Estate Price Prediction).
// IMPORTANT: The old resi-labs-ai/resi repo (data-collection model) is ARCHIVED.
// Active development moved to resi-labs-ai/resi-models — pivot to a MODEL
// subnet: miners submit ONNX house-price models; validators score on MAPE
// against fresh sales data ~30 days after commit. Winner-takes-all (~99%).

export const sn46: RichPlaybook = {
  slug: '46-zipcode',
  netuid: 46,
  name: 'RESI',
  category: 'data',
  categoryLabel: 'Real Estate Models',

  blurb:
    'Real estate price prediction subnet. Miners commit ONNX house-price models on-chain; validators evaluate against properties listed and sold in the last 30 days (data unseen at commit time). Winner-takes-all at ~99% of emission, with a commit-time tiebreaker that rewards pioneers.',

  whatMinersDo:
    "A miner trains an ONNX model that predicts US residential property sale prices, then commits it on-chain via the miner-cli (with the model itself hosted on a Hugging Face repo). Models must be committed roughly 30 days BEFORE the evaluation window — evaluation uses properties listed and sold in the last 30 days, guaranteeing the model has never seen the test data. Daily at 18:00 UTC, validators score every committed model on MAPE (mean absolute percentage error) against the fresh sales batch. Score = 1 − MAPE. The best model wins ~99% of emission; the rest share 1%; detected copiers earn 0%.",

  verifiedAt: '2026-06-01',
  verifiedBy: '@editorial',

  emission: '— τ/day',
  burnCostFallback: '— τ',
  minerCountFallback: 0,
  slotCap: 256,

  hardware: [
    {
      role: 'Model training box',
      count: '1',
      gpu: 'optional — depends on your model. XGBoost/LightGBM run great CPU-only; deep models want a single GPU.',
      vramGb: 16,
      cpuCores: 8,
      ramGb: 32,
      diskGb: 100,
      bandwidth: '100 Mbps',
      notes: 'Python 3.11+ <3.14. No env vars required by the miner-cli — CLI flags only. Training data sourcing is YOUR problem (Zillow / Redfin / county records).',
    },
  ],
  hardwareNote:
    'You do NOT host a live neuron. You train offline, commit ONNX on-chain, then wait 30 days for evaluation. Hardware is whatever you need to train — there is no axon to keep online.',

  rentalOk: true,
  rentalUsdPerHr: { lambda: 0.60, runpod: 0.55, coreweave: 0.70 },

  repo: {
    url: 'https://github.com/resi-labs-ai/resi-models',
    branch: 'main',
    extraRepos: [
      { name: 'resi-labs-ai/resi (archived)', url: 'https://github.com/resi-labs-ai/resi', purpose: 'PREVIOUS data-collection incarnation — archived May 2026. Do not use.' },
    ],
  },

  setupShape: 'simple-binary',
  setupOverview:
    'Pipeline: (1) source training data (Zillow/Redfin/MLS — your problem). (2) train an ONNX model targeting MAPE < 15%. (3) `miner-cli evaluate` locally. (4) `miner-cli submit` to push the model to HF and commit metadata on-chain. (5) wait ~30 days; daily 18:00 UTC evaluations against fresh sales data.',

  install: [
    { step: 'Clone the active repo (RESI-models, NOT the archived resi)',
      cmd:  'git clone https://github.com/resi-labs-ai/resi-models.git && cd resi-models' },
    { step: 'Install',
      cmd:  'pip install -e .' },
    { step: 'Verify CLI',
      cmd:  'miner-cli --help' },
    { step: 'Source training data',
      note: 'Build your own ingest from Zillow / Redfin / county records / MLS. Focus on properties sold in the last 3 years.' },
    { step: 'Train an ONNX model',
      note: 'Aim for MAPE < 15% on a held-out set. XGBoost / LightGBM / CatBoost converted to ONNX are strong baselines.' },
    { step: 'Register your hotkey on SN46',
      cmd:  'btcli subnet register --netuid 46 --wallet.name $WALLET --wallet.hotkey $HOTKEY' },
  ],

  runSteps: [
    { step: 'Evaluate locally',
      cmd:  'miner-cli evaluate --model.path ./my_model.onnx' },
    { step: 'Submit to chain + Hugging Face',
      cmd:  `miner-cli submit \\
  --model.path ./my_model.onnx \\
  --hf.repo_id your-username/your-repo \\
  --wallet.name miner \\
  --wallet.hotkey default` },
    { step: 'Wait',
      note: 'Models become eligible ~30 days after commit. Daily evaluation at 18:00 UTC against newly-sold properties.' },
  ],

  envVars: [
    { name: 'WALLET',  description: 'Coldkey name (also passed via --wallet.name)', required: true },
    { name: 'HOTKEY',  description: 'Hotkey name (also passed via --wallet.hotkey)', required: true },
  ],

  scoring: {
    summary:
      'Daily evaluation at 18:00 UTC. Score = 1 − MAPE on properties listed and sold within the last 30 days (data that did NOT exist when you committed). Winner selection: best score defines the winner set (all models within ~0.3% / 0.003 of the best). Within the winner set, the EARLIEST on-chain commit wins. Winner gets 99% of emission; non-winners share 1% proportionally; detected duplicates earn 0%.',
    rule: 'Build a generalizing model — your test set is data the model could not have seen. Targets: MAPE < 15%, score > 0.85. To DISPLACE the current winner you must improve by more than the 0.3% threshold. Otherwise the original pioneer keeps winning — incremental copycats earn nothing.',
    cheatPath:
      "Don't try to leak future sales into training — the 30-day commit gap was designed to make this impossible. Don't clone the leader's weights — duplicate detection zeros copiers. Don't aim to tie the leader — same-score ties go to the EARLIER commit, so you must beat by > 0.3% to flip.",
  },

  profitability: {
    estimatedDailyEmissionPerUid: 0.0,
    tokenPriceUsdFallback: 284,
    capexNote: 'Winner-takes-all economics. If you are not the winner (or in the threshold ring around the winner with a pre-existing earlier commit), you earn ~1% / N. Plan for a tournament structure, not a steady-state yield.',
    notes:
      '99/1 split means most miners earn nearly nothing most of the time. Only commit if you have real edge on residential price modeling — otherwise this is a donation.',
  },

  milestones: [
    { day: 'day 1',  target: 'Hotkey registered, data sourcing pipeline up, first ONNX trained',
      note: 'Local `miner-cli evaluate` returns a reasonable MAPE (< 20%) on your held-out set.' },
    { day: 'day 7',  target: 'Polished model committed via miner-cli submit',
      note: 'Confirm on-chain commit and HF repo URL.' },
    { day: 'day 30', target: 'Model becomes eligible — first daily evaluation',
      note: 'Score appears on the dashboard. If outside the winner threshold, iterate and commit a new version (new 30-day clock).' },
  ],

  monitoring: [
    { metric: 'Local MAPE on held-out set',          threshold: '< 15%',   where: 'miner-cli evaluate' },
    { metric: 'Score gap to current winner',          threshold: '> 0.003 to flip',  where: 'dashboard.resilabs.ai' },
    { metric: 'Days since commit',                    threshold: '> 30 to be evaluated', where: 'on-chain metadata' },
    { metric: 'Duplicate-detection status',           threshold: 'clean',   where: 'validator logs / W&B' },
  ],

  knownIssues: [
    {
      symptom: 'Submitted model but no score for 30 days',
      cause:   'By design — evaluation uses sales data that did not exist at commit time. The 30-day window is the anti-overfit barrier.',
      fix:     'Patience. Use the wait to train your next iteration.',
    },
    {
      symptom: 'Score matches the winner but you earn 0',
      cause:   'Tie-break goes to the EARLIEST commit; you are not first.',
      fix:     'Improve by more than 0.3% (threshold) to displace the leader. Or accept that as a follower you earn from the 1% pool.',
    },
    {
      symptom: 'Duplicate-detection flagged your model',
      cause:   'Model fingerprint too close to another miner\'s submission.',
      fix:     'Train from scratch with different data, architecture, or feature engineering. Copying is detected and zeroed.',
    },
    {
      symptom: 'Accidentally cloned the OLD archived repo (resi-labs-ai/resi)',
      cause:   'Old repo focused on data collection / scraping — different paradigm.',
      fix:     'Use resi-labs-ai/resi-models. The data-collection model was sunset in 2026.',
    },
  ],

  notes: [
    'Subnet pivoted from "data collection" (archived resi repo) to "model commits" (resi-models). Old miner playbooks are obsolete.',
    'Winner-takes-all + commit-time tiebreaker means pioneers retain their seat unless someone improves by > 0.3%. Plan to challenge the leader, not match them.',
    'Training data sourcing is YOUR problem — the subnet doesn\'t provide it.',
  ],
};
