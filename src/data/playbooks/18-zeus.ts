import type { RichPlaybook } from '../playbook-rich';

// SN18 — Zeus (Orpheus AI). Weather forecasting. Validators replay ERA5
// atmospheric snapshots; miners commit a hashed prediction, then reveal a
// tensor of shape (requested_hours, 721, 1440). Scored by lower-is-better
// (RMSE + MAE)/2.

export const sn18: RichPlaybook = {
  slug: '18-zeus',
  netuid: 18,
  name: 'Zeus',
  category: 'compute',
  categoryLabel: 'Weather forecasting',

  blurb:
    'Forecast atmospheric variables from ERA5 snapshots. Two-phase commit/reveal: hash your prediction tensor, then reveal a (hours, 721, 1440) grid; score is (RMSE + MAE)/2.',

  whatMinersDo:
    "A Zeus miner answers two synapse types per challenge: HashedTimePredictionSynapse during the commit phase (hash of your tensor + hotkey-bound encoding) and TimePredictionSynapse during the reveal phase, returning a (requested_hours, 721, 1440) tensor of predicted atmospheric variables. Validators withhold an ERA5 initial state, broadcast it, then grade your reveal against held-out ground truth — lower (RMSE + MAE)/2 wins emission, with latitude-based weighting for global coverage.",

  verifiedAt: '2026-06-01',
  verifiedBy: '@editorial',

  emission: '— τ/day',
  burnCostFallback: '— τ',
  minerCountFallback: 0,
  slotCap: 256,

  hardware: [
    {
      role: 'GPU miner node',
      count: '1',
      gpu: 'RTX 4090 (24 GB) or A6000/A100 (recommended for training)',
      vramGb: 24,
      cpuCores: 16,
      ramGb: 64,
      diskGb: 500,
      bandwidth: '1 Gbps',
      notes: 'GPU is required for training a forecast model; inference itself can run on smaller hardware. Disk holds ERA5 caches and model weights.',
    },
  ],
  hardwareNote:
    "Subnet is small (~25 miners, ~11 validators reported early 2026). Climatology baselines are well-defined — beating them needs a real model, not a heuristic.",

  rentalOk: true,
  rentalUsdPerHr: { lambda: 0.69, runpod: 0.59 },

  repo: {
    url: 'https://github.com/Orpheus-AI/Zeus',
    branch: 'main',
    minerEntrypoint: 'neurons/miner.py',
  },

  setupShape: 'simple-binary',
  setupOverview:
    "Conda env (python 3.11), run `setup.sh`, fill `miner.env`, then launch with `./start_miner.sh`. The default miner produces a baseline forecast; to actually earn you replace the prediction logic with a trained model.",

  install: [
    { step: 'Clone the Zeus repo',
      cmd:  'git clone https://github.com/Orpheus-AI/Zeus.git && cd Zeus' },
    { step: 'Create the conda env',
      cmd:  'conda create -y -n zeus python=3.11 && conda activate zeus' },
    { step: 'Run the setup script',
      cmd:  'chmod +x setup.sh && ./setup.sh' },
    { step: 'Fill miner.env with required variables',
      note: 'NETUID=18, SUBTENSOR_NETWORK=finney, WALLET_NAME, WALLET_HOTKEY, AXON_PORT, BLACKLIST_FORCE_VALIDATOR_PERMIT=True.' },
    { step: 'Open the axon port at your firewall',
      cmd:  'curl http://<your_ip>:$AXON_PORT',
      note: 'Should not 100% drop — validators need to reach you.' },
    { step: 'Register the hotkey on SN18',
      cmd:  'btcli subnet register --netuid 18 --wallet.name $WALLET_NAME --wallet.hotkey $WALLET_HOTKEY' },
  ],

  runSteps: [
    { step: 'Activate env and launch the miner',
      cmd:  'conda activate zeus && ./start_miner.sh' },
    { step: 'Confirm it answers both synapses',
      note: 'Logs should show HashedTimePredictionSynapse calls (commit) and TimePredictionSynapse calls (reveal) once a challenge starts.' },
  ],

  envVars: [
    { name: 'NETUID',                          description: '18 for mainnet, 301 for testnet',                                required: true },
    { name: 'SUBTENSOR_NETWORK',               description: 'finney or test',                                                 required: true },
    { name: 'WALLET_NAME',                     description: 'Coldkey name',                                                   required: true },
    { name: 'WALLET_HOTKEY',                   description: 'Hotkey name registered on netuid 18',                            required: true },
    { name: 'AXON_PORT',                       description: 'Public TCP port the validator hits — must be open externally',   required: true },
    { name: 'BLACKLIST_FORCE_VALIDATOR_PERMIT',description: 'True — only accept requests from validators with permits',       required: true },
  ],

  scoring: {
    summary:
      "Each tempo the validator picks a withheld initial atmospheric state from ERA5 reanalysis, broadcasts it, and grades your prediction tensor against held-out ground truth. Score is (RMSE + MAE)/2 — lower is better. Latitude-based weighting balances global coverage. Higher accuracy than the validator-side median earns emission; climatology baselines and stale snapshots score near zero.",
    rule: '(RMSE + MAE)/2 against ERA5 ground truth, latitude-weighted; lower is better.',
    sourcePath: 'Orpheus-AI/Zeus · docs/ScoringChallengesCalculatingWeights.ipynb',
    cheatPath:
      "Returning climatology averages scores at the median — emission is near zero. Tensor of wrong shape (must be (requested_hours, 721, 1440)) is penalised. Non-finite values trigger penalties. Hash mismatch between commit and reveal voids the round.",
  },

  profitability: {
    estimatedDailyEmissionPerUid: 0,
    tokenPriceUsdFallback: 284,
    capexNote:
      "Capex is modest if you already have a forecast model. The real cost is training time on ERA5 to actually beat climatology — without that, miners get the floor.",
    notes:
      "Small subnet, focused leaderboard. Top miners usually run a custom-trained neural forecaster (graph-net / transformer on ERA5).",
  },

  milestones: [
    { day: 'day 1', target: 'Both synapses answered, no shape errors', note: 'Logs show commit + reveal completing for the first challenge.' },
    { day: 'day 3', target: 'Score better than climatology baseline', note: 'If you cannot beat climatology, swap the prediction module — emissions will not climb.' },
    { day: 'day 7', target: 'Above-median rank', note: 'Compare your (RMSE+MAE)/2 to the validator-side median visible in logs.' },
    { day: 'day 14', target: 'Out of immunity, holding above the floor', note: 'Continued model retraining each week to chase top-decile miners.' },
  ],

  monitoring: [
    { metric: 'Commit/reveal pairing rate',    threshold: '100%',         where: 'miner.py logs · paired synapse counters' },
    { metric: 'Tensor shape errors',           threshold: '0',            where: 'miner.py logs · shape assertions' },
    { metric: 'Hash verification successes',   threshold: '100%',         where: 'miner.py logs · "hash verified"' },
    { metric: '(RMSE + MAE)/2 vs median',      threshold: 'below median', where: 'validator logs / dashboard if exposed' },
    { metric: 'Incentive per tempo',           threshold: 'rising or flat', where: 'btcli subnet metagraph --netuid 18' },
  ],

  knownIssues: [
    {
      symptom: 'Hash verification fails between commit and reveal',
      cause:   'Compressed data or hotkey encoding differs between the two synapses (e.g. different float precision).',
      fix:     'Use the same encoder for both phases. Keep the tensor dtype and byte order stable. See docs/Mining.md.',
    },
    {
      symptom: 'Tensor shape mismatch penalty',
      cause:   'Returned a tensor that is not (requested_hours, 721, 1440).',
      fix:     'Always shape to the validator-requested hours dimension; lat × lon are fixed at 721 × 1440.',
    },
    {
      symptom: 'Non-finite values in prediction',
      cause:   'Model produced NaN/Inf (gradient blow-up, division by zero).',
      fix:     'Add a finite-check before sending and fall back to climatology rather than NaNs.',
    },
    {
      symptom: 'Validator never reaches the axon',
      cause:   'AXON_PORT not open externally, or BLACKLIST_FORCE_VALIDATOR_PERMIT incorrectly excluding live validators.',
      fix:     'Open the port at the cloud firewall and verify with `curl http://<ip>:<port>` from another network. Re-check the validator permit gating.',
    },
  ],

  notes: [
    'Repo: https://github.com/Orpheus-AI/Zeus. Mining guide: docs/Mining.md. Scoring notebook: docs/ScoringChallengesCalculatingWeights.ipynb.',
    'ERA5 reanalysis is the ground-truth source — be aware of its lag (~5 days for the operational stream).',
    'Last meaningful repo commit was around 2025·12 — catalog has been stable into 2026.',
    "Validators check both short-range (48h) and long-range (360h) horizons; you need to perform on both.",
  ],
};
