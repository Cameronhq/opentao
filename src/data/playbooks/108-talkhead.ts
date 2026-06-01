import type { RichPlaybook } from '../playbook-rich';

// SN108 — TalkHead. Talking-head video generation subnet. Install + run
// commands verified from github.com/talkheadai/talkhead-subnet README via
// WebFetch on 2026-06-01.

export const sn108: RichPlaybook = {
  slug: '108-talkhead',
  netuid: 108,
  name: 'TalkHead',
  category: 'vision',
  categoryLabel: 'Vision',

  blurb:
    'Photorealistic talking-head video generation. Miners take a reference image + text (+ optional voice profile), render a lip-synced clip behind an HTTP API, upload to Cloudflare R2, and return the URL. Validators score realism + identity + motion, with a latency bonus on top.',

  whatMinersDo:
    "A TalkHead miner runs a talking-head video generation model behind an HTTP API and points the TalkHead miner client at it. The client accepts a TalkHead Synapse (image_base64 + text + optional voice_profile), forwards it to the model API, uploads the rendered clip to Cloudflare R2, and returns the public URL. Validators send that URL to a scoring server that runs lip-sync, identity-preservation, and motion-quality metrics, then applies a latency bonus before setting weights. Winner-take-all per query — lower latency wins ties.",

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
      gpu: '1×A100 80GB or 1×H100 80GB (talking-head models such as EMO / V-Express / SadTalker run on a single workstation GPU; faster cards win latency ties)',
      vramGb: 80,
      cpuCores: 16,
      ramGb: 64,
      diskGb: 500,
      bandwidth: 'public IP · 1 Gbps · fast upload to Cloudflare R2',
      notes: 'README does not pin explicit miner hardware. The figures above reflect what talking-head models in this class (EMO, V-Express, SadTalker, AnimateAnyone-class) need to render at competitive latency. Faster GPU = better latency bonus.',
    },
  ],
  hardwareNote:
    "The repo states only that validators need 'a secure GPU executor' for evaluation. Miner hardware is sized by the model you choose to run behind the API — and the latency-bonus scoring makes a faster GPU directly worth more emission.",

  rentalOk: true,
  rentalUsdPerHr: { lambda: 1.99, runpod: 1.89, coreweave: 2.10 },

  repo: {
    url: 'https://github.com/talkheadai/talkhead-subnet',
    branch: 'main',
  },

  setupShape: 'simple-binary',
  setupOverview:
    "Setup is the standard Python 3.11+ template — venv, pip install -e ., set .env, then `python -m neurons.miner`. The interesting part is the IMAGE_REF env var: you point the miner at a Docker image (repo@sha256:...) of the talking-head model you want to serve.",

  install: [
    { step: 'Clone the TalkHead subnet repo',
      cmd:  'git clone https://github.com/talkheadai/talkhead-subnet && cd talkhead-subnet' },
    { step: 'Create a Python 3.11+ venv',
      cmd:  'python -m venv .venv && source .venv/bin/activate' },
    { step: 'Install the package',
      cmd:  'pip install -e .' },
    { step: 'Copy and edit .env',
      cmd:  'cp .env.example .env && $EDITOR .env',
      note: 'Required: WALLET_NAME, HOTKEY_NAME, NETWORK, NETUID=108, SUBNET_API_URL, and IMAGE_REF in `repo@sha256:...` format pointing at your talking-head model image.' },
    { step: 'Register your hotkey on SN108',
      cmd:  'btcli subnet register --netuid 108 --wallet.name $WALLET_NAME --wallet.hotkey $HOTKEY_NAME' },
  ],

  runSteps: [
    { step: 'Start the miner',
      cmd:  'python -m neurons.miner',
      note: 'CLI override available: `python -m neurons.miner --image-ref your-registry/your-image@sha256:...`' },
    { step: 'Confirm first Synapse + R2 upload',
      note: 'Logs should show: Synapse received → model API call → R2 upload → URL returned → score from validator.' },
    { step: 'Watch metagraph',
      cmd:  'btcli subnet metagraph --netuid 108' },
  ],

  envVars: [
    { name: 'WALLET_NAME',     description: 'Coldkey name',                                                       required: true },
    { name: 'HOTKEY_NAME',     description: 'Hotkey name',                                                        required: true },
    { name: 'NETWORK',         description: 'Bittensor network (e.g. finney)',                                    required: true },
    { name: 'NETUID',          description: 'Subnet UID — 108 for TalkHead',                                      required: true },
    { name: 'SUBNET_API_URL',  description: 'Coordination API endpoint published by TalkHead',                    required: true },
    { name: 'IMAGE_REF',       description: 'Docker image digest of your talking-head model (repo@sha256:...)',   required: true },
  ],

  scoring: {
    summary:
      'Scoring server runs sync alignment (lip vs text/voice), identity preservation (against the reference image), and motion quality (no flicker, no morph) over each returned clip. A latency bonus is applied multiplicatively after quality scoring — fast-but-bad and slow-but-perfect both lose to fast-and-good.',
    rule:
      "Highest score wins (winner-take-all per query). Quality is the floor, latency is the tiebreak. Submission cooldown: resubmissions from the same hotkey require ≥ 2 days between attempts — violating that returns HTTP 429.",
    cheatPath:
      "Pre-rendered cache attacks (reuse a clip that happened to match) are defeated by validator-randomised image/text/voice per Synapse. Identity-correct but no-lip-sync clips fail the sync metric. Gaming a single quality dimension is bounded by the multi-metric blend + latency bonus.",
  },

  profitability: {
    estimatedDailyEmissionPerUid: 0.0,
    tokenPriceUsdFallback: 284,
    capexNote:
      'Single H100/A100 box: ~$1.5-2/hr rental or ~$20-25k to own. Latency-bonus scoring means a faster card is directly worth more emission — H100 typically beats A100 here.',
    notes:
      'Winner-take-all per query plus latency bonus = heavy-tailed distribution. The marginal slot below the top miner can earn very little; the top slot can earn a lot. Tune for both quality and latency before scaling slots.',
  },

  milestones: [
    { day: 'day 1', target: 'Miner running, first Synapse rendered + scored', note: 'Logs show a complete Synapse → R2 → score cycle within the first tempo.' },
    { day: 'day 3', target: 'Quality score competitive', note: 'If your sync / identity / motion metrics are far from the leaders, swap in a stronger model image via IMAGE_REF.' },
    { day: 'day 7', target: 'Out of immunity, winning some queries outright', note: 'btcli subnet metagraph --netuid 108 should show a rising incentive.' },
    { day: 'day 14', target: 'Latency bonus consistently captured', note: 'If your quality is top-tier but incentive flat, your rendering is too slow — upgrade GPU or optimise the inference path.' },
  ],

  monitoring: [
    { metric: 'Render latency (Synapse → R2 URL)',  threshold: 'lower is better',where: 'Miner logs' },
    { metric: 'Cloudflare R2 upload success rate',  threshold: '100%',           where: 'Miner logs / R2 dashboard' },
    { metric: 'Quality score per query',            threshold: 'top quartile',   where: 'Miner logs (scoring-server return)' },
    { metric: 'Per-tempo incentive',                threshold: 'rising or flat', where: 'btcli subnet metagraph --netuid 108' },
  ],

  knownIssues: [
    {
      symptom: 'HTTP 429 from coordination API on resubmission',
      cause:   'Same hotkey resubmitted within the 2-day cooldown window.',
      fix:     'Wait out the cooldown; do not bypass by burning hotkeys — the platform tracks the cooldown by hotkey ss58.',
    },
    {
      symptom: 'High quality score but low incentive',
      cause:   'Slow rendering — winner-take-all + latency bonus pushes you below the top miner.',
      fix:     'Profile the model inference path; consider swapping to a faster open-source talking-head model or scaling up the GPU.',
    },
    {
      symptom: 'R2 upload occasionally fails',
      cause:   'Network instability or R2 token rate-limit.',
      fix:     'Use a dedicated R2 token for the miner; add a retry with exponential backoff in your IMAGE_REF wrapper.',
    },
  ],

  notes: [
    'Pick the IMAGE_REF carefully — the open-source talking-head model you wrap is the entire quality story. SadTalker is the easy baseline; EMO / V-Express / AnimateAnyone-class are the competitive frontier.',
    'Latency bonus is multiplicative, not additive — small latency wins compound over a 72-min tempo.',
  ],
};
