import type { RichPlaybook } from '../playbook-rich';

// SN21 — AdTAO / Impact Prediction Subnet (ippcteam/SN21-adtao).
// Source: ippcteam/SN21-adtao README + docs/miner_quickstart.md + min_compute.yml (2026-06).
// Note: this is a prediction-market subnet (P10/P50/P90 distributions over Google
// Ads campaign deltas) — not a "live optimization agent that edits campaigns".

export const sn21: RichPlaybook = {
  slug: '21-adtao',
  netuid: 21,
  name: 'AdTAO',
  category: 'reason',
  categoryLabel: 'Prediction · Google Ads outcomes',

  blurb:
    'SN21 — Impact Prediction Subnet. Miners submit P10/P50/P90 distributions over 7-day and 14-day Google Ads campaign deltas (budget / bid-strategy / target / pause). Validators score against measured outcomes via pinball loss + calibration + directional + Brier. Predictions are sealed on chain via timelock encryption before the outcome is knowable.',

  whatMinersDo:
    "A miner receives a structured episode — episode metadata, account state, 60-day pre-window, action bundle, campaign metadata — and outputs P10/P50/P90 distributions per (campaign × horizon). The miner signs predictions with an ed25519 key (`inner_sig`), AES-GCM-encrypts them, timelock-encrypts the AES key to a future drand round, then commits the ciphertext SHA + key + archive URL on chain. After the timelock reveals, validators decrypt, run an 8-check scoreability rule, and score the prediction against measured outcomes.",

  verifiedAt: '2026-06-01',
  verifiedBy: '@editorial',

  emission: '— τ/day',
  burnCostFallback: '— τ',
  minerCountFallback: 0,
  slotCap: 256,

  hardware: [
    {
      role: 'Miner CPU box',
      count: '1',
      cpuCores: 4,
      ramGb: 8,
      diskGb: 20,
      bandwidth: '100 Mbps down / 20 Mbps up',
      notes: 'Per min_compute.yml: 2-core / 4 GB min, 4-core / 8 GB recommended. The reference baseline runs on CPU; GPU is only useful if you train a heavier model on your own infra.',
    },
  ],
  hardwareNote:
    'No GPU requirement for the reference baseline — this is a calibrated-prediction subnet, not an inference subnet. Heavier custom models (XGBoost / gradient-boost / small transformers) may benefit from GPU during training only.',

  rentalOk: true,
  rentalUsdPerHr: { lambda: 0.10, runpod: 0.08, coreweave: 0.12 },

  repo: {
    url: 'https://github.com/ippcteam/SN21-adtao',
    branch: 'main',
    minerEntrypoint: 'hope/miner/ + scripts/score_predictions.py',
    extraRepos: [
      { name: 'docs/whitepaper.md', url: 'https://github.com/ippcteam/SN21-adtao/blob/main/docs/whitepaper.md', purpose: 'Protocol design + trust model + adversarial matrix' },
      { name: 'docs/miner_quickstart.md', url: 'https://github.com/ippcteam/SN21-adtao/blob/main/docs/miner_quickstart.md', purpose: 'Step-by-step miner onboarding' },
      { name: 'reward spec', url: 'https://github.com/ippcteam/SN21-adtao/blob/main/docs/SN21_REWARD_MECHANISM.md', purpose: 'Full reward / tier / EMA spec' },
    ],
  },

  setupShape: 'simple-binary',
  setupOverview:
    'Python package install (`pip install -e ".[miner]"`) + one-time ed25519 key generation for the inner_sig commitment + standard btcli registration. The reference miner is a baseline XGBoost-style model; the protocol enforces signed + timelock-encrypted commits via drand.',

  install: [
    { step: 'Clone the repo + install',
      cmd:  'git clone https://github.com/ippcteam/SN21-adtao.git && cd SN21-adtao && pip install -e ".[miner]"' },
    { step: 'Create a Bittensor wallet (one-time)',
      cmd:  'btcli wallet new_coldkey --wallet.name my_miner && btcli wallet new_hotkey --wallet.name my_miner --wallet.hotkey default' },
    { step: 'Register on testnet (open environment, netuid 466)',
      cmd:  'btcli subnet register --netuid 466 --wallet.name my_miner --wallet.hotkey default --subtensor.network test',
      note: 'For mainnet swap `test` → `finney` and `466` → `21`.' },
    { step: 'Generate ed25519 key for inner_sig',
      cmd:  'python scripts/sn21_keys.py generate --role miner --output ~/sn21-miner.pem',
      note: 'Separate from the Bittensor wallet hotkey; used to sign prediction blobs.' },
    { step: 'Register the hotkey ↔ ed25519 binding on chain',
      cmd:  'python scripts/sn21_keys.py register --role miner --network test --netuid 466 --wallet-name my_miner --wallet-hotkey default',
      note: 'One-time on-chain binding required before submitting predictions.' },
  ],

  runSteps: [
    { step: 'Run the reference miner',
      note: 'Per docs/miner_quickstart.md — the miner runner polls for new episodes, calls the model, signs + timelock-encrypts the predictions, and commits on chain.' },
    { step: 'Train your own model (optional, recommended)',
      cmd:  'python scripts/train_example_model.py',
      note: 'Reference XGBoost training scaffold lives in scripts/.' },
    { step: 'Verify any past epoch',
      cmd:  'python scripts/verify_epoch.py',
      note: 'Public verifier — reads the chain, fetches off-chain artifacts, re-runs scoring code. Use it on your own commits to confirm scoring.' },
  ],

  envVars: [
    { name: 'WALLET',     description: 'Coldkey name (matches btcli wallet list)',                                                    required: true },
    { name: 'HOTKEY',     description: 'Hotkey name on that coldkey',                                                                  required: true },
    { name: 'SN21_ED25519_KEY', description: 'Path to the ed25519 PEM generated by sn21_keys.py (used for inner_sig on predictions)',  required: true },
  ],

  scoring: {
    summary:
      'Four components combine into one micro-units score per miner per epoch: Quantile accuracy 50% (pinball loss / CRPS on P10/P50/P90), Calibration 20% (interval coverage with convex width penalty), Directional 15% (sign match on the primary goal metric), Goal accuracy 15% (Brier score on goal-miss probability). Null-prediction penalty up to 60% reduction. Skill-score gate: must beat a conditional-prior baseline or earn zero emission.',
    rule: 'Output calibrated P10/P50/P90 distributions that beat the conditional-prior baseline, with covered intervals that are not unnecessarily wide.',
    sourcePath: 'ippcteam/SN21-adtao · hope/scoring/ (pure Python, no Bittensor dependency)',
    cheatPath:
      "Returning near-zero predictions to dodge loss → null-penalty up to −60%. Returning ultra-wide intervals to game calibration → convex width penalty crushes the score. Trying to rewrite predictions after seeing the outcome → impossible; predictions are AES-encrypted before the outcome and the AES key is timelock-encrypted to a future drand round. Replays / late submissions are detectable from chain state alone.",
  },

  profitability: {
    estimatedDailyEmissionPerUid: 0.0,
    tokenPriceUsdFallback: 284,
    capexNote:
      'No GPU capex required. The economic input is forecasting model quality + data engineering on the 60-day pre-window + action-bundle features. At launch the default runner uses simple score-normalization with a 95% burn to UID 0; tiered allocator (Elite floor, pool shares, EMA tier placement) is implemented but opt-in until Review 1.',
  },

  milestones: [
    { day: 'day 1',  target: 'Reference baseline running on testnet 466',
      note: 'Use the test environment first — netuid 466. Confirm predictions are committed on chain with inner_sig + TLE key.' },
    { day: 'day 3',  target: 'Skill-score above baseline',
      note: 'You earn zero emission below the conditional-prior baseline — the first real goal is beating it.' },
    { day: 'day 7',  target: 'Calibration component > 0.5',
      note: 'Coverage of P10–P90 intervals at the target rate without ballooning width.' },
    { day: 'day 14', target: 'Mainnet (netuid 21) registration + first epoch',
      note: 'Swap `test` → `finney` and `466` → `21` after the testnet flow is clean.' },
  ],

  monitoring: [
    { metric: 'Pinball loss (P10/P50/P90)', threshold: 'beat baseline',  where: 'scripts/verify_epoch.py on your own commits' },
    { metric: 'Interval coverage',           threshold: '≈ target rate', where: 'scripts/verify_epoch.py' },
    { metric: 'Skill score vs baseline',     threshold: '> 0',           where: 'scripts/verify_epoch.py · zero emission if ≤ 0' },
    { metric: 'On-chain submission integrity', threshold: '100%',        where: 'Chain Merkle root + IMT verification' },
  ],

  knownIssues: [
    {
      symptom: 'Predictions get null-penalized hard',
      cause:   'Model is returning near-zero deltas for safety — the null-penalty applies up to −60%.',
      fix:     'Take a real position; even imperfect non-null predictions beat near-zero ones because the null-penalty dominates.',
    },
    {
      symptom: 'Below skill-score gate → zero emission',
      cause:   'Your model is not beating the conditional-prior baseline on the published action types.',
      fix:     'Train on 10 sample episodes in data/training/ and on the release archives; use the reference XGBoost scaffold as a starting point.',
    },
    {
      symptom: 'inner_sig verification fails on chain',
      cause:   'ed25519 key not bound to the hotkey via sn21_keys.py register, or signing path uses the wrong key.',
      fix:     'Re-run `python scripts/sn21_keys.py register` and confirm the PEM path matches what the miner runner reads.',
    },
    {
      symptom: 'Validator scoring disagrees with my local scoring',
      cause:   'Stale code or scoring drift.',
      fix:     'Run scripts/verify_epoch.py against the same epoch — the verifier is the authoritative re-run path. If it confirms the validator, your local code is stale.',
    },
  ],

  notes: [
    'This subnet is operated by ippcteam (Impact Prediction Protocol). It is a prediction-market subnet — not a "live Google Ads optimizer" — even though it covers Google Ads campaign outcomes.',
    'Predictions are AES-GCM-encrypted, the AES key is timelock-encrypted to a future drand round, ciphertext SHA + key + archive URL are committed on chain → predictions cannot be rewritten post-outcome.',
    'A shadow validator runs the same scoring code on a separate hotkey and commits its own artifacts; mismatches are publicly auditable via the verifier.',
    'The earlier "PPC Rebel / Rob Warner" framing (live PPC agent) appears in some materials, but the on-chain SN21 codebase published as ippcteam/SN21-adtao is the verifiable prediction-market protocol described above.',
  ],
};
