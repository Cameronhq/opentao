import type { RichPlaybook } from '../playbook-rich';

// SN70 — NexisGen. Operated by RendixNetwork.
// Per-interval (50-block) video clip dataset packaging from YouTube sources,
// uploaded to Cloudflare R2; validators discover via on-chain credential commit.

export const sn70: RichPlaybook = {
  slug: '70-nexisgen',
  netuid: 70,
  name: 'NexisGen',
  category: 'data',
  categoryLabel: 'Data',

  blurb:
    'Per-interval video-clip dataset production. Miners build (dataset.parquet + manifest.json) packages every 50 blocks from YouTube sources and upload to Cloudflare R2; validators audit on schema, integrity, and resolution.',

  whatMinersDo:
    'A NexisGen miner runs the `nexis mine` long-running loop. Every 50 blocks it ingests source videos (yt-dlp / ffmpeg), produces a clip-level parquet plus a signed manifest (interval id, hashes, record_count), uploads to a Cloudflare R2 bucket via S3 API, and commits read credentials on-chain so validators can discover and pull the package. Validators then verify hashes, schema, sampled clip resolution (1280×720), caption sanity, and de-dup against the global overlap index.',

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
      cpuCores: 8,
      ramGb: 16,
      diskGb: 200,
      bandwidth: 'Stable upstream to Cloudflare R2',
      notes: 'Bandwidth and disk dominate. ffmpeg/yt-dlp pipeline is CPU-bound; no GPU required.',
    },
  ],
  hardwareNote:
    'Required binaries on PATH: yt-dlp, ffmpeg, ffprobe. Python 3.10–3.12. Disk depends on intervals retained locally before R2 upload.',

  rentalOk: true,
  rentalUsdPerHr: { lambda: 0.20, runpod: 0.18, coreweave: 0.25 },

  repo: {
    url: 'https://github.com/RendixNetwork/nexisgen',
    branch: 'main',
    minerEntrypoint: 'nexis mine (CLI installed via `pip install -e .[dev]`)',
  },

  setupShape: 'simple-binary',
  setupOverview:
    'Clone the repo, create a venv, install with the dev extras, fill `.env` with wallet + R2 credentials, register on netuid 70, commit read credentials on-chain, then run `nexis mine` as a long-running process. Every 50-block interval the miner builds and uploads one package; validators discover and audit it.',

  install: [
    { step: 'Install system binaries', cmd: 'apt-get install -y ffmpeg && pip install yt-dlp',
      note: 'ffprobe ships with ffmpeg. yt-dlp must be on PATH.' },
    { step: 'Clone the repo',
      cmd: 'git clone https://github.com/RendixNetwork/nexisgen && cd nexisgen' },
    { step: 'Create venv + install',
      cmd: 'python -m venv .venv && source .venv/bin/activate && pip install -e ".[dev]"' },
    { step: 'Copy and fill env',
      cmd: 'cp .env.example .env',
      note: 'Set wallet, Cloudflare R2 account id + read/write keys, source paths, and NEXIS_DATASET_CATEGORY. Shared buckets need NEXIS_RECORD_INFO_ACCOUNT_ID and NEXIS_OWNER_DB_ACCOUNT_ID.' },
    { step: 'Register hotkey on SN70',
      cmd: 'btcli subnet register --netuid 70 --wallet.name $WALLET --wallet.hotkey $HOTKEY' },
    { step: 'Commit miner read credentials on-chain',
      cmd: 'nexis commit-credentials',
      note: 'Validators discover your R2 bucket via this on-chain commit. Without it, your data is invisible to scoring.' },
  ],

  runSteps: [
    { step: 'Start miner loop',
      cmd: 'nexis mine',
      note: 'Long-running. One package per 50-block interval. Skips intervals where manifest already exists.' },
    { step: 'Optional: choose spec / debug / poll',
      cmd: 'nexis mine --spec video_v1 --debug --poll-sec 4' },
  ],

  envVars: [
    { name: 'WALLET',                            description: 'Coldkey name (matches btcli wallet list)',                       required: true },
    { name: 'HOTKEY',                            description: 'Hotkey name on that coldkey',                                    required: true },
    { name: 'NEXIS_DATASET_CATEGORY',            description: 'Category tag the miner emits (nature/landscape/scenery/etc.)',   required: true },
    { name: 'NEXIS_RECORD_INFO_ACCOUNT_ID',      description: 'Cloudflare R2 account id for the shared record-info bucket',     required: true },
    { name: 'NEXIS_OWNER_DB_ACCOUNT_ID',         description: 'Cloudflare R2 account id for the owner dataset bucket',          required: true },
    { name: 'NEXIS_VALIDATOR_SEMANTIC_CHECK_ENABLED', description: 'Toggle semantic caption check for validator (debug only)',   required: false },
    { name: 'OPENAI_API_KEY',                    description: 'Validator-side: enables gpt-4o for semantic caption check',      required: false },
    { name: 'GEMINI_API_KEY',                    description: 'Validator-side fallback: gemini-3.1-flash-lite-preview',         required: false },
  ],

  scoring: {
    summary:
      'Per-interval accept/reject. A package is accepted only if all layers pass: manifest matches hotkey + interval id, dataset_sha256 matches the downloaded parquet, record_count is correct, schema parses, source URLs are YouTube, clip overlap policy (≥5s gap) holds, captions pass lexical checks, sampled clip resolution is exactly 1280×720, and optional semantic caption check passes. Overlap rows already in the global index are pruned; cross-miner conflicts arbitrated by earliest manifest time.',
    rule: 'Earn by producing a steady stream of fresh, unique, spec-compliant clip packages with valid captions. Volume × uniqueness × spec compliance.',
    sourcePath: 'RendixNetwork/nexisgen · README.md (validation layers section)',
    cheatPath:
      "Re-uploading prior datasets, fabricating manifests, stitching near-duplicate clips, or claiming non-YouTube sources all fail validation. The overlap index plus SHA256-bound sample verification close most attack surface; remaining risk is sophisticated re-encodes that pass perceptual and resolution checks.",
  },

  profitability: {
    estimatedDailyEmissionPerUid: 0.0,
    tokenPriceUsdFallback: 284,
    notes:
      'Live emission per UID varies; check taostats.io/subnets/70/ for current daily τ per active miner before sizing.',
  },

  milestones: [
    { day: 'day 1',  target: 'First interval accepted', note: '`nexis mine --debug` shows accepted=true on at least one interval within ~1 hour of starting.' },
    { day: 'day 3',  target: 'Steady acceptance rate',  note: 'At least 70% of intervals you submit accepted by validators; failures tracked by reason code.' },
    { day: 'day 7',  target: 'Out of immunity / incentive rising', note: 'btcli subnet metagraph --netuid 70 shows incentive climbing tempo-over-tempo.' },
    { day: 'day 14', target: 'Above floor incentive',   note: 'Above the lowest non-immune miner — if not, broaden source coverage or fix recurring reject codes.' },
  ],

  monitoring: [
    { metric: 'Per-interval accept rate',    threshold: '> 70%',          where: '`nexis mine --debug` decision JSON `accepted` field' },
    { metric: 'R2 upload success',           threshold: '100%',           where: 'Miner logs / Cloudflare R2 dashboard' },
    { metric: 'Validator failure reasons',   threshold: 'no repeat codes',where: 'decision JSON `failures` list' },
    { metric: 'Per-tempo incentive',         threshold: 'rising or flat', where: 'btcli subnet metagraph --netuid 70 (every ~72 min)' },
  ],

  knownIssues: [
    {
      symptom: 'No miner data validated by any validator',
      cause:   'commit-credentials never run, or R2 keys do not grant read access to validators.',
      fix:     'Re-run `nexis commit-credentials` and confirm the bucket allows the committed read key. Verify validator can read metagraph + your bucket.',
    },
    {
      symptom: 'Semantic check rejecting valid clips',
      cause:   'Caption-vision mismatch model misclassifying borderline content. OPENAI_API_KEY missing/invalid or GEMINI fallback misconfigured.',
      fix:     'Validator-side: confirm OPENAI_API_KEY or GEMINI_API_KEY is set. For isolation, set NEXIS_VALIDATOR_SEMANTIC_CHECK_ENABLED=false to debug other layers.',
    },
    {
      symptom: 'Sampled clip resolution failure',
      cause:   'ffmpeg output not exactly 1280×720; transcoding produced 1280×718 or similar due to source aspect ratio.',
      fix:     'Pin ffmpeg scale filter to `scale=1280:720:force_original_aspect_ratio=increase,crop=1280:720`. Reject source clips that cannot be normalised.',
    },
    {
      symptom: 'Source authenticity failures',
      cause:   'yt-dlp or ffmpeg missing/broken on PATH, or source_video_url not reachable from validator.',
      fix:     'Reinstall yt-dlp and ffmpeg, confirm `yt-dlp --version` works, and pick only public, geoblock-free YouTube sources.',
    },
  ],

  notes: [
    'Default spec is `video_v1`. Pass `--spec` explicitly if you need to lock to a specific version.',
    'Owner-validator mode (NEXIS_OWNER_VALIDATOR_HOTKEY) is special — only the project owner runs it and it publishes accepted metadata bundles to shared buckets.',
    'Optional validator forwarding: set NEXIS_VALIDATION_API_URL + NEXIS_VALIDATION_API_TIMEOUT_SEC to forward signed interval results.',
  ],
};
