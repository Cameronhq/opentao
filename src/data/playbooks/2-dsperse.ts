import type { RichPlaybook } from '../playbook-rich';

// SN2 — DSperse (Inference Labs). zkML proving cluster.
// Miner produces zero-knowledge proofs of AI inference. CPU-heavy, not GPU-heavy.
// Pre-built sn2-miner binary distributed via GitHub releases, run under PM2.

export const sn2: RichPlaybook = {
  slug: '2-dsperse',
  netuid: 2,
  name: 'DSperse',
  category: 'reason',
  categoryLabel: 'Reasoning / verifiable inference',

  blurb:
    'Generate zero-knowledge proofs of AI inference for validator-issued circuit shards. CPU-heavy proving, served via a PM2-managed pre-built binary with auto-update.',

  whatMinersDo:
    "A DSperse miner receives a model circuit shard plus input from validators, runs the assigned slice of the model, and returns a succinct zero-knowledge proof bound to the model hash, input, and output. Validators verify the proof in milliseconds — verification is binary (verifies or it does not) with proof-generation latency as the tie-break. The official miner is a pre-built `sn2-miner` binary that auto-updates from GitHub releases every 5 minutes.",

  verifiedAt: '2026-06-01',
  verifiedBy: '@editorial',

  emission: '— τ/day',
  burnCostFallback: '— τ',
  minerCountFallback: 0,
  slotCap: 256,

  hardware: [
    {
      role: 'Proving node (CPU)',
      count: '1',
      cpuCores: 8,
      ramGb: 32,
      diskGb: 1000,
      bandwidth: 'public IP · open axon port',
      notes: 'Stated minimum: 8-core 3.2GHz CPU, 32GB RAM, 1TB NVMe SSD. zk proving is CPU-bound, so faster cores beat more cores in many circuits. No GPU required for the default proving system.',
    },
  ],
  hardwareNote:
    "Inference Labs explicitly says: 'Zero-knowledge proofs are generally more CPU computationally intensive and open the opportunity for non-GPU miners to participate.' A GPU helps for some EZKL/TEE configurations but is not required for baseline.",

  rentalOk: true,
  rentalNote: 'Standard CPU rentals are fine. No GraVal-style GPU attestation on this subnet.',
  rentalUsdPerHr: { lambda: 0.45, runpod: 0.39, coreweave: 0.50 },

  repo: {
    url: 'https://github.com/inference-labs-inc/subnet-2',
    branch: 'main',
    minerEntrypoint: './sn2-miner (pre-built binary) or target/release/sn2-miner (from source)',
    extraRepos: [
      { name: 'dsperse', url: 'https://github.com/inference-labs-inc/dsperse', purpose: 'The DSperse zkML library (model slicing / proving primitives) — useful background, not the miner runtime.' },
    ],
  },

  setupShape: 'simple-binary',
  setupOverview:
    'Single-host install. Run the upstream install.sh which auto-detects platform, downloads the signed pre-built binary, verifies SHA256, and installs to /usr/local/bin. Then start under PM2 with your wallet — the binary polls for new GitHub releases every 5 minutes and atomic-replaces itself on update.',

  install: [
    { step: 'Install bittensor-cli + create wallet', cmd: 'pip install bittensor-cli && btcli wallet new_coldkey --wallet.name $WALLET && btcli wallet new_hotkey --wallet.name $WALLET --wallet.hotkey $HOTKEY' },
    { step: 'Run the miner-only installer (pre-built binary)', cmd: 'curl -fsSL https://raw.githubusercontent.com/inference-labs-inc/subnet-2/main/install.sh | bash -s -- sn2-miner', note: 'Auto-detects platform, downloads latest release, verifies SHA256, installs to /usr/local/bin.' },
    { step: 'Register hotkey on SN2', cmd: 'btcli subnet register --netuid 2 --wallet.name $WALLET --wallet.hotkey $HOTKEY' },
  ],

  runSteps: [
    { step: 'Start miner with PM2 via Makefile (recommended)', cmd: 'make pm2-miner WALLET_NAME=$WALLET WALLET_HOTKEY=$HOTKEY' },
    { step: 'OR start directly under PM2', cmd: 'pm2 start ./sn2-miner --name subnet-2-miner --kill-timeout 3000 -- \\\n  --wallet-name $WALLET \\\n  --wallet-hotkey $HOTKEY \\\n  --netuid 2' },
    { step: 'Tail logs to confirm proof submissions', cmd: 'pm2 logs subnet-2-miner' },
  ],

  envVars: [
    { name: 'WALLET', description: 'Coldkey name (matches btcli wallet list)', required: true },
    { name: 'HOTKEY', description: 'Hotkey name on that coldkey', required: true },
  ],

  scoring: {
    summary:
      'Cryptographic verification with latency tie-break. A submitted proof either verifies (validator accepts) or is dropped. Among verified proofs, validators rank miners by proof-generation latency and successful coverage of assigned circuit shards.',
    rule: 'Earn by producing valid zk proofs faster than the field. Repeated verification failures or timeouts drop you out of the active set.',
    cheatPath:
      "Forging a zk proof requires breaking the underlying proving system's cryptographic assumptions — computationally infeasible. Running a different (cheaper) model produces a proof that fails verification against the committed circuit. No path to gaming validator scoring without genuine, faster proving capacity.",
  },

  profitability: {
    estimatedDailyEmissionPerUid: 0.0,
    tokenPriceUsdFallback: 284,
    capexNote:
      'Capex-light vs GPU subnets. A solid 8-core workstation or rented CPU instance is enough to compete. Faster single-thread CPU performance is the meaningful upgrade for latency tie-breaks.',
  },

  milestones: [
    { day: 'day 1', target: 'Binary installed, UID assigned, first proof submitted', note: 'Check pm2 logs for proof submissions and metagraph for UID. Auto-update loop should be visible polling every 5 min.' },
    { day: 'day 3', target: 'Consistent verification rate', note: 'You should be passing proof verification on every assigned shard. If any fail, debug with --logging.debug.' },
    { day: 'day 7', target: 'Latency tie-break improving', note: 'Compare your proof-generation latency against top miners on taostats. Tune CPU thread count and pinning if you sit at the tail.' },
    { day: 'day 14', target: 'Out of immunity, surviving', note: 'Incentive ≥ floor non-immune miner. If close to floor, upgrade single-thread CPU performance.' },
  ],

  monitoring: [
    { metric: 'Proof verification rate', threshold: '100%', where: 'pm2 logs subnet-2-miner · look for "proof submitted" + "verified"' },
    { metric: 'Proof-generation latency', threshold: 'top quartile vs metagraph', where: 'logs · also compare against taostats top miners' },
    { metric: 'Binary auto-update success', threshold: 'updates within 5 min of release', where: 'pm2 logs · "release polling" entries' },
    { metric: 'Per-tempo incentive', threshold: 'rising or flat', where: 'btcli subnet metagraph --netuid 2 · check every ~72 min' },
  ],

  knownIssues: [
    { symptom: 'Proofs submitted but never verified', cause: 'Binary version drift after a network upgrade, or model commitment mismatch.', fix: 'Force-restart PM2 (`pm2 restart subnet-2-miner`) to pull the latest release. Confirm SHA256 matches GitHub release.' },
    { symptom: 'High proof latency, scoring at floor', cause: 'CPU undersized or thread-pinning fighting other workloads.', fix: 'Isolate the miner on its own machine, upgrade to a higher single-thread-clock CPU. zk circuits are highly serial in inner loops.' },
    { symptom: 'PM2 process keeps restarting after release update', cause: 'Atomic replacement raced PM2 keep-alive.', fix: 'Use --kill-timeout 3000 (already in the recommended command). If it persists, increase to 5000.' },
    { symptom: 'install.sh fails SHA256 check', cause: 'Stale local cache or partial download.', fix: "Re-run with `bash -x` to debug; if persistent, download from the GitHub release page manually and place at /usr/local/bin/sn2-miner." },
  ],

  notes: [
    "Subnet 2 was 'Omron' before rebranding to DSperse — older guides may use the Omron name.",
    'EZKL and TEE-backed paths exist but are not the default proving system; baseline zk proving runs on CPU.',
    "Subnet docs live at sn2-docs.inferencelabs.com — refer there for any breaking changes.",
  ],
};
