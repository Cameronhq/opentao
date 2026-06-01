import type { RichPlaybook } from '../playbook-rich';

// SN27 — Nodexo (formerly NI Compute). Operated by Neural Internet.
// Decentralized GPU compute marketplace. Miners contribute physical GPU
// capacity; validators run a Proof-of-GPU (PoG) benchmark — matrix-mult
// + Merkle-tree verification + GPU identification — and score on
// hardware quality plus actual rental utilization through nodexo.ai.

export const sn27: RichPlaybook = {
  slug: '27-nodexo',
  netuid: 27,
  name: 'Nodexo',
  category: 'compute',
  categoryLabel: 'Compute',

  blurb:
    'Decentralized GPU compute marketplace — rent miner GPUs through the Nodexo cloud. Miners host physical NVIDIA GPUs and earn on verified Proof-of-GPU benchmark + real rental utilization.',

  whatMinersDo:
    'A Nodexo miner runs `neurons/miner.py` on a Linux host with NVIDIA GPU(s) and exposes an axon endpoint. Validators dispatch Proof-of-GPU challenges (matrix-multiplication benchmark with Merkle-tree verification plus GPU identification via hashcat-style probes), and miners return signed performance results. When the Nodexo platform allocates real customers to the miner, the validator picks that up via the allocation registry and applies a utilization multiplier on top of the raw hardware score. PoG benchmarks demand ~4500+ MH/s hashrate at current difficulty.',

  verifiedAt: '2026-06-01',
  verifiedBy: '@editorial',

  emission: '— τ/day',
  burnCostFallback: '— τ',
  minerCountFallback: 0,
  slotCap: 256,

  hardware: [
    {
      role: 'GPU node',
      count: '1+',
      gpu: 'NVIDIA H100 / A100 / A6000 / A4000 / RTX 3090 / RTX 4090 (min datacenter-class)',
      vramGb: 24,
      cpuCores: 8,
      ramGb: 32,
      diskGb: 200,
      bandwidth: 'static public IP · open custom axon port + 22/tcp · 1 Gbps',
      notes: 'Ubuntu 22.04+, Python 3.10+, CUDA Toolkit 12.3, OpenCL libs, hashcat ≥ 6.2.5. Higher-end cards earn more — H100/A100 dominate top of the leaderboard.',
    },
  ],
  hardwareNote:
    'Recommended minimum hashrate for current PoG difficulty is ≥ 4500 MH/s; underperforming GPUs are still allowed to register but earn little. Real rental utilization (customers actually using your GPU via nodexo.ai) multiplies raw hardware score.',

  rentalOk: true,
  rentalUsdPerHr: { lambda: 2.49, runpod: 1.89, coreweave: 2.49 },

  repo: {
    url: 'https://github.com/neuralinternet/SN27',
    branch: 'main',
    minerEntrypoint: 'neurons/miner.py',
  },

  setupShape: 'simple-binary',
  setupOverview:
    'Install Docker, run a local subtensor lite node, install bittensor + the SN27 Compute-Subnet repo, install CUDA 12.3 + OpenCL + hashcat as miner extras, register on netuid 27, then launch `neurons/miner.py` under pm2.',

  install: [
    { step: 'Install Docker', cmd: 'curl -fsSL https://get.docker.com | sudo sh' },
    { step: 'Run local subtensor (lite node)',
      cmd: 'git clone https://github.com/opentensor/subtensor && cd subtensor && sudo ./scripts/run/subtensor.sh -e docker --network mainnet --node-type lite' },
    { step: 'Install Bittensor', cmd: '/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/opentensor/bittensor/master/scripts/install.sh)"' },
    { step: 'Create coldkey + hotkey', cmd: 'btcli w new_coldkey && btcli w new_hotkey' },
    { step: 'Clone Compute-Subnet (SN27)',
      cmd: 'git clone https://github.com/neuralinternet/SN27.git && cd SN27' },
    { step: 'Install Python deps',
      cmd: 'python3 -m pip install -r requirements.txt && python3 -m pip install -e .' },
    { step: 'Install miner extras (OpenCL + hashcat)',
      note: 'OpenCL libs via apt; hashcat v6.2.5+ for GPU identification challenges.' },
    { step: 'Install NVIDIA CUDA Toolkit 12.3',
      note: 'Set CUDA_VERSION=cuda-12.3 plus PATH and LD_LIBRARY_PATH in your shell rc.' },
    { step: 'Install PM2', cmd: 'sudo npm install pm2 -g' },
    { step: 'Open firewall ports',
      cmd: 'sudo ufw allow <axon-port>/tcp && sudo ufw allow 22/tcp' },
    { step: 'Register on SN27',
      cmd: 'btcli s register --subtensor.network finney --netuid 27 --wallet.name $WALLET --wallet.hotkey $HOTKEY' },
  ],

  runSteps: [
    { step: 'Start miner under PM2',
      cmd: `pm2 start ./neurons/miner.py --name MINER --interpreter python3 -- \\
  --netuid 27 \\
  --subtensor.network local \\
  --wallet.name $WALLET \\
  --wallet.hotkey $HOTKEY \\
  --axon.port <port> \\
  --logging.debug \\
  --miner.blacklist.force_validator_permit \\
  --auto_update yes` },
    { step: 'Watch logs', cmd: 'pm2 logs MINER' },
    { step: 'Confirm on metagraph', cmd: 'btcli subnet metagraph --netuid 27' },
  ],

  envVars: [
    { name: 'WALLET', description: 'Coldkey name (matches btcli wallet list)', required: true },
    { name: 'HOTKEY', description: 'Hotkey name on that coldkey', required: true },
    { name: 'CUDA_VERSION', description: 'CUDA toolkit version, e.g. cuda-12.3', required: true },
    { name: 'PATH', description: 'Must include /usr/local/$CUDA_VERSION/bin', required: true },
    { name: 'LD_LIBRARY_PATH', description: 'Must include /usr/local/$CUDA_VERSION/lib64', required: true },
  ],

  scoring: {
    summary:
      'Proof-of-GPU (PoG) benchmark — matrix multiplication, Merkle-tree verification, hashcat-style GPU identification — plus a real-rental-utilization multiplier sourced from the Nodexo allocation registry. Validators compute `calc_score_pog()` and write on-chain weights every tempo.',
    rule: 'High verified hardware score × actual rental utilization × uptime. Idle GPUs earn less than identical productive GPUs.',
    sourcePath: 'neuralinternet/SN27 · neurons/Validator',
    cheatPath:
      "Don't spoof GPU specs in identity strings — PoG cross-checks expected hashrate/throughput vs declared model. Don't time-share one GPU across many UIDs — concurrent validator probes saturate the card and scores collapse. Don't try CPU-only or virtualized GPUs — they fail hashcat-based identification.",
  },

  profitability: {
    estimatedDailyEmissionPerUid: 0.0,
    tokenPriceUsdFallback: 284,
    capexNote:
      'A single RTX 4090 box runs ~$1.5–2k/mo rented or ~$5k owned; H100 boxes run $4k–$8k/mo. Real rental utilization through Nodexo is the multiplier that turns the math positive — idle GPUs earn the floor.',
    notes:
      'Earnings vary widely by GPU class; H100/A100 sit at the top of the leaderboard.',
  },

  milestones: [
    { day: 'day 1',  target: 'PoG passing, UID registered', note: 'PM2 process healthy; metagraph shows your hotkey with incentive > 0 within one tempo (~72 min).' },
    { day: 'day 3',  target: 'Hardware score stable', note: 'Validators agree on your GPU class; benchmark scores plateau at the expected level for your card.' },
    { day: 'day 7',  target: 'First rental allocations', note: 'If nodexo.ai routes a customer to your GPU, utilization multiplier kicks in; if zero, double-check axon reachability + allocation-API registration.' },
    { day: 'day 14', target: 'Out of immunity, surviving', note: 'Incentive above the deregistration floor; if borderline, add GPUs or upgrade tier.' },
    { day: 'day 30', target: 'Break-even on opex', note: 'Daily emission + rental revenue ≥ host cost; top miners reach here much faster on H100 fleets.' },
  ],

  monitoring: [
    { metric: 'PoG benchmark pass rate',     threshold: '100%',          where: 'pm2 logs MINER · search "PoG" / "Merkle"' },
    { metric: 'Axon reachability',           threshold: '> 99.5%',       where: 'curl http://<miner-ip>:<axon-port>/ from outside network' },
    { metric: 'GPU utilization under load',  threshold: '> 60% when allocated', where: 'nvidia-smi · idle while allocated = something broken' },
    { metric: 'hashcat hashrate',            threshold: '≥ 4500 MH/s',   where: 'hashcat -b · run locally before registering' },
    { metric: 'Per-tempo incentive',         threshold: 'rising or flat',where: 'btcli subnet metagraph --netuid 27 · check every ~72 min' },
  ],

  knownIssues: [
    {
      symptom: 'Miner registers but PoG benchmark always fails',
      cause:   'CUDA toolkit version mismatch or hashcat < 6.2.5 — challenge protocol expects specific kernel ABI.',
      fix:     'Reinstall CUDA Toolkit 12.3 exactly, confirm `nvcc --version` and `nvidia-smi` agree on driver, upgrade hashcat to ≥ 6.2.5.',
    },
    {
      symptom: 'Validator never queries your miner',
      cause:   'Axon port closed at cloud firewall, or behind NAT without port-forward.',
      fix:     'Open the configured `--axon.port` (TCP) explicitly: `sudo ufw allow <port>/tcp`. Test from a different network with curl.',
    },
    {
      symptom: 'Hardware score lower than peer with same GPU',
      cause:   'Thermal throttling, PCIe x8 instead of x16, or shared GPU on a virtualized host.',
      fix:     'Run `nvidia-smi --query-gpu=pstate,clocks.gr,pcie.link.width.current --format=csv` under load. Move to bare-metal if virtualized.',
    },
    {
      symptom: 'Allocated to a customer but no utilization multiplier appears',
      cause:   'Nodexo allocation registry has not picked up your hotkey, or the customer container failed to launch.',
      fix:     'Confirm registration via the Nodexo console; check the allocation pod logs on your host. Reach out in the SN27 ops channel.',
    },
  ],

  notes: [
    'Repo was previously hosted at neuralinternet/compute-subnet; canonical location is now neuralinternet/SN27.',
    'A local subtensor lite node is strongly recommended — public RPC endpoints are unstable under high subnet load.',
    'Higher-tier GPUs (H100, A100, A6000) earn substantially more than consumer cards (3090/4090); plan capex accordingly.',
  ],
};
