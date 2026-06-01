import type { RichPlaybook } from '../playbook-rich';

// SN126 — Poker44. Bot-detection benchmark for online poker.
// Miner runs `python neurons/miner.py`, receives DetectionSynapse(chunks=...),
// returns per-chunk bot-risk scores. Validators evaluate against ground-truth
// labels from the Arena gameplay layer. PM2-managed.

export const sn126: RichPlaybook = {
  slug: '126-poker44',
  netuid: 126,
  name: 'Poker44',
  category: 'reason',
  categoryLabel: 'Anti-cheat · classification',

  blurb:
    'Bot-detection benchmark for online poker. Miners run `neurons/miner.py`, receive DetectionSynapse hand chunks, and return per-chunk bot-risk scores. Validators grade against ground-truth labels from the Arena gameplay layer over rolling 6h windows inside 72h epochs.',

  whatMinersDo:
    "A Poker44 miner runs `neurons/miner.py` against SN126. Validators send DetectionSynapse(chunks=...) payloads — each chunk contains one or more poker hands with metadata, players, streets, actions, and outcome but no labels. The miner returns risk_scores: a list of floats in [0, 1] (one per chunk), optionally with predictions (booleans) and a model_manifest. Convention: low score = human, high score = bot. Validators replay against the held-out labels and score on AUC / precision-recall.",

  verifiedAt: '2026-06-01',
  verifiedBy: '@editorial',

  emission: '— τ/day',
  burnCostFallback: '— τ',
  minerCountFallback: 0,
  slotCap: 256,

  hardware: [
    {
      role: 'Miner node',
      count: '1',
      gpu: 'Optional consumer GPU (e.g. 3090/4090)',
      vramGb: 24,
      cpuCores: 8,
      ramGb: 32,
      diskGb: 200,
      bandwidth: 'public IP · port 8091 (or chosen --axon.port) open',
      notes: 'Sequence-model inference on hand chunks. CPU-only is workable for small models; GPU helps for transformer-class detectors. Disk is mostly historical hand data + model checkpoints.',
    },
  ],
  hardwareNote:
    "Hardware is model-dependent. The miner machine answers validator queries — keep latency low (well under the synapse deadline). Most miners run training on a separate beefier box and only deploy the trained model to the live miner.",

  rentalOk: true,
  rentalUsdPerHr: { lambda: 0.79, runpod: 0.69, coreweave: 0.85 },

  repo: {
    url: 'https://github.com/Poker44/Poker44-subnet',
    branch: 'main',
    minerEntrypoint: 'neurons/miner.py',
  },

  setupShape: 'simple-binary',
  setupOverview:
    "Clone Poker44-subnet, set up a venv, install in editable mode plus bittensor-cli, register on SN126, then start the miner under PM2 via `scripts/miner/run/run_miner.sh` (or the direct python CLI). The script accepts WALLET_NAME / HOTKEY / AXON_PORT / ALLOWED_VALIDATOR_HOTKEYS via env.",

  install: [
    { step: 'Clone the repo',
      cmd:  'git clone https://github.com/Poker44/Poker44-subnet && cd Poker44-subnet' },
    { step: 'Create and activate venv',
      cmd:  'python3 -m venv .venv && source .venv/bin/activate' },
    { step: 'Install deps',
      cmd:  'pip install -r requirements.txt && pip install -e . && pip install bittensor-cli' },
    { step: 'Quick setup script (optional)',
      cmd:  './scripts/miner/setup.sh',
      note: 'Convenience wrapper that does the venv + install above.' },
    { step: 'Create wallet + register',
      cmd: `btcli wallet new_coldkey --wallet.name my_cold && \\
btcli wallet new_hotkey --wallet.name my_cold --wallet.hotkey my_poker44_hotkey && \\
btcli subnet register --wallet.name my_cold --wallet.hotkey my_poker44_hotkey \\
  --netuid 126 --subtensor.network finney`,
      note: 'Re-check burn cost on taostats.io/subnets/126 immediately before registering.' },
    { step: 'Install PM2',
      cmd:  'npm install -g pm2',
      note: 'Documented process manager for run + monitoring.' },
  ],

  runSteps: [
    { step: 'Run via the documented script',
      cmd: `WALLET_NAME=my_cold HOTKEY=my_poker44_hotkey AXON_PORT=8091 \\
ALLOWED_VALIDATOR_HOTKEYS="<validator_hotkey_1> <validator_hotkey_2>" \\
./scripts/miner/run/run_miner.sh`,
      note: 'Recommended path — sets env and launches the miner under PM2.' },
    { step: 'Or run directly via Python',
      cmd: `python neurons/miner.py --netuid 126 --wallet.name my_cold \\
  --wallet.hotkey my_poker44_hotkey --subtensor.network finney \\
  --axon.port 8091 --blacklist.allowed_validator_hotkeys <hotkey1> <hotkey2>`,
      note: 'Use --blacklist.allowed_validator_hotkeys to whitelist known validators.' },
    { step: 'Watch logs',
      cmd:  'pm2 logs poker44_miner',
      note: 'You should see DetectionSynapse queries arriving each tempo (~72 min).' },
    { step: 'Verify on the metagraph',
      cmd:  'btcli subnet metagraph --netuid 126',
      note: "Confirm UID, axon serving, and incentive accruing." },
  ],

  envVars: [
    { name: 'WALLET_NAME',                 description: 'Coldkey wallet name',                                    required: true },
    { name: 'HOTKEY',                      description: 'Hotkey name',                                            required: true },
    { name: 'AXON_PORT',                   description: 'Axon port (default 8091)',                               required: true },
    { name: 'ALLOWED_VALIDATOR_HOTKEYS',   description: 'Space-separated validator hotkeys to accept queries from', required: false },
  ],

  scoring: {
    summary:
      "Competition epochs run for 72h with canonical evaluation windows of 6h. Validators pull live hands from the Poker44 Arena, ask miners to score per-chunk bot risk, and grade returns on AUC / precision-recall vs. ground-truth labels. Models that overfit to last month's bot signatures lose weight as Arena keeps generating fresh, drifting gameplay.",
    rule: 'Return per-chunk bot-risk probabilities that match ground-truth labels across evolving playstyles.',
    cheatPath:
      "Hard-coding 'always bot' or 'always human' fails AUC immediately. Memorising labelled chunks fails because validators rotate fresh 6h windows. The harder attack is fitting to a single bot vendor's signature and missing the rest — Arena sources diverse bot operators to mitigate that.",
  },

  profitability: {
    estimatedDailyEmissionPerUid: 0.0,
    tokenPriceUsdFallback: 284,
    capexNote:
      'Capex is modest — a single consumer GPU or a beefy CPU box is enough for inference. Training cost depends on how aggressive your sequence-model is.',
    notes:
      'The Arena data flywheel is the moat — miners who tap into the freshest labelled hands and retrain often will outscore static detectors. Treat this as a continuous-learning problem, not a one-shot model.',
  },

  milestones: [
    { day: 'day 1',  target: 'Axon serving on chosen port',
      note: 'pm2 logs shows queries arriving. UID assigned.' },
    { day: 'day 3',  target: 'First non-zero incentive',
      note: 'risk_scores returning with correct count == chunk count. If incentive is 0, check that responses are valid and within the synapse deadline.' },
    { day: 'day 7',  target: 'Out of immunity, surviving',
      note: 'AUC above the floor. If still bottom-decile, your detector likely overfits to a narrow playstyle — broaden training data.' },
    { day: 'day 14', target: 'Cross-epoch stability',
      note: 'Score holds across at least one full 72h epoch. Drift starts to matter — schedule retraining cadence.' },
    { day: 'day 30', target: 'Continuous-learning loop online',
      note: 'You retrain weekly or better against the latest Arena windows. Static models start to bleed weight here.' },
  ],

  monitoring: [
    { metric: 'Axon reachability',           threshold: '100%',          where: 'curl http://<miner-ip>:<axon-port>/ from outside' },
    { metric: 'Synapse response latency',    threshold: '< deadline',    where: 'pm2 logs poker44_miner' },
    { metric: 'risk_scores count integrity', threshold: '== chunk count',where: 'Validator-side rejection log if mismatched' },
    { metric: 'Per-tempo incentive',         threshold: 'rising or flat',where: 'btcli subnet metagraph --netuid 126' },
  ],

  knownIssues: [
    {
      symptom: 'risk_scores length mismatch → all responses rejected',
      cause:   "Your miner returns N-1 or N+1 scores for a chunk list of length N.",
      fix:     'Assert len(risk_scores) == len(synapse.chunks) before returning. This is the most common silent failure.',
    },
    {
      symptom: 'Validator queries arrive but no incentive',
      cause:   "Responses come back too late — beyond the synapse deadline — so validators discard them.",
      fix:     'Quantise the model, batch inference across chunks, and benchmark single-query latency well under the deadline.',
    },
    {
      symptom: 'Incentive collapses after a few weeks',
      cause:   "Static detector — bots have evolved past your training distribution.",
      fix:     'Schedule periodic retraining against the latest Arena windows. Consider an online-learning component.',
    },
    {
      symptom: 'Validator queries never arrive',
      cause:   "Axon port closed at the cloud firewall, or your hotkey not in any validator's allowlist.",
      fix:     'Open the axon port. Verify ALLOWED_VALIDATOR_HOTKEYS includes the validators currently issuing queries (check taostats for active validators).',
    },
  ],

  notes: [
    'Project framing is "security infrastructure, not a poker room" — Arena exists to generate labelled data for the detector. Treat the subnet as anti-cheat R&D.',
    'Returning predictions (boolean) and model_manifest (dict) alongside risk_scores is recommended even though only risk_scores is strictly required.',
    'AUC + precision-recall scoring means calibration matters — uncalibrated probabilities (e.g. always 0.5) lose to a well-calibrated detector even if both have similar accuracy.',
  ],
};
