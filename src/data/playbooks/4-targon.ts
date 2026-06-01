import type { RichPlaybook } from '../playbook-rich';

// SN4 — Targon (Manifold Labs). Confidential AI cloud — miners host
// OpenAI-compatible LLM inference inside Intel TDX VMs with NVIDIA Hopper /
// Blackwell GPUs (or AMD CPU enclaves). The `tvm` installer is the primary
// install path; runtime is docker-compose.

export const sn4: RichPlaybook = {
  slug: '4-targon',
  netuid: 4,
  name: 'Targon',
  category: 'llm',
  categoryLabel: 'TEE LLM inference',

  blurb:
    'Host LLM inference inside a hardware-attested TDX VM with H100/H200/B200 GPUs (or AMD CPU enclaves). Emissions are split via auctions on public demand.',

  whatMinersDo:
    "A Targon miner runs a confidential VM provisioned by the `tvm` installer (Targon VM). The VM exposes an OpenAI-compatible inference endpoint and produces a remote attestation report so the validator can prove the workload runs on real TDX hardware with a Hopper / Blackwell GPU. The validator routes both synthetic and organic traffic, scores on logprob correctness, throughput, and attestation, and miners bid into auctions where emissions are split proportionally to public demand.",

  verifiedAt: '2026-06-01',
  verifiedBy: '@editorial',

  emission: '— τ/day',
  burnCostFallback: '— τ',
  minerCountFallback: 0,
  slotCap: 256,

  hardware: [
    {
      role: 'GPU TEE node (Hopper)',
      count: '1+',
      gpu: 'NVIDIA H100 or H200 + Intel TDX (5th Gen Xeon Scalable)',
      vramGb: 80,
      cpuCores: 32,
      ramGb: 256,
      diskGb: 3000,
      bandwidth: '1 Gbps',
      notes: 'Host machine storage minimum 3 TB (installer asks for 21 TB to be safe). BIOS access required to enable TDX + confidential compute.',
    },
    {
      role: 'GPU TEE node (Blackwell)',
      count: '1+',
      gpu: 'NVIDIA B200 (multi-GPU configuration) + Intel TDX',
      vramGb: 192,
      cpuCores: 32,
      ramGb: 512,
      diskGb: 3000,
      bandwidth: '1 Gbps',
      notes: 'Requires Ubuntu 25.10 and BIOS-level TDX enablement on a 5th Gen Xeon platform.',
    },
    {
      role: 'AMD CPU enclave (no GPU)',
      count: '1+',
      cpuCores: 32,
      ramGb: 128,
      diskGb: 3000,
      notes: 'For workloads that fit inside SEV-SNP — lower emission share but cheaper hardware.',
    },
  ],
  hardwareNote:
    'BIOS access is "HIGHLY RECOMMENDED" by the repo — you will need to enable TDX/SEV and configure memory encryption.',

  rentalOk: false,
  rentalNote:
    'Rented GPU marketplaces (Runpod, Vast) generally do not expose TDX/SEV to tenants. You need bare-metal with BIOS access. Confidential cloud tiers from Azure (DCsv3/DCesv5) work in principle but are expensive.',

  repo: {
    url: 'https://github.com/manifold-inc/targon',
    branch: 'main',
    minerEntrypoint: 'docker-compose.miner.yml (after tvm installer provisions the VM)',
  },

  setupShape: 'docker-compose',
  setupOverview:
    "Two stages. (1) Provision a confidential VM with the `tvm` installer for your node type (hopper / blackwell / cpu) — this lays down the TDX/SEV VM, attestation agents, and storage. (2) Run the miner stack inside docker-compose, pointing at your `config.json` with hotkey and node bid prices.",

  install: [
    { step: 'Clone the Targon repo on the bare-metal host',
      cmd:  'git clone https://github.com/manifold-inc/targon && cd targon' },
    { step: 'Enable TDX/SEV in BIOS',
      note: 'Verify with `dmesg | grep -i tdx` (Intel) or `dmesg | grep -i sev` (AMD) after reboot.' },
    { step: 'Run the TVM installer for your hardware',
      cmd:  'sudo ./tvm/install --service-url http://tvm.targon.com \\\n  --vm-download-dir ./ --submit \\\n  --hotkey-phrase "$HOTKEY_PHRASE" \\\n  --node-type hopper \\\n  --host-machine-storage 21TB \\\n  --launch-vm',
      note: 'Swap `--node-type` to `blackwell` for B200, `cpu` for AMD enclave nodes.' },
    { step: 'Create config.json with your nodes + hotkey',
      note: 'Fields: { nodes: [{ip, price}], hotkey_phrase, ip, port, chain_endpoint, netuid: 4, min_stake }.' },
    { step: 'Register the hotkey on SN4',
      cmd:  'btcli subnet register --netuid 4 --wallet.name $WALLET --wallet.hotkey $HOTKEY' },
  ],

  runSteps: [
    { step: 'Bring up the miner stack',
      cmd:  'docker compose -f docker-compose.miner.yml up -d --build' },
    { step: 'Verify attestation succeeds',
      cmd:  'docker compose -f docker-compose.miner.yml logs -f',
      note: 'Look for a successful remote-attestation report; if it fails the validator will not route traffic.' },
    { step: 'Check inference endpoint',
      cmd:  'curl http://<miner-ip>:<port>/v1/models',
      note: 'Should return an OpenAI-compatible model list when the miner is healthy.' },
  ],

  envVars: [
    { name: 'WALLET', description: 'Coldkey name', required: true },
    { name: 'HOTKEY', description: 'Hotkey name registered on netuid 4', required: true },
    { name: 'HOTKEY_PHRASE', description: 'Mnemonic phrase passed to the tvm installer (kept inside the confidential VM)', required: true },
  ],

  scoring: {
    summary:
      "Miners host inference inside a TDX/SEV VM with GPU-level confidential compute. The validator issues seeded requests, checks logprob correctness, measures throughput and latency, and validates the remote attestation report. Emissions are split proportionally to public demand via the auctions API — each auction has max_bid, emission, and min_cluster_size parameters and miners' nodes bid in.",
    rule: "Logprob-correct responses on attested hardware, fast TPS, low latency. Failed attestation → zero score regardless of throughput.",
    sourcePath: 'manifold-inc/targon · docs/miner/miner.md + scoring source',
    cheatPath:
      "Faking attestation is the explicit thing the architecture prevents — the validator pins responses to the attestation report. Underbidding to win auctions you can't fulfil leaves you with poor logprob quality and a tanked score.",
  },

  profitability: {
    estimatedDailyEmissionPerUid: 0,
    tokenPriceUsdFallback: 284,
    capexNote:
      'Capex-heavy. H100/H200 + 5th-Gen Xeon TDX hosts run $4k–$12k/mo (rented bare-metal) or $25k–$45k to own. Blackwell B200 hosts are markedly more expensive — only run them if your auction bids are profitable at B200 hourly rates.',
    notes:
      "Targon's `targon.com` consumer side feeds organic demand; the more demand the network sells, the more attractive auction emissions are.",
  },

  milestones: [
    { day: 'day 1', target: 'TVM provisioned + attestation passing', note: 'Look for green attestation in docker-compose logs.' },
    { day: 'day 3', target: 'First auction wins', note: 'Set bid prices in `config.json` — too high and you never win, too low and you serve at a loss.' },
    { day: 'day 7', target: 'Sustained traffic + logprob score climbing', note: 'Compare against top miners on taostats — they will likely run Hopper at moderate bid prices.' },
    { day: 'day 14', target: 'Out of immunity, holding rank', note: 'Tune your node prices weekly based on auction telemetry.' },
  ],

  monitoring: [
    { metric: 'Remote attestation success rate', threshold: '100%',  where: 'docker compose logs (look for attestation report submissions)' },
    { metric: 'Inference endpoint p50 latency',  threshold: '< 200 ms', where: 'curl /v1/models or your own k6 probe' },
    { metric: 'Auction win rate',                threshold: '> 30%',  where: 'Targon dashboard / auctions API' },
    { metric: 'GPU utilization under load',      threshold: '> 60%',  where: 'nvidia-smi inside the TDX VM' },
    { metric: 'Incentive per tempo',             threshold: 'rising or flat', where: 'btcli subnet metagraph --netuid 4' },
  ],

  knownIssues: [
    {
      symptom: 'Attestation fails repeatedly',
      cause:   'TDX/SEV not enabled in BIOS or kernel modules missing.',
      fix:     'Enter BIOS, enable Intel TDX (or AMD SEV-SNP). Reboot. Verify with `dmesg | grep tdx` before re-running the tvm installer.',
    },
    {
      symptom: "Validator doesn't route any requests",
      cause:   "Inference port unreachable from outside, or `config.json` `ip` field is wrong.",
      fix:     "Open the inference port at the cloud firewall. Run `curl http://<external-ip>:<port>/v1/models` from a different network.",
    },
    {
      symptom: 'Auctions won but you cannot serve at promised TPS',
      cause:   "Node priced too aggressively for the GPU it actually has (e.g. priced like H200 with an H100).",
      fix:     'Raise the per-node `price` in `config.json` until throughput holds. Underdelivering tanks logprob scores.',
    },
    {
      symptom: 'TVM installer fails on storage check',
      cause:   "Host doesn't actually have the 21 TB the installer asks for, or filesystem is too fragmented.",
      fix:     'Provision a dedicated NVMe pool with the requested size; the installer will not fall back to a smaller footprint.',
    },
  ],

  notes: [
    'Repo: https://github.com/manifold-inc/targon. Detailed miner docs: docs/miner/miner.md.',
    'Consumer-side demand at targon.com — capacity reportedly sells out on listing; auction emissions track that demand.',
    'TVM installer can be re-run to swap node type; the VM image is rebuilt cleanly.',
    'NVIDIA Confidential Compute / PPCIE is the underlying GPU mechanism — keep firmware up to date.',
  ],
};
