import type { RichPlaybook } from '../playbook-rich';

// SN89 — InfiniteHash. SHA-256 (Bitcoin) mining pool integrated into
// Bittensor: ASIC miners contribute hashrate to mine BTC, but rewards come
// as Alpha (SN89's subnet token) and 100% of pool BTC revenue is used to
// buy back + burn Alpha. Operator: backend-developers-ltd. Setup is pool
// configuration on ASICs — not a python neurons/miner.py workflow.

export const sn89: RichPlaybook = {
  slug: '89-infinitehash',
  netuid: 89,
  name: 'InfiniteHash',
  category: 'compute',
  categoryLabel: 'PoW / SHA-256',

  blurb:
    'Bitcoin mining pool that pays TAO instead of BTC. SHA-256 ASIC miners contribute hashrate; 100% of pool BTC revenue is used to buy back and burn the subnet Alpha token, creating continuous demand-side bid.',

  whatMinersDo:
    'You operate standard Bitcoin SHA-256 ASIC hardware (Antminer S19/S21-class, WhatsMiner M50/M60-class) and point it at the InfiniteHash stratum. Use the worker-name format `infinite.<YOUR_HOTKEY>.<workerID>` so the pool credits your Bittensor hotkey for the shares. The pool credits accepted SHA-256 shares as your on-chain contribution to SN89 — validators score by hashrate and convert to weights. There is no Python miner process to run on a GPU box; the ASIC is the miner.',

  verifiedAt: '2026-06-01',
  verifiedBy: '@editorial',

  emission: '— τ/day',
  burnCostFallback: '— τ',
  minerCountFallback: 0,
  slotCap: 256,

  hardware: [
    {
      role: 'SHA-256 ASIC',
      count: '1+',
      cpuCores: 1,
      ramGb: 1,
      diskGb: 8,
      bandwidth: 'stable home/colo connection',
      notes: 'Antminer S19/S21-class or WhatsMiner M50/M60-class. No GPU. No host workstation needed beyond a one-time control box for wallet/registration.',
    },
    {
      role: 'Control box (one-time)',
      count: '1',
      cpuCores: 2,
      ramGb: 4,
      diskGb: 20,
      notes: 'Any Linux machine with btcli installed — used only to create the wallet and register the hotkey on SN89.',
    },
    {
      role: 'Lightning node (optional — uid curve bonus)',
      count: '0–1',
      cpuCores: 2,
      ramGb: 4,
      diskGb: 100,
      notes: 'Miners running Lightning nodes can earn additional rewards beyond hashrate-based compensation via the "uid curve" mechanism.',
    },
  ],
  hardwareNote:
    'SHA-256 is power-bound. ROI is driven by ASIC efficiency (J/Th) and electricity cost. Pool design pays "Alpha-denominated hashprice designed to exceed BTC hashprice available in market, after pool fees" — so the bet is that Alpha-denominated payouts beat raw BTC payouts net of fees.',

  rentalOk: true,
  rentalNote:
    'Cloud SHA-256 hashrate can be pointed at the pool, but cloud-mining margins are usually too thin to compete. Owning or co-locating ASICs is the standard path.',

  repo: {
    url: 'https://github.com/backend-developers-ltd/InfiniteHash',
    branch: 'main',
  },

  setupShape: 'simple-binary',
  setupOverview:
    'Two-track setup: (1) on any control box, create a Bittensor wallet and register a hotkey on netuid 89 — the hotkey becomes part of your stratum worker name. (2) On each ASIC, configure the pool URL and worker name as `infinite.<YOUR_HOTKEY>.<workerID>`. Validators score by hotkey, so the worker name is load-bearing.',

  install: [
    { step: '(Optional) Clone repo for reference / baseminer plumbing',
      cmd:  'git clone https://github.com/backend-developers-ltd/InfiniteHash && cd InfiniteHash',
      note: 'Repo notes that no subnet-specific configuration is needed beyond the Bittensor baseminer — the actual mining happens on the ASIC, not in Python.' },
    { step: 'Create coldkey + hotkey',
      cmd:  'btcli wallet new_coldkey --wallet.name $WALLET && btcli wallet new_hotkey --wallet.name $WALLET --wallet.hotkey $HOTKEY' },
    { step: 'Register on SN89',
      cmd:  'btcli subnet register --netuid 89 --wallet.name $WALLET --wallet.hotkey $HOTKEY --subtensor.network finney',
      note: 'Re-check burn-cost immediately before — registration costs are not refunded.' },
    { step: 'Get your full hotkey ss58',
      cmd:  'btcli wallet overview --wallet.name $WALLET',
      note: 'The hotkey ss58 address goes into the ASIC worker name.' },
  ],

  runSteps: [
    { step: 'Configure ASIC pool',
      note: 'In the ASIC web UI set: URL = stratum+tcp://btc.global.luxor.tech:700 (or a regional Luxor endpoint) · Worker = infinite.<YOUR_HOTKEY>.<workerID> · Password = x (or per Luxor docs).' },
    { step: 'Use worker IDs to segment farms',
      note: 'Examples from the repo: infinite.5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY.1 or infinite.5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY.warehouse_a — useful for multi-rig attribution while crediting one hotkey.' },
    { step: 'Verify TAO accrual',
      cmd:  'btcli wallet balance --wallet.name $WALLET' },
    { step: '(Optional) Stand up a Lightning node for uid-curve bonus',
      note: 'Miners running Lightning nodes earn additional rewards on top of hashrate score. Refer to operator docs for the exact integration.' },
  ],

  envVars: [
    { name: 'WALLET',  description: 'Coldkey name (matches btcli wallet list)',                        required: true },
    { name: 'HOTKEY',  description: 'Hotkey name — its ss58 is embedded in the ASIC worker name',     required: true },
  ],

  scoring: {
    summary:
      'Validators score hash contribution by reading the hotkey embedded in the ASIC worker name. SHA-256 shares above a minimum hashrate threshold accrue Alpha-denominated rewards. A "uid curve" gives additional rewards to miners running Lightning nodes.',
    rule: 'Per-tempo accepted SHA-256 shares × difficulty (attributed to hotkey via worker name) → weight vector. Optional Lightning-node bonus added through the uid-curve mechanism.',
    cheatPath:
      'Cannot fake SHA-256 shares — Bitcoin proof-of-work is cryptographically verifiable and the pool only credits shares meeting network difficulty. GPU SHA-256 is uncompetitive on J/Th vs modern ASICs, so non-ASIC participation does not pay.',
  },

  profitability: {
    estimatedDailyEmissionPerUid: 0.0,
    tokenPriceUsdFallback: 284,
    capexNote:
      'Capex is in the ASIC. Used S19j Pro / S19 XP runs $1.5k–$4k; new S21 / M60-class is higher. Power cost dominates opex — sub-$0.06/kWh strongly preferred.',
    notes:
      'Bet structure: Alpha-denominated hashprice is engineered to exceed market BTC hashprice (after pool fees). Real BTC revenue → 100% buy-and-burn of Alpha = continuous demand-side bid on the token. Operators that hold Alpha benefit from the burn; operators that immediately sell take base hashprice + emission.',
  },

  milestones: [
    { day: 'day 1',  target: 'Hotkey registered, ASIC submitting accepted shares', note: 'Check the Luxor / InfiniteHash dashboard — worker should be online within minutes.' },
    { day: 'day 3',  target: 'First Alpha emission to hotkey',                      note: 'btcli wallet balance shows non-zero Alpha credited from SN89 weights.' },
    { day: 'day 7',  target: 'Stable share acceptance > 99%',                       note: 'High rejects usually mean stratum latency — switch regional endpoint.' },
    { day: 'day 14', target: 'Out of immunity window, weight stable',               note: 'Compare your share-of-pool hashrate vs share-of-emission — they should track closely.' },
  ],

  monitoring: [
    { metric: 'Accepted shares / hour', threshold: 'matches ASIC nameplate Th/s', where: 'Luxor / InfiniteHash pool dashboard' },
    { metric: 'Reject rate',            threshold: '< 1%',                       where: 'ASIC web UI · pool stats' },
    { metric: 'Stratum latency',        threshold: '< 100 ms',                   where: 'ASIC ping to btc.global.luxor.tech' },
    { metric: 'Alpha balance growth',   threshold: 'rising per tempo',           where: 'btcli wallet balance --wallet.name $WALLET' },
  ],

  knownIssues: [
    { symptom: 'Shares submitting but no Alpha emission', cause: 'Worker name does not include the full hotkey ss58 — validators cannot attribute shares to your hotkey.', fix: 'Re-set the ASIC worker name to exactly `infinite.<YOUR_FULL_HOTKEY_SS58>.<workerID>` (no abbreviation).' },
    { symptom: 'High reject rate (> 5%)',                cause: 'Stratum latency / stale work.',                                                                          fix: 'Switch to a regional Luxor endpoint closer to the rig, or set up a stratum proxy.' },
    { symptom: 'Below minimum hashrate threshold',       cause: 'Single small ASIC may not clear the floor.',                                                              fix: 'Aggregate hashrate across multiple workers under the same hotkey, or co-locate enough machines to clear the threshold.' },
  ],

  notes: [
    'Pool URL: stratum+tcp://btc.global.luxor.tech:700 (Luxor-hosted) — regional alternatives available; check operator docs for the closest endpoint.',
    'Worker-name format is load-bearing — `infinite.<HOTKEY>.<workerID>`. Drop the hotkey and you mine BTC without earning Alpha.',
    '100% of pool BTC revenue is used to buy back and burn Alpha — the token has a structural demand bid as long as the pool earns BTC.',
    'Subnet also runs a Lightning Network economy layer aimed at AI applications; running a Lightning node unlocks the uid-curve bonus.',
  ],
};
