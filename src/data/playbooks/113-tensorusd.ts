import type { RichPlaybook } from '../playbook-rich';

// SN113 — TensorUSD. Native USD stablecoin subnet. Two mechanisms:
// (0) liquidation auctions and (1) TAO/USD price oracle. Both scored from
// on-chain events; both run as separate miner processes.

export const sn113: RichPlaybook = {
  slug: '113-tensorusd',
  netuid: 113,
  name: 'TensorUSD',
  category: 'reason',
  categoryLabel: 'Reasoning / DeFi',

  blurb:
    'Native USD stablecoin keeper market. Miners run two roles: liquidation auctions (Mech 0) and TAO/USD price oracle (Mech 1). All scoring is deterministic from on-chain events.',

  whatMinersDo:
    "Run two separate keeper processes. (Mech 0) Monitor TensorUSD vaults; when collateralization drops, bid in the on-chain liquidation auction with TUSDT capital — base reward 1.0 plus up to 1.0 bonus for overbidding within a 20% cap. (Mech 1) Pull TAO/USD prices from CoinMarketCap and submit to the oracle contract — within 0.1% of median earns 1.0, within 1% earns 0.85, over 5% deviation earns 0.0.",

  verifiedAt: '2026-06-01',
  verifiedBy: '@editorial',

  emission: '— τ/day',
  burnCostFallback: '— τ',
  minerCountFallback: 0,
  slotCap: 256,

  hardware: [
    {
      role: 'Keeper node',
      count: '1',
      cpuCores: 4,
      ramGb: 8,
      diskGb: 50,
      bandwidth: 'low-latency · static public IP',
      notes: 'No GPU. Run one process per mechanism (liquidator.py + oracle.py). TUSDT capital required to participate in Mech 0 liquidations.',
    },
  ],

  rentalOk: true,
  rentalUsdPerHr: { lambda: 0.10, runpod: 0.08, coreweave: 0.12 },

  repo: {
    url: 'https://github.com/TensorUSD/subnet',
    branch: 'main',
    minerEntrypoint: 'neurons/miner/liquidator.py + neurons/miner/oracle.py',
  },

  setupShape: 'simple-binary',
  setupOverview:
    "Setup is Python + uv. Clone, sync, install, then run liquidator.py and/or oracle.py — each takes a long list of --flags for contract addresses, wallet, and credentials. Liquidations need TUSDT capital and a coldkey password in env; the oracle needs a CoinMarketCap API key. Both processes monitor on-chain events independently.",

  install: [
    { step: 'Clone repo',
      cmd:  'git clone https://github.com/TensorUSD/subnet && cd subnet' },
    { step: 'Install uv',
      cmd:  'curl -LsSf https://astral.sh/uv/install.sh | sh' },
    { step: 'Sync deps',
      cmd:  'uv sync && uv pip install -e .' },
    { step: 'Get CoinMarketCap API key',
      note: 'pro.coinmarketcap.com → create account → API → Basic tier enough for oracle quotes.' },
    { step: 'Fund hotkey with TUSDT (for liquidations)',
      note: 'Mech 0 requires TUSDT capital to win auctions — you must overbid debt to claim bonus.' },
    { step: 'Register hotkey on SN113',
      cmd:  'btcli subnet register --netuid 113 --wallet.name $WALLET --wallet.hotkey $HOTKEY' },
    { step: 'Populate .env',
      note: 'WALLET_NAME, WALLET_HOTKEY, AUCTION_CONTRACT_ADDRESS, VAULT_CONTRACT_ADDRESS, TOKEN_CONTRACT_ADDRESS, COLDKEY_PASSWORD, ORACLE_CONTRACT_ADDRESS, CMC_API_KEY, PRICE_SUBMISSION_INTERVAL=300.' },
  ],

  runSteps: [
    { step: 'Run liquidator (Mech 0)',
      cmd:  'uv run neurons/miner/liquidator.py \\\n  --netuid 113 \\\n  --subtensor.network finney \\\n  --wallet.name $WALLET \\\n  --wallet.hotkey $HOTKEY \\\n  --mech.ids 0 \\\n  --auction_contract.address $AUCTION_CONTRACT_ADDRESS \\\n  --vault_contract.address $VAULT_CONTRACT_ADDRESS \\\n  --tusdt.address $TOKEN_CONTRACT_ADDRESS \\\n  --coldkey.password $COLDKEY_PASSWORD' },
    { step: 'Run oracle (Mech 1)',
      cmd:  'uv run neurons/miner/oracle.py \\\n  --netuid 113 \\\n  --subtensor.network finney \\\n  --wallet.name $WALLET \\\n  --wallet.hotkey $HOTKEY \\\n  --mech.ids 1 \\\n  --oracle_contract.address $ORACLE_CONTRACT_ADDRESS \\\n  --cmc.api_key $CMC_API_KEY \\\n  --price.submission_interval_seconds 300' },
  ],

  envVars: [
    { name: 'WALLET',                    description: 'Coldkey name',                                        required: true },
    { name: 'HOTKEY',                    description: 'Hotkey name',                                         required: true },
    { name: 'COLDKEY_PASSWORD',          description: 'Coldkey unlock password (needed by liquidator)',      required: true },
    { name: 'AUCTION_CONTRACT_ADDRESS',  description: 'On-chain auction contract ss58',                      required: true },
    { name: 'VAULT_CONTRACT_ADDRESS',    description: 'On-chain vault contract ss58',                        required: true },
    { name: 'TOKEN_CONTRACT_ADDRESS',    description: 'TUSDT token contract ss58',                           required: true },
    { name: 'ORACLE_CONTRACT_ADDRESS',   description: 'Oracle contract ss58',                                required: true },
    { name: 'CMC_API_KEY',               description: 'CoinMarketCap API key (oracle)',                      required: true },
    { name: 'PRICE_SUBMISSION_INTERVAL', description: 'Oracle submission cadence in seconds (300 default)',  required: false },
  ],

  scoring: {
    summary:
      'Mech 0 (liquidations): base reward 1.0 per winning auction + bonus = (winning_bid − debt) / debt, capped at 20%. Mech 1 (oracle): within 0.1% of median price → 1.0, within 1% → 0.85, over 5% deviation → 0.0; non-participation → 0.0. All scoring is deterministic from on-chain events.',
    rule: 'Win profitable liquidations and quote prices that hug the consensus median.',
    cheatPath:
      "Don't submit fake or unsigned oracle prices — outliers get zero. Don't bid liquidations you can't fund — failed settlements show up on-chain. Don't skip submissions — non-participation in oracle = 0 for that round.",
  },

  profitability: {
    estimatedDailyEmissionPerUid: 0.0,
    tokenPriceUsdFallback: 284,
    capexNote:
      'Low compute capex; the binding constraint is TUSDT inventory to fund liquidation bids. Oracle-only operation needs almost no capital but earns less than dual-mech operators.',
  },

  milestones: [
    { day: 'day 1',  target: 'Both processes online; first oracle quote landed',
      note: 'CoinMarketCap key working; oracle.py submitting every 300s; liquidator.py watching for undercollateralized vaults.' },
    { day: 'day 7',  target: 'First liquidation won (if vaults stress)',
      note: 'Depends on market activity. Oracle should be consistently in the < 1% band.' },
    { day: 'day 30', target: 'Net-positive on liquidation PnL + emission',
      note: 'Bonus-tier liquidations (overbid up to 20% of debt) are where the upside lives. Oracle scoring stabilizes once you tune submission interval and feed mix.' },
  ],

  monitoring: [
    { metric: 'Oracle quote deviation from median', threshold: '< 0.1%',          where: 'oracle contract events / your submission logs' },
    { metric: 'Oracle submission rate',             threshold: '100% per round',  where: 'cron / pm2 supervising oracle.py' },
    { metric: 'Liquidation win rate',               threshold: '> 0 per day',     where: 'auction contract events filtered to your hotkey' },
    { metric: 'TUSDT inventory',                    threshold: '> required min',  where: 'on-chain TUSDT balance — empty = no bids' },
    { metric: 'Per-tempo incentive',                threshold: 'rising or flat',  where: 'btcli subnet metagraph --netuid 113' },
  ],

  knownIssues: [
    {
      symptom: 'Oracle score drops to 0.85 or below',
      cause:   'Single price-feed source diverging from CMC median.',
      fix:     'Cross-reference with at least one other feed before submitting. Pin to the same fetch timing window as other top miners.',
    },
    {
      symptom: 'Liquidation bids reverting on-chain',
      cause:   'Insufficient TUSDT balance, or bid below the required minimum overbid.',
      fix:     'Top up TUSDT; pre-check vault debt + minimum bid before signing; size the bid to land inside the 20% bonus cap profitably.',
    },
    {
      symptom: 'Non-participation showing in oracle rounds → 0 score',
      cause:   'oracle.py crashed or CMC rate-limited.',
      fix:     'Supervise oracle.py with pm2 or systemd; upgrade CMC plan if rate-limited. PRICE_SUBMISSION_INTERVAL=300 means 12/hour — well inside Basic tier limits.',
    },
  ],

  notes: [
    'Mech 0 and Mech 1 can be run by the same hotkey or split across two — both are scored independently.',
    'Subtensor network flag is --subtensor.network finney for mainnet.',
    'Repo is ~96% Python with supporting shell scripts; Alembic manages the DB schema used for indexing on-chain state.',
  ],
};
