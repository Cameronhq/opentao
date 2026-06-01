import type { RichPlaybook } from '../playbook-rich';

// SN85 — Vidaio. Decentralized AI video upscaling + compression. Miners
// run upscalers (Video2X/FFmpeg-backed) and return enhanced clips; validators
// score with VMAF + PieAPP + structural metrics. Repo:
// vidaio-subnet/vidaio-subnet. Standard neurons/miner.py setup, but the
// real complexity is the upscaling service stack (docker compose profiles)
// and S3-compatible storage for intermediate video.

export const sn85: RichPlaybook = {
  slug: '85-vidaio',
  netuid: 85,
  name: 'Vidaio',
  category: 'vision',
  categoryLabel: 'Video / Vision',

  blurb:
    'AI video upscaling + compression as a Bittensor service. Miners run deep-learning upscalers on validator-issued low-res clips and return higher-resolution video scored by VMAF + PieAPP.',

  whatMinersDo:
    'A Vidaio miner runs an axon (neurons/miner.py) plus a docker-compose stack of upscaling/compression services (Video2X or FFmpeg backends, plus a compression service). Validators send low-res clips with a target resolution; the miner uploads the input to S3-compatible storage, processes it through the chosen upscaling service, and returns the enhanced clip URL. Validators score perceptual + structural quality against a reference high-res target.',

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
      gpu: 'NVIDIA RTX 4090 or higher (A100 / H100 also good)',
      vramGb: 16,
      cpuCores: 16,
      ramGb: 64,
      diskGb: 500,
      bandwidth: 'static public IP · open axon port',
      notes: 'Minimum 16 GB VRAM per GPU per the repo. RTX 4090 / A100 / H100 are the canonical targets. Disk holds video tmp + model weights.',
    },
  ],
  hardwareNote:
    'Faster GPUs reduce per-clip latency, which matters when validators time out. S3-compatible object storage (Backblaze B2 or AWS S3) is required for handing clips back to validators.',

  rentalOk: true,
  rentalUsdPerHr: { lambda: 1.99, runpod: 1.89, coreweave: 2.10 },

  repo: {
    url: 'https://github.com/vidaio-subnet/vidaio-subnet',
    branch: 'main',
    minerEntrypoint: 'neurons/miner.py',
  },

  setupShape: 'docker-compose',
  setupOverview:
    'Two layers on one box: (1) a docker-compose upscaling/compression service stack exposing HTTP endpoints on localhost; (2) the Bittensor neurons/miner.py axon that calls those endpoints. Configure miner/.env with wallet, S3 storage creds, and the service URLs, then bring everything up with docker compose + python.',

  install: [
    { step: 'Clone the repo',
      cmd:  'git clone https://github.com/vidaio-subnet/vidaio-subnet.git && cd vidaio-subnet' },
    { step: 'Create Python 3.10+ venv',
      cmd:  'python3 -m venv venv && source venv/bin/activate' },
    { step: 'Install package',
      cmd:  'pip install -e .' },
    { step: 'Configure miner/.env',
      note: 'Set MINER_SHARED_DIR, MINER_STORAGE_PROVIDER (backblaze or aws), S3 access/secret/region/bucket/endpoint, plus MINER_UPSCALING_SERVICE_URL (default http://localhost:8003) and MINER_COMPRESSION_SERVICE_URL (default http://localhost:8004).' },
    { step: 'Bring up the upscaling service (Video2X)',
      cmd:  'docker compose --profile upscaling-video2x up -d upscaling-video2x',
      note: 'Alternative: `docker compose --profile upscaling-ffmpeg up -d upscaling-ffmpeg` for the FFmpeg-backed pipeline.' },
    { step: 'Bring up the compression service',
      cmd:  'docker compose up -d compression' },
    { step: 'Register on SN85',
      cmd:  'btcli subnet register --netuid 85 --wallet.name $WALLET --wallet.hotkey $HOTKEY --subtensor.network finney' },
  ],

  runSteps: [
    { step: 'Start the miner axon',
      cmd:  'python3 neurons/miner.py \\\n  --wallet.name $WALLET \\\n  --wallet.hotkey $HOTKEY \\\n  --subtensor.network finney \\\n  --netuid 85 \\\n  --axon.port <port> \\\n  --logging.debug',
      note: 'Run under pm2 or systemd for persistence: `pm2 start "python3 neurons/miner.py ..." --name video-miner`.' },
    { step: 'Verify on the metagraph',
      cmd:  'btcli subnet metagraph --netuid 85' },
  ],

  envVars: [
    { name: 'WALLET',                          description: 'Coldkey name',                                          required: true },
    { name: 'HOTKEY',                          description: 'Hotkey name on that coldkey',                          required: true },
    { name: 'MINER_SHARED_DIR',                description: 'Local tmp dir for video work (default /tmp/vidaio-miner-video-tmp)', required: true },
    { name: 'MINER_STORAGE_PROVIDER',          description: 'S3-compatible provider — backblaze or aws',            required: true },
    { name: 'MINER_STORAGE_S3_ACCESS_KEY_ID',  description: 'S3 access key',                                         required: true },
    { name: 'MINER_STORAGE_S3_SECRET_ACCESS_KEY', description: 'S3 secret access key',                              required: true },
    { name: 'MINER_STORAGE_S3_REGION',         description: 'S3 region',                                             required: true },
    { name: 'MINER_STORAGE_S3_BUCKET_NAME',    description: 'S3 bucket for clip handoff',                            required: true },
    { name: 'MINER_STORAGE_S3_ENDPOINT_URL',   description: 'S3-compatible endpoint URL',                            required: true },
    { name: 'MINER_UPSCALING_SERVICE_URL',     description: 'Local upscaling service URL (default http://localhost:8003)', required: true },
    { name: 'MINER_COMPRESSION_SERVICE_URL',   description: 'Local compression service URL (default http://localhost:8004)', required: true },
  ],

  scoring: {
    summary:
      'Perceptual + structural video-quality metrics on each returned clip. Validators run a VMAF-style perceptual score combined with PieAPP and SSIM/PSNR-style structural metrics against a reference high-resolution target; composite score per clip rolls into per-tempo ranking.',
    rule: 'Composite VMAF + PieAPP (+ structural) score across the tempo benchmark set → weight vector. No-op or unchanged outputs are punished by the metrics directly.',
    cheatPath:
      'Cannot pass through the input unchanged — perceptual + structural metrics compare against a high-res ground truth and punish no-ops. Pre-cached outputs also fail because clips are rotated. Only miners that actually reconstruct plausible high-frequency content score well.',
  },

  profitability: {
    estimatedDailyEmissionPerUid: 0.0,
    tokenPriceUsdFallback: 284,
    capexNote:
      'RTX 4090 box is $2.5–4k owned, or ~$0.8–1.2/hr on Runpod/Lambda. A100/H100 boxes are faster (better latency = more clips per tempo) at higher rental cost.',
    notes:
      'S3 egress costs add up on big clip volumes — Backblaze B2 is typically cheaper than AWS S3 for this workload. Plan storage cost into the unit economics.',
  },

  milestones: [
    { day: 'day 1',  target: 'Miner + docker services healthy, UID assigned', note: '`docker ps` shows upscaling + compression up; `btcli subnet metagraph --netuid 85` shows your hotkey.' },
    { day: 'day 3',  target: 'First clips returning, non-zero score',         note: 'Validator logs should reference your axon; perceptual scores landing on the dashboard.' },
    { day: 'day 7',  target: 'Tuning upscaler choice / model weights',        note: 'Video2X vs FFmpeg-backed pipeline matters — test both on representative content.' },
    { day: 'day 14', target: 'Out of immunity, weight above floor',           note: 'If close to the floor, profile latency — slow clips lose to faster miners with equal quality.' },
  ],

  monitoring: [
    { metric: 'Upscaling service health',     threshold: 'http 200',           where: 'curl $MINER_UPSCALING_SERVICE_URL/health' },
    { metric: 'Compression service health',   threshold: 'http 200',           where: 'curl $MINER_COMPRESSION_SERVICE_URL/health' },
    { metric: 'GPU utilization under load',   threshold: '> 60%',              where: 'nvidia-smi' },
    { metric: 'S3 upload latency',            threshold: '< 5s per clip',      where: 'miner logs' },
    { metric: 'Per-tempo incentive',          threshold: 'rising or flat',     where: 'btcli subnet metagraph --netuid 85' },
  ],

  knownIssues: [
    { symptom: 'Validators never call the axon',         cause: 'Axon port closed at the firewall, or miner.py crashed silently.', fix: 'Open the axon port; run miner.py under pm2/systemd; tail logs.' },
    { symptom: 'Service returns 5xx during upscale',     cause: 'Out-of-VRAM on large frames (RTX 4090 16GB tight on 4K).',         fix: 'Reduce internal tile size in the upscaling service, or move to a higher-VRAM GPU.' },
    { symptom: 'Validator score is consistently low',    cause: 'Stock model under-fits content type, or pipeline introduces artifacts.', fix: 'Try the alternative profile (Video2X vs FFmpeg) and tune model weights for the content distribution validators are sampling.' },
    { symptom: 'S3 timeouts under load',                 cause: 'Region mismatch or too-small bandwidth tier.',                     fix: 'Use a bucket in the same region as the miner; bump the S3 plan tier if egress is throttling.' },
  ],

  notes: [
    'Vidaio publishes a beta consumer web app — the same upscaler stack powers it, which means your miner output indirectly contributes to a real product.',
    'Compression (Phase II) layers on top of upscaling — operators that nail both have more surface area to win.',
    'Industry-experienced operators (ex-Netflix / Disney / Sony / Spotify) run the product side; treat the spec as production-grade.',
  ],
};
