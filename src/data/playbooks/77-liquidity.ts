import type { RichPlaybook } from '../playbook-rich';

// SN77 — Liquidity. Solo-operator project by CreativeBuilds (MIT-licensed,
// TypeScript/Bun). Capital-based mining: provide LP on Uniswap V3 pools chosen
// by TAO-holder gauge votes; reward = LP × time × pool weight.

export const sn77: RichPlaybook = {
  slug: '77-liquidity',
  netuid: 77,
  name: 'Liquidity',
  category: 'data',
  categoryLabel: 'Liquidity',

  blurb:
    'Rewards on-chain liquidity on Uniswap V3 pools chosen by TAO-holder gauge votes. Mining is capital-based: link your Bittensor hotkey to an Ethereum address, deploy LP, and earn TAO emission proportional to liquidity × time × pool weight.',

  whatMinersDo:
    "There is no GPU process. The SN77 miner is your Ethereum LP. The on-host step is one-time: `bun install`, fill `.env` with your Bittensor hotkey + Ethereum private key, then `just register` to link them on the SN77 coordination server (77.creativebuilds.io). After that, deploy LP into Uniswap V3 pools currently weighted by TAO-holder votes; validators read your on-chain positions each cycle and score on `liquidity × time × pool_weight`. Monitor earnings via `bun run pools`.",

  verifiedAt: '2026-06-01',
  verifiedBy: '@editorial',

  emission: '— τ/day',
  burnCostFallback: '— τ',
  minerCountFallback: 0,
  slotCap: 256,

  hardware: [
    {
      role: 'Operator machine',
      count: '1',
      cpuCores: 2,
      ramGb: 4,
      diskGb: 20,
      bandwidth: 'Reliable RPC to Ethereum mainnet',
      notes: 'No GPU. No always-on server requirement beyond the one-shot registration. The "hardware" is the capital you deploy into LP positions.',
    },
  ],
  hardwareNote: 'The binding scarce resource is capital, not compute. A laptop is enough; the on-chain LP positions are what get scored.',

  rentalOk: true,
  rentalUsdPerHr: { lambda: 0.02, runpod: 0.02, coreweave: 0.03 },

  repo: {
    url: 'https://github.com/CreativeBuilds/sn77',
    branch: 'master',
    minerEntrypoint: 'scripts/register.ts (invoked via `just register`)',
  },

  setupShape: 'simple-binary',
  setupOverview:
    'Clone the repo, install Bun, `bun install`, copy `.env.example` to `.env` and fill MINER_HOTKEY + ETH_KEY, then `just register` to bind your Bittensor hotkey to an Ethereum address via the SN77 server. Deploy LP into the actively-weighted Uniswap V3 pools; track results with `bun run pools`.',

  install: [
    { step: 'Install Bun',
      cmd: 'curl -fsSL https://bun.sh/install | bash' },
    { step: 'Clone repo',
      cmd: 'git clone https://github.com/CreativeBuilds/sn77.git && cd sn77' },
    { step: 'Install dependencies',
      cmd: 'bun install' },
    { step: 'Copy env file',
      cmd: 'cp .env.example .env',
      note: 'Fill MINER_HOTKEY (hex, starts with 0x) and ETH_KEY (Ethereum private key, hex).' },
    { step: 'Register on subnet',
      cmd: 'btcli subnet register --netuid 77 --wallet.name $WALLET --wallet.hotkey $HOTKEY' },
  ],

  runSteps: [
    { step: 'Link Bittensor hotkey ↔ Ethereum address',
      cmd: 'just register' },
    { step: 'Verify registration',
      cmd: 'bunx tsx scripts/check-key.ts' },
    { step: 'Check current pool weights / your positions',
      cmd: 'bun run pools' },
    { step: 'Deploy LP into the actively-weighted pools',
      note: 'Use Uniswap V3 UI or the official SDK to add liquidity to the pools the TAO-holder vote has weighted. There is no SN77-specific deploy command — you LP directly on-chain.' },
  ],

  envVars: [
    { name: 'WALLET',       description: 'Coldkey name (for btcli operations)',                     required: true },
    { name: 'HOTKEY',       description: 'Hotkey name (for btcli operations)',                      required: true },
    { name: 'MINER_HOTKEY', description: 'Bittensor hotkey, hex string starting with 0x',           required: true },
    { name: 'ETH_KEY',      description: 'Ethereum private key, hex string',                        required: true },
  ],

  scoring: {
    summary:
      "Validators read on-chain LP positions across the active reward set, scored by amount × time × pool weight. TAO holders vote on which pools should receive weight; the SN77 server tallies votes and publishes the active set each cycle. Final miner weights additionally factor token holdings + liquidity positions per the project's published formula.",
    rule: 'liquidity_USD × time_in_pool × pool_weight, summed across all your linked LP positions.',
    sourcePath: 'CreativeBuilds/sn77 · README + scoring scripts',
    cheatPath:
      'Flash-deposit LP withdrawn just after the score snapshot fails time-weighted scoring. Wash-LP between miner-controlled accounts shows on-chain. Residual surface is sophisticated MEV / JIT-liquidity patterns that maximise scored-snapshot capital without contributing useful liquidity — operator can refine the formula in response.',
  },

  profitability: {
    estimatedDailyEmissionPerUid: 0.0,
    tokenPriceUsdFallback: 284,
    capexNote: 'Capex = the LP capital itself. Plus Ethereum gas to enter/exit/manage positions.',
    notes: 'Returns compound when you sit on top of which pools the TAO-holder vote weights. Watch governance signals; underweighted pools earn little regardless of LP size.',
  },

  milestones: [
    { day: 'day 1',  target: 'Hotkey ↔ ETH registered',         note: '`bunx tsx scripts/check-key.ts` shows green; LP positions deployed on a weighted pool.' },
    { day: 'day 3',  target: 'First scored cycle',              note: 'btcli metagraph --netuid 77 shows non-zero incentive against your UID.' },
    { day: 'day 7',  target: 'Steady positions across cycle',   note: 'Time-weighting accumulates — no early withdrawals.' },
    { day: 'day 30', target: 'Pool rotation discipline',        note: 'TAO-holder vote shifts; rotate LP to the new top-weighted pools, but only after gas-aware ROI.' },
  ],

  monitoring: [
    { metric: 'Registration status',     threshold: 'linked',          where: '`bunx tsx scripts/check-key.ts`' },
    { metric: 'Active pool weights',     threshold: 'aware',           where: '`bun run pools` + 77.creativebuilds.io' },
    { metric: 'LP position fees + IL',   threshold: 'net positive',    where: 'Uniswap V3 position page' },
    { metric: 'Per-tempo incentive',     threshold: 'rising or flat',  where: 'btcli subnet metagraph --netuid 77' },
  ],

  knownIssues: [
    {
      symptom: 'No score despite LP deployed',
      cause:   'Hotkey not linked to the ETH address holding the LP, or LP is on a pool not in the active weight set.',
      fix:     'Re-run `just register`. Check `bun run pools` to confirm the pool you LP-ed into is currently weighted.',
    },
    {
      symptom: 'Score drops after withdrawing partial liquidity',
      cause:   'Time-weighted scoring punishes withdrawals mid-cycle.',
      fix:     'Time withdrawals to cycle boundaries when possible; smaller, longer positions beat large flash positions.',
    },
    {
      symptom: 'Version mismatch warnings on validator',
      cause:   'README notes version issues do not immediately stop the validator but can degrade scoring.',
      fix:     'Track the GitHub repo for updates; pull and `bun install` when releases land.',
    },
  ],

  notes: [
    'Solo-operator project. MIT licensed. TypeScript / Bun runtime.',
    'Coordination server at 77.creativebuilds.io handles vote tally + weight calculation off-chain.',
    'No GPU, no validator install for mining — capital is the moat.',
  ],
};
