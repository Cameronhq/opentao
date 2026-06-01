import type { RichPlaybook } from '../playbook-rich';

// SN94 — Bitsota. Decentralized ML research competition with SOTA-or-zero scoring
// (hidden test sets, only verified breakthroughs earn). One-click desktop miner.

export const sn94: RichPlaybook = {
  slug: '94-bitsota',
  netuid: 94,
  name: 'Bitsota',
  category: 'reason',
  categoryLabel: 'ML Research',

  blurb:
    'Decentralized ML competition. Miners run genetic-programming search (up to 150 generations) to evolve algorithms beating the current best baseline on hidden test sets. Beat the leaderboard or earn nothing — no participation prizes. Desktop GUI or CLI mining.',

  whatMinersDo:
    "A Bitsota miner targets an active ML challenge (e.g. CIFAR-10 binary classification) and runs the protocol's genetic-programming engine to evolve a model over up to 150 generations. You can train freely on the public split, but validators evaluate on a hidden test set that's committed per challenge — only models that beat the current best baseline earn weight. Two modes: Direct (you evolve and submit solo) or Pool (collaborative — participants take smaller evolution slices and share rewards).",

  verifiedAt: '2026-06-01',
  verifiedBy: '@editorial',

  emission: '— τ/day',
  burnCostFallback: '— τ',
  minerCountFallback: 0,
  slotCap: 256,

  hardware: [
    {
      role: 'CPU/GPU node',
      count: '1',
      cpuCores: 4,
      ramGb: 8,
      diskGb: 20,
      bandwidth: 'standard',
      notes: 'Minimum per README: Python 3.10+, 4 GB RAM, 2 GB storage. Add a GPU (4090 / 3090 / A6000 class) if you want competitive throughput on larger challenges.',
    },
  ],
  hardwareNote:
    "Entry bar is intentionally low — the desktop GUI miner runs on a laptop. Competitive miners running serious evolution should provision an enthusiast-grade GPU and more RAM than the listed minimum.",

  rentalOk: true,
  rentalUsdPerHr: { lambda: 0.50, runpod: 0.40, coreweave: 0.60 },

  repo: {
    url: 'https://github.com/AlveusLabs/SN94-BitSota',
    branch: 'main',
    minerEntrypoint: 'docs/mining.md',
  },

  setupShape: 'simple-binary',
  setupOverview:
    'Two entry paths: (1) Desktop GUI — download from bitsota.ai, import hotkey, pick mode, mine; (2) CLI — clone the repo, install deps, run the miner targeting active challenges. The desktop path is recommended for new operators; CLI is for production or pool participants.',

  install: [
    { step: 'Clone the miner repo (CLI path)',
      cmd:  'git clone https://github.com/AlveusLabs/SN94-BitSota.git && cd BitSota' },
    { step: 'Install Python dependencies',
      cmd:  'pip install -r requirements.txt && pip install -e .' },
    { step: 'Register hotkey on SN94',
      cmd:  'btcli subnet register --netuid 94 --wallet.name $WALLET --wallet.hotkey $HOTKEY' },
    { step: 'Pick a mining mode — Direct or Pool',
      note: 'Direct: individual miners evolve algorithms locally and submit. Pool: collaborative, smaller evolution tasks. See docs/mining.md and docs/pool-mining.md.' },
    { step: 'Desktop GUI alternative',
      note: 'Download from https://bitsota.ai → install → import hotkey → choose Direct or Pool → start.' },
  ],

  runSteps: [
    { step: 'Run Direct mining (refer to docs/mining.md for exact entrypoint)',
      note: 'The repo ships docs/mining.md, docs/pool-mining.md, and docs/local-testing.md as canonical execution guides.' },
    { step: 'Confirm on metagraph',
      cmd:  'btcli subnet metagraph --netuid 94' },
  ],

  envVars: [
    { name: 'WALLET', description: 'Coldkey name', required: true },
    { name: 'HOTKEY', description: 'Hotkey name',  required: true },
  ],

  scoring: {
    summary:
      "SOTA-or-zero. Validators hold a hidden test set per challenge; you can train freely on the public split, but only the held-out score determines weight. Models beating the current best baseline produce nonzero weight; those that don't produce zero. No participation prizes.",
    rule: 'Beat the current best on the hidden test set. Iterate the genetic-programming engine (up to 150 generations) and submit only when you have a confirmed local SOTA candidate.',
    cheatPath: 'Overfitting to the public split — Bitsota commits hidden test sets per challenge, so any leaderboard gaming on public data evaluates to zero on hidden splits.',
  },

  profitability: {
    estimatedDailyEmissionPerUid: 0.0,
    tokenPriceUsdFallback: 284,
    capexNote:
      'Hardware is cheap — single enthusiast GPU is enough for current challenges. Real "capex" is your ML research time vs. probability of beating SOTA.',
    notes:
      'Heavy-tailed: a miner who actually beats SOTA on one challenge takes a disproportionate share. Median miner earns close to zero. Pool mode smooths variance.',
  },

  milestones: [
    { day: 'day 1',  target: 'Desktop miner / CLI miner running, hotkey registered', note: 'Active challenge picked, evolution loop running.' },
    { day: 'day 3',  target: 'First submission evaluated',                            note: 'Validator returned a hidden-test-set score. If below baseline → zero weight, keep iterating.' },
    { day: 'day 7',  target: 'Local SOTA candidate identified',                       note: 'Your genetic-programming search has surfaced at least one model beating the current best on cross-validated public splits.' },
    { day: 'day 14', target: 'Confirmed SOTA submission on hidden set',               note: 'If still nothing, switch challenges or consider Pool mining for steady earn.' },
    { day: 'day 30', target: 'Either consistent SOTA gains or Pool earnings',         note: 'Direct mode without any SOTA = zero earn. Re-evaluate strategy after 30d.' },
  ],

  monitoring: [
    { metric: 'Genetic-programming generations completed', threshold: 'up to 150', where: 'Miner logs / desktop GUI dashboard' },
    { metric: 'Local cross-val accuracy vs. baseline',     threshold: '> baseline',where: 'Internal eval — proxy for hidden-set performance' },
    { metric: 'Submission acceptance',                     threshold: 'OK',         where: 'Validator response logs' },
    { metric: 'Per-tempo incentive',                       threshold: 'rising or flat (Direct = stepwise; Pool = smooth)', where: 'btcli subnet metagraph --netuid 94' },
  ],

  knownIssues: [
    {
      symptom: 'Zero earnings despite many generations',
      cause:   'Your evolved model does not beat the current best on the hidden test set — Direct mode pays nothing for partial credit.',
      fix:     'Switch to Pool mining for steady earn, or pivot to a less-saturated challenge where the current best is closer to your candidate.',
    },
    {
      symptom: 'Overfitting — high public-split accuracy, zero hidden-set score',
      cause:   'Excessive search on the public split without proper held-out validation.',
      fix:     'Reserve a local held-out split, validate before submitting, and treat any submission with public-split-only validation as throwaway.',
    },
    {
      symptom: 'Desktop GUI fails to import hotkey',
      cause:   'Wallet directory permissions or wrong wallet path.',
      fix:     'Verify ~/.bittensor/wallets/$WALLET/hotkeys/$HOTKEY exists and is readable; fall back to CLI miner if GUI continues to fail.',
    },
  ],

  notes: [
    'Eval pipeline per README is "fixed CIFAR-10 binary evaluation" for current challenges — anchor your eval discipline to that.',
    'Pool mining is the steady-earn fallback if you can\'t reliably beat SOTA solo.',
    'Bounty supply (external problem owners) is the leading economic indicator — monitor challenge volume.',
  ],
};
