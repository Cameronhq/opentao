import type { RichPlaybook } from '../playbook-rich';

// SN7 — Allways (Entrius). Cross-chain native swaps (BTC ↔ TAO).
// Miner is a cross-chain market maker: posts collateral, quotes rates, executes swap legs.
// Docker compose stack. Repo currently on `test` branch.

export const sn7: RichPlaybook = {
  slug: '7-allways',
  netuid: 7,
  name: 'Allways',
  category: 'compute',
  categoryLabel: 'Cross-chain swaps',

  blurb:
    "Act as a collateral-backed cross-chain market maker for native asset swaps (BTC ↔ TAO at launch). Quote exchange rates, execute on-chain legs, earn TAO emissions plus swap spread; default = forfeit collateral.",

  whatMinersDo:
    "An Allways miner runs a Docker compose stack that connects to nodes for the supported chains (currently Bitcoin + Bittensor), posts collateral into the Allways smart contract, listens for swap orders on the network, quotes exchange rates, and on winning a bid executes both legs on-chain. Validators independently watch both chains and vote payout-or-slash. Successful, competitively-priced swaps earn TAO emissions; failure to deliver triggers slashing of the on-contract collateral.",

  verifiedAt: '2026-06-01',
  verifiedBy: '@editorial',

  emission: '— τ/day',
  burnCostFallback: '— τ',
  minerCountFallback: 0,
  slotCap: 256,

  hardware: [
    {
      role: 'Miner host (runs miner + supported-chain nodes)',
      count: '1',
      cpuCores: 4,
      ramGb: 16,
      diskGb: 1000,
      bandwidth: 'public IP · stable network · open axon port',
      notes: 'Bulk of disk is for running BTC node (currently ~700GB pruned / ~600GB full). Modest CPU/RAM is enough. No GPU.',
    },
  ],
  hardwareNote:
    'Allways README does not state explicit minimums — sizing above is conservative for running a pruned BTC node plus the miner container. The hard constraint is having enough free balance to post collateral on the smart contract.',

  rentalOk: true,
  rentalNote: 'Any VPS with persistent storage works. Make sure the BTC node has solid I/O — slow disks slow swap settlement.',
  rentalUsdPerHr: { lambda: 0.20, runpod: 0.18, coreweave: 0.25 },

  repo: {
    url: 'https://github.com/entrius/allways',
    branch: 'test',
    minerEntrypoint: 'docker-compose.miner.yml',
  },

  setupShape: 'docker-compose',
  setupOverview:
    "Clone the entrius/allways repo (currently on `test` branch), install Python 3.10+ and uv, set up the .env from .env.example with your Bitcoin keys and Allways wallet path, then bring up the miner compose stack. Collateral is posted on-chain from the wallet you configured.",

  install: [
    { step: 'Clone the repo (test branch)', cmd: 'git clone -b test https://github.com/entrius/allways.git && cd allways' },
    { step: 'Install uv (Python package manager)', cmd: 'curl -LsSf https://astral.sh/uv/install.sh | sh' },
    { step: 'Sync deps', cmd: 'uv sync && source .venv/bin/activate' },
    { step: 'Verify CLI', cmd: 'alw --help' },
    { step: 'Populate .env from template', cmd: 'cp .env.example .env', note: "Set BTC_MODE, BTC_PRIVATE_KEY, BTC_RPC_URL, PORT, WALLET_PATH (and other vars listed in .env.example)." },
    { step: 'Register on SN7', cmd: 'btcli subnet register --netuid 7 --wallet.name $WALLET --wallet.hotkey $HOTKEY' },
  ],

  runSteps: [
    { step: 'Bring up the miner compose stack', cmd: 'docker compose -f docker-compose.miner.yml up -d' },
    { step: 'Check container health', cmd: 'docker compose -f docker-compose.miner.yml logs -f miner' },
    { step: 'Post initial collateral via the alw CLI', note: 'Use the alw CLI helpers (per README) to fund the smart-contract collateral position before quoting your first swap.' },
    { step: 'Verify on the metagraph', cmd: 'btcli subnet metagraph --netuid 7' },
  ],

  envVars: [
    { name: 'WALLET', description: 'Coldkey name', required: true },
    { name: 'HOTKEY', description: 'Hotkey name', required: true },
    { name: 'BTC_MODE', description: 'Bitcoin mode (per .env.example — node or RPC mode)', required: true },
    { name: 'BTC_PRIVATE_KEY', description: 'Private key for the BTC side of swaps', required: true },
    { name: 'BTC_RPC_URL', description: 'Bitcoin RPC endpoint (your own node or hosted)', required: true },
    { name: 'PORT', description: 'Axon port for the miner', required: true },
    { name: 'WALLET_PATH', description: 'Path to Bittensor wallet directory (mounted into container)', required: true },
  ],

  scoring: {
    summary:
      'Validators score successful native-asset swap completion. Successful, competitively-priced swaps earn; failure to deliver the destination asset triggers slashing of on-contract collateral. Within successful swaps, weight is shaped by rate competitiveness and collateral depth.',
    rule: 'Quote tight competitive rates, settle both legs reliably, and keep collateral depth ahead of order flow.',
    cheatPath:
      "A miner cannot quote and fail to deliver — failure triggers smart-contract slashing of posted collateral. Fabricating completion fails too because validators independently observe both chains via their own RPC, and consensus is required for payout. Quoting a deceptively bad rate just loses you flow.",
  },

  profitability: {
    estimatedDailyEmissionPerUid: 0.0,
    tokenPriceUsdFallback: 284,
    capexNote:
      'Capex is collateral (locked TAO/BTC for the duration of open orders) plus a modest VPS + BTC node. Top miners run deeper books on tighter spreads.',
  },

  milestones: [
    { day: 'day 1', target: 'Stack up, BTC node synced, collateral posted', note: 'docker ps shows all services healthy, BTC node fully synced, collateral position visible on the Allways contract.' },
    { day: 'day 3', target: 'First successful swap settled', note: 'Both legs confirmed on-chain, payout received. Validators vote outcome and emission begins.' },
    { day: 'day 7', target: 'Order flow accruing', note: 'Quote competitively. If you are losing all bids, tighten spreads or post deeper collateral.' },
    { day: 'day 14', target: 'Out of immunity, surviving', note: 'Consistent settlements, no slashing events. Position size matched to actual order volume.' },
  ],

  monitoring: [
    { metric: 'BTC node sync status', threshold: '100% synced', where: 'bitcoin-cli getblockchaininfo · stale node = missed swap settlements' },
    { metric: 'Swap settlement success rate', threshold: '100%', where: 'miner container logs · any slashing event is a major incident' },
    { metric: 'Collateral health on contract', threshold: '> 1.5× open order volume', where: 'Allways contract / dashboard · undercollateralised → cannot take orders' },
    { metric: 'Per-tempo incentive', threshold: 'rising or flat', where: 'btcli subnet metagraph --netuid 7' },
  ],

  knownIssues: [
    { symptom: 'Lost orders to other miners', cause: 'Quoted rate too wide or response latency too high.', fix: 'Tighten spread; co-locate BTC node and miner; reduce RPC round-trip latency.' },
    { symptom: 'Slashing event', cause: 'Failed to deliver destination asset within deadline (network congestion, node lag, wallet bug).', fix: 'Audit recent settlement logs; ensure BTC node has enough peers and disk I/O headroom; size open orders conservatively until reliable.' },
    { symptom: 'Container starts but never sees orders', cause: 'Hotkey not registered, axon port not reachable from validators, or .env misconfigured.', fix: 'Check btcli metagraph for UID; curl your axon port from an external box; re-verify all .env values against .env.example.' },
    { symptom: 'BTC node stuck or slow to sync', cause: 'Slow disk or low peer count.', fix: 'Move to NVMe; pre-seed with a known snapshot; bump maxconnections in bitcoin.conf.' },
  ],

  notes: [
    'Repo is currently on `test` branch — track upstream for migration to `main` post-stable release.',
    'BTC ↔ TAO is the launch pair; roadmap is to add additional chains. New chains may add new env vars.',
    'Public team identity (Entrius) is thin — operator info beyond the GitHub handle is not disclosed.',
  ],
};
