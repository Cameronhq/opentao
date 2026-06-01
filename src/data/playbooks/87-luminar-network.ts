import type { RichPlaybook } from '../playbook-rich';

// SN87 — Luminar Network. Decentralized AI video-forensics engine on
// Bittensor — CCTV / incident submissions in, structured forensic outputs
// (anomalies, events, timestamps) out. Validators score on precision/recall
// vs annotated ground truth, with hallucinations punished more than misses.
// No public miner GitHub repo URL surfaced reliably at time of writing;
// playbook is a structural scaffold pending operator disclosure.

export const sn87: RichPlaybook = {
  slug: '87-luminar-network',
  netuid: 87,
  name: 'Luminar Network',
  category: 'vision',
  categoryLabel: 'Video Forensics',

  blurb:
    'Decentralized AI engine for video forensics — CCTV footage in, structured evidence out. Miners run forensic CV models and produce anomaly/event reports; validators score on precision-weighted detection accuracy.',

  whatMinersDo:
    'A Luminar miner runs forensic computer-vision models against CCTV clips or incident submissions sent by validators. The miner produces a structured report — anomalies detected, event chains, timestamps, supporting evidence frames — and returns it. Validators score against annotated ground truth, weighting precision higher than recall (false positives cost more than misses) so the network biases toward audit-grade outputs.',

  verifiedAt: '2026-06-01',
  verifiedBy: '@editorial',

  emission: '— τ/day',
  burnCostFallback: '— τ',
  minerCountFallback: 0,
  slotCap: 256,

  hardware: [
    {
      role: 'GPU node',
      count: '1',
      gpu: '1×RTX 4090 / A100 / L40S (object detection + temporal models)',
      vramGb: 24,
      cpuCores: 16,
      ramGb: 64,
      diskGb: 500,
      bandwidth: 'static public IP · open axon port',
      notes: 'CV pipeline is multi-frame — needs enough VRAM to hold detector + temporal model + a window of frames. 24GB VRAM is a comfortable floor.',
    },
  ],
  hardwareNote:
    'Storage matters — incoming clips and intermediate frames are not small. Plan for 500GB+ disk and consider attached object storage for retention.',

  rentalOk: true,
  rentalUsdPerHr: { lambda: 1.99, runpod: 1.89, coreweave: 2.10 },

  repo: {
    url: 'https://taostats.io/subnets/87/',
    branch: 'main',
  },

  setupShape: 'simple-binary',
  setupOverview:
    'A canonical public miner repo URL for SN87 was not surfaced through the usual GitHub search at time of writing — confirm the official repo on the Luminar Network site / Discord before installing anything. The typical Bittensor pattern is a neurons/miner.py axon wrapping a CV inference backend, configured with wallet and (optionally) S3-compatible storage for clip handling.',

  install: [
    { step: 'Locate the official miner repo', note: 'Confirm the canonical URL on the Luminar Network operator channels — do not install from unverified third-party forks.' },
    { step: 'Create wallet + hotkey',
      cmd:  'btcli wallet new_coldkey --wallet.name $WALLET && btcli wallet new_hotkey --wallet.name $WALLET --wallet.hotkey $HOTKEY' },
    { step: 'Register on SN87',
      cmd:  'btcli subnet register --netuid 87 --wallet.name $WALLET --wallet.hotkey $HOTKEY --subtensor.network finney' },
    { step: 'Stand up the forensic CV backend', note: 'Standard pattern: containerized object-detection + temporal models exposed on localhost, called by the axon.' },
  ],

  runSteps: [
    { step: 'Start the miner axon',
      cmd:  'python neurons/miner.py --wallet.name $WALLET --wallet.hotkey $HOTKEY --netuid 87 --subtensor.network finney --axon.port <port> --logging.debug',
      note: 'Exact entrypoint path depends on the operator-published repo — confirm before running.' },
    { step: 'Verify on the metagraph',
      cmd:  'btcli subnet metagraph --netuid 87' },
  ],

  envVars: [
    { name: 'WALLET',  description: 'Coldkey name',                                                       required: true },
    { name: 'HOTKEY',  description: 'Hotkey name on that coldkey',                                       required: true },
    { name: 'CV_BACKEND_URL', description: 'Forensic CV inference backend (object detection + temporal)', required: false },
  ],

  scoring: {
    summary:
      'Detection precision/recall on anomaly + event extraction, plus structural quality of the generated forensic report (timestamps, event chains, evidence frames). Because outputs are intended to be evidentiary, hallucinated detections are penalized more heavily than missed ones — the network biases toward high-precision pipelines.',
    rule: 'Precision-weighted detection metrics + report structural quality → composite score per tempo → weight vector.',
    cheatPath:
      'Cannot flood reports with fabricated detections — validators check claimed anomalies against ground truth and false positives cost more than misses. Pre-cached responses also fail because benchmark clips rotate and timestamps are unique per submission.',
  },

  profitability: {
    estimatedDailyEmissionPerUid: 0.0,
    tokenPriceUsdFallback: 284,
    capexNote:
      'A 4090-class box at $2.5–4k owned (or ~$0.8–1.2/hr rented) is enough to compete. Edge comes from model selection (detector + tracker + temporal head) and prompting / post-processing for the report structure.',
  },

  milestones: [
    { day: 'day 1',  target: 'UID assigned, axon reachable',                       note: 'Confirm with `btcli subnet metagraph --netuid 87` and an outside curl to the axon port.' },
    { day: 'day 7',  target: 'First non-zero incentive',                            note: 'If staying at zero, check that report structure matches the operator-specified schema — malformed reports may score zero even with good detections.' },
    { day: 'day 14', target: 'Out of immunity, weight above floor',                 note: 'Compare against top miners — what detectors and tracker setups are they running?' },
  ],

  monitoring: [
    { metric: 'CV backend latency / clip', threshold: '< 60s',          where: 'miner logs · long latency loses to faster miners' },
    { metric: 'Detection precision (proxy)',threshold: '> 0.9',          where: 'validator feedback / public leaderboard' },
    { metric: 'GPU utilization under load', threshold: '> 60%',          where: 'nvidia-smi' },
    { metric: 'Per-tempo incentive',        threshold: 'rising or flat', where: 'btcli subnet metagraph --netuid 87' },
  ],

  knownIssues: [
    { symptom: 'Score stays at zero despite valid output', cause: 'Report schema mismatch — validator expects a specific JSON / structured format.',  fix: 'Re-read the operator-published schema; match field names + timestamp format exactly.' },
    { symptom: 'High false-positive rate',                 cause: 'Detector threshold too aggressive; precision-weighted scoring punishes this.',     fix: 'Raise detection confidence threshold; add a verification pass before emitting an event.' },
    { symptom: 'Validators not hitting the axon',          cause: 'Axon port closed at firewall, or --axon.ip set to a private address.',            fix: 'Open the axon port at the cloud firewall; set --axon.ip to the public IP.' },
  ],

  notes: [
    'Luminar Network (SN87) is operationally distinct from the lidar company Luminar Technologies and the security-camera vendor Luminys — confirm you are targeting the Bittensor subnet operator.',
    'Precision is weighted heavily — design your pipeline to prefer fewer, more-confident detections over a flood of weak ones.',
    'Confirm the official miner repo URL on the operator channels before installing anything from third-party sources.',
  ],
};
