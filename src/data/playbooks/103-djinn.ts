import type { RichPlaybook } from '../playbook-rich';

// SN103 — Djinn. Sports-betting signal marketplace. Miners notarize sportsbook
// line availability via TLSNotary so seller track records on the Base side
// are cryptographically verifiable. Whitepaper-detailed but the canonical
// public miner repo was not located via opentao search at time of writing —
// architecture below reflects the published whitepaper.

export const sn103: RichPlaybook = {
  slug: '103-djinn',
  netuid: 103,
  name: 'Djinn',
  category: 'data',
  categoryLabel: 'Data',

  blurb:
    'Sports-signal marketplace. Miners run TLSNotary against sportsbook endpoints to prove that a given line + odds were live at the moment a signal was published, then submit the notarized proof to validators.',

  whatMinersDo:
    "A Djinn miner runs TLSNotary against the sportsbook endpoints the validator schedule points at, producing TLS-attested proofs that anchor specific lines and odds to a verifiable timestamp. The miner submits these proofs to validators; the miner is not paid for predicting outcomes — that's the seller's business on the Base side — but for being the honest oracle layer that makes seller track records non-repudiable. Workload is network-bound, not GPU-bound.",

  verifiedAt: '2026-06-01',
  verifiedBy: '@editorial',

  emission: '— τ/day',
  burnCostFallback: '— τ',
  minerCountFallback: 0,
  slotCap: 256,

  hardware: [
    {
      role: 'CPU node',
      count: '1',
      cpuCores: 4,
      ramGb: 8,
      diskGb: 100,
      bandwidth: 'public IP · 100 Mbps · low latency to major sportsbook regions',
      notes: 'No GPU required. TLSNotary is CPU-light; the binding constraint is reliable, low-latency network access to sportsbook endpoints, not compute.',
    },
  ],
  hardwareNote:
    'Network quality matters more than node specs. A small VPS in a region close to the sportsbooks the validator schedule queries (typically US-East / EU-West) will beat a larger box on a noisy connection.',

  rentalOk: true,
  rentalUsdPerHr: { lambda: 0.10, runpod: 0.08, coreweave: 0.12 },

  repo: {
    url: 'https://github.com/djinn-gg',
    branch: 'main',
    extraRepos: [
      { name: 'djinn whitepaper', url: 'https://x.com/djinn_gg', purpose: '@djinn_gg posts the whitepaper + architecture on X — primary reference until a public miner repo is announced' },
    ],
  },

  setupShape: 'simple-binary',
  setupOverview:
    "Setup is light by Bittensor standards — a CPU node with a TLSNotary client, the Djinn miner binary, and wallet env vars. The interesting operational piece is keeping your network path to sportsbook endpoints clean and your TLSNotary proofs fresh enough to score.",

  install: [
    { step: 'Provision a small VPS close to target sportsbook regions',
      note: 'A 4-core / 8GB box in US-East or EU-West typically dominates a larger box in APAC for this workload.' },
    { step: 'Clone the Djinn miner repo (when published)',
      cmd:  'git clone https://github.com/djinn-gg/djinn-miner && cd djinn-miner',
      note: 'Canonical repo URL will be confirmed when Djinn publishes its public miner code.' },
    { step: 'Install Python deps in a venv',
      cmd:  'python -m venv .venv && source .venv/bin/activate && pip install -e .' },
    { step: 'Copy and edit .env',
      cmd:  'cp .env.example .env && $EDITOR .env',
      note: 'Set WALLET / HOTKEY / NETUID=103 plus the TLSNotary notary URL Djinn publishes.' },
    { step: 'Register your hotkey on SN103',
      cmd:  'btcli subnet register --netuid 103 --wallet.name $WALLET --wallet.hotkey $HOTKEY' },
  ],

  runSteps: [
    { step: 'Start the miner',
      cmd:  'python -m neurons.miner --netuid 103 --wallet.name $WALLET --wallet.hotkey $HOTKEY' },
    { step: 'Verify TLSNotary proofs submit and score',
      note: 'Logs should show: validator query received → sportsbook TLS session captured → notarized proof submitted → validator score returned.' },
    { step: 'Watch metagraph',
      cmd:  'btcli subnet metagraph --netuid 103' },
  ],

  envVars: [
    { name: 'WALLET',         description: 'Coldkey name',                                         required: true },
    { name: 'HOTKEY',         description: 'Hotkey name',                                          required: true },
    { name: 'NETUID',         description: 'Subnet UID — 103 for Djinn',                           required: true },
    { name: 'TLSNOTARY_URL',  description: "TLSNotary notary server URL published by Djinn",       required: true },
  ],

  scoring: {
    summary:
      'Validators score miners on the validity and timeliness of TLSNotary line proofs and on correct attestation of game outcomes — both externally verifiable signals where honest validators converge on the median. Miners are not paid for predicting outcomes.',
    rule:
      'Earn by producing real, fresh, non-cherry-picked proofs of real sportsbook lines at real times. Latency to the sportsbook + TLS session validity are the operational levers.',
    cheatPath:
      "Forging a TLSNotary proof of a line that didn't exist is the obvious attack — defeated by the TLS attestation tying the proof to the sportsbook's real TLS session. Subtler: cherry-picking which lines to notarize — bounded by the validator-issued query schedule. Validator collusion on outcome attestation is bounded by Yuma's stake-weighted consensus.",
  },

  profitability: {
    estimatedDailyEmissionPerUid: 0.0,
    tokenPriceUsdFallback: 284,
    capexNote:
      'Capex-light — a $20-40/mo VPS will do. Opex is dominated by network reliability and validator-side latency tuning, not hardware.',
    notes:
      'Early-launch subnet, per-UID emissions not stable enough to estimate confidently. The economics get more interesting once the Base-side seller market is live.',
  },

  milestones: [
    { day: 'day 1', target: 'First TLSNotary proof accepted by validator', note: 'Logs show a complete query → TLS capture → notarized proof → score cycle.' },
    { day: 'day 3', target: 'Proof acceptance rate > 95%',                 note: 'If rejections are common, check TLS session validity and notary server connectivity.' },
    { day: 'day 7', target: 'Out of immunity, incentive non-zero',         note: 'btcli subnet metagraph --netuid 103 shows a rising incentive.' },
    { day: 'day 14', target: 'Stable above the immunity floor',            note: 'Network path quality is the typical differentiator at this stage.' },
  ],

  monitoring: [
    { metric: 'TLSNotary proof acceptance rate', threshold: '> 95%',         where: 'Miner logs' },
    { metric: 'Proof submission latency',        threshold: '< 2 s end-to-end',where: 'Miner logs' },
    { metric: 'Sportsbook endpoint reachability', threshold: '100%',           where: 'curl-based health check from your node' },
    { metric: 'Per-tempo incentive',             threshold: 'rising or flat', where: 'btcli subnet metagraph --netuid 103' },
  ],

  knownIssues: [
    {
      symptom: 'TLSNotary proofs intermittently rejected',
      cause:   'Sportsbook endpoint changed TLS configuration, or notary server unreachable.',
      fix:     "Confirm endpoint TLS handshake with `openssl s_client -connect`, verify TLSNOTARY_URL is reachable, restart miner.",
    },
    {
      symptom: 'Proof acceptance rate fine but incentive flat',
      cause:   'Cherry-picked subset of validator queries — only easy ones notarized.',
      fix:     'Make sure your miner is responding to the full validator query schedule, not just a convenient subset. Look at top miners on taostats for the coverage profile.',
    },
  ],

  notes: [
    'Fund custody and outcome voting settle on Base (Ethereum L2). The subnet itself only handles oracle / proof work on Bittensor.',
    'Whitepaper is the primary architecture reference — re-check @djinn_gg for the canonical public miner repo URL before any capex.',
  ],
};
