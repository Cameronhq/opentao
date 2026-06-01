import type { RichPlaybook } from '../playbook-rich';

// SN35 — 0xMarkets / Cartha. Operated by General TAO Ventures + Taoshi.
// "Liquidity-as-a-service" subnet — miners provide USDC liquidity to the
// 0xMarkets perpetuals DEX (FX, crypto, commodities). Mining is done via
// the `cartha-cli` Python CLI; the heavy lifting is a USDC lock + browser
// flow on Base, NOT a Python neuron with axon. Mainnet netuid=35,
// testnet netuid=78.

export const sn35: RichPlaybook = {
  slug: '35-oxmarkets',
  netuid: 35,
  name: '0xMarkets (Cartha)',
  category: 'compute',
  categoryLabel: 'Liquidity / DeFi',

  blurb:
    'Liquidity-as-a-service subnet powering the 0xMarkets perpetuals DEX (FX + crypto + commodities). Miners lock USDC into approved pools on Base via the cartha-cli; emission is proportional to locked liquidity, pool weight, and downstream alpha.',

  whatMinersDo:
    "A Cartha miner is NOT a Python neuron with an axon — it is a capital position. You install `cartha-cli` (Python 3.11), register your hotkey with `cartha miner register`, view available pools with `cartha vault pools`, and lock USDC into one or more pools via `cartha vault lock` which opens a browser flow on Base (chain 8453) where you approve USDC + execute the lock against the vault contract. The verifier automatically detects your on-chain lock and adds you to the upcoming reward epoch. You then maintain the position (monitor expiration, top up, renew) — the longer-and-deeper your USDC is in the right pool, the more emission you earn.",

  verifiedAt: '2026-06-01',
  verifiedBy: '@editorial',

  emission: '— τ/day',
  burnCostFallback: '— τ',
  minerCountFallback: 0,
  slotCap: 256,

  hardware: [
    {
      role: 'Capital + CLI host',
      count: '1',
      cpuCores: 2,
      ramGb: 4,
      diskGb: 20,
      bandwidth: '100 Mbps',
      notes: 'No GPU. No always-on serving. Cartha is fundamentally a capital position — the host just runs the CLI for registration, lock, and status checks. The real "hardware" is USDC on Base.',
    },
  ],
  hardwareNote:
    'Cartha mining requires USDC capital on Base (chain 8453), an EVM-compatible wallet (the lock UI is browser-based), and a Bittensor coldkey/hotkey. Capital requirement is the real constraint — not compute.',

  rentalOk: true,
  rentalUsdPerHr: { lambda: 0.05, runpod: 0.05, coreweave: 0.05 },
  rentalNote: 'Any cheap VPS works since there is no GPU need; the cost is the USDC lock, not the host.',

  repo: {
    url: 'https://github.com/General-Tao-Ventures/cartha-cli',
    branch: 'main',
    minerEntrypoint: 'cartha-cli',
  },

  setupShape: 'simple-binary',
  setupOverview:
    'Install the cartha-cli pip package, ensure you have a Bittensor wallet via btcli, run health check, register your miner, view available pools, then lock USDC into a chosen pool via the browser-based lock flow on Base. Multi-pool management and renewals are all done via short CLI subcommands.',

  install: [
    { step: 'Ensure Python 3.11',
      cmd: 'python3.11 --version || sudo apt install -y python3.11' },
    { step: 'Install cartha-cli',
      cmd: 'pip install cartha-cli' },
    { step: 'Create / import Bittensor wallet',
      note: 'Use btcli: `btcli w new_coldkey && btcli w new_hotkey`. See docs.learnbittensor.org/keys/working-with-keys.' },
    { step: 'Confirm health',
      cmd: 'cartha utils health',
      note: 'Checks verifier connectivity, Bittensor connection, subnet metadata, env vars.' },
    { step: 'Register on SN35',
      cmd: 'cartha miner register --wallet-name $WALLET --wallet-hotkey $HOTKEY' },
    { step: 'Acquire USDC on Base (chain 8453)',
      note: 'Bridge USDC to your EVM wallet on Base — required for the lock step.' },
    { step: 'View available pools',
      cmd: 'cartha vault pools' },
  ],

  runSteps: [
    { step: 'Lock USDC into a pool',
      cmd: `cartha vault lock \\
  --coldkey $WALLET \\
  --hotkey $HOTKEY \\
  --pool-id BTCUSD \\
  --amount 1000.0 \\
  --lock-days 30 \\
  --owner-evm 0xYourEVMAddress \\
  --chain 8453 \\
  --vault-address 0xVaultAddress`,
      note: 'Opens the Cartha Lock UI in your browser with all parameters pre-filled. Two phases: (1) Approve USDC, (2) Lock Position. The verifier auto-detects your lock and adds you to the upcoming epoch.' },
    { step: 'Check status anytime',
      cmd: 'cartha miner status --wallet-name $WALLET --wallet-hotkey $HOTKEY',
      note: 'Shows active pools, balances, days until expiration, and which pools are in the next reward epoch. Alias: `cartha m status`.' },
    { step: 'Manage positions (top up, extend) via web UI',
      note: 'Visit https://liquidity.0xmarkets.io/manage to view all positions, extend locks, or top up existing positions.' },
  ],

  envVars: [
    { name: 'WALLET',          description: 'Bittensor coldkey name (passed as --wallet-name)',                       required: true },
    { name: 'HOTKEY',          description: 'Bittensor hotkey name (passed as --wallet-hotkey)',                       required: true },
    { name: 'OWNER_EVM',       description: 'EVM address that will own the lock on Base',                              required: true },
    { name: 'VAULT_ADDRESS',   description: 'Vault contract address for the chosen pool (shown by `cartha vault pools`)', required: true },
  ],

  scoring: {
    summary:
      'Score combines three components: (1) verified USDC liquidity locked in approved pools, (2) pool composition weight (protocol favours pools that match its risk profile), (3) downstream alpha — how much real DEX revenue your liquidity / signals generated. Only whitelisted validators can route order flow to verified miners.',
    rule: 'Lock more USDC, in the right pools, for longer, and ensure the liquidity is actually being used by the DEX (productive alpha). Capital + productivity beats either alone.',
    cheatPath:
      "Claiming USDC you don't actually have fails on-chain verification of the position contract — the verifier reads the chain. Idle capital sitting in a pool but never used by the DEX earns less than productive capital. Sybil-validator attempts to siphon order-flow data are blocked by the validator whitelist.",
  },

  profitability: {
    estimatedDailyEmissionPerUid: 0.0,
    tokenPriceUsdFallback: 284,
    capexNote:
      "The real 'capex' is USDC capital — minimum useful position is typically in the thousands of USDC. Subnet position docs and the liquidity portal at liquidity.0xmarkets.io show current pool yields.",
    notes:
      "Profitability is best modeled as USDC yield (emission TAO × TAO price + DEX revenue share) ÷ locked USDC × time. Compare to alternative USDC yield (Aave, Spark, etc.) — Cartha works only if SN35 yield exceeds the risk-adjusted alternative.",
  },

  milestones: [
    { day: 'day 1',  target: 'CLI installed, health green, registered', note: '`cartha utils health` returns all green; `cartha miner register` succeeds; UID visible on metagraph.' },
    { day: 'day 3',  target: 'First USDC lock active',                   note: '`cartha miner status` shows your position as active and included in the upcoming epoch.' },
    { day: 'day 7',  target: 'First reward epoch settled',              note: 'Emission landing on your hotkey proportional to locked USDC + pool weight. Verify via taostats.io/subnets/35/.' },
    { day: 'day 14', target: 'Multi-pool position',                      note: 'Diversified across at least 2 pools based on observed yield differential.' },
    { day: 'day 30', target: 'Renewal cycle',                            note: 'First 30-day lock period maturing — decide whether to extend, top up, or rotate to a higher-yielding pool.' },
  ],

  monitoring: [
    { metric: 'Lock expiration countdown', threshold: '> 7 days remaining', where: '`cartha miner status` · color-coded warnings approach expiration' },
    { metric: 'Pool included in next epoch', threshold: 'yes',              where: '`cartha miner status` · "next reward epoch" column' },
    { metric: 'On-chain USDC lock balance',  threshold: 'matches CLI',      where: 'Base chain explorer · vault contract → your EVM owner address' },
    { metric: 'Per-tempo incentive',         threshold: 'rising or flat',   where: 'taostats.io/subnets/35/ · check after each epoch' },
    { metric: 'Verifier connectivity',       threshold: 'green',            where: '`cartha utils health` · verifier-detection of locks depends on this' },
  ],

  knownIssues: [
    {
      symptom: 'Lock created on-chain but verifier never picks it up',
      cause:   "Vault address or chain ID mismatch — used a stale vault address from old docs, or wrong --chain.",
      fix:     'Cross-check `cartha vault pools` output for the canonical vault address + chain. Re-confirm the lock was sent to the right contract via Base explorer.',
    },
    {
      symptom: 'Position active but not included in upcoming epoch',
      cause:   'Lock was made after the epoch snapshot window closed.',
      fix:     'Locks are included in the NEXT epoch after the snapshot block. Just wait for the following epoch — your status row will flip.',
    },
    {
      symptom: 'Daily emission lower than expected for locked amount',
      cause:   "Pool weight is low (protocol does not currently favour this pool), OR alpha component is dragging the score (your capital is sitting idle in DEX terms).",
      fix:     "Use `cartha vault pools` to see relative weights; consider rotating into a higher-weighted pool. Check the 0xMarkets DEX dashboard for trading volume on your pool's instrument.",
    },
    {
      symptom: 'Lock UI does not auto-detect approval and stalls',
      cause:   'Browser session lost wallet connection between Phase 1 (approve) and Phase 2 (lock).',
      fix:     'Refresh the page; the CLI surfaces a paste-able URL with all parameters. Reconnect wallet to Base and re-trigger Phase 2.',
    },
  ],

  notes: [
    'Cartha is the rebranded subnet identity; previously SN35 was LogicNet (reasoning model, AIT) which stalled.',
    'Testnet is netuid 78 (Base Sepolia, chain 84532); mainnet is netuid 35 (Base mainnet, chain 8453).',
    'No always-on neuron process — Cartha is fundamentally a capital position with a CLI for registration + lock management.',
    'Multi-pool management dashboard at liquidity.0xmarkets.io/manage.',
  ],
};
