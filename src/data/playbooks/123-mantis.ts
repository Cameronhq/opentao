import type { RichPlaybook } from '../playbook-rich';

// SN123 — MANTIS. Atlas (@Barbarian7676).
// Miners submit encrypted embeddings to Cloudflare R2 every ~60s for each of
// 11 active challenges (BTC, ETH, FX, gold/silver, multi-asset). Validator
// decrypts after a Drand IBE lockup, runs the ensemble model, and pays each
// miner by marginal information gain. No axon — this is a commit-URL pattern.

export const sn123: RichPlaybook = {
  slug: '123-mantis',
  netuid: 123,
  name: 'MANTIS',
  category: 'reason',
  categoryLabel: 'Forecasting · embeddings',

  blurb:
    'Information-theoretic signal market. Miners commit encrypted embeddings to Cloudflare R2 every ~60s across 11 active challenges (BTC, ETH, FX, gold/silver, multi-asset). Validator scores by marginal information gain over the ensemble forecast.',

  whatMinersDo:
    "A MANTIS miner runs any predictive pipeline they want — microstructure features, alt-data, LLM-on-news, classical ML — and emits a small fixed-dimension embedding (1–17 dims, per challenge) for every active challenge. The embedding is encrypted with a V2 payload (X25519 ECDH + ChaCha20-Poly1305 for the owner, Drand IBE for the validator after a ~30s lockup), uploaded to a Cloudflare R2 bucket, and the bucket URL is committed once on-chain via `subtensor.commit()`. The upload is overwritten every ~60s. There is no axon — the validator pulls from R2 on its own schedule.",

  verifiedAt: '2026-06-01',
  verifiedBy: '@editorial',

  emission: '— τ/day',
  burnCostFallback: '— τ',
  minerCountFallback: 0,
  slotCap: 256,

  hardware: [
    {
      role: 'Predictive node',
      count: '1',
      cpuCores: 4,
      ramGb: 16,
      diskGb: 100,
      bandwidth: 'standard broadband · outbound to R2',
      notes: 'Whatever your model requires. Many miners run on a laptop or small VPS — the embedding-per-asset payload is tiny (~few KB). If your strategy needs an LLM or large model, scale up that box separately.',
    },
  ],
  hardwareNote:
    "Hardware is entirely model-dependent — MANTIS pays for embedding information value, not compute. A clever miner with a single VPS and a good model can outscore a brute-force GPU farm.",

  rentalOk: true,
  rentalUsdPerHr: { lambda: 0.10, runpod: 0.09, coreweave: 0.12 },

  repo: {
    url: 'https://github.com/Barbariandev/MANTIS',
    branch: 'main',
  },

  setupShape: 'simple-binary',
  setupOverview:
    "Stand up a Cloudflare R2 bucket (must use a *.r2.dev or *.r2.cloudflarestorage.com domain), install the MANTIS Python deps, generate embeddings for every challenge in config.py, encrypt as V2, upload to R2, and commit the URL on-chain once. The recurring loop (~60s) just regenerates embeddings and overwrites the R2 object.",

  install: [
    { step: 'Clone the repo',
      cmd:  'git clone https://github.com/Barbariandev/MANTIS && cd MANTIS' },
    { step: 'Install requirements',
      cmd:  './install_reqs.sh',
      note: 'Or: pip install timelock requests cryptography boto3 python-dotenv (per MINER_GUIDE.md).' },
    { step: 'Provision a Cloudflare R2 bucket',
      note: 'Bucket must serve via *.r2.dev or *.r2.cloudflarestorage.com — validators reject other domains. Generate an R2 access key pair.' },
    { step: 'Fill .env with R2 credentials',
      note: 'AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, R2 endpoint, OWNER_HPKE_PUBLIC_KEY_HEX (from config.py), and your hotkey ss58.' },
    { step: 'Register hotkey on SN123',
      cmd:  'btcli subnet register --netuid 123 --wallet.name $WALLET --wallet.hotkey $HOTKEY',
      note: 'Re-check burn cost on taostats.io/subnets/123 immediately before this.' },
    { step: 'Commit your R2 URL on-chain (one-time)',
      note: "Call subtensor.commit(netuid=123, data=<your R2 URL>). After this, validators know where to pull your encrypted payloads from.",  },
  ],

  runSteps: [
    { step: 'Implement build_all_embeddings()',
      note: 'For each challenge in config.CHALLENGES, return a fixed-dim embedding. Dimensions and asset list (BTC, ETH, CADUSD, NZDUSD, CHFUSD, XAGUSD, plus multi-asset MULTI-BREAKOUT / XSEC-RANK / FUNDING-XSEC over 33 assets) come from config.py.' },
    { step: 'Run the submission loop (~60s)',
      cmd: `python - <<'PY'
import json, time
from generate_and_encrypt import generate_v2
from config import CHALLENGES, OWNER_HPKE_PUBLIC_KEY_HEX
while True:
    payload = generate_v2(
        hotkey=MY_HOTKEY,
        lock_seconds=30,
        owner_pk_hex=OWNER_HPKE_PUBLIC_KEY_HEX,
        embeddings=build_all_embeddings(),
    )
    with open(MY_HOTKEY, 'w') as f:
        json.dump(payload, f)
    # upload <MY_HOTKEY> to R2, overwriting
    time.sleep(60)
PY`,
      note: 'Template from MINER_GUIDE.md. Lock seconds = 30 (Drand IBE lockup); validator decrypts after maturation.' },
    { step: 'Verify on the metagraph',
      cmd:  'btcli subnet metagraph --netuid 123',
      note: "Confirm UID and watch for incentive once the validator's ensemble starts paying out marginal information." },
  ],

  envVars: [
    { name: 'WALLET',                 description: 'Coldkey name (matches btcli wallet list)',      required: true },
    { name: 'HOTKEY',                 description: 'Hotkey name on that coldkey',                   required: true },
    { name: 'AWS_ACCESS_KEY_ID',      description: 'Cloudflare R2 access key ID',                   required: true },
    { name: 'AWS_SECRET_ACCESS_KEY',  description: 'Cloudflare R2 secret key',                      required: true },
    { name: 'R2_BUCKET_URL',          description: 'Public R2 URL committed on-chain (*.r2.dev or *.r2.cloudflarestorage.com)', required: true },
    { name: 'OWNER_HPKE_PUBLIC_KEY_HEX', description: 'X25519 owner public key (from config.py)',   required: true },
  ],

  scoring: {
    summary:
      "Validators run an ensemble forecast over all submitted embeddings per challenge and score each miner by marginal information gain — how much that miner's embedding reduces ensemble loss versus the ensemble without it. Per-challenge salience vectors normalise to sum to 1, multiply by challenge weight, then average across challenges. EMA smoothing (α=0.15) is applied across weight-setting intervals to reduce block-to-block variance.",
    rule: 'Submit embeddings whose information is orthogonal to the rest of the ensemble.',
    sourcePath: 'Barbariandev/MANTIS · config.py + validator scoring code',
    cheatPath:
      "Random noise contributes zero marginal information. Copying another miner's public output gets de-duplicated by the validator. The harder attack is collusion across hotkeys to bias the ensemble; Yuma's stake-weighted consensus median and validator diversity bound that risk. Note: SAMPLE_EVERY=5 blocks, WEIGHT_CALC_INTERVAL=1000 blocks, BURN_PCT=0.30 (UID 0) — these constants set the rhythm.",
  },

  profitability: {
    estimatedDailyEmissionPerUid: 0.0,
    tokenPriceUsdFallback: 284,
    capexNote:
      'Capex is whatever your model needs. Opex is dominated by R2 egress (cheap) and any external data feeds your strategy uses.',
    notes:
      'MANTIS rewards information, not compute. A handful of miners with novel signal will dominate the leaderboard while many copy-paste submissions get zero weight. This is the closest Bittensor subnet to "open quant tournament" economics.',
  },

  milestones: [
    { day: 'day 1',  target: 'R2 bucket live, URL committed',
      note: 'R2 returns 200 on your encrypted payload URL. subtensor.commit() succeeded.' },
    { day: 'day 3',  target: 'First non-zero incentive',
      note: 'Validator has decrypted a few cycles and your embedding contributed marginal information. If still zero after 1000-block interval, your embedding is likely correlated with the ensemble.' },
    { day: 'day 7',  target: 'Stable per-challenge salience',
      note: 'You can identify which challenges your embedding helps most. Drop challenges where you contribute nothing and focus on the ones you move.' },
    { day: 'day 14', target: 'Out of immunity, surviving',
      note: 'Incentive above the lowest non-immune miner. The 30% BURN_PCT on UID 0 means total emission to live miners is lower than naive math suggests.' },
    { day: 'day 30', target: 'Strategy iteration loop',
      note: 'Use the weights history to A/B alternative models. MANTIS is a research loop more than an ops loop.' },
  ],

  monitoring: [
    { metric: 'R2 upload latency',          threshold: '< 5s',           where: 'Local upload script logs' },
    { metric: 'Cycle freshness',            threshold: '~60s',           where: 'R2 last-modified timestamp on your payload object' },
    { metric: 'Per-tempo incentive',        threshold: 'rising or flat', where: 'btcli subnet metagraph --netuid 123' },
    { metric: 'Salience per challenge',     threshold: 'non-zero on ≥1', where: 'Validator-published salience vectors (community dashboards)' },
  ],

  knownIssues: [
    {
      symptom: 'Validator never picks up my embeddings',
      cause:   'R2 URL uses a custom domain (validators only accept *.r2.dev / *.r2.cloudflarestorage.com).',
      fix:     'Move the bucket to a public r2.dev URL and re-commit on-chain.',
    },
    {
      symptom: 'Payload uploads but salience stays zero',
      cause:   'Your embedding is highly correlated with the ensemble — adds no marginal information.',
      fix:     'Use a different data source / model class than what most miners are likely running. Microstructure or alt-data on FX/metals tends to be less crowded than BTC short-term.',
    },
    {
      symptom: 'Decryption fails on the validator side',
      cause:   "Wrong OWNER_HPKE_PUBLIC_KEY_HEX or mismatched lock_seconds.",
      fix:     'Re-read config.py for the current OWNER_HPKE_PUBLIC_KEY_HEX. Keep lock_seconds=30 unless MINER_GUIDE.md says otherwise.',
    },
    {
      symptom: 'Embedding dimension mismatch',
      cause:   "Returning the wrong vector length for a given challenge (dims range 1–17).",
      fix:     'Read CHALLENGES in config.py and assert the dim of every per-challenge embedding before encrypting.',
    },
  ],

  notes: [
    'Active challenges per config.py: BTC, ETH, CADUSD, NZDUSD, CHFUSD, XAGUSD, plus 33-asset cross-sectional sets (MULTI-BREAKOUT, XSEC-RANK, FUNDING-XSEC). Eleven challenges total at last verification.',
    'Atlas (@Barbarian7676) has publicly described next-step plans for a "mini Bittensor within MANTIS" — internal search over asset sets, loss functions, models, and embedding dimensions.',
    'BURN_PCT=0.30 on UID 0 reduces effective miner emission. Factor that into profitability math.',
    'No axon means no inbound port to open — easier ops than most subnets, but you do need a reliable R2 endpoint and one-time chain commit.',
  ],
};
