import type { RichPlaybook } from '../playbook-rich';

// SN106 — VoidAI. Multi-chain liquidity protocol — miners LP wAlpha/wTAO
// pairs on Raydium CLMM via a Chainlink-CCIP bridge, then stake the LP
// tokens through VoidAI's Solana program. README of github.com/v0idai/SN106
// was the primary source for hardware + install steps.

export const sn106: RichPlaybook = {
  slug: '106-voidai',
  netuid: 106,
  name: 'VoidAI',
  category: 'data',
  categoryLabel: 'Data',

  blurb:
    'Cross-chain liquidity subnet. Miners bridge TAO + alpha tokens to Solana via Chainlink CCIP, LP into Raydium CLMM wAlpha/wTAO pools, and stake the LP tokens through the VoidAI Solana program — Yuma pays per-tempo emissions for concentrated, persistent liquidity.',

  whatMinersDo:
    "A VoidAI miner is a liquidity provider, not a compute miner. They bridge TAO and chosen alpha tokens to Solana through the VoidAI CCIP bridge, deposit both sides into the corresponding Raydium CLMM pool, and stake the resulting LP position via VoidAI's Solana program. Validators query Solana for each miner's current LP position and score on depth, concentration range, and duration — concentrated, persistent positions earn more than thin or transient ones.",

  verifiedAt: '2026-06-01',
  verifiedBy: '@editorial',

  emission: '— τ/day',
  burnCostFallback: '— τ',
  minerCountFallback: 0,
  slotCap: 256,

  hardware: [
    {
      role: 'Operator node',
      count: '1',
      cpuCores: 4,
      ramGb: 8,
      diskGb: 50,
      bandwidth: 'public IP · 50+ Mbps (100+ Mbps recommended)',
      notes: 'Minimums per the SN106 README: 4 cores / 8 GB RAM / 50+ GB SSD / 50+ Mbps. Recommended: 8 cores / 16 GB / 100+ GB / 100+ Mbps on Ubuntu 22.04 LTS. The workload is RPC + wallet ops, not compute.',
    },
  ],
  hardwareNote:
    "This is a liquidity-mining subnet — the real 'hardware' is your LP capital, not your VPS. Budget the TAO + alpha token capital you intend to deploy as the primary cost driver.",

  rentalOk: true,
  rentalUsdPerHr: { lambda: 0.10, runpod: 0.08, coreweave: 0.12 },

  repo: {
    url: 'https://github.com/v0idai/SN106',
    branch: 'main',
    extraRepos: [
      { name: 'VoidAI docs',     url: 'https://docs.voidai.com', purpose: 'Bridge + CLMM setup walkthrough' },
      { name: 'VoidAI on X',     url: 'https://x.com/v0idai',     purpose: 'Operator announcements + CCIP / Raydium status' },
    ],
  },

  setupShape: 'simple-binary',
  setupOverview:
    'Setup is more crypto-ops than ML-ops: install the SN106 client, configure Solana RPC + program IDs, bridge TAO + alpha to Solana, LP into Raydium, then stake the LP position via VoidAI. Per README the runtime is Node-based — `npm install` + `npm run validator`.',

  install: [
    { step: 'Clone the SN106 repo',
      cmd:  'git clone https://github.com/v0idai/SN106 && cd SN106' },
    { step: 'Install npm dependencies',
      cmd:  'npm install' },
    { step: 'Copy and edit .env',
      cmd:  'cp .env.example .env && $EDITOR .env',
      note: 'Set Subtensor endpoint, hotkey URI (mnemonic / private key / Polkadot-style), NETUID=106, Solana RPC, and the SN106 + Raydium CLMM program IDs.' },
    { step: 'Bridge TAO and your chosen alpha token to Solana via VoidAI Bridge',
      note: 'CCIP-backed bridge — follow the docs.voidai.com walkthrough for current bridge URLs.' },
    { step: 'LP into the Raydium CLMM wAlpha/wTAO pool',
      note: 'Pick a concentration range close to current market price — scoring rewards narrower, market-proximate positions.' },
    { step: 'Stake the resulting LP position NFT with the VoidAI Solana program',
      note: 'This is what makes the position visible to SN106 validators.' },
    { step: 'Register your hotkey on SN106',
      cmd:  'btcli subnet register --netuid 106 --wallet.name $WALLET --wallet.hotkey $HOTKEY' },
  ],

  runSteps: [
    { step: 'Run the validator/miner client',
      cmd:  'npm run validator',
      note: 'Per README — confirms wallet, polls Solana, reports position health, and keeps the miner advertised on SN106.' },
    { step: 'Watch metagraph + position health',
      cmd:  'btcli subnet metagraph --netuid 106' },
  ],

  envVars: [
    { name: 'WALLET',                description: 'Coldkey name',                                                              required: true },
    { name: 'HOTKEY',                description: 'Hotkey name (or hotkey URI: mnemonic / private key / Polkadot-style)',     required: true },
    { name: 'NETUID',                description: 'Subnet UID — 106 for VoidAI',                                                required: true },
    { name: 'SUBTENSOR_ENDPOINT',    description: 'Subtensor RPC endpoint',                                                     required: true },
    { name: 'SOLANA_RPC',            description: 'Solana RPC endpoint',                                                        required: true },
    { name: 'SN106_PROGRAM_ID',      description: "VoidAI's SN106 Solana program ID",                                           required: true },
    { name: 'RAYDIUM_CLMM_PROGRAM',  description: 'Raydium CLMM program ID for the target pool',                                required: true },
  ],

  scoring: {
    summary:
      'Validators score on-chain LP state from the VoidAI Solana program — depth (total LP value), concentration range (narrower beats wider), proximity to current market price, and staked duration. Subnet performance metrics also feed into the multiplier.',
    rule:
      "Earn by sitting concentrated and persistent LP close to market price. Concentrated + long-staked beats wide + brief on this scoring curve.",
    cheatPath:
      "Pull-and-replace (deposit before snapshot, withdraw after) is the obvious attack — defeated by scoring duration, not instantaneous depth. Wash-trading the pool to inflate fees is irrelevant since emission depends on staked LP, not realised fees. Catastrophic but external failure mode: bridge / CCIP oracle attacks.",
  },

  profitability: {
    estimatedDailyEmissionPerUid: 0.0,
    tokenPriceUsdFallback: 284,
    capexNote:
      "LP capital is the cost driver, not hardware. Sizing depends on the depth curve you're competing against in the target Raydium pool.",
    notes:
      'Earnings come from SN106 emissions on top of AMM trading fees. Impermanent-loss risk is real — this is a liquidity-mining strategy, not a yield product.',
  },

  milestones: [
    { day: 'day 1', target: 'Bridge complete + LP staked + miner registered', note: 'Solana program reports your staked LP; SN106 metagraph shows your UID.' },
    { day: 'day 3', target: 'First non-zero incentive', note: 'btcli metagraph shows your incentive rising as your duration accrues.' },
    { day: 'day 7', target: 'Out of immunity, sustained incentive', note: 'If still flat, your concentration range is probably too wide or too far from market.' },
    { day: 'day 14', target: 'Top-quartile depth-vs-emission ratio', note: 'Compare per-UID earnings to your deployed LP capital — re-tune concentration band if your ratio trails the top quartile.' },
  ],

  monitoring: [
    { metric: 'LP position health on Solana',     threshold: 'staked, in range',where: 'VoidAI Solana program / Raydium dashboard' },
    { metric: 'Bridge transactions (CCIP)',       threshold: 'no stuck txns',  where: 'CCIP explorer / VoidAI bridge UI' },
    { metric: 'Position proximity to market price',threshold: 'in current band',where: 'Raydium pool UI' },
    { metric: 'Per-tempo incentive',              threshold: 'rising or flat', where: 'btcli subnet metagraph --netuid 106' },
  ],

  knownIssues: [
    {
      symptom: 'Position out of range — earnings drop',
      cause:   'Market price moved outside your concentration band; LP is no longer active.',
      fix:     'Rebalance the position. Narrow bands earn more but require more rebalancing — this is the live tradeoff.',
    },
    {
      symptom: 'Bridge transactions stuck',
      cause:   'CCIP message queued or oracle confirmation delayed.',
      fix:     "Check CCIP explorer for the message; usually resolves on its own. Don't double-bridge.",
    },
    {
      symptom: 'Miner registered but Solana program reports no stake',
      cause:   'LP position NFT not staked through VoidAI program — only providing Raydium LP is not enough.',
      fix:     'Re-run the staking step against the VoidAI program ID. Without it the validators cannot see your position.',
    },
  ],

  notes: [
    'Fund custody on Solana, not Bittensor — bridge risk is your dominant external risk factor.',
    'Subnet emission is the kicker on top of AMM fees, but impermanent loss is yours to absorb. Treat this as a liquidity-mining strategy, not yield.',
  ],
};
