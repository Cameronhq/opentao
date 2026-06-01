import type { RichPlaybook } from '../playbook-rich';

// SN38 — TAO Colosseum. NOT a traditional "run a miner" subnet — mining is
// gameplay on Bittensor EVM. Two game versions: RPS Tournament (current) and
// Underdog Betting (legacy). Repo is ARCHIVED (May 2026) but the games and
// EVM contracts continue. Validators index on-chain activity; no miner.py to run.

export const sn38: RichPlaybook = {
  slug: '38-colosseum',
  netuid: 38,
  name: 'TAO Colosseum',
  category: 'compute',
  categoryLabel: 'On-chain Game',

  blurb:
    'Bittensor EVM gaming subnet — mining is gameplay, not inference. Current game: single-elimination Rock-Paper-Scissors with commit/reveal. Legacy: Underdog betting (minority side wins) with 7-day time-decayed activity scoring. Repo archived May 2026; games still live on EVM.',

  whatMinersDo:
    "There is NO miner daemon to run on SN38. After registering a hotkey and linking your Bittensor coldkey to an EVM wallet via dual signatures (proves both sides), you play games on the TAO Colosseum dApp using native TAO on Bittensor EVM. Validators index your EVM gameplay activity (RPS tournament wins or Underdog bet volume) and convert it to miner weights. Your edge is game-theoretic — strategy, timing, bet sizing — not compute.",

  verifiedAt: '2026-06-01',
  verifiedBy: '@editorial',

  emission: '— τ/day',
  burnCostFallback: '— τ',
  minerCountFallback: 0,
  slotCap: 256,

  hardware: [
    {
      role: 'Wallet-only client',
      count: '1',
      cpuCores: 2,
      ramGb: 4,
      diskGb: 20,
      bandwidth: 'normal home internet',
      notes: 'No node to host. You need a browser, MetaMask, and btcli to sign two messages. Anything that runs a browser works.',
    },
  ],
  hardwareNote:
    'There is no neuron daemon for SN38 miners. The "miner" is your wallet + your gameplay. Treat this as DeFi / on-chain gaming infra, not as Bittensor compute.',

  rentalOk: true,
  rentalNote: 'N/A — no compute to rent.',

  repo: {
    url: 'https://github.com/TAO-Colosseum/tao-colosseum-subnet',
    branch: 'main',
    extraRepos: [
      { name: 'taocolosseum.com', url: 'https://www.taocolosseum.com/', purpose: 'Game dApp (where you actually play)' },
      { name: 'casinotao.com', url: 'https://casinotao.com/', purpose: 'Sister property — same operator team' },
    ],
  },

  setupShape: 'simple-binary',
  setupOverview:
    'No software install in the traditional sense. (1) Register hotkey on SN38. (2) Link your coldkey to an EVM wallet on Bittensor EVM via dual-signature on the Colosseum frontend. (3) Bridge TAO to Bittensor EVM. (4) Play games (RPS tournaments or Underdog bets). Validators index your on-chain activity and emit weights.',

  install: [
    { step: 'Register your hotkey on SN38',
      cmd:  'btcli subnet register --netuid 38 --wallet.name $WALLET --wallet.hotkey $HOTKEY' },
    { step: 'Get TAO onto Bittensor EVM',
      note: 'Use the official Bittensor EVM bridge. Default RPC: https://lite.chain.opentensor.ai' },
    { step: 'Link coldkey ↔ EVM wallet',
      note: 'On taocolosseum.com, sign a message from both your Bittensor coldkey and your EVM wallet. This dual-signature prevents someone else from mapping your coldkey to their address.' },
  ],

  runSteps: [
    { step: 'Open the dApp and play',
      note: 'For RPS: enter tournaments, follow commit/reveal flow. For Underdog (legacy): place bets ≥ 0.001 TAO; minority side wins; 1.5% platform fee; each round ~20 min.' },
    { step: 'Check your indexed activity',
      cmd:  'btcli subnet metagraph --netuid 38',
      note: 'Validator picks up your gameplay roughly each tempo. Score updates within 1–2 epochs.' },
  ],

  envVars: [
    { name: 'WALLET',             description: 'Bittensor coldkey name', required: true },
    { name: 'HOTKEY',             description: 'Bittensor hotkey name',  required: true },
    { name: 'BITTENSOR_EVM_RPC',  description: 'Default https://lite.chain.opentensor.ai', required: false },
  ],

  scoring: {
    summary:
      'Validators index on-chain gameplay activity over a rolling 7-day window with day-of-bet weighting (today=1.0, day-6=0.10). RPS tournament wins and Underdog bet volume both feed activity scores; only the active game version is weighted at any given time.',
    rule: 'Earn by being consistently active and skilled. Recent activity dominates older activity 10×. Smarter play (winning RPS, picking the minority side in Underdog) compounds the activity multiplier.',
    cheatPath:
      "Sybil splitting doesn't help — registration cost and game fees neutralize multi-UID strategies. Wash-betting against yourself burns the 1.5% fee every round with no scoring upside (the validator deduplicates by EVM linkage).",
  },

  profitability: {
    estimatedDailyEmissionPerUid: 0.0,
    tokenPriceUsdFallback: 284,
    capexNote: 'No hardware capex. Your capex is the TAO you bring to play — at minimum a few TAO to make scoring meaningful + gas.',
    notes:
      'Game-theoretic earnings, not deterministic. Treat this as a poker bankroll, not a compute farm. Repo archived May 2026 — confirm game is still actively rewarded on-chain before depositing.',
  },

  milestones: [
    { day: 'day 1', target: 'Hotkey registered, EVM wallet linked, first game played',
      note: 'Verify the link succeeded on the dApp profile page.' },
    { day: 'day 3', target: 'Indexed by validator, weight > 0',
      note: 'btcli subnet metagraph --netuid 38 shows non-zero incentive on your UID.' },
    { day: 'day 7', target: 'Full 7-day decay window populated',
      note: 'Your score reflects sustained activity, not just opening burst.' },
  ],

  monitoring: [
    { metric: 'EVM ↔ coldkey link status', threshold: 'linked', where: 'taocolosseum.com profile' },
    { metric: 'Daily activity (bets / RPS games)', threshold: '> 0', where: 'EVM block explorer · dApp history' },
    { metric: 'Per-tempo incentive', threshold: 'rising', where: 'btcli subnet metagraph --netuid 38' },
  ],

  knownIssues: [
    {
      symptom: 'Repo archived (May 2026) — code is read-only',
      cause:   'The miner/validator code repo was archived. Smart contracts and the dApp remain live.',
      fix:     'Do not expect repo updates. Confirm on Discord / Twitter that the game is still actively rewarded before committing TAO.',
    },
    {
      symptom: 'Coldkey-to-EVM link rejected',
      cause:   'Either signature was wrong, or someone else already linked that EVM address.',
      fix:     'Use a fresh EVM address and re-sign from both sides. The dual-signature is anti-impersonation by design.',
    },
    {
      symptom: 'Score doesn\'t reflect recent gameplay',
      cause:   'Time-decay window — recent activity is heavily weighted but only refreshes per tempo.',
      fix:     'Wait one full tempo (~72 min). If still zero after 24h, re-verify EVM link on the dApp.',
    },
  ],

  notes: [
    'Repo archived 2026-05-08. Treat SN38 as a maintenance-mode subnet. Confirm activity / emission before committing capital.',
    'Mining = gameplay. There is no python neurons/miner.py for this subnet. Anyone telling you to "run a miner" on SN38 is wrong.',
  ],
};
