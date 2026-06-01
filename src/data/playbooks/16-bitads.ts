import type { RichPlaybook } from '../playbook-rich';

// SN16 — BitAds. Source: github.com/FirstTensorLabs/BitAds README + docs/mining.md (2026-06).

export const sn16: RichPlaybook = {
  slug: '16-bitads',
  netuid: 16,
  name: 'BitAds',
  category: 'data',
  categoryLabel: 'Performance ads · proof-of-sale',

  blurb:
    'Decentralized proof-of-sale advertising network. Miners promote BitAds campaigns across any channel they like; validators score by verified sales + USD revenue with refund penalties (sqrt+log P95 normalization).',

  whatMinersDo:
    "A miner drives real traffic to BitAds advertiser landing pages through whatever channel they own — content, social, email, communities. Each click is attributed to the miner UID via the BitAds pixel; when a visitor converts via Stripe, the validator credits the sale. Over a rolling 30-day window the validator computes refund_rate, sqrt-normalized sales, log-normalized revenue (P95 references), and a 15% sales + 85% revenue base score, multiplied by (1 − refund_rate). No GPU is required; this is traffic operations, not compute.",

  verifiedAt: '2026-06-01',
  verifiedBy: '@editorial',

  emission: '— τ/day',
  burnCostFallback: '— τ',
  minerCountFallback: 0,
  slotCap: 256,

  hardware: [
    {
      role: 'Miner ops box',
      count: '1',
      cpuCores: 2,
      ramGb: 4,
      diskGb: 20,
      bandwidth: 'standard',
      notes: 'No GPU. A small VPS is enough to run the registration flow and tracking; the work itself is on traffic channels you control.',
    },
  ],
  hardwareNote:
    'BitAds is not compute-bound. The economic input is human / channel access (audiences, ad accounts, content surfaces). The hardware just runs the registration and tracking glue.',

  rentalOk: true,
  rentalUsdPerHr: { lambda: 0.05, runpod: 0.04, coreweave: 0.06 },

  repo: {
    url: 'https://github.com/FirstTensorLabs/BitAds',
    branch: 'main',
    minerEntrypoint: 'docs/mining.md',
    extraRepos: [
      { name: 'bitads-v3-core', url: 'https://pypi.org/project/bitads-v3-core/', purpose: 'Pure-Python scoring library (referenced from the README)' },
      { name: 'website',        url: 'https://bitads.ai',                         purpose: 'Campaign discovery + miner / merchant onboarding' },
    ],
  },

  setupShape: 'simple-binary',
  setupOverview:
    'Mining BitAds is mostly a registration + tracking workflow — you register a hotkey on SN16 (either via the BitAds website with a Polkadot.js-supported wallet or via the Bittensor CLI), then drive traffic through your tagged campaign link. The pixel + Stripe verification handles the rest.',

  install: [
    { step: 'Read the mining guide',
      cmd:  'open https://github.com/FirstTensorLabs/BitAds/blob/main/docs/mining.md' },
    { step: 'Create a Bittensor wallet (if you do not have one)',
      cmd:  'btcli wallet new_coldkey --wallet.name $WALLET && btcli wallet new_hotkey --wallet.name $WALLET --wallet.hotkey $HOTKEY' },
    { step: 'Option A — register via the BitAds website',
      note: 'Connect a Polkadot.js-supported wallet on bitads.ai, open Register Miner, generate hotkey + seed, sign the registration tx.' },
    { step: 'Option B — register via CLI',
      cmd:  'btcli subnet register --netuid 16',
      note: 'Mainnet finney. Testnet equivalent is netuid 368.' },
    { step: 'Pick a campaign on bitads.ai',
      note: 'Each campaign exposes a tagged URL bound to your miner UID. Conversions through that URL credit you.' },
  ],

  runSteps: [
    { step: 'Drive traffic through the tagged link',
      note: 'Any channel — content, social, email, communities. Only verified Stripe-webhook conversions count; clicks alone score zero.' },
    { step: 'Track sales + refunds in the BitAds dashboard',
      note: 'Refunds reduce score multiplicatively (1 − refund_rate). Soft cap below 3 sales: score × 0.30.' },
    { step: 'Check on-chain weight',
      cmd:  'btcli subnet metagraph --netuid 16',
      note: 'Score → weight → emission. Verify you appear in the metagraph after registration.' },
  ],

  envVars: [
    { name: 'WALLET', description: 'Coldkey name (matches btcli wallet list)', required: true },
    { name: 'HOTKEY', description: 'Hotkey name on that coldkey',               required: true },
  ],

  scoring: {
    summary:
      'Per-miner score in [0,1] over a rolling 30-day window. Inputs: verified sales count, verified revenue (USD), refund orders. Compute: refund_rate = refund_orders / max(1, sales); sales_norm = sqrt(sales) / sqrt(P95_sales); rev_norm = ln(1+rev) / ln(1+P95_rev); base = 0.15·sales_norm + 0.85·rev_norm; score = base · (1 − refund_rate). Optional soft cap: if sales < 3 then score · 0.30.',
    rule: 'Generate verified sales with high USD revenue and low refunds across a 30-day window. Revenue dominates (85% weight).',
    sourcePath: 'FirstTensorLabs/BitAds · README + docs/mining.md (bitads-v3-core PyPI)',
    cheatPath:
      "Fake clicks — they don't convert via Stripe, score zero. Self-purchases — Stripe risk system flags them and the validator strips credit. Bot traffic — converts at near-zero rate and the per-campaign conversion-rate monitor catches it. There is also a burn mechanism that ramps when emission USD-value exceeds verified sales USD-value, capping over-profitability.",
  },

  profitability: {
    estimatedDailyEmissionPerUid: 0.0,
    tokenPriceUsdFallback: 284,
    capexNote:
      'No hardware capex. Cost is traffic-acquisition cost in your channel of choice (ad spend, content production, list rentals). The economic test is: can you generate $1 of verified revenue for less than $1 of emission value, net of refunds?',
    notes:
      'The 85% revenue weight means high-AOV campaigns earn disproportionately more than low-AOV high-volume ones. The log normalization compresses extreme revenue, so a $10k AOV does not 10× a $1k AOV at the score level.',
  },

  milestones: [
    { day: 'day 1',  target: 'Hotkey registered, campaign selected',
      note: 'Visible in the BitAds dashboard and on-chain via metagraph.' },
    { day: 'day 3',  target: 'First verified sale',
      note: 'Confirms attribution pixel + Stripe webhook are wired correctly to your UID.' },
    { day: 'day 7',  target: '≥ 3 verified sales (clear the soft cap)',
      note: 'Until you have 3 sales the soft cap multiplies your score by 0.30 — getting past this is the first real income threshold.' },
    { day: 'day 30', target: 'Full 30-day window populated',
      note: 'The scoring window is rolling 30 days; only at day-30 is the validator computing your steady-state base.' },
  ],

  monitoring: [
    { metric: 'Verified sales count (30d)',  threshold: '≥ 3 (clear soft cap)', where: 'BitAds dashboard' },
    { metric: 'Revenue USD (30d)',           threshold: '≥ P95 / 2',            where: 'BitAds dashboard' },
    { metric: 'Refund rate',                 threshold: '< 10%',                where: 'BitAds dashboard' },
    { metric: 'On-chain weight',             threshold: 'rising or flat',       where: 'btcli subnet metagraph --netuid 16' },
  ],

  knownIssues: [
    {
      symptom: 'Clicks arrive but no conversions credit',
      cause:   'Pixel not firing on the merchant page, or the Stripe webhook is misrouted.',
      fix:     'Verify the campaign in the BitAds dashboard; the issue is on the merchant integration side, not the miner.',
    },
    {
      symptom: 'Score stuck near zero despite sales',
      cause:   'Sales < 3 → soft cap applies a 0.30 multiplier on the entire score.',
      fix:     'Push for at least 3 verified sales in the 30-day window — the cap lifts once you cross.',
    },
    {
      symptom: 'High refund rate hammers score',
      cause:   'Misleading creatives or low-intent traffic → buyers churn or chargeback.',
      fix:     'Switch channels / creative to higher-intent audiences. The (1 − refund_rate) multiplier is unforgiving.',
    },
    {
      symptom: 'Score normal but emission low',
      cause:   'Burn mechanism is active — emission USD value exceeds verified sales USD value across the subnet.',
      fix:     'Network-level dynamic; expect a lower-emission regime until subnet-wide sales catch up to TAO price.',
    },
  ],

  notes: [
    'Subnet has a documented burn mechanism that ramps the burn % when network emission USD exceeds verified sales USD — described in detail in the FirstTensorLabs/BitAds README.',
    'Mining is not GPU-bound; success depends on which traffic channels you control. This is more like an affiliate-marketing playbook than a compute playbook.',
    'Reference scoring code is published as the bitads-v3-core PyPI package — you can score yourself locally.',
  ],
};
