import type { RichPlaybook } from '../playbook-rich';

// SN10 — Swap (TaoFi). LP-based "mining" on the TaoFi DEX.
// You provide concentrated liquidity to the TAO/USDC pool on TaoFi (EVM-side),
// commit your miner type on-chain, and earn TAO emissions proportional to 24h fees.

export const sn10: RichPlaybook = {
  slug: '10-swap',
  netuid: 10,
  name: 'Swap',
  category: 'compute',
  categoryLabel: 'DeFi / liquidity',

  blurb:
    "Provide concentrated liquidity to the TaoFi TAO/USDC pool, commit miner-type UNISWAP_V3_LP on-chain, and earn TAO emissions proportional to the 24h trading fees your position captured.",

  whatMinersDo:
    "A Swap miner is a Uniswap-V3-style liquidity provider on the TaoFi DEX. You provide a concentrated LP position (TAO/USDC pool at launch), commit the miner type UNISWAP_V3_LP and your EVM wallet on-chain via scripts/commit.py, then rebalance the position to keep it near the active price. Validators index 24-hour fee earnings per LP and rank miners by fee share — capital is necessary but not sufficient; only fee-generating positions score. The 0.3% pool fee flows to LPs as base income; SN10 TAO emissions stack on top.",

  verifiedAt: '2026-06-01',
  verifiedBy: '@editorial',

  emission: '— τ/day',
  burnCostFallback: '— τ',
  minerCountFallback: 0,
  slotCap: 256,

  hardware: [
    {
      role: 'Rebalancing host',
      count: '1',
      cpuCores: 2,
      ramGb: 4,
      diskGb: 20,
      bandwidth: 'standard internet · stable RPC connection',
      notes: 'Light — runs price feeds and rebalance scripts. No GPU. The real "capex" is the liquidity sitting in the pool.',
    },
  ],
  hardwareNote:
    'Compute is irrelevant; the binding constraint is LP capital and rebalancing logic. Concentrated positions around the active price earn far more than wide passive positions.',

  rentalOk: true,
  rentalNote: 'Any $5/mo VPS handles the bot. The real input is on-chain capital.',
  rentalUsdPerHr: { lambda: 0.05, runpod: 0.04, coreweave: 0.06 },

  repo: {
    url: 'https://github.com/Swap-Subnet/swap-subnet',
    branch: 'main',
    minerEntrypoint: 'scripts/commit.py (one-time on-chain commitment) + your own LP/rebalancer',
  },

  setupShape: 'docker-compose',
  setupOverview:
    "Install uv, clone the swap-subnet repo and install in editable mode. Set EVM_KEY in your .env to the private key for the wallet you'll use to provide liquidity. Deposit liquidity into the TaoFi TAO/USDC pool, then run scripts/commit.py to declare your miner type UNISWAP_V3_LP on-chain so validators attribute your position to your hotkey. After that, the work is operating the LP — rebalancing as price moves.",

  install: [
    { step: 'Install uv', cmd: 'curl -LsSf https://astral.sh/uv/install.sh | sh' },
    { step: 'Clone + install the subnet repo', cmd: 'git clone https://github.com/Swap-Subnet/swap-subnet/ && cd swap-subnet && uv pip install -e .' },
    { step: 'Optional dev deps', cmd: 'uv pip install -e ".[dev]"' },
    { step: 'Create .env from .env.example', note: "Set EVM_KEY (private key for the EVM wallet that holds your LP), plus BITTENSOR_MAINNET_PROVIDER_URL / BITTENSOR_WEB3_PROVIDER_URL (defaults to wss://archive.chain.opentensor.ai:443) and WANDB_API_KEY if you want metrics." },
    { step: 'Register on SN10', cmd: 'btcli subnet register --netuid 10 --wallet.name $WALLET --wallet.hotkey $HOTKEY' },
    { step: 'Provide liquidity on the TaoFi pool', note: 'Use taofi.com to deposit into the TAO/USDC concentrated pool from your EVM wallet (Base / target chain). Track the position NFT or LP token.' },
  ],

  runSteps: [
    {
      step: 'Commit miner type on-chain (one-time)',
      cmd: 'python3 scripts/commit.py --netuid 10 --subtensor.network finney --wallet.name $WALLET --wallet.hotkey $HOTKEY --miner-type UNISWAP_V3_LP',
    },
    { step: 'Run your rebalancing bot', note: "Repo provides docker-compose + Dockerfile scaffold; your rebalance logic is your own. Goal: keep concentrated range near the active TAO/USDC price." },
    { step: 'Verify on the metagraph', cmd: 'btcli subnet metagraph --netuid 10' },
  ],

  envVars: [
    { name: 'WALLET', description: 'Coldkey name', required: true },
    { name: 'HOTKEY', description: 'Hotkey name', required: true },
    { name: 'EVM_KEY', description: 'Private key for the EVM wallet providing liquidity on TaoFi', required: true },
    { name: 'BITTENSOR_MAINNET_PROVIDER_URL', description: 'Subtensor WSS endpoint (default wss://archive.chain.opentensor.ai:443)', required: false },
    { name: 'BITTENSOR_WEB3_PROVIDER_URL', description: 'Subtensor WSS endpoint (defaults same as above)', required: false },
    { name: 'WANDB_API_KEY', description: 'Optional — for Weights & Biases logging of validator/miner metrics', required: false },
  ],

  scoring: {
    summary:
      "Score = share of trailing 24h pool fees your LP position captured. Usage-based, not capital-based — a small concentrated position around the active price can outscore a much larger but lazy position.",
    rule: 'Capture trading fees by keeping concentrated liquidity near the active price. Dead capital on dead ranges earns nothing.',
    cheatPath:
      "Wash trading is a wash by construction — 0.3% you pay to swap == 0.3% you earn as LP, netting zero before gas. Parking liquidity in irrelevant ranges earns no fees and therefore no emissions. Cross-chain manipulation is bounded by Hyperlane's message verification.",
  },

  profitability: {
    estimatedDailyEmissionPerUid: 0.0,
    tokenPriceUsdFallback: 284,
    capexNote:
      'Capex is LP capital. TaoFi reports very high APRs while pool liquidity is light — early LPs can earn outsized emission share but are exposed to TAO/USDC IL.',
    notes: 'Reported APRs are inflated by thin liquidity — as more LPs enter, fee share per dollar declines toward equilibrium. Underwrite the position on fees alone, not on emission rate.',
  },

  milestones: [
    { day: 'day 1', target: 'LP active, commit posted, UID assigned', note: 'TaoFi position visible on-chain, scripts/commit.py confirmed, btcli metagraph shows UID.' },
    { day: 'day 3', target: 'First 24h fee window scored', note: 'Validators have indexed at least one rolling 24h window with your position present. Emission should be flowing.' },
    { day: 'day 7', target: 'Rebalancer behaving', note: 'Range stays within ±5% of active price during normal volatility. Re-test after large moves.' },
    { day: 'day 14', target: 'Out of immunity, surviving', note: 'Net of emission + fees - IL is still positive on the position.' },
  ],

  monitoring: [
    { metric: 'LP fee earnings (24h trailing)', threshold: 'top quartile vs metagraph', where: 'TaoFi dashboard + on-chain position queries' },
    { metric: 'Range proximity to active price', threshold: 'within ±X% target band', where: 'Your rebalancer logs · drift = lost fees' },
    { metric: 'Impermanent loss vs hodl', threshold: 'monitor weekly', where: 'Position P&L tools · IL can wipe out emission gains in a fast TAO move' },
    { metric: 'Per-tempo incentive', threshold: 'rising or flat', where: 'btcli subnet metagraph --netuid 10' },
  ],

  knownIssues: [
    { symptom: 'Emission at 0 despite active LP', cause: 'scripts/commit.py not run, or EVM wallet on the position does not match the wallet committed.', fix: 'Re-run scripts/commit.py with the right --miner-type UNISWAP_V3_LP; ensure the EVM wallet that holds the position is the one tied to your hotkey commitment.' },
    { symptom: 'Position out of range, fees stop', cause: 'TAO/USDC price moved outside your concentrated band.', fix: 'Rebalance: close + reopen around the new active price. Costs gas + slippage — budget for this in the strategy.' },
    { symptom: 'Big IL loss after volatility spike', cause: 'Concentrated LP amplifies IL vs wide LP.', fix: 'Tune range width — tighter = more fees + more IL. Hedge externally if running large size.' },
    { symptom: 'Rebalancer cannot send tx', cause: 'EVM_KEY out of gas on the host chain.', fix: 'Top up the EVM wallet with native gas token.' },
  ],

  notes: [
    'Cross-chain pathway: USDC/ETH on Base or Solana → subnet alpha tokens via Hyperlane Warp Routes + Interchain Accounts.',
    'TaoFi also operates taoUSD — Bittensor-native stable for in-ecosystem DeFi.',
    "Lead is Sam Forman (@sforman2010). Engineering input from Sturdy Protocol contributors.",
  ],
};
