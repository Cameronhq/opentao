import type { RichPlaybook } from '../playbook-rich';

// SN80 — DogeLayer. Scrypt merged-mining pool that pays in LTC + DOGE + TAO Alpha.
// Not a GPU/ML subnet — work is real Scrypt proof-of-work from ASIC hardware.
// Setup is unusual: you do not run neurons/miner.py on a GPU box; you point
// existing Scrypt ASICs at the DogeLayer stratum using your Bittensor hotkey
// as the stratum username. The dogelayer-ai/dogelayer repo carries a small
// Python helper for wallet/registration plumbing.

export const sn80: RichPlaybook = {
  slug: '80-dogelayer',
  netuid: 80,
  name: 'DogeLayer',
  category: 'compute',
  categoryLabel: 'PoW / Scrypt',

  blurb:
    'Scrypt merged-mining pool that pays DOGE, LTC, and TAO Alpha from one rig. Point an Antminer L7/L9 (or any Scrypt ASIC) at the DogeLayer stratum with your hotkey as the username and accrue all three rewards.',

  whatMinersDo:
    'You operate standard Scrypt ASIC hardware (Antminer L7/L9-class, Goldshell LT/Mini-Doge) and point it at the DogeLayer stratum. The pool credits accepted Scrypt shares toward LTC + DOGE block rewards in the normal way, and the same shares are tallied on chain as your contribution to SN80 — validators convert hashrate into a weight vector each tempo. There is no GPU work and no Python neurons/miner.py to babysit; the ASIC is the miner.',

  verifiedAt: '2026-06-01',
  verifiedBy: '@editorial',

  emission: '— τ/day',
  burnCostFallback: '— τ',
  minerCountFallback: 0,
  slotCap: 256,

  hardware: [
    {
      role: 'Scrypt ASIC',
      count: '1+',
      cpuCores: 1,
      ramGb: 1,
      diskGb: 8,
      bandwidth: 'stable home/colo connection',
      notes: 'Antminer L7 (~9.5 Gh/s) or L9 / Goldshell LT-class. No GPU. No host workstation needed beyond a Bittensor-capable machine for one-time wallet/registration.',
    },
    {
      role: 'Control box (one-time)',
      count: '1',
      cpuCores: 2,
      ramGb: 4,
      diskGb: 20,
      notes: 'Any Linux machine with Python 3.9+ and btcli installed — used only to create the wallet and register the hotkey on SN80.',
    },
  ],
  hardwareNote:
    'Scrypt PoW is power-bound, not compute-bound. ROI is driven by ASIC efficiency (J/Mh) and your electricity cost, not by adding GPU horsepower.',

  rentalOk: true,
  rentalNote:
    'Renting hashrate from Scrypt cloud-mining services works in theory, but cloud-mining margins are thin once pool dynamics are factored in. Owning or co-locating ASICs is the standard path.',

  repo: {
    url: 'https://github.com/dogelayer-ai/dogelayer',
    branch: 'main',
  },

  setupShape: 'simple-binary',
  setupOverview:
    'Two-track setup: (1) on any control box, create a Bittensor wallet and register a hotkey on netuid 80 — this hotkey becomes your stratum username. (2) On each Scrypt ASIC, configure the pool URL, paste your hotkey as the username, and set password = x. There is no long-running miner process to keep alive on a server.',

  install: [
    { step: 'Clone helper repo (wallet/registration tooling)',
      cmd:  'git clone https://github.com/dogelayer-ai/dogelayer.git && cd dogelayer' },
    { step: 'Create Python venv',
      cmd:  'python3 -m venv venv && source venv/bin/activate' },
    { step: 'Install package',
      cmd:  'pip install --upgrade pip && pip install -e .' },
    { step: 'Create coldkey + hotkey',
      cmd:  'btcli wallet new_coldkey --wallet.name my_miner && btcli wallet new_hotkey --wallet.name my_miner --wallet.hotkey default' },
    { step: 'Register on SN80',
      cmd:  'btcli subnet register --wallet.name my_miner --wallet.hotkey default --netuid 80 --subtensor.network finney',
      note: 'Re-check burn-cost immediately before registering — it spikes unpredictably.' },
  ],

  runSteps: [
    { step: 'Get your full 48-character hotkey address',
      cmd:  'btcli wallet overview --wallet.name my_miner',
      note: 'The ss58 address of the hotkey is your stratum username.' },
    { step: 'Configure ASIC pool (one rig)',
      note: 'In the ASIC web UI set: URL = stratum+tcp://sn80-stratum.dogelayer.ai:3331 · Worker = <YOUR_48_CHAR_HOTKEY> · Password = x. Backup URL = stratum+tcp://stratum.dogelayer.ai:3331.' },
    { step: 'Configure ASIC pool (multiple rigs)',
      note: 'Use Worker = <HOTKEY>.worker01, <HOTKEY>.worker02, … so the pool can attribute shares per rig while crediting one hotkey.' },
    { step: 'Verify TAO accrual',
      cmd:  'btcli wallet balance --wallet.name my_miner',
      note: 'LTC/DOGE earnings show on the DogeLayer dashboard and require manual withdrawal (1–3 business days).' },
  ],

  envVars: [
    { name: 'WALLET',  description: 'Coldkey name (matches btcli wallet list)', required: true },
    { name: 'HOTKEY',  description: 'Hotkey name on that coldkey — its ss58 is the stratum username', required: true },
  ],

  scoring: {
    summary:
      'Real Scrypt hashrate is the work — accepted shares accumulated over the tempo are the score. Pool stratum verifies share PoW cryptographically; validators read share telemetry and convert into weights.',
    rule: 'Per-tempo accepted shares × difficulty → normalized weight vector across active hotkeys. LTC/DOGE block rewards are paid pari passu so on-chain emissions and off-chain coin rewards track the same hashrate.',
    cheatPath:
      'Cannot fake shares — Scrypt PoW is cryptographically verifiable and pool only credits shares meeting network difficulty. GPU Scrypt mining is uncompetitive on J/Mh vs L7/L9-class ASICs, so non-ASIC participation does not pay.',
  },

  profitability: {
    estimatedDailyEmissionPerUid: 0.0,
    tokenPriceUsdFallback: 284,
    capexNote:
      'Capex is in the ASIC itself. Used L7 (9.5 Gh/s) prices fluctuate $1k–$3k; new L9 (16 Gh/s) is higher. Power is the dominant opex — sub-$0.06/kWh strongly preferred.',
    notes:
      'Triple-revenue thesis: LTC block rewards + DOGE merged-mining + SN80 Alpha emissions on the same shares. Pool fee advertised as 0%; verify on the DogeLayer site before committing hashrate.',
  },

  milestones: [
    { day: 'day 1',  target: 'Hotkey registered, ASIC submitting accepted shares', note: 'Check the DogeLayer dashboard — your worker should be visible within minutes of pool configuration.' },
    { day: 'day 3',  target: 'First TAO emission to hotkey', note: 'btcli wallet balance shows non-zero TAO/Alpha credited from SN80 weights.' },
    { day: 'day 7',  target: 'Stable share acceptance > 99%', note: 'Rejected shares should be < 1% — high rejects usually mean stale work due to bad latency to the stratum.' },
    { day: 'day 14', target: 'Out of immunity window, weight stable', note: 'Compare your share-of-pool hashrate vs share-of-emission — they should track closely.' },
  ],

  monitoring: [
    { metric: 'Accepted shares / hour', threshold: 'matches ASIC nameplate Gh/s', where: 'DogeLayer pool dashboard' },
    { metric: 'Reject rate',            threshold: '< 1%',                       where: 'ASIC web UI · pool stats' },
    { metric: 'Stratum latency',        threshold: '< 100 ms',                   where: 'ASIC ping to sn80-stratum.dogelayer.ai' },
    { metric: 'TAO balance growth',     threshold: 'rising per tempo',           where: 'btcli wallet balance --wallet.name $WALLET' },
  ],

  knownIssues: [
    { symptom: 'Shares submitting but no TAO emission', cause: 'Hotkey not registered on SN80, or pool worker username is not the exact ss58 hotkey address.', fix: 'Re-run btcli subnet register --netuid 80, then in the ASIC UI paste the full 48-char ss58 (case-sensitive) as the worker name.' },
    { symptom: 'High reject rate (> 5%)', cause: 'Latency / stale work — common when the ASIC is far from the stratum endpoint.', fix: 'Switch to the backup stratum (stratum.dogelayer.ai:3331) or set up a stratum proxy closer to your rig.' },
    { symptom: 'LTC/DOGE not paid out', cause: 'Pool requires manual withdrawal via the DogeLayer site; payouts are not automatic to the ASIC.', fix: 'Log in to the DogeLayer dashboard, link payout addresses, and submit a withdrawal request (1–3 business day processing).' },
  ],

  notes: [
    'Multi-rig farms: use <HOTKEY>.workerNN suffixes so the pool attributes shares per rig but credits one hotkey.',
    'Pool fee advertised as 0% permanently; verify on the official DogeLayer site before committing hashrate.',
    'No GPU, no neurons/miner.py — if you are looking for a "python miner.py" workflow this is the wrong subnet.',
  ],
};
