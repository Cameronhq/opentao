import type { RichPlaybook } from '../playbook-rich';

// SN1 — Apex (Macrocosmos). After the v3.0.0 GAN release and the competition
// pivot, miners no longer run a long-lived neuron; they submit Python solutions
// to active competitions via the `apex` CLI. Validators run those solutions
// inside sandboxed evaluators and post weights based on deterministic scores.

export const sn1: RichPlaybook = {
  slug: '1-apex',
  netuid: 1,
  name: 'Apex',
  category: 'reason',
  categoryLabel: 'Reasoning / competition',

  blurb:
    'Submit Python algorithms to live Apex competitions; the validator scores them deterministically in a sandbox and emits TAO to the winners.',

  whatMinersDo:
    "An Apex miner is a competition submitter rather than a long-lived neuron. Using the `apex` CLI, you link your hotkey, pick an open competition (iota Simulator, Energy Arbitrage, RL Tron, etc.), and submit a Python solution that conforms to the competition's baseline function signatures. Validators run the submission in an isolated sandbox with deterministic evaluation; winning submissions earn the round's emissions and the top code is published after a delay.",

  verifiedAt: '2026-06-01',
  verifiedBy: '@editorial',

  emission: '— τ/day',
  burnCostFallback: '— τ',
  minerCountFallback: 0,
  slotCap: 256,

  hardware: [
    {
      role: 'Dev / submission box',
      count: '1',
      cpuCores: 4,
      ramGb: 16,
      diskGb: 50,
      bandwidth: '50 Mbps',
      notes: 'Apex uses sandboxed evaluation on validator-side — you do not host a neuron, so a laptop or small VM is enough. GPU only needed if your local dev/test loop requires it.',
    },
  ],
  hardwareNote:
    'Competition fees are paid in USD-equivalent at submission (e.g. iota Simulator $10, Energy Arbitrage $1, RL Tron $1.40). Rate limit is 4 submissions per hotkey per 24 h.',

  rentalOk: true,
  rentalUsdPerHr: { lambda: 0.5, runpod: 0.4 },

  repo: {
    url: 'https://github.com/macrocosm-os/apex',
    branch: 'main',
    minerEntrypoint: 'apex CLI (no neuron — submissions via `apex submit`)',
  },

  setupShape: 'simple-binary',
  setupOverview:
    "Install the apex CLI, link your registered Bittensor hotkey, browse active competitions, and submit solutions. There is no long-running miner process — submissions are scored by validators on a fixed cadence.",

  install: [
    { step: 'Clone the Apex repo',
      cmd:  'git clone https://github.com/macrocosm-os/apex && cd apex' },
    { step: 'Run the install script (creates venv + CLI)',
      cmd:  './install_cli.sh' },
    { step: 'Activate the venv',
      cmd:  'source .venv/bin/activate' },
    { step: 'Link your registered hotkey',
      cmd:  'apex link',
      note: 'Wallet must be registered on netuid 1 and have enough balance to cover submission fees.' },
    { step: 'List active competitions',
      cmd:  'apex competitions' },
  ],

  runSteps: [
    { step: 'Develop a solution that matches the baseline signature',
      note: "Each competition publishes a baseline; keep function signatures identical or the sandbox runner will reject your submission." },
    { step: 'Submit to a competition',
      cmd:  'apex submit <solution_path> -c <competition_id>',
      note: 'Max 4 submissions per hotkey per 24 h. Pays the fee on-chain at submit time.' },
    { step: 'Watch the leaderboard',
      cmd:  'apex dashboard',
      note: 'Or visit https://iota.macrocosmos.ai / the Apex dashboard URL for live scores.' },
  ],

  envVars: [
    { name: 'WALLET', description: 'Coldkey name (matches btcli wallet list)', required: true },
    { name: 'HOTKEY', description: 'Hotkey name on that coldkey, registered on netuid 1', required: true },
  ],

  scoring: {
    summary:
      "Each competition has a deterministic evaluator. Validators pull your submitted code, run it against held-out test cases in a sandbox, and weight by the score. Winners take full round emissions; the top code is publicly revealed after a delay so other miners can iterate.",
    rule: 'Highest competition-specific score wins. Reproducibility and signature-conformance are pre-requisites — non-conforming submissions are rejected before scoring.',
    sourcePath: 'macrocosm-os/apex · competition definitions in repo',
    cheatPath:
      "Don't deviate from the baseline function signatures (auto-rejected). Don't hardcode test-case answers — competitions hold out evaluation data. Don't burn submission slots on speculative variants — you only get 4/24h.",
  },

  profitability: {
    estimatedDailyEmissionPerUid: 0,
    tokenPriceUsdFallback: 284,
    capexNote:
      'Effectively zero hardware cost — the cost is competition fees + your ML engineering time. Per-competition prizes vary; check the Apex dashboard for current pools.',
    notes:
      "Profit profile is winner-take-most per competition round. If you don't place top 3, you may only recoup the fee. Best for ML researchers, not capex-heavy miners.",
  },

  milestones: [
    { day: 'day 1', target: 'Hotkey linked + first submission accepted', note: 'Confirm submission shows in `apex dashboard`.' },
    { day: 'day 3', target: 'Score above baseline on at least one competition', note: 'If you cannot beat baseline, switch competitions before burning more fees.' },
    { day: 'day 7', target: 'Top-10 on one competition', note: 'Most emission concentrates on top-3; top-10 is the right intermediate goal.' },
    { day: 'day 14', target: 'Win a round', note: 'Iterate on the published winning code after the reveal delay to climb faster.' },
  ],

  monitoring: [
    { metric: 'Submission status',     threshold: 'accepted',     where: 'apex dashboard / leaderboard page' },
    { metric: 'Per-competition rank',  threshold: 'top-10',       where: 'apex dashboard' },
    { metric: 'Daily submissions used', threshold: '< 4',         where: 'apex CLI output' },
    { metric: 'Wallet balance',         threshold: '> 5 τ',       where: 'btcli wallet overview' },
  ],

  knownIssues: [
    {
      symptom: 'Submission rejected before scoring',
      cause:   "Function signature drifted from the baseline; sandbox runner can't call your code.",
      fix:     "Diff your file against the competition baseline — keep argument names, return types, and class names identical.",
    },
    {
      symptom: 'Score is zero / very low across all attempts',
      cause:   'Solution relies on hardcoded outputs or imports unavailable inside the sandbox.',
      fix:     'Read the competition `requirements.txt` whitelist. Test locally against the published validation harness before submitting.',
    },
    {
      symptom: '`apex submit` fails with insufficient funds',
      cause:   "Wallet doesn't hold enough TAO/alpha to cover the competition fee.",
      fix:     'Top up the coldkey or pick a cheaper competition (e.g. Energy Arbitrage $1).',
    },
    {
      symptom: 'Rate-limited after 4 submissions',
      cause:   'Per-hotkey daily cap.',
      fix:     'Use multiple registered hotkeys, or wait for the 24 h window to reset.',
    },
  ],

  notes: [
    "Apex repo is the primary source: https://github.com/macrocosm-os/apex.",
    'Full operator docs: https://docs.macrocosmos.ai/subnets/subnet-1-apex.',
    'After the v3.0.0 GAN release (Aug 2025) Apex pivoted from prompting to competitions — old miner.py guides are obsolete.',
    'Top winning code is published after a delay; fork it as a head-start on the next round.',
  ],
};
