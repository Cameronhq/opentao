import type { RichPlaybook } from '../playbook-rich';

// SN53 — EfficientFrontier (SignalPlus)
// Minimal-public-info subnet. The miner repo URL referenced from subnet
// metadata (github.com/EfficientFrontier-SignalPlus/EfficientFrontier) is
// not publicly accessible as of 2026-06-01 — likely private or moved.
// Mining requires a SignalPlus account and real exchange connectivity.

export const sn53: RichPlaybook = {
  slug: '53-efficientfrontier',
  netuid: 53,
  name: 'EfficientFrontier',
  category: 'reason',
  categoryLabel: 'Trading',

  blurb:
    'Live PnL competition via SignalPlus. Miners are real traders; the subnet reads signed account metrics and rewards risk-adjusted performance.',
  whatMinersDo:
    "Operate a real crypto trading strategy on the SignalPlus platform with real capital. SignalPlus aggregates execution to major venues and signs your account metrics (balance, equity, PnL, drawdown). Validators pull those signed payloads via the SignalPlus public API, compute risk-adjusted rankings, and submit weights. You are not running a typical neurons/miner.py — you are running a strategy.",

  verifiedAt: '2026-06-01',
  verifiedBy: '@editorial',

  emission: '— τ/day',
  burnCostFallback: '— τ',
  minerCountFallback: 0,
  slotCap: 192,

  hardware: [
    {
      role: 'Trader workstation / strategy host',
      count: '1',
      cpuCores: 4,
      ramGb: 8,
      diskGb: 50,
      bandwidth: 'low-latency to SignalPlus + your exchange',
      notes: 'Whatever your strategy needs. No GPU requirement from the subnet itself.',
    },
  ],
  hardwareNote:
    'The competitive bar is strategy quality and risk discipline, not infrastructure. Latency only matters for HFT-style strategies.',

  rentalOk: true,
  rentalUsdPerHr: { lambda: 0.10, runpod: 0.08, coreweave: 0.12 },

  repo: {
    url: 'https://github.com/EfficientFrontier-SignalPlus/EfficientFrontier',
    branch: 'main',
    extraRepos: [
      { name: 'SignalPlus', url: 'https://www.signalplus.com/', purpose: 'Operator + onboarding surface' },
    ],
  },

  setupShape: 'simple-binary',
  setupOverview:
    'The mining flow has two layers: (1) get a SignalPlus account with exchange connectivity and start trading; (2) register a Bittensor hotkey on SN53 and link it to your SignalPlus account so validators can attribute your signed metrics to your UID. The public Bittensor-side repo is currently not publicly accessible (HTTP 404 as of 2026-06-01) — onboarding is gated by SignalPlus directly.',

  install: [
    { step: 'Open a SignalPlus account', note: 'Required prerequisite. The subnet reads signed metrics from this account, so the venue matters.' },
    { step: 'Connect exchange(s) to SignalPlus', note: 'Spot / perp venues — whatever your strategy trades.' },
    { step: 'Install btcli', cmd: 'pip install bittensor-cli' },
    { step: 'Register hotkey', cmd: 'btcli subnet register --netuid 53 --wallet.name $WALLET --wallet.hotkey $HOTKEY' },
    { step: 'Link hotkey to SignalPlus account', note: 'Coordination flow not documented in a public README — coordinate via SignalPlus support / their SN53 channel.' },
  ],

  runSteps: [
    { step: 'Trade', note: 'Run your strategy on SignalPlus. The "miner" is just your live account.' },
    { step: 'Verify on metagraph', cmd: 'btcli subnet metagraph --netuid 53' },
  ],

  envVars: [
    { name: 'WALLET', description: 'Coldkey name', required: true },
    { name: 'HOTKEY', description: 'Hotkey name',  required: true },
  ],

  scoring: {
    summary:
      'Validators pull signed account metrics from SignalPlus over a defined window and rank miners on risk-adjusted return — equity curve, Sharpe-style ratio, drawdown, consistency. Asymmetric encryption protects payloads in transit.',
    rule: 'Realized risk-adjusted PnL is your weight. Drawdown punishes you the same way it would punish an LP.',
    cheatPath:
      "Wash trading to inflate PnL doesn't survive — SignalPlus's exchange integrations see actual fills, fees, counter-parties. Self-trading collapses once execution costs and risk metrics are computed honestly.",
  },

  profitability: {
    estimatedDailyEmissionPerUid: 0.0,
    tokenPriceUsdFallback: 284,
    capexNote:
      'Capex is trading capital, not hardware. Emissions are upside on top of your trading PnL.',
  },

  milestones: [
    { day: 'day 1',  target: 'SignalPlus account + exchange connectivity live', note: 'You can place orders that produce real fills.' },
    { day: 'day 3',  target: 'Hotkey registered + linked',                       note: 'Validators can attribute your signed metrics to your UID.' },
    { day: 'day 7',  target: 'First scoring-window resolves',                    note: 'Your risk-adjusted return shows up on the leaderboard.' },
    { day: 'day 30', target: 'Stable rank',                                      note: "Drawdown discipline matters as much as return — Sharpe-like ranking penalises blow-up cycles." },
  ],

  monitoring: [
    { metric: 'SignalPlus account uptime', threshold: '100%',  where: 'SignalPlus dashboard' },
    { metric: 'Realized Sharpe-like ratio', threshold: 'rising/flat', where: 'SN53 leaderboard (via SignalPlus or validator feeds)' },
    { metric: 'Max drawdown',              threshold: 'within strategy plan', where: 'Your own risk dashboard' },
    { metric: 'Per-tempo incentive',       threshold: 'rising/flat', where: 'btcli subnet metagraph --netuid 53' },
  ],

  knownIssues: [
    { symptom: 'Cannot find a public miner repo',
      cause:   "The repo URL listed on the subnet's external metadata (github.com/EfficientFrontier-SignalPlus/EfficientFrontier) returns HTTP 404 as of 2026-06-01.",
      fix:     'Coordinate onboarding through SignalPlus directly — this subnet is platform-gated, not pip-install-from-README.' },
    { symptom: 'Account linked but no score appears',
      cause:   'Linkage incomplete or validator API key missing on SignalPlus side.',
      fix:     'Contact SignalPlus support / SN53 ops; confirm the hotkey ↔ account binding is live.' },
    { symptom: 'Score drops after a drawdown',
      cause:   'Risk-adjusted ranking penalises tail losses heavily.',
      fix:     "Tighten risk controls — drawdown is the dominant penalty term, not absolute return." },
  ],

  notes: [
    'Public Bittensor-side repository was unreachable at verification time — treat the install layer as platform-mediated until SignalPlus publishes a public miner reference.',
    'No paper trades — the score reads from real fills. Capital at risk is the entry ticket.',
  ],
};
