import type { RichPlaybook } from '../playbook-rich';

// SN72 — StreetVision by NATIX. Operated by NATIX Network (Berlin).
// Binary roadwork classifiers trained on NATIX dashcam fleet footage. Models
// submitted to Hugging Face, scored by validators on held-out splits.

export const sn72: RichPlaybook = {
  slug: '72-streetvision-by-natix',
  netuid: 72,
  name: 'StreetVision by NATIX',
  category: 'vision',
  categoryLabel: 'Vision',

  blurb:
    'Physical-AI vision tournament tied to a 250k-driver NATIX dashcam fleet. Miners train binary image/video classifiers (initial focus: roadwork detection) and serve them via a local detector backend on netuid 72.',

  whatMinersDo:
    'A StreetVision miner publishes a roadwork-detection classifier — a binary head returning a float in [0,1], where >0.5 means roadwork. Models are submitted to Hugging Face (NATIX Network org). Each model has a 90-day full-reward window after submission; reward then decays, pushing miners to retrain and resubmit. The miner process itself (`neurons/miner.py`, launched via `start_miner.sh`) loads the configured image/video detector backend and serves inference on the validator-issued footage.',

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
      gpu: '1× GPU recommended for training (optional for inference)',
      vramGb: 16,
      cpuCores: 8,
      ramGb: 16,
      diskGb: 100,
      bandwidth: 'Stable to validators; local Subtensor recommended',
      notes: 'Inference is light enough for CPU on small models. Training a competitive detector benefits from a single mid-range GPU.',
    },
  ],
  hardwareNote:
    'Hardware floor lives in `min_compute.yml`; specs above are practical defaults. Running your own local Subtensor reduces outages on the miner side.',

  rentalOk: true,
  rentalUsdPerHr: { lambda: 0.50, runpod: 0.40, coreweave: 0.60 },

  repo: {
    url: 'https://github.com/natixnetwork/streetvision-subnet',
    branch: 'main',
    minerEntrypoint: 'neurons/miner.py',
  },

  setupShape: 'simple-binary',
  setupOverview:
    'Clone the repo, create a Python 3.11 venv, install with the `[miner]` extras, register on netuid 72, configure the detector env vars, then run `./start_miner.sh`. Model artefacts live on Hugging Face under NATIX Network org; the local miner process loads them via the IMAGE_DETECTOR / VIDEO_DETECTOR config.',

  install: [
    { step: 'Clone repo',
      cmd: 'git clone https://github.com/natixnetwork/streetvision-subnet.git && cd streetvision-subnet',
      note: 'Repo originally referenced as natix-subnet; same project.' },
    { step: 'Create Python 3.11 venv',
      cmd: 'python3.11 -m venv venv && source venv/bin/activate' },
    { step: 'Install miner extras',
      cmd: 'pip install -e ".[miner]"' },
    { step: 'Register on subnet',
      cmd: 'btcli subnet register --netuid 72 --wallet.name $WALLET --wallet.hotkey $HOTKEY' },
    { step: 'Submit at least one model',
      note: 'Miner must have a registered hotkey AND have submitted at least one model on Hugging Face to participate in scoring.' },
  ],

  runSteps: [
    { step: 'Make starter executable + run',
      cmd: 'chmod +x ./start_miner.sh && ./start_miner.sh' },
    { step: 'Manual launch (alternative)',
      cmd: 'python neurons/miner.py --netuid 72 --wallet.name $WALLET --wallet.hotkey $HOTKEY --axon.port $MINER_AXON_PORT' },
  ],

  envVars: [
    { name: 'WALLET',                 description: 'Coldkey name',                                                  required: true },
    { name: 'HOTKEY',                 description: 'Hotkey name',                                                   required: true },
    { name: 'NETUID',                 description: '72 mainnet (323 testnet)',                                      required: true },
    { name: 'SUBTENSOR_NETWORK',      description: 'finney / test / local',                                         required: true },
    { name: 'MINER_AXON_PORT',        description: 'Axon port the miner listens on',                                required: true },
    { name: 'IMAGE_DETECTOR',         description: 'Image detector backend identifier',                             required: true },
    { name: 'IMAGE_DETECTOR_CONFIG',  description: 'Path/config for image detector',                                required: true },
    { name: 'IMAGE_DETECTOR_DEVICE',  description: '`cpu` or `cuda`',                                               required: true },
    { name: 'VIDEO_DETECTOR',         description: 'Video detector backend identifier',                             required: false },
    { name: 'VIDEO_DETECTOR_CONFIG',  description: 'Path/config for video detector',                                required: false },
    { name: 'VIDEO_DETECTOR_DEVICE',  description: '`cpu` or `cuda`',                                               required: false },
  ],

  scoring: {
    summary:
      'Validators score binary roadwork classifiers (float in [0,1], threshold 0.5) on held-out NATIX driver-fleet footage. Each submitted Hugging Face model gets a 90-day full-reward window from submission; reward then decays over time, incentivizing regular retraining and resubmission.',
    rule: 'Highest accuracy (F1 / precision-recall) on validator-held NATIX driving footage, modulated by the 90-day freshness window.',
    sourcePath: 'natixnetwork/streetvision-subnet · docs/mining.md + docs/incentive.md',
    cheatPath:
      'Overfitting to public driving datasets (BDD100K, Mapillary) or scraping validator inputs fails on the held-out NATIX split, which is drawn fresh from the live driver fleet. The 90-day decay also penalises miners who submit once and walk away.',
  },

  profitability: {
    estimatedDailyEmissionPerUid: 0.0,
    tokenPriceUsdFallback: 284,
    capexNote: 'Capex-light. Training can be done on a single rented GPU per refresh cycle; inference can run CPU-only for the binary head.',
  },

  milestones: [
    { day: 'day 1',  target: 'Miner running + first model on HF', note: 'Registered, axon up, at least one model uploaded to NATIX Network HF org.' },
    { day: 'day 7',  target: 'Incentive rising',                  note: 'btcli metagraph --netuid 72 shows your UID with non-zero incentive.' },
    { day: 'day 30', target: 'Top-half on held-out split',        note: 'Tune augmentation / architecture; consult docs/incentive.md for class-balance and metric weights.' },
    { day: 'day 60', target: 'Schedule retrain cadence',          note: 'Decay starts after day 90; plan a fresh model submission by day 75 to avoid revenue dip.' },
  ],

  monitoring: [
    { metric: 'Model age',                  threshold: '< 90 days',       where: 'Hugging Face submission timestamp' },
    { metric: 'Held-out F1',                threshold: 'rising',          where: 'Discord channel updates / validator logs' },
    { metric: 'Axon reachability',          threshold: '100%',            where: 'External `curl <miner-ip>:<axon-port>`' },
    { metric: 'Per-tempo incentive',        threshold: 'rising or flat',  where: 'btcli subnet metagraph --netuid 72' },
  ],

  knownIssues: [
    {
      symptom: 'No scoring after submission',
      cause:   'Hotkey registered but no model on HF, or model name not discoverable.',
      fix:     'Confirm the model is in NATIX Network HF org and the metadata points to your hotkey.',
    },
    {
      symptom: 'Reward decaying unexpectedly',
      cause:   'Model is past its 90-day full-reward window.',
      fix:     'Retrain and submit a fresh model — keep a 75-day refresh cadence to stay inside the full-reward window.',
    },
    {
      symptom: 'Outages / missed scoring windows',
      cause:   'Public Subtensor RPC flakiness.',
      fix:     'Run your own Subtensor node locally and point the miner at it (SUBTENSOR_NETWORK=local).',
    },
  ],

  notes: [
    'Initial task: binary roadwork detection. Roadmap expands to potholes, signage, litter, and edge-case scenario classification.',
    'Best models are redeployed to the NATIX edge fleet (smartphones, dashcams) for real-time inference — the loop is sense → train → deploy.',
    'Discord is the primary support channel; docs/mining.md and docs/incentive.md hold the canonical scoring details.',
  ],
};
