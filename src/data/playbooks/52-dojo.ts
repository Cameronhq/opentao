import type { RichPlaybook } from '../playbook-rich';

// SN52 — Dojo (Tensorplex)
// Atypical mining: no neuron server to run. You register a hotkey, load it
// into a browser wallet (e.g. Talisman) and complete labeling tasks through
// the Dojo web app. "Hardware" is your team of human labelers.

export const sn52: RichPlaybook = {
  slug: '52-dojo',
  netuid: 52,
  name: 'Dojo',
  category: 'data',
  categoryLabel: 'Human Data',

  blurb:
    'Browser-based human preference labeling. No miner server — you register a hotkey, load it into a browser wallet, and your labeler team completes tasks at dojo.network.',
  whatMinersDo:
    "Receive preference / ranking / rating tasks across text, code, UI design, and 3D modalities through the Dojo web app at dojo.network (or testnet.dojo.network on netuid 98). You — or your team of trained human labelers — complete those tasks; submissions are scored against synthetic ground-truth tasks the validator slipped into the stream, plus cross-miner agreement and anti-Sybil checks. No Python miner to keep alive — but the validator side IS a Docker compose stack.",

  verifiedAt: '2026-06-01',
  verifiedBy: '@editorial',

  emission: '— τ/day',
  burnCostFallback: '— τ',
  minerCountFallback: 0,
  slotCap: 256,

  hardware: [
    {
      role: 'Labeler workstation',
      count: '1 per labeler',
      cpuCores: 4,
      ramGb: 8,
      diskGb: 50,
      notes: 'Modern browser + Talisman / Polkadot.js extension holding the registered hotkey. The "compute" is your humans, not your CPU.',
    },
  ],
  hardwareNote:
    'No miner-side servers, GPUs, or open ports. The real constraint is sourcing trustworthy, attentive labelers — Sybil/bot patterns get caught and zeroed within a tempo.',

  rentalOk: true,
  rentalNote:
    'Cloud GPUs not relevant — the cost center is labeler payroll, not silicon.',

  repo: {
    url: 'https://github.com/tensorplex-labs/dojo',
    branch: 'main',
    extraRepos: [
      { name: 'docs',           url: 'https://docs.tensorplex.ai/tensorplex-docs/tensorplex-dojo-bittensor-subnet/subnet-mechanism', purpose: 'Subnet mechanism doc' },
      { name: 'mainnet app',    url: 'https://dojo.network',         purpose: 'Where labelers complete tasks' },
      { name: 'testnet app',    url: 'https://testnet.dojo.network', purpose: 'Testnet (netuid 98)' },
    ],
  },

  setupShape: 'simple-binary',
  setupOverview:
    'Mining setup is just two steps: register your hotkey on netuid 52, import that hotkey into Talisman, then start completing tasks at dojo.network. There is no `python neurons/miner.py` for miners. (Validators run a Docker compose stack with Redis + Loki driver + OpenRouter key — see docs/validator.md.)',

  install: [
    { step: 'Install btcli',                 cmd: 'pip install bittensor-cli' },
    { step: 'Register hotkey (mainnet)',     cmd: 'btcli s register --netuid 52 --wallet.name $WALLET --wallet.hotkey $HOTKEY' },
    { step: 'Register hotkey (testnet)',     cmd: 'btcli s register --network test --netuid 98 --wallet.name $WALLET --wallet.hotkey $HOTKEY',
      note: 'Optional — use to practise before mainnet burn.' },
    { step: 'Install Talisman or Polkadot.js extension', note: 'Browser wallet must support Substrate accounts.' },
    { step: 'Import hotkey into Talisman',   note: 'Use the JSON / mnemonic from ~/.bittensor/wallets/$WALLET/hotkeys/$HOTKEY.' },
  ],

  runSteps: [
    { step: 'Open the app', note: 'Mainnet: https://dojo.network · Testnet: https://testnet.dojo.network' },
    { step: 'Connect Talisman', note: 'Select the imported hotkey when the dApp prompts.' },
    { step: 'Complete tasks', note: 'Tasks appear as preference rankings, quality ratings, etc. Your labeler(s) submit in-app.' },
    { step: 'Verify on metagraph', cmd: 'btcli subnet metagraph --netuid 52' },
  ],

  envVars: [
    { name: 'WALLET', description: 'Coldkey name', required: true },
    { name: 'HOTKEY', description: 'Hotkey name registered on SN52', required: true },
  ],

  scoring: {
    summary:
      'Validators slip synthetic-ground-truth tasks into the stream (correct answer known to the validator, invisible to the miner). A miner whose labelers consistently match those hidden answers proves they have real attentive humans on the other end. Anti-Sybil tooling (obfuscation, behavior fingerprinting) catches bot-labeling, copy-paste farms, and duplicate teams.',
    rule: 'Label accuracy on synthetic-ground-truth tasks + cross-validator agreement + authenticity-of-source.',
    cheatPath:
      "Pasting LLM-generated preferences instead of human ones doesn't survive — synthetic ground truth catches the systematic biases of any single LLM grader. Bot-labeling pipelines have a measured half-life of about one tempo.",
  },

  profitability: {
    estimatedDailyEmissionPerUid: 0.0,
    tokenPriceUsdFallback: 284,
    capexNote:
      'Capex is labeler hiring + training. No GPU spend.',
    notes:
      'Network has collected 3M+ human-generated data points; top miners run multi-person labeler teams with internal QA.',
  },

  milestones: [
    { day: 'day 1',  target: 'Hotkey registered + Talisman connected', note: 'You can see tasks in the Dojo app.' },
    { day: 'day 3',  target: 'First labels submitted',                 note: 'Watch for early-quality signal in your dashboard.' },
    { day: 'day 7',  target: 'Score above synthetic-baseline threshold', note: 'Validators are confident your labelers are real humans.' },
    { day: 'day 14', target: 'Stable rank on leaderboard',             note: 'If still bottom-half, suspect: labeler drift, LLM-paste suspicion, or Sybil-flag from duplicate teams.' },
  ],

  monitoring: [
    { metric: 'Label submission rate',       threshold: 'matches task availability', where: 'Dojo app dashboard' },
    { metric: 'Synthetic-ground-truth match rate', threshold: '> network median', where: 'Dojo app analytics' },
    { metric: 'Per-tempo incentive',         threshold: 'rising/flat',             where: 'btcli subnet metagraph --netuid 52' },
  ],

  knownIssues: [
    { symptom: 'Talisman cannot import hotkey',
      cause:   'Wrong file (coldkey vs hotkey) or wrong format.',
      fix:     'Use ~/.bittensor/wallets/$WALLET/hotkeys/$HOTKEY (JSON) or its mnemonic.' },
    { symptom: 'Tasks not appearing in app',
      cause:   'Hotkey not registered on SN52 yet, or wallet not connected.',
      fix:     '`btcli subnet metagraph --netuid 52` to confirm UID; reconnect Talisman.' },
    { symptom: 'Score zero after a few tempos',
      cause:   'Synthetic ground-truth probes failed — labelers may be using LLM completions, or are bot-driven.',
      fix:     'Tighten labeler QA. Bot-labeling half-life is ~1 tempo before detection.' },
  ],

  notes: [
    'No `python neurons/miner.py` to keep alive — Dojo is the rare "browser-wallet mining" subnet.',
    'Validators DO run a Docker compose stack with Bittensor + Redis + Loki driver + OpenRouter key — see docs/validator.md.',
    'Use testnet (netuid 98) to dry-run labeler workflows before paying mainnet registration burn.',
  ],
};
